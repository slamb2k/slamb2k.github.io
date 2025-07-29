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
  id: string;
  period: string;
  title: string;
  company: string;
  technologies: string[];
  // description moved to i18n translations
}

export interface Project {
  id: string;
  title: string;
  technologies: string[];
  link?: string;
  github?: string;
  // description moved to i18n translations
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
      id: 'azure-core',
      period: 'Jul 2024 — Present',
      title: 'Senior Software Engineer',
      company: 'Microsoft (Engineering - Azure Core)',
      technologies: ['C#', 'Azure', 'AI/ML', 'TypeScript', 'React'],
    },
    {
      id: 'microsoft-cloud',
      period: 'Apr 2024 — Jul 2024',
      title: 'Senior Software Engineer',
      company: 'Microsoft (Engineering - Microsoft Cloud)',
      technologies: [
        'C#',
        'ASP.NET',
        'Semantic Kernel',
        'JavaScript/React',
        'SQL/Fabric',
        'ARM/Bicep',
      ],
    },
    {
      id: 'global-partner-solutions',
      period: 'Jul 2019 — Apr 2024',
      title: 'Cloud Solution Architect',
      company: 'Microsoft (Global Partner Solutions)',
      technologies: [
        'Prompt Engineering',
        'Azure Cloud',
        'C#',
        'ASP.NET',
        'Power BI',
        'Azure DevOps',
        'PowerShell',
      ],
    },

    {
      id: 'microsoft-dx',
      period: 'Feb 2017 — Jul 2019',
      title: 'Technical Evangelist',
      company: 'Microsoft (DX - Developer Experience)',
      technologies: [
        'C#',
        'ASP.NET',
        'Javascript',
        'SQL',
        'Power BI',
        'ARM',
        'Azure DevOps',
        'Node.js',
        'PowerShell',
      ],
    },
    {
      id: 'fred-it-group',
      period: 'Jun 2004 — Feb 2017',
      title: 'Technical Architecture Lead',
      company: 'Fred IT Group',
      technologies: ['C#', 'ASP.NET', 'Dynamics AX (X++)', 'SQL', 'Team Leadership'],
    },
    {
      id: 'leadtec-systems',
      period: '2001 — 2004',
      title: 'Senior Developer',
      company: 'Leadtec Systems Australia',
      technologies: ['C#', 'ASP.NET', 'XML', 'XSLT', 'SQL'],
    },
    {
      id: 'pacific-commerce',
      period: '1998 — 2001',
      title: 'Solutions Manager',
      company: 'Pacific Commerce',
      technologies: ['Visual Basic', 'EDI', 'Sterling Commerce: GENTRAN', 'SQL'],
    },
  ],
  projects: [
    {
      id: 'about-me',
      title: 'About.me Portfolio',
      technologies: ['React', 'TypeScript', 'Vite', 'Tailwind CSS'],
      github: 'https://github.com/slamb2k/about.me',
    },
    {
      id: 'glam-mcp',
      title: 'GLAM MCP Server',
      technologies: ['JavaScript', 'Python', 'Node.js', 'MCP'],
      github: 'https://github.com/slamb2k/glam-mcp',
    },
    {
      id: 'gavin-copilot',
      title: 'Gavin Copilot',
      technologies: ['React', '.NET', 'Semantic Kernel', 'Azure OpenAI'],
      github: 'https://github.com/slamb2k/gavin-copilot',
    },
    {
      id: 'spec-chain',
      title: 'Spec Chain',
      technologies: ['Claude Code', 'Markdown', 'AI Documentation'],
      github: 'https://github.com/slamb2k/spec-chain',
    },
    {
      id: 'azure-spa-environment-variables',
      title: 'Azure SPA Environment Variables',
      technologies: ['React', 'Azure', 'JavaScript', 'DevOps'],
      github: 'https://github.com/slamb2k/azure-spa-environment-variables',
    },
    {
      id: 'virtual-devbox',
      title: 'Virtual DevBox',
      technologies: ['AutoHotkey', 'Windows 11', 'RDP'],
      github: 'https://github.com/slamb2k/Virtual-DevBox',
    },
    {
      id: 'dial-tray',
      title: 'Dial Tray',
      technologies: ['System Tray', 'Surface Dial', 'Windows'],
      github: 'https://github.com/slamb2k/dial-tray',
    },
    {
      id: 'vs-mobile-center-build',
      title: 'VS Mobile Center Build',
      technologies: ['JavaScript', 'Azure Mobile Center', 'TFS'],
      github: 'https://github.com/slamb2k/VSMobileCenterBuild',
    },
  ],
  contact: {
    email: 'me@simonlamb.codes',
    message:
      "I'm always interested in hearing about new projects and opportunities. Feel free to reach out!",
  },
};
