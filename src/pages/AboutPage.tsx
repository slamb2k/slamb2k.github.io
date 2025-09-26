import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Hero images with descriptions
  const heroImages = React.useMemo(
    () => [
      {
        src: '/devops-advocate-car.jpg',
        alt: 'DevOps license plate showing commitment to DevOps',
        title: 'Always Advocating DevOps',
        description: 'Championing DevOps transformation at every opportunity',
      },
      {
        src: '/microsoft-inspire-openhack-vegas.jpg',
        alt: 'Simon Lamb at Microsoft Inspire DevOps OpenHack in Las Vegas',
        title: 'Microsoft Inspire - Las Vegas',
        description:
          'Overseeing coaches mentoring Microsoft staff, customers and partners in DevOps practices',
      },
      {
        src: '/microsoft-ready-seattle.jpg',
        alt: 'Simon Lamb at Microsoft Ready in Seattle',
        title: 'Microsoft Ready - Seattle',
        description: 'Leading coaching teams for enterprise DevOps transformation workshops',
      },
      {
        src: '/technical-presentation.jpg',
        alt: 'Simon Lamb delivering technical presentation',
        title: 'Community Driven',
        description: 'Cloud-agnostic delivery for community events',
      },
      {
        src: '/devops-workshop-speaker.jpg',
        alt: 'Simon Lamb speaking at DevOps workshop',
        title: 'DevOps Workshop Speaker',
        description: 'Empowering teams with hands-on DevOps training',
      },
    ],
    []
  );

  // Auto-rotate images every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(prev => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  // Memoize paragraphs to prevent unnecessary re-renders
  const aboutParagraphs = React.useMemo(
    () => [t('about.paragraph1'), t('about.paragraph2'), t('about.paragraph3')],
    [t]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-6xl mx-auto px-8 lg:px-16 py-12 lg:py-24"
    >
      {/* Hero Image Carousel */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="mb-12 lg:mb-16 w-full lg:w-2/5 rounded-xl overflow-hidden shadow-2xl relative group"
      >
        <div className="relative aspect-square">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentImageIndex}
              src={heroImages[currentImageIndex].src}
              alt={heroImages[currentImageIndex].alt}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 w-full h-full object-cover"
              loading="eager"
            />
          </AnimatePresence>

          {/* Dark overlay on hover for better text readability */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Image overlay with description */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <p className="text-lg font-semibold drop-shadow-lg">
                {heroImages[currentImageIndex].title}
              </p>
              <p className="text-sm opacity-95 mt-1 drop-shadow-lg">
                {heroImages[currentImageIndex].description}
              </p>
            </div>
          </div>

          {/* Image indicators */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
            {heroImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentImageIndex ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/75'
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
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
