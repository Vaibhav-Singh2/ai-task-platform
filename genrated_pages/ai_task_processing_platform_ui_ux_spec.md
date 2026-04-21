# Frontend (UI/UX Spec) - README

## Overview
This document defines the UI/UX requirements for the AI Task Processing Platform frontend.

## Tech Preference
- Framework: React / Next.js
- Styling: Tailwind CSS
- Design: Clean, minimal, modern SaaS dashboard

## Pages & Screens
### 1. Authentication Pages
#### Login Page
- Fields: Email, Password
- Buttons: Login
- Links: Go to Register

#### Register Page
- Fields: Name, Email, Password
- Button: Register

### 2. Dashboard Page
#### Layout
- Sidebar (left), Main content (right)
#### Sidebar Items
- Dashboard, My Tasks, Create Task, Logout
#### Dashboard Content
- Welcome message, Stats cards (Total, Running, Completed, Failed)

### 3. Create Task Page
#### Form
- Task Title, Input Text (textarea), Operation (dropdown: Uppercase, Lowercase, Reverse, Word Count)
#### Button
- Run Task

### 4. Task List Page
#### Table
- Columns: Task Title, Operation, Status, Created At, Action (View)
#### Features
- Filter by status, Search by title

### 5. Task Details Page
#### Sections
- Task Info, Status Timeline, Logs (scrollable), Result output

## Design Guidelines
### Colors
- Primary: Blue, Success: Green, Error: Red, Warning: Yellow
- Background: Light gray / white
### UX Rules
- Show loader when task is running, Real-time status updates, Clear feedback

## API Integration
- Auth: /api/auth/register, /api/auth/login
- Tasks: /api/tasks (POST/GET), /api/tasks/:id (GET)