import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useHasSidebar } from '@/hooks/use-mobile';
import { portfolioData } from '@/data/portfolio';
import { throttle } from '@/utils/performance';
import SidebarNavigation from './SidebarNavigation';
import HeroSectionOptimized from './HeroSectionOptimized';
import ProjectsSectionOptimized from './ProjectsSectionOptimized';
import ContactSection from './ContactSection';
import LazySection from '@/components/ui/LazySection';

interface AboutSectionProps {
  about: string[];
}

const AboutSection: React.FC<AboutSectionProps> = React.memo(({ about }) => (
  <motion.section 
    id="about" 
    initial={{
      opacity: 0,
      y: 50
    }} 
    whileInView={{
      opacity: 1,
      y: 0
    }} 
    transition={{
      duration: 0.6
    }} 
    viewport={{
      once: true
    }} 
    className="mb-24"
  >
    <h2 className="text-2xl font-bold text-slate-100 mb-6">About</h2>
    <div className="space-y-4 text-slate-400 leading-relaxed">
      {about.map((paragraph, index) => (
        <p key={index}>
          {paragraph.split('Upstatement').map((part, i, arr) => (
            <React.Fragment key={i}>
              {part}
              {i < arr.length - 1 && (
                <span className="text-teal-300 font-medium">Upstatement</span>
              )}
            </React.Fragment>
          ))}
        </p>
      ))}
    </div>
  </motion.section>
));

interface ExperienceSectionProps {
  experience: Array<{
    period: string;
    title: string;
    company: string;
    description: string;
    technologies: string[];
  }>;
}

const ExperienceSection: React.FC<ExperienceSectionProps> = React.memo(({ experience }) => (
  <motion.section 
    id="experience" 
    initial={{
      opacity: 0,
      y: 50
    }} 
    whileInView={{
      opacity: 1,
      y: 0
    }} 
    transition={{
      duration: 0.6
    }} 
    viewport={{
      once: true
    }} 
    className="mb-24"
  >
    <h2 className="text-2xl font-bold text-slate-100 mb-6">Experience</h2>
    <div className="space-y-8">
      {experience.map((job, index) => (
        <motion.div 
          key={index} 
          whileHover={{
            scale: 1.02
          }} 
          className="group relative p-6 rounded-lg border border-slate-800 hover:border-slate-700 hover:bg-slate-800/50 transition-all duration-300"
        >
          <div className="flex flex-col lg:flex-row lg:items-start gap-4">
            <div className="text-sm text-slate-500 font-mono lg:w-32 flex-shrink-0">
              {job.period}
            </div>
            <div className="flex-1">
              <h3 className="text-slate-100 font-semibold group-hover:text-teal-300 transition-colors">
                {job.title} · {job.company}
              </h3>
              <p className="text-slate-400 mt-2 text-sm leading-relaxed">
                {job.description}
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                {job.technologies.map(tech => (
                  <span 
                    key={tech} 
                    className="px-3 py-1 text-xs bg-teal-400/10 text-teal-300 rounded-full"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  </motion.section>
));

const PortfolioLandingPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState('about');
  const hasSidebar = useHasSidebar();

  // Throttled scroll handler for better performance
  const handleScroll = useCallback(() => {
    const sections = portfolioData.navigation.map(nav => nav.id);
    const scrollPosition = window.scrollY + 100;
    
    for (const section of sections) {
      const element = document.getElementById(section);
      if (element) {
        const { offsetTop, offsetHeight } = element;
        if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
          setActiveSection(section);
          break;
        }
      }
    }
  }, []);

  // Create throttled version
  const throttledHandleScroll = React.useMemo(
    () => throttle(handleScroll, 16), // ~60fps throttle
    [handleScroll]
  );

  useEffect(() => {
    window.addEventListener('scroll', throttledHandleScroll);
    return () => window.removeEventListener('scroll', throttledHandleScroll);
  }, [throttledHandleScroll]);

  const scrollToSection = useCallback((sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth'
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-300">
      {/* Mobile Header */}
      {!hasSidebar && (
        <motion.header 
          initial={{
            y: -100
          }} 
          animate={{
            y: 0
          }} 
          className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800"
        >
          <div className="px-6 py-4">
            <h1 className="text-xl font-bold text-slate-100">
              {portfolioData.personal.name}
            </h1>
          </div>
        </motion.header>
      )}

      <div className="lg:flex">
        {/* Sidebar Navigation - Desktop */}
        {hasSidebar && (
          <SidebarNavigation 
            activeSection={activeSection} 
            onSectionClick={scrollToSection} 
          />
        )}

        {/* Main Content */}
        <main className={`flex-1 ${!hasSidebar ? 'pt-20' : 'lg:ml-96'}`}>
          <div className="max-w-4xl mx-auto px-6 lg:px-12 py-12 lg:py-24">
            {/* Hero Section - Always visible, no lazy loading */}
            <HeroSectionOptimized 
              name={portfolioData.personal.name}
              tagline="I build things using AI."
              description={portfolioData.personal.tagline}
            />

            {/* About Section - Lazy loaded */}
            <LazySection 
              fallback={<div className="min-h-48 bg-slate-800/50 rounded-lg animate-pulse mb-24" />}
            >
              <AboutSection about={portfolioData.personal.about} />
            </LazySection>

            {/* Experience Section - Lazy loaded */}
            <LazySection 
              fallback={<div className="min-h-64 bg-slate-800/50 rounded-lg animate-pulse mb-24" />}
            >
              <ExperienceSection experience={portfolioData.experience} />
            </LazySection>

            {/* Projects Section - Lazy loaded with custom component */}
            <ProjectsSectionOptimized />

            {/* Contact Section - Lazy loaded */}
            <LazySection 
              fallback={<div className="min-h-48 bg-slate-800/50 rounded-lg animate-pulse" />}
            >
              <ContactSection />
            </LazySection>
          </div>
        </main>
      </div>
    </div>
  );
};

export default React.memo(PortfolioLandingPage);