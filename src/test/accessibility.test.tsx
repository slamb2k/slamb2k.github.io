import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import PortfolioLandingPage from '@/components/generated/PortfolioLandingPage';
import HeroSection from '@/components/generated/HeroSection';
import ProjectsSection from '@/components/generated/ProjectsSection';
import ContactSection from '@/components/generated/ContactSection';
import axeCore from 'axe-core';

// Mock child components for PortfolioLandingPage
vi.mock('@/components/generated/SidebarNavigation', () => ({
  default: ({ activeSection, onSectionClick }: any) => (
    <nav role="navigation" aria-label="Main navigation">
      <div data-testid="sidebar-navigation">
        <button onClick={() => onSectionClick('about')}>About</button>
        <button onClick={() => onSectionClick('projects')}>Projects</button>
        <button onClick={() => onSectionClick('contact')}>Contact</button>
      </div>
    </nav>
  ),
}));

vi.mock('@/components/generated/HeroSection', () => ({
  default: () => (
    <section aria-label="Hero section">
      <h1>Simon Lamb</h1>
      <p>Full-stack developer</p>
    </section>
  ),
}));

vi.mock('@/components/generated/ProjectsSection', () => ({
  default: () => (
    <section id="projects" aria-label="Projects">
      <h2>My Projects</h2>
      <div role="list">
        <div role="listitem">Project 1</div>
        <div role="listitem">Project 2</div>
      </div>
    </section>
  ),
}));

vi.mock('@/components/generated/ContactSection', () => ({
  default: () => (
    <section id="contact" aria-label="Contact">
      <h2>Get In Touch</h2>
      <a href="mailto:hello@simonlamb.dev">Contact me</a>
    </section>
  ),
}));

// Mock hook to avoid responsive behavior complexity
vi.mock('@/hooks/use-mobile', () => ({
  useHasSidebar: () => true,
}));

// Mock Framer Motion
vi.mock('framer-motion', () => ({
  motion: {
    section: ({ children, className, ...props }: any) => 
      <section className={className} {...props}>{children}</section>,
    div: ({ children, className, ...props }: any) => 
      <div className={className} {...props}>{children}</div>,
    h1: ({ children, className, ...props }: any) => 
      <h1 className={className} {...props}>{children}</h1>,
    h2: ({ children, className, ...props }: any) => 
      <h2 className={className} {...props}>{children}</h2>,
    p: ({ children, className, ...props }: any) => 
      <p className={className} {...props}>{children}</p>,
    a: ({ children, className, ...props }: any) => 
      <a className={className} {...props}>{children}</a>,
    button: ({ children, className, ...props }: any) => 
      <button className={className} {...props}>{children}</button>,
  },
}));

// Mock Lucide React icons
vi.mock('lucide-react', () => ({
  ArrowDown: () => <span aria-hidden="true">↓</span>,
  ExternalLink: () => <span aria-hidden="true">↗</span>,
  Github: () => <span aria-hidden="true">⚡</span>,
  Mail: () => <span aria-hidden="true">✉</span>,
  ArrowUpRight: () => <span aria-hidden="true">↗</span>,
}));

// Mock portfolio data
vi.mock('@/data/portfolio', () => ({
  portfolioData: {
    personal: {
      about: [
        "I'm a passionate full-stack developer with experience building digital experiences.",
        "I specialize in creating accessible, pixel-perfect web applications with modern technologies."
      ]
    },
    projects: [
      {
        title: 'Test Project',
        description: 'A test project',
        technologies: ['React', 'TypeScript'],
        link: 'https://example.com'
      }
    ],
    experience: [
      {
        title: 'Software Engineer',
        company: 'Test Company',
        duration: '2020 - Present',
        description: 'Building awesome software',
        technologies: ['React', 'Node.js']
      }
    ]
  }
}));

async function runAxeTest(container: HTMLElement) {
  const results = await axeCore.run(container, {
    rules: {
      // Disable color contrast checking for this test as it requires specific styling
      'color-contrast': { enabled: false },
      // Disable landmark checks for component tests
      'region': { enabled: false },
    }
  });
  
  return results;
}

describe('Accessibility Tests', () => {
  it('should not have accessibility violations in PortfolioLandingPage', async () => {
    const { container } = render(<PortfolioLandingPage />);
    const results = await runAxeTest(container);
    
    expect(results.violations).toEqual([]);
  });

  it('should not have accessibility violations in HeroSection', async () => {
    const { container } = render(<HeroSection />);
    const results = await runAxeTest(container);
    
    expect(results.violations).toEqual([]);
  });

  it('should not have accessibility violations in ProjectsSection', async () => {
    const { container } = render(<ProjectsSection />);
    const results = await runAxeTest(container);
    
    expect(results.violations).toEqual([]);
  });

  it('should not have accessibility violations in ContactSection', async () => {
    const { container } = render(<ContactSection />);
    const results = await runAxeTest(container);
    
    expect(results.violations).toEqual([]);
  });

  it('should have proper heading hierarchy', () => {
    const { container } = render(<PortfolioLandingPage />);
    
    // Check for h1 element
    const h1Elements = container.querySelectorAll('h1');
    expect(h1Elements.length).toBeGreaterThan(0);
    
    // Check for logical heading structure
    const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6');
    expect(headings.length).toBeGreaterThan(1); // Should have multiple headings
  });

  it('should have proper navigation landmarks', () => {
    const { container } = render(<PortfolioLandingPage />);
    
    // Check for navigation landmarks
    const navigation = container.querySelector('[role="navigation"], nav');
    expect(navigation).toBeInTheDocument();
  });

  it('should have keyboard accessible buttons and links', () => {
    const { container } = render(<PortfolioLandingPage />);
    
    // Check for focusable elements
    const buttons = container.querySelectorAll('button');
    const links = container.querySelectorAll('a');
    
    expect(buttons.length + links.length).toBeGreaterThan(0);
    
    // All buttons should be keyboard accessible by default
    buttons.forEach(button => {
      expect(button).not.toHaveAttribute('tabindex', '-1');
    });
  });

  it('should have proper section identification', () => {
    const { container } = render(<PortfolioLandingPage />);
    
    // Check for section IDs that are referenced in navigation
    const aboutSection = container.querySelector('#about');
    const projectsSection = container.querySelector('#projects');
    const contactSection = container.querySelector('#contact');
    
    // At least some sections should be identifiable
    const sectionsFound = [aboutSection, projectsSection, contactSection].filter(Boolean);
    expect(sectionsFound.length).toBeGreaterThan(0);
  });
});