/**
 * Portfolio data utilities for combining structured data with translations
 */

import { portfolioData, Job, Project } from '@/data/portfolio';
import { TFunction } from 'i18next';

/**
 * Enhanced job interface with translations
 */
export interface JobWithTranslation
  extends Omit<Job, 'description' | 'title' | 'company' | 'period'> {
  id: string;
  title: string; // Translated title
  company: string; // Translated company
  period: string; // Translated period
  description: string; // Translated description
  technologies: string[];
  featured?: boolean;
}

/**
 * Enhanced project interface with translations
 */
export interface ProjectWithTranslation extends Omit<Project, 'title' | 'description'> {
  id: string;
  title: string; // Translated title
  description: string; // Translated description
  technologies: string[];
  featured?: boolean;
  github?: string;
  demo?: string;
  image?: string; // Optional image property for components that need it
}

/**
 * Combine job data from portfolio.ts with descriptions from i18n
 */
export function getJobsWithTranslations(t: TFunction): JobWithTranslation[] {
  return portfolioData.experience.map(job => ({
    id: job.id,
    title: t(`experience.jobs.${job.id}.title`, job.title),
    company: t(`experience.jobs.${job.id}.company`, job.company),
    period: t(`experience.jobs.${job.id}.period`, job.period),
    description: t(`experience.jobs.${job.id}.description`),
    technologies: job.technologies,
    featured: job.featured,
  }));
}

/**
 * Combine project data from portfolio.ts with descriptions from i18n
 */
export function getProjectsWithTranslations(t: TFunction): ProjectWithTranslation[] {
  return portfolioData.projects.map(project => ({
    id: project.id,
    title: t(`projects.items.${project.id}.title`, project.title),
    description: t(`projects.items.${project.id}.description`),
    technologies: project.technologies,
    featured: project.featured,
    github: project.github,
    demo: project.demo,
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
