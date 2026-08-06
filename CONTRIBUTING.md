# Contributing to Affiliate Marketing Platform

Thank you for your interest in contributing to the Affiliate Marketing Platform! This document provides guidelines and instructions for contributing.

## 🤝 How to Contribute

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates.

**When creating a bug report, include:**
- A clear and descriptive title
- Steps to reproduce the issue
- Expected behavior vs. actual behavior
- Screenshots or error messages if applicable
- Environment details (OS, Node.js version, etc.)
- Any relevant logs or configurations

### Suggesting Enhancements

Enhancement suggestions are welcome! Please provide:
- A clear description of the proposed enhancement
- Use cases or benefits
- Possible implementation approaches
- Examples or mockups if applicable

### Pull Requests

#### Before Submitting a PR

1. **Fork the repository** and create your branch from `main`
2. **Follow the coding standards** outlined below
3. **Write tests** for new features or bug fixes
4. **Update documentation** if needed
5. **Ensure all tests pass** locally

#### PR Guidelines

- **One PR per feature/fix** - Keep changes focused
- **Clear commit messages** - Use conventional commit format
- **Update tests** - Ensure existing tests still pass
- **Document changes** - Update relevant documentation
- **Clean history** - Rebase if necessary before merging

## 📋 Development Setup

### Prerequisites
- Node.js 18+
- PostgreSQL 15+ (or use Docker)
- Git

### Setup Steps

1. **Fork and clone the repository**
```bash
git clone https://github.com/NgDanhThanhTrung/AFFILIATE.git
cd AFFILIATE
```

2. **Install dependencies**
```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

3. **Setup environment variables**
```bash
# Backend
cd backend
cp .env.example .env
# Edit .env with your configuration

# Frontend
cd frontend
cp .env.example .env.local
# Edit .env.local with your backend URL
```

4. **Setup database**
```bash
cd backend
npx prisma generate
npx prisma migrate dev
npm run prisma:seed
```

5. **Run development servers**
```bash
# Backend (terminal 1)
cd backend
npm run dev

# Frontend (terminal 2)
cd frontend
npm run dev
```

## 🎨 Coding Standards

### TypeScript/JavaScript

- **Use TypeScript** for all new code
- **Follow existing patterns** in the codebase
- **Use meaningful variable names**
- **Add JSDoc comments** for complex functions
- **Keep functions small** and focused

### Code Style

- **Use 2 spaces** for indentation
- **Use single quotes** for strings
- **Add trailing commas** in objects/arrays
- **Remove unused imports**
- **Sort imports** alphabetically

### Naming Conventions

- **Files**: kebab-case (`user-service.ts`)
- **Components**: PascalCase (`UserProfile.tsx`)
- **Functions**: camelCase (`getUserById`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_RETRY_COUNT`)
- **Interfaces/Types**: PascalCase (`UserResponse`)

## 🧪 Testing

### Writing Tests

- **Write unit tests** for utility functions
- **Write integration tests** for API endpoints
- **Test edge cases** and error conditions
- **Keep tests fast** and independent

### Running Tests

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test

# Run with coverage
npm test -- --coverage
```

## 📝 Commit Guidelines

### Commit Message Format

Follow conventional commits format:

```
type(scope): description

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `perf`: Performance improvements

**Examples:**
```bash
git commit -m "feat(auth): add refresh token support"
git commit -m "fix(wallet): resolve double counting issue"
git commit -m "docs(readme): update deployment instructions"
```

## 🏗️ Project Structure

### Backend
```
backend/src/
├── config/          # Configuration files
├── controllers/     # Request handlers
├── middleware/      # Express middleware
├── prisma/          # Database schema & migrations
├── routes/          # API route definitions
├── services/        # Business logic
├── types/           # TypeScript types
└── utils/           # Utility functions
```

### Frontend
```
frontend/src/
├── app/            # Next.js app router pages
├── components/     # React components
├── contexts/       # React contexts
├── lib/            # Utilities & API clients
└── types/          # TypeScript types
```

## 🔧 Development Workflow

### Feature Development

1. **Create a feature branch**
```bash
git checkout -b feature/your-feature-name
```

2. **Make your changes** following coding standards

3. **Test thoroughly**
```bash
# Run tests
npm test

# Run type checking
npm run type-check

# Run linter
npm run lint
```

4. **Commit your changes**
```bash
git add .
git commit -m "feat: your feature description"
```

5. **Push and create PR**
```bash
git push origin feature/your-feature-name
```

### Bug Fixing

1. **Create a bugfix branch**
```bash
git checkout -b fix/your-bug-fix
```

2. **Fix the issue** and add tests

3. **Verify the fix** resolves the issue

4. **Commit and push**
```bash
git add .
git commit -m "fix: description of the fix"
git push origin fix/your-bug-fix
```

## 📖 Documentation

### When to Update Documentation

- **New features** - Update README and API docs
- **Breaking changes** - Update migration guides
- **Configuration changes** - Update CONFIGURATION.md
- **Security changes** - Update SECURITY.md

### Documentation Guidelines

- **Keep it simple** and clear
- **Include examples** where helpful
- **Update screenshots** if UI changes
- **Maintain consistency** in formatting

## 🚀 Deployment Process

### Staging

1. **Create release branch**
```bash
git checkout -b release/v1.0.0
```

2. **Test thoroughly** in staging environment

3. **Update version numbers** in package.json

4. **Merge to main** after approval

### Production

1. **Tag the release**
```bash
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0
```

2. **Deploy to production** (automatic via CI/CD)

3. **Monitor deployment** for issues

## 🔍 Code Review Process

### Reviewer Guidelines

- **Check for bugs** and edge cases
- **Verify tests** are adequate
- **Ensure documentation** is updated
- **Check for security** vulnerabilities
- **Verify performance** implications

### Author Guidelines

- **Address all review comments**
- **Update tests** if requested
- **Clarify ambiguous code**
- **Be responsive** to feedback

## 🌟 Recognition

Contributors will be recognized in:
- Contributors section in README
- Release notes for significant contributions
- Project acknowledgments

## ❓ Getting Help

- **GitHub Issues** - For bugs and feature requests
- **Discussions** - For questions and ideas
- **Email** - For security concerns

## 📜 Code of Conduct

Please be respectful and constructive in all interactions. See [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md) for details.

## 🎯 Priority Areas

We particularly welcome contributions in:

- **Testing** - Increasing test coverage
- **Documentation** - Improving guides and examples
- **Performance** - Optimizing database queries and API responses
- **Security** - Identifying and fixing vulnerabilities
- **Accessibility** - Improving UI/UX accessibility
- **Internationalization** - Adding language support

---

Thank you for contributing to the Affiliate Marketing Platform! 🎉
