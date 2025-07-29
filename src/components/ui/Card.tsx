import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'experience' | 'project' | 'feature';
  hover?: boolean;
  className?: string;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  hover = true,
  className = '',
  onClick,
}) => {
  const baseClasses = 'transition-all duration-300';

  const variantClasses = {
    default: 'p-6 rounded-lg border border-slate-800 bg-slate-900',
    experience:
      'p-6 rounded-lg border border-slate-800 hover:border-slate-700 hover:bg-slate-800/50',
    project: 'bg-slate-800 p-6 rounded-lg border border-slate-700 hover:border-slate-600',
    feature: 'p-6 rounded-lg bg-slate-800/50 border border-slate-700',
  };

  const hoverClasses = hover ? 'hover:scale-[1.02] cursor-pointer' : '';

  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${hoverClasses} ${className}`;

  const motionProps = {
    whileHover: hover && onClick ? { scale: 1.02 } : {},
    className: `group ${combinedClasses}`,
    onClick,
  };

  return <motion.div {...motionProps}>{children}</motion.div>;
};

// Subcomponents for common card layouts
interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ children, className = '' }) => (
  <div className={`mb-4 ${className}`}>{children}</div>
);

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export const CardContent: React.FC<CardContentProps> = ({ children, className = '' }) => (
  <div className={`${className}`}>{children}</div>
);

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const CardFooter: React.FC<CardFooterProps> = ({ children, className = '' }) => (
  <div className={`mt-4 ${className}`}>{children}</div>
);

export default Card;
