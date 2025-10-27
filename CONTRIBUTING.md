# Contributing to EchoCards

First off, thank you for considering contributing to EchoCards! It's people like you that make EchoCards such a great tool for learning.

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the issue list as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

**Bug Report Template:**
- **Description**: Clear and concise description of the bug
- **Steps to Reproduce**:
  1. Go to '...'
  2. Click on '....'
  3. See error
- **Expected Behavior**: What you expected to happen
- **Actual Behavior**: What actually happened
- **Screenshots**: If applicable
- **Environment**:
  - OS: [e.g., macOS 14.0]
  - Browser: [e.g., Chrome 120]
  - Node.js version: [e.g., 20.10.0]
  - EchoCards version: [e.g., commit hash]

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

- **Clear title** and description
- **Step-by-step description** of the suggested enhancement
- **Explain why** this enhancement would be useful
- **List similar features** in other apps if applicable

### Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Make your changes** following our coding standards
3. **Test your changes** thoroughly
4. **Update documentation** if needed
5. **Ensure CI passes** (linting, type-checking, builds)
6. **Submit a pull request**

## Development Setup

### Prerequisites

- Node.js 20+ (for frontend and backend)
- npm (comes with Node.js)
- Google Gemini API key ([Get one free](https://aistudio.google.com/apikey))

### Local Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/echocards-voice-flashcards.git
cd echocards-voice-flashcards

# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..

# Set up environment variables
# Create .env.local in root
echo "GEMINI_API_KEY=your_api_key_here" > .env.local

# Create server/.env
echo "GEMINI_API_KEY=your_api_key_here" > server/.env
echo "PORT=3001" >> server/.env

# Start backend (Terminal 1)
cd server
npm start

# Start frontend (Terminal 2)
npm run dev
```

Access the app at http://localhost:3000

### Development Workflow

1. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make changes** and test locally

3. **Run linting** (if available):
   ```bash
   npm run lint
   ```

4. **Type check**:
   ```bash
   npm run type-check  # or npx tsc --noEmit
   ```

5. **Build to verify**:
   ```bash
   npm run build
   ```

6. **Commit your changes**:
   ```bash
   git add .
   git commit -m "feat: add new feature description"
   ```

7. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

8. **Create Pull Request** on GitHub

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Avoid `any` types - use proper typing
- Use interfaces for object shapes
- Export types that might be reused

### React Components

- Use functional components with hooks
- Keep components focused and single-purpose
- Use descriptive prop names
- Add PropTypes or TypeScript types

### Code Style

- Use 2 spaces for indentation
- Use semicolons
- Use single quotes for strings
- Use meaningful variable names
- Add comments for complex logic

### Example:

```typescript
// Good
interface CardProps {
  question: string;
  answer: string;
  onFlip: () => void;
}

const Card: React.FC<CardProps> = ({ question, answer, onFlip }) => {
  return (
    <div className="card" onClick={onFlip}>
      <div className="question">{question}</div>
      <div className="answer">{answer}</div>
    </div>
  );
};

// Avoid
const Card = (props: any) => {
  return <div onClick={() => props.onFlip()}>{props.q}</div>;
};
```

## Commit Message Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(voice): add support for custom voice profiles

fix(fsrs): correct stability calculation for review cards

docs(readme): update installation instructions
```

## Project Structure

```
echocards-voice-flashcards/
├── src/
│   ├── components/     # React components
│   ├── services/       # Business logic
│   ├── types.ts        # TypeScript types
│   └── App.tsx         # Main app component
├── server/
│   ├── server.js       # Express backend
│   ├── routes/         # API routes
│   └── middleware/     # Backend middleware
├── docs/               # Documentation
└── .github/            # GitHub configs
```

## Key Areas for Contribution

### High Priority

- **Voice recognition improvements**: Better accuracy, multiple languages
- **FSRS algorithm enhancements**: Tune parameters, add features
- **Mobile responsiveness**: Better UI on mobile devices
- **Performance optimizations**: Reduce load times, optimize rendering
- **Test coverage**: Add unit and integration tests

### Medium Priority

- **New AI models**: Support for OpenAI, Claude
- **Deck sharing**: Export/import between users
- **Analytics dashboard**: Study statistics and insights
- **Offline mode**: Service worker for offline functionality
- **Browser extension**: Study cards in browser

### Nice to Have

- **Gamification**: Streaks, achievements, leaderboards
- **Social features**: Study groups, shared decks
- **Advanced customization**: Themes, card layouts
- **Integration**: Anki, Quizlet, other platforms

## Testing

Before submitting a PR, please test:

1. **Voice features**: Start review, voice commands work
2. **AI features**: Deck generation, image generation/analysis
3. **FSRS scheduling**: Cards are scheduled correctly
4. **Backup/Export**: Data export and import work
5. **Different browsers**: Chrome, Firefox, Safari
6. **Mobile devices**: Responsive on phone/tablet

## Documentation

When adding features:

- Update README.md if user-facing
- Update relevant documentation files
- Add inline code comments for complex logic
- Update CHANGELOG.md (if it exists)

## Questions?

- **Issues**: [GitHub Issues](https://github.com/matheus-rech/echocards-voice-flashcards/issues)
- **Discussions**: [GitHub Discussions](https://github.com/matheus-rech/echocards-voice-flashcards/discussions)

## Recognition

Contributors will be recognized in:
- README.md contributors section (if added)
- GitHub's automatic contributor recognition
- Release notes for significant contributions

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to EchoCards! 🎉
