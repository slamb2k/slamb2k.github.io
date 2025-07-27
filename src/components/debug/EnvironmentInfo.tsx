import React from 'react';
import { motion } from 'framer-motion';
import { useConfig, useIsDevelopment } from '@/hooks/useConfig';
import { validateConfig } from '@/config/environment';

interface EnvironmentInfoProps {
  className?: string;
}

const EnvironmentInfo: React.FC<EnvironmentInfoProps> = ({ className = '' }) => {
  const config = useConfig();
  const isDevelopment = useIsDevelopment();
  const validation = validateConfig();

  // Only show in development mode or when explicitly enabled
  if (!isDevelopment && !config.development.showPerformanceMetrics) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`fixed bottom-4 right-4 z-50 ${className}`}
    >
      <div className="bg-slate-800/90 backdrop-blur-sm text-slate-300 p-4 rounded-lg shadow-xl border border-slate-700 max-w-sm">
        <div className="space-y-2 text-xs">
          {/* Environment Badge */}
          <div className="flex items-center justify-between">
            <span className="font-medium">Environment:</span>
            <span
              className={`px-2 py-1 rounded text-xs font-mono ${
                config.environment === 'production'
                  ? 'bg-green-600/20 text-green-300'
                  : config.environment === 'staging'
                  ? 'bg-yellow-600/20 text-yellow-300'
                  : 'bg-blue-600/20 text-blue-300'
              }`}
            >
              {config.environment}
            </span>
          </div>

          {/* Build Information */}
          <div className="flex items-center justify-between">
            <span className="font-medium">Version:</span>
            <span className="font-mono">{config.build.version}</span>
          </div>

          {/* Feature Flags */}
          <div className="border-t border-slate-600 pt-2">
            <div className="font-medium mb-1">Features:</div>
            <div className="grid grid-cols-2 gap-1">
              {Object.entries(config.features).map(([key, enabled]) => (
                <div key={key} className="flex items-center space-x-1">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      enabled ? 'bg-green-400' : 'bg-slate-500'
                    }`}
                  />
                  <span className="text-xs capitalize">{key}</span>
                </div>
              ))}
            </div>
          </div>

          {/* API Configuration */}
          <div className="border-t border-slate-600 pt-2">
            <div className="font-medium mb-1">API:</div>
            <div className="text-xs text-slate-400">
              {new URL(config.api.baseUrl).hostname}
            </div>
          </div>

          {/* Validation Status */}
          {!validation.isValid && (
            <div className="border-t border-slate-600 pt-2">
              <div className="font-medium mb-1 text-red-400">Config Issues:</div>
              <div className="space-y-1">
                {validation.errors.map((error, index) => (
                  <div key={index} className="text-xs text-red-300">
                    • {error}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Performance Metrics Toggle */}
          {config.development.showPerformanceMetrics && (
            <div className="border-t border-slate-600 pt-2">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
                <span className="text-xs">Performance tracking enabled</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default EnvironmentInfo;