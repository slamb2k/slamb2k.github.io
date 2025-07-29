import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Github } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import { getProjectsWithTranslations, ProjectWithTranslation } from '@/utils/portfolioData';
import LazySection from '@/components/ui/LazySection';
import OptimizedImage from '@/components/ui/OptimizedImage';
import VirtualList from '@/components/ui/VirtualList';

// Memoized project card component for better performance with accessibility
const ProjectCard: React.FC<{ project: ProjectWithTranslation; index: number; t: TFunction }> =
  React.memo(({ project, index, t }) => (
    <motion.article
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
      whileHover={{ y: -5 }}
      className="group relative p-6 rounded-lg border border-slate-800 hover:border-slate-700 hover:bg-slate-800/50 transition-all duration-300"
      role="listitem"
      aria-labelledby={`project-title-${index}`}
      aria-describedby={`project-description-${index}`}
    >
      <div className="flex items-start justify-between mb-4">
        <h3
          id={`project-title-${index}`}
          className="text-slate-100 font-semibold group-hover:text-teal-300 transition-colors"
        >
          {project.title}
        </h3>
        <div
          className="flex space-x-2"
          role="group"
          aria-label={t(
            'projects.actionsLabel',
            { title: project.title },
            `Actions for ${project.title}`
          )}
        >
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-slate-100 transition-colors p-1 rounded focus:outline-none focus:ring-2 focus:ring-teal-300/50 focus:ring-offset-2 focus:ring-offset-slate-900"
              aria-label={t(
                'common.viewOnGithub',
                { title: project.title },
                `View ${project.title} on GitHub (opens in new tab)`
              )}
            >
              <Github size={18} aria-hidden="true" />
            </a>
          )}
          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-slate-100 transition-colors p-1 rounded focus:outline-none focus:ring-2 focus:ring-teal-300/50 focus:ring-offset-2 focus:ring-offset-slate-900"
              aria-label={t(
                'common.visitProject',
                { title: project.title },
                `Visit ${project.title} live demo (opens in new tab)`
              )}
            >
              <ExternalLink size={18} aria-hidden="true" />
            </a>
          )}
        </div>
      </div>

      {/* Optimized image for project thumbnails */}
      {project.image && (
        <OptimizedImage
          src={project.image}
          alt={`${project.title} screenshot`}
          width={300}
          height={200}
          className="w-full h-32 object-cover rounded-lg mb-4"
          loading="lazy"
        />
      )}

      <p
        id={`project-description-${index}`}
        className="text-slate-400 text-sm leading-relaxed mb-4"
      >
        {project.description}
      </p>

      <div
        className="flex flex-wrap gap-2"
        role="list"
        aria-label={t(
          'projects.technologiesLabel',
          { title: project.title },
          `Technologies used in ${project.title}`
        )}
      >
        {project.technologies.map((tech: string) => (
          <span
            key={tech}
            className="px-2 py-1 text-xs bg-teal-400/10 text-teal-300 rounded-full"
            role="listitem"
            aria-label={t('projects.technologyLabel', { tech }, `Technology: ${tech}`)}
          >
            {tech}
          </span>
        ))}
      </div>
    </motion.article>
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
      className="max-w-4xl mx-auto px-6 lg:px-12 py-12 lg:py-24"
    >
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        aria-labelledby="projects-heading"
        role="main"
      >
        <h1 id="projects-heading" className="text-4xl lg:text-6xl font-bold text-slate-100 mb-6">
          {t('projects.title')}
        </h1>
        <p className="text-lg text-slate-400 mb-12 max-w-2xl">{t('projects.description')}</p>

        <LazySection
          fallback={
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-64 bg-slate-800/50 rounded-lg animate-pulse" />
              ))}
            </div>
          }
          rootMargin="200px"
        >
          {projects.length > 12 ? (
            // Use virtual list for large number of projects with accessibility
            <VirtualList
              items={projects}
              itemHeight={280}
              containerHeight={600}
              className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
              renderItem={(project, index) => <ProjectCard project={project} index={index} t={t} />}
            />
          ) : (
            // Use regular grid for smaller lists with accessibility
            <div
              className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
              role="list"
              aria-label={t('projects.gridLabel', 'Project portfolio grid')}
            >
              {projects.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} t={t} />
              ))}
            </div>
          )}
        </LazySection>
      </motion.section>
    </motion.div>
  );
};

export default React.memo(ProjectsPage);
