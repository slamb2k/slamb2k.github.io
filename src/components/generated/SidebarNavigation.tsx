import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, Linkedin, Twitter, Mail } from 'lucide-react';
interface SidebarNavigationProps {
  activeSection: string;
  onSectionClick: (sectionId: string) => void;
  mpid?: string;
}
const SidebarNavigation: React.FC<SidebarNavigationProps> = ({
  activeSection,
  onSectionClick
}) => {
  const navigationItems = [{
    id: 'about',
    label: 'About',
    mpid: "f79ab4aa-7cf1-4fc1-8574-137658cdf1e8"
  }, {
    id: 'experience',
    label: 'Experience',
    mpid: "9f5a4296-6639-43b2-9f1b-c4b9c83a955f"
  }, {
    id: 'projects',
    label: 'Projects',
    mpid: "b1f02a22-32c1-4cec-8273-20cf7359a84f"
  }, {
    id: 'contact',
    label: 'Contact',
    mpid: "e954cabf-a7d9-4538-89c8-123d7167733a"
  }] as any[];
  const socialLinks = [{
    icon: Github,
    href: 'https://github.com',
    label: 'GitHub',
    mpid: "ff597270-d5d2-4216-912b-5a600e8f81ca"
  }, {
    icon: Linkedin,
    href: 'https://linkedin.com',
    label: 'LinkedIn',
    mpid: "31316f0c-70b2-4f84-81b5-94bb3d5c0a13"
  }, {
    icon: Twitter,
    href: 'https://twitter.com',
    label: 'Twitter',
    mpid: "d86fcb45-ab40-4171-b3e5-e7aacbfda8ad"
  }, {
    icon: Mail,
    href: 'mailto:hello@example.com',
    label: 'Email',
    mpid: "49888a3a-af77-436e-8794-827a4117856e"
  }] as any[];
  return <motion.aside initial={{
    x: -100,
    opacity: 0
  }} animate={{
    x: 0,
    opacity: 1
  }} transition={{
    duration: 0.6
  }} className="fixed left-0 top-0 h-screen w-96 bg-slate-900 border-r border-slate-800 p-12 flex flex-col justify-between z-40" data-magicpath-id="0" data-magicpath-path="SidebarNavigation.tsx">
      {/* Header */}
      <div data-magicpath-id="1" data-magicpath-path="SidebarNavigation.tsx">
        <motion.div initial={{
        y: 20,
        opacity: 0
      }} animate={{
        y: 0,
        opacity: 1
      }} transition={{
        delay: 0.2
      }} data-magicpath-id="2" data-magicpath-path="SidebarNavigation.tsx">
          <h1 className="text-4xl font-bold text-slate-100 mb-2" data-magicpath-id="3" data-magicpath-path="SidebarNavigation.tsx">
            John Doe
          </h1>
          <h2 className="text-xl text-slate-300 mb-4" data-magicpath-id="4" data-magicpath-path="SidebarNavigation.tsx">
            Senior Frontend Engineer
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed mb-8" data-magicpath-id="5" data-magicpath-path="SidebarNavigation.tsx">
            I build pixel-perfect, engaging, and accessible digital experiences.
          </p>
        </motion.div>

        {/* Navigation */}
        <nav className="space-y-4" data-magicpath-id="6" data-magicpath-path="SidebarNavigation.tsx">
          {navigationItems.map((item, index) => <motion.button key={item.id} initial={{
          x: -20,
          opacity: 0
        }} animate={{
          x: 0,
          opacity: 1
        }} transition={{
          delay: 0.3 + index * 0.1
        }} onClick={() => onSectionClick(item.id)} className={`group flex items-center space-x-4 w-full text-left py-2 transition-all duration-300 ${activeSection === item.id ? 'text-slate-100' : 'text-slate-400 hover:text-slate-100'}`} data-magicpath-uuid={(item as any)["mpid"] ?? "unsafe"} data-magicpath-id="7" data-magicpath-path="SidebarNavigation.tsx">
              <div className={`h-px transition-all duration-300 ${activeSection === item.id ? 'w-16 bg-slate-100' : 'w-8 bg-slate-600 group-hover:w-16 group-hover:bg-slate-100'}`} data-magicpath-uuid={(item as any)["mpid"] ?? "unsafe"} data-magicpath-id="8" data-magicpath-path="SidebarNavigation.tsx" />
              <div className="text-sm font-medium tracking-widest uppercase overflow-hidden" data-magicpath-uuid={(item as any)["mpid"] ?? "unsafe"} data-magicpath-id="9" data-magicpath-path="SidebarNavigation.tsx">
                <AnimatePresence mode="wait" data-magicpath-uuid={(item as any)["mpid"] ?? "unsafe"} data-magicpath-id="10" data-magicpath-path="SidebarNavigation.tsx">
                  <motion.div key={`${item.id}-${activeSection === item.id ? 'active' : 'inactive'}`} className="flex" initial={{
                opacity: 0
              }} animate={{
                opacity: 1
              }} exit={{
                opacity: 0
              }} transition={{
                duration: 0.2
              }} data-magicpath-uuid={(item as any)["mpid"] ?? "unsafe"} data-magicpath-id="11" data-magicpath-path="SidebarNavigation.tsx">
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
                }} data-magicpath-uuid={(item as any)["mpid"] ?? "unsafe"} data-magicpath-id="12" data-magicpath-path="SidebarNavigation.tsx">
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
    }} className="flex space-x-4" data-magicpath-id="13" data-magicpath-path="SidebarNavigation.tsx">
        {socialLinks.map(social => <motion.a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer" whileHover={{
        scale: 1.1,
        y: -2
      }} whileTap={{
        scale: 0.95
      }} className="p-2 text-slate-400 hover:text-teal-300 transition-colors duration-300" aria-label={social.label} data-magicpath-uuid={(social as any)["mpid"] ?? "unsafe"} data-magicpath-id="14" data-magicpath-path="SidebarNavigation.tsx">
            <social.icon size={20} data-magicpath-uuid={(social as any)["mpid"] ?? "unsafe"} data-magicpath-id="15" data-magicpath-path="SidebarNavigation.tsx" />
          </motion.a>)}
      </motion.div>
    </motion.aside>;
};
export default SidebarNavigation;