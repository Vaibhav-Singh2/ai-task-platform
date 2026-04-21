# Frontend (UI/UX Spec) - README

## Overview

This document defines the UI/UX requirements for the AI Task Processing
Platform frontend. It is structured so tools like Stitch can generate
pages and components automatically.

## Tech Preference

-   Framework: React / Next.js
-   Styling: Tailwind CSS
-   Design: Clean, minimal, modern SaaS dashboard

------------------------------------------------------------------------

## Pages & Screens

### 1. Authentication Pages

#### Login Page

-   Fields:
    -   Email
    -   Password
-   Buttons:
    -   Login
-   Links:
    -   Go to Register

#### Register Page

-   Fields:
    -   Name
    -   Email
    -   Password
-   Button:
    -   Register

------------------------------------------------------------------------

### 2. Dashboard Page

#### Layout

-   Sidebar (left)
-   Main content (right)

#### Sidebar Items

-   Dashboard
-   My Tasks
-   Create Task
-   Logout

#### Dashboard Content

-   Welcome message (User name)
-   Stats cards:
    -   Total Tasks
    -   Running Tasks
    -   Completed Tasks
    -   Failed Tasks

------------------------------------------------------------------------

### 3. Create Task Page

#### Form

-   Task Title (input)
-   Input Text (textarea)
-   Operation (dropdown):
    -   Uppercase
    -   Lowercase
    -   Reverse
    -   Word Count

#### Button

-   Run Task

------------------------------------------------------------------------

### 4. Task List Page

#### Table

Columns: - Task Title - Operation - Status (badge:
pending/running/success/failed) - Created At - Action (View)

#### Features

-   Filter by status
-   Search by title

------------------------------------------------------------------------

### 5. Task Details Page

#### Sections

-   Task Info
-   Status Timeline
-   Logs (scrollable)
-   Result output

------------------------------------------------------------------------

## Components

### Reusable Components

-   Button
-   Input
-   Textarea
-   Dropdown
-   Card
-   Badge (status colors)
-   Table
-   Modal (optional)

------------------------------------------------------------------------

## Design Guidelines

### Colors

-   Primary: Blue
-   Success: Green
-   Error: Red
-   Warning: Yellow
-   Background: Light gray / white

### UX Rules

-   Show loader when task is running
-   Real-time status updates (polling or websocket)
-   Clear success/error feedback

------------------------------------------------------------------------

## API Integration (Expected)

### Auth

-   POST /api/auth/register
-   POST /api/auth/login

### Tasks

-   POST /api/tasks
-   GET /api/tasks
-   GET /api/tasks/:id

------------------------------------------------------------------------

## Notes for UI Generator (Important)

-   Generate responsive design (mobile + desktop)
-   Use clean spacing and card-based layout
-   Prioritize readability and simplicity
-   Use modern dashboard style (similar to admin panels)

------------------------------------------------------------------------

## Goal

Generate a complete SaaS-style dashboard UI for task management with
clean UX and reusable components.
