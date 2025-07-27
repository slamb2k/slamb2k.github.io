import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { portfolioData } from '@/data/portfolio';

const NavigationHeader: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  
  // Get current active section from URL path
  const currentPath = location.pathname === '/' ? '/about' : location.pathname;
  const activeSection = currentPath.replace('/', '') || 'about';
  
  const navigationItems = portfolioData.navigation;

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800"
      >
        <div className="px-6 py-4 flex items-center justify-between">
          <Link to="/about" onClick={closeMenu}>
            <h1 className="text-xl font-bold text-slate-100 hover:text-teal-300 transition-colors">
              {portfolioData.personal.name}
            </h1>
          </Link>
          
          <button
            onClick={toggleMenu}
            className="p-2 text-slate-400 hover:text-slate-100 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-40"
              onClick={closeMenu}
            />
            
            {/* Menu Content */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 right-0 h-full w-80 bg-slate-900 border-l border-slate-800 z-50 p-6 pt-24"
            >
              <nav className="space-y-6">
                {navigationItems.map((item, index) => {
                  const isActive = activeSection === item.id;
                  const routePath = item.id === 'about' ? '/' : `/${item.id}`;
                  
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ x: 50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        to={routePath}
                        onClick={closeMenu}
                        className={`block py-3 px-4 rounded-lg transition-all duration-300 ${
                          isActive
                            ? 'bg-teal-600/20 text-teal-300 border-l-4 border-teal-300'
                            : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
                        }`}
                      >
                        <span className="text-lg font-medium tracking-wide uppercase">
                          {item.label}
                        </span>
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default NavigationHeader;