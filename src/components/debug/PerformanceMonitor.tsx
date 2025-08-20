import React, { useState, useEffect } from 'react';
import { PerformanceMonitor, PerformanceMetrics } from '@/utils/performance';
import { useConfig, useIsDevelopment } from '@/hooks/useConfig';
import { logBundleAnalysis, checkPerformanceBudget } from '@/utils/bundleAnalyzer';

const PerformanceDisplay: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fcp: null,
    lcp: null,
    fid: null,
    cls: null,
    ttfb: null,
  });
  const [monitor, setMonitor] = useState<PerformanceMonitor | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const isDev = useIsDevelopment();
  const config = useConfig();

  useEffect(() => {
    if (isDev && config.development.showPerformanceMetrics) {
      const perfMonitor = new PerformanceMonitor(newMetrics => {
        setMetrics(newMetrics);

        // Log bundle analysis when metrics are updated
        logBundleAnalysis();

        // Check performance budget
        const budgetCheck = checkPerformanceBudget(newMetrics);
        if (!budgetCheck.passed) {
          console.warn('Performance Budget Violations:', budgetCheck.violations);
        }
      });

      setMonitor(perfMonitor);

      return () => {
        perfMonitor.destroy();
      };
    }
  }, [isDev, config.development.showPerformanceMetrics]);

  // Don't render in production or if disabled
  if (!isDev || !config.development.showPerformanceMetrics) {
    return null;
  }

  const formatMetric = (value: number | null, unit: string = 'ms'): string => {
    if (value === null) return 'N/A';
    return `${Math.round(value * 100) / 100}${unit}`;
  };

  const getMetricColor = (metric: string, value: number | null): string => {
    if (value === null) return 'text-slate-400';

    switch (metric) {
      case 'fcp':
        return value < 1800 ? 'text-green-400' : value < 3000 ? 'text-yellow-400' : 'text-red-400';
      case 'lcp':
        return value < 2500 ? 'text-green-400' : value < 4000 ? 'text-yellow-400' : 'text-red-400';
      case 'fid':
        return value < 100 ? 'text-green-400' : value < 300 ? 'text-yellow-400' : 'text-red-400';
      case 'cls':
        return value < 0.1 ? 'text-green-400' : value < 0.25 ? 'text-yellow-400' : 'text-red-400';
      case 'ttfb':
        return value < 800 ? 'text-green-400' : value < 1800 ? 'text-yellow-400' : 'text-red-400';
      default:
        return 'text-slate-300';
    }
  };

  return (
    <>
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="bg-slate-800 text-slate-300 px-3 py-2 rounded-lg border border-slate-700 hover:bg-slate-700 transition-colors text-sm font-mono"
      >
        📊 Perf
      </button>

      {isVisible && (
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 text-xs font-mono w-64 shadow-xl">
          <h3 className="text-slate-100 font-semibold mb-3 text-sm">Core Web Vitals</h3>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-400">FCP:</span>
              <span className={getMetricColor('fcp', metrics.fcp)}>
                {formatMetric(metrics.fcp)}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-400">LCP:</span>
              <span className={getMetricColor('lcp', metrics.lcp)}>
                {formatMetric(metrics.lcp)}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-400">FID:</span>
              <span className={getMetricColor('fid', metrics.fid)}>
                {formatMetric(metrics.fid)}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-400">CLS:</span>
              <span className={getMetricColor('cls', metrics.cls)}>
                {formatMetric(metrics.cls, '')}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-400">TTFB:</span>
              <span className={getMetricColor('ttfb', metrics.ttfb)}>
                {formatMetric(metrics.ttfb)}
              </span>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-700">
            <div className="text-slate-500 text-xs">💚 Good | 🟡 Needs Work | 🔴 Poor</div>
          </div>
        </div>
      )}
    </>
  );
};

export default React.memo(PerformanceDisplay);
