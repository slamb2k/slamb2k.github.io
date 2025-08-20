import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, ChevronDown } from 'lucide-react';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

const languages: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
];

interface LanguageSwitcherProps {
  variant?: 'desktop' | 'mobile';
  className?: string;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  variant = 'desktop',
  className = '',
}) => {
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const handleLanguageChange = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
    setIsOpen(false);

    // Update document direction for RTL languages (if needed in future)
    document.documentElement.dir = 'ltr'; // All current languages are LTR
  };

  const toggleDropdown = () => setIsOpen(!isOpen);

  if (variant === 'mobile') {
    return (
      <div className={`space-y-2 ${className}`}>
        <div className="text-xs text-tertiary uppercase tracking-wider font-medium">Language</div>
        {languages.map(language => (
          <button
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className={`flex items-center space-x-3 w-full py-2 px-3 rounded-lg transition-all duration-300 ${
              currentLanguage.code === language.code
                ? 'bg-midnight-accent/20 text-cyan border-l-4 border-cyan'
                : 'text-tertiary hover:text-primary hover:bg-midnight-elevated/50'
            }`}
            aria-label={t('language.switchTo', { language: language.name })}
          >
            <span className="text-lg">{language.flag}</span>
            <span className="text-sm font-medium">{language.nativeName}</span>
            {currentLanguage.code === language.code && (
              <span className="text-xs text-teal-400">•</span>
            )}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={toggleDropdown}
        className="flex items-center space-x-2 p-2 text-tertiary hover:text-cyan transition-colors duration-300 rounded-lg hover:bg-midnight-elevated/50"
        aria-label={t('language.current', { language: currentLanguage.name })}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Globe size={18} />
        <span className="text-sm font-medium">{currentLanguage.flag}</span>
        <ChevronDown
          size={14}
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />

            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full right-0 right-0 transform -translate-y-full mt-2 w-48 bg-midnight-elevated border border-white/5 rounded-lg shadow-xl z-50"
            >
              <div className="p-2">
                {languages.map((language, index) => (
                  <motion.button
                    key={language.code}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleLanguageChange(language.code)}
                    className={`flex items-center space-x-3 w-full py-2 px-3 rounded-lg transition-all duration-300 ${
                      currentLanguage.code === language.code
                        ? 'bg-midnight-accent/20 text-cyan'
                        : 'text-tertiary hover:text-primary hover:bg-midnight-elevated/50'
                    }`}
                    aria-label={t('language.switchTo', { language: language.name })}
                  >
                    <span className="text-lg">{language.flag}</span>
                    <div className="flex-1 text-left">
                      <div className="text-sm font-medium">{language.nativeName}</div>
                      <div className="text-xs text-tertiary">{language.name}</div>
                    </div>
                    {currentLanguage.code === language.code && (
                      <div className="w-2 h-2 bg-teal-300 rounded-full" />
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageSwitcher;
