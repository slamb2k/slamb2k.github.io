import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import PortfolioLayout from '@/components/layout/PortfolioLayout';
import { AboutPage, ExperiencePage, ProjectsPage, ContactPage } from '@/pages';

// Mock the hooks
vi.mock('@/hooks/use-mobile', () => ({
  useHasSidebar: () => true, // Default to desktop view
}));

// Mock Framer Motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, ...props }: any) => 
      <div className={className} {...props}>{children}</div>,
    section: ({ children, className, ...props }: any) => 
      <section className={className} {...props}>{children}</section>,
    aside: ({ children, className, ...props }: any) => 
      <aside className={className} {...props}>{children}</aside>,
    header: ({ children, className, ...props }: any) => 
      <header className={className} {...props}>{children}</header>,
    a: ({ children, className, href, ...props }: any) => 
      <a className={className} href={href} {...props}>{children}</a>,
    span: ({ children, className, ...props }: any) => 
      <span className={className} {...props}>{children}</span>,
  },
  AnimatePresence: ({ children }: any) => children,
}));

// Mock Lucide React icons
vi.mock('lucide-react', () => ({
  Mail: () => <div data-testid="mail-icon">✉</div>,
  Github: () => <div data-testid="github-icon">📁</div>,
  Linkedin: () => <div data-testid="linkedin-icon">💼</div>,
  Twitter: () => <div data-testid="twitter-icon">🐦</div>,
  ExternalLink: () => <div data-testid="external-link-icon">🔗</div>,
  Menu: () => <div data-testid="menu-icon">☰</div>,
  X: () => <div data-testid="x-icon">✕</div>,
}));

describe('AppRouter', () => {
  const createRouterWithPath = (initialPath: string) => {
    return createMemoryRouter([
      {
        path: '/',
        element: <PortfolioLayout />,
        children: [
          {
            index: true,
            element: <AboutPage />
          },
          {
            path: 'experience',
            element: <ExperiencePage />
          },
          {
            path: 'projects',
            element: <ProjectsPage />
          },
          {
            path: 'contact',
            element: <ContactPage />
          }
        ]
      }
    ], {
      initialEntries: [initialPath]
    });
  };

  it('should render AboutPage on root path', () => {
    const router = createRouterWithPath('/');
    render(<RouterProvider router={router} />);
    
    expect(screen.getByText('Simon Lamb')).toBeInTheDocument();
    expect(screen.getByText('Hi, I\'m Simon Lamb.')).toBeInTheDocument();
  });

  it('should render ExperiencePage on /experience path', () => {
    const router = createRouterWithPath('/experience');
    render(<RouterProvider router={router} />);
    
    expect(screen.getByText('Experience')).toBeInTheDocument();
    expect(screen.getByText('Senior Frontend Engineer')).toBeInTheDocument();
  });

  it('should render ProjectsPage on /projects path', () => {
    const router = createRouterWithPath('/projects');
    render(<RouterProvider router={router} />);
    
    expect(screen.getByText('Projects')).toBeInTheDocument();
    expect(screen.getByText('E-Commerce Platform')).toBeInTheDocument();
  });

  it('should render ContactPage on /contact path', () => {
    const router = createRouterWithPath('/contact');
    render(<RouterProvider router={router} />);
    
    expect(screen.getByText('Get In Touch')).toBeInTheDocument();
    expect(screen.getByText('Say Hello')).toBeInTheDocument();
  });

  it('should have proper navigation structure', () => {
    const router = createRouterWithPath('/');
    render(<RouterProvider router={router} />);
    
    // Should have layout structure
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByText('Simon Lamb')).toBeInTheDocument();
  });
});