# Contributing to AutoSub

Thank you for your interest in contributing to AutoSub! This document provides guidelines and information for contributors.

## Development Setup

1. **Prerequisites**
   - Node.js 18+ 
   - Yarn package manager
   - Git

2. **Clone and Setup**
   ```bash
   git clone https://github.com/your-username/AutoSub.git
   cd AutoSub
   ./setup.sh
   ```

3. **Environment Configuration**
   - Copy `frontend/.env.example` to `frontend/.env`
   - Configure your Massa network settings
   - Add your private key for testing

## Project Structure

- `contracts/` - AssemblyScript smart contracts
- `frontend/` - React frontend application  
- `scripts/` - Deployment and utility scripts
- `docs/` - Documentation files

## Development Workflow

### Smart Contracts

```bash
# Build contracts
yarn build:contracts

# Clean build artifacts
yarn clean

# Deploy to testnet
yarn deploy
```

### Frontend Development

```bash
# Start development server
yarn dev:frontend

# Build for production
yarn build:frontend

# Lint code
yarn lint
yarn lint:fix
```

## Code Style

- Use Prettier for code formatting
- Follow ESLint rules for TypeScript/JavaScript
- Use meaningful variable and function names
- Add comments for complex logic

## Testing

- Write unit tests for smart contract functions
- Test frontend components with React Testing Library
- Ensure all tests pass before submitting PRs

## Pull Request Process

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Follow coding standards
   - Add tests where appropriate
   - Update documentation

4. **Test your changes**
   ```bash
   yarn build
   yarn lint
   # Run any additional tests
   ```

5. **Commit with clear messages**
   ```bash
   git commit -m "feat: add subscription cancellation feature"
   ```

6. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

## Issue Reporting

When reporting issues, please include:

- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Environment details (OS, Node version, etc.)
- Screenshots if applicable

## Feature Requests

For new features:

- Check existing issues first
- Provide clear use case and rationale
- Consider implementation complexity
- Be open to discussion and feedback

## Smart Contract Security

- Follow Massa security best practices
- Avoid state-changing operations in view functions
- Validate all inputs and parameters
- Use proper access controls
- Test edge cases thoroughly

## Frontend Guidelines

- Use TypeScript for type safety
- Follow React best practices
- Ensure responsive design
- Handle loading and error states
- Optimize for performance

## Documentation

- Update README for significant changes
- Document new features and APIs
- Include code examples where helpful
- Keep documentation current

## Community

- Be respectful and inclusive
- Help others learn and contribute
- Share knowledge and best practices
- Participate in discussions constructively

## Questions?

- Open an issue for questions
- Join our Discord community
- Check existing documentation first

Thank you for contributing to AutoSub! 🚀
