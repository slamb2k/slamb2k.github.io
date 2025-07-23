import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
const HeroSection: React.FC = () => {
  const scrollToAbout = () => {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };
  return <motion.section initial={{
    opacity: 0,
    y: 50
  }} animate={{
    opacity: 1,
    y: 0
  }} transition={{
    duration: 0.8
  }} className="min-h-screen flex flex-col justify-center mb-24 relative" data-magicpath-id="0" data-magicpath-path="HeroSection.tsx">
      <div className="space-y-6" data-magicpath-id="1" data-magicpath-path="HeroSection.tsx">
        <motion.p initial={{
        opacity: 0,
        x: -20
      }} animate={{
        opacity: 1,
        x: 0
      }} transition={{
        delay: 0.2
      }} className="text-teal-300 font-mono text-sm" data-magicpath-id="2" data-magicpath-path="HeroSection.tsx">
          Hi, my name is
        </motion.p>
        
        <motion.h1 initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.3
      }} className="text-5xl lg:text-7xl font-bold text-slate-100 leading-tight" data-magicpath-id="3" data-magicpath-path="HeroSection.tsx">
          John Doe.
        </motion.h1>
        
        <motion.h2 initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.4
      }} className="text-4xl lg:text-6xl font-bold text-slate-400 leading-tight" data-magicpath-id="4" data-magicpath-path="HeroSection.tsx">
          I build things for the web.
        </motion.h2>
        
        <motion.p initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.5
      }} className="text-slate-400 text-lg leading-relaxed max-w-2xl" data-magicpath-id="5" data-magicpath-path="HeroSection.tsx">
          I'm a software engineer specializing in building (and occasionally designing) 
          exceptional digital experiences. Currently, I'm focused on building accessible, 
          human-centered products at{' '}
          <span className="text-teal-300 font-medium" data-magicpath-id="6" data-magicpath-path="HeroSection.tsx">Upstatement</span>.
        </motion.p>
        
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.6
      }} className="pt-8" data-magicpath-id="7" data-magicpath-path="HeroSection.tsx">
          <motion.button whileHover={{
          scale: 1.05
        }} whileTap={{
          scale: 0.95
        }} onClick={scrollToAbout} className="group inline-flex items-center space-x-2 px-8 py-4 border border-teal-300 text-teal-300 rounded-lg hover:bg-teal-300/10 transition-all duration-300" data-magicpath-id="8" data-magicpath-path="HeroSection.tsx">
            <span className="font-mono text-sm" data-magicpath-id="9" data-magicpath-path="HeroSection.tsx">Check out my work!</span>
            <ArrowDown size={16} className="group-hover:translate-y-1 transition-transform duration-300" data-magicpath-id="10" data-magicpath-path="HeroSection.tsx" />
          </motion.button>
        </motion.div>
      </div>
      
      {/* Animated scroll indicator */}
      <motion.div initial={{
      opacity: 0
    }} animate={{
      opacity: 1
    }} transition={{
      delay: 1,
      duration: 1
    }} className="absolute bottom-8 left-1/2 transform -translate-x-1/2 hidden lg:block" data-magicpath-id="11" data-magicpath-path="HeroSection.tsx">
        <motion.div animate={{
        y: [0, 10, 0]
      }} transition={{
        duration: 2,
        repeat: Infinity
      }} className="w-6 h-10 border-2 border-slate-400 rounded-full flex justify-center" data-magicpath-id="12" data-magicpath-path="HeroSection.tsx">
          <motion.div animate={{
          y: [0, 12, 0]
        }} transition={{
          duration: 2,
          repeat: Infinity
        }} className="w-1 h-3 bg-slate-400 rounded-full mt-2" data-magicpath-id="13" data-magicpath-path="HeroSection.tsx" />
        </motion.div>
      </motion.div>
    </motion.section>;
};
export default HeroSection;