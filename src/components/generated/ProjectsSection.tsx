import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Github } from 'lucide-react';
const ProjectsSection: React.FC = () => {
  const projects = [{
    title: 'Spotify Profile',
    description: 'A web app for visualizing personalized Spotify data. View your top artists, top tracks, recently played tracks, and detailed audio information about each track. Create and save new playlists of recommended tracks based on your existing playlists and more.',
    technologies: ['React', 'Styled Components', 'Express', 'Spotify API', 'Heroku'],
    github: 'https://github.com',
    external: 'https://spotify-profile.herokuapp.com/',
    image: '/api/placeholder/600/400',
    mpid: "b6d40dbe-cc83-4645-a546-042800cc6d03"
  }, {
    title: 'Halcyon Theme',
    description: 'A minimal, dark blue theme for VS Code, Sublime Text, Atom, iTerm, and more. Available on Visual Studio Marketplace, Package Control, Atom Package Manager, and npm.',
    technologies: ['VS Code', 'Sublime Text', 'Atom', 'iTerm2', 'Hyper'],
    github: 'https://github.com',
    external: 'https://halcyon-theme.netlify.com/',
    image: '/api/placeholder/600/400',
    mpid: "6a79a784-bfe2-4200-8397-450e497b532c"
  }, {
    title: 'Algolia DocSearch',
    description: 'Algolia DocSearch crawls your documentation, pushes the content to an Algolia index, and provides a production-ready search experience for your documentation site.',
    technologies: ['Algolia', 'DocSearch', 'React', 'Node.js'],
    github: 'https://github.com',
    external: 'https://docsearch.algolia.com/',
    image: '/api/placeholder/600/400',
    mpid: "ef7406e1-e885-4366-a1c6-aa5aa10709c0"
  }] as any[];
  const otherProjects = [{
    title: 'Integrating Algolia Search',
    description: 'Building a custom search experience with Algolia in a React app',
    technologies: ['Algolia', 'React', 'styled-components'],
    github: 'https://github.com',
    external: 'https://example.com',
    mpid: "cc3b30da-370c-41fb-8720-0cbe53d2f63e"
  }, {
    title: 'React Profile',
    description: 'Online resume built with React and hosted on Netlify',
    technologies: ['React', 'CSS3', 'Netlify'],
    github: 'https://github.com',
    external: 'https://example.com',
    mpid: "44d8d405-b1f0-45f5-9199-af7ccd000f5d"
  }, {
    title: 'Lonely Planet DBMS',
    description: 'Final project for my Database Management Systems course',
    technologies: ['PHP', 'MySQL', 'HTML', 'CSS'],
    github: 'https://github.com',
    mpid: "edfe4bdf-c350-4879-8308-caf7565dc68f"
  }] as any[];
  return <motion.section id="projects" initial={{
    opacity: 0,
    y: 50
  }} whileInView={{
    opacity: 1,
    y: 0
  }} transition={{
    duration: 0.6
  }} viewport={{
    once: true
  }} className="mb-24" data-magicpath-id="0" data-magicpath-path="ProjectsSection.tsx">
      <h2 className="text-2xl font-bold text-slate-100 mb-6" data-magicpath-id="1" data-magicpath-path="ProjectsSection.tsx">
        Some Things I've Built
      </h2>
      
      {/* Featured Projects */}
      <div className="space-y-24" data-magicpath-id="2" data-magicpath-path="ProjectsSection.tsx">
        {projects.map((project, index) => <motion.div key={project.title} initial={{
        opacity: 0,
        y: 50
      }} whileInView={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.6,
        delay: index * 0.1
      }} viewport={{
        once: true
      }} className="group relative" data-magicpath-uuid={(project as any)["mpid"] ?? "unsafe"} data-magicpath-id="3" data-magicpath-path="ProjectsSection.tsx">
            <div className={`grid lg:grid-cols-12 gap-4 items-center ${index % 2 === 0 ? '' : 'lg:text-right'}`} data-magicpath-uuid={(project as any)["mpid"] ?? "unsafe"} data-magicpath-id="4" data-magicpath-path="ProjectsSection.tsx">
              {/* Project Image */}
              <div className={`relative lg:col-span-7 ${index % 2 === 0 ? '' : 'lg:col-start-6'}`} data-magicpath-uuid={(project as any)["mpid"] ?? "unsafe"} data-magicpath-id="5" data-magicpath-path="ProjectsSection.tsx">
                <motion.div whileHover={{
              scale: 1.05
            }} className="relative overflow-hidden rounded-lg bg-teal-300/10 aspect-video" data-magicpath-uuid={(project as any)["mpid"] ?? "unsafe"} data-magicpath-id="6" data-magicpath-path="ProjectsSection.tsx">
                  <div className="absolute inset-0 bg-slate-800 flex items-center justify-center" data-magicpath-uuid={(project as any)["mpid"] ?? "unsafe"} data-magicpath-id="7" data-magicpath-path="ProjectsSection.tsx">
                    <span className="text-slate-400 text-sm" data-magicpath-uuid={(project as any)["mpid"] ?? "unsafe"} data-magicpath-id="8" data-magicpath-path="ProjectsSection.tsx">Project Screenshot</span>
                  </div>
                  <div className="absolute inset-0 bg-teal-300/20 group-hover:bg-transparent transition-all duration-300" data-magicpath-uuid={(project as any)["mpid"] ?? "unsafe"} data-magicpath-id="9" data-magicpath-path="ProjectsSection.tsx" />
                </motion.div>
              </div>

              {/* Project Content */}
              <div className={`lg:col-span-5 space-y-4 ${index % 2 === 0 ? 'lg:col-start-8' : 'lg:col-start-1 lg:row-start-1'}`} data-magicpath-uuid={(project as any)["mpid"] ?? "unsafe"} data-magicpath-id="10" data-magicpath-path="ProjectsSection.tsx">
                <div data-magicpath-uuid={(project as any)["mpid"] ?? "unsafe"} data-magicpath-id="11" data-magicpath-path="ProjectsSection.tsx">
                  <p className="text-teal-300 font-mono text-sm mb-2" data-magicpath-uuid={(project as any)["mpid"] ?? "unsafe"} data-magicpath-id="12" data-magicpath-path="ProjectsSection.tsx">
                    Featured Project
                  </p>
                  <h3 className="text-2xl font-bold text-slate-100 group-hover:text-teal-300 transition-colors" data-magicpath-uuid={(project as any)["mpid"] ?? "unsafe"} data-magicpath-field="title:unknown" data-magicpath-id="13" data-magicpath-path="ProjectsSection.tsx">
                    {project.title}
                  </h3>
                </div>

                <div className="bg-slate-800 p-6 rounded-lg shadow-lg" data-magicpath-uuid={(project as any)["mpid"] ?? "unsafe"} data-magicpath-id="14" data-magicpath-path="ProjectsSection.tsx">
                  <p className="text-slate-300 text-sm leading-relaxed" data-magicpath-uuid={(project as any)["mpid"] ?? "unsafe"} data-magicpath-field="description:unknown" data-magicpath-id="15" data-magicpath-path="ProjectsSection.tsx">
                    {project.description}
                  </p>
                </div>

                <div className={`flex flex-wrap gap-2 ${index % 2 === 0 ? '' : 'lg:justify-end'}`} data-magicpath-uuid={(project as any)["mpid"] ?? "unsafe"} data-magicpath-id="16" data-magicpath-path="ProjectsSection.tsx">
                  {project.technologies.map(tech => <span key={tech} className="text-slate-400 font-mono text-xs" data-magicpath-uuid={(project as any)["mpid"] ?? "unsafe"} data-magicpath-id="17" data-magicpath-path="ProjectsSection.tsx">
                      {tech}
                    </span>)}
                </div>

                <div className={`flex space-x-4 ${index % 2 === 0 ? '' : 'lg:justify-end'}`} data-magicpath-uuid={(project as any)["mpid"] ?? "unsafe"} data-magicpath-id="18" data-magicpath-path="ProjectsSection.tsx">
                  <motion.a href={project.github} target="_blank" rel="noopener noreferrer" whileHover={{
                scale: 1.1,
                y: -2
              }} className="text-slate-400 hover:text-teal-300 transition-colors" aria-label="GitHub Repository" data-magicpath-uuid={(project as any)["mpid"] ?? "unsafe"} data-magicpath-id="19" data-magicpath-path="ProjectsSection.tsx">
                    <Github size={20} data-magicpath-uuid={(project as any)["mpid"] ?? "unsafe"} data-magicpath-id="20" data-magicpath-path="ProjectsSection.tsx" />
                  </motion.a>
                  <motion.a href={project.external} target="_blank" rel="noopener noreferrer" whileHover={{
                scale: 1.1,
                y: -2
              }} className="text-slate-400 hover:text-teal-300 transition-colors" aria-label="External Link" data-magicpath-uuid={(project as any)["mpid"] ?? "unsafe"} data-magicpath-id="21" data-magicpath-path="ProjectsSection.tsx">
                    <ExternalLink size={20} data-magicpath-uuid={(project as any)["mpid"] ?? "unsafe"} data-magicpath-id="22" data-magicpath-path="ProjectsSection.tsx" />
                  </motion.a>
                </div>
              </div>
            </div>
          </motion.div>)}
      </div>

      {/* Other Notable Projects */}
      <motion.div initial={{
      opacity: 0,
      y: 50
    }} whileInView={{
      opacity: 1,
      y: 0
    }} transition={{
      duration: 0.6
    }} viewport={{
      once: true
    }} className="mt-24" data-magicpath-id="23" data-magicpath-path="ProjectsSection.tsx">
        <h3 className="text-xl font-bold text-slate-100 mb-8 text-center" data-magicpath-id="24" data-magicpath-path="ProjectsSection.tsx">
          Other Noteworthy Projects
        </h3>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" data-magicpath-id="25" data-magicpath-path="ProjectsSection.tsx">
          {otherProjects.map((project, index) => <motion.div key={project.title} initial={{
          opacity: 0,
          y: 30
        }} whileInView={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.4,
          delay: index * 0.1
        }} viewport={{
          once: true
        }} whileHover={{
          y: -5
        }} className="bg-slate-800 p-6 rounded-lg border border-slate-700 hover:border-slate-600 transition-all duration-300" data-magicpath-uuid={(project as any)["mpid"] ?? "unsafe"} data-magicpath-id="26" data-magicpath-path="ProjectsSection.tsx">
              <div className="flex justify-between items-start mb-4" data-magicpath-uuid={(project as any)["mpid"] ?? "unsafe"} data-magicpath-id="27" data-magicpath-path="ProjectsSection.tsx">
                <div className="w-10 h-10 bg-teal-300/10 rounded-lg flex items-center justify-center" data-magicpath-uuid={(project as any)["mpid"] ?? "unsafe"} data-magicpath-id="28" data-magicpath-path="ProjectsSection.tsx">
                  <div className="w-4 h-4 bg-teal-300 rounded" data-magicpath-uuid={(project as any)["mpid"] ?? "unsafe"} data-magicpath-id="29" data-magicpath-path="ProjectsSection.tsx" />
                </div>
                <div className="flex space-x-2" data-magicpath-uuid={(project as any)["mpid"] ?? "unsafe"} data-magicpath-id="30" data-magicpath-path="ProjectsSection.tsx">
                  {project.github && <motion.a href={project.github} target="_blank" rel="noopener noreferrer" whileHover={{
                scale: 1.1
              }} className="text-slate-400 hover:text-teal-300 transition-colors" data-magicpath-uuid={(project as any)["mpid"] ?? "unsafe"} data-magicpath-id="31" data-magicpath-path="ProjectsSection.tsx">
                      <Github size={18} data-magicpath-uuid={(project as any)["mpid"] ?? "unsafe"} data-magicpath-id="32" data-magicpath-path="ProjectsSection.tsx" />
                    </motion.a>}
                  {project.external && <motion.a href={project.external} target="_blank" rel="noopener noreferrer" whileHover={{
                scale: 1.1
              }} className="text-slate-400 hover:text-teal-300 transition-colors" data-magicpath-uuid={(project as any)["mpid"] ?? "unsafe"} data-magicpath-id="33" data-magicpath-path="ProjectsSection.tsx">
                      <ExternalLink size={18} data-magicpath-uuid={(project as any)["mpid"] ?? "unsafe"} data-magicpath-id="34" data-magicpath-path="ProjectsSection.tsx" />
                    </motion.a>}
                </div>
              </div>
              
              <h4 className="text-slate-100 font-semibold mb-2" data-magicpath-uuid={(project as any)["mpid"] ?? "unsafe"} data-magicpath-field="title:unknown" data-magicpath-id="35" data-magicpath-path="ProjectsSection.tsx">
                {project.title}
              </h4>
              
              <p className="text-slate-400 text-sm mb-4 leading-relaxed" data-magicpath-uuid={(project as any)["mpid"] ?? "unsafe"} data-magicpath-field="description:unknown" data-magicpath-id="36" data-magicpath-path="ProjectsSection.tsx">
                {project.description}
              </p>
              
              <div className="flex flex-wrap gap-2" data-magicpath-uuid={(project as any)["mpid"] ?? "unsafe"} data-magicpath-id="37" data-magicpath-path="ProjectsSection.tsx">
                {project.technologies.map(tech => <span key={tech} className="text-slate-400 font-mono text-xs" data-magicpath-uuid={(project as any)["mpid"] ?? "unsafe"} data-magicpath-id="38" data-magicpath-path="ProjectsSection.tsx">
                    {tech}
                  </span>)}
              </div>
            </motion.div>)}
        </div>
      </motion.div>
    </motion.section>;
};
export default ProjectsSection;