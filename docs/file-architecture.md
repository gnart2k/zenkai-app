# Overall File Architecture for Zenkai

This document outlines the standard file and directory structure for the Zenkai application. The goal is to create a scalable and maintainable codebase by organizing files based on their **feature** or **domain**, rather than their type.

This feature-based approach ensures that all related code (UI, logic, types, etc.) is co-located, making it easier to develop, update, and debug individual parts of the application.

## 📂 Root Directory Structure

The root contains top-level configuration and the main source code directories.

```
.
├── app/                          # Next.js App Router & Routes
├── components/                   # Shared & Feature-specific UI Components
├── lib/                          # Core Infrastructure & Feature Logic
├── public/                       # Static assets (images, fonts, etc.)
├── docs/                         # Project documentation
├── drizzle/                      # Drizzle ORM migration files
├── .env.example                  # Environment variable template
├── middleware.ts                 # Next.js Middleware (e.g., for authentication)
├── next.config.mjs               # Next.js configuration
└── package.json
```

## `app/` Directory (Routing)

This directory defines the application's routes. The folder structure maps directly to URL paths. The actual UI and logic for these pages are composed from components and functions imported from `components/` and `lib/`.

```
app/
├── (auth)/                         # Route Group for auth pages (e.g., /login)
│   └── login/page.tsx
├── (main)/                         # Route Group for main application (job seeker, HR)
│   ├── layout.tsx                  # Shared layout for the main app
│   ├── dashboard/page.tsx          # URL: /dashboard
│   ├── interview/page.tsx          # URL: /interview
│   └── hr/
│       ├── dashboard/page.tsx      # URL: /hr/dashboard
│       └── jobs/page.tsx           # URL: /hr/jobs
├── api/                            # API routes for webhooks and external services
│   └── stripe/webhook/route.ts
├── layout.tsx                      # Root layout
└── page.tsx                        # Public landing page
```

## `components/` Directory (UI Components)

This directory holds all React components, organized by their scope and feature.

```
components/
├── ui/                             # Generic, reusable UI primitives (e.g., Button, Card from shadcn/ui).
├── shared/                         # Components shared across multiple features (e.g., MainLayout, PageHeader).
└── features/                       # Feature-specific components.
    ├── auth/                       # Components for authentication (e.g., LoginForm, SignupForm).
    ├── hr-dashboard/               # Components for the HR dashboard feature.
    └── interview-practice/         # Components for the interview practice feature.
```

## `lib/` Directory (Core Logic)

This is the heart of the application, containing all non-UI code. It is divided into **Core Infrastructure** and **Feature-Specific Logic**.

```
lib/
├── core/                           # --- Core Infrastructure ---
│   ├── auth/                       # Authentication setup (NextAuth.js config, session management).
│   ├── db/                         # Database setup (Drizzle ORM client, schema).
│   ├── config.ts                   # App-wide configuration and constants.
│   └── types/                      # Global TypeScript types (e.g., User, Team).
│
├── features/                       # --- Feature-Specific Logic ---
│   ├── auth/                       # Logic for the authentication feature.
│   │   ├── actions.ts              # Server Actions (e.g., login, logout).
│   │   └── validators.ts           # Zod schemas for validation.
│   ├── hr/                         # Logic for all HR-related features.
│   │   ├── actions.ts              # Server Actions (e.g., createJob, updateCandidate).
│   │   ├── types.ts                # Types specific to the HR domain.
│   │   └── validators.ts           # Zod schemas for HR forms.
│   └── payments/                   # Logic for Stripe payments.
│       ├── api.ts                  # Functions for interacting with the Stripe API.
│       └── webhooks.ts             # Logic for handling Stripe webhooks.
│
└── utils.ts                        # Truly global, generic utility functions (e.g., cn, formatCurrency).
```

## ✨ How to Add a New Feature

This architecture makes adding new features straightforward. For example, to add a new **"Analytics"** feature for HR users:

1.  **Create the Route**: Add a new page at `app/(main)/hr/analytics/page.tsx`.
2.  **Create UI Components**: Add a new folder `components/features/hr-analytics/`. Place components like `Chart.tsx` and `StatCard.tsx` inside.
3.  **Add Feature Logic**: Add a new folder `lib/features/analytics/`. Place files like `actions.ts` (to fetch data) and `types.ts` inside.

This pattern keeps the feature's code self-contained and easy to manage.
