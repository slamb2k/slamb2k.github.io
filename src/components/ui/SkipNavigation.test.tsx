import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/react';
import SkipNavigation from './SkipNavigation';

describe('SkipNavigation', () => {
  beforeEach(() => {
    // Clear the DOM before each test
    document.body.innerHTML = '';
  });

  it('renders skip navigation link', () => {
    render(<SkipNavigation />);
    
    const skipLink = screen.getByText('Skip to main content');
    expect(skipLink).toBeInTheDocument();
  });

  it('uses default main content ID when not specified', () => {
    render(<SkipNavigation />);
    
    const skipLink = screen.getByText('Skip to main content');
    expect(skipLink).toHaveAttribute('href', '#main-content');
  });

  it('uses custom main content ID when specified', () => {
    render(<SkipNavigation mainContentId="custom-main" />);
    
    const skipLink = screen.getByText('Skip to main content');
    expect(skipLink).toHaveAttribute('href', '#custom-main');
  });

  it('applies additional CSS classes', () => {
    const { container } = render(<SkipNavigation className="custom-class" />);
    
    const skipContainer = container.querySelector('.skip-navigation');
    expect(skipContainer).toHaveClass('custom-class');
  });

  it('has proper accessibility attributes', () => {
    render(<SkipNavigation />);
    
    const skipLink = screen.getByText('Skip to main content');
    expect(skipLink).toHaveAttribute('tabIndex', '0');
    expect(skipLink).toHaveClass('sr-only');
  });

  it('becomes visible when focused', () => {
    render(<SkipNavigation />);
    
    const skipLink = screen.getByText('Skip to main content');
    
    // Initially screen-reader only
    expect(skipLink).toHaveClass('sr-only');
    
    // Should have focus styles that make it visible
    expect(skipLink).toHaveClass('focus:not-sr-only');
    expect(skipLink).toHaveClass('focus:absolute');
  });

  it('handles click to skip to main content', () => {
    // Create a main content element
    const mainElement = document.createElement('main');
    mainElement.id = 'main-content';
    mainElement.setAttribute('tabIndex', '-1');
    document.body.appendChild(mainElement);
    
    // Mock the focus and scrollIntoView methods
    const focusMock = vi.fn();
    const scrollIntoViewMock = vi.fn();
    mainElement.focus = focusMock;
    mainElement.scrollIntoView = scrollIntoViewMock;
    
    render(<SkipNavigation />);
    
    const skipLink = screen.getByText('Skip to main content');
    fireEvent.click(skipLink);
    
    expect(focusMock).toHaveBeenCalled();
    expect(scrollIntoViewMock).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'start',
    });
  });

  it('handles click with custom main content ID', () => {
    // Create a main content element with custom ID
    const mainElement = document.createElement('main');
    mainElement.id = 'custom-main';
    mainElement.setAttribute('tabIndex', '-1');
    document.body.appendChild(mainElement);
    
    // Mock the focus and scrollIntoView methods
    const focusMock = vi.fn();
    const scrollIntoViewMock = vi.fn();
    mainElement.focus = focusMock;
    mainElement.scrollIntoView = scrollIntoViewMock;
    
    render(<SkipNavigation mainContentId="custom-main" />);
    
    const skipLink = screen.getByText('Skip to main content');
    fireEvent.click(skipLink);
    
    expect(focusMock).toHaveBeenCalled();
    expect(scrollIntoViewMock).toHaveBeenCalled();
  });

  it('handles click when main content element does not exist', () => {
    // Don't create any main content element
    render(<SkipNavigation />);
    
    const skipLink = screen.getByText('Skip to main content');
    
    // Should not throw an error when main content doesn't exist
    expect(() => {
      fireEvent.click(skipLink);
    }).not.toThrow();
  });

  it('prevents default link behavior on click', () => {
    render(<SkipNavigation />);
    
    const skipLink = screen.getByText('Skip to main content');
    const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true });
    
    // Mock preventDefault
    const preventDefaultSpy = vi.spyOn(clickEvent, 'preventDefault');
    
    fireEvent(skipLink, clickEvent);
    
    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  it('has proper styling for visibility and focus states', () => {
    render(<SkipNavigation />);
    
    const skipLink = screen.getByText('Skip to main content');
    
    // Check for proper styling classes
    expect(skipLink).toHaveClass('sr-only'); // Hidden by default
    expect(skipLink).toHaveClass('focus:not-sr-only'); // Visible on focus
    expect(skipLink).toHaveClass('focus:absolute'); // Positioned absolutely on focus
    expect(skipLink).toHaveClass('focus:top-4'); // Proper positioning
    expect(skipLink).toHaveClass('focus:left-4');
    expect(skipLink).toHaveClass('focus:z-50'); // High z-index
    expect(skipLink).toHaveClass('focus:bg-teal-300'); // Visible background
    expect(skipLink).toHaveClass('focus:text-slate-900'); // Contrasting text
  });
});