import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';
import React from 'react';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: Record<string, unknown>) => {
      // Handle translations with fallbacks
      const translations: Record<string, string> = {
        'projects.title': 'Projects',
        'projects.description':
          "A collection of projects I've built, showcasing different technologies and problem-solving approaches.",
        'projects.actionsLabel': 'Actions for {{title}}',
        'projects.gridLabel': 'Project portfolio grid',
        'projects.technologiesLabel': 'Technologies used in {{title}}',
        'projects.technologyLabel': 'Technology: {{tech}}',
        'common.viewOnGithub': 'View {{title}} on GitHub (opens in new tab)',
        'common.visitProject': 'Visit {{title}} live demo (opens in new tab)',
        'experience.jobs.azure-core.description':
          'Build and maintain critical components for Azure infrastructure. Collaborate closely with the Semantic Kernel and Copilot teams to develop cutting-edge AI solutions and cloud engineering tools.',
        'experience.jobs.microsoft-cloud.description':
          'Developed cloud infrastructure solutions and AI-driven development tools. Focused on scalable cloud services and integration with Microsoft AI platforms.',
        'experience.jobs.global-partner-solutions.description':
          'Led enterprise cloud transformation initiatives and AI solution architecture. Specialized in prompt engineering, Azure cloud architecture, and DevOps practices for enterprise clients.',
        'experience.jobs.fred-it-group.description':
          'Led a team of six engineers to design scalable platforms for the pharmacy and healthcare industry. Managed platform design, Agile/DevOps/IaC delivery, and team leadership.',
      };

      if (translations[key]) {
        let result = translations[key];
        if (options && typeof options === 'object') {
          Object.keys(options).forEach(optionKey => {
            const value = options[optionKey];
            if (typeof value === 'string') {
              result = result.replace(`{{${optionKey}}}`, value);
            }
          });
        }
        return result;
      }

      return options?.defaultValue || key;
    },
    i18n: {
      changeLanguage: vi.fn(),
      language: 'en',
    },
  }),
  Trans: ({ children }: { children: React.ReactNode }) => children,
  initReactI18next: {
    type: '3rdParty',
    init: vi.fn(),
  },
}));

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  Github: vi.fn(({ size, ...props }) =>
    React.createElement('div', { 'data-testid': 'github-icon', ...props })
  ),
  ExternalLink: vi.fn(({ size, ...props }) =>
    React.createElement('div', { 'data-testid': 'external-link-icon', ...props })
  ),
  Mail: vi.fn(({ size, ...props }) =>
    React.createElement('div', { 'data-testid': 'mail-icon', ...props })
  ),
  Linkedin: vi.fn(({ size, ...props }) =>
    React.createElement('div', { 'data-testid': 'linkedin-icon', ...props })
  ),
  Twitter: vi.fn(({ size, ...props }) =>
    React.createElement('div', { 'data-testid': 'twitter-icon', ...props })
  ),
  Globe: vi.fn(({ size, ...props }) =>
    React.createElement('div', { 'data-testid': 'globe-icon', ...props })
  ),
  Users: vi.fn(({ size, ...props }) =>
    React.createElement('div', { 'data-testid': 'users-icon', ...props })
  ),
  ArrowUpRight: vi.fn(({ size, ...props }) =>
    React.createElement('div', { 'data-testid': 'arrow-up-right-icon', ...props })
  ),
  ChevronDown: vi.fn(({ size, ...props }) =>
    React.createElement('div', { 'data-testid': 'chevron-down-icon', ...props })
  ),
  Menu: vi.fn(({ size, ...props }) =>
    React.createElement('div', { 'data-testid': 'menu-icon', ...props })
  ),
  X: vi.fn(({ size, ...props }) =>
    React.createElement('div', { 'data-testid': 'x-icon', ...props })
  ),
  ArrowRight: vi.fn(({ size, ...props }) =>
    React.createElement('div', { 'data-testid': 'arrow-right-icon', ...props })
  ),
  AlertCircle: vi.fn(({ size, ...props }) =>
    React.createElement('div', { 'data-testid': 'alert-circle-icon', ...props })
  ),
  RefreshCw: vi.fn(({ size, ...props }) =>
    React.createElement('div', { 'data-testid': 'refresh-cw-icon', ...props })
  ),
  Home: vi.fn(({ size, ...props }) =>
    React.createElement('div', { 'data-testid': 'home-icon', ...props })
  ),
  ArrowLeft: vi.fn(({ size, ...props }) =>
    React.createElement('div', { 'data-testid': 'arrow-left-icon', ...props })
  ),
  Badge: vi.fn(({ size, ...props }) =>
    React.createElement('div', { 'data-testid': 'badge-icon', ...props })
  ),
  Download: vi.fn(({ size, ...props }) =>
    React.createElement('div', { 'data-testid': 'download-icon', ...props })
  ),
  ArrowDown: vi.fn(({ size, ...props }) =>
    React.createElement('div', { 'data-testid': 'arrow-down-icon', ...props })
  ),
  LucideIcon: vi.fn(),
}));

// Mock framer-motion
vi.mock('framer-motion', () => {
  const createMotionComponent = (elementType: string) =>
    vi.fn(
      ({
        children,
        initial,
        animate,
        transition,
        whileInView,
        whileHover,
        viewport,
        exit,
        ...props
      }) => {
        // Filter out all framer-motion specific props
        const filteredProps = { ...props };
        delete filteredProps.initial;
        delete filteredProps.animate;
        delete filteredProps.transition;
        delete filteredProps.whileInView;
        delete filteredProps.whileHover;
        delete filteredProps.viewport;
        delete filteredProps.exit;

        return React.createElement(elementType, filteredProps, children);
      }
    );

  return {
    motion: {
      div: createMotionComponent('div'),
      section: createMotionComponent('section'),
      header: createMotionComponent('header'),
      article: createMotionComponent('article'),
      a: createMotionComponent('a'),
      button: createMotionComponent('button'),
      h1: createMotionComponent('h1'),
      h2: createMotionComponent('h2'),
      h3: createMotionComponent('h3'),
      p: createMotionComponent('p'),
      span: createMotionComponent('span'),
    },
    AnimatePresence: vi.fn(({ children }) => children),
    useInView: vi.fn(() => [vi.fn(), true]),
  };
});

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock scrollIntoView
window.HTMLElement.prototype.scrollIntoView = vi.fn();

// Mock window dimensions
Object.defineProperty(window, 'innerWidth', {
  writable: true,
  configurable: true,
  value: 1024,
});

Object.defineProperty(window, 'innerHeight', {
  writable: true,
  configurable: true,
  value: 768,
});

// Mock global window object for SSR tests
Object.defineProperty(global, 'window', {
  writable: true,
  configurable: true,
  value: window,
});
