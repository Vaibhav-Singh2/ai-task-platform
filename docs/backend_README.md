# Backend Service - README

## Overview

This is the backend service for the AI Task Processing Platform built
using Node.js and Express. It handles authentication, task management,
and communication with Redis and MongoDB.

## Tech Stack

-   Node.js
-   Express.js
-   MongoDB (Mongoose)
-   Redis (Queue)
-   JWT Authentication

## Features

-   User Registration & Login
-   JWT-based Authentication
-   Create and Manage Tasks
-   Push Tasks to Redis Queue
-   Track Task Status
-   View Logs and Results

## Folder Structure

    backend/
    ├── src/
    │   ├── controllers/
    │   ├── routes/
    │   ├── models/
    │   ├── middlewares/
    │   ├── services/
    │   └── app.js
    ├── Dockerfile
    ├── package.json
    └── README.md

## API Endpoints

### Auth

-   POST /api/auth/register
-   POST /api/auth/login

### Tasks

-   POST /api/tasks
-   GET /api/tasks
-   GET /api/tasks/:id

## Authentication

-   JWT token required for protected routes
-   Token passed in Authorization header: Bearer `<token>`{=html}

## Middleware

-   Helmet for security
-   Rate limiting
-   Error handling middleware

## Environment Variables

    PORT=5000
    MONGO_URI=your_mongo_uri
    REDIS_URL=your_redis_url
    JWT_SECRET=your_secret

## Running Locally

    npm install
    npm run dev

## Docker

    docker build -t backend .
    docker run -p 5000:5000 backend

## Notes

-   Ensure MongoDB and Redis are running
-   Use .env file for configuration
