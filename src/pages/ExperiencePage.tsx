import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import LazySection from '@/components/ui/LazySection';
import VirtualList from '@/components/ui/VirtualList';
import { getJobsWithTranslations, JobWithTranslation } from '@/utils/portfolioData';

// Memoized experience card component
const ExperienceCard: React.FC<{ job: JobWithTranslation; index: number }> = React.memo(
  ({ job, index }) => (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      className={`group relative p-6 rounded-lg border transition-all duration-300 ${
        job.featured
          ? 'border-violet-500/30 hover:border-violet-400/50 bg-violet-950/10 hover:bg-violet-900/20 shadow-lg shadow-violet-500/10'
          : 'border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
      }`}
    >
      <div className="flex flex-col lg:flex-row lg:items-start gap-4">
        <div className="text-sm text-slate-500 font-mono lg:w-32 flex-shrink-0">{job.period}</div>
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <h3
              className={`font-semibold transition-colors ${
                job.featured
                  ? 'text-lg text-slate-100 group-hover:text-violet-400'
                  : 'text-slate-100 group-hover:text-violet-300'
              }`}
            >
              {job.title} · {job.company}
            </h3>
            {job.featured && (
              <span className="inline-block ml-2 px-2 py-0.5 text-xs bg-violet-500/10 text-violet-400 rounded border border-violet-500/20">
                Featured
              </span>
            )}
          </div>
          <p
            className={`text-slate-400 mt-2 leading-relaxed ${
              job.featured ? 'text-sm lg:text-base' : 'text-sm'
            }`}
          >
            {job.description}
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            {job.technologies.map((tech: string) => (
              <span
                key={tech}
                className="px-3 py-1.5 text-xs bg-violet-500/10 text-violet-300 rounded-full border border-violet-500/20 font-medium"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
);

const ExperiencePage: React.FC = () => {
  const { t } = useTranslation();

  // Memoized jobs data combining portfolio structure with translations
  const jobs = React.useMemo(() => {
    return getJobsWithTranslations(t);
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
      >
        <h1 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-violet-300 to-violet-500 bg-clip-text text-transparent mb-6">
          {t('experience.title')}
        </h1>
        <p className="text-lg text-slate-400 mb-12 max-w-2xl">{t('experience.description')}</p>

        <LazySection
          fallback={
            <div className="space-y-8">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-32 bg-slate-800/50 rounded-lg animate-pulse" />
              ))}
            </div>
          }
          rootMargin="150px"
        >
          {jobs.length > 10 ? (
            // Use virtual list for many experience entries
            <VirtualList
              items={jobs}
              itemHeight={180}
              containerHeight={600}
              className="space-y-8"
              renderItem={(job, index) => <ExperienceCard job={job} index={index} />}
            />
          ) : (
            // Use regular layout for smaller lists
            <div className="space-y-8">
              {jobs.map((job, index) => (
                <ExperienceCard key={job.id} job={job} index={index} />
              ))}
            </div>
          )}
        </LazySection>
      </motion.section>
    </motion.div>
  );
};

export default React.memo(ExperiencePage);
