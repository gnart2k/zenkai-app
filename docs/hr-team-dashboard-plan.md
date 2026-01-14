# HR Team Dashboard Implementation Plan

## 🎯 Objective
The primary and overriding objective of this plan is to design and implement a rich, data-driven HR dashboard. This dashboard will serve as the central command center for the entire hiring process.

## 🔑 Key Features

### Main Dashboard Components
- **At-a-Glance Metrics**: KPIs like "Active Jobs", "Total Candidates", etc.
- **Active Jobs Pipeline**: A view of current job postings with candidate distribution charts.
- **Recent Activity Feed**: A real-time log of important events.
- **Tasks & Reminders (Action Center)**: A "To-Do" list for HR managers.
- **Quick Actions**: Buttons for common tasks like "Create a New Job".

### Core Workflow Features
- Job Posting Management
- Candidate Management
- Application Tracking
- AI-Powered Evaluation

---

## 🏗️ Architectural Approach

### Frontend
- **Route Structure**: HR-specific routes will be nested under a dedicated `/hr` path to prevent URL conflicts with job-seeker routes.
- **UI Components**: We will use **shadcn/ui** and **Tailwind CSS**.

### Backend
- **Server Actions**: All mutations and data fetching will be handled via Next.js Server Actions.
- **Database**: We will use PostgreSQL with Drizzle ORM.
- **Authentication**: JWT-based authentication with role-based checks for the `/hr` routes.

---

## 📂 File Architecture

The overall file architecture for the Zenkai application is defined in a separate, dedicated document to ensure a single source of truth for the entire project. This structure covers the organization of routes, components, and core logic for all features, including the HR dashboard.

For detailed information, please refer to the [**Overall File Architecture document**](./file-architecture.md).

---

## 🗄️ Proposed Database Schema
New tables to be added to `lib/db/schema.ts`:

```typescript
// lib/db/schema.ts
import { pgTable, serial, text, timestamp, boolean, jsonb, integer } from 'drizzle-orm/pg-core';
import { teams } from './teams';
import { users } from './users';

export const jobPostings = pgTable('job_postings', { /* ... */ });
export const candidates = pgTable('candidates', { /* ... */ });
export const applications = pgTable('applications', { /* ... */ });
```

---

## 🗺️ Implementation Roadmap

### Phase 1: The Dashboard Shell & Core Data
-   **Task**: Implement all database schemas (`jobPostings`, `candidates`, `applications`).
-   **Task**: Create placeholder Server Actions to generate mock data.
-   **Task**: Build the complete, static UI for the main HR dashboard at `/hr/dashboard`.

### Phase 2: Wiring Up the Dashboard - Job Management
-   **Task**: Implement real Server Actions for job postings.
-   **Task**: Build the "Create New Job" form and the job list page under `/hr/jobs`.
-   **Task**: Connect the dashboard components to real `jobPostings` data.

### Phase 3: Populating the Dashboard - Candidates & Applications
-   **Task**: Implement the application process and integrate interview results.
-   **Task**: Connect the rest of the dashboard components to real application and candidate data.

---

## ✅ Success Metrics
- **Time to Hire**: Reduction in the average time from job posting to hiring a candidate.
- **Efficiency**: Number of candidates processed per HR manager.
- **User Satisfaction**: Feedback from the HR team on the dashboard's usability and effectiveness.
