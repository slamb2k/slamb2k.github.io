import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { portfolioData } from '@/data/portfolio';

const ExperiencePage: React.FC = () => {
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
          {t('experience.title')}
        </h1>
        <p className="text-lg text-slate-400 mb-12 max-w-2xl">
          {t('experience.description')}
        </p>

        <div className="space-y-8">
          {(t('experience.jobs', { returnObjects: true }) as any[]).map((job: any, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
              whileHover={{ scale: 1.02 }}
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
                    {job.technologies.map((tech: string) => (
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
    </motion.div>
  );
};

export default ExperiencePage;