# API Documentation - AI Task Processing Platform

## Overview

This document provides details of all backend APIs including
authentication and task management.

Base URL: http://localhost:5000/api

------------------------------------------------------------------------

## Authentication APIs

### 1. Register User

POST /auth/register

#### Request Body

    {
      "name": "Vaibhav",
      "email": "vaibhav@example.com",
      "password": "123456"
    }

#### Response

    {
      "message": "User registered successfully"
    }

------------------------------------------------------------------------

### 2. Login User

POST /auth/login

#### Request Body

    {
      "email": "vaibhav@example.com",
      "password": "123456"
    }

#### Response

    {
      "token": "jwt_token_here"
    }

------------------------------------------------------------------------

## Task APIs

### 3. Create Task

POST /tasks

#### Headers

Authorization: Bearer `<token>`{=html}

#### Request Body

    {
      "title": "Convert text",
      "operation": "uppercase",
      "input": "hello world"
    }

#### Response

    {
      "taskId": "123",
      "status": "pending"
    }

------------------------------------------------------------------------

### 4. Get All Tasks

GET /tasks

#### Headers

Authorization: Bearer `<token>`{=html}

#### Response

    [
      {
        "taskId": "123",
        "title": "Convert text",
        "status": "success",
        "operation": "uppercase",
        "createdAt": "2026-04-21"
      }
    ]

------------------------------------------------------------------------

### 5. Get Task By ID

GET /tasks/:id

#### Headers

Authorization: Bearer `<token>`{=html}

#### Response

    {
      "taskId": "123",
      "title": "Convert text",
      "status": "success",
      "operation": "uppercase",
      "input": "hello world",
      "result": "HELLO WORLD",
      "logs": "Processed successfully",
      "createdAt": "2026-04-21"
    }

------------------------------------------------------------------------

## Task Status Values

  Status    Description
  --------- ------------------------
  pending   Task created
  running   Worker processing
  success   Completed successfully
  failed    Error occurred

------------------------------------------------------------------------

## Error Responses

### Example

    {
      "error": "Unauthorized"
    }

------------------------------------------------------------------------

## Notes

-   All task routes require authentication
-   Token must be passed in Authorization header
-   Responses are in JSON format
