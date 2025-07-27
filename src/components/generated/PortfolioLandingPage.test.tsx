import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PortfolioLandingPage from './PortfolioLandingPage';
import { portfolioData } from '@/data/portfolio';

// Mock the child components
vi.mock('./SidebarNavigation', () => ({
  default: ({ activeSection, onSectionClick }: any) => (
    <div data-testid="sidebar-navigation">
      <div data-testid="active-section">{activeSection}</div>
      <button onClick={() => onSectionClick('about')}>About</button>
      <button onClick={() => onSectionClick('projects')}>Projects</button>
    </div>
  ),
}));

vi.mock('./HeroSection', () => ({
  default: () => <div data-testid="hero-section">Hero Section</div>,
}));

vi.mock('./ProjectsSection', () => ({
  default: () => <div data-testid="projects-section" id="projects">Projects Section</div>,
}));

vi.mock('./ContactSection', () => ({
  default: () => <div data-testid="contact-section" id="contact">Contact Section</div>,
}));

// Mock the useHasSidebar hook
vi.mock('@/hooks/use-mobile', () => ({
  useHasSidebar: () => mockHasSidebar,
}));

let mockHasSidebar = true;

describe('PortfolioLandingPage', () => {
  beforeEach(() => {
    mockHasSidebar = true;
    vi.clearAllMocks();
    // Reset scroll position
    window.scrollY = 0;
  });

  it('should render all sections', () => {
    render(<PortfolioLandingPage />);
    
    expect(screen.getByTestId('hero-section')).toBeInTheDocument();
    expect(screen.getByTestId('projects-section')).toBeInTheDocument();
    expect(screen.getByTestId('contact-section')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Experience')).toBeInTheDocument();
  });

  it('should show sidebar on desktop', () => {
    mockHasSidebar = true;
    render(<PortfolioLandingPage />);
    
    expect(screen.getByTestId('sidebar-navigation')).toBeInTheDocument();
    expect(screen.queryByText(portfolioData.personal.name)).not.toBeInTheDocument(); // Mobile header should not be visible
  });

  it('should show mobile header on mobile', () => {
    mockHasSidebar = false;
    render(<PortfolioLandingPage />);
    
    expect(screen.queryByTestId('sidebar-navigation')).not.toBeInTheDocument();
    expect(screen.getByText(portfolioData.personal.name)).toBeInTheDocument(); // Mobile header should be visible
  });

  it('should update active section on scroll', async () => {
    render(<PortfolioLandingPage />);
    
    // Create mock elements with getBoundingClientRect
    const aboutElement = document.createElement('div');
    aboutElement.id = 'about';
    Object.defineProperty(aboutElement, 'offsetTop', { value: 0, writable: true });
    Object.defineProperty(aboutElement, 'offsetHeight', { value: 500, writable: true });
    document.body.appendChild(aboutElement);

    const projectsElement = document.createElement('div');
    projectsElement.id = 'projects';
    Object.defineProperty(projectsElement, 'offsetTop', { value: 1000, writable: true });
    Object.defineProperty(projectsElement, 'offsetHeight', { value: 500, writable: true });
    document.body.appendChild(projectsElement);

    // Initial state should be 'about'
    expect(screen.getByTestId('active-section')).toHaveTextContent('about');

    // Simulate scrolling to projects section
    Object.defineProperty(window, 'scrollY', { value: 950, writable: true });
    fireEvent.scroll(window);

    await waitFor(() => {
      expect(screen.getByTestId('active-section')).toHaveTextContent('projects');
    });

    // Cleanup
    document.body.removeChild(aboutElement);
    document.body.removeChild(projectsElement);
  });

  it('should handle section navigation click', () => {
    const scrollIntoViewMock = vi.fn();
    window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;

    render(<PortfolioLandingPage />);

    // Create mock element for projects section
    const projectsElement = document.createElement('div');
    projectsElement.id = 'projects';
    document.body.appendChild(projectsElement);

    // Click on Projects navigation
    const projectsButton = screen.getByText('Projects');
    fireEvent.click(projectsButton);

    expect(scrollIntoViewMock).toHaveBeenCalledWith({ behavior: 'smooth' });
    expect(screen.getByTestId('active-section')).toHaveTextContent('projects');

    // Cleanup
    document.body.removeChild(projectsElement);
  });

  it('should render about section with portfolio data', () => {
    render(<PortfolioLandingPage />);
    
    // Check if about content is rendered
    portfolioData.personal.about.forEach((paragraph) => {
      const parts = paragraph.split('Upstatement');
      parts.forEach((part, index) => {
        if (part) {
          expect(screen.getByText(part, { exact: false })).toBeInTheDocument();
        }
      });
    });
  });

  it('should render experience section with portfolio data', () => {
    render(<PortfolioLandingPage />);
    
    // Check if experience data is rendered
    portfolioData.experience.forEach((job) => {
      expect(screen.getByText(job.title + ' · ' + job.company)).toBeInTheDocument();
      expect(screen.getByText(job.description)).toBeInTheDocument();
      expect(screen.getByText(job.period)).toBeInTheDocument();
      
      job.technologies.forEach((tech) => {
        expect(screen.getByText(tech)).toBeInTheDocument();
      });
    });
  });

  it('should apply correct layout classes based on sidebar visibility', () => {
    const { container, rerender } = render(<PortfolioLandingPage />);
    
    // Desktop layout
    mockHasSidebar = true;
    rerender(<PortfolioLandingPage />);
    const mainDesktop = container.querySelector('main');
    expect(mainDesktop?.className).toContain('lg:ml-96');
    expect(mainDesktop?.className).not.toContain('pt-20');

    // Mobile layout
    mockHasSidebar = false;
    rerender(<PortfolioLandingPage />);
    const mainMobile = container.querySelector('main');
    expect(mainMobile?.className).toContain('pt-20');
    expect(mainMobile?.className).not.toContain('lg:ml-96');
  });

  it('should render with proper motion animations', () => {
    const { container } = render(<PortfolioLandingPage />);
    
    // Check for motion.section elements
    const sections = container.querySelectorAll('section');
    expect(sections.length).toBeGreaterThan(0);
    
    // About section should have motion props
    const aboutSection = container.querySelector('#about');
    expect(aboutSection).toBeInTheDocument();
  });
});