import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import ContactSection from './ContactSection';

// Mock Framer Motion
vi.mock('framer-motion', () => ({
  motion: {
    section: ({
      children,
      initial,
      whileInView,
      transition,
      viewport,
      className,
      ...props
    }: any) => (
      <section className={className} {...props}>
        {children}
      </section>
    ),
    div: ({
      children,
      initial,
      whileInView,
      transition,
      viewport,
      whileHover,
      className,
      ...props
    }: any) => (
      <div className={className} {...props}>
        {children}
      </div>
    ),
    a: ({ children, whileHover, whileTap, className, ...props }: any) => (
      <a className={className} {...props}>
        {children}
      </a>
    ),
  },
}));

// Mock Lucide React icons
vi.mock('lucide-react', () => ({
  Mail: () => <div data-testid="mail-icon">✉</div>,
  ArrowUpRight: () => <div data-testid="arrow-up-right-icon">↗</div>,
}));

describe('ContactSection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render contact section with proper heading', () => {
    render(<ContactSection />);

    expect(screen.getByText('Get In Touch')).toBeInTheDocument();
    expect(screen.getByText(/04\. What's Next\?/)).toBeInTheDocument();
  });

  it('should render contact description text', () => {
    render(<ContactSection />);

    expect(screen.getByText(/Although I'm not currently looking/)).toBeInTheDocument();
    expect(screen.getByText(/my inbox is always open/)).toBeInTheDocument();
    expect(screen.getByText(/I'll try my best to get back to you/)).toBeInTheDocument();
  });

  it('should have proper section structure with id', () => {
    render(<ContactSection />);

    const section = screen.getByRole('region', { name: /contact/i });
    expect(section).toHaveAttribute('id', 'contact');
  });

  it('should render contact button with email link', () => {
    render(<ContactSection />);

    const contactButton = screen.getByRole('link', { name: /say hello/i });
    expect(contactButton).toBeInTheDocument();
    expect(contactButton).toHaveAttribute('href', 'mailto:me@simonlamb.codes');
  });

  it('should have proper styling classes', () => {
    render(<ContactSection />);

    const heading = screen.getByText('Get In Touch');
    expect(heading).toHaveClass('text-4xl', 'lg:text-5xl', 'font-bold', 'text-slate-100');

    const sectionNumber = screen.getByText(/04\. What's Next\?/);
    expect(sectionNumber).toHaveClass('text-teal-300', 'font-mono', 'text-sm');
  });

  it('should render contact button with proper styling', () => {
    render(<ContactSection />);

    const contactButton = screen.getByRole('link', { name: /say hello/i });
    expect(contactButton).toHaveClass(
      'inline-flex',
      'items-center',
      'gap-2',
      'px-8',
      'py-4',
      'border-2',
      'border-teal-300',
      'text-teal-300',
      'rounded-lg',
      'hover:bg-teal-300',
      'hover:text-slate-900',
      'transition-all',
      'duration-300',
      'group'
    );
  });

  it('should have proper semantic structure', () => {
    render(<ContactSection />);

    // Should have a main heading
    const mainHeading = screen.getByRole('heading', { level: 2 });
    expect(mainHeading).toHaveTextContent('Get In Touch');

    // Should have a contact link
    const contactLink = screen.getByRole('link');
    expect(contactLink).toBeInTheDocument();
  });

  it('should include email icon in contact button', () => {
    render(<ContactSection />);

    const contactButton = screen.getByRole('link', { name: /say hello/i });
    // The icon should be rendered within the button
    expect(contactButton).toBeInTheDocument();
  });

  it('should be centered and have proper spacing', () => {
    render(<ContactSection />);

    const section = screen.getByRole('region', { name: /contact/i });
    expect(section).toHaveClass('text-center', 'py-24');

    const contentContainer = section.querySelector('.max-w-2xl');
    expect(contentContainer).toHaveClass('mx-auto', 'space-y-6');
  });

  it('should render with proper accessibility attributes', () => {
    render(<ContactSection />);

    const contactButton = screen.getByRole('link', { name: /say hello/i });
    expect(contactButton).toHaveAttribute('href');
    expect(contactButton.getAttribute('href')).toMatch(/^mailto:/);
  });
});
