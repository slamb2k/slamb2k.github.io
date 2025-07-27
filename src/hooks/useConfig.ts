import { useMemo } from 'react';
import { config, AppConfig, isFeatureEnabled, debugLog } from '@/config/environment';

/**
 * Hook for accessing application configuration
 */
export function useConfig(): AppConfig {
  return useMemo(() => {
    debugLog('Configuration accessed:', config.environment);
    return config;
  }, []);
}

/**
 * Hook for checking feature flags
 */
export function useFeatureFlag(feature: keyof AppConfig['features']): boolean {
  return useMemo(() => {
    const enabled = isFeatureEnabled(feature);
    debugLog(`Feature ${feature}:`, enabled);
    return enabled;
  }, [feature]);
}

/**
 * Hook for accessing API configuration
 */
export function useApiConfig() {
  return useMemo(() => {
    debugLog('API configuration accessed:', config.api);
    return config.api;
  }, []);
}

/**
 * Hook for accessing analytics configuration
 */
export function useAnalyticsConfig() {
  return useMemo(() => {
    debugLog('Analytics configuration accessed:', config.analytics);
    return config.analytics;
  }, []);
}

/**
 * Hook for accessing contact configuration
 */
export function useContactConfig() {
  return useMemo(() => {
    debugLog('Contact configuration accessed:', config.contact);
    return config.contact;
  }, []);
}

/**
 * Hook for checking if we're in development mode
 */
export function useIsDevelopment(): boolean {
  return useMemo(() => config.environment === 'development', []);
}

/**
 * Hook for checking if we're in production mode
 */
export function useIsProduction(): boolean {
  return useMemo(() => config.environment === 'production', []);
}

/**
 * Hook for accessing build information
 */
export function useBuildInfo() {
  return useMemo(() => {
    debugLog('Build info accessed:', config.build);
    return config.build;
  }, []);
}