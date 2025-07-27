import React from 'react';
import { motion } from 'framer-motion';

/**
 * Props for the AnimatedText component
 */
interface AnimatedTextProps {
  /** Content to be animated - can be text or React elements */
  children: React.ReactNode;
  /** HTML element type to render as */
  variant?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  /** Additional CSS classes to apply */
  className?: string;
  /** Delay before animation starts (in seconds) */
  delay?: number;
  /** Duration of the animation (in seconds) */
  duration?: number;
  /** Direction of the entrance animation */
  direction?: 'up' | 'down' | 'left' | 'right' | 'fade';
  /** Whether to stagger child elements (works with text strings) */
  staggerChildren?: boolean;
  /** Delay between staggered children (in seconds) */
  staggerDelay?: number;
}

/**
 * AnimatedText component that provides entrance animations for text and React elements.
 *
 * Features:
 * - Multiple animation directions (up, down, left, right, fade)
 * - Configurable timing and delays
 * - Stagger animation for text strings (splits by words)
 * - Viewport-based triggering (animates when element comes into view)
 * - Support for different HTML element types
 *
 * @example
 * ```tsx
 * // Basic usage
 * <AnimatedText variant="h1" direction="up" delay={0.2}>
 *   Welcome to my portfolio
 * </AnimatedText>
 *
 * // Staggered text animation
 * <AnimatedText staggerChildren staggerDelay={0.1}>
 *   This text will animate word by word
 * </AnimatedText>
 * ```
 */
const AnimatedText: React.FC<AnimatedTextProps> = ({
  children,
  variant = 'p',
  className = '',
  delay = 0,
  duration = 0.6,
  direction = 'up',
  staggerChildren = false,
  staggerDelay = 0.1,
}) => {
  /**
   * Returns the initial animation state based on direction
   * @returns Framer Motion animation values for initial state
   */
  const getInitialState = () => {
    switch (direction) {
      case 'up':
        return { opacity: 0, y: 20 };
      case 'down':
        return { opacity: 0, y: -20 };
      case 'left':
        return { opacity: 0, x: -20 };
      case 'right':
        return { opacity: 0, x: 20 };
      case 'fade':
      default:
        return { opacity: 0 };
    }
  };

  /**
   * Returns the target animation state based on direction
   * @returns Framer Motion animation values for final state
   */
  const getAnimateState = () => {
    switch (direction) {
      case 'up':
        return { opacity: 1, y: 0 };
      case 'down':
        return { opacity: 1, y: 0 };
      case 'left':
        return { opacity: 1, x: 0 };
      case 'right':
        return { opacity: 1, x: 0 };
      case 'fade':
      default:
        return { opacity: 1 };
    }
  };

  const containerVariants = staggerChildren
    ? {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: delay,
          },
        },
      }
    : undefined;

  const itemVariants = staggerChildren
    ? {
        hidden: getInitialState(),
        visible: getAnimateState(),
      }
    : undefined;

  const motionProps = staggerChildren
    ? {
        variants: containerVariants,
        initial: 'hidden',
        whileInView: 'visible',
        viewport: { once: true },
        className,
      }
    : {
        initial: getInitialState(),
        whileInView: getAnimateState(),
        transition: { duration, delay },
        viewport: { once: true },
        className,
      };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Component = motion[variant as keyof typeof motion] as React.ComponentType<any>;

  if (staggerChildren && typeof children === 'string') {
    // Split text into words or characters for stagger effect
    const words = children.split(' ');
    return (
      <Component {...motionProps}>
        {words.map((word, index) => (
          <motion.span key={index} variants={itemVariants} className="inline-block">
            {word}
            {index < words.length - 1 && '\u00A0'} {/* Non-breaking space */}
          </motion.span>
        ))}
      </Component>
    );
  }

  return <Component {...motionProps}>{children}</Component>;
};

export default AnimatedText;
