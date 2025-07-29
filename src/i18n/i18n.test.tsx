import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';
import AboutPage from '@/pages/AboutPage';

// Mock Framer Motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, ...props }: any) => (
      <div className={className} {...props}>
        {children}
      </div>
    ),
    section: ({ children, className, ...props }: any) => (
      <section className={className} {...props}>
        {children}
      </section>
    ),
    aside: ({ children, className, ...props }: any) => (
      <aside className={className} {...props}>
        {children}
      </aside>
    ),
    span: ({ children, className, ...props }: any) => (
      <span className={className} {...props}>
        {children}
      </span>
    ),
    button: ({ children, className, ...props }: any) => (
      <button className={className} {...props}>
        {children}
      </button>
    ),
    a: ({ children, className, href, ...props }: any) => (
      <a className={className} href={href} {...props}>
        {children}
      </a>
    ),
  },
  AnimatePresence: ({ children }: any) => children,
}));

// Mock Lucide React icons
vi.mock('lucide-react', () => ({
  Globe: () => <div data-testid="globe-icon">🌐</div>,
  ChevronDown: () => <div data-testid="chevron-down-icon">⬇</div>,
}));

// Test i18n configuration
const testI18nConfig = {
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
  resources: {
    en: {
      translation: {
        nav: {
          about: 'About',
          experience: 'Experience',
          projects: 'Projects',
          contact: 'Contact',
        },
        about: {
          title: "Hi, I'm {{name}}.",
          subtitle: 'Senior Frontend Engineer',
          tagline: 'I build pixel-perfect, engaging, and accessible digital experiences.',
          heading: 'About',
          paragraph1: 'Test paragraph 1',
          paragraph2: 'Test paragraph 2',
          paragraph3: 'Test paragraph 3',
        },
        language: {
          switchTo: 'Switch to {{language}}',
          current: 'Current language: {{language}}',
        },
      },
    },
    es: {
      translation: {
        nav: {
          about: 'Acerca de',
          experience: 'Experiencia',
          projects: 'Proyectos',
          contact: 'Contacto',
        },
        about: {
          title: 'Hola, soy {{name}}.',
          subtitle: 'Ingeniero Frontend Senior',
          tagline: 'Construyo experiencias digitales perfectas, atractivas y accesibles.',
          heading: 'Acerca de',
          paragraph1: 'Párrafo de prueba 1',
          paragraph2: 'Párrafo de prueba 2',
          paragraph3: 'Párrafo de prueba 3',
        },
        language: {
          switchTo: 'Cambiar a {{language}}',
          current: 'Idioma actual: {{language}}',
        },
      },
    },
  },
};

const createTestI18n = () => {
  const testI18n = i18next.createInstance();
  testI18n.use(initReactI18next).init(testI18nConfig);
  return testI18n;
};

const renderWithI18n = (component: React.ReactElement, language = 'en') => {
  const testI18n = createTestI18n();
  testI18n.changeLanguage(language);
  return render(<I18nextProvider i18n={testI18n}>{component}</I18nextProvider>);
};

describe('Internationalization', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render content in English by default', () => {
    renderWithI18n(<AboutPage />);

    expect(screen.getByText("Hi, I'm Simon Lamb.")).toBeInTheDocument();
    expect(screen.getByText('Senior Frontend Engineer')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
  });

  it('should render content in Spanish when language is changed', () => {
    renderWithI18n(<AboutPage />, 'es');

    expect(screen.getByText('Hola, soy Simon Lamb.')).toBeInTheDocument();
    expect(screen.getByText('Ingeniero Frontend Senior')).toBeInTheDocument();
    expect(screen.getByText('Acerca de')).toBeInTheDocument();
  });

  it('should render LanguageSwitcher component', () => {
    renderWithI18n(<LanguageSwitcher variant="desktop" />);

    expect(screen.getByTestId('globe-icon')).toBeInTheDocument();
    expect(screen.getByTestId('chevron-down-icon')).toBeInTheDocument();
  });

  it('should show language dropdown when clicked', async () => {
    renderWithI18n(<LanguageSwitcher variant="desktop" />);

    const toggleButton = screen.getByRole('button');
    fireEvent.click(toggleButton);

    expect(screen.getByText('English')).toBeInTheDocument();
    expect(screen.getByText('Español')).toBeInTheDocument();
    expect(screen.getByText('Français')).toBeInTheDocument();
  });

  it('should handle mobile variant of LanguageSwitcher', () => {
    renderWithI18n(<LanguageSwitcher variant="mobile" />);

    expect(screen.getByText('Language')).toBeInTheDocument();
    expect(screen.getByText('English')).toBeInTheDocument();
    expect(screen.getByText('Español')).toBeInTheDocument();
    expect(screen.getByText('Français')).toBeInTheDocument();
  });

  it('should interpolate variables correctly', () => {
    renderWithI18n(<AboutPage />);

    // The title should interpolate the name variable
    expect(screen.getByText("Hi, I'm Simon Lamb.")).toBeInTheDocument();
  });

  it('should handle fallback to English for missing translations', () => {
    const testI18n = createTestI18n();
    testI18n.changeLanguage('fr'); // French not fully configured in test

    render(
      <I18nextProvider i18n={testI18n}>
        <AboutPage />
      </I18nextProvider>
    );

    // Should fallback to English if French translation is missing
    expect(screen.getByText(/Hi, I'm|Senior Frontend Engineer/)).toBeInTheDocument();
  });
});
