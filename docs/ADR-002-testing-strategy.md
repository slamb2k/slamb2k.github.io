# ADR-002: Testing Strategy Decision

## Status

Accepted

## Context

We needed to establish a comprehensive testing strategy for the Component Forge project that ensures code quality, prevents regressions, and maintains accessibility standards. The key considerations were test framework selection, testing patterns, coverage requirements, and integration with the development workflow.

## Decision

We have decided to implement a multi-layered testing strategy with the following characteristics:

### 1. Test Framework Stack

**Decision**: Use Vitest + React Testing Library + axe-core for comprehensive testing

**Rationale**:

- **Vitest**: Fast, Vite-native test runner with excellent TypeScript support
- **React Testing Library**: Encourages testing user behavior over implementation details
- **axe-core**: Industry-standard accessibility testing
- **Happy DOM**: Lightweight DOM implementation for better performance

**Implementation**:

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    environment: 'happy-dom',
    setupFiles: ['./src/test-setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'src/test-setup.ts'],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
      },
    },
  },
});
```

### 2. Testing Pyramid

**Decision**: Implement a testing pyramid with 70% unit, 20% integration, 10% e2e

**Rationale**:

- Unit tests are fast and provide quick feedback
- Integration tests verify component interactions
- E2E tests validate complete user workflows
- Pyramid structure optimizes for speed and reliability

**Implementation**:

- **Unit Tests**: Individual component behavior and props
- **Integration Tests**: Component combinations and data flow
- **E2E Tests**: Complete user journeys (planned for future implementation)

### 3. Accessibility Testing

**Decision**: Mandatory accessibility testing for all interactive components

**Rationale**:

- Ensures WCAG 2.1 AA compliance from development
- Prevents accessibility regressions
- Reduces manual testing overhead
- Improves user experience for all users

**Implementation**:

```typescript
import { axe, toHaveNoViolations } from 'jest-axe'

expect.extend(toHaveNoViolations)

test('should not have accessibility violations', async () => {
  const { container } = render(<Button>Click me</Button>)
  const results = await axe(container)
  expect(results).toHaveNoViolations()
})
```

### 4. Component Testing Patterns

**Decision**: Test components as users interact with them, not implementation details

**Rationale**:

- Tests are more resilient to refactoring
- Better represents actual user experience
- Catches bugs that matter to users
- Aligns with React Testing Library philosophy

**Implementation**:

```typescript
// Good: Testing user behavior
test('should call onClick when clicked', async () => {
  const handleClick = vi.fn()
  render(<Button onClick={handleClick}>Click me</Button>)

  await user.click(screen.getByRole('button', { name: /click me/i }))
  expect(handleClick).toHaveBeenCalledOnce()
})

// Avoid: Testing implementation details
test('should have correct className', () => {
  render(<Button variant="primary">Click me</Button>)
  expect(screen.getByRole('button')).toHaveClass('bg-blue-600')
})
```

### 5. Mock Strategy

**Decision**: Mock external dependencies but keep component interactions real

**Rationale**:

- Isolates unit tests from external factors
- Maintains component interaction fidelity
- Reduces test flakiness
- Improves test performance

**Implementation**:

```typescript
// Mock external libraries
vi.mock('framer-motion', () => ({
  motion: {
    div: vi.fn(({ children, ...props }) => React.createElement('div', props, children)),
  },
}));

// Mock browser APIs
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
```

### 6. Coverage Requirements

**Decision**: Maintain 80% coverage threshold with quality-focused metrics

**Rationale**:

- 80% provides good bug prevention without being onerous
- Quality over quantity approach
- Focuses on critical code paths
- Allows for pragmatic exceptions

**Implementation**:

- Branch coverage: 80%
- Function coverage: 80%
- Line coverage: 80%
- Statement coverage: 80%

### 7. Test Organization

**Decision**: Co-locate tests with components using .test.tsx files

**Rationale**:

- Easier to maintain tests alongside code
- Clear relationship between test and implementation
- Facilitates test-driven development
- Simplifies file discovery

**File Structure**:

```
src/
  components/
    ui/
      Button/
        Button.tsx
        Button.test.tsx
        Button.stories.tsx
        index.ts
```

## Consequences

### Positive

1. **Quality Assurance**: High coverage prevents regressions
2. **Accessibility**: Built-in a11y testing ensures compliance
3. **Developer Confidence**: Tests provide safety net for refactoring
4. **Documentation**: Tests serve as usage examples
5. **Performance**: Fast test runner improves developer experience
6. **User Focus**: Testing Library encourages user-centric tests

### Negative

1. **Initial Setup**: More complex initial configuration
2. **Test Maintenance**: Tests require updating when behavior changes
3. **Mock Complexity**: Some external dependencies require complex mocking
4. **Learning Curve**: Developers need to understand testing best practices

### Neutral

1. **Test Writing Time**: Initial time investment for long-term benefits
2. **CI/CD Integration**: Additional build pipeline steps
3. **Tool Dependencies**: Reliance on multiple testing tools

## Alternatives Considered

### 1. Jest instead of Vitest

**Rejected because**:

- Slower than Vitest for TypeScript projects
- More complex configuration with Vite
- Less modern feature set

### 2. Enzyme instead of React Testing Library

**Rejected because**:

- Encourages testing implementation details
- Less maintained and updated
- Doesn't align with modern React patterns

### 3. Manual accessibility testing only

**Rejected because**:

- Time-consuming and error-prone
- Not automated in CI/CD pipeline
- Inconsistent coverage

### 4. 100% coverage requirement

**Rejected because**:

- Diminishing returns on investment
- Can encourage low-quality tests
- Difficult to maintain in practice

## Implementation Details

### Test Structure Template

```typescript
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe, toHaveNoViolations } from 'jest-axe'
import { ComponentName } from './ComponentName'

expect.extend(toHaveNoViolations)

describe('ComponentName', () => {
  let user: ReturnType<typeof userEvent.setup>

  beforeEach(() => {
    user = userEvent.setup()
  })

  describe('Rendering', () => {
    test('should render with default props', () => {
      render(<ComponentName>Content</ComponentName>)
      expect(screen.getByText('Content')).toBeInTheDocument()
    })
  })

  describe('Variants', () => {
    test.each(['variant1', 'variant2'])('should render %s variant', (variant) => {
      render(<ComponentName variant={variant}>Content</ComponentName>)
      expect(screen.getByText('Content')).toBeInTheDocument()
    })
  })

  describe('Interactions', () => {
    test('should handle user interactions', async () => {
      const handleClick = vi.fn()
      render(<ComponentName onClick={handleClick}>Click me</ComponentName>)

      await user.click(screen.getByRole('button'))
      expect(handleClick).toHaveBeenCalledOnce()
    })
  })

  describe('Accessibility', () => {
    test('should not have accessibility violations', async () => {
      const { container } = render(<ComponentName>Content</ComponentName>)
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    test('should support keyboard navigation', async () => {
      render(<ComponentName>Content</ComponentName>)
      const element = screen.getByRole('button')

      element.focus()
      expect(element).toHaveFocus()

      await user.keyboard('{Enter}')
      // Assert expected behavior
    })
  })

  describe('Edge Cases', () => {
    test('should handle empty content', () => {
      render(<ComponentName />)
      expect(screen.getByRole('button')).toBeInTheDocument()
    })
  })
})
```

### CI/CD Integration

```yaml
# .github/workflows/test.yml
- name: Run tests with coverage
  run: npm run test:coverage

- name: Upload coverage reports
  uses: codecov/codecov-action@v4
  with:
    file: ./coverage/lcov.info
    flags: unittests
    fail_ci_if_error: false
```

### Performance Testing

Future consideration for performance regression testing:

- Bundle size monitoring
- Render performance benchmarks
- Memory usage tracking

## Test Categories

### 1. Component Tests

- Props validation
- Variant rendering
- Event handling
- State management

### 2. Hook Tests

- Custom hook behavior
- State transitions
- Side effects
- Error conditions

### 3. Utility Tests

- Pure function behavior
- Edge cases
- Error handling
- Type safety

### 4. Integration Tests

- Component composition
- Data flow
- Router integration
- Context usage

## Monitoring and Review

This ADR should be reviewed:

- When test performance degrades
- If coverage consistently drops below threshold
- When new testing tools become available
- During major framework updates

**Metrics to Monitor**:

- Test execution time
- Coverage percentage
- Test flakiness rate
- Accessibility violation count

Last reviewed: January 2025
Next review: July 2025
