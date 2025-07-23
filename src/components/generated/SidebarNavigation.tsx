import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, Linkedin, Twitter, Mail } from 'lucide-react';
interface SidebarNavigationProps {
  activeSection: string;
  onSectionClick: (sectionId: string) => void;
}
const SidebarNavigation: React.FC<SidebarNavigationProps> = ({
  activeSection,
  onSectionClick
}) => {
  const navigationItems = [{
    id: 'about',
    label: 'About'
  }, {
    id: 'experience',
    label: 'Experience'
  }, {
    id: 'projects',
    label: 'Projects'
  }, {
    id: 'contact',
    label: 'Contact'
  }] as any[];
  const socialLinks = [{
    icon: Github,
    href: 'https://github.com',
    label: 'GitHub'
  }, {
    icon: Linkedin,
    href: 'https://linkedin.com',
    label: 'LinkedIn'
  }, {
    icon: Twitter,
    href: 'https://twitter.com',
    label: 'Twitter'
  }, {
    icon: Mail,
    href: 'mailto:hello@example.com',
    label: 'Email'
  }] as any[];
  return <motion.aside initial={{
    x: -100,
    opacity: 0
  }} animate={{
    x: 0,
    opacity: 1
  }} transition={{
    duration: 0.6
  }} className="fixed left-0 top-0 h-screen w-96 bg-slate-900 border-r border-slate-800 p-12 flex flex-col justify-between z-40">
      {/* Header */}
      <div>
        <motion.div initial={{
        y: 20,
        opacity: 0
      }} animate={{
        y: 0,
        opacity: 1
      }} transition={{
        delay: 0.2
      }}>
          <h1 className="text-4xl font-bold text-slate-100 mb-2">
            John Doe
          </h1>
          <h2 className="text-xl text-slate-300 mb-4">
            Senior Frontend Engineer
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed mb-8">
            I build pixel-perfect, engaging, and accessible digital experiences.
          </p>
        </motion.div>

        {/* Navigation */}
        <nav className="space-y-4">
          {navigationItems.map((item, index) => <motion.button key={item.id} initial={{
          x: -20,
          opacity: 0
        }} animate={{
          x: 0,
          opacity: 1
        }} transition={{
          delay: 0.3 + index * 0.1
        }} onClick={() => onSectionClick(item.id)} className={`group flex items-center space-x-4 w-full text-left py-2 transition-all duration-300 ${activeSection === item.id ? 'text-slate-100' : 'text-slate-400 hover:text-slate-100'}`}>
              <div className={`h-px transition-all duration-300 ${activeSection === item.id ? 'w-16 bg-slate-100' : 'w-8 bg-slate-600 group-hover:w-16 group-hover:bg-slate-100'}`} />
              <div className="text-sm font-medium tracking-widest uppercase overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div key={`${item.id}-${activeSection === item.id ? 'active' : 'inactive'}`} className="flex" initial={{
                opacity: 0
              }} animate={{
                opacity: 1
              }} exit={{
                opacity: 0
              }} transition={{
                duration: 0.2
              }}>
                    {item.label.split('').map((letter, letterIndex) => <motion.span key={`${item.id}-${letter}-${letterIndex}-${activeSection === item.id ? 'active' : 'inactive'}`} className="inline-block" initial={{
                  rotateX: activeSection === item.id ? -90 : 0,
                  opacity: 0
                }} animate={{
                  rotateX: 0,
                  opacity: 1
                }} exit={{
                  rotateX: 90,
                  opacity: 0
                }} transition={{
                  duration: 0.4,
                  delay: letterIndex * 0.05,
                  ease: "easeInOut"
                }} style={{
                  transformOrigin: "center center",
                  transformStyle: "preserve-3d"
                }}>
                        {letter}
                      </motion.span>)}
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.button>)}
        </nav>
      </div>

      {/* Social Links */}
      <motion.div initial={{
      y: 20,
      opacity: 0
    }} animate={{
      y: 0,
      opacity: 1
    }} transition={{
      delay: 0.8
    }} className="flex space-x-4">
        {socialLinks.map(social => <motion.a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer" whileHover={{
        scale: 1.1,
        y: -2
      }} whileTap={{
        scale: 0.95
      }} className="p-2 text-slate-400 hover:text-teal-300 transition-colors duration-300" aria-label={social.label}>
            <social.icon size={20} />
          </motion.a>)}
      </motion.div>
    </motion.aside>;
};
export default SidebarNavigation;