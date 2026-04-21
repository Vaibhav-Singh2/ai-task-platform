# Worker Service - README

## Overview

The Worker Service is a Python-based background processor responsible
for executing tasks asynchronously from the Redis queue. It ensures
tasks are processed reliably and updates their status in MongoDB.

## Tech Stack

-   Python
-   Redis (Queue)
-   MongoDB (via PyMongo)
-   Docker

------------------------------------------------------------------------

## Responsibilities

-   Consume tasks from Redis queue
-   Update task status: pending → running → success/failed
-   Perform text operations:
    -   Uppercase
    -   Lowercase
    -   Reverse string
    -   Word count
-   Store results and logs in MongoDB

------------------------------------------------------------------------

## Task Lifecycle

1.  Backend creates task with status `pending`
2.  Task pushed to Redis queue
3.  Worker pulls task
4.  Status updated to `running`
5.  Process task
6.  Save result + logs
7.  Final status: `success` or `failed`

------------------------------------------------------------------------

## Supported Operations

  Operation    Description
  ------------ ---------------------------
  uppercase    Convert text to uppercase
  lowercase    Convert text to lowercase
  reverse      Reverse the string
  word_count   Count number of words

------------------------------------------------------------------------

## Folder Structure

    worker/
    ├── app/
    │   ├── worker.py
    │   ├── queue.py
    │   ├── processor.py
    │   └── db.py
    ├── Dockerfile
    ├── requirements.txt
    └── README.md

------------------------------------------------------------------------

## Environment Variables

    REDIS_URL=redis://localhost:6379
    MONGO_URI=mongodb://localhost:27017/tasks
    QUEUE_NAME=task_queue
    WORKER_CONCURRENCY=2

------------------------------------------------------------------------

## Running Locally

### Install dependencies

    pip install -r requirements.txt

### Start worker

    python app/worker.py

------------------------------------------------------------------------

## Redis Queue Flow

-   Queue name: `task_queue`
-   Job format (JSON):

```{=html}
<!-- -->
```
    {
      "taskId": "123",
      "operation": "uppercase",
      "input": "hello world"
    }

------------------------------------------------------------------------

## Error Handling

-   Try-catch around processing
-   Update task status to `failed` on exception
-   Log error message in DB
-   Retry logic (optional enhancement)

------------------------------------------------------------------------

## Scaling Strategy

-   Worker is stateless → can scale horizontally
-   Increase replicas in Kubernetes
-   Use concurrency inside worker for parallel jobs

------------------------------------------------------------------------

## Logging

-   Store logs in MongoDB
-   Include:
    -   Start time
    -   End time
    -   Errors (if any)
    -   Output

------------------------------------------------------------------------

## Docker

### Build

    docker build -t worker .

### Run

    docker run worker

------------------------------------------------------------------------

## Notes

-   Ensure Redis is running before starting worker
-   Ensure MongoDB is accessible
-   Worker should be monitored in production
