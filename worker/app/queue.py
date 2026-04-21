from __future__ import annotations

import json
import os
from dataclasses import dataclass
from typing import Any

import redis
from dotenv import load_dotenv

load_dotenv()


@dataclass(frozen=True)
class QueueMessage:
    task_id: str
    operation: str
    input_text: str


class RedisQueue:
    def __init__(self) -> None:
        redis_url = os.getenv("REDIS_URL")
        if not redis_url:
            raise RuntimeError("REDIS_URL is required")

        self.queue_name = os.getenv("QUEUE_NAME", "task_queue")
        self.client = redis.Redis.from_url(redis_url, decode_responses=True)

    def close(self) -> None:
        self.client.close()

    def pop(self, timeout: int) -> QueueMessage | None:
        item = self.client.blpop(self.queue_name, timeout=timeout)
        if not item:
            return None

        _, payload = item
        data: dict[str, Any] = json.loads(payload)

        task_id = str(data.get("taskId", "")).strip()
        operation = str(data.get("operation", "")).strip()
        input_text = str(data.get("input", ""))

        if not task_id or not operation:
            raise ValueError("Invalid queue payload: taskId and operation are required")

        return QueueMessage(task_id=task_id, operation=operation, input_text=input_text)
