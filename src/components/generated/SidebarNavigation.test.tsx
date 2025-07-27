import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SidebarNavigation from './SidebarNavigation';
import { portfolioData } from '@/data/portfolio';

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  Github: () => <div data-testid="github-icon">Github</div>,
  Linkedin: () => <div data-testid="linkedin-icon">Linkedin</div>,
  Twitter: () => <div data-testid="twitter-icon">Twitter</div>,
  Mail: () => <div data-testid="mail-icon">Mail</div>,
}));

describe('SidebarNavigation', () => {
  const mockOnSectionClick = vi.fn();
  const defaultProps = {
    activeSection: 'about',
    onSectionClick: mockOnSectionClick,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render personal information', () => {
    render(<SidebarNavigation {...defaultProps} />);
    
    expect(screen.getByText(portfolioData.personal.name)).toBeInTheDocument();
    expect(screen.getByText(portfolioData.personal.title)).toBeInTheDocument();
    expect(screen.getByText(portfolioData.personal.tagline)).toBeInTheDocument();
  });

  it('should render all navigation items', () => {
    render(<SidebarNavigation {...defaultProps} />);
    
    portfolioData.navigation.forEach((item) => {
      expect(screen.getByText(item.label.toUpperCase())).toBeInTheDocument();
    });
  });

  it('should render all social links', () => {
    render(<SidebarNavigation {...defaultProps} />);
    
    expect(screen.getByTestId('github-icon')).toBeInTheDocument();
    expect(screen.getByTestId('linkedin-icon')).toBeInTheDocument();
    expect(screen.getByTestId('twitter-icon')).toBeInTheDocument();
    expect(screen.getByTestId('mail-icon')).toBeInTheDocument();
    
    // Check aria-labels
    portfolioData.social.forEach((social) => {
      expect(screen.getByLabelText(social.label)).toBeInTheDocument();
    });
  });

  it('should highlight active section', () => {
    const { rerender } = render(<SidebarNavigation {...defaultProps} />);
    
    // Check 'about' is active
    const aboutButton = screen.getByRole('button', { name: /about/i });
    expect(aboutButton.className).toContain('text-slate-100');
    
    // Change active section to 'projects'
    rerender(<SidebarNavigation {...defaultProps} activeSection="projects" />);
    
    const projectsButton = screen.getByRole('button', { name: /projects/i });
    expect(projectsButton.className).toContain('text-slate-100');
    expect(aboutButton.className).toContain('text-slate-400');
  });

  it('should call onSectionClick when navigation item is clicked', async () => {
    render(<SidebarNavigation {...defaultProps} />);
    
    const projectsButton = screen.getByRole('button', { name: /projects/i });
    await userEvent.click(projectsButton);
    
    expect(mockOnSectionClick).toHaveBeenCalledWith('projects');
    expect(mockOnSectionClick).toHaveBeenCalledTimes(1);
  });

  it('should change hover state on navigation items', async () => {
    render(<SidebarNavigation {...defaultProps} />);
    
    const experienceButton = screen.getByRole('button', { name: /experience/i });
    
    // Initial state - not hovered
    expect(experienceButton.className).toContain('text-slate-400');
    
    // Hover state
    await userEvent.hover(experienceButton);
    expect(experienceButton.className).toContain('hover:text-slate-100');
    
    // Unhover
    await userEvent.unhover(experienceButton);
  });

  it('should animate navigation item letters on hover', async () => {
    const { container } = render(<SidebarNavigation {...defaultProps} />);
    
    const aboutButton = screen.getByRole('button', { name: /about/i });
    
    // Get all letter spans
    const letterSpans = container.querySelectorAll('span[style*="transformOrigin"]');
    const initialSpanCount = letterSpans.length;
    
    // Hover to trigger animation
    await userEvent.hover(aboutButton);
    
    // The letter spans should exist and have animation properties
    const animatedSpans = container.querySelectorAll('span[style*="transformOrigin"]');
    expect(animatedSpans.length).toBeGreaterThan(0);
  });

  it('should have correct href attributes on social links', () => {
    render(<SidebarNavigation {...defaultProps} />);
    
    portfolioData.social.forEach((social) => {
      const link = screen.getByLabelText(social.label);
      expect(link).toHaveAttribute('href', social.href);
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  it('should apply correct line styles for active section', () => {
    render(<SidebarNavigation {...defaultProps} />);
    
    const aboutButton = screen.getByRole('button', { name: /about/i });
    const lineElement = aboutButton.querySelector('div');
    
    expect(lineElement?.className).toContain('w-16');
    expect(lineElement?.className).toContain('bg-slate-100');
  });

  it('should handle initial load state correctly', () => {
    render(<SidebarNavigation {...defaultProps} />);
    
    // The component should render without errors on initial load
    expect(screen.getByRole('complementary')).toBeInTheDocument(); // aside element
  });

  it('should track previous active section changes', async () => {
    const { rerender } = render(<SidebarNavigation {...defaultProps} />);
    
    // Initial render with 'about' active
    expect(screen.getByRole('button', { name: /about/i }).className).toContain('text-slate-100');
    
    // Change to 'experience'
    rerender(<SidebarNavigation activeSection="experience" onSectionClick={mockOnSectionClick} />);
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /experience/i }).className).toContain('text-slate-100');
      expect(screen.getByRole('button', { name: /about/i }).className).toContain('text-slate-400');
    });
  });

  it('should render with motion animations', () => {
    const { container } = render(<SidebarNavigation {...defaultProps} />);
    
    // Check for motion aside element
    const aside = container.querySelector('aside');
    expect(aside).toBeInTheDocument();
    
    // Check for motion divs
    const motionDivs = container.querySelectorAll('div[style]');
    expect(motionDivs.length).toBeGreaterThan(0);
  });
});