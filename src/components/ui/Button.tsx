import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { buttonHover, buttonTap } from '@/utils/animations';

/**
 * Props for the Button component
 */
interface ButtonProps {
  /** Button content */
  children: React.ReactNode;
  /** Visual style variant */
  variant?: 'primary' | 'outline' | 'ghost';
  /** Button size */
  size?: 'sm' | 'md' | 'lg';
  /** Optional Lucide icon component */
  icon?: LucideIcon;
  /** Position of the icon relative to text */
  iconPosition?: 'left' | 'right';
  /** Click handler for button mode */
  onClick?: () => void;
  /** URL for link mode (renders as anchor instead of button) */
  href?: string;
  /** Link target attribute */
  target?: string;
  /** Link rel attribute */
  rel?: string;
  /** Additional CSS classes */
  className?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Accessibility label */
  'aria-label'?: string;
}

/**
 * Button component with multiple variants, sizes, and animation support.
 *
 * Features:
 * - Three visual variants: primary, outline, ghost
 * - Three sizes: sm, md, lg
 * - Optional icons with configurable positioning
 * - Can render as button or link (when href provided)
 * - Framer Motion animations on hover and tap
 * - Full accessibility support with ARIA labels
 * - Disabled state support
 *
 * @example
 * ```tsx
 * // Basic button
 * <Button onClick={() => console.log('clicked')}>
 *   Click Me
 * </Button>
 *
 * // Link button with icon
 * <Button
 *   href="/download"
 *   target="_blank"
 *   icon={Download}
 *   variant="outline"
 *   size="lg"
 * >
 *   Download Resume
 * </Button>
 * ```
 */
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
  const [isHovered, setIsHovered] = React.useState(false);
  const [isPressed, setIsPressed] = React.useState(false);

  const baseClasses =
    'inline-flex items-center justify-center font-mono text-fluid-sm rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[oklch(0.72_0.18_165_/_50%)] disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden';

  const variantClasses = {
    primary: 'gradient-cyan text-[oklch(0.12_0.02_230)] shadow-elevation-1 hover:shadow-glow',
    outline: 'border border-cyan/50 text-cyan hover:bg-cyan/10 backdrop-blur-sm',
    ghost: 'text-secondary hover:text-cyan',
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
      {/* Ripple effect on click */}
      <AnimatePresence>
        {isPressed && variant === 'primary' && (
          <motion.span
            className="absolute inset-0 rounded-lg bg-white/20"
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 2, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{ originX: 0.5, originY: 0.5 }}
          />
        )}
      </AnimatePresence>

      {/* Gradient animation for primary variant */}
      {variant === 'primary' && (
        <div className="absolute inset-0 rounded-lg gradient-cyan animate-gradient opacity-100" />
      )}

      {/* Content */}
      <span className="relative flex items-center space-x-2">
        {Icon && iconPosition === 'left' && (
          <motion.span animate={{ rotate: isHovered ? 360 : 0 }} transition={{ duration: 0.5 }}>
            <Icon size={iconSizeMap[size]} className="flex-shrink-0" />
          </motion.span>
        )}
        <span>{children}</span>
        {Icon && iconPosition === 'right' && (
          <motion.span
            animate={{
              x: isHovered ? 3 : 0,
              rotate: isHovered ? 10 : 0,
            }}
            transition={{ duration: 0.3 }}
          >
            <Icon size={iconSizeMap[size]} className="flex-shrink-0" />
          </motion.span>
        )}
      </span>
    </>
  );

  const motionProps = {
    initial: 'rest',
    whileHover: disabled ? 'rest' : 'hover',
    whileTap: disabled ? 'rest' : 'tap',
    variants: {
      rest: { scale: 1 },
      hover: { scale: 1.03 },
      tap: { scale: 0.97 },
    },
    onHoverStart: () => setIsHovered(true),
    onHoverEnd: () => setIsHovered(false),
    onTapStart: () => setIsPressed(true),
    onTapCancel: () => setIsPressed(false),
    onTap: () => setIsPressed(false),
    className: `group ${combinedClasses}`,
  };

  if (href) {
    return (
      <motion.a href={href} target={target} rel={rel} aria-label={ariaLabel} {...motionProps}>
        {content}
      </motion.a>
    );
  }

  return (
    <motion.button onClick={onClick} disabled={disabled} aria-label={ariaLabel} {...motionProps}>
      {content}
    </motion.button>
  );
};

export default Button;
