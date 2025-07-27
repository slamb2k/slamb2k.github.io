import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ArrowDown, Mail } from 'lucide-react';
import Button from './Button';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    button: ({ children, whileHover, whileTap, ...props }: any) => <button {...props}>{children}</button>,
    a: ({ children, whileHover, whileTap, ...props }: any) => <a {...props}>{children}</a>,
  },
}));

describe('Button', () => {
  it('renders children correctly', () => {
    render(<Button>Test Button</Button>);
    expect(screen.getByText('Test Button')).toBeInTheDocument();
  });

  it('renders as a button by default', () => {
    render(<Button>Test Button</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('renders as a link when href is provided', () => {
    render(<Button href="https://example.com">Test Link</Button>);
    expect(screen.getByRole('link')).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('href', 'https://example.com');
  });

  it('applies primary variant styles by default', () => {
    render(<Button>Primary Button</Button>);
    const button = screen.getByRole('button');
    expect(button.className).toContain('bg-teal-300');
    expect(button.className).toContain('text-slate-900');
  });

  it('applies outline variant styles', () => {
    render(<Button variant="outline">Outline Button</Button>);
    const button = screen.getByRole('button');
    expect(button.className).toContain('border-teal-300');
    expect(button.className).toContain('text-teal-300');
  });

  it('applies ghost variant styles', () => {
    render(<Button variant="ghost">Ghost Button</Button>);
    const button = screen.getByRole('button');
    expect(button.className).toContain('text-slate-400');
  });

  it('applies different size classes', () => {
    const { rerender } = render(<Button size="sm">Small Button</Button>);
    expect(screen.getByRole('button').className).toContain('px-4');
    expect(screen.getByRole('button').className).toContain('py-2');

    rerender(<Button size="lg">Large Button</Button>);
    expect(screen.getByRole('button').className).toContain('px-8');
    expect(screen.getByRole('button').className).toContain('py-4');
  });

  it('renders icon on the right by default', () => {
    render(<Button icon={ArrowDown}>Button with Icon</Button>);
    const button = screen.getByRole('button');
    const icon = button.querySelector('svg');
    expect(icon).toBeInTheDocument();
    // Icon should be the last child
    expect(button.lastElementChild).toBe(icon);
  });

  it('renders icon on the left when specified', () => {
    render(<Button icon={Mail} iconPosition="left">Button with Icon</Button>);
    const button = screen.getByRole('button');
    const icon = button.querySelector('svg');
    expect(icon).toBeInTheDocument();
    // Icon should be the first child
    expect(button.firstElementChild).toBe(icon);
  });

  it('handles onClick events', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Clickable Button</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies disabled state correctly', () => {
    const handleClick = vi.fn();
    render(<Button disabled onClick={handleClick}>Disabled Button</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button.className).toContain('disabled:opacity-50');
    
    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('applies custom className', () => {
    render(<Button className="custom-class">Custom Button</Button>);
    expect(screen.getByRole('button').className).toContain('custom-class');
  });

  it('sets aria-label when provided', () => {
    render(<Button aria-label="Custom aria label">Button</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Custom aria label');
  });

  it('applies target and rel attributes to links', () => {
    render(
      <Button href="https://example.com" target="_blank" rel="noopener noreferrer">
        External Link
      </Button>
    );
    
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders different icon sizes based on button size', () => {
    const { rerender } = render(<Button icon={ArrowDown} size="sm">Small</Button>);
    let icon = screen.getByRole('button').querySelector('svg');
    expect(icon).toHaveAttribute('width', '14');
    expect(icon).toHaveAttribute('height', '14');

    rerender(<Button icon={ArrowDown} size="lg">Large</Button>);
    icon = screen.getByRole('button').querySelector('svg');
    expect(icon).toHaveAttribute('width', '18');
    expect(icon).toHaveAttribute('height', '18');
  });

  it('includes group class for hover effects', () => {
    render(<Button>Button</Button>);
    expect(screen.getByRole('button').className).toContain('group');
  });
});