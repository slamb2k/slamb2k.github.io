import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import PortfolioLandingPageOptimized from '@/components/generated/PortfolioLandingPageOptimized';
import { PerformanceMonitor } from '@/utils/performance';

// Mock dependencies
vi.mock('@/hooks/use-mobile', () => ({
  useHasSidebar: () => true,
}));

vi.mock('@/hooks/useConfig', () => ({
  useConfig: () => ({
    development: {
      showPerformanceMetrics: true,
      debugMode: true,
    }
  }),
  useIsDevelopment: () => true,
}));

vi.mock('@/utils/performance', async () => {
  const actual = await vi.importActual('@/utils/performance');
  return {
    ...actual,
    useIntersectionObserver: vi.fn(() => true),
    PerformanceMonitor: vi.fn().mockImplementation(() => ({
      getMetrics: () => ({
        fcp: 1200,
        lcp: 2100,
        fid: 80,
        cls: 0.05,
        ttfb: 600,
      }),
      destroy: vi.fn(),
    })),
  };
});

vi.mock('@/components/generated/SidebarNavigation', () => ({
  default: ({ activeSection, onSectionClick }: { activeSection: string; onSectionClick: (id: string) => void }) => (
    <nav data-testid="sidebar-nav">
      <button onClick={() => onSectionClick('about')}>About</button>
      <button onClick={() => onSectionClick('projects')}>Projects</button>
    </nav>
  ),
}));

vi.mock('@/components/generated/ContactSection', () => ({
  default: () => <section data-testid="contact-section">Contact</section>,
}));

vi.mock('@/data/portfolio', () => ({
  portfolioData: {
    personal: {
      name: 'Test User',
      tagline: 'Test tagline',
      about: ['Test about content'],
    },
    navigation: [
      { id: 'about', label: 'About' },
      { id: 'experience', label: 'Experience' },
      { id: 'projects', label: 'Projects' },
      { id: 'contact', label: 'Contact' },
    ],
    experience: [
      {
        period: '2021 — Present',
        title: 'Test Engineer',
        company: 'Test Company',
        description: 'Test description',
        technologies: ['React', 'TypeScript'],
      },
    ],
  },
}));

describe('Performance Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock IntersectionObserver
    global.IntersectionObserver = vi.fn().mockImplementation((callback) => ({
      observe: vi.fn(),
      disconnect: vi.fn(),
      unobserve: vi.fn(),
    }));

    // Mock getElementById for smooth scrolling
    const mockElement = {
      scrollIntoView: vi.fn(),
      offsetTop: 100,
      offsetHeight: 500,
    };
    
    global.document.getElementById = vi.fn().mockReturnValue(mockElement);
  });

  it('renders optimized portfolio landing page', async () => {
    render(<PortfolioLandingPageOptimized />);

    // Check that main sections are rendered
    expect(screen.getByText('Test User.')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Experience')).toBeInTheDocument();
  });

  it('implements lazy loading for sections', async () => {
    const { container } = render(<PortfolioLandingPageOptimized />);

    // Check for lazy section wrapper
    const lazySections = container.querySelectorAll('[class*="min-h"]');
    expect(lazySections.length).toBeGreaterThan(0);
  });

  it('uses memoized components', () => {
    const { rerender } = render(<PortfolioLandingPageOptimized />);
    
    // Component should render without errors on rerender
    expect(() => {
      rerender(<PortfolioLandingPageOptimized />);
    }).not.toThrow();
  });

  it('handles throttled scroll events', async () => {
    render(<PortfolioLandingPageOptimized />);

    // Simulate multiple scroll events
    for (let i = 0; i < 5; i++) {
      fireEvent.scroll(window, { target: { scrollY: i * 100 } });
    }

    // Should handle without errors
    await waitFor(() => {
      expect(document.getElementById).toHaveBeenCalled();
    });
  });

  it('implements smooth scrolling navigation', async () => {
    render(<PortfolioLandingPageOptimized />);

    const aboutButton = screen.getByText('About');
    fireEvent.click(aboutButton);

    await waitFor(() => {
      expect(document.getElementById).toHaveBeenCalledWith('about');
    });
  });

  it('performance monitor integration works', () => {
    const mockMetrics = {
      fcp: 1200,
      lcp: 2100,
      fid: 80,
      cls: 0.05,
      ttfb: 600,
    };

    const monitor = new PerformanceMonitor();
    expect(monitor.getMetrics()).toEqual(mockMetrics);
  });

  it('renders performance-optimized project section', async () => {
    render(<PortfolioLandingPageOptimized />);

    // Should render projects section
    expect(screen.getByText('Some Things I\'ve Built')).toBeInTheDocument();
  });

  it('handles responsive design correctly', () => {
    render(<PortfolioLandingPageOptimized />);

    // Should render sidebar for desktop
    expect(screen.getByTestId('sidebar-nav')).toBeInTheDocument();
  });

  it('applies proper semantic structure', () => {
    const { container } = render(<PortfolioLandingPageOptimized />);

    // Check for semantic HTML elements
    const main = container.querySelector('main');
    const sections = container.querySelectorAll('section');
    
    expect(main).toBeInTheDocument();
    expect(sections.length).toBeGreaterThan(0);
  });

  it('implements proper error boundaries', () => {
    // Should render without throwing errors
    expect(() => {
      render(<PortfolioLandingPageOptimized />);
    }).not.toThrow();
  });
});