import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedTextProps {
  children: React.ReactNode;
  variant?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  className?: string;
  delay?: number;
  duration?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'fade';
  staggerChildren?: boolean;
  staggerDelay?: number;
}

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
  
  const containerVariants = staggerChildren ? {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: delay,
      },
    },
  } : undefined;
  
  const itemVariants = staggerChildren ? {
    hidden: getInitialState(),
    visible: getAnimateState(),
  } : undefined;
  
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
          <motion.span
            key={index}
            variants={itemVariants}
            className="inline-block"
          >
            {word}
            {index < words.length - 1 && '\u00A0'} {/* Non-breaking space */}
          </motion.span>
        ))}
      </Component>
    );
  }
  
  return (
    <Component {...motionProps}>
      {children}
    </Component>
  );
};

export default AnimatedText;