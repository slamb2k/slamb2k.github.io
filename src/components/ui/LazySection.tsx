import React, { useRef, useState } from 'react';
import { useIntersectionObserver } from '@/utils/performance';

interface LazySectionProps {
  children: React.ReactNode;
  className?: string;
  fallback?: React.ReactNode;
  rootMargin?: string;
  threshold?: number;
  once?: boolean;
}

const LazySection: React.FC<LazySectionProps> = ({
  children,
  className = '',
  fallback,
  rootMargin = '100px',
  threshold = 0.1,
  once = true,
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);

  const isVisible = useIntersectionObserver(sectionRef, {
    rootMargin,
    threshold,
  });

  // Track if the section has been visible (for once behavior)
  React.useEffect(() => {
    if (isVisible && !hasBeenVisible) {
      setHasBeenVisible(true);
    }
  }, [isVisible, hasBeenVisible]);

  const shouldRender = once ? hasBeenVisible : isVisible;

  return (
    <div ref={sectionRef} className={className}>
      {shouldRender ? children : fallback || <div className="min-h-96" />}
    </div>
  );
};

export default React.memo(LazySection);
