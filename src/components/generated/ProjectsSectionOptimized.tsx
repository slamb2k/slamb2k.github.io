import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Github } from 'lucide-react';
import { portfolioData } from '@/data/portfolio';
import OptimizedImage from '@/components/ui/OptimizedImage';
import LazySection from '@/components/ui/LazySection';
import VirtualList from '@/components/ui/VirtualList';

interface ProjectWithImage {
  title: string;
  description: string;
  technologies: string[];
  github?: string;
  external?: string;
  image?: string;
}

interface ProjectCardProps {
  project: ProjectWithImage;
  index: number;
  isLarge?: boolean;
}

const ProjectCard: React.FC<ProjectCardProps> = React.memo(({ project, index, isLarge = false }) => {
  if (isLarge) {
    return (
      <motion.div 
        key={project.title}
        initial={{
          opacity: 0,
          y: 50
        }} 
        whileInView={{
          opacity: 1,
          y: 0
        }} 
        transition={{
          duration: 0.6,
          delay: index * 0.1
        }} 
        viewport={{
          once: true
        }} 
        className="group relative"
      >
        <div className={`grid lg:grid-cols-12 gap-4 items-center ${index % 2 === 0 ? '' : 'lg:text-right'}`}>
          {/* Project Image */}
          <div className={`relative lg:col-span-7 ${index % 2 === 0 ? '' : 'lg:col-start-6'}`}>
            <motion.div 
              whileHover={{
                scale: 1.05
              }} 
              className="relative overflow-hidden rounded-lg bg-teal-300/10 aspect-video"
            >
              {project.image ? (
                <OptimizedImage
                  src={project.image}
                  alt={`${project.title} screenshot`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="absolute inset-0 bg-slate-800 flex items-center justify-center">
                  <span className="text-slate-400 text-sm">Project Screenshot</span>
                </div>
              )}
              <div className="absolute inset-0 bg-teal-300/20 group-hover:bg-transparent transition-all duration-300" />
            </motion.div>
          </div>

          {/* Project Content */}
          <div className={`lg:col-span-5 space-y-4 ${index % 2 === 0 ? 'lg:col-start-8' : 'lg:col-start-1 lg:row-start-1'}`}>
            <div>
              <p className="text-teal-300 font-mono text-sm mb-2">
                Featured Project
              </p>
              <h3 className="text-2xl font-bold text-slate-100 group-hover:text-teal-300 transition-colors">
                {project.title}
              </h3>
            </div>

            <div className="bg-slate-800 p-6 rounded-lg shadow-lg">
              <p className="text-slate-300 text-sm leading-relaxed">
                {project.description}
              </p>
            </div>

            <div className={`flex flex-wrap gap-2 ${index % 2 === 0 ? '' : 'lg:justify-end'}`}>
              {project.technologies.map(tech => (
                <span key={tech} className="text-slate-400 font-mono text-xs">
                  {tech}
                </span>
              ))}
            </div>

            <div className={`flex space-x-4 ${index % 2 === 0 ? '' : 'lg:justify-end'}`}>
              {project.github && (
                <motion.a 
                  href={project.github} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  whileHover={{
                    scale: 1.1,
                    y: -2
                  }} 
                  className="text-slate-400 hover:text-teal-300 transition-colors" 
                  aria-label={`GitHub repository for ${project.title}`}
                >
                  <Github size={20} />
                </motion.a>
              )}
              {project.external && (
                <motion.a 
                  href={project.external} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  whileHover={{
                    scale: 1.1,
                    y: -2
                  }} 
                  className="text-slate-400 hover:text-teal-300 transition-colors" 
                  aria-label={`External link for ${project.title}`}
                >
                  <ExternalLink size={20} />
                </motion.a>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Small project card
  return (
    <motion.div 
      initial={{
        opacity: 0,
        y: 30
      }} 
      whileInView={{
        opacity: 1,
        y: 0
      }} 
      transition={{
        duration: 0.4,
        delay: index * 0.1
      }} 
      viewport={{
        once: true
      }} 
      whileHover={{
        y: -5
      }} 
      className="bg-slate-800 p-6 rounded-lg border border-slate-700 hover:border-slate-600 transition-all duration-300"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="w-10 h-10 bg-teal-300/10 rounded-lg flex items-center justify-center">
          <div className="w-4 h-4 bg-teal-300 rounded" />
        </div>
        <div className="flex space-x-2">
          {project.github && (
            <motion.a 
              href={project.github} 
              target="_blank" 
              rel="noopener noreferrer" 
              whileHover={{
                scale: 1.1
              }} 
              className="text-slate-400 hover:text-teal-300 transition-colors"
              aria-label={`GitHub repository for ${project.title}`}
            >
              <Github size={18} />
            </motion.a>
          )}
          {project.external && (
            <motion.a 
              href={project.external} 
              target="_blank" 
              rel="noopener noreferrer" 
              whileHover={{
                scale: 1.1
              }} 
              className="text-slate-400 hover:text-teal-300 transition-colors"
              aria-label={`External link for ${project.title}`}
            >
              <ExternalLink size={18} />
            </motion.a>
          )}
        </div>
      </div>
      
      <h4 className="text-slate-100 font-semibold mb-2">
        {project.title}
      </h4>
      
      <p className="text-slate-400 text-sm mb-4 leading-relaxed">
        {project.description}
      </p>
      
      <div className="flex flex-wrap gap-2">
        {project.technologies.map(tech => (
          <span key={tech} className="text-slate-400 font-mono text-xs">
            {tech}
          </span>
        ))}
      </div>
    </motion.div>
  );
});

const ProjectsSection: React.FC = () => {
  // Use the first 3 projects as featured projects with placeholder images
  const featuredProjects: ProjectWithImage[] = React.useMemo(() => 
    portfolioData.projects.slice(0, 3).map(project => ({
      ...project,
      external: project.link,
      image: '/api/placeholder/600/400'
    })), []);
  
  // Sample additional projects for the grid
  const otherProjects: ProjectWithImage[] = React.useMemo(() => [
    {
      title: 'Integrating Algolia Search',
      description: 'Building a custom search experience with Algolia in a React app',
      technologies: ['Algolia', 'React', 'styled-components'],
      github: 'https://github.com',
      external: 'https://example.com'
    },
    {
      title: 'React Profile',
      description: 'Online resume built with React and hosted on Netlify',
      technologies: ['React', 'CSS3', 'Netlify'],
      github: 'https://github.com',
      external: 'https://example.com'
    },
    {
      title: 'Lonely Planet DBMS',
      description: 'Final project for my Database Management Systems course',
      technologies: ['PHP', 'MySQL', 'HTML', 'CSS'],
      github: 'https://github.com'
    },
    // Add more projects to demonstrate virtual scrolling
    {
      title: 'E-commerce Analytics',
      description: 'Real-time analytics dashboard for e-commerce platforms',
      technologies: ['Vue.js', 'D3.js', 'Node.js', 'MongoDB'],
      github: 'https://github.com',
      external: 'https://example.com'
    },
    {
      title: 'Mobile Chat App',
      description: 'Cross-platform mobile messaging application',
      technologies: ['React Native', 'Firebase', 'Redux'],
      github: 'https://github.com'
    },
    {
      title: 'AI Content Generator',
      description: 'Machine learning powered content generation tool',
      technologies: ['Python', 'TensorFlow', 'FastAPI', 'React'],
      github: 'https://github.com',
      external: 'https://example.com'
    }
  ], []);

  const renderOtherProject = React.useCallback((project: ProjectWithImage, index: number) => (
    <ProjectCard key={project.title} project={project} index={index} />
  ), []);

  return (
    <LazySection 
      className="mb-24"
      fallback={<div className="min-h-96 bg-slate-800/50 rounded-lg animate-pulse" />}
    >
      <motion.section 
        id="projects" 
        initial={{
          opacity: 0,
          y: 50
        }} 
        whileInView={{
          opacity: 1,
          y: 0
        }} 
        transition={{
          duration: 0.6
        }} 
        viewport={{
          once: true
        }}
      >
        <h2 className="text-2xl font-bold text-slate-100 mb-6">
          Some Things I've Built
        </h2>
        
        {/* Featured Projects */}
        <div className="space-y-24">
          {featuredProjects.map((project, index) => (
            <ProjectCard 
              key={project.title} 
              project={project} 
              index={index} 
              isLarge={true} 
            />
          ))}
        </div>

        {/* Other Notable Projects */}
        <motion.div 
          initial={{
            opacity: 0,
            y: 50
          }} 
          whileInView={{
            opacity: 1,
            y: 0
          }} 
          transition={{
            duration: 0.6
          }} 
          viewport={{
            once: true
          }} 
          className="mt-24"
        >
          <h3 className="text-xl font-bold text-slate-100 mb-8 text-center">
            Other Noteworthy Projects
          </h3>
          
          {/* Use virtual scrolling for large project lists */}
          {otherProjects.length > 12 ? (
            <VirtualList
              items={otherProjects}
              itemHeight={280}
              containerHeight={840} // Show ~3 rows
              renderItem={renderOtherProject}
              className="rounded-lg"
            />
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherProjects.map((project, index) => (
                <ProjectCard 
                  key={project.title} 
                  project={project} 
                  index={index} 
                />
              ))}
            </div>
          )}
        </motion.div>
      </motion.section>
    </LazySection>
  );
};

export default React.memo(ProjectsSection);