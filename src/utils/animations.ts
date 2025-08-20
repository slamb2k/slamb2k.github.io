import { Variants } from 'framer-motion';

/**
 * Reusable animation variants for consistent motion throughout the app
 */

// Fade animations
export const fadeInUp: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
};

export const fadeInDown: Variants = {
  initial: {
    opacity: 0,
    y: -20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
};

export const fadeIn: Variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
};

// Scale animations
export const scaleIn: Variants = {
  initial: {
    opacity: 0,
    scale: 0.9,
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
};

// Stagger animations for lists
export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

export const staggerItem: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
};

// Card hover effects with perspective
export const cardHover = {
  rest: {
    scale: 1,
    rotateX: 0,
    rotateY: 0,
  },
  hover: {
    scale: 1.02,
    rotateX: -2,
    rotateY: 1,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
};

// Smooth reveal on scroll
export const scrollReveal: Variants = {
  initial: {
    opacity: 0,
    y: 30,
  },
  whileInView: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

// Button animations
export const buttonTap = {
  tap: {
    scale: 0.97,
    transition: {
      duration: 0.1,
      ease: 'easeInOut',
    },
  },
};

export const buttonHover = {
  hover: {
    scale: 1.03,
    transition: {
      duration: 0.2,
      ease: 'easeOut',
    },
  },
};

// Magnetic effect for interactive elements
export const magneticHover = {
  rest: {
    x: 0,
    y: 0,
  },
  hover: (offset: { x: number; y: number }) => ({
    x: offset.x * 0.3,
    y: offset.y * 0.3,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  }),
};

// Gradient animation for borders and backgrounds
export const gradientShift = {
  initial: {
    backgroundPosition: '0% 50%',
  },
  animate: {
    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
    transition: {
      duration: 5,
      ease: 'linear',
      repeat: Infinity,
    },
  },
};

// Glow pulse effect
export const glowPulse = {
  initial: {
    boxShadow: '0 0 20px oklch(0.72 0.18 165 / 0%)',
  },
  animate: {
    boxShadow: [
      '0 0 20px oklch(0.72 0.18 165 / 0%)',
      '0 0 30px oklch(0.72 0.18 165 / 20%)',
      '0 0 20px oklch(0.72 0.18 165 / 0%)',
    ],
    transition: {
      duration: 2,
      ease: 'easeInOut',
      repeat: Infinity,
    },
  },
};

// Slide animations
export const slideInLeft: Variants = {
  initial: {
    opacity: 0,
    x: -100,
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    x: -100,
    transition: {
      duration: 0.3,
      ease: 'easeIn',
    },
  },
};

export const slideInRight: Variants = {
  initial: {
    opacity: 0,
    x: 100,
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    x: 100,
    transition: {
      duration: 0.3,
      ease: 'easeIn',
    },
  },
};

// Utility function to create custom spring animations
export const springTransition = (stiffness = 400, damping = 30) => ({
  type: 'spring',
  stiffness,
  damping,
});

// Utility function for reduced motion
export const getReducedMotion = <T extends Record<string, unknown>>(
  fullMotion: T,
  reducedMotion: Partial<T> = {}
): T | Partial<T> => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  return prefersReducedMotion ? reducedMotion : fullMotion;
};
