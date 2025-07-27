import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Github, ExternalLink, Mail } from 'lucide-react';
import IconButton from './IconButton';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    button: ({ children, whileHover, whileTap, ...props }: any) => <button {...props}>{children}</button>,
    a: ({ children, whileHover, whileTap, ...props }: any) => <a {...props}>{children}</a>,
  },
}));

describe('IconButton', () => {
  it('renders icon correctly', () => {
    render(<IconButton icon={Github} aria-label="GitHub" />);
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByRole('button').querySelector('svg')).toBeInTheDocument();
  });

  it('requires aria-label for accessibility', () => {
    render(<IconButton icon={Github} aria-label="GitHub Repository" />);
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'GitHub Repository');
  });

  it('renders as a button by default', () => {
    render(<IconButton icon={Github} aria-label="GitHub" />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('renders as a link when href is provided', () => {
    render(<IconButton icon={ExternalLink} href="https://example.com" aria-label="External Link" />);
    expect(screen.getByRole('link')).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('href', 'https://example.com');
  });

  it('applies default variant styles', () => {
    render(<IconButton icon={Github} aria-label="GitHub" />);
    const button = screen.getByRole('button');
    expect(button.className).toContain('text-slate-400');
    expect(button.className).toContain('hover:text-teal-300');
  });

  it('applies ghost variant styles', () => {
    render(<IconButton icon={Github} variant="ghost" aria-label="GitHub" />);
    const button = screen.getByRole('button');
    expect(button.className).toContain('text-slate-400');
    expect(button.className).toContain('hover:text-teal-300');
    expect(button.className).not.toContain('hover:bg-teal-300/10');
  });

  it('applies outline variant styles', () => {
    render(<IconButton icon={Github} variant="outline" aria-label="GitHub" />);
    const button = screen.getByRole('button');
    expect(button.className).toContain('border');
    expect(button.className).toContain('border-slate-600');
    expect(button.className).toContain('hover:border-teal-300/50');
  });

  it('applies different size classes', () => {
    const { rerender } = render(<IconButton icon={Github} size="sm" aria-label="Small GitHub" />);
    expect(screen.getByRole('button').className).toContain('w-8');
    expect(screen.getByRole('button').className).toContain('h-8');

    rerender(<IconButton icon={Github} size="lg" aria-label="Large GitHub" />);
    expect(screen.getByRole('button').className).toContain('w-12');
    expect(screen.getByRole('button').className).toContain('h-12');
  });

  it('renders different icon sizes based on button size', () => {
    const { rerender } = render(<IconButton icon={Github} size="sm" aria-label="Small" />);
    let icon = screen.getByRole('button').querySelector('svg');
    expect(icon).toHaveAttribute('width', '16');
    expect(icon).toHaveAttribute('height', '16');

    rerender(<IconButton icon={Github} size="lg" aria-label="Large" />);
    icon = screen.getByRole('button').querySelector('svg');
    expect(icon).toHaveAttribute('width', '24');
    expect(icon).toHaveAttribute('height', '24');
  });

  it('handles onClick events', () => {
    const handleClick = vi.fn();
    render(<IconButton icon={Github} onClick={handleClick} aria-label="Clickable GitHub" />);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies disabled state correctly', () => {
    const handleClick = vi.fn();
    render(<IconButton icon={Github} disabled onClick={handleClick} aria-label="Disabled GitHub" />);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button.className).toContain('disabled:opacity-50');
    
    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('applies custom className', () => {
    render(<IconButton icon={Github} className="custom-class" aria-label="Custom GitHub" />);
    expect(screen.getByRole('button').className).toContain('custom-class');
  });

  it('applies target and rel attributes to links', () => {
    render(
      <IconButton 
        icon={ExternalLink} 
        href="https://example.com" 
        target="_blank" 
        rel="noopener noreferrer"
        aria-label="External Link"
      />
    );
    
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('applies different hover effects', () => {
    const { rerender } = render(
      <IconButton icon={Github} hoverEffect="scale" aria-label="Scale effect" />
    );
    let button = screen.getByRole('button');
    expect(button.className).toContain('group');

    rerender(<IconButton icon={Github} hoverEffect="translate" aria-label="Translate effect" />);
    button = screen.getByRole('button');
    let icon = button.querySelector('svg');
    expect(icon?.className).toContain('group-hover:translate-x-1');

    rerender(<IconButton icon={Github} hoverEffect="rotate" aria-label="Rotate effect" />);
    button = screen.getByRole('button');
    icon = button.querySelector('svg');
    expect(icon?.className).toContain('group-hover:rotate-12');

    rerender(<IconButton icon={Github} hoverEffect="none" aria-label="No effect" />);
    button = screen.getByRole('button');
    icon = button.querySelector('svg');
    expect(icon?.className).not.toContain('group-hover');
  });

  it('includes group class for hover effects', () => {
    render(<IconButton icon={Github} aria-label="GitHub" />);
    expect(screen.getByRole('button').className).toContain('group');
  });

  it('handles different icon types', () => {
    const { rerender } = render(<IconButton icon={Github} aria-label="GitHub" />);
    expect(screen.getByRole('button').querySelector('svg')).toBeInTheDocument();

    rerender(<IconButton icon={Mail} aria-label="Email" />);
    expect(screen.getByRole('button').querySelector('svg')).toBeInTheDocument();

    rerender(<IconButton icon={ExternalLink} aria-label="External" />);
    expect(screen.getByRole('button').querySelector('svg')).toBeInTheDocument();
  });

  it('applies focus styles for accessibility', () => {
    render(<IconButton icon={Github} aria-label="GitHub" />);
    const button = screen.getByRole('button');
    expect(button.className).toContain('focus:outline-none');
    expect(button.className).toContain('focus:ring-2');
    expect(button.className).toContain('focus:ring-teal-300/50');
  });

  it('handles disabled state with no hover effects', () => {
    render(<IconButton icon={Github} disabled hoverEffect="scale" aria-label="Disabled" />);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button.className).toContain('disabled:cursor-not-allowed');
  });
});