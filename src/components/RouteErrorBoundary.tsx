import React from 'react';
import { useRouteError, isRouteErrorResponse, useNavigate } from 'react-router-dom';
import { AlertCircle, Home, ArrowLeft } from 'lucide-react';

/**
 * Error boundary specifically for React Router route errors
 * This handles errors at the route level
 */
export const RouteErrorBoundary: React.FC = () => {
  const error = useRouteError();
  const navigate = useNavigate();

  const getErrorMessage = () => {
    if (isRouteErrorResponse(error)) {
      switch (error.status) {
        case 404:
          return {
            title: 'Page Not Found',
            message: "Sorry, the page you're looking for doesn't exist.",
            statusCode: '404',
          };
        case 401:
          return {
            title: 'Unauthorized',
            message: 'You need to be logged in to access this page.',
            statusCode: '401',
          };
        case 403:
          return {
            title: 'Forbidden',
            message: "You don't have permission to access this page.",
            statusCode: '403',
          };
        case 500:
          return {
            title: 'Server Error',
            message: 'Something went wrong on our servers. Please try again later.',
            statusCode: '500',
          };
        default:
          return {
            title: 'Error',
            message: error.data?.message || error.statusText || 'An unexpected error occurred.',
            statusCode: error.status.toString(),
          };
      }
    } else if (error instanceof Error) {
      return {
        title: 'Application Error',
        message: error.message,
        statusCode: null,
      };
    } else {
      return {
        title: 'Unknown Error',
        message: 'An unexpected error occurred.',
        statusCode: null,
      };
    }
  };

  const { title, message, statusCode } = getErrorMessage();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-slate-900">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="flex justify-center">
          <div className="relative">
            <AlertCircle className="h-20 w-20 text-red-500" />
            {statusCode && (
              <span className="absolute -bottom-2 -right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                {statusCode}
              </span>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-slate-100">{title}</h1>
          <p className="text-slate-400">{message}</p>
        </div>

        {/* Show error stack in development */}
        {process.env.NODE_ENV === 'development' && error instanceof Error && (
          <div className="mt-4 p-4 bg-slate-800 rounded-lg text-left">
            <details className="text-xs text-slate-500">
              <summary className="cursor-pointer hover:text-slate-400 font-mono">
                Error Details
              </summary>
              <pre className="mt-2 overflow-auto max-h-64 text-red-400">{error.stack}</pre>
            </details>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <button
            onClick={handleGoBack}
            className="inline-flex items-center justify-center px-6 py-3 border border-slate-700 text-base font-medium rounded-md text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-slate-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 focus:ring-offset-slate-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Go Back
          </button>

          <button
            onClick={handleGoHome}
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-slate-900 bg-teal-400 hover:bg-teal-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 focus:ring-offset-slate-900 transition-colors"
          >
            <Home className="w-5 h-5 mr-2" />
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default RouteErrorBoundary;
