import React from 'react';
import { motion } from 'framer-motion';

interface SectionProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
  animate?: boolean;
  delay?: number;
}

const Section: React.FC<SectionProps> = ({
  children,
  id,
  className = '',
  animate = true,
  delay = 0,
}) => {
  const baseClasses = 'mb-24';
  const combinedClasses = `${baseClasses} ${className}`;
  
  if (!animate) {
    return (
      <section id={id} className={combinedClasses}>
        {children}
      </section>
    );
  }
  
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      viewport={{ once: true }}
      className={combinedClasses}
    >
      {children}
    </motion.section>
  );
};

// Subcomponent for section titles
interface SectionTitleProps {
  children: React.ReactNode;
  className?: string;
  animate?: boolean;
  delay?: number;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({
  children,
  className = '',
  animate = true,
  delay = 0,
}) => {
  const baseClasses = 'text-2xl font-bold text-slate-100 mb-6';
  const combinedClasses = `${baseClasses} ${className}`;
  
  if (!animate) {
    return <h2 className={combinedClasses}>{children}</h2>;
  }
  
  return (
    <motion.h2
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay }}
      viewport={{ once: true }}
      className={combinedClasses}
    >
      {children}
    </motion.h2>
  );
};

export default Section;