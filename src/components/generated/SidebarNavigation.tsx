import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, Linkedin, Twitter, Mail } from 'lucide-react';
import { portfolioData } from '@/data/portfolio';

interface SidebarNavigationProps {
  activeSection: string;
  onSectionClick: (sectionId: string) => void;
}
const SidebarNavigation: React.FC<SidebarNavigationProps> = ({ activeSection, onSectionClick }) => {
  // FORCE REMOUNT - remove this line after testing
  console.log('SidebarNavigation remounted - cache bust');
  const [previousActiveSection, setPreviousActiveSection] = React.useState<string>('');
  const [isInitialLoad, setIsInitialLoad] = React.useState(true);
  const [animatingItems, setAnimatingItems] = React.useState<Set<string>>(new Set());

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

  // Trigger animation for a navigation item - ONCE STARTED, NEVER STOPS
  const triggerItemAnimation = (itemId: string) => {
    console.log('🎯 triggerItemAnimation called for:', itemId, 'current animating:', [
      ...animatingItems,
    ]);
    if (animatingItems.has(itemId)) {
      console.log('❌ Animation already triggered for:', itemId);
      return; // Prevent overlapping animations
    }

    console.log('✅ Starting animation for:', itemId);
    // Add to animating items and NEVER remove - this guarantees uninterruptible animation
    setAnimatingItems(prev => {
      const newSet = new Set([...prev, itemId]);
      console.log('🔄 Updated animatingItems:', [...newSet]);
      return newSet;
    });
  };
  const navigationItems = portfolioData.navigation;

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
  return (
    <motion.aside
      initial={{
        x: -100,
        opacity: 0,
      }}
      animate={{
        x: 0,
        opacity: 1,
      }}
      transition={{
        duration: 0.6,
      }}
      className="fixed left-0 top-0 h-screen w-96 bg-slate-900 border-r border-slate-800 p-12 flex flex-col justify-between z-40"
    >
      {/* Header */}
      <div>
        <motion.div
          initial={{
            y: 20,
            opacity: 0,
          }}
          animate={{
            y: 0,
            opacity: 1,
          }}
          transition={{
            delay: 0.2,
          }}
        >
          <h1 className="text-4xl font-bold text-slate-100 mb-2">{portfolioData.personal.name}</h1>
          <h2 className="text-xl text-slate-300 mb-4">{portfolioData.personal.title}</h2>
          <p className="text-slate-400 text-sm leading-relaxed mb-8">
            {portfolioData.personal.tagline}
          </p>
        </motion.div>

        {/* Navigation */}
        <nav className="space-y-4">
          {navigationItems.map((item, index) => (
            <motion.button
              key={item.id}
              initial={{
                x: -20,
                opacity: 0,
              }}
              animate={{
                x: 0,
                opacity: 1,
              }}
              transition={{
                delay: 0.3 + index * 0.1,
              }}
              onClick={() => onSectionClick(item.id)}
              onMouseEnter={() => {
                // Only animate on hover if not currently active (prevents active items from animating)
                if (activeSection !== item.id) {
                  triggerItemAnimation(item.id);
                }
              }}
              className={`group flex items-center space-x-4 w-full text-left py-2 transition-all duration-300 ${activeSection === item.id ? 'text-slate-100' : 'text-slate-400 hover:text-slate-100'}`}
            >
              <div
                className={`h-px transition-all duration-300 ${activeSection === item.id ? 'w-16 bg-slate-100' : `w-8 bg-slate-600 ${activeSection !== item.id ? 'group-hover:w-16 group-hover:bg-slate-100' : ''}`}`}
              />
              <div className="text-sm font-medium tracking-widest uppercase overflow-hidden">
                <div className="flex">
                  {item.label.split('').map((letter, letterIndex) => {
                    const isCurrentlyActive = activeSection === item.id;
                    const isNewlyActive =
                      isCurrentlyActive &&
                      activeSection !== previousActiveSection &&
                      !isInitialLoad;
                    const isInitialActive = isInitialLoad && isCurrentlyActive;
                    const isHoverAnimating = animatingItems.has(item.id);

                    // Animate when: initial load + active, newly active, or hover triggered
                    // ONCE TRIGGERED, NEVER STOPS - isHoverAnimating stays true forever
                    const shouldAnimate = isInitialActive || isNewlyActive || isHoverAnimating;

                    // Debug logging for first letter only
                    if (letterIndex === 0) {
                      console.log(`🔤 Letter "${letter}" (${item.id}):`, {
                        isHoverAnimating,
                        shouldAnimate,
                        animatingItems: [...animatingItems],
                      });
                    }

                    return (
                      <motion.span
                        key={`${item.id}-${letter}-${letterIndex}`}
                        className="inline-block"
                        initial={{ rotateX: 0, scale: 1 }}
                        animate={
                          shouldAnimate
                            ? {
                                rotateX: 720,
                                scale: [1, 0.9, 1],
                              }
                            : {
                                rotateX: 0,
                                scale: 1,
                              }
                        }
                        transition={{
                          duration: shouldAnimate ? 1.0 : 0.3,
                          delay: shouldAnimate ? letterIndex * 0.02 : 0,
                          ease: shouldAnimate ? 'linear' : 'easeOut',
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
            </motion.button>
          ))}
        </nav>
      </div>

      {/* Social Links */}
      <motion.div
        initial={{
          y: 20,
          opacity: 0,
        }}
        animate={{
          y: 0,
          opacity: 1,
        }}
        transition={{
          delay: 0.8,
        }}
        className="flex space-x-4"
      >
        {socialLinks.map(social => (
          <motion.a
            key={social.label}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{
              scale: 1.1,
              y: -2,
            }}
            whileTap={{
              scale: 0.95,
            }}
            className="p-2 text-slate-400 hover:text-teal-300 transition-colors duration-300"
            aria-label={social.label}
          >
            {React.createElement(social.icon, { size: 20 })}
          </motion.a>
        ))}
      </motion.div>
    </motion.aside>
  );
};
export default SidebarNavigation;
