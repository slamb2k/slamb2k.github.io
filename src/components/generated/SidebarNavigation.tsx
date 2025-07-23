import React from 'react';
import { motion } from 'framer-motion';
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
    mpid: "88960789-5c95-419f-9bc8-1904b55afc52"
  }, {
    id: 'experience',
    label: 'Experience',
    mpid: "6cace23a-6dde-4a47-b2eb-d92ffd3eecad"
  }, {
    id: 'projects',
    label: 'Projects',
    mpid: "f6d49967-6184-437b-bd67-45c6452d9f8c"
  }, {
    id: 'contact',
    label: 'Contact',
    mpid: "760bd843-c09f-45ed-9939-b86a0919f98b"
  }] as any[];
  const socialLinks = [{
    icon: Github,
    href: 'https://github.com',
    label: 'GitHub',
    mpid: "c8d35667-7685-4051-9447-9cf2fe064511"
  }, {
    icon: Linkedin,
    href: 'https://linkedin.com',
    label: 'LinkedIn',
    mpid: "f11c6ef2-eabb-41ed-9d06-c482f3dcd3b4"
  }, {
    icon: Twitter,
    href: 'https://twitter.com',
    label: 'Twitter',
    mpid: "05f48944-db34-4dfa-bb1a-783f7d2c3d16"
  }, {
    icon: Mail,
    href: 'mailto:hello@example.com',
    label: 'Email',
    mpid: "44df7a68-4b04-41b2-bbe6-9a7f99c5131a"
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
              <span className="text-sm font-medium tracking-widest uppercase" data-magicpath-uuid={(item as any)["mpid"] ?? "unsafe"} data-magicpath-field="label:string" data-magicpath-id="9" data-magicpath-path="SidebarNavigation.tsx">
                {item.label}
              </span>
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
    }} className="flex space-x-4" data-magicpath-id="10" data-magicpath-path="SidebarNavigation.tsx">
        {socialLinks.map(social => <motion.a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer" whileHover={{
        scale: 1.1,
        y: -2
      }} whileTap={{
        scale: 0.95
      }} className="p-2 text-slate-400 hover:text-teal-300 transition-colors duration-300" aria-label={social.label} data-magicpath-uuid={(social as any)["mpid"] ?? "unsafe"} data-magicpath-id="11" data-magicpath-path="SidebarNavigation.tsx">
            <social.icon size={20} data-magicpath-uuid={(social as any)["mpid"] ?? "unsafe"} data-magicpath-id="12" data-magicpath-path="SidebarNavigation.tsx" />
          </motion.a>)}
      </motion.div>
    </motion.aside>;
};
export default SidebarNavigation;