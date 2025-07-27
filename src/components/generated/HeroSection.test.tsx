import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import HeroSection from './HeroSection';

// Mock Framer Motion to avoid animation complexity in tests
vi.mock('framer-motion', () => ({
  motion: {
    section: ({ children, initial, animate, transition, whileInView, viewport, className, ...props }: any) => 
      <section className={className} {...props}>{children}</section>,
    p: ({ children, initial, animate, transition, whileInView, viewport, className, ...props }: any) => 
      <p className={className} {...props}>{children}</p>,
    h1: ({ children, initial, animate, transition, whileInView, viewport, className, ...props }: any) => 
      <h1 className={className} {...props}>{children}</h1>,
    h2: ({ children, initial, animate, transition, whileInView, viewport, className, ...props }: any) => 
      <h2 className={className} {...props}>{children}</h2>,
    div: ({ children, initial, animate, transition, whileInView, viewport, className, ...props }: any) => 
      <div className={className} {...props}>{children}</div>,
    button: ({ children, initial, animate, transition, whileHover, whileTap, className, ...props }: any) => 
      <button className={className} {...props}>{children}</button>,
  },
}));

// Mock Lucide React icons
vi.mock('lucide-react', () => ({
  ArrowDown: () => <div data-testid="arrow-down-icon">↓</div>,
}));

// Mock scrollIntoView
const mockScrollIntoView = vi.fn();
Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
  value: mockScrollIntoView,
  writable: true,
});

describe('HeroSection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render hero content correctly', () => {
    render(<HeroSection />);
    
    // Check main text content
    expect(screen.getByText('Hi, my name is')).toBeInTheDocument();
    expect(screen.getByText('Simon Lamb.')).toBeInTheDocument();
    expect(screen.getByText('I build things using AI.')).toBeInTheDocument();
    
    // Check description text
    expect(screen.getByText(/I'm a software engineer specializing in building/)).toBeInTheDocument();
  });

  it('should have proper CSS classes for styling', () => {
    render(<HeroSection />);
    
    const heading = screen.getByText('Simon Lamb.');
    expect(heading).toHaveClass('text-5xl', 'lg:text-7xl', 'font-bold', 'text-slate-100');
    
    const introduction = screen.getByText('Hi, my name is');
    expect(introduction).toHaveClass('text-teal-300', 'font-mono', 'text-sm');
  });

  it('should have scroll to about functionality', () => {
    // Mock getElementById to return a mock element
    const mockAboutSection = {
      scrollIntoView: mockScrollIntoView,
    };
    
    vi.spyOn(document, 'getElementById').mockReturnValue(mockAboutSection as any);
    
    render(<HeroSection />);
    
    // Find and click the scroll down button
    const scrollButton = screen.getByRole('button');
    fireEvent.click(scrollButton);
    
    // Verify scroll functionality was called
    expect(document.getElementById).toHaveBeenCalledWith('about');
    expect(mockScrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth'
    });
  });

  it('should handle missing about section gracefully', () => {
    // Mock getElementById to return null
    vi.spyOn(document, 'getElementById').mockReturnValue(null);
    
    render(<HeroSection />);
    
    const scrollButton = screen.getByRole('button');
    
    // Should not throw error when about section is not found
    expect(() => fireEvent.click(scrollButton)).not.toThrow();
    expect(document.getElementById).toHaveBeenCalledWith('about');
    expect(mockScrollIntoView).not.toHaveBeenCalled();
  });

  it('should render with proper semantic structure', () => {
    render(<HeroSection />);
    
    // Should have a main heading
    const mainHeading = screen.getByRole('heading', { level: 1 });
    expect(mainHeading).toHaveTextContent('Simon Lamb.');
    
    // Should have a secondary heading
    const secondaryHeading = screen.getByRole('heading', { level: 2 });
    expect(secondaryHeading).toBeInTheDocument();
    
    // Should have a button for interaction
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('should have proper button for accessibility', () => {
    render(<HeroSection />);
    
    const scrollButton = screen.getByRole('button');
    expect(scrollButton).toBeInTheDocument();
    expect(scrollButton).toHaveTextContent('Check out my work!');
  });
});