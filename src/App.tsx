import { useMemo, useEffect } from 'react';
import { Container, Theme } from './settings/types';
import settings from './settings/theme';
import AppRouter from './router/AppRouter';
import { EnvironmentInfo, PerformanceMonitor } from './components/debug';
import { initializePerformanceOptimizations } from './utils/preloader';

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
      <div className="h-full w-full flex flex-col items-center justify-center">
        {generatedComponent}
        <EnvironmentInfo />
        <PerformanceMonitor />
      </div>
    );
  } else {
    return (
      <>
        {generatedComponent}
        <EnvironmentInfo />
        <PerformanceMonitor />
      </>
    );
  }
}

export default App;
