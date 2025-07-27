import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface IconButtonProps {
  icon: LucideIcon;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'ghost' | 'outline';
  onClick?: () => void;
  href?: string;
  target?: string;
  rel?: string;
  className?: string;
  disabled?: boolean;
  'aria-label': string; // Required for accessibility
  hoverEffect?: 'scale' | 'translate' | 'rotate' | 'none';
}

const IconButton: React.FC<IconButtonProps> = ({
  icon: Icon,
  size = 'md',
  variant = 'default',
  onClick,
  href,
  target,
  rel,
  className = '',
  disabled = false,
  'aria-label': ariaLabel,
  hoverEffect = 'scale',
}) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-teal-300/50 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };
  
  const variantClasses = {
    default: 'text-slate-400 hover:text-teal-300 hover:bg-teal-300/10',
    ghost: 'text-slate-400 hover:text-teal-300',
    outline: 'border border-slate-600 text-slate-400 hover:text-teal-300 hover:border-teal-300/50',
  };
  
  const iconSizeMap = {
    sm: 16,
    md: 20,
    lg: 24,
  };
  
  const getHoverAnimation = () => {
    if (disabled) return {};
    
    switch (hoverEffect) {
      case 'scale':
        return { scale: 1.1 };
      case 'translate':
        return { y: -2 };
      case 'rotate':
        return { rotate: 15 };
      case 'none':
      default:
        return {};
    }
  };
  
  const getIconHoverClass = () => {
    switch (hoverEffect) {
      case 'translate':
        return 'group-hover:translate-x-1 group-hover:-translate-y-1';
      case 'rotate':
        return 'group-hover:rotate-12';
      case 'scale':
      case 'none':
      default:
        return '';
    }
  };
  
  const combinedClasses = `group ${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`;
  
  const content = (
    <Icon 
      size={iconSizeMap[size]} 
      className={`transition-transform duration-300 ${getIconHoverClass()}`}
    />
  );
  
  const motionProps = {
    whileHover: getHoverAnimation(),
    whileTap: disabled ? {} : { scale: 0.95 },
    className: combinedClasses,
  };
  
  if (href) {
    return (
      <motion.a
        href={href}
        target={target}
        rel={rel}
        aria-label={ariaLabel}
        {...motionProps}
      >
        {content}
      </motion.a>
    );
  }
  
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      {...motionProps}
    >
      {content}
    </motion.button>
  );
};

export default IconButton;