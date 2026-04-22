# Worker Service

Python worker that consumes tasks from Redis, processes text operations using OpenAI's API, and updates task state in MongoDB.

## Environment

- REDIS_URL=redis://localhost:6379
- MONGO_URI=mongodb://localhost:27017/tasks
- QUEUE_NAME=task_queue
- WORKER_CONCURRENCY=2
- WORKER_POLL_TIMEOUT=5
- WORKER_RETRY_ATTEMPTS=3
- OPENAI_API_KEY=sk-proj-...

## Run Locally

```bash
pip install -r requirements.txt
python app/worker.py
```

## Queue Message

```json
{
  "taskId": "123",
  "operation": "uppercase",
  "input": "hello world"
}
```
