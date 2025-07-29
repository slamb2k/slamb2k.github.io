# Testing Setup for about-me-simon-lamb

## Overview

This project now includes a comprehensive testing setup using Vitest, React Testing Library, and Happy DOM for testing React components and hooks.

## Test Structure

### Test Files

- `src/hooks/use-mobile.test.ts` - Tests for responsive hooks
- `src/components/generated/PortfolioLandingPage.test.tsx` - Main component tests
- `src/components/generated/SidebarNavigation.test.tsx` - Sidebar component tests
- `src/test/responsive.test.tsx` - Responsive behavior integration tests
- `src/test/setup.ts` - Test environment configuration

### Configuration

- `vitest.config.ts` - Vitest configuration with coverage
- `src/test/setup.ts` - Test setup with mocks for DOM APIs

## Running Tests

```bash
# Run tests in watch mode
npm run test

# Run tests once
npm run test -- --run

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

## Test Coverage

Current test coverage focuses on:

- Custom hooks (`useIsMobile`, `useHasSidebar`)
- Component rendering and behavior
- Responsive breakpoint handling
- Event handling and user interactions
- Animation and layout switching

## Coverage Goals

The project is configured with 80% coverage thresholds for:

- Lines
- Functions
- Branches
- Statements

## Test Environment

- **Test Runner**: Vitest (fast, native ESM support)
- **Testing Library**: React Testing Library (user-centric testing)
- **DOM Environment**: Happy DOM (lightweight DOM implementation)
- **Mocking**: Vitest native mocking for window APIs

## Known Test Issues

Some tests are currently failing due to:

1. Complex window mocking in SSR scenarios
2. Responsive behavior testing edge cases
3. Component integration with mocked hooks

These are common challenges with testing responsive React components and can be addressed in future iterations.

## Test Best Practices

1. **Component Testing**: Focus on user interactions and behavior
2. **Hook Testing**: Test state changes and effects
3. **Integration Testing**: Test component collaboration
4. **Responsive Testing**: Test breakpoint behavior
5. **Accessibility Testing**: Ensure proper ARIA attributes and keyboard navigation

## Future Improvements

1. Fix failing SSR and window mocking tests
2. Add more comprehensive integration tests
3. Add accessibility testing with axe-core
4. Add visual regression testing
5. Improve test coverage to 90%+
