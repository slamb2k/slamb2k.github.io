/**
 * Resource preloader for critical performance optimizations
 */

// Preload critical fonts and styles
export function preloadCriticalResources() {
  if (typeof window === 'undefined') return;

  // Note: CSS is already bundled and injected by Vite in production
  // No need to manually preload it

  // Only preload actual critical images that exist
  // For now, we don't have any critical images to preload
  // const criticalImages = [];
  // criticalImages.forEach(src => {
  //   const link = document.createElement('link');
  //   link.rel = 'preload';
  //   link.as = 'image';
  //   link.href = src;
  //   document.head.appendChild(link);
  // });
}

// Resource hints for improved loading
export function addResourceHints() {
  if (typeof window === 'undefined') return;

  // DNS prefetch for external resources
  const dnsPrefetchHosts = ['fonts.googleapis.com', 'fonts.gstatic.com'];

  dnsPrefetchHosts.forEach(host => {
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = `//${host}`;
    document.head.appendChild(link);
  });

  // Preconnect to critical third-party origins
  const preconnectHosts = ['https://fonts.googleapis.com', 'https://fonts.gstatic.com'];

  preconnectHosts.forEach(origin => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = origin;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });
}

// Lazy load non-critical resources
export function lazyLoadNonCriticalResources() {
  if (typeof window === 'undefined') return;

  // Load analytics, social widgets, etc. after page load
  window.addEventListener('load', () => {
    // Example: Load Google Analytics
    // gtag('js', new Date());
    // gtag('config', 'GA_MEASUREMENT_ID');
    // Load other non-critical scripts
    // Removed console.log to avoid console errors in production
  });
}

// Service Worker registration for caching
export function registerServiceWorker() {
  // Only register service worker if it exists
  // Currently disabled until we implement a service worker
  return;

  // if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;
  // window.addEventListener('load', () => {
  //   navigator.serviceWorker
  //     .register('/sw.js')
  //     .then(registration => {
  //       console.log('SW registered: ', registration);
  //     })
  //     .catch(registrationError => {
  //       console.log('SW registration failed: ', registrationError);
  //     });
  // });
}

// Initialize all performance optimizations
export function initializePerformanceOptimizations() {
  preloadCriticalResources();
  addResourceHints();
  lazyLoadNonCriticalResources();

  if (process.env.NODE_ENV === 'production') {
    registerServiceWorker();
  }
}
