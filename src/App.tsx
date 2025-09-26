import { useMemo, useEffect, lazy, Suspense } from 'react';
import { Container, Theme } from './settings/types';
import settings from './settings/theme';
import AppRouter from './router/AppRouter';
import { initializePerformanceOptimizations } from './utils/preloader';
import ErrorBoundary from './components/ErrorBoundary';

// Lazy load debug components as they're not critical
const EnvironmentInfo = lazy(() => import('./components/debug/EnvironmentInfo'));
const PerformanceMonitor = lazy(() => import('./components/debug/PerformanceMonitor'));

function App() {
  // Use the injected theme settings instead of hardcoded values
  const theme: Theme = settings.theme;
  const container: Container = settings.container;

  useEffect(() => {
    // Apply theme on mount and when it changes
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Initialize performance optimizations
    initializePerformanceOptimizations();
  }, [theme]);

  const generatedComponent = useMemo(() => {
    // THIS IS WHERE THE TOP LEVEL GENRATED COMPONENT WILL BE RETURNED!
    return <AppRouter />; // %EXPORT_STATEMENT%
  }, []);

  if (container === 'centered') {
    return (
      <ErrorBoundary>
        <div className="h-full w-full flex flex-col items-center justify-center">
          {generatedComponent}
          <aside
            className="fixed bottom-4 right-4 z-50 flex items-end gap-2"
            aria-label="Debug information"
          >
            <Suspense fallback={null}>
              <PerformanceMonitor />
            </Suspense>
            <Suspense fallback={null}>
              <EnvironmentInfo />
            </Suspense>
          </aside>
        </div>
      </ErrorBoundary>
    );
  } else {
    return (
      <ErrorBoundary>
        {generatedComponent}
        <aside
          className="fixed bottom-4 right-4 z-50 flex items-end gap-2"
          aria-label="Debug information"
        >
          <PerformanceMonitor />
          <EnvironmentInfo />
        </aside>
      </ErrorBoundary>
    );
  }
}

export default App;
