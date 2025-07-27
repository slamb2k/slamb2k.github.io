import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Section, { SectionTitle } from './Section';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    section: ({ children, initial, whileInView, transition, viewport, ...props }: any) => <section {...props}>{children}</section>,
    h2: ({ children, initial, whileInView, transition, viewport, ...props }: any) => <h2 {...props}>{children}</h2>,
  },
}));

describe('Section', () => {
  it('renders children correctly', () => {
    render(
      <Section>
        <div>Section Content</div>
      </Section>
    );
    expect(screen.getByText('Section Content')).toBeInTheDocument();
  });

  it('renders as a section element', () => {
    render(<Section>Content</Section>);
    const sectionElement = screen.getByText('Content').closest('section');
    expect(sectionElement).toBeInTheDocument();
  });

  it('applies id attribute when provided', () => {
    render(<Section id="test-section">Content</Section>);
    const sectionElement = screen.getByText('Content').closest('section');
    expect(sectionElement).toHaveAttribute('id', 'test-section');
  });

  it('applies default margin bottom class', () => {
    render(<Section>Content</Section>);
    const section = screen.getByText('Content').closest('section');
    expect(section?.className).toContain('mb-24');
  });

  it('applies custom className', () => {
    render(<Section className="custom-section">Content</Section>);
    const section = screen.getByText('Content').closest('section');
    expect(section?.className).toContain('custom-section');
    expect(section?.className).toContain('mb-24'); // Should still include base classes
  });

  it('renders with animation by default', () => {
    render(<Section>Animated Content</Section>);
    // Since we're mocking framer-motion, we can check that the motion.section is being used
    // The actual animation props would be passed to the mocked component
    expect(screen.getByText('Animated Content')).toBeInTheDocument();
  });

  it('renders without animation when animate=false', () => {
    render(<Section animate={false}>Static Content</Section>);
    // With animate=false, it should render a regular section element
    expect(screen.getByText('Static Content')).toBeInTheDocument();
  });

  it('applies delay prop', () => {
    render(<Section delay={0.5}>Delayed Content</Section>);
    // The delay would be passed to framer-motion, but since we're mocking it,
    // we just verify the component renders
    expect(screen.getByText('Delayed Content')).toBeInTheDocument();
  });
});

describe('SectionTitle', () => {
  it('renders children correctly', () => {
    render(<SectionTitle>Test Title</SectionTitle>);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('renders as an h2 element', () => {
    render(<SectionTitle>Title</SectionTitle>);
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
  });

  it('applies default styling classes', () => {
    render(<SectionTitle>Styled Title</SectionTitle>);
    const title = screen.getByRole('heading', { level: 2 });
    expect(title.className).toContain('text-2xl');
    expect(title.className).toContain('font-bold');
    expect(title.className).toContain('text-slate-100');
    expect(title.className).toContain('mb-6');
  });

  it('applies custom className', () => {
    render(<SectionTitle className="custom-title">Custom Title</SectionTitle>);
    const title = screen.getByRole('heading', { level: 2 });
    expect(title.className).toContain('custom-title');
    expect(title.className).toContain('text-2xl'); // Should still include base classes
  });

  it('renders with animation by default', () => {
    render(<SectionTitle>Animated Title</SectionTitle>);
    // Since we're mocking framer-motion, we can verify the component renders
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
  });

  it('renders without animation when animate=false', () => {
    render(<SectionTitle animate={false}>Static Title</SectionTitle>);
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
  });

  it('applies delay prop', () => {
    render(<SectionTitle delay={0.3}>Delayed Title</SectionTitle>);
    expect(screen.getByText('Delayed Title')).toBeInTheDocument();
  });
});

describe('Section Composition', () => {
  it('renders section with title and content', () => {
    render(
      <Section id="about" className="custom-section">
        <SectionTitle className="custom-title">About Me</SectionTitle>
        <div>
          <p>This is the about section content.</p>
        </div>
      </Section>
    );

    const section = screen.getByText('This is the about section content.').closest('section');
    expect(section).toHaveAttribute('id', 'about');
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('About Me');
    expect(screen.getByText('This is the about section content.')).toBeInTheDocument();
  });

  it('handles multiple sections with different configurations', () => {
    render(
      <>
        <Section id="section1" animate={true}>
          <SectionTitle>Section 1</SectionTitle>
          <p>First section</p>
        </Section>
        <Section id="section2" animate={false}>
          <SectionTitle animate={false}>Section 2</SectionTitle>
          <p>Second section</p>
        </Section>
      </>
    );

    const section1 = screen.getByText('First section').closest('section');
    const section2 = screen.getByText('Second section').closest('section');
    expect(section1).toHaveAttribute('id', 'section1');
    expect(section2).toHaveAttribute('id', 'section2');

    const headings = screen.getAllByRole('heading', { level: 2 });
    expect(headings).toHaveLength(2);
    expect(headings[0]).toHaveTextContent('Section 1');
    expect(headings[1]).toHaveTextContent('Section 2');
  });
});