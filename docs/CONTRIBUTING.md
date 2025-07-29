# Contributing Guidelines

Welcome to the about-me-simon-lamb portfolio template! We're excited to have you contribute to this project. This guide will help you understand our development process, coding standards, and how to make meaningful contributions.

## Table of Contents

- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Code Standards](#code-standards)
- [Testing Requirements](#testing-requirements)
- [Component Guidelines](#component-guidelines)
- [Accessibility Requirements](#accessibility-requirements)
- [Performance Guidelines](#performance-guidelines)
- [Documentation Standards](#documentation-standards)
- [Pull Request Process](#pull-request-process)
- [Issue Guidelines](#issue-guidelines)
- [Architecture Considerations](#architecture-considerations)

## Getting Started

### Prerequisites

- **Node.js**: Version 18+ (LTS recommended)
- **npm**: Version 8+ (comes with Node.js)
- **Git**: Latest version
- **Editor**: VS Code recommended with ESLint and Prettier extensions

### Environment Setup

1. **Fork and Clone**

   ```bash
   git clone https://github.com/yourusername/about-me-simon-lamb.git
   cd about-me-simon-lamb
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Environment Configuration**

   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Verify Setup**
   ```bash
   npm run dev          # Start development server
   npm run test         # Run tests
   npm run lint         # Check code quality
   ```

### Project Structure Overview

```
src/
├── components/
│   ├── ui/             # Reusable UI components
│   ├── layout/         # Layout components
│   ├── generated/      # Template-replaceable components
│   └── debug/          # Development utilities
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── types/              # TypeScript type definitions
├── i18n/               # Internationalization
├── config/             # Environment configuration
└── test/               # Test utilities and setup
```

## Development Workflow

### Branch Strategy

We follow a feature-branch workflow:

1. **Main Branch**: Production-ready code
2. **Feature Branches**: `feature/description-here`
3. **Bug Fix Branches**: `fix/description-here`
4. **Documentation**: `docs/description-here`

### Development Process

1. **Create Feature Branch**

   ```bash
   git checkout main
   git pull origin main
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes**

   - Follow TDD: Write tests first, then implementation
   - Run tests frequently: `npm run test:watch`
   - Use pre-commit hooks (automatically set up)

3. **Before Committing**

   ```bash
   npm run lint         # Fix linting issues
   npm run test         # Ensure all tests pass
   npm run build        # Verify build succeeds
   ```

4. **Commit Standards**
   We use [Conventional Commits](https://www.conventionalcommits.org/):
   ```bash
   feat(component): add new Button variant
   fix(accessibility): improve screen reader support
   docs(api): update component documentation
   test(ui): add comprehensive Button tests
   ```

## Code Standards

### TypeScript Guidelines

- **Strict Mode**: Always use TypeScript strict mode
- **No `any` Types**: Use proper typing or `unknown` with type guards
- **Interfaces**: Prefer interfaces over types for object shapes
- **Generics**: Use generics for reusable components

```typescript
// ✅ Good
interface ButtonProps {
  variant: 'primary' | 'secondary';
  onClick: (event: MouseEvent) => void;
}

// ❌ Avoid
interface ButtonProps {
  variant: any;
  onClick: any;
}
```

### React Guidelines

- **Functional Components**: Use function components with hooks
- **Component Organization**: One component per file
- **Props Destructuring**: Destructure props in function signature
- **Default Props**: Use default parameters instead of defaultProps

```typescript
// ✅ Good
const Button: React.FC<ButtonProps> = ({ variant = 'primary', children, onClick }) => {
  // Component implementation
};

// ❌ Avoid
const Button = (props: ButtonProps) => {
  const variant = props.variant || 'primary';
  // ...
};
```

### Styling Guidelines

- **Tailwind First**: Use Tailwind utilities for styling
- **Consistent Classes**: Follow established class patterns
- **Custom CSS**: Only when Tailwind utilities aren't sufficient
- **Dark Theme**: Always consider dark theme support

```typescript
// ✅ Good
const baseClasses =
  'inline-flex items-center justify-center font-mono text-sm rounded-lg transition-all duration-300';
const variantClasses = {
  primary: 'bg-teal-300 text-slate-900 hover:bg-teal-200',
  outline: 'border border-teal-300 text-teal-300 hover:bg-teal-300/10',
};

// ❌ Avoid
const styles = {
  button: {
    display: 'inline-flex',
    alignItems: 'center',
    // ... more inline styles
  },
};
```

### File Naming Conventions

- **Components**: PascalCase (`Button.tsx`, `AnimatedText.tsx`)
- **Hooks**: camelCase with `use` prefix (`useMobile.ts`)
- **Utilities**: camelCase (`keyboard.ts`, `performance.ts`)
- **Types**: camelCase with `.types.ts` suffix (`portfolio.types.ts`)
- **Tests**: Match source file with `.test.tsx` suffix

## Testing Requirements

### Test-Driven Development

We follow strict TDD practices:

1. **Write Tests First**: Always write failing tests before implementation
2. **Red-Green-Refactor**: Follow the TDD cycle
3. **Test Coverage**: Maintain 80%+ coverage for all new code

### Testing Standards

```typescript
// ✅ Good test structure
describe('Button Component', () => {
  describe('Rendering', () => {
    it('should render with default props', () => {
      render(<Button>Click me</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('should call onClick when clicked', () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Click me</Button>);

      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).toHaveBeenCalledOnce();
    });
  });

  describe('Accessibility', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(<Button>Click me</Button>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
```

### Test Categories

1. **Unit Tests**: Individual component testing
2. **Integration Tests**: Component interaction testing
3. **Accessibility Tests**: axe-core validation
4. **Performance Tests**: Core Web Vitals monitoring
5. **Visual Tests**: Screenshot comparison (future)

### Running Tests

```bash
npm run test              # Run all tests
npm run test:watch        # Watch mode
npm run test:ui           # UI mode
npm run test:coverage     # Coverage report
npm run test:accessibility # Accessibility tests only
```

## Component Guidelines

### Component Architecture

All components should follow this structure:

```typescript
/**
 * Component description with features and examples
 */
interface ComponentProps {
  /** Prop descriptions with JSDoc */
  children: React.ReactNode;
  variant?: 'default' | 'primary';
  className?: string;
}

/**
 * Component implementation with comprehensive JSDoc
 */
const Component: React.FC<ComponentProps> = ({ children, variant = 'default', className = '' }) => {
  // Implementation
};

export default Component;
```

### Reusable Components

When creating UI components:

1. **Follow Design System**: Use consistent colors, spacing, typography
2. **Multiple Variants**: Provide different visual styles
3. **Size Options**: Support different sizes (sm, md, lg)
4. **Accessibility**: Include ARIA labels and semantic HTML
5. **Animation**: Use Framer Motion for smooth interactions
6. **Testing**: Comprehensive test coverage

### Component Generator

Use our component generator for consistency:

```bash
npm run generate:component
# Follow the interactive prompts
```

This creates:

- Component file with TypeScript
- Test file with basic structure
- Storybook story (if applicable)
- Export statements

## Accessibility Requirements

### WCAG 2.1 AA Compliance

All components must meet WCAG 2.1 AA standards:

- **Keyboard Navigation**: Full keyboard support
- **Screen Readers**: Proper ARIA labels and semantics
- **Color Contrast**: Minimum 4.5:1 ratio
- **Focus Management**: Visible focus indicators
- **Motion**: Respect `prefers-reduced-motion`

### Accessibility Testing

```typescript
// Required accessibility test for all interactive components
it('should have no accessibility violations', async () => {
  const { container } = render(<Component />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});

// Keyboard navigation test
it('should support keyboard navigation', () => {
  render(<Component />);
  const element = screen.getByRole('button');

  element.focus();
  expect(element).toHaveFocus();

  fireEvent.keyDown(element, { key: 'Enter' });
  // Assert expected behavior
});
```

### Accessibility Utilities

Use our accessibility utilities:

```typescript
import { announceToScreenReader, trapFocus, getNextFocusableElement } from '@/utils/accessibility';

// Announce dynamic content changes
announceToScreenReader('Form submitted successfully');

// Manage focus in modals
const trapRef = trapFocus(modalRef);
```

## Performance Guidelines

### Performance Budgets

- **Bundle Size**: <500KB initial, <2MB total
- **Load Time**: <3s on 3G, <1s on WiFi
- **Core Web Vitals**: LCP <2.5s, FID <100ms, CLS <0.1
- **Memory**: <100MB mobile, <500MB desktop

### Optimization Techniques

1. **Lazy Loading**: Use `LazySection` for non-critical content
2. **Image Optimization**: Use `OptimizedImage` component
3. **Code Splitting**: Dynamic imports for large features
4. **Memoization**: Use `React.memo` and `useMemo` appropriately
5. **Virtual Scrolling**: Use `VirtualList` for large datasets

### Performance Testing

```typescript
// Performance test example
it('should render within performance budget', async () => {
  const { rerender } = render(<Component />);

  const startTime = performance.now();
  for (let i = 0; i < 100; i++) {
    rerender(<Component key={i} />);
  }
  const endTime = performance.now();

  expect(endTime - startTime).toBeLessThan(100); // 100ms budget
});
```

## Documentation Standards

### JSDoc Requirements

All public APIs must have JSDoc documentation:

````typescript
/**
 * Component description explaining purpose and features
 *
 * @example
 * ```tsx
 * <Component variant="primary" size="lg">
 *   Example usage
 * </Component>
 * ```
 */
interface ComponentProps {
  /** Description of what this prop does */
  variant?: 'primary' | 'secondary';
  /** Size of the component */
  size?: 'sm' | 'md' | 'lg';
}
````

### Documentation Files

- **Component APIs**: Document in `docs/COMPONENT_API.md`
- **Architecture Decisions**: Add to `docs/ARCHITECTURE_DECISIONS.md`
- **Configuration**: Update `docs/CONFIGURATION.md`
- **README**: Keep main README updated

## Pull Request Process

### Before Submitting

1. **Self Review**

   ```bash
   npm run lint:fix        # Fix linting issues
   npm run test           # All tests pass
   npm run build          # Build succeeds
   npm run test:accessibility # A11y tests pass
   ```

2. **Documentation**

   - Update component API docs if applicable
   - Add JSDoc comments to new functions
   - Update README if needed

3. **Testing**
   - Write comprehensive tests
   - Include accessibility tests
   - Test responsive behavior
   - Add performance tests if applicable

### PR Template

```markdown
## Description

Brief description of changes

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing

- [ ] Unit tests added/updated
- [ ] Accessibility tests pass
- [ ] Manual testing completed
- [ ] Performance impact assessed

## Screenshots/Videos

(If applicable)

## Breaking Changes

(If any)

## Additional Notes

(Any special considerations)
```

### Review Process

1. **Automated Checks**: All CI checks must pass
2. **Code Review**: At least one approving review required
3. **Testing**: Reviewer should test functionality
4. **Documentation**: Ensure docs are updated
5. **Performance**: Check for performance regressions

## Issue Guidelines

### Bug Reports

```markdown
**Bug Description**
Clear description of the issue

**Steps to Reproduce**

1. Go to...
2. Click on...
3. See error

**Expected Behavior**
What should happen

**Actual Behavior**
What actually happens

**Environment**

- OS: [e.g. macOS 13.0]
- Browser: [e.g. Chrome 91]
- Node version: [e.g. 18.0.0]

**Additional Context**
Screenshots, error logs, etc.
```

### Feature Requests

```markdown
**Feature Description**
Clear description of the proposed feature

**Use Case**
Why is this feature needed?

**Proposed Solution**
How should this be implemented?

**Alternatives Considered**
Other approaches you've thought about

**Additional Context**
Mockups, examples, etc.
```

## Architecture Considerations

### Design Patterns

- **Component Composition**: Prefer composition over inheritance
- **Render Props**: Use for complex reusable logic
- **Custom Hooks**: Extract stateful logic into hooks
- **Context API**: For global state that doesn't need external library

### State Management

- **Local State**: Use `useState` for component-specific state
- **Derived State**: Use `useMemo` and `useCallback` appropriately
- **Global State**: Evaluate need carefully; prefer prop drilling or context
- **Form State**: Consider dedicated form libraries for complex forms

### Performance Patterns

- **Memoization**: Use `React.memo` for expensive components
- **Lazy Loading**: Implement for routes and heavy components
- **Code Splitting**: Split large features into separate bundles
- **Virtualization**: Use for large lists or grids

## Getting Help

### Communication Channels

- **GitHub Issues**: For bugs and feature requests
- **GitHub Discussions**: For questions and community chat
- **Documentation**: Check existing docs first

### Resources

- **Component API**: `docs/COMPONENT_API.md`
- **Architecture Decisions**: `docs/ARCHITECTURE_DECISIONS.md`
- **Configuration Guide**: `docs/CONFIGURATION.md`
- **Testing Guide**: `src/test/README.md`

### Mentorship

New contributors are welcome! If you're new to:

- **React**: Check out the official React documentation
- **TypeScript**: Start with TypeScript handbook
- **Testing**: Read React Testing Library docs
- **Accessibility**: Review WCAG guidelines

Don't hesitate to ask questions in GitHub Discussions!

---

Thank you for contributing to about-me-simon-lamb! Your efforts help make this template better for everyone. 🚀
