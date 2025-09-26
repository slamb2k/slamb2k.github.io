import React, { Suspense, lazy } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PortfolioLayout from '@/components/layout/PortfolioLayout';
import RouteErrorBoundary from '@/components/RouteErrorBoundary';

// Lazy load route components for better code splitting
const AboutPage = lazy(() => import('@/pages/AboutPage'));
const ExperiencePage = lazy(() => import('@/pages/ExperiencePage'));
const ProjectsPage = lazy(() => import('@/pages/ProjectsPage'));
const ContactPage = lazy(() => import('@/pages/ContactPage'));

// Loading component for Suspense fallback
const PageLoader = () => {
  const { t } = useTranslation();
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="animate-pulse text-muted-foreground">{t('common.loading')}</div>
    </div>
  );
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <PortfolioLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<PageLoader />}>
            <AboutPage />
          </Suspense>
        ),
      },
      {
        path: 'about',
        element: <Navigate to="/" replace />,
      },
      {
        path: 'experience',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ExperiencePage />
          </Suspense>
        ),
      },
      {
        path: 'projects',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ProjectsPage />
          </Suspense>
        ),
      },
      {
        path: 'contact',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ContactPage />
          </Suspense>
        ),
      },
      {
        path: '*',
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);

const AppRouter: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
