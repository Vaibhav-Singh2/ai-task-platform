from __future__ import annotations

import os
import signal
import threading
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone
from typing import Any

from bson import ObjectId
from dotenv import load_dotenv
from pymongo.collection import Collection
from pymongo import ReturnDocument

from .db import MongoStore
from .processor import process_task
from .redis_queue import QueueMessage, RedisQueue

load_dotenv()


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


def parse_concurrency() -> int:
    try:
        return max(1, int(os.getenv("WORKER_CONCURRENCY", "2")))
    except ValueError:
        return 2


def parse_timeout() -> int:
    try:
        return max(1, int(os.getenv("WORKER_POLL_TIMEOUT", "5")))
    except ValueError:
        return 5


def parse_retry_attempts() -> int:
    try:
        return max(1, int(os.getenv("WORKER_RETRY_ATTEMPTS", "3")))
    except ValueError:
        return 3


class WorkerService:
    def __init__(self) -> None:
        self.mongo = MongoStore()
        self.queue = RedisQueue()
        self.stop_event = threading.Event()
        self.concurrency = parse_concurrency()
        self.timeout = parse_timeout()
        self.retry_attempts = parse_retry_attempts()
        self.tasks: Collection[dict[str, Any]] = self.mongo.tasks

    def close(self) -> None:
        self.queue.close()
        self.mongo.close()

    def install_signal_handlers(self) -> None:
        def handle_shutdown(signum: int, _frame: object) -> None:
            print(f"Received signal {signum}, shutting down worker...")
            self.stop_event.set()

        signal.signal(signal.SIGINT, handle_shutdown)
        signal.signal(signal.SIGTERM, handle_shutdown)

    def run(self) -> None:
        self.install_signal_handlers()
        print(
            f"Worker started with concurrency={self.concurrency}, queue={self.queue.queue_name}, timeout={self.timeout}"
        )

        with ThreadPoolExecutor(max_workers=self.concurrency) as executor:
            futures = [executor.submit(self.consume_loop, worker_id) for worker_id in range(self.concurrency)]
            for future in futures:
                future.result()

    def consume_loop(self, worker_id: int) -> None:
        while not self.stop_event.is_set():
            try:
                message = self.queue.pop(self.timeout)
                if message is None:
                    continue

                self.process_message(worker_id, message)
            except Exception as exc:  # noqa: BLE001
                print(f"Worker {worker_id} error: {exc}")

    def process_message(self, worker_id: int, message: QueueMessage) -> None:
        print(f"Worker {worker_id} picked task {message.task_id}")
        task_id = self.resolve_task_id(message.task_id)

        if task_id is None:
            print(f"Skipping invalid task id: {message.task_id}")
            return

        self.set_running(task_id)

        attempt = 0
        while attempt < self.retry_attempts:
            attempt += 1
            try:
                processed = process_task(message.operation, message.input_text)
                self.mark_success(task_id, processed.result, processed.logs)
                print(f"Task {message.task_id} completed successfully")
                return
            except Exception as exc:  # noqa: BLE001
                last_error = str(exc)
                self.append_log(
                    task_id,
                    {
                        "level": "error",
                        "message": f"Attempt {attempt} failed: {last_error}",
                        "at": utc_now(),
                    },
                )
                if attempt >= self.retry_attempts:
                    self.mark_failed(task_id, last_error)
                    self.queue.push_dlq(message, last_error)
                    print(f"Task {message.task_id} failed permanently, pushed to DLQ: {last_error}")
                    return

    def resolve_task_id(self, task_id: str) -> ObjectId | str | None:
        try:
            return ObjectId(task_id)
        except Exception:
            return task_id

    def set_running(self, task_id: ObjectId | str) -> None:
        self.tasks.update_one(
            {"_id": task_id},
            {
                "$set": {
                    "status": "running",
                    "updatedAt": utc_now(),
                },
                "$push": {
                    "logs": {
                        "level": "info",
                        "message": "Task moved to running state",
                        "at": utc_now(),
                    }
                },
            },
        )
        self.queue.publish_update(str(task_id), "running")

    def mark_success(
        self,
        task_id: ObjectId | str,
        result: str,
        logs: list[dict[str, object]],
    ) -> None:
        self.tasks.update_one(
            {"_id": task_id},
            {
                "$set": {
                    "status": "success",
                    "result": result,
                    "updatedAt": utc_now(),
                },
                "$push": {"logs": {"$each": logs}},
            },
        )
        self.queue.publish_update(str(task_id), "success")

    def mark_failed(self, task_id: ObjectId | str, error_message: str) -> None:
        self.tasks.update_one(
            {"_id": task_id},
            {
                "$set": {
                    "status": "failed",
                    "updatedAt": utc_now(),
                },
                "$push": {
                    "logs": {
                        "level": "error",
                        "message": error_message,
                        "at": utc_now(),
                    }
                },
            },
        )
        self.queue.publish_update(str(task_id), "failed")

    def append_log(self, task_id: ObjectId | str, log_entry: dict[str, object]) -> None:
        self.tasks.update_one(
            {"_id": task_id},
            {"$push": {"logs": log_entry}, "$set": {"updatedAt": utc_now()}},
        )


def main() -> None:
    service = WorkerService()
    try:
        service.run()
    finally:
        service.close()


if __name__ == "__main__":
    main()
