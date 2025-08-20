import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Card, { CardHeader, CardContent, CardFooter } from './Card';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, whileHover, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

describe('Card', () => {
  it('renders children correctly', () => {
    render(
      <Card>
        <div>Card Content</div>
      </Card>
    );
    expect(screen.getByText('Card Content')).toBeInTheDocument();
  });

  it('applies default variant styles', () => {
    render(<Card>Default Card</Card>);
    const card = screen.getByText('Default Card').closest('div');
    expect(card?.className).toContain('p-6');
    expect(card?.className).toContain('rounded-lg');
    expect(card?.className).toContain('border-white/5');
    expect(card?.className).toContain('bg-midnight-elevated/80');
  });

  it('applies experience variant styles', () => {
    render(<Card variant="experience">Experience Card</Card>);
    const card = screen.getByText('Experience Card').closest('div');
    expect(card?.className).toContain('border-white/5');
    expect(card?.className).toContain('bg-midnight-elevated/90');
    expect(card?.className).toContain('hover:border-cyan/20');
  });

  it('applies project variant styles', () => {
    render(<Card variant="project">Project Card</Card>);
    const card = screen.getByText('Project Card').closest('div');
    expect(card?.className).toContain('border-white/5');
    expect(card?.className).toContain('from-midnight-elevated/90');
    expect(card?.className).toContain('hover:border-violet/30');
  });

  it('applies feature variant styles', () => {
    render(<Card variant="feature">Feature Card</Card>);
    const card = screen.getByText('Feature Card').closest('div');
    expect(card?.className).toContain('glass');
    expect(card?.className).toContain('border-white/10');
  });

  it('applies hover effects by default', () => {
    render(<Card>Hoverable Card</Card>);
    const card = screen.getByText('Hoverable Card').closest('div');
    expect(card?.className).toContain('cursor-pointer');
  });

  it('disables hover effects when hover=false', () => {
    render(<Card hover={false}>Non-hoverable Card</Card>);
    const card = screen.getByText('Non-hoverable Card').closest('div');
    expect(card?.className).not.toContain('hover:scale-[1.02]');
    expect(card?.className).not.toContain('cursor-pointer');
  });

  it('handles onClick events', () => {
    const handleClick = vi.fn();
    render(<Card onClick={handleClick}>Clickable Card</Card>);

    fireEvent.click(screen.getByText('Clickable Card'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies custom className', () => {
    render(<Card className="custom-class">Custom Card</Card>);
    const card = screen.getByText('Custom Card').closest('div');
    expect(card?.className).toContain('custom-class');
  });

  it('includes group class for potential nested hover effects', () => {
    render(<Card>Card with Group</Card>);
    const card = screen.getByText('Card with Group').closest('div');
    expect(card?.className).toContain('group');
  });
});

describe('CardHeader', () => {
  it('renders children correctly', () => {
    render(
      <CardHeader>
        <h3>Header Content</h3>
      </CardHeader>
    );
    expect(screen.getByText('Header Content')).toBeInTheDocument();
  });

  it('applies default margin bottom', () => {
    render(<CardHeader>Header</CardHeader>);
    const header = screen.getByText('Header').closest('div');
    expect(header?.className).toContain('mb-4');
  });

  it('applies custom className', () => {
    render(<CardHeader className="custom-header">Header</CardHeader>);
    const header = screen.getByText('Header').closest('div');
    expect(header?.className).toContain('custom-header');
  });
});

describe('CardContent', () => {
  it('renders children correctly', () => {
    render(
      <CardContent>
        <p>Content goes here</p>
      </CardContent>
    );
    expect(screen.getByText('Content goes here')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<CardContent className="custom-content">Content</CardContent>);
    const content = screen.getByText('Content').closest('div');
    expect(content?.className).toContain('custom-content');
  });
});

describe('CardFooter', () => {
  it('renders children correctly', () => {
    render(
      <CardFooter>
        <button>Footer Button</button>
      </CardFooter>
    );
    expect(screen.getByText('Footer Button')).toBeInTheDocument();
  });

  it('applies default margin top', () => {
    render(<CardFooter>Footer</CardFooter>);
    const footer = screen.getByText('Footer').closest('div');
    expect(footer?.className).toContain('mt-4');
  });

  it('applies custom className', () => {
    render(<CardFooter className="custom-footer">Footer</CardFooter>);
    const footer = screen.getByText('Footer').closest('div');
    expect(footer?.className).toContain('custom-footer');
  });
});

describe('Card Composition', () => {
  it('renders complete card with all subcomponents', () => {
    render(
      <Card variant="experience">
        <CardHeader>
          <h3>Experience Title</h3>
        </CardHeader>
        <CardContent>
          <p>Experience description</p>
        </CardContent>
        <CardFooter>
          <div>Technologies: React, TypeScript</div>
        </CardFooter>
      </Card>
    );

    expect(screen.getByText('Experience Title')).toBeInTheDocument();
    expect(screen.getByText('Experience description')).toBeInTheDocument();
    expect(screen.getByText('Technologies: React, TypeScript')).toBeInTheDocument();
  });
});
