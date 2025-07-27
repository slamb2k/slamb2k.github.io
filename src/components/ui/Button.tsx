import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  onClick?: () => void;
  href?: string;
  target?: string;
  rel?: string;
  className?: string;
  disabled?: boolean;
  'aria-label'?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'right',
  onClick,
  href,
  target,
  rel,
  className = '',
  disabled = false,
  'aria-label': ariaLabel,
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-mono text-sm rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-teal-300/50 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-teal-300 text-slate-900 hover:bg-teal-200',
    outline: 'border border-teal-300 text-teal-300 hover:bg-teal-300/10',
    ghost: 'text-slate-400 hover:text-teal-300',
  };
  
  const sizeClasses = {
    sm: 'px-4 py-2 text-xs space-x-1',
    md: 'px-6 py-3 text-sm space-x-2',
    lg: 'px-8 py-4 text-sm space-x-2',
  };
  
  const iconSizeMap = {
    sm: 14,
    md: 16,
    lg: 18,
  };
  
  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;
  
  const content = (
    <>
      {Icon && iconPosition === 'left' && (
        <Icon size={iconSizeMap[size]} className="flex-shrink-0" />
      )}
      <span>{children}</span>
      {Icon && iconPosition === 'right' && (
        <Icon 
          size={iconSizeMap[size]} 
          className="flex-shrink-0 group-hover:translate-y-1 transition-transform duration-300" 
        />
      )}
    </>
  );
  
  const motionProps = {
    whileHover: { scale: disabled ? 1 : 1.05 },
    whileTap: { scale: disabled ? 1 : 0.95 },
    className: `group ${combinedClasses}`,
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

export default Button;