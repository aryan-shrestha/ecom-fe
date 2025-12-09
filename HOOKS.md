# Pre-commit Hooks Configuration

This project uses Husky for Git hooks to maintain code quality.

## What runs on pre-commit:

1. **Prettier formatting**: Automatically formats TypeScript/JavaScript files following TypeScript standards
2. **ESLint**: Checks for code quality issues and explicitly checks for `any` type usage
3. **Build verification**: Ensures the project builds successfully before commit
4. **Import organization**: Automatically organizes imports

## What runs on commit-msg:

- **Commitlint**: Validates commit messages follow conventional commit format

## Commit Message Format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types:

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, semicolons, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `build`: Build system or external dependencies
- `ci`: CI configuration changes
- `chore`: Other changes that don't modify src or test files
- `revert`: Revert a previous commit

### Examples:

```bash
git commit -m "feat: add user authentication"
git commit -m "fix: resolve navigation bug on mobile"
git commit -m "docs: update README with setup instructions"
```

## Manual Commands:

```bash
# Format code manually
npm run format

# Check formatting without making changes
npm run format:check

# Run type checking
npm run type-check

# Run linting
npm run lint
```
