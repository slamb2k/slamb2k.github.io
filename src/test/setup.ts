import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';
import React from 'react';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock react-i18next
let currentLanguage = 'en';
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: Record<string, unknown>) => {
      // Handle translations with fallbacks
      const translations: Record<string, string> = {
        // About page translations
        'about.title': "Hi, I'm {{name}}.",
        'about.subtitle': 'Principal AI/Software Engineer | GenAI/RAG, LLMOps, SRE',
        'about.tagline':
          'I build production GenAI platforms on Microsoft Azure and bring DevOps leadership from the ground up.',
        'about.heading': 'About',
        'about.paragraph1': 'Test paragraph 1',
        'about.paragraph2': 'Test paragraph 2',
        'about.paragraph3': 'Test paragraph 3',
        // Navigation
        'nav.about': 'About',
        'nav.experience': 'Experience',
        'nav.projects': 'Projects',
        'nav.contact': 'Contact',
        // Language
        'language.switchTo': 'Switch to {{language}}',
        'language.current': 'Current language: {{language}}',
        // Projects
        'projects.title': 'Projects',
        'projects.description':
          "A collection of projects I've built, showcasing different technologies and problem-solving approaches.",
        'projects.actionsLabel': 'Actions for {{title}}',
        'projects.gridLabel': 'Project portfolio grid',
        'projects.technologiesLabel': 'Technologies used in {{title}}',
        'projects.technologyLabel': 'Technology: {{tech}}',
        'common.viewOnGithub': 'View {{title}} on GitHub (opens in new tab)',
        'common.visitProject': 'Visit {{title}} live demo (opens in new tab)',
        // Experience
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
        // Handle default interpolation for name
        if (key === 'about.title' && !options?.name) {
          result = result.replace('{{name}}', 'Simon Lamb');
        }
        return result;
      }

      // Handle Spanish translations for testing
      const spanishTranslations: Record<string, string> = {
        'about.title': 'Hola, soy {{name}}.',
        'about.subtitle': 'Ingeniero Principal de IA/Software | GenAI/RAG, LLMOps, SRE',
        'about.heading': 'Acerca de',
      };

      // Check if we're in Spanish context and have Spanish translation
      if (currentLanguage === 'es' && spanishTranslations[key]) {
        let result = spanishTranslations[key];
        if (key === 'about.title') {
          result = result.replace('{{name}}', 'Simon Lamb');
        }
        return result;
      }

      return options?.defaultValue || key;
    },
    i18n: {
      changeLanguage: vi.fn((lng: string) => {
        currentLanguage = lng;
      }),
      language: currentLanguage,
    },
  }),
  Trans: ({ children }: { children: React.ReactNode }) => children,
  I18nextProvider: ({ children }: { children: React.ReactNode }) => children,
  initReactI18next: {
    type: '3rdParty',
    init: vi.fn(),
  },
}));

// Mock lucide-react icons - simplified comprehensive approach
vi.mock('lucide-react', async importOriginal => {
  const createIcon = (name: string) =>
    vi.fn(({ size, ...props }) =>
      React.createElement('div', {
        'data-testid': `${name
          .toLowerCase()
          .replace(/([A-Z])/g, '-$1')
          .substring(1)}-icon`,
        ...props,
      })
    );

  // Create explicit exports for all known icons used in the project
  return {
    Github: createIcon('Github'),
    ExternalLink: createIcon('ExternalLink'),
    Mail: createIcon('Mail'),
    Linkedin: createIcon('Linkedin'),
    Twitter: createIcon('Twitter'),
    Globe: createIcon('Globe'),
    Users: createIcon('Users'),
    ArrowUpRight: createIcon('ArrowUpRight'),
    ChevronDown: createIcon('ChevronDown'),
    Menu: createIcon('Menu'),
    X: createIcon('X'),
    ArrowRight: createIcon('ArrowRight'),
    AlertCircle: createIcon('AlertCircle'),
    RefreshCw: createIcon('RefreshCw'),
    Home: createIcon('Home'),
    ArrowLeft: createIcon('ArrowLeft'),
    Badge: createIcon('Badge'),
    Download: createIcon('Download'),
    ArrowDown: createIcon('ArrowDown'),
    LucideIcon: vi.fn(),
  };
});

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
