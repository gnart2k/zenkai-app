# Agent Development Guide for Zenkai

This guide helps agentic coding agents understand the conventions, commands, and patterns used in this Next.js SaaS application.

## Essential Commands

### Development Commands
- `pnpm dev` - Start development server with Turbopack
- `pnpm build` - Build production application  
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint for code quality checks

### Database Commands
- `pnpm db:setup` - Create .env file and configure database
- `pnpm db:generate` - Generate Drizzle migrations
- `pnpm db:migrate` - Run database migrations
- `pnpm db:seed` - Seed database with test data (test@test.com / admin123)
- `pnpm db:studio` - Open Drizzle Studio for database management

### Testing
No testing framework is currently configured. Add test files using your preferred framework (Jest, Vitest, etc.).

## Tech Stack & Architecture

### Core Technologies
- **Framework**: Next.js 15 with App Router
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: JWT-based with HTTP-only cookies
- **Payments**: Stripe integration
- **Styling**: Tailwind CSS 4 with shadcn/ui components
- **State Management**: SWR for client-side fetching

### Key Architecture Patterns
- **Server Actions**: Form handling and data mutations
- **Middleware**: Route protection and authentication
- **Database**: Soft deletes with timestamps
- **Logging**: Activity logging for audit trails
- **Role-based Access**: Owner/Member roles

## Code Style Guidelines

### File Organization
```
app/                    # Next.js App Router
├── (dashboard)/       # Authenticated routes group
├── (login)/           # Authentication routes
├── api/               # API routes
lib/                   # Utility libraries
├── auth/             # Authentication logic
├── db/               # Database configuration
└── payments/         # Stripe integration
components/
├── ui/               # Reusable shadcn/ui components
```

### Import Conventions
```typescript
// External libraries first
import { z } from 'zod';
import { and, eq } from 'drizzle-orm';

// Internal imports with @ alias
import { db } from '@/lib/db/drizzle';
import { User, users } from '@/lib/db/schema';
import { Button } from '@/components/ui/button';
```

### TypeScript Patterns
- Use strict typing - all interfaces/types properly defined
- Infer types from database schema: `typeof users.$inferSelect`
- Use Zod for runtime validation and type inference
- Server Actions use `'use server'` directive

### Component Patterns
```typescript
// shadcn/ui component structure
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const componentVariants = cva("base-classes", {
  variants: {
    variant: { /* ... */ },
    size: { /* ... */ }
  },
  defaultVariants: {
    variant: "default",
    size: "default"
  }
});

export function Component({ className, variant, size, ...props }) {
  return (
    <div className={cn(componentVariants({ variant, size, className }))} {...props}>
      {children}
    </div>
  );
}
```

### Database Patterns
```typescript
// Query patterns
const user = await db
  .select()
  .from(users)
  .where(eq(users.email, email))
  .limit(1);

// Insert patterns
const [newUser] = await db.insert(users).values(userData).returning();

// Update with soft delete pattern
await db
  .update(users)
  .set({ deletedAt: sql`CURRENT_TIMESTAMP` })
  .where(eq(users.id, userId));
```

### Server Actions Pattern
```typescript
'use server';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export const action = validatedAction(schema, async (data, formData) => {
  // Validation and business logic
  // Return success/error objects
  return { success: 'Operation completed' };
});
```

### Error Handling
- Server Actions return error objects: `{ error: 'message', field1, field2 }`
- Use try-catch for external API calls
- Database operations handle errors gracefully
- User-facing messages are user-friendly

### Styling Conventions
- Use Tailwind classes for all styling
- shadcn/ui components for consistent UI
- Responsive design with mobile-first approach
- Dark mode support with `dark:` prefixes
- Use `cn()` utility for class merging

### Naming Conventions
- Files: PascalCase for components (Button.tsx), camelCase for utilities
- Database: snake_case for columns, PascalCase for tables
- Functions: camelCase, descriptive verbs (getUser, createTeam)
- Constants: UPPER_SNAKE_CASE for enums and constants
- Components: PascalCase, descriptive nouns (UserMenu, PricingPage)

### Security Practices
- Never expose secrets or API keys
- Use Zod validation for all user inputs
- Implement rate limiting with Upstash Redis
- JWT tokens stored in HTTP-only cookies
- Soft deletes instead of hard deletes
- Activity logging for audit trails

### Performance Considerations
- Use SWR for client-side data fetching
- Implement proper loading states
- Optimize database queries with proper indexes
- Use Next.js Image component for images
- Leverage caching strategies where appropriate

## Important Notes

- This project uses pnpm as package manager
- Database migrations must be run in order
- All API routes should return JSON responses
- Components use modern React patterns (hooks, functional components)
- Internationalization support via next-intl
- Stripe webhook endpoint: `/api/stripe/webhook`

## Environment Variables Required

- `POSTGRES_URL` - Database connection string
- `AUTH_SECRET` - JWT secret key
- `STRIPE_SECRET_KEY` - Stripe API secret
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook secret
- `NEXTAUTH_URL` - Application URL
- `BASE_URL` - Application base URL

## Database Schema Key Points

- Users table with soft delete (deletedAt column)
- Teams table with Stripe integration fields
- Team members for many-to-many relationships
- Activity logs for audit trails
- Invitations system for team collaboration