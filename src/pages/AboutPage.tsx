import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { portfolioData } from '@/data/portfolio';

const AboutPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-4xl mx-auto px-6 lg:px-12 py-12 lg:py-24"
    >
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mb-24"
      >
        <h1 className="text-4xl lg:text-6xl font-bold text-slate-100 mb-6">
          {t('about.title', { name: portfolioData.personal.name })}
        </h1>
        <h2 className="text-xl lg:text-2xl text-slate-300 mb-8">
          {t('about.subtitle')}
        </h2>
        <p className="text-lg text-slate-400 max-w-2xl">
          {t('about.tagline')}
        </p>
      </motion.section>

      {/* About Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mb-24"
      >
        <h2 className="text-2xl font-bold text-slate-100 mb-6">{t('about.heading')}</h2>
        <div className="space-y-4 text-slate-400 leading-relaxed">
          <p>
            {t('about.paragraph1')}
          </p>
          <p>
            {t('about.paragraph2').split('Upstatement').map((part, i, arr) => (
              <React.Fragment key={i}>
                {part}
                {i < arr.length - 1 && (
                  <span className="text-teal-300 font-medium">Upstatement</span>
                )}
              </React.Fragment>
            ))}
          </p>
          <p>
            {t('about.paragraph3')}
          </p>
        </div>
      </motion.section>
    </motion.div>
  );
};

export default AboutPage;