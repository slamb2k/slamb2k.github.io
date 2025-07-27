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
    title: 'Senior Frontend Engineer',
    tagline: 'I build pixel-perfect, engaging, and accessible digital experiences.',
    about: [
      "I'm a passionate full-stack developer with over 5 years of experience building digital experiences. I specialize in creating accessible, pixel-perfect web applications with modern technologies.",
      "My main focus these days is building products and leading projects at Upstatement. I most enjoy building software in the sweet spot where design and engineering meet — things that look good but are also built well under the hood.",
      "When I'm not at the computer, I'm usually rock climbing, hanging out with my wife and two cats, or running around Hyrule searching for Korok seeds."
    ]
  },
  navigation: [
    { id: 'about', label: 'About' },
    { id: 'experience', label: 'Experience' },
    { id: 'projects', label: 'Projects' },
    { id: 'contact', label: 'Contact' }
  ],
  social: [
    { icon: 'Github', href: 'https://github.com', label: 'GitHub' },
    { icon: 'Linkedin', href: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: 'Twitter', href: 'https://twitter.com', label: 'Twitter' },
    { icon: 'Mail', href: 'mailto:hello@example.com', label: 'Email' }
  ],
  experience: [
    {
      period: '2021 — Present',
      title: 'Senior Frontend Engineer',
      company: 'Upstatement',
      description: "Build and maintain critical components used to construct Klaviyo's frontend, across the whole product. Work closely with cross-functional teams, including developers, designers, and product managers.",
      technologies: ['JavaScript', 'TypeScript', 'React', 'Storybook']
    },
    {
      period: '2018 — 2021',
      title: 'Frontend Developer',
      company: 'Apple',
      description: "Developed and maintained web applications for Apple's internal tools. Collaborated with design teams to implement pixel-perfect interfaces.",
      technologies: ['React', 'Redux', 'Node.js', 'GraphQL']
    }
  ],
  projects: [
    {
      title: 'E-Commerce Platform',
      description: 'A modern e-commerce platform built with Next.js and Stripe integration.',
      technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Stripe'],
      link: 'https://example.com',
      github: 'https://github.com/example/project'
    },
    {
      title: 'Task Management App',
      description: 'A collaborative task management application with real-time updates.',
      technologies: ['React', 'Node.js', 'Socket.io', 'MongoDB'],
      github: 'https://github.com/example/task-app'
    },
    {
      title: 'Design System',
      description: 'A comprehensive design system and component library for enterprise applications.',
      technologies: ['React', 'TypeScript', 'Storybook', 'Jest'],
      link: 'https://design.example.com'
    }
  ],
  contact: {
    email: 'hello@example.com',
    message: "I'm always interested in hearing about new projects and opportunities. Feel free to reach out!"
  }
};