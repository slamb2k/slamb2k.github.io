/**
 * Centralized breakpoint configuration for responsive design consistency
 */
export const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
  desktop: 1280,
  wide: 1536,
} as const;

/**
 * Media query helpers
 */
export const MEDIA_QUERIES = {
  mobile: `(max-width: ${BREAKPOINTS.mobile - 1}px)`,
  tablet: `(min-width: ${BREAKPOINTS.mobile}px) and (max-width: ${BREAKPOINTS.tablet - 1}px)`,
  desktop: `(min-width: ${BREAKPOINTS.tablet}px)`,
  wide: `(min-width: ${BREAKPOINTS.wide}px)`,
} as const;

/**
 * Component-specific breakpoints
 */
export const LAYOUT_BREAKPOINTS = {
  sidebarBreakpoint: BREAKPOINTS.tablet, // 1024px - when sidebar appears
  mobileNavBreakpoint: BREAKPOINTS.tablet, // 1024px - when mobile nav disappears
} as const;
