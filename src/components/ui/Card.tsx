import React from 'react';
import { motion } from 'framer-motion';
import { cardHover } from '@/utils/animations';

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
  const [isHovered, setIsHovered] = React.useState(false);
  const baseClasses = 'transition-all duration-300 relative overflow-hidden';

  const variantClasses = {
    default:
      'p-6 rounded-lg border border-white/5 bg-midnight-elevated/80 backdrop-blur-sm shadow-elevation-1',
    experience:
      'p-6 rounded-lg border border-white/5 bg-midnight-elevated/90 hover:border-cyan/20 hover:shadow-glow shadow-elevation-1',
    project:
      'p-6 rounded-lg border border-white/5 bg-midnight-elevated/90 hover:border-cyan/20 hover:bg-midnight-elevated/50 hover:shadow-glow shadow-elevation-1',
    feature:
      'p-6 rounded-lg glass border border-white/10 hover:border-emerald/20 shadow-elevation-1',
  };

  const hoverClasses = hover ? 'cursor-pointer' : '';

  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${hoverClasses} ${className}`;

  const motionProps = {
    initial: 'rest',
    whileHover: hover ? 'hover' : 'rest',
    animate: 'rest',
    variants: hover ? cardHover : {},
    className: `group ${combinedClasses}`,
    onClick,
    onHoverStart: () => setIsHovered(true),
    onHoverEnd: () => setIsHovered(false),
    style: {
      transformStyle: 'preserve-3d' as const,
      perspective: '1000px',
    },
  };

  // Check if this is a featured card based on className
  const isFeatured = className?.includes('col-span');

  return (
    <motion.div {...motionProps}>
      {/* Gradient border effect on hover */}
      {variant === 'project' && (isHovered || isFeatured) && (
        <motion.div
          className={`absolute inset-0 rounded-lg gradient-border ${isFeatured ? 'opacity-60' : 'opacity-50'} animate-gradient`}
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? (isFeatured ? 0.7 : 0.5) : isFeatured ? 0.3 : 0 }}
          transition={{ duration: 0.3 }}
          style={{ padding: '1px', zIndex: -1 }}
        />
      )}

      {/* Subtle noise texture overlay */}
      <div
        className="absolute inset-0 rounded-lg opacity-5 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
        }}
      />

      {children}
    </motion.div>
  );
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
