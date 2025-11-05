# Contributing to InsightIQ

Thank you for your interest in contributing to InsightIQ! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Python 3.11+ and pip
- Docker & Docker Compose
- Git

### Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/your-username/aiinsight.git
   cd aiinsight
   ```

2. **Install Dependencies**
   ```bash
   npm run setup
   ```

3. **Environment Setup**
   ```bash
   cp apps/backend/.env.example apps/backend/.env
   cp apps/frontend/.env.local.example apps/frontend/.env.local
   ```

4. **Start Development**
   ```bash
   npm run dev
   ```

## 📋 Development Guidelines

### Code Standards

#### TypeScript
- Use strict TypeScript mode
- Provide proper type annotations
- Avoid `any` types
- Use interfaces for object shapes
- Prefer explicit return types

#### Frontend (Next.js/React)
- Follow React best practices
- Use functional components with hooks
- Implement proper error boundaries
- Use Tailwind CSS for styling
- Follow the established component structure

#### Backend (FastAPI/Python)
- Follow PEP 8 style guidelines
- Use type hints for all functions
- Implement proper error handling
- Use async/await for async operations
- Follow FastAPI conventions

#### Code Organization
```
src/
├── components/     # Reusable UI components
├── lib/           # Utility functions
├── hooks/         # Custom hooks
├── store/         # State management
└── types/         # TypeScript definitions
```

### Git Workflow

1. **Branch Naming**
   - `feature/feature-name` - New features
   - `bugfix/bug-description` - Bug fixes
   - `hotfix/critical-fix` - Critical fixes
   - `docs/documentation-update` - Documentation

2. **Commit Messages**
   ```
   type(scope): description

   [optional body]

   [optional footer]
   ```

   Types:
   - `feat`: New feature
   - `fix`: Bug fix
   `docs`: Documentation
   - `style`: Code style (formatting, etc.)
   - `refactor`: Code refactoring
   - `test`: Adding or updating tests
   - `chore`: Maintenance

   Examples:
   ```
   feat(auth): add social login support
   fix(chat): resolve message rendering issue
   docs(api): update authentication endpoints
   ```

3. **Pull Request Process**
   - Create a feature branch from `main`
   - Make your changes
   - Add tests if applicable
   - Update documentation
   - Ensure all tests pass
   - Submit a pull request with a clear description

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm run test

# Run frontend tests
npm run test:frontend

# Run backend tests
npm run test:backend

# Run E2E tests
npm run test:e2e
```

### Writing Tests

#### Frontend
- Use React Testing Library
- Test user interactions and component behavior
- Mock API calls when necessary
- Include accessibility tests

#### Backend
- Use pytest for backend tests
- Write unit tests for services and utilities
- Include integration tests for API endpoints
- Mock external services (OpenAI, etc.)

## 📝 Documentation

### API Documentation
- Use OpenAPI/Swagger for backend API documentation
- Include examples for all endpoints
- Document request/response schemas
- Provide authentication examples

### Code Documentation
- Add JSDoc comments for complex functions
- Include type annotations
- Document business logic in service files
- Update README for new features

## 🎨 UI/UX Guidelines

### Design System
- Follow the established design system
- Use consistent spacing and typography
- Implement responsive design
- Ensure accessibility (WCAG 2.1)

### Component Guidelines
- Create reusable, composable components
- Use proper TypeScript props
- Include default props and examples
- Test component variations

## 🔒 Security

### API Security
- Validate all inputs
- Implement rate limiting
- Use parameterized queries
- Never commit secrets or API keys

### Frontend Security
- Sanitize user inputs
- Implement CSRF protection
- Use HTTPS in production
- Validate data on both client and server

## 🚀 Deployment

### Development Environment
- Use Docker Compose for local development
- Include all required services (db, redis, etc.)
- Provide health checks for all services

### Production Environment
- Follow deployment guidelines
- Use environment variables for configuration
- Implement proper logging and monitoring
- Test deployment before merging

## 📋 Review Process

### Code Review Checklist

- [ ] Code follows project style guidelines
- [ ] Tests are included and passing
- [ ] Documentation is updated
- [ ] No sensitive information is committed
- [ ] Build passes successfully
- [ ] Performance considerations addressed

### PR Review Guidelines
1. **Thorough Review**: Review the entire PR, not just the changed lines
2. **Constructive Feedback**: Provide helpful, specific feedback
3. **Ask Questions**: If something is unclear, ask for clarification
4. **Approve with Confidence**: Only approve when you're comfortable with the changes

## 🐛 Bug Reports

### Creating Bug Reports

1. **Search First**: Check if the issue already exists
2. **Use Template**: Use the GitHub issue template
3. **Provide Context**: Include steps to reproduce, expected vs actual behavior
4. **Include Environment**: OS, browser, versions, etc.

## 💡 Feature Requests

### Submitting Feature Requests

1. **Use Template**: Use the feature request template
2. **Describe Use Case**: Explain why this feature is needed
3. **Provide Examples**: Mockups or descriptions of the feature
4. **Consider Alternatives**: Discuss potential alternatives

## 📧 Getting Help

### Communication Channels

- **GitHub Issues**: For bug reports and feature requests
- **GitHub Discussions**: For general questions and discussions
- **Email**: For private or security-related matters

### Community Guidelines

- Be respectful and inclusive
- Provide constructive feedback
- Help others when you can
- Follow the Code of Conduct

## 🏆 Recognition

Contributors are recognized in various ways:

- **GitHub Contributors**: Listed in the repository
- **Release Notes**: Mentioned in release announcements
- **Community**: Featured in blog posts and showcases
- **Special Recognition**: For significant contributions

## 📚 Additional Resources

- [Development Documentation](docs/development/)
- [API Documentation](docs/api/)
- [Deployment Guide](docs/deployment/)
- [Architecture Overview](docs/architecture/)

---

Thank you for contributing to InsightIQ! Your contributions help make this project better for everyone.