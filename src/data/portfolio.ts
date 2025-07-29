/**
 * Portfolio data configuration
 * This file contains all the content for the portfolio site
 */

export interface NavigationItem {
  id: string;
  label: string;
}

export interface SocialLink {
  icon: string;
  href: string;
  label: string;
}

export interface Job {
  period: string;
  title: string;
  company: string;
  description: string;
  technologies: string[];
}

export interface Project {
  title: string;
  description: string;
  technologies: string[];
  link?: string;
  github?: string;
}

export interface PortfolioData {
  personal: {
    name: string;
    title: string;
    tagline: string;
    about: string[];
  };
  navigation: NavigationItem[];
  social: SocialLink[];
  experience: Job[];
  projects: Project[];
  contact: {
    email: string;
    message: string;
  };
}

export const portfolioData: PortfolioData = {
  personal: {
    name: 'Simon Lamb',
    title: 'Principal-Level Software Engineer',
    tagline: 'With a proven track record in AI systems, Azure, and DevOps at enterprise scale.',
    about: [
      "I'm a seasoned software engineer with over two decades of experience, including nearly nine years at Microsoft. My career has spanned roles from Technical Evangelist in Developer Experience to Cloud Solution Architect with Global Partner Solutions, culminating as a Senior Software Engineer in Azure Core (One Fleet Partner).",
      "Throughout my tenure, I've developed deep expertise in Azure cloud engineering, DevOps practices, and AI-driven software development. Notably, I've collaborated closely with the Semantic Kernel and Copilot teams at Microsoft to build cutting-edge AI solutions.Prior to Microsoft, I spent 13 years at Fred IT Group as Lead Technical Architect, leading a team of six engineers to design scalable platforms for the pharmacy and healthcare industry. My responsibilities encompassed platform design, Agile/DevOps/IaC delivery, and team leadership.",
      'Prior to Microsoft, I spent 13 years at Fred IT Group as Lead Technical Architect, leading a team of six engineers to design scalable platforms for the pharmacy and healthcare industry. My responsibilities encompassed platform design, Agile/DevOps/IaC delivery, and team leadership.',
      "Currently, I'm focused on leveraging agentic coding tools like Claude Code to accelerate product development and enhance productivity.",
      'Outside of work, I co-parent two teenagers with my partner, automate my household, enjoy time with my dog, and perform as a vocalist in a cover band.',
    ],
  },
  navigation: [
    { id: 'about', label: 'About' },
    { id: 'experience', label: 'Experience' },
    { id: 'projects', label: 'Projects' },
    { id: 'contact', label: 'Contact' },
  ],
  social: [
    { icon: 'Github', href: 'https://github.com/slamb2k', label: 'GitHub' },
    { icon: 'Linkedin', href: 'https://www.linkedin.com/in/slamb2k/', label: 'LinkedIn' },
    { icon: 'Twitter', href: 'https://twitter.com/slamb2k', label: 'Twitter' },
    { icon: 'Mail', href: 'mailto:me@simonlamb.codes', label: 'Email' },
  ],
  experience: [
    {
      period: '2021 — Present',
      title: 'Senior Frontend Engineer',
      company: 'Upstatement',
      description:
        "Build and maintain critical components used to construct Klaviyo's frontend, across the whole product. Work closely with cross-functional teams, including developers, designers, and product managers.",
      technologies: ['JavaScript', 'TypeScript', 'React', 'Storybook'],
    },
    {
      period: '2018 — 2021',
      title: 'Frontend Developer',
      company: 'Apple',
      description:
        "Developed and maintained web applications for Apple's internal tools. Collaborated with design teams to implement pixel-perfect interfaces.",
      technologies: ['React', 'Redux', 'Node.js', 'GraphQL'],
    },
  ],
  projects: [
    {
      title: 'E-Commerce Platform',
      description: 'A modern e-commerce platform built with Next.js and Stripe integration.',
      technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Stripe'],
      link: 'https://example.com',
      github: 'https://github.com/example/project',
    },
    {
      title: 'Task Management App',
      description: 'A collaborative task management application with real-time updates.',
      technologies: ['React', 'Node.js', 'Socket.io', 'MongoDB'],
      github: 'https://github.com/example/task-app',
    },
    {
      title: 'Design System',
      description:
        'A comprehensive design system and component library for enterprise applications.',
      technologies: ['React', 'TypeScript', 'Storybook', 'Jest'],
      link: 'https://design.example.com',
    },
  ],
  contact: {
    email: 'hello@example.com',
    message:
      "I'm always interested in hearing about new projects and opportunities. Feel free to reach out!",
  },
};
