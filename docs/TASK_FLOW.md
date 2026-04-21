# Task Flow - AI Task Processing Platform

## Overview

This document explains the complete lifecycle of a task from creation to
completion, including interaction between services.

------------------------------------------------------------------------

## High-Level Flow

User → Frontend → Backend → Redis Queue → Worker → MongoDB → Frontend

------------------------------------------------------------------------

## Step-by-Step Flow

### 1. User Action

-   User logs into the platform
-   Navigates to "Create Task"
-   Enters:
    -   Title
    -   Input text
    -   Operation (uppercase, lowercase, reverse, word count)
-   Clicks "Run Task"

------------------------------------------------------------------------

### 2. Backend Processing

-   Backend receives request
-   Validates input
-   Creates task record in MongoDB:
    -   status: `pending`
    -   stores input, operation, userId
-   Pushes job to Redis queue

------------------------------------------------------------------------

### 3. Queue Handling (Redis)

-   Task is stored in queue (FIFO)
-   Worker continuously listens to queue

------------------------------------------------------------------------

### 4. Worker Processing

-   Worker pulls job from queue
-   Updates task status to `running`
-   Executes operation:
    -   uppercase → convert to uppercase
    -   lowercase → convert to lowercase
    -   reverse → reverse string
    -   word_count → count words

------------------------------------------------------------------------

### 5. Result Storage

-   Worker stores:
    -   result
    -   logs
-   Updates task status:
    -   `success` (if completed)
    -   `failed` (if error occurs)

------------------------------------------------------------------------

### 6. Frontend Update

-   Frontend polls API or uses real-time updates
-   Displays:
    -   task status
    -   result
    -   logs

------------------------------------------------------------------------

## Status Lifecycle

    pending → running → success / failed

------------------------------------------------------------------------

## Error Handling Flow

-   If worker fails:
    -   status set to `failed`
    -   error logged in database
-   Optional retry mechanism can reprocess task

------------------------------------------------------------------------

## Scaling Behavior

-   Multiple workers can process tasks concurrently
-   Queue ensures load distribution
-   System remains stable under high traffic

------------------------------------------------------------------------

## Key Benefits

-   Asynchronous processing
-   Scalable architecture
-   Fault-tolerant design
-   Clear task tracking

------------------------------------------------------------------------

## Notes

-   Redis acts as buffer between backend and worker
-   MongoDB stores persistent state
