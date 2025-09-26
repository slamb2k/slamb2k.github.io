import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { portfolioData } from '@/data/portfolio';
import LazySection from '@/components/ui/LazySection';

// Memoized paragraph component
const AboutParagraph: React.FC<{ content: string; className?: string }> = React.memo(
  ({ content, className = '' }) => {
    if (content.includes('Upstatement')) {
      return (
        <p className={className}>
          {content.split('Upstatement').map((part, i, arr) => (
            <React.Fragment key={i}>
              {part}
              {i < arr.length - 1 && <span className="text-teal-300 font-medium">Upstatement</span>}
            </React.Fragment>
          ))}
        </p>
      );
    }
    return <p className={className}>{content}</p>;
  }
);

const AboutPage: React.FC = () => {
  const { t } = useTranslation();

  // Memoize paragraphs to prevent unnecessary re-renders
  const aboutParagraphs = React.useMemo(
    () => [
      t('about.paragraph1'),
      t('about.paragraph2'),
      t('about.paragraph3'),
      t('about.paragraph4'),
      t('about.paragraph5'),
      t('about.paragraph6'),
    ],
    [t]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-6xl mx-auto px-8 lg:px-16 py-12 lg:py-24"
    >
      {/* Hero Image */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="mb-12 lg:mb-16 rounded-xl overflow-hidden shadow-2xl relative group"
      >
        <img
          src="/presenting-devops.jpg"
          alt="Simon Lamb presenting at a DevOps event"
          className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <p className="text-lg font-semibold">Speaking at Microsoft DevOps OpenHack</p>
            <p className="text-sm opacity-90 mt-1">Empowering teams with DevOps best practices</p>
          </div>
        </div>
      </motion.div>

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
        <h2 className="text-xl lg:text-2xl text-slate-300 mb-8">{t('about.subtitle')}</h2>
        <p className="text-lg text-slate-400 max-w-2xl">{t('about.tagline')}</p>
      </motion.section>

      {/* About Section - Lazy loaded */}
      <LazySection
        fallback={
          <div className="mb-24">
            <div className="h-8 w-32 bg-slate-800/50 rounded mb-6 animate-pulse" />
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-20 bg-slate-800/50 rounded animate-pulse" />
              ))}
            </div>
          </div>
        }
        rootMargin="100px"
      >
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-24"
        >
          <h2 className="text-2xl font-bold text-slate-100 mb-6">{t('about.heading')}</h2>
          <div className="space-y-4 text-slate-400 leading-relaxed">
            {aboutParagraphs.map((paragraph, index) => (
              <AboutParagraph key={index} content={paragraph} />
            ))}
          </div>
        </motion.section>
      </LazySection>
    </motion.div>
  );
};

export default React.memo(AboutPage);
