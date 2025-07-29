/**
 * Portfolio data utilities for combining structured data with translations
 */

import { portfolioData, Job, Project } from '@/data/portfolio';
import { TFunction } from 'i18next';

/**
 * Enhanced job interface with description from translations
 */
export interface JobWithTranslation extends Job {
  description: string;
}

/**
 * Enhanced project interface with description from translations
 */
export interface ProjectWithTranslation extends Project {
  description: string;
  image?: string; // Optional image property for components that need it
}

/**
 * Combine job data from portfolio.ts with descriptions from i18n
 */
export function getJobsWithTranslations(t: TFunction): JobWithTranslation[] {
  return portfolioData.experience.map(job => ({
    ...job,
    description: t(`experience.jobs.${job.id}.description`),
  }));
}

/**
 * Combine project data from portfolio.ts with descriptions from i18n
 */
export function getProjectsWithTranslations(t: TFunction): ProjectWithTranslation[] {
  return portfolioData.projects.map(project => ({
    ...project,
    description: t(`projects.items.${project.id}.description`),
  }));
}

/**
 * Get a single job with translation by ID
 */
export function getJobWithTranslation(id: string, t: TFunction): JobWithTranslation | undefined {
  const job = portfolioData.experience.find(j => j.id === id);
  if (!job) return undefined;

  return {
    ...job,
    description: t(`experience.jobs.${job.id}.description`),
  };
}

/**
 * Get a single project with translation by ID
 */
export function getProjectWithTranslation(
  id: string,
  t: TFunction
): ProjectWithTranslation | undefined {
  const project = portfolioData.projects.find(p => p.id === id);
  if (!project) return undefined;

  return {
    ...project,
    description: t(`projects.items.${project.id}.description`),
  };
}
