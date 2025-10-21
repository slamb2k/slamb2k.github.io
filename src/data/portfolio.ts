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
  featured?: boolean; // Hero card styling for important roles
  // description moved to i18n translations
}

export interface Project {
  id: string;
  title: string;
  technologies: string[];
  link?: string;
  github?: string;
  featured?: boolean; // Spans multiple columns in grid
  highlight?: boolean; // Spans all columns with enhanced visual styling
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
    title: 'Principal AI/Software Engineer | GenAI/RAG, LLMOps, SRE',
    tagline:
      'I build production GenAI platforms on Microsoft Azure and bring DevOps leadership from the ground up. Specializing in LLM platform engineering with full LLMOps/MLOps rigor—CI/CD, evaluation pipelines, guardrails, observability, and cost/latency governance.',
    about: [
      'I build production GenAI platforms on Microsoft Azure and bring DevOps leadership from the ground up. Recently, I focused on LLM platform engineering inside Microsoft Azure Core, where I delivered AI systems with full LLMOps/MLOps rigor—CI/CD, evaluation pipelines, guardrails, observability, and cost/latency governance.',
      'At Azure Core, I engineered a platform that applied Azure OpenAI + agentic retrieval to analyse internal Microsoft product codebases, automatically surfacing security, performance, and best-practice risks before rollout. This strengthened governance and reduced incidents from problematic deployments.',
      'With code contexts spanning thousands of lines, I designed token-aware batching, caching, and aggregation strategies that made multi-chunk evaluation feasible and cost-effective. I embedded automatic + human-in-the-loop eval gates, enabling multiple developers to iterate safely on prompt designs without regressions.',
      'Before Azure Core, I partnered with enterprises and ISVs as a Cloud Solution Architect to modernise workloads onto Azure (AKS, App Services, Front Door, Private Link) and accelerate GenAI adoption (Databricks, MLflow, Semantic Kernel). I ran workshops, design reviews, and enablement that reduced prototype-to-production cycles from months to weeks.',
      "Earlier at Microsoft, I served as Technical Evangelist and later DevOps OpenHack Tech Lead. I led global OpenHacks in Melbourne, Sydney (with Satya Nadella's ANZ visit), Canberra, Las Vegas (Inspire/Ready), and Seattle (TechReady), directing coach teams and mentoring hundreds of engineers with near-perfect satisfaction scores (~95%+).",
      'My roots are in Fred IT Group, where I was Tech Architect/DevOps Lead for regulated healthcare platforms, embedding SRE practices (SLOs/SLIs, error budgets), IaC, and CI/CD to deliver clinical-grade reliability.',
      'Core stack: Azure OpenAI, RAG (vector/hybrid), Semantic Kernel/LangChain, Azure AI Search, Databricks/Delta/Unity Catalog, MLflow, Azure ML, AKS, GitHub Actions/Azure DevOps, Bicep/Terraform, GitOps (Flux/Argo), OPA/Azure Policy, Managed Identity/Key Vault, Azure Monitor/Grafana/Prometheus, SRE practices, Python, C#.',
      "I'm open to Principal AI Engineer / Principal Data Scientist (GenAI) / Principal Engineer roles, where I can apply my mix of AI platform engineering + DevOps leadership to deliver impact at scale.",
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
      period: 'Jul 2024 - Jul 2025',
      title: 'Senior Software Engineer',
      company: 'Microsoft (Azure Core)',
      featured: true,
      technologies: [
        'Azure OpenAI',
        'RAG/Vector Search',
        'LLMOps/MLOps',
        'Semantic Kernel',
        'Python',
        'C#',
        'React',
        'Azure DevOps Extensions',
        'Liquid Templates',
        'Structured Outputs',
      ],
    },
    {
      id: 'microsoft-cloud-industry',
      period: 'Apr 2024 - Jul 2024',
      title: 'Senior Software Engineer',
      company: 'Microsoft (Microsoft Cloud for Industry)',
      featured: false,
      technologies: [
        'React',
        'TypeScript',
        '.NET',
        'Microsoft Fabric',
        'Azure DevOps',
        'Industry Solutions',
      ],
    },
    {
      id: 'global-partner-solutions',
      period: 'Jul 2019 - Apr 2024',
      title: 'Cloud Solution Architect',
      company: 'Microsoft (Global Partner Solutions)',
      technologies: [
        'Azure OpenAI',
        'Databricks',
        'MLflow',
        'Semantic Kernel',
        'AKS',
        'Azure DevOps',
        'Bicep/Terraform',
        'GitOps',
      ],
    },

    {
      id: 'microsoft-dx',
      period: 'Jun 2019 - Sep 2021',
      title: 'DevOps OpenHack Tech Lead (Part-time)',
      company: 'Microsoft',
      featured: true,
      technologies: [
        'CI/CD',
        'IaC',
        'SRE',
        'GitHub Actions',
        'Azure DevOps',
        'Docker',
        'Kubernetes',
        'Technical Coaching',
      ],
    },
    {
      id: 'microsoft-evangelist',
      period: 'Feb 2017 - Jul 2019',
      title: 'Technical Evangelist',
      company: 'Microsoft (Developer Experience)',
      technologies: [
        'C#',
        'ASP.NET',
        'Javascript',
        'Azure',
        'DevOps',
        'ARM',
        'Node.js',
        'PowerShell',
      ],
    },
    {
      id: 'fred-it-group',
      period: 'Jun 2004 - Feb 2017',
      title: 'Tech Architect Lead / DevOps Lead',
      company: 'Fred IT Group',
      featured: true,
      technologies: [
        'C#/.NET',
        'SQL Server',
        'Dynamics AX',
        'Azure DevOps',
        'IaC (Bicep/Terraform)',
        'SRE Practices',
        'Blue/Green Deployments',
        'Team Leadership',
      ],
    },
    {
      id: 'leadtec-systems',
      period: '2001 - 2004',
      title: 'Senior Developer',
      company: 'Leadtec Systems Australia',
      technologies: ['C#', 'ASP.NET', 'XML', 'XSLT', 'SQL'],
    },
    {
      id: 'pacific-commerce',
      period: '1998 - 2001',
      title: 'Solutions Manager',
      company: 'Pacific Commerce',
      technologies: ['Visual Basic', 'EDI', 'Sterling Commerce: GENTRAN', 'SQL'],
    },
  ],
  projects: [
    {
      id: 'azure-llm-governance',
      title: 'LLM-Driven Governance Platform - Microsoft Engineering',
      featured: true,
      highlight: true,
      technologies: [
        'Azure OpenAI',
        'RAG/Vector Search',
        'Token-Aware Batching',
        'Structured Outputs',
        'Liquid Templates',
        'Multi-Chunk Evaluation',
        'Human-in-the-Loop Gates',
        'Cost/Latency Optimization',
        'Security Risk Analysis',
      ],
    },
    {
      id: 'azure-devops-governance-extensions',
      title: 'Azure DevOps Governance Extensions - Microsoft Engineering',
      featured: true,
      highlight: true,
      technologies: [
        'React',
        'TypeScript',
        'Azure DevOps Extensions',
        'Azure DevOps Extension SDK',
        'REST APIs',
        'Performance Optimization',
        'Scale Engineering',
      ],
    },
    {
      id: 'microsoft-fabric-industry-solutions',
      title: 'Microsoft Fabric Industry Solutions - Microsoft Engineering',
      featured: true,
      highlight: true,
      technologies: [
        'C#',
        'React',
        'TypeScript',
        '.NET',
        'Microsoft Fabric',
        'Industry Solutions',
        'Azure DevOps',
        'Azure Artifacts',
        'Scale Engineering',
        'Performance Optimization',
        'Security Best Practices',
      ],
      link: 'https://fabric.microsoft.com',
    },
    {
      id: 'azure-deployment-accelerator-tui',
      title: 'Azure Deployment Accelerator TUI',
      technologies: [
        'Bash',
        'Ev2',
        'Dev Containers',
        'Dev Container Features',
        'Azure CLI',
        'Terminal UI',
        'Git Integration',
        'YAML Pipelines',
      ],
    },
    {
      id: 'devops-openhack-technical-lead',
      title: 'DevOps OpenHack Technical Lead - Global Events',
      featured: true,
      github: 'https://github.com/Azure-Samples/openhack-devops-team',
      technologies: [
        'Melbourne/Sydney/Canberra',
        'Las Vegas (Inspire/Ready)',
        'Seattle (TechReady)',
        'Satya Nadella ANZ Visit',
        '95%+ Satisfaction Score',
        'CI/CD',
        'IaC',
        'SRE',
        'Team Leadership',
      ],
    },
    {
      id: 'healthcare-platform-fred',
      title: 'Regulated Healthcare Platform - Fred IT Group',
      featured: true,
      technologies: [
        'Pharmacy Dispensing',
        '.NET/SQL Server',
        'Dynamics AX',
        'PBS Compliance',
        'Blue/Green Deployments',
        'SLO/SLI Monitoring',
        'Error Budgets',
        'Clinical-Grade Reliability',
        '6-Engineer Team Lead',
      ],
    },
    {
      id: 'about-me',
      title: 'simonlamb.codes - Blog and Bio',
      technologies: ['React', 'TypeScript', 'Vite', 'Tailwind CSS'],
      github: 'https://github.com/slamb2k/about.me',
    },
    {
      id: 'devsolo',
      title: 'devsolo - Linear History Plugin and MCP',
      featured: true,
      technologies: ['Claude Code', 'MCP', 'TypeScript', 'Git Automation', 'GitHub API'],
      github: 'https://github.com/slamb2k/devsolo',
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
