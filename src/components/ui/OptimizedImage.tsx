import React, { useState, useRef } from 'react';
import { useIntersectionObserver } from '@/utils/performance';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  loading?: 'lazy' | 'eager';
  sizes?: string;
  priority?: boolean;
  placeholder?: string;
  onLoad?: () => void;
  onError?: () => void;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  loading = 'lazy',
  sizes,
  priority = false,
  placeholder,
  onLoad,
  onError,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [imageSrc, setImageSrc] = useState(priority ? src : placeholder || '');
  const imgRef = useRef<HTMLImageElement>(null);

  // Use intersection observer for lazy loading (unless priority is set)
  const isVisible = useIntersectionObserver(imgRef, {
    rootMargin: '50px',
    threshold: 0.1,
  });

  // Load image when visible (for lazy loading)
  React.useEffect(() => {
    if (!priority && isVisible && !imageSrc && !hasError) {
      setImageSrc(src);
    }
  }, [isVisible, src, priority, imageSrc, hasError]);

  // Generate responsive srcSet for different screen sizes
  const generateSrcSet = (baseSrc: string): string => {
    if (!baseSrc || baseSrc.includes('placeholder')) {
      return baseSrc;
    }

    const widths = [320, 640, 768, 1024, 1280, 1536];
    return widths.map(w => `${baseSrc}?w=${w}&q=75 ${w}w`).join(', ');
  };

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  // Default placeholder for failed images
  const renderPlaceholder = () => (
    <div
      className={`bg-slate-800 flex items-center justify-center ${className}`}
      style={{ width, height, aspectRatio: width && height ? `${width}/${height}` : undefined }}
    >
      <span className="text-slate-400 text-sm">{hasError ? 'Failed to load' : 'Loading...'}</span>
    </div>
  );

  // Don't render img tag until we have a source
  if (!imageSrc && !priority) {
    return <div ref={imgRef}>{renderPlaceholder()}</div>;
  }

  return (
    <div ref={imgRef} className="relative">
      {!isLoaded && renderPlaceholder()}
      <img
        src={imageSrc}
        srcSet={generateSrcSet(imageSrc)}
        sizes={sizes || '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        className={`${className} ${!isLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onLoad={handleLoad}
        onError={handleError}
        style={{
          aspectRatio: width && height ? `${width}/${height}` : undefined,
        }}
      />
    </div>
  );
};

export default React.memo(OptimizedImage);
