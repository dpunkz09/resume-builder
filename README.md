# Resume Builder SaaS

A modern web application for building professional, ATS-friendly resumes with live preview, multiple templates, and AI-powered features.

## Features

- **User Authentication**: Email + Google OAuth via Better Auth
- **Resume Editor**: Guided form-based editor with drag-to-reorder sections
- **Live Preview**: Real-time preview beside the editor
- **Multiple Templates**: 3-5 professional templates (minimal, modern, ATS-plain, etc.)
- **Theme Customization**: Accent color, fonts, spacing, margins, page size
- **PDF Export**: High-quality PDF export via Playwright (A4 and US Letter)
- **Freemium Model**: Free tier with limits, Pro tier with unlimited features
- **AI Features** (Pro): Rewrite bullet points, generate summary, tailor to job description
- **Public Sharing**: Optional public share links for resumes

## Tech Stack

- **Framework**: Next.js 16 (App Router) + TypeScript
- **Styling**: Tailwind CSS 4 + shadcn/ui components
- **Database**: PostgreSQL via Supabase
- **ORM**: Drizzle ORM
- **Authentication**: Better Auth
- **Payments**: Stripe
- **PDF Export**: Playwright (headless Chromium)
- **AI**: Google Gemini API
- **Testing**: Vitest (unit) + Playwright (e2e)

## Prerequisites

- Node.js 20+ and npm
- PostgreSQL database (Supabase recommended)
- Stripe account (for payments)
- Google Gemini API key (for AI features)

## Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

Required variables:

- `DATABASE_URL` - PostgreSQL connection string
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `BETTER_AUTH_SECRET` - Random 32+ character string
- `STRIPE_SECRET_KEY` - Stripe secret key
- `GOOGLE_GENERATIVE_AI_API_KEY` - Gemini API key

See `.env.example` for complete list.

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Database

Create a Supabase project or use your own PostgreSQL database, then:

```bash
# Generate migration files
npm run db:generate

# Apply migrations
npm run db:push

# (Optional) Open Drizzle Studio to inspect database
npm run db:studio
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run test` - Run unit tests (single run)
- `npm run test:watch` - Run unit tests in watch mode
- `npm run test:e2e` - Run end-to-end tests
- `npm run test:e2e:ui` - Run e2e tests with UI
- `npm run typecheck` - Type check without emitting files
- `npm run db:generate` - Generate migration files from schema
- `npm run db:push` - Push schema changes to database
- `npm run db:studio` - Open Drizzle Studio

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── (auth)/            # Auth pages (login, signup, etc.)
│   ├── dashboard/         # Dashboard page
│   ├── resumes/           # Resume editor pages
│   └── ...                # Other pages
├── components/            # React components
│   └── ui/               # shadcn/ui components
├── db/                    # Database
│   ├── schema.ts         # Drizzle schema
│   ├── index.ts          # Database client
│   └── migrations/       # Migration files
├── lib/                   # Utilities
│   └── utils.ts          # Helper functions
├── types/                 # TypeScript types
├── e2e/                   # E2E tests (Playwright)
└── public/                # Static assets
```

## Database Schema

### Users

- `id`, `email`, `name`, `avatarUrl`, `createdAt`, `updatedAt`

### Subscriptions

- `id`, `userId`, `provider`, `plan` (free/pro), `status`, `currentPeriodEnd`

### Resumes

- `id`, `userId`, `title`, `templateId`, `theme` (jsonb), `content` (jsonb)
- `isPublic`, `publicSlug`, `createdAt`, `updatedAt`

### AI Usage

- `id`, `userId`, `feature`, `tokensIn`, `tokensOut`, `createdAt`

## Development Phases

This project is built in phases:

- ✅ **Phase 0**: Setup (dependencies, config, database schema)
- ⏳ **Phase 1**: Auth + Dashboard
- ⏳ **Phase 2**: Editor + Preview
- ⏳ **Phase 3**: Templates + Theming + PDF
- ⏳ **Phase 4**: Billing + Plan Limits
- ⏳ **Phase 5**: AI Features
- ⏳ **Phase 6**: Growth + Polish

See `../resume-builder-plan.md` for detailed phase requirements.

## Testing

### Unit Tests

```bash
npm run test
```

### E2E Tests

```bash
# Make sure dev server is running, then:
npm run test:e2e
```

## Deployment

Recommended: Deploy to [Vercel](https://vercel.com)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

## License

Private project - All rights reserved

## Support

For issues or questions, please contact the development team.
