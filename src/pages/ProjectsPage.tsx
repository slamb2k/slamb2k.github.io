import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Github } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { portfolioData } from '@/data/portfolio';

const ProjectsPage: React.FC = () => {
  const { t } = useTranslation();

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
      >
        <h1 className="text-4xl lg:text-6xl font-bold text-slate-100 mb-6">
          {t('projects.title')}
        </h1>
        <p className="text-lg text-slate-400 mb-12 max-w-2xl">
          {t('projects.description')}
        </p>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {(t('projects.items', { returnObjects: true }) as any[]).map((project: any, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
              whileHover={{ y: -5 }}
              className="group relative p-6 rounded-lg border border-slate-800 hover:border-slate-700 hover:bg-slate-800/50 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-slate-100 font-semibold group-hover:text-teal-300 transition-colors">
                  {project.title}
                </h3>
                <div className="flex space-x-2">
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-400 hover:text-slate-100 transition-colors"
                      aria-label={t('common.viewOnGithub', { title: project.title })}
                    >
                      <Github size={18} />
                    </a>
                  )}
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-400 hover:text-slate-100 transition-colors"
                      aria-label={t('common.visitProject', { title: project.title })}
                    >
                      <ExternalLink size={18} />
                    </a>
                  )}
                </div>
              </div>
              
              <p className="text-slate-400 text-sm leading-relaxed mb-4">
                {project.description}
              </p>
              
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech: string) => (
                  <span
                    key={tech}
                    className="px-2 py-1 text-xs bg-teal-400/10 text-teal-300 rounded-full"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </motion.div>
  );
};

export default ProjectsPage;