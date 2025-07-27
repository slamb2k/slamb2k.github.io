import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import ProjectsSection from './ProjectsSection';

// Mock portfolio data
vi.mock('@/data/portfolio', () => ({
  portfolioData: {
    projects: [
      {
        title: 'E-Commerce Platform',
        description: 'Full-stack e-commerce solution',
        technologies: ['React', 'Node.js', 'MongoDB'],
        link: 'https://example.com/ecommerce'
      },
      {
        title: 'Task Management App',
        description: 'Collaborative task management tool',
        technologies: ['TypeScript', 'Express', 'PostgreSQL'],
        link: 'https://example.com/tasks'
      },
      {
        title: 'Weather Dashboard',
        description: 'Real-time weather monitoring',
        technologies: ['Vue.js', 'API Integration', 'Chart.js'],
        link: 'https://example.com/weather'
      }
    ]
  }
}));

// Mock Framer Motion
vi.mock('framer-motion', () => ({
  motion: {
    section: ({ children, initial, whileInView, transition, viewport, className, ...props }: any) => 
      <section className={className} {...props}>{children}</section>,
    div: ({ children, initial, whileInView, transition, viewport, whileHover, className, ...props }: any) => 
      <div className={className} {...props}>{children}</div>,
    h3: ({ children, initial, whileInView, transition, viewport, className, ...props }: any) => 
      <h3 className={className} {...props}>{children}</h3>,
    p: ({ children, initial, whileInView, transition, viewport, className, ...props }: any) => 
      <p className={className} {...props}>{children}</p>,
    img: ({ initial, whileInView, transition, viewport, className, alt, ...props }: any) => 
      <img className={className} alt={alt || 'test'} {...props} />,
    a: ({ children, whileHover, className, ...props }: any) => 
      <a className={className} {...props}>{children}</a>,
  },
}));

// Mock Lucide React icons
vi.mock('lucide-react', () => ({
  ExternalLink: () => <div data-testid="external-icon">↗</div>,
  Github: () => <div data-testid="github-icon">⚡</div>,
}));

describe('ProjectsSection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render projects section with proper heading', () => {
    render(<ProjectsSection />);
    
    expect(screen.getByText('Things I\'ve built')).toBeInTheDocument();
    expect(screen.getByText(/Some of my featured work/)).toBeInTheDocument();
  });

  it('should render featured projects from portfolio data', () => {
    render(<ProjectsSection />);
    
    // Check if the first 3 projects from mock data are rendered
    expect(screen.getByText('E-Commerce Platform')).toBeInTheDocument();
    expect(screen.getByText('Task Management App')).toBeInTheDocument();
    expect(screen.getByText('Weather Dashboard')).toBeInTheDocument();
    
    // Check descriptions
    expect(screen.getByText('Full-stack e-commerce solution')).toBeInTheDocument();
    expect(screen.getByText('Collaborative task management tool')).toBeInTheDocument();
    expect(screen.getByText('Real-time weather monitoring')).toBeInTheDocument();
  });

  it('should render technologies for each project', () => {
    render(<ProjectsSection />);
    
    // Check various technologies are displayed
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('Node.js')).toBeInTheDocument();
    expect(screen.getByText('MongoDB')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('Vue.js')).toBeInTheDocument();
  });

  it('should render other notable projects', () => {
    render(<ProjectsSection />);
    
    // Check for additional projects
    expect(screen.getByText('Other Noteworthy Projects')).toBeInTheDocument();
    expect(screen.getByText('Integrating Algolia Search')).toBeInTheDocument();
    expect(screen.getByText('React Profile')).toBeInTheDocument();
    expect(screen.getByText('Lonely Planet DBMS')).toBeInTheDocument();
  });

  it('should have proper section structure with id', () => {
    render(<ProjectsSection />);
    
    const section = screen.getByRole('region', { name: /projects/i });
    expect(section).toHaveAttribute('id', 'projects');
  });

  it('should render external links for projects', () => {
    render(<ProjectsSection />);
    
    // Check for links (GitHub and external links)
    const links = screen.getAllByRole('link');
    expect(links.length).toBeGreaterThan(0);
    
    // Check for GitHub and external link icons
    const githubIcons = screen.getAllByTestId('github-icon');
    const externalIcons = screen.getAllByTestId('external-icon');
    
    expect(githubIcons.length).toBeGreaterThan(0);
    expect(externalIcons.length).toBeGreaterThan(0);
  });

  it('should render project images with proper alt text', () => {
    render(<ProjectsSection />);
    
    const images = screen.getAllByRole('img');
    expect(images.length).toBeGreaterThan(0);
    
    // Check first image
    const firstImage = images[0];
    expect(firstImage).toHaveAttribute('alt');
    expect(firstImage).toHaveAttribute('src');
  });

  it('should have proper responsive layout classes', () => {
    render(<ProjectsSection />);
    
    // Check for section structure - use more flexible selectors
    const section = screen.getByRole('region');
    expect(section).toBeInTheDocument();
    
    // Check for grid layout existence
    const gridElements = document.querySelectorAll('.grid, .space-y-24');
    expect(gridElements.length).toBeGreaterThan(0);
  });

  it('should handle projects without external links gracefully', () => {
    render(<ProjectsSection />);
    
    // The Lonely Planet DBMS project only has GitHub, no external link
    expect(screen.getByText('Lonely Planet DBMS')).toBeInTheDocument();
    
    // Should still render without throwing errors
    expect(() => screen.getByText('Lonely Planet DBMS')).not.toThrow();
  });
});