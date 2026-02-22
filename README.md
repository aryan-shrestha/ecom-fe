# E-Commerce Frontend

Production-ready Next.js 14 (App Router) frontend with TypeScript, TanStack Query, Zustand, and shadcn/ui.

## Environment Setup

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

## Installation

```bash
pnpm install
```

## Development

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (public)/          # Public routes (login, register)
│   ├── (protected)/       # Protected routes (dashboard, account)
│   ├── layout.tsx
│   ├── page.tsx
│   ├── providers.tsx
│   └── globals.css
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── common/            # Common components (AppShell, etc.)
│   └── forms/             # Form components
├── features/
│   └── auth/              # Auth feature module
│       ├── api/
│       ├── components/
│       ├── hooks/
│       ├── queries/
│       ├── schemas/
│       ├── store/
│       └── types/
├── lib/
│   ├── http/              # HTTP client and utilities
│   ├── env/               # Environment variable access
│   ├── routes/            # Route constants
│   └── utils/             # Utility functions
├── config/                # App configuration
└── types/                 # Global types
middleware.ts              # Route protection middleware
```

## Build for Production

```bash
pnpm build
pnpm start
```
