# Docker Setup - AI Task Processing Platform

## Overview

This document explains how Docker is used to containerize the frontend,
backend, and worker services for consistent development and deployment.

------------------------------------------------------------------------

## Services

-   frontend (React / Next.js)
-   backend (Node.js + Express)
-   worker (Python)
-   redis
-   mongodb

------------------------------------------------------------------------

## Dockerfiles

### 1. Frontend Dockerfile

-   Multi-stage build
-   Build React app
-   Serve using lightweight server (nginx or node)

### 2. Backend Dockerfile

-   Use Node base image
-   Install dependencies
-   Run server

### 3. Worker Dockerfile

-   Use Python base image
-   Install requirements
-   Run worker process

------------------------------------------------------------------------

## Best Practices Used

-   Multi-stage builds (smaller image size)
-   Non-root user inside containers
-   .dockerignore for optimization
-   Environment variables for configs

------------------------------------------------------------------------

## docker-compose (Local Development)

### Services Included

-   frontend
-   backend
-   worker
-   redis
-   mongodb

### Example Command

    docker-compose up --build

------------------------------------------------------------------------

## Ports

-   Frontend: 3000
-   Backend: 5000
-   Redis: 6379
-   MongoDB: 27017

------------------------------------------------------------------------

## Networking

-   All services run in same Docker network
-   Backend communicates with Redis & MongoDB via service names

------------------------------------------------------------------------

## Environment Variables

Use `.env` file for: - MONGO_URI - REDIS_URL - JWT_SECRET

------------------------------------------------------------------------

## Volume Management

-   MongoDB data persisted using volumes
-   Prevents data loss on container restart

------------------------------------------------------------------------

## Production Notes

-   Use optimized images
-   Avoid dev dependencies
-   Use container registry (Docker Hub)
-   Tag images properly

------------------------------------------------------------------------

## Commands Summary

### Build Images

    docker build -t frontend ./frontend
    docker build -t backend ./backend
    docker build -t worker ./worker

### Run Compose

    docker-compose up

------------------------------------------------------------------------

## Notes

-   Ensure Docker & Docker Compose installed
-   Use docker logs for debugging
