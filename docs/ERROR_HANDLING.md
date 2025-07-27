# Error Handling Guide

This guide explains the error handling infrastructure in component-forge.

## Error Boundaries

### Global Error Boundary

The application is wrapped with a global `ErrorBoundary` component that catches JavaScript errors anywhere in the component tree.

**Location**: `src/components/ErrorBoundary.tsx`

**Features**:

- Catches and displays user-friendly error messages
- Shows detailed error information in development mode
- Provides "Try Again" and "Go Home" actions
- Supports custom fallback UI
- Optional error callback for logging/reporting

**Usage**:

```tsx
import ErrorBoundary from '@/components/ErrorBoundary';

// Basic usage (already implemented in App.tsx)
<ErrorBoundary>
  <YourApp />
</ErrorBoundary>

// With custom fallback
<ErrorBoundary fallback={<CustomErrorUI />}>
  <YourComponent />
</ErrorBoundary>

// With error handler
<ErrorBoundary onError={(error, errorInfo) => {
  // Log to error reporting service
  logErrorToService(error, errorInfo);
}}>
  <YourComponent />
</ErrorBoundary>
```

### Route Error Boundary

React Router errors are handled by `RouteErrorBoundary`, which provides specific handling for different HTTP status codes.

**Location**: `src/components/RouteErrorBoundary.tsx`

**Features**:

- Handles 404, 401, 403, 500 errors with specific messages
- Shows appropriate error UI based on error type
- Provides navigation options (Go Back, Go Home)
- Development mode shows error stack traces

**Usage** (already configured in AppRouter.tsx):

```tsx
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <RouteErrorBoundary />,
    children: [...]
  }
]);
```

## Error Handling Hooks

### useErrorHandler

Custom hook for handling errors in functional components.

**Location**: `src/hooks/useErrorHandler.ts`

**Usage**:

```tsx
import { useErrorHandler } from '@/hooks/useErrorHandler';

function MyComponent() {
  const { captureError, resetError } = useErrorHandler({
    onError: (error, errorInfo) => {
      console.error('Component error:', error);
    },
  });

  const handleAsyncOperation = async () => {
    try {
      await riskyOperation();
    } catch (error) {
      captureError(error);
    }
  };

  return (
    <div>
      <button onClick={handleAsyncOperation}>Perform Risky Operation</button>
      <button onClick={resetError}>Reset Error State</button>
    </div>
  );
}
```

### useAsyncError

Hook for throwing errors from async operations or event handlers that will be caught by error boundaries.

**Usage**:

```tsx
import { useAsyncError } from '@/hooks/useErrorHandler';

function MyComponent() {
  const throwError = useAsyncError();

  const handleClick = async () => {
    try {
      await fetchData();
    } catch (error) {
      // This will be caught by the nearest error boundary
      throwError(error);
    }
  };

  return <button onClick={handleClick}>Fetch Data</button>;
}
```

## Best Practices

1. **Granular Error Boundaries**: Place error boundaries at strategic points in your component tree to isolate errors.

2. **Meaningful Error Messages**: Provide clear, user-friendly error messages that help users understand what went wrong.

3. **Error Recovery**: Always provide a way for users to recover from errors (reset, go back, go home).

4. **Logging**: In production, integrate with error tracking services (Sentry, LogRocket, etc.).

5. **Development vs Production**: Show detailed error information in development, but keep it minimal in production.

6. **Async Error Handling**: Use the `useAsyncError` hook for errors in async operations or event handlers.

## Testing Error Boundaries

The error boundaries come with comprehensive tests. Run them with:

```bash
npm test ErrorBoundary
```

## Common Error Scenarios

### Component Errors

```tsx
// This will be caught by the global ErrorBoundary
function BuggyComponent() {
  throw new Error('Component crashed!');
  return <div>Never renders</div>;
}
```

### Route Errors

```tsx
// This will be caught by RouteErrorBoundary
// Navigate to a non-existent route
<Link to="/non-existent-page">404 Page</Link>
```

### Async Errors

```tsx
// Use useAsyncError to handle these
async function fetchData() {
  const response = await fetch('/api/data');
  if (!response.ok) {
    throw new Error('Failed to fetch data');
  }
  return response.json();
}
```

## Integration with Error Tracking Services

To integrate with services like Sentry:

```tsx
// In your ErrorBoundary onError callback
onError={(error, errorInfo) => {
  if (process.env.NODE_ENV === 'production') {
    Sentry.captureException(error, {
      contexts: {
        react: {
          componentStack: errorInfo.componentStack
        }
      }
    });
  }
}}
```
