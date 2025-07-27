import * as React from 'react';
import { BREAKPOINTS, MEDIA_QUERIES } from '@/constants/breakpoints';

/**
 * Hook to detect if the viewport is in mobile size
 * @param breakpoint - Custom breakpoint to use (defaults to standard mobile breakpoint)
 * @returns boolean indicating if viewport is mobile size
 */
export function useIsMobile(breakpoint: number = BREAKPOINTS.mobile): boolean {
  const [isMobile, setIsMobile] = React.useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < breakpoint;
    }
    return false;
  });

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const onChange = (event: MediaQueryListEvent) => {
      setIsMobile(event.matches);
    };
    
    // Set initial value
    setIsMobile(mql.matches);
    
    // Modern browsers
    if (mql.addEventListener) {
      mql.addEventListener('change', onChange);
      return () => mql.removeEventListener('change', onChange);
    }
    
    // Legacy browsers
    mql.addListener(onChange);
    return () => mql.removeListener(onChange);
  }, [breakpoint]);

  return isMobile;
}

/**
 * Hook to detect if the viewport is in desktop size (sidebar visible)
 * @returns boolean indicating if viewport shows sidebar
 */
export function useHasSidebar(): boolean {
  const [hasSidebar, setHasSidebar] = React.useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= BREAKPOINTS.tablet;
    }
    return true;
  });

  React.useEffect(() => {
    const mql = window.matchMedia(MEDIA_QUERIES.desktop);
    const onChange = (event: MediaQueryListEvent) => {
      setHasSidebar(event.matches);
    };
    
    setHasSidebar(mql.matches);
    
    if (mql.addEventListener) {
      mql.addEventListener('change', onChange);
      return () => mql.removeEventListener('change', onChange);
    }
    
    mql.addListener(onChange);
    return () => mql.removeListener(onChange);
  }, []);

  return hasSidebar;
}
