/**
 * Bundle size analysis and optimization utilities
 */

import { getMemoryUsage } from './performance';

interface BundleInfo {
  totalSize: number;
  gzippedSize: number;
  moduleCount: number;
  criticalPath: string[];
  recommendations: string[];
}

// Analyze current bundle performance
export function analyzeBundlePerformance(): BundleInfo {
  const recommendations: string[] = [];
  const criticalPath: string[] = [];

  // Check for common performance issues
  if (typeof window !== 'undefined') {
    const scripts = document.querySelectorAll('script[src]');
    const styles = document.querySelectorAll('link[rel="stylesheet"]');
    
    // Analyze script loading
    scripts.forEach(script => {
      const src = (script as HTMLScriptElement).src;
      if (src) {
        criticalPath.push(src);
        
        // Check for unoptimized scripts
        if (src.includes('node_modules') && !src.includes('.min.')) {
          recommendations.push(`Consider using minified version of: ${src}`);
        }
      }
    });

    // Analyze CSS loading
    styles.forEach(style => {
      const href = (style as HTMLLinkElement).href;
      if (href) {
        criticalPath.push(href);
      }
    });

    // Memory usage recommendations
    const memory = getMemoryUsage();
    if (memory) {
      const usageRatio = memory.usedJSHeapSize / memory.jsHeapSizeLimit;
      
      if (usageRatio > 0.8) {
        recommendations.push('High memory usage detected. Consider code splitting or lazy loading.');
      }
      
      if (memory.usedJSHeapSize > 50 * 1024 * 1024) { // 50MB
        recommendations.push('Large heap size. Consider optimizing data structures and caching.');
      }
    }

    // Check for duplicate libraries
    const scriptSources = Array.from(scripts).map(s => (s as HTMLScriptElement).src);
    const duplicates = scriptSources.filter((src, index) => 
      scriptSources.indexOf(src) !== index
    );
    
    if (duplicates.length > 0) {
      recommendations.push(`Duplicate scripts detected: ${duplicates.join(', ')}`);
    }
  }

  return {
    totalSize: 0, // Would be populated by build tools
    gzippedSize: 0, // Would be populated by build tools
    moduleCount: criticalPath.length,
    criticalPath,
    recommendations
  };
}

// Code splitting recommendations
export function getCodeSplittingRecommendations(): string[] {
  const recommendations: string[] = [];

  // Check for large components that could be lazy loaded
  if (typeof window !== 'undefined') {
    const bodyText = document.body.innerText;
    
    // Simple heuristics for code splitting
    if (bodyText.length > 50000) {
      recommendations.push('Consider lazy loading sections for large pages');
    }
    
    // Check for animation libraries
    const hasAnimations = document.querySelector('[class*="animate"]') || 
                         document.querySelector('[style*="transform"]');
    
    if (hasAnimations) {
      recommendations.push('Consider lazy loading animation libraries');
    }
    
    // Check for third-party widgets
    const hasThirdParty = document.querySelector('iframe') ||
                         document.querySelector('[src*="googleapis"]') ||
                         document.querySelector('[src*="facebook"]');
    
    if (hasThirdParty) {
      recommendations.push('Consider lazy loading third-party widgets');
    }
  }

  return recommendations;
}

// Performance budget checker
export interface PerformanceBudget {
  maxBundleSize: number; // KB
  maxInitialLoad: number; // ms
  maxLCP: number; // ms
  maxFID: number; // ms
  maxCLS: number;
}

export const defaultBudget: PerformanceBudget = {
  maxBundleSize: 500, // 500KB
  maxInitialLoad: 3000, // 3 seconds
  maxLCP: 2500,
  maxFID: 100,
  maxCLS: 0.1
};

export function checkPerformanceBudget(
  currentMetrics: any,
  budget: PerformanceBudget = defaultBudget
): { passed: boolean; violations: string[] } {
  const violations: string[] = [];

  if (currentMetrics.lcp && currentMetrics.lcp > budget.maxLCP) {
    violations.push(`LCP (${currentMetrics.lcp}ms) exceeds budget (${budget.maxLCP}ms)`);
  }

  if (currentMetrics.fid && currentMetrics.fid > budget.maxFID) {
    violations.push(`FID (${currentMetrics.fid}ms) exceeds budget (${budget.maxFID}ms)`);
  }

  if (currentMetrics.cls && currentMetrics.cls > budget.maxCLS) {
    violations.push(`CLS (${currentMetrics.cls}) exceeds budget (${budget.maxCLS})`);
  }

  return {
    passed: violations.length === 0,
    violations
  };
}

// Log comprehensive bundle analysis
export function logBundleAnalysis() {
  if (process.env.NODE_ENV === 'development') {
    console.group('📦 Bundle Analysis');
    
    const bundleInfo = analyzeBundlePerformance();
    console.log('Critical Path:', bundleInfo.criticalPath);
    console.log('Module Count:', bundleInfo.moduleCount);
    console.log('Recommendations:', bundleInfo.recommendations);
    
    const codeSplittingRecs = getCodeSplittingRecommendations();
    if (codeSplittingRecs.length > 0) {
      console.log('Code Splitting Recommendations:', codeSplittingRecs);
    }
    
    const memory = getMemoryUsage();
    if (memory) {
      console.log('Memory Usage:', {
        used: `${Math.round(memory.usedJSHeapSize / 1024 / 1024)}MB`,
        total: `${Math.round(memory.totalJSHeapSize / 1024 / 1024)}MB`,
        limit: `${Math.round(memory.jsHeapSizeLimit / 1024 / 1024)}MB`
      });
    }
    
    console.groupEnd();
  }
}