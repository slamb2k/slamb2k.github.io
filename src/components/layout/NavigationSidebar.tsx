import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Github, Linkedin, Twitter, Mail } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { portfolioData } from '@/data/portfolio';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';
import { KEYS, createKeyboardNavigationHandler, getFocusableElements } from '@/utils/keyboard';

const NavigationSidebar: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [hoveredSection, setHoveredSection] = React.useState<string | null>(null);
  const [previousActiveSection, setPreviousActiveSection] = React.useState<string>('');
  const [isInitialLoad, setIsInitialLoad] = React.useState(true);
  const [focusedNavIndex, setFocusedNavIndex] = React.useState(-1);
  const navigationRef = React.useRef<HTMLElement>(null);

  // Get current active section from URL path
  const currentPath = location.pathname === '/' ? '/about' : location.pathname;
  const activeSection = currentPath.replace('/', '') || 'about';

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
    { id: 'about', label: t('nav.about') },
    { id: 'experience', label: t('nav.experience') },
    { id: 'projects', label: t('nav.projects') },
    { id: 'contact', label: t('nav.contact') },
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
      className="fixed left-0 top-0 h-screen w-96 bg-slate-900 border-r border-slate-800 p-12 flex flex-col justify-between z-40"
    >
      {/* Header */}
      <div>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Link to="/about" className="block">
            <h1 className="text-4xl font-bold text-slate-100 mb-2 hover:text-teal-300 transition-colors">
              {portfolioData.personal.name}
            </h1>
          </Link>
          <h2 className="text-xl text-slate-300 mb-4">{portfolioData.personal.title}</h2>
          <p className="text-slate-400 text-sm leading-relaxed mb-8">
            {portfolioData.personal.tagline}
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
            const routePath = item.id === 'about' ? '/' : `/${item.id}`;

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
                  className={`group flex items-center space-x-4 w-full text-left py-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-teal-300/50 focus:ring-offset-2 focus:ring-offset-slate-900 rounded-lg ${
                    isActive ? 'text-slate-100' : 'text-slate-400 hover:text-slate-100'
                  }`}
                >
                  <div
                    className={`h-px transition-all duration-300 ${
                      isActive
                        ? 'w-16 bg-slate-100'
                        : `w-8 bg-slate-600 ${!isActive ? 'group-hover:w-16 group-hover:bg-slate-100' : ''}`
                    }`}
                  />
                  <div className="text-sm font-medium tracking-widest uppercase overflow-hidden">
                    <div className="flex">
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
                            }}
                          >
                            {letter}
                          </motion.span>
                        );
                      })}
                    </div>
                  </div>
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
          role="list"
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
              className="p-2 text-slate-400 hover:text-teal-300 transition-colors duration-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-300/50 focus:ring-offset-2 focus:ring-offset-slate-900"
              aria-label={`${social.label} (opens in new tab)`}
              role="listitem"
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
