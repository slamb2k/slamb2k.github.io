/**
 * Performance optimization utilities
 */

import React from 'react';

// Throttle function for performance optimization
export function throttle<T extends (...args: never[]) => void>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return function(this: unknown, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Debounce function for performance optimization
export function debounce<T extends (...args: never[]) => void>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  return function(this: unknown, ...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

// Intersection Observer hook for lazy loading
export function useIntersectionObserver(
  elementRef: React.RefObject<Element | null>,
  options: IntersectionObserverInit = {}
): boolean {
  const [isIntersecting, setIsIntersecting] = React.useState(false);

  React.useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);

    observer.observe(element);

    return () => {
      observer.unobserve(element);
      observer.disconnect();
    };
  }, [elementRef, options]);

  return isIntersecting;
}

// Performance monitoring utilities
export interface PerformanceMetrics {
  fcp: number | null; // First Contentful Paint
  lcp: number | null; // Largest Contentful Paint
  fid: number | null; // First Input Delay
  cls: number | null; // Cumulative Layout Shift
  ttfb: number | null; // Time to First Byte
}

export class PerformanceMonitor {
  private metrics: PerformanceMetrics = {
    fcp: null,
    lcp: null,
    fid: null,
    cls: null,
    ttfb: null
  };

  private observers: PerformanceObserver[] = [];

  constructor(private onMetricsUpdate?: (metrics: PerformanceMetrics) => void) {
    this.initializeObservers();
  }

  private initializeObservers() {
    // Core Web Vitals observer
    if ('PerformanceObserver' in window) {
      try {
        // LCP Observer
        const lcpObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          const lastEntry = entries[entries.length - 1] as PerformanceEntry & { startTime: number };
          this.metrics.lcp = lastEntry.startTime;
          this.notifyUpdate();
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        this.observers.push(lcpObserver);

        // FID Observer
        const fidObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          entries.forEach((entry: PerformanceEntry & { name?: string; processingStart?: number; startTime: number }) => {
            if (entry.name === 'first-input' && entry.processingStart) {
              this.metrics.fid = entry.processingStart - entry.startTime;
              this.notifyUpdate();
            }
          });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });
        this.observers.push(fidObserver);

        // CLS Observer
        const clsObserver = new PerformanceObserver((entryList) => {
          let clsValue = 0;
          const entries = entryList.getEntries();
          entries.forEach((entry: PerformanceEntry & { hadRecentInput?: boolean; value?: number }) => {
            if (!entry.hadRecentInput && entry.value) {
              clsValue += entry.value;
            }
          });
          this.metrics.cls = clsValue;
          this.notifyUpdate();
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
        this.observers.push(clsObserver);

        // Paint Observer for FCP
        const paintObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          entries.forEach((entry) => {
            if (entry.name === 'first-contentful-paint') {
              this.metrics.fcp = entry.startTime;
              this.notifyUpdate();
            }
          });
        });
        paintObserver.observe({ entryTypes: ['paint'] });
        this.observers.push(paintObserver);

        // Navigation timing for TTFB
        this.measureTTFB();
      } catch (error) {
        console.warn('Performance monitoring not fully supported:', error);
      }
    }
  }

  private measureTTFB() {
    if ('performance' in window && 'getEntriesByType' in performance) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        this.metrics.ttfb = navigation.responseStart - navigation.requestStart;
        this.notifyUpdate();
      }
    }
  }

  private notifyUpdate() {
    if (this.onMetricsUpdate) {
      this.onMetricsUpdate({ ...this.metrics });
    }
  }

  public getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  public destroy() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// Image optimization utilities
export interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  loading?: 'lazy' | 'eager';
  className?: string;
  sizes?: string;
  priority?: boolean;
}

export function generateSrcSet(baseSrc: string, widths: number[]): string {
  return widths
    .map(width => `${baseSrc}?w=${width} ${width}w`)
    .join(', ');
}

// Preload critical resources
export function preloadCriticalResources(resources: string[]) {
  resources.forEach(resource => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = resource;
    document.head.appendChild(link);
  });
}

// Memory usage monitoring
export function getMemoryUsage(): MemoryInfo | null {
  if ('memory' in performance) {
    return (performance as Performance & { memory: MemoryInfo }).memory;
  }
  return null;
}

interface MemoryInfo {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
}

// Bundle size analysis helper
export function logBundleInfo() {
  if (process.env.NODE_ENV === 'development') {
    console.group('Bundle Analysis');
    console.log('Performance API available:', 'performance' in window);
    console.log('Intersection Observer available:', 'IntersectionObserver' in window);
    console.log('Memory info:', getMemoryUsage());
    console.groupEnd();
  }
}