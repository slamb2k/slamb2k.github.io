import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import AnimatedText from './AnimatedText';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    p: ({ children, initial, whileInView, transition, viewport, variants, ...props }: any) => <p {...props}>{children}</p>,
    h1: ({ children, initial, whileInView, transition, viewport, variants, ...props }: any) => <h1 {...props}>{children}</h1>,
    h2: ({ children, initial, whileInView, transition, viewport, variants, ...props }: any) => <h2 {...props}>{children}</h2>,
    h3: ({ children, initial, whileInView, transition, viewport, variants, ...props }: any) => <h3 {...props}>{children}</h3>,
    span: ({ children, initial, whileInView, transition, viewport, variants, ...props }: any) => <span {...props}>{children}</span>,
  },
}));

describe('AnimatedText', () => {
  it('renders children correctly with default paragraph variant', () => {
    render(<AnimatedText>Test content</AnimatedText>);
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('renders with h1 variant', () => {
    render(<AnimatedText variant="h1">Heading 1</AnimatedText>);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Heading 1');
  });

  it('renders with h2 variant', () => {
    render(<AnimatedText variant="h2">Heading 2</AnimatedText>);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Heading 2');
  });

  it('renders with h3 variant', () => {
    render(<AnimatedText variant="h3">Heading 3</AnimatedText>);
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Heading 3');
  });

  it('renders with span variant', () => {
    render(<AnimatedText variant="span">Span content</AnimatedText>);
    const spanElement = screen.getByText('Span content');
    expect(spanElement.tagName.toLowerCase()).toBe('span');
  });

  it('applies custom className', () => {
    render(<AnimatedText className="custom-class">Styled text</AnimatedText>);
    const element = screen.getByText('Styled text');
    expect(element.className).toContain('custom-class');
  });

  it('accepts delay prop', () => {
    render(<AnimatedText delay={0.5}>Delayed text</AnimatedText>);
    expect(screen.getByText('Delayed text')).toBeInTheDocument();
  });

  it('accepts duration prop', () => {
    render(<AnimatedText duration={1.2}>Custom duration text</AnimatedText>);
    expect(screen.getByText('Custom duration text')).toBeInTheDocument();
  });

  it('handles different direction props', () => {
    const { rerender } = render(<AnimatedText direction="up">Up animation</AnimatedText>);
    expect(screen.getByText('Up animation')).toBeInTheDocument();

    rerender(<AnimatedText direction="down">Down animation</AnimatedText>);
    expect(screen.getByText('Down animation')).toBeInTheDocument();

    rerender(<AnimatedText direction="left">Left animation</AnimatedText>);
    expect(screen.getByText('Left animation')).toBeInTheDocument();

    rerender(<AnimatedText direction="right">Right animation</AnimatedText>);
    expect(screen.getByText('Right animation')).toBeInTheDocument();

    rerender(<AnimatedText direction="fade">Fade animation</AnimatedText>);
    expect(screen.getByText('Fade animation')).toBeInTheDocument();
  });

  it('handles staggerChildren with string content', () => {
    render(
      <AnimatedText staggerChildren={true} staggerDelay={0.1}>
        This is staggered text
      </AnimatedText>
    );
    
    // With staggerChildren, each word should be wrapped in a span
    const words = ['This', 'is', 'staggered', 'text'];
    words.forEach(word => {
      expect(screen.getByText(word)).toBeInTheDocument();
    });
  });

  it('handles staggerChildren with non-string content', () => {
    render(
      <AnimatedText staggerChildren={true}>
        <span>Non-string content</span>
      </AnimatedText>
    );
    
    expect(screen.getByText('Non-string content')).toBeInTheDocument();
  });

  it('applies staggerDelay prop', () => {
    render(
      <AnimatedText staggerChildren={true} staggerDelay={0.2}>
        Staggered content
      </AnimatedText>
    );
    expect(screen.getByText('Staggered')).toBeInTheDocument();
    expect(screen.getByText('content')).toBeInTheDocument();
  });

  it('handles complex nested content', () => {
    render(
      <AnimatedText variant="h2">
        <strong>Bold</strong> and <em>italic</em> text
      </AnimatedText>
    );
    
    expect(screen.getByText('Bold')).toBeInTheDocument();
    expect(screen.getByText('italic')).toBeInTheDocument();
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveTextContent('Bold and italic text');
  });

  it('preserves spacing in staggered text', () => {
    render(
      <AnimatedText staggerChildren={true}>
        Word spacing test
      </AnimatedText>
    );
    
    // Check that individual words are present
    expect(screen.getByText('Word')).toBeInTheDocument();
    expect(screen.getByText('spacing')).toBeInTheDocument();
    expect(screen.getByText('test')).toBeInTheDocument();
  });

  it('handles empty content gracefully', () => {
    render(<AnimatedText>{''}</AnimatedText>);
    // Should render without crashing
    const element = screen.getByText('', { selector: 'p' });
    expect(element).toBeInTheDocument();
  });

  it('applies all animation props together', () => {
    render(
      <AnimatedText
        variant="h1"
        direction="left"
        delay={0.3}
        duration={0.8}
        className="complex-animation"
        staggerChildren={false}
      >
        Complex animated text
      </AnimatedText>
    );
    
    const element = screen.getByRole('heading', { level: 1 });
    expect(element).toHaveTextContent('Complex animated text');
    expect(element.className).toContain('complex-animation');
  });
});