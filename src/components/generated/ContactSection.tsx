import React from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowUpRight } from 'lucide-react';
const ContactSection: React.FC = () => {
  return <motion.section id="contact" initial={{
    opacity: 0,
    y: 50
  }} whileInView={{
    opacity: 1,
    y: 0
  }} transition={{
    duration: 0.6
  }} viewport={{
    once: true
  }} className="text-center py-24" data-magicpath-id="0" data-magicpath-path="ContactSection.tsx">
      <motion.div initial={{
      opacity: 0,
      y: 30
    }} whileInView={{
      opacity: 1,
      y: 0
    }} transition={{
      duration: 0.6,
      delay: 0.2
    }} viewport={{
      once: true
    }} className="max-w-2xl mx-auto space-y-6" data-magicpath-id="1" data-magicpath-path="ContactSection.tsx">
        <p className="text-teal-300 font-mono text-sm" data-magicpath-id="2" data-magicpath-path="ContactSection.tsx">
          04. What's Next?
        </p>
        
        <h2 className="text-4xl lg:text-5xl font-bold text-slate-100" data-magicpath-id="3" data-magicpath-path="ContactSection.tsx">
          Get In Touch
        </h2>
        
        <p className="text-slate-400 text-lg leading-relaxed" data-magicpath-id="4" data-magicpath-path="ContactSection.tsx">
          Although I'm not currently looking for any new opportunities, my inbox is 
          always open. Whether you have a question or just want to say hi, I'll try 
          my best to get back to you!
        </p>
        
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} whileInView={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.6,
        delay: 0.4
      }} viewport={{
        once: true
      }} className="pt-8" data-magicpath-id="5" data-magicpath-path="ContactSection.tsx">
          <motion.a href="mailto:hello@johndoe.com" whileHover={{
          scale: 1.05
        }} whileTap={{
          scale: 0.95
        }} className="group inline-flex items-center space-x-2 px-8 py-4 border border-teal-300 text-teal-300 rounded-lg hover:bg-teal-300/10 transition-all duration-300" data-magicpath-id="6" data-magicpath-path="ContactSection.tsx">
            <Mail size={18} data-magicpath-id="7" data-magicpath-path="ContactSection.tsx" />
            <span className="font-mono text-sm" data-magicpath-id="8" data-magicpath-path="ContactSection.tsx">Say Hello</span>
            <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" data-magicpath-id="9" data-magicpath-path="ContactSection.tsx" />
          </motion.a>
        </motion.div>
      </motion.div>
      
      {/* Footer */}
      <motion.footer initial={{
      opacity: 0
    }} whileInView={{
      opacity: 1
    }} transition={{
      duration: 0.6,
      delay: 0.6
    }} viewport={{
      once: true
    }} className="mt-24 pt-12 border-t border-slate-800" data-magicpath-id="10" data-magicpath-path="ContactSection.tsx">
        <div className="flex flex-col items-center space-y-4" data-magicpath-id="11" data-magicpath-path="ContactSection.tsx">
          <motion.a href="https://github.com/bchiang7/v4" target="_blank" rel="noopener noreferrer" whileHover={{
          y: -2
        }} className="text-slate-400 hover:text-teal-300 transition-colors text-sm font-mono" data-magicpath-id="12" data-magicpath-path="ContactSection.tsx">
            Designed & Built by John Doe
          </motion.a>
          
          <div className="flex items-center space-x-6 text-xs text-slate-500" data-magicpath-id="13" data-magicpath-path="ContactSection.tsx">
            <span data-magicpath-id="14" data-magicpath-path="ContactSection.tsx">© 2024 John Doe</span>
            <span data-magicpath-id="15" data-magicpath-path="ContactSection.tsx">•</span>
            <span data-magicpath-id="16" data-magicpath-path="ContactSection.tsx">All rights reserved</span>
          </div>
        </div>
      </motion.footer>
    </motion.section>;
};
export default ContactSection;