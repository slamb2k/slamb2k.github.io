import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, Linkedin, Twitter, Mail, Download, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { portfolioData } from '@/data/portfolio';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';
import { KEYS, createKeyboardNavigationHandler, getFocusableElements } from '@/utils/keyboard';
import { fadeIn, staggerContainer, staggerItem } from '@/utils/animations';

const NavigationSidebar: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [hoveredSection, setHoveredSection] = React.useState<string | null>(null);
  const [previousActiveSection, setPreviousActiveSection] = React.useState<string>('');
  const [isInitialLoad, setIsInitialLoad] = React.useState(true);
  const [focusedNavIndex, setFocusedNavIndex] = React.useState(-1);
  const navigationRef = React.useRef<HTMLElement>(null);

  // Get current active section from URL path
  const currentPath = location.pathname === '/' ? '/blog' : location.pathname;
  const activeSection = currentPath.replace('/', '') || 'blog';

  React.useEffect(() => {
    if (isInitialLoad && activeSection) {
      setIsInitialLoad(false);
      setPreviousActiveSection(activeSection);
    }
  }, [activeSection, isInitialLoad]);

  React.useEffect(() => {
    if (!isInitialLoad && activeSection !== previousActiveSection) {
      setPreviousActiveSection(activeSection);
    }
  }, [activeSection, previousActiveSection, isInitialLoad]);

  const navigationItems = [
    { id: 'blog', label: t('nav.blog') },
    { id: 'experience', label: t('nav.experience') },
    { id: 'projects', label: t('nav.projects') },
    { id: 'contact', label: t('nav.contact') },
    { id: 'about', label: t('nav.aboutMe') },
  ];

  const socialIcons = {
    Github,
    Linkedin,
    Twitter,
    Mail,
  };

  const socialLinks = portfolioData.social.map(social => ({
    ...social,
    icon: socialIcons[social.icon as keyof typeof socialIcons] || Mail,
  }));

  // Keyboard navigation handler for main navigation
  const handleNavigationKeyDown = React.useCallback((event: React.KeyboardEvent) => {
    if (!navigationRef.current) return;

    const navLinks = getFocusableElements(navigationRef.current);

    if (event.key === KEYS.ARROW_DOWN) {
      event.preventDefault();
      const currentIndex = navLinks.findIndex(link => link === document.activeElement);
      const nextIndex = currentIndex < navLinks.length - 1 ? currentIndex + 1 : 0;
      navLinks[nextIndex]?.focus();
      setFocusedNavIndex(nextIndex);
    } else if (event.key === KEYS.ARROW_UP) {
      event.preventDefault();
      const currentIndex = navLinks.findIndex(link => link === document.activeElement);
      const prevIndex = currentIndex > 0 ? currentIndex - 1 : navLinks.length - 1;
      navLinks[prevIndex]?.focus();
      setFocusedNavIndex(prevIndex);
    } else if (event.key === KEYS.HOME) {
      event.preventDefault();
      navLinks[0]?.focus();
      setFocusedNavIndex(0);
    } else if (event.key === KEYS.END) {
      event.preventDefault();
      const lastIndex = navLinks.length - 1;
      navLinks[lastIndex]?.focus();
      setFocusedNavIndex(lastIndex);
    }
  }, []);

  return (
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed left-0 top-0 h-screen w-96 bg-slate-900 border-r border-white/5 p-12 flex flex-col justify-between z-40"
    >
      {/* Header */}
      <div>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Link to="/blog" className="block">
            <div className="text-fluid-3xl font-bold text-white mb-2 hover:text-accent transition-colors duration-300">
              {portfolioData.personal.name}
            </div>
          </Link>
          <div className="text-fluid-xl text-accent mb-4">{t('sidebar.title')}</div>
          <p className="text-neutral-400 text-fluid-sm leading-relaxed mb-12">
            {t('sidebar.tagline')}
          </p>
        </motion.div>

        {/* Navigation */}
        <nav
          ref={navigationRef}
          className="space-y-4"
          role="navigation"
          aria-label="Main navigation"
          onKeyDown={handleNavigationKeyDown}
        >
          {navigationItems.map((item, index) => {
            const isActive = activeSection === item.id;
            const routePath = `/${item.id}`;

            return (
              <motion.div
                key={item.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <Link
                  to={routePath}
                  onMouseEnter={() => setHoveredSection(item.id)}
                  onMouseLeave={() => setHoveredSection(null)}
                  aria-current={isActive ? 'page' : undefined}
                  aria-describedby={`nav-description-${item.id}`}
                  className={`group relative flex items-center space-x-4 w-full text-left py-3 px-2 transition-all duration-300 focus:outline-none rounded-lg ${
                    isActive ? 'text-accent' : 'text-slate-400 hover:text-slate-200'
                  } ${isActive ? 'bg-accent/10' : 'hover:bg-slate-800/10'}`}
                >
                  {/* Animated gradient indicator */}
                  <div className="relative">
                    <div
                      className={`h-px transition-all duration-300 ${
                        isActive
                          ? 'w-16 bg-accent animate-gradient'
                          : `w-8 bg-slate-600 ${!isActive ? 'group-hover:w-16 group-hover:bg-accent/50' : ''}`
                      }`}
                    />
                    {isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute inset-0 w-16 h-px bg-accent shadow-glow"
                        initial={false}
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                  </div>
                  <div className="text-fluid-sm font-medium tracking-widest uppercase overflow-hidden flex items-center justify-between flex-1">
                    <div className="flex items-center">
                      {/* Archive icon - box/folder */}
                      {item.id === 'blog' && (
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="mr-2 flex-shrink-0"
                        >
                          {/* Box body */}
                          <path
                            d="M3 8H21V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V8Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          {/* Box lid */}
                          <path
                            d="M21 8L19 3H5L3 8"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          {/* Handle/label */}
                          <path
                            d="M10 12H14"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                        </svg>
                      )}
                      {/* Experience icon - briefcase */}
                      {item.id === 'experience' && (
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="mr-2 flex-shrink-0"
                        >
                          <rect
                            x="3"
                            y="7"
                            width="18"
                            height="13"
                            rx="2"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M8 7V5C8 3.89543 8.89543 3 10 3H14C15.1046 3 16 3.89543 16 5V7"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M12 12V12.01"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                          <path
                            d="M3 12H21"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                        </svg>
                      )}
                      {/* Projects icon - code/terminal */}
                      {item.id === 'projects' && (
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="mr-2 flex-shrink-0"
                        >
                          <path
                            d="M8 9L4 12L8 15"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M16 9L20 12L16 15"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M12 5L10 19"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                        </svg>
                      )}
                      {item.label.split('').map((letter, letterIndex) => {
                        const isCurrentlyActive = isActive;
                        const isHovered = hoveredSection === item.id;
                        const isNewlyActive =
                          isCurrentlyActive &&
                          activeSection !== previousActiveSection &&
                          !isInitialLoad;
                        const isInitialActive = isInitialLoad && isCurrentlyActive;

                        // Should animate when:
                        // 1. Initial load and section is active
                        // 2. Section becomes newly active via navigation (but not on initial load)
                        // 3. Section is hovered but NOT currently active (prevents active items from animating on hover)
                        // const shouldAnimate =
                        //   isInitialActive || isNewlyActive || (isHovered && !isCurrentlyActive);
                        const shouldAnimate = false;

                        const randomSpins = 2 + Math.floor(Math.random() * 4); // 2-5 spins
                        return (
                          <motion.span
                            key={`${item.id}-${letter}-${letterIndex}`}
                            className="inline-block"
                            animate={
                              shouldAnimate
                                ? {
                                    rotateX: [0, randomSpins * 360],
                                    scale: [0.9, 1],
                                  }
                                : {}
                            }
                            transition={{
                              duration: 1.8,
                              delay: letterIndex * 0.02,
                              ease: [0.25, 0.1, 0.25, 1],
                            }}
                            style={{
                              transformOrigin: 'center center',
                              transformStyle: 'preserve-3d',
                              // Preserve spaces in display
                              whiteSpace: letter === ' ' ? 'pre' : 'normal',
                            }}
                          >
                            {letter === ' ' ? '\u00A0' : letter}
                          </motion.span>
                        );
                      })}
                    </div>
                  </div>
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronRight size={16} className="text-accent" />
                    </motion.div>
                  )}
                  {/* Hidden description for screen readers */}
                  <span id={`nav-description-${item.id}`} className="sr-only">
                    {t(`nav.description.${item.id}`, `Navigate to ${item.label} section`)}
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </nav>
      </div>

      <div className="space-y-6">
        {/* Quick action button */}
        <motion.a
          href="/Simon Lamb - Professional Resume.pdf"
          download="Simon Lamb - Professional Resume.pdf"
          whileHover={{ scale: 1.05, y: -3 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center justify-center space-x-2 py-2 px-4 bg-accent/10 hover:bg-accent/20 text-accent font-semibold rounded-lg text-fluid-sm border border-accent/20 hover:border-accent/40 shadow-elevation-1 hover:shadow-elevation-2 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:ring-offset-2 focus:ring-offset-slate-900"
        >
          <Download size={16} />
          <span>{t('common.downloadResume')}</span>
        </motion.a>
        {/* Language Switcher */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <LanguageSwitcher variant="desktop" />
        </motion.div>

        {/* Social Links */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex space-x-4"
          aria-label="Social media links"
        >
          {socialLinks.map(social => (
            <motion.a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 text-slate-400 hover:text-accent transition-all duration-300 rounded-lg focus:outline-none hover:scale-110 hover:rotate-6"
              aria-label={`${social.label} (opens in new tab)`}
            >
              {React.createElement(social.icon, { size: 20, 'aria-hidden': true })}
            </motion.a>
          ))}
        </motion.div>
      </div>
    </motion.aside>
  );
};

export default NavigationSidebar;
