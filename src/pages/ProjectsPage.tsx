import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Github } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import { getProjectsWithTranslations, ProjectWithTranslation } from '@/utils/portfolioData';
import LazySection from '@/components/ui/LazySection';
import OptimizedImage from '@/components/ui/OptimizedImage';
import VirtualList from '@/components/ui/VirtualList';
import { scrollReveal, staggerContainer, staggerItem } from '@/utils/animations';

// Memoized project card component matching Experience page style
const ProjectCard: React.FC<{ project: ProjectWithTranslation; index: number; t: TFunction }> =
  React.memo(({ project, index, t }) => (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      className={`group relative p-6 rounded-lg border transition-all duration-300 ${
        project.highlight
          ? 'border-amber-500/40 hover:border-amber-400/60 bg-gradient-to-br from-amber-950/20 via-sky-950/10 to-amber-950/20 hover:from-amber-900/30 hover:via-sky-900/20 hover:to-amber-900/30 shadow-xl shadow-amber-500/20'
          : project.featured
            ? 'border-sky-500/30 hover:border-sky-400/50 bg-sky-950/10 hover:bg-sky-900/20 shadow-lg shadow-sky-500/10'
            : 'border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3
            className={`font-semibold group-hover:text-sky-400 transition-colors ${
              project.highlight
                ? 'text-xl text-slate-100'
                : project.featured
                  ? 'text-lg text-slate-100'
                  : 'text-slate-100'
            }`}
          >
            {project.title}
          </h3>
          <div className="flex gap-2 mt-1">
            {project.highlight && (
              <span className="inline-block px-2 py-0.5 text-xs bg-amber-500/10 text-amber-400 rounded border border-amber-500/30 font-semibold">
                {t('common.highlight')}
              </span>
            )}
            {project.featured && (
              <span className="inline-block px-2 py-0.5 text-xs bg-sky-500/10 text-sky-400 rounded border border-sky-500/20">
                {t('common.featured')}
              </span>
            )}
          </div>
        </div>
        <div className="flex space-x-2">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-sky-400 transition-colors"
              aria-label={`View on GitHub`}
            >
              <Github size={16} aria-hidden="true" />
            </a>
          )}
          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-sky-400 transition-colors"
              aria-label={`Visit website`}
            >
              <ExternalLink size={16} aria-hidden="true" />
            </a>
          )}
        </div>
      </div>

      <p
        className={`text-slate-400 leading-relaxed mb-4 ${
          project.featured ? 'text-sm lg:text-base' : 'text-sm'
        }`}
      >
        {project.description}
      </p>

      <div className="flex flex-wrap gap-2">
        {project.technologies.map((tech: string) => (
          <span
            key={tech}
            className="px-3 py-1.5 text-xs bg-sky-500/10 text-sky-300 rounded-full border border-sky-500/20 font-medium"
          >
            {t(`technologies.${tech}`, tech)}
          </span>
        ))}
      </div>
    </motion.div>
  ));

const ProjectsPage: React.FC = () => {
  const { t } = useTranslation();

  // Memoized projects data combining portfolio structure with translations
  const projects = React.useMemo(() => {
    return getProjectsWithTranslations(t);
  }, [t]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-6xl mx-auto px-8 lg:px-16 py-12 lg:py-24"
    >
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        aria-labelledby="projects-heading"
        role="main"
      >
        <h1
          id="projects-heading"
          className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-sky-300 to-blue-500 bg-clip-text text-transparent mb-2 leading-tight pb-2"
        >
          {t('projects.title')}
        </h1>
        <p className="text-lg text-neutral-400 mb-12 max-w-2xl">{t('projects.description')}</p>

        {/* Project grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <div
              key={project.id}
              className={
                project.highlight
                  ? 'md:col-span-2 lg:col-span-3'
                  : project.featured
                    ? 'md:col-span-2 lg:col-span-2'
                    : ''
              }
            >
              <ProjectCard project={project} index={index} t={t} />
            </div>
          ))}
        </div>
      </motion.section>
    </motion.div>
  );
};

export default React.memo(ProjectsPage);
