import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import PortfolioLayout from '@/components/layout/PortfolioLayout';
import AboutPage from '@/pages/AboutPage';
import ExperiencePage from '@/pages/ExperiencePage';
import ProjectsPage from '@/pages/ProjectsPage';
import ContactPage from '@/pages/ContactPage';
import RouteErrorBoundary from '@/components/RouteErrorBoundary';

const router = createBrowserRouter([
  {
    path: '/',
    element: <PortfolioLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        index: true,
        element: <AboutPage />,
      },
      {
        path: 'about',
        element: <Navigate to="/" replace />,
      },
      {
        path: 'experience',
        element: <ExperiencePage />,
      },
      {
        path: 'projects',
        element: <ProjectsPage />,
      },
      {
        path: 'contact',
        element: <ContactPage />,
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
