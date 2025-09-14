# Contributing to College LMS

Thank you for your interest in contributing to College LMS! We welcome contributions from everyone.

## Code of Conduct

### Our Pledge

We are committed to making participation in our project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards

Examples of behavior that contributes to creating a positive environment include:

- Using welcoming and inclusive language
- Being respectful of differing viewpoints and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

Examples of unacceptable behavior include:

- The use of sexualized language or imagery and unwelcome sexual attention or advances
- Trolling, insulting/derogatory comments, and personal or political attacks
- Public or private harassment
- Publishing others' private information without explicit permission
- Other conduct which could reasonably be considered inappropriate in a professional setting

## How to Contribute

### Reporting Bugs

Before creating bug reports, please check existing issues as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples to demonstrate the steps**
- **Describe the behavior you observed and what behavior you expected**
- **Include screenshots if applicable**
- **Include environment details** (OS, Node.js version, browser, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

- **Use a clear and descriptive title**
- **Provide a step-by-step description of the suggested enhancement**
- **Provide specific examples to demonstrate the steps**
- **Describe the current behavior and explain the behavior you expected**
- **Explain why this enhancement would be useful**

### Development Setup

1. **Fork the repository** and clone your fork:
   ```bash
   git clone https://github.com/your-username/Collage_lms.git
   cd Collage_lms
   ```

2. **Install dependencies** for both frontend and backend:
   ```bash
   # Backend dependencies
   cd backend
   npm install
   cd ..

   # Frontend dependencies
   cd frontend
   npm install
   cd ..

   # Root dependencies
   npm install
   ```

3. **Set up the database**:
   ```bash
   cd backend
   npm run seed
   cd ..
   ```

4. **Start development servers**:
   ```bash
   npm start
   ```

### Development Guidelines

#### Code Style

- Use **ESLint** and **Prettier** for code formatting
- Follow **camelCase** for variables and functions
- Follow **PascalCase** for components and classes
- Use **meaningful variable names**
- Add **comments** for complex logic

#### Frontend Guidelines

- Use **functional components** with hooks
- Follow **React best practices**
- Use **Tailwind CSS** for styling
- Ensure **responsive design**
- Add **PropTypes** or **TypeScript** for type checking

#### Backend Guidelines

- Follow **RESTful API** conventions
- Use **proper HTTP status codes**
- Implement **input validation**
- Add **error handling**
- Use **async/await** for asynchronous operations
- Add **JSDoc comments** for functions

#### Database Guidelines

- Use **Sequelize models** for database operations
- Create **migrations** for schema changes
- Add **proper indexes** for performance
- Follow **normalization** principles

### Pull Request Process

1. **Create a feature branch** from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following the development guidelines

3. **Test your changes**:
   ```bash
   # Run backend tests
   cd backend
   npm test
   cd ..

   # Run frontend tests  
   cd frontend
   npm test
   cd ..
   ```

4. **Commit your changes** with descriptive messages:
   ```bash
   git add .
   git commit -m "feat: add user profile management feature"
   ```

5. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request** with:
   - Clear title and description
   - Reference to related issues
   - Screenshots (if applicable)
   - Testing instructions

### Commit Message Convention

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` new feature
- `fix:` bug fix
- `docs:` documentation changes
- `style:` formatting changes (not affecting code logic)
- `refactor:` code refactoring
- `test:` adding or updating tests
- `chore:` maintenance tasks

Examples:
```
feat: add course enrollment functionality
fix: resolve login authentication issue
docs: update API documentation
style: format code with prettier
refactor: optimize database queries
test: add unit tests for user service
chore: update dependencies
```

### Testing

- Write **unit tests** for new features
- Write **integration tests** for API endpoints
- Ensure **test coverage** is maintained
- Test on **multiple browsers** for frontend changes

### Documentation

- Update **README.md** if needed
- Add **JSDoc comments** for new functions
- Update **API documentation** for new endpoints
- Add **inline comments** for complex logic

## Project Structure

```
college-lms/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── context/         # React context providers
│   │   ├── services/        # API service functions
│   │   └── ...
│   ├── public/              # Static assets
│   └── package.json
├── backend/                 # Node.js/Express backend
│   ├── controllers/         # Route controllers
│   ├── models/              # Database models
│   ├── routes/              # API routes
│   ├── middleware/          # Custom middleware
│   ├── config/              # Configuration files
│   ├── database/            # Database files and migrations
│   ├── seeders/             # Database seeders
│   ├── utils/               # Utility functions
│   └── package.json
├── components/              # Shared UI components (shadcn/ui)
├── public/                  # Public assets
├── docker-compose.yml       # Docker composition
├── nginx.conf              # Nginx configuration
└── ...
```

## Getting Help

- Check the [README.md](README.md) for basic setup and usage
- Browse [existing issues](https://github.com/Jani-shiv/Collage_lms/issues)
- Create a new issue for questions or problems
- Join our discussions in the project issues

## Recognition

Contributors will be recognized in our README.md and release notes. Thank you for helping make College LMS better!

## License

By contributing to College LMS, you agree that your contributions will be licensed under the MIT License.