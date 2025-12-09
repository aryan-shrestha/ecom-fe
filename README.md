# E-Commerce Frontend

## Getting Started

First, install dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run format       # Format all code with Prettier
npm run format:check # Check code formatting
npm run type-check   # Run TypeScript type checking
```

### Project Structure

```
src/
├── app/
│   ├── (dashboard)/     # Dashboard routes with sidebar
│   ├── (public)/        # Public routes with navbar
│   ├── (superadmin)/    # Super admin routes
│   └── styles/          # Global styles
├── components/
│   ├── custom/          # Custom components
│   └── ui/              # UI components (shadcn/ui)
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions
└── repository/          # Data layer
```

## Code Quality & Git Hooks

This project uses **pre-commit hooks** to maintain code quality. All commits are automatically checked for:

### Pre-commit Checks

1. **Code Formatting** - Prettier automatically formats your code
2. **Linting** - ESLint checks for code quality issues
3. **Type Safety** - Prevents use of `any` type in TypeScript
4. **Build Verification** - Ensures the project builds successfully

### Commit Message Format

Commits must follow [Conventional Commits](https://www.conventionalcommits.org/) format:

```
<type>(<scope>): <subject>
```

**Valid types:** `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`

**Examples:**

```bash
git commit -m "feat: add user authentication"
git commit -m "fix: resolve navigation bug on mobile"
git commit -m "docs: update README with setup instructions"
```

For more details, see [HOOKS.md](./HOOKS.md).

## Technologies

- **Framework:** Next.js 16 (App Router with Turbopack)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **UI Components:** Radix UI + shadcn/ui
- **Code Quality:** ESLint, Prettier, Husky
- **Commit Standards:** Commitlint
