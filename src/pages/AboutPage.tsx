import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { portfolioData } from '@/data/portfolio';
import LazySection from '@/components/ui/LazySection';

// Memoized paragraph component
const AboutParagraph: React.FC<{
  content: string;
  className?: string;
  isLast?: boolean;
  isPersonal?: boolean;
}> = React.memo(({ content, className = '', isLast = false, isPersonal = false }) => {
  if (content.includes('Upstatement')) {
    return (
      <p className={className}>
        {content.split('Upstatement').map((part, i, arr) => (
          <React.Fragment key={i}>
            {part}
            {i < arr.length - 1 && <span className="text-accent font-medium">Upstatement</span>}
          </React.Fragment>
        ))}
      </p>
    );
  }

  // Handle the last paragraph with contact link
  if (isLast) {
    // Check for different language versions of the contact text
    const contactPhrases = ["Let's connect!", '¡Conectemos!', 'Connectons-nous!'];
    const foundPhrase = contactPhrases.find(phrase => content.includes(phrase));

    if (foundPhrase) {
      const parts = content.split(foundPhrase);
      return (
        <p className={className}>
          {parts[0]}
          <Link
            to="/contact"
            className="text-teal-400 hover:text-teal-300 font-semibold underline decoration-2 underline-offset-2 transition-colors"
          >
            {foundPhrase}
          </Link>
        </p>
      );
    }
  }

  // Handle personal paragraph with highlighted phrases
  if (isPersonal) {
    // Simple approach: manually parse the known structure
    const parts: (string | React.ReactElement)[] = [];
    let remaining = content;

    // Find and replace "right clicking to publish"
    const rightClickIndex = remaining.indexOf('"right clicking to publish"');
    if (rightClickIndex !== -1) {
      // Add everything before
      parts.push(remaining.substring(0, rightClickIndex));
      // Add the highlighted phrase with quotes
      parts.push('"');
      parts.push(
        <span key="right-click" className="text-purple-400 font-medium">
          right clicking to publish
        </span>
      );
      parts.push('"');
      // Check if there's a period after
      const afterPhrase = rightClickIndex + '"right clicking to publish"'.length;
      if (remaining[afterPhrase] === '.') {
        parts.push('.');
        remaining = remaining.substring(afterPhrase + 1);
      } else {
        remaining = remaining.substring(afterPhrase);
      }
    }

    // Find and replace "No Pilots"
    const noPilotsIndex = remaining.indexOf('"No Pilots"');
    if (noPilotsIndex !== -1) {
      // Add everything before
      parts.push(remaining.substring(0, noPilotsIndex));
      // Add the highlighted phrase with quotes
      parts.push('"');
      parts.push(
        <span key="no-pilots" className="text-purple-400 font-medium">
          No Pilots
        </span>
      );
      parts.push('"');
      // Update remaining text
      remaining = remaining.substring(noPilotsIndex + '"No Pilots"'.length);
    }

    // Add any remaining text
    if (remaining) {
      parts.push(remaining);
    }

    return <p className={className}>{parts.length > 0 ? parts : content}</p>;
  }

  return <p className={className}>{content}</p>;
});

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
      {
        src: '/devops-bootcamp.png',
        alt: 'Daughters wearing DevOps Bootcamp shirts explaining Deploy or Die',
        title: 'DevOps Bootcamp - Next Generation',
        description: 'My daughters explaining the risks of "right clicking to publish"',
      },
      {
        src: '/devops-lambdog.jpg',
        alt: 'DevOps t-shirt with LambDog wordplay',
        title: 'DevOps Recognition',
        description:
          'My partner recognising the importance of DevOps - where coding meets chaos management',
      },
      {
        src: '/no-pilots.jpg',
        alt: 'No Pilots band photo with Microsoft colleagues',
        title: 'No Pilots Band',
        description:
          "Rocking out with fellow Microsofties - because who needs a Copilot when you've got DevOps!",
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
    () => [
      t('about.paragraph1'),
      t('about.paragraph2'),
      t('about.paragraph3'),
      t('about.paragraph4'),
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
              className={`absolute inset-0 w-full h-full ${
                heroImages[currentImageIndex].src.includes('no-pilots')
                  ? 'object-contain bg-black object-bottom'
                  : 'object-cover'
              }`}
              style={
                heroImages[currentImageIndex].src.includes('no-pilots')
                  ? { transform: 'scale(1.08)', transformOrigin: 'center bottom' }
                  : {}
              }
              loading={currentImageIndex === 0 ? 'eager' : 'lazy'}
            />
          </AnimatePresence>

          {/* Gradient overlay and text - visible by default, hidden on hover */}
          <div className="absolute inset-0 transition-opacity duration-300 group-hover:opacity-0">
            {/* Gradient overlay at the top for text readability */}
            <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-black/95 via-black/70 to-transparent" />

            {/* Text at the top */}
            <div className="absolute top-0 left-0 right-0 p-6 text-white">
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
        className="mb-12"
      >
        <h1 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-teal-300 to-accent bg-clip-text text-transparent mb-2 leading-tight pb-2">
          {t('about.title', { name: portfolioData.personal.name })}
        </h1>
        {t('about.subtitle') && (
          <h2 className="text-xl lg:text-2xl text-accent mb-8">{t('about.subtitle')}</h2>
        )}
        <p className="text-lg text-neutral-500 max-w-4xl">{t('about.tagline')}</p>
      </motion.section>

      {/* About Me Section - Lazy loaded */}
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
          className="mb-12"
        >
          <h2 className="text-2xl lg:text-3xl font-bold text-white mb-6">{t('about.heading')}</h2>
          <div className="space-y-4 text-neutral-500 leading-relaxed">
            {aboutParagraphs.map((paragraph, index) => {
              let className = '';
              if (index === 2) {
                // Call to action paragraph
                className =
                  'text-lg font-medium text-white bg-gradient-to-r from-teal-500/10 to-purple-500/10 p-4 rounded-lg border border-teal-500/20';
              } else if (index === 3) {
                // Personal paragraph
                className = 'text-base italic mt-6 pt-6 border-t border-slate-800';
              }

              return (
                <AboutParagraph
                  key={index}
                  content={paragraph}
                  className={className}
                  isLast={index === 2}
                  isPersonal={index === 3}
                />
              );
            })}
          </div>
        </motion.section>
      </LazySection>
    </motion.div>
  );
};

export default React.memo(AboutPage);
