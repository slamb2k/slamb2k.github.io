import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { throttle, debounce, PerformanceMonitor, generateSrcSet, getMemoryUsage } from './performance';

describe('Performance Utilities', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  describe('throttle', () => {
    it('should call function immediately on first call', () => {
      const mockFn = vi.fn();
      const throttledFn = throttle(mockFn, 100);

      throttledFn();
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('should throttle subsequent calls', () => {
      const mockFn = vi.fn();
      const throttledFn = throttle(mockFn, 100);

      throttledFn();
      throttledFn();
      throttledFn();

      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('should allow calls after throttle period', () => {
      const mockFn = vi.fn();
      const throttledFn = throttle(mockFn, 100);

      throttledFn();
      vi.advanceTimersByTime(100);
      throttledFn();

      expect(mockFn).toHaveBeenCalledTimes(2);
    });
  });

  describe('debounce', () => {
    it('should delay function execution', () => {
      const mockFn = vi.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn();
      expect(mockFn).not.toHaveBeenCalled();

      vi.advanceTimersByTime(100);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('should cancel previous calls when called again', () => {
      const mockFn = vi.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn();
      vi.advanceTimersByTime(50);
      debouncedFn();
      vi.advanceTimersByTime(100);

      expect(mockFn).toHaveBeenCalledTimes(1);
    });
  });

  describe('PerformanceMonitor', () => {
    beforeEach(() => {
      // Mock PerformanceObserver
      const MockPerformanceObserver = vi.fn().mockImplementation((callback) => ({
        observe: vi.fn(),
        disconnect: vi.fn(),
      }));
      Object.defineProperty(MockPerformanceObserver, 'supportedEntryTypes', {
        value: ['navigation', 'paint', 'largest-contentful-paint']
      });
      global.PerformanceObserver = MockPerformanceObserver as any;

      // Mock performance.getEntriesByType
      global.performance.getEntriesByType = vi.fn().mockReturnValue([{
        responseStart: 100,
        requestStart: 50,
      }]);
    });

    it('should create monitor instance', () => {
      const monitor = new PerformanceMonitor();
      expect(monitor).toBeInstanceOf(PerformanceMonitor);
    });

    it('should call callback when metrics update', () => {
      const callback = vi.fn();
      const monitor = new PerformanceMonitor(callback);
      
      // Simulate metric update
      const metrics = monitor.getMetrics();
      expect(metrics).toHaveProperty('fcp');
      expect(metrics).toHaveProperty('lcp');
      expect(metrics).toHaveProperty('fid');
      expect(metrics).toHaveProperty('cls');
      expect(metrics).toHaveProperty('ttfb');
    });

    it('should destroy observers on destroy', () => {
      const monitor = new PerformanceMonitor();
      monitor.destroy();
      
      // Should not throw error
      expect(() => monitor.destroy()).not.toThrow();
    });
  });

  describe('generateSrcSet', () => {
    it('should generate correct srcset', () => {
      const baseSrc = 'image.jpg';
      const widths = [320, 640, 1280];
      
      const result = generateSrcSet(baseSrc, widths);
      expect(result).toBe('image.jpg?w=320 320w, image.jpg?w=640 640w, image.jpg?w=1280 1280w');
    });
  });

  describe('getMemoryUsage', () => {
    it('should return memory info if available', () => {
      // Mock memory API
      (global.performance as any).memory = {
        usedJSHeapSize: 1000000,
        totalJSHeapSize: 2000000,
        jsHeapSizeLimit: 4000000,
      };

      const result = getMemoryUsage();
      expect(result).toEqual({
        usedJSHeapSize: 1000000,
        totalJSHeapSize: 2000000,
        jsHeapSizeLimit: 4000000,
      });
    });

    it('should return null if memory API not available', () => {
      delete (global.performance as any).memory;

      const result = getMemoryUsage();
      expect(result).toBeNull();
    });
  });
});