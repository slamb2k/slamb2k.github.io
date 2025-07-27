import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Github, Linkedin, Twitter } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useContactConfig } from '@/hooks/useConfig';
import { portfolioData } from '@/data/portfolio';
import LazySection from '@/components/ui/LazySection';

// Memoized social link component with accessibility
const SocialLink: React.FC<{ social: any; index: number }> = React.memo(({ social, index }) => (
  <motion.a
    href={social.href}
    target="_blank"
    rel="noopener noreferrer"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
    whileHover={{ scale: 1.1, y: -2 }}
    whileTap={{ scale: 0.95 }}
    className="p-4 text-slate-400 hover:text-teal-300 transition-colors duration-300 rounded-lg hover:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-teal-300/50 focus:ring-offset-2 focus:ring-offset-slate-900"
    aria-label={`Visit ${social.label} profile (opens in new tab)`}
    role="listitem"
  >
    {React.createElement(social.icon, { size: 24, 'aria-hidden': true })}
  </motion.a>
));

const ContactPage: React.FC = () => {
  const { t } = useTranslation();
  const contactConfig = useContactConfig();
  
  // Memoize social links to prevent re-renders
  const socialLinks = React.useMemo(() => {
    const socialIcons = {
      Github,
      Linkedin,
      Twitter,
      Mail
    };
    
    return portfolioData.social.map(social => ({
      ...social,
      icon: socialIcons[social.icon as keyof typeof socialIcons] || Mail
    }));
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-4xl mx-auto px-6 lg:px-12 py-12 lg:py-24"
    >
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-center"
        aria-labelledby="contact-heading"
        role="main"
      >
        <h1 id="contact-heading" className="text-4xl lg:text-6xl font-bold text-slate-100 mb-6">
          {t('contact.title')}
        </h1>
        <p className="text-lg text-slate-400 mb-12 max-w-2xl mx-auto">
          {t('contact.message')}
        </p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-12"
        >
          <a
            href={`mailto:${contactConfig.email}`}
            className="inline-flex items-center px-8 py-4 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors duration-300 text-lg focus:outline-none focus:ring-2 focus:ring-teal-300/50 focus:ring-offset-2 focus:ring-offset-slate-900"
            aria-label={t('contact.buttonLabel', `Send email to ${contactConfig.email}`)}
            role="button"
          >
            <Mail className="mr-3" size={20} aria-hidden="true" />
            {t('contact.button')}
          </a>
        </motion.div>

        <LazySection
          fallback={
            <div className="flex justify-center space-x-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="w-16 h-16 bg-slate-800/50 rounded-lg animate-pulse" />
              ))}
            </div>
          }
          rootMargin="100px"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex justify-center space-x-6"
            role="list"
            aria-label={t('contact.socialLinksLabel', 'Social media and contact links')}
          >
            {socialLinks.map((social, index) => (
              <SocialLink key={social.label} social={social} index={index} />
            ))}
          </motion.div>
        </LazySection>
      </motion.section>
    </motion.div>
  );
};

export default React.memo(ContactPage);