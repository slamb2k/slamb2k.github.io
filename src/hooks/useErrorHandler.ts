import { useCallback } from 'react';

interface ErrorInfo {
  componentStack?: string;
  [key: string]: unknown;
}

interface UseErrorHandlerOptions {
  onError?: (error: Error, errorInfo?: ErrorInfo) => void;
  resetKeys?: unknown[];
  resetOnChange?: boolean;
}

/**
 * Custom hook for handling errors in functional components
 * Can be used with react-error-boundary or custom error handling logic
 */
export const useErrorHandler = (options: UseErrorHandlerOptions = {}) => {
  const { onError, resetKeys = [], resetOnChange = true } = options;

  const resetError = useCallback(() => {
    // This would typically be provided by an error boundary
    // For now, we'll reload the page as a fallback
    window.location.reload();
  }, []);

  const captureError = useCallback(
    (error: Error, errorInfo?: ErrorInfo) => {
      // Log to console in development
      if (process.env.NODE_ENV === 'development') {
        console.error('Error captured:', error, errorInfo);
      }

      // Call custom error handler if provided
      if (onError) {
        onError(error, errorInfo);
      }

      // In production, you might want to send to an error tracking service
      // Example: sendToErrorTrackingService(error, errorInfo);
    },
    [onError]
  );

  return {
    resetError,
    captureError,
  };
};

/**
 * Hook to throw errors that will be caught by error boundaries
 * Useful for handling async errors or errors in event handlers
 */
export const useAsyncError = () => {
  const captureError = useCallback((error: Error) => {
    // This will cause the error to be caught by the nearest error boundary
    setTimeout(() => {
      throw error;
    });
  }, []);

  return captureError;
};
