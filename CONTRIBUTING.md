# Contributing to Mama's Kitchen

Thank you for your interest in contributing to Mama's Kitchen! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Messages](#commit-messages)
- [Pull Request Process](#pull-request-process)
- [Testing Guidelines](#testing-guidelines)

## Code of Conduct

### Our Standards

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on constructive feedback
- Respect differing viewpoints and experiences

## Getting Started

### Prerequisites

- Node.js v18 or higher
- MongoDB v6 or higher
- Git
- Text editor (VS Code recommended)

### Setup Development Environment

1. **Fork the repository**
   ```bash
   # Click "Fork" on GitHub
   ```

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/Mama-s-kitchen-backend.git
   cd Mama-s-kitchen-backend
   ```

3. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/Akshay02-cmd/Mama-s-kitchen-backend.git
   ```

4. **Install dependencies**
   ```bash
   npm install
   ```

5. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your local configuration
   ```

6. **Start development server**
   ```bash
   npm start
   ```

## Development Workflow

### 1. Create a Branch

Always create a new branch for your work:

```bash
# Update main branch
git checkout main
git pull upstream main

# Create feature branch
git checkout -b feature/your-feature-name

# Or for bug fixes
git checkout -b fix/bug-description
```

### Branch Naming Convention

- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `refactor/` - Code refactoring
- `test/` - Adding tests
- `chore/` - Maintenance tasks

Examples:
- `feature/add-order-system`
- `fix/auth-token-expiry`
- `docs/update-api-documentation`

### 2. Make Changes

- Write clean, readable code
- Follow existing code style
- Add comments for complex logic
- Update documentation if needed

### 3. Test Your Changes

```bash
# Run the application
npm start

# Test API endpoints using Postman or curl
curl http://localhost:5000/
```

### 4. Commit Changes

```bash
git add .
git commit -m "feat: add user profile image upload"
```

### 5. Push to Your Fork

```bash
git push origin feature/your-feature-name
```

### 6. Create Pull Request

1. Go to your fork on GitHub
2. Click "New Pull Request"
3. Select your branch
4. Fill in PR template
5. Submit for review

## Coding Standards

### JavaScript/ES6+ Style

```javascript
// Use ES6+ features
import express from 'express';

// Use const/let, not var
const app = express();
let counter = 0;

// Use arrow functions
const processData = (data) => {
  return data.map(item => item.value);
};

// Use async/await
const fetchData = async () => {
  try {
    const result = await database.query();
    return result;
  } catch (error) {
    console.error(error);
  }
};

// Use template literals
const message = `Hello, ${user.name}!`;

// Use destructuring
const { name, email } = req.body;
```

### Naming Conventions

```javascript
// Variables and functions: camelCase
const userName = 'John';
function getUserData() {}

// Classes and Models: PascalCase
class UserProfile {}
const UserModel = mongoose.model('User');

// Constants: UPPER_SNAKE_CASE
const MAX_RETRY_COUNT = 3;
const API_BASE_URL = 'http://api.example.com';

// Private functions: _camelCase (convention)
const _helperFunction = () => {};

// File names: kebab-case
// user-controller.js
// auth-middleware.js
```

### Code Organization

```javascript
// 1. Imports
import express from 'express';
import { StatusCodes } from 'http-status-codes';

// 2. Constants
const MAX_ITEMS = 100;

// 3. Main code
const router = express.Router();

// 4. Functions
const getData = async () => {
  // implementation
};

// 5. Exports
export default router;
export { getData };
```

### JSDoc Comments

Add JSDoc comments for all functions:

```javascript
/**
 * Create a new user account
 * 
 * @async
 * @function createUser
 * @param {Object} userData - User registration data
 * @param {string} userData.name - User's full name
 * @param {string} userData.email - User's email address
 * @returns {Promise<Object>} Created user object
 * @throws {BadRequestError} If validation fails
 * 
 * @example
 * const user = await createUser({
 *   name: 'John Doe',
 *   email: 'john@example.com'
 * });
 */
const createUser = async (userData) => {
  // implementation
};
```

### Error Handling

```javascript
// Use custom error classes
import { BadRequestError, NotFoundError } from '../errors/index.js';

// Throw specific errors
if (!user) {
  throw new NotFoundError('User not found');
}

// Use try-catch for async operations
try {
  const result = await database.query();
} catch (error) {
  console.error('Database error:', error);
  throw new Error('Operation failed');
}
```

### Validation

```javascript
// Always validate input
import Joi from 'joi';

const schema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

const { error } = schema.validate(data);
```

## Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

### Examples

```bash
# Feature
git commit -m "feat(auth): add password reset functionality"

# Bug fix
git commit -m "fix(meal): correct price validation in meal controller"

# Documentation
git commit -m "docs(readme): update installation instructions"

# Refactoring
git commit -m "refactor(user): simplify user profile creation logic"

# With body
git commit -m "feat(order): implement order management system

- Add Order model with status tracking
- Create order controller with CRUD operations
- Add order routes with proper authentication
- Update API documentation

Closes #123"
```

## Pull Request Process

### Before Submitting

- [ ] Code follows project style guidelines
- [ ] All tests pass (when testing is implemented)
- [ ] Documentation updated (if needed)
- [ ] Commit messages follow convention
- [ ] No console.log statements (use proper logging)
- [ ] No commented-out code
- [ ] Branch is up to date with main

### PR Title Format

Same as commit messages:

```
feat(auth): add OAuth2 social login
fix(mess): resolve duplicate mess creation issue
docs(api): add endpoint examples
```

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Refactoring
- [ ] Other (describe)

## Changes Made
- List specific changes
- Be detailed and clear

## Testing
How was this tested?

## Screenshots (if applicable)
Add screenshots for UI changes

## Related Issues
Closes #123
Related to #456
```

### Review Process

1. Automated checks must pass
2. At least one maintainer approval required
3. Address all review comments
4. Keep PR scope focused and small
5. Be responsive to feedback

## Testing Guidelines

### Manual Testing

```bash
# Test authentication
curl -X POST http://localhost:5000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"test123","role":"CUSTOMER"}'

# Test with Postman
# Import API collection and run tests
```

### Future: Automated Testing

When test infrastructure is added:

```bash
# Run all tests
npm test

# Run specific test file
npm test auth.test.js

# Run with coverage
npm run test:coverage
```

## Questions?

- Open an issue for bugs or feature requests
- Ask questions in discussions
- Contact maintainers: [@Akshay02-cmd](https://github.com/Akshay02-cmd)

---

Thank you for contributing to Mama's Kitchen! 🎉
