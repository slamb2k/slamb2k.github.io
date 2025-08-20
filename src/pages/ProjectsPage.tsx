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
import Card from '@/components/ui/Card';

// Memoized project card component for better performance with accessibility
const ProjectCard: React.FC<{ project: ProjectWithTranslation; index: number; t: TFunction }> =
  React.memo(({ project, index, t }) => (
    <Card variant="project" hover={true}>
      <motion.article
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
        aria-labelledby={`project-title-${index}`}
        aria-describedby={`project-description-${index}`}
      >
        <div className="flex items-start justify-between mb-4">
          <h3
            id={`project-title-${index}`}
            className="text-primary font-semibold group-hover:text-cyan transition-colors duration-300"
          >
            {project.title}
          </h3>
          <div
            className="flex space-x-2"
            role="group"
            aria-label={t('projects.actionsLabel', `Actions for ${project.title}`)}
          >
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary hover:text-cyan transition-all duration-300 p-1 rounded focus:outline-none focus:ring-2 focus:ring-cyan/50 focus:ring-offset-2 focus:ring-offset-transparent hover:scale-110 hover:rotate-6"
                aria-label={t(
                  'common.viewOnGithub',
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
                className="text-secondary hover:text-cyan transition-all duration-300 p-1 rounded focus:outline-none focus:ring-2 focus:ring-cyan/50 focus:ring-offset-2 focus:ring-offset-transparent hover:scale-110 hover:rotate-6"
                aria-label={t(
                  'common.visitProject',
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
          className="text-secondary text-fluid-sm leading-relaxed mb-4"
        >
          {project.description}
        </p>

        <div
          className="flex flex-wrap gap-2"
          role="list"
          aria-label={t('projects.technologiesLabel', `Technologies used in ${project.title}`)}
        >
          {project.technologies.map((tech: string) => (
            <span
              key={tech}
              className="px-3 py-1 text-fluid-xs bg-violet/10 text-violet rounded-full backdrop-blur-sm border border-violet/20"
              role="listitem"
              aria-label={t('projects.technologyLabel', `Technology: ${tech}`)}
            >
              {tech}
            </span>
          ))}
        </div>
      </motion.article>
    </Card>
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
          className="text-fluid-3xl lg:text-fluid-4xl font-bold text-primary mb-6"
        >
          {t('projects.title')}
        </h1>
        <p className="text-fluid-lg text-secondary mb-12 max-w-2xl">{t('projects.description')}</p>

        {/* Use regular grid - VirtualList doesn't work well with CSS Grid */}
        <div
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 auto-rows-auto"
          role="list"
          aria-label={t('projects.gridLabel', 'Project portfolio grid')}
        >
          {projects.map((project, index) => (
            <div
              key={project.id}
              className={project.featured ? 'md:col-span-2 lg:col-span-2' : ''}
              role="listitem"
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
