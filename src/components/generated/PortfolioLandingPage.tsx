import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SidebarNavigation from './SidebarNavigation';
import HeroSection from './HeroSection';
import ProjectsSection from './ProjectsSection';
import ContactSection from './ContactSection';
const PortfolioLandingPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState('about');
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['about', 'experience', 'projects', 'contact'];
      const scrollPosition = window.scrollY + 100;
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const {
            offsetTop,
            offsetHeight
          } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };
  return <div className="min-h-screen bg-slate-900 text-slate-300" data-magicpath-id="0" data-magicpath-path="PortfolioLandingPage.tsx">
      {/* Mobile Header */}
      {isMobile && <motion.header initial={{
      y: -100
    }} animate={{
      y: 0
    }} className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800" data-magicpath-id="1" data-magicpath-path="PortfolioLandingPage.tsx">
          <div className="px-6 py-4" data-magicpath-id="2" data-magicpath-path="PortfolioLandingPage.tsx">
            <h1 className="text-xl font-bold text-slate-100" data-magicpath-id="3" data-magicpath-path="PortfolioLandingPage.tsx">John Doe</h1>
          </div>
        </motion.header>}

      <div className="lg:flex" data-magicpath-id="4" data-magicpath-path="PortfolioLandingPage.tsx">
        {/* Sidebar Navigation - Desktop */}
        {!isMobile && <SidebarNavigation activeSection={activeSection} onSectionClick={scrollToSection} data-magicpath-id="5" data-magicpath-path="PortfolioLandingPage.tsx" />}

        {/* Main Content */}
        <main className={`flex-1 ${isMobile ? 'pt-20' : 'lg:ml-96'}`} data-magicpath-id="6" data-magicpath-path="PortfolioLandingPage.tsx">
          <div className="max-w-4xl mx-auto px-6 lg:px-12 py-12 lg:py-24" data-magicpath-id="7" data-magicpath-path="PortfolioLandingPage.tsx">
            {/* Hero Section */}
            <HeroSection data-magicpath-id="8" data-magicpath-path="PortfolioLandingPage.tsx" />

            {/* About Section */}
            <motion.section id="about" initial={{
            opacity: 0,
            y: 50
          }} whileInView={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.6
          }} viewport={{
            once: true
          }} className="mb-24" data-magicpath-id="9" data-magicpath-path="PortfolioLandingPage.tsx">
              <h2 className="text-2xl font-bold text-slate-100 mb-6" data-magicpath-id="10" data-magicpath-path="PortfolioLandingPage.tsx">About</h2>
              <div className="space-y-4 text-slate-400 leading-relaxed" data-magicpath-id="11" data-magicpath-path="PortfolioLandingPage.tsx">
                <p data-magicpath-id="12" data-magicpath-path="PortfolioLandingPage.tsx">
                  I'm a passionate full-stack developer with over 5 years of experience building 
                  digital experiences. I specialize in creating accessible, pixel-perfect web 
                  applications with modern technologies.
                </p>
                <p data-magicpath-id="13" data-magicpath-path="PortfolioLandingPage.tsx">
                  My main focus these days is building products and leading projects at{' '}
                  <span className="text-teal-300 font-medium" data-magicpath-id="14" data-magicpath-path="PortfolioLandingPage.tsx">Upstatement</span>. I most enjoy 
                  building software in the sweet spot where design and engineering meet — things 
                  that look good but are also built well under the hood.
                </p>
                <p data-magicpath-id="15" data-magicpath-path="PortfolioLandingPage.tsx">
                  When I'm not at the computer, I'm usually rock climbing, hanging out with my 
                  wife and two cats, or running around Hyrule searching for Korok seeds.
                </p>
              </div>
            </motion.section>

            {/* Experience Section */}
            <motion.section id="experience" initial={{
            opacity: 0,
            y: 50
          }} whileInView={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.6
          }} viewport={{
            once: true
          }} className="mb-24" data-magicpath-id="16" data-magicpath-path="PortfolioLandingPage.tsx">
              <h2 className="text-2xl font-bold text-slate-100 mb-6" data-magicpath-id="17" data-magicpath-path="PortfolioLandingPage.tsx">Experience</h2>
              <div className="space-y-8" data-magicpath-id="18" data-magicpath-path="PortfolioLandingPage.tsx">
                {[{
                period: '2021 — Present',
                title: 'Senior Frontend Engineer',
                company: 'Upstatement',
                description: 'Build and maintain critical components used to construct Klaviyo\'s frontend, across the whole product. Work closely with cross-functional teams, including developers, designers, and product managers.',
                technologies: ['JavaScript', 'TypeScript', 'React', 'Storybook'],
                mpid: "1f22e7ad-e9e8-413b-8485-52668dd2157a"
              }, {
                period: '2018 — 2021',
                title: 'Frontend Developer',
                company: 'Apple',
                description: 'Developed and maintained web applications for Apple\'s internal tools. Collaborated with design teams to implement pixel-perfect interfaces.',
                technologies: ['React', 'Redux', 'Node.js', 'GraphQL'],
                mpid: "171ae57e-e095-4e86-99f3-6795f8ddd0f7"
              }].map((job, index) => <motion.div key={index} whileHover={{
                scale: 1.02
              }} className="group relative p-6 rounded-lg border border-slate-800 hover:border-slate-700 hover:bg-slate-800/50 transition-all duration-300" data-magicpath-uuid={(job as any)["mpid"] ?? "unsafe"} data-magicpath-id="19" data-magicpath-path="PortfolioLandingPage.tsx">
                    <div className="flex flex-col lg:flex-row lg:items-start gap-4" data-magicpath-uuid={(job as any)["mpid"] ?? "unsafe"} data-magicpath-id="20" data-magicpath-path="PortfolioLandingPage.tsx">
                      <div className="text-sm text-slate-500 font-mono lg:w-32 flex-shrink-0" data-magicpath-uuid={(job as any)["mpid"] ?? "unsafe"} data-magicpath-field="period:unknown" data-magicpath-id="21" data-magicpath-path="PortfolioLandingPage.tsx">
                        {job.period}
                      </div>
                      <div className="flex-1" data-magicpath-uuid={(job as any)["mpid"] ?? "unsafe"} data-magicpath-id="22" data-magicpath-path="PortfolioLandingPage.tsx">
                        <h3 className="text-slate-100 font-semibold group-hover:text-teal-300 transition-colors" data-magicpath-uuid={(job as any)["mpid"] ?? "unsafe"} data-magicpath-field="company:unknown,title:unknown" data-magicpath-id="23" data-magicpath-path="PortfolioLandingPage.tsx">
                          {job.title} · {job.company}
                        </h3>
                        <p className="text-slate-400 mt-2 text-sm leading-relaxed" data-magicpath-uuid={(job as any)["mpid"] ?? "unsafe"} data-magicpath-field="description:unknown" data-magicpath-id="24" data-magicpath-path="PortfolioLandingPage.tsx">
                          {job.description}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-4" data-magicpath-uuid={(job as any)["mpid"] ?? "unsafe"} data-magicpath-id="25" data-magicpath-path="PortfolioLandingPage.tsx">
                          {job.technologies.map(tech => <span key={tech} className="px-3 py-1 text-xs bg-teal-400/10 text-teal-300 rounded-full" data-magicpath-uuid={(job as any)["mpid"] ?? "unsafe"} data-magicpath-id="26" data-magicpath-path="PortfolioLandingPage.tsx">
                              {tech}
                            </span>)}
                        </div>
                      </div>
                    </div>
                  </motion.div>)}
              </div>
            </motion.section>

            {/* Projects Section */}
            <ProjectsSection data-magicpath-id="27" data-magicpath-path="PortfolioLandingPage.tsx" />

            {/* Contact Section */}
            <ContactSection data-magicpath-id="28" data-magicpath-path="PortfolioLandingPage.tsx" />
          </div>
        </main>
      </div>
    </div>;
};
export default PortfolioLandingPage;