# Architecture & Technical Decisions

This document records key technical decisions and deviations from the original plan.

## Phase 0: Setup

### Decision Log

**Date**: October 14, 2026

#### 1. ORM Choice: Drizzle

- **Decision**: Use Drizzle ORM instead of Prisma
- **Rationale**:
  - Lighter weight and better performance
  - Better TypeScript inference
  - Works seamlessly with Supabase/PostgreSQL
  - Simpler migration model
- **Trade-off**: Less mature ecosystem than Prisma, but sufficient for our needs

#### 2. Payment Provider: Stripe

- **Decision**: Use Stripe for payments
- **Rationale**:
  - Most widely documented and supported
  - Excellent developer experience
  - Strong ecosystem of tools and integrations
  - User already confirmed this choice
- **Alternative Considered**: Lemon Squeezy/Paddle (better tax handling but less flexible)

#### 3. Node.js Version Compatibility

- **Issue**: Initial dependency conflicts with @types/node versions
- **Resolution**: Upgraded to @types/node@^26 to match Vitest 5.x requirements
- **Impact**: No functional impact, ensures compatibility with latest testing tools

#### 4. Database Schema Design

- **Decision**: Store resume content as single JSONB column with Zod validation
- **Rationale**:
  - Flexible for template rendering
  - Easier to version and migrate content schema
  - Simplifies drag-and-drop reordering (array order = display order)
  - Better for AI operations (can work with entire resume at once)
- **Trade-off**: Less queryable than normalized tables, but resumes are small and user-scoped

#### 5. Testing Setup

- **Decision**: Vitest for unit tests, Playwright for E2E
- **Rationale**:
  - Vitest is faster and has better DX than Jest
  - Playwright is industry standard for E2E and needed for PDF rendering anyway
  - Both are actively maintained and well-documented

#### 6. Tailwind CSS Version

- **Note**: Project initialized with Tailwind v4 (latest)
- **Consideration**: v4 has some breaking changes from v3
  - New configuration format
  - CSS-first configuration
  - Breaking changes in some utilities
- **Action**: Will follow v4 conventions throughout the project

#### 7. Project Structure

- **Decision**: Keep flat structure with logical grouping
  - `/app` - Next.js pages and API routes
  - `/components` - Reusable React components
  - `/db` - Database schema and client
  - `/lib` - Utilities and helpers
  - `/types` - Shared TypeScript types
  - `/e2e` - End-to-end tests
- **Rationale**: Clear separation of concerns, easy to navigate

#### 8. Environment Variables

- **Decision**: Use `.env.local` for development (not `.env`)
- **Rationale**: Next.js convention, `.env.local` is gitignored by default
- **Pattern**: Provide `.env.example` with all required variables documented

## Future Decisions

Additional decisions will be documented here as the project progresses through phases.

### Template for New Decisions

```
#### [Number]. [Decision Title]
- **Decision**: What was decided
- **Rationale**: Why this choice was made
- **Trade-off**: What we gave up or risked
- **Alternatives Considered**: What else was evaluated
```

## Architecture Principles

1. **Security First**: Never trust client input, validate on server
2. **User Scoped**: All queries filtered by user_id
3. **Progressive Enhancement**: Core features work without JS
4. **Type Safety**: Zod schemas shared between client/server
5. **Performance**: Optimize for perceived performance (optimistic UI)
6. **Simplicity**: Prefer boring, well-tested solutions
