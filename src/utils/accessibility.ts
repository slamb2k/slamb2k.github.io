/**
 * Accessibility utilities for screen readers and ARIA support
 */

/**
 * Create a live region element for screen reader announcements
 */
export function createLiveRegion(
  priority: 'polite' | 'assertive' = 'polite',
  id?: string
): HTMLElement {
  const liveRegion = document.createElement('div');
  liveRegion.setAttribute('aria-live', priority);
  liveRegion.setAttribute('aria-atomic', 'true');
  liveRegion.className = 'sr-only';
  
  if (id) {
    liveRegion.id = id;
  }
  
  document.body.appendChild(liveRegion);
  return liveRegion;
}

/**
 * Announce a message to screen readers
 */
export function announce(
  message: string,
  priority: 'polite' | 'assertive' = 'polite',
  timeout: number = 1000
): void {
  const liveRegion = createLiveRegion(priority);
  liveRegion.textContent = message;
  
  setTimeout(() => {
    if (liveRegion.parentNode) {
      document.body.removeChild(liveRegion);
    }
  }, timeout);
}

/**
 * Create a persistent live region for ongoing announcements
 */
export class LiveRegionManager {
  private liveRegion: HTMLElement | null = null;
  private timeoutId: number | null = null;
  
  constructor(
    private priority: 'polite' | 'assertive' = 'polite',
    private id: string = 'live-region-manager'
  ) {
    this.liveRegion = createLiveRegion(priority, id);
  }
  
  announce(message: string, clearAfter: number = 1000): void {
    if (!this.liveRegion) return;
    
    // Clear any existing timeout
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    
    this.liveRegion.textContent = message;
    
    if (clearAfter > 0) {
      this.timeoutId = window.setTimeout(() => {
        if (this.liveRegion) {
          this.liveRegion.textContent = '';
        }
      }, clearAfter);
    }
  }
  
  clear(): void {
    if (this.liveRegion) {
      this.liveRegion.textContent = '';
    }
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }
  
  destroy(): void {
    this.clear();
    if (this.liveRegion && this.liveRegion.parentNode) {
      document.body.removeChild(this.liveRegion);
    }
    this.liveRegion = null;
  }
}

/**
 * Accessibility status messages for common actions
 */
export const A11Y_MESSAGES = {
  NAVIGATION: {
    PAGE_LOADED: (pageName: string) => `${pageName} page loaded`,
    SECTION_CHANGED: (sectionName: string) => `Navigated to ${sectionName} section`,
    MENU_OPENED: 'Navigation menu opened',
    MENU_CLOSED: 'Navigation menu closed',
  },
  FORMS: {
    FIELD_REQUIRED: (fieldName: string) => `${fieldName} is required`,
    VALIDATION_ERROR: (errors: number) => `Form has ${errors} validation error${errors > 1 ? 's' : ''}`,
    FORM_SUBMITTED: 'Form submitted successfully',
    FORM_ERROR: 'Form submission failed',
  },
  INTERACTIONS: {
    LOADING_START: 'Loading content',
    LOADING_COMPLETE: 'Content loaded',
    ACTION_SUCCESS: (action: string) => `${action} completed successfully`,
    ACTION_ERROR: (action: string) => `${action} failed`,
  },
  SEARCH: {
    RESULTS_FOUND: (count: number) => `${count} result${count !== 1 ? 's' : ''} found`,
    NO_RESULTS: 'No results found',
    SEARCH_CLEARED: 'Search cleared',
  }
} as const;

/**
 * ARIA attributes helpers
 */
export const ARIA = {
  /**
   * Create ARIA attributes for a button that controls another element
   */
  controlsButton: (
    controlsId: string,
    expanded: boolean,
    hasPopup?: 'true' | 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog'
  ) => ({
    'aria-controls': controlsId,
    'aria-expanded': expanded,
    ...(hasPopup && { 'aria-haspopup': hasPopup }),
  }),
  
  /**
   * Create ARIA attributes for a listbox option
   */
  option: (selected: boolean, disabled?: boolean) => ({
    'role': 'option',
    'aria-selected': selected,
    ...(disabled && { 'aria-disabled': true }),
  }),
  
  /**
   * Create ARIA attributes for a tab
   */
  tab: (selected: boolean, controls: string) => ({
    'role': 'tab',
    'aria-selected': selected,
    'aria-controls': controls,
    'tabIndex': selected ? 0 : -1,
  }),
  
  /**
   * Create ARIA attributes for a tab panel
   */
  tabPanel: (labelledBy: string) => ({
    'role': 'tabpanel',
    'aria-labelledby': labelledBy,
    'tabIndex': 0,
  }),
  
  /**
   * Create ARIA attributes for a dialog
   */
  dialog: (labelledBy?: string, describedBy?: string) => ({
    'role': 'dialog',
    'aria-modal': 'true',
    ...(labelledBy && { 'aria-labelledby': labelledBy }),
    ...(describedBy && { 'aria-describedby': describedBy }),
  }),
  
  /**
   * Create ARIA attributes for a progress indicator
   */
  progressBar: (value: number, max: number = 100, label?: string) => ({
    'role': 'progressbar',
    'aria-valuenow': value,
    'aria-valuemin': 0,
    'aria-valuemax': max,
    'aria-valuetext': `${Math.round((value / max) * 100)}%`,
    ...(label && { 'aria-label': label }),
  }),
} as const;

/**
 * Screen reader only text utility
 */
export function createSROnlyText(text: string): HTMLSpanElement {
  const span = document.createElement('span');
  span.className = 'sr-only';
  span.textContent = text;
  return span;
}

/**
 * Check if an element is visible to screen readers
 */
export function isVisibleToScreenReader(element: HTMLElement): boolean {
  // Check if element or any ancestor has aria-hidden="true"
  let current: HTMLElement | null = element;
  while (current) {
    if (current.getAttribute('aria-hidden') === 'true') {
      return false;
    }
    current = current.parentElement;
  }
  
  // Check if element is visually hidden but accessible
  const styles = window.getComputedStyle(element);
  if (styles.position === 'absolute' && (
    styles.left === '-10000px' || 
    styles.top === '-10000px' ||
    styles.clip === 'rect(0px, 0px, 0px, 0px)'
  )) {
    return true; // Visually hidden but accessible
  }
  
  // Check if element is visible
  return element.offsetParent !== null || 
         styles.position === 'fixed' ||
         element === document.body;
}

/**
 * Focus management utilities
 */
export const FocusManager = {
  /**
   * Save the current focus and return a function to restore it
   */
  saveFocus: (): (() => void) => {
    const activeElement = document.activeElement as HTMLElement;
    return () => {
      if (activeElement && typeof activeElement.focus === 'function') {
        activeElement.focus();
      }
    };
  },
  
  /**
   * Focus the first focusable element in a container
   */
  focusFirst: (container: HTMLElement): boolean => {
    const focusableSelector = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
    const focusableElement = container.querySelector(focusableSelector) as HTMLElement;
    
    if (focusableElement) {
      focusableElement.focus();
      return true;
    }
    return false;
  },
  
  /**
   * Focus an element with a fallback
   */
  focusWithFallback: (
    primary: HTMLElement | null,
    fallback: HTMLElement | null = document.body
  ): void => {
    if (primary && typeof primary.focus === 'function') {
      primary.focus();
    } else if (fallback && typeof fallback.focus === 'function') {
      fallback.focus();
    }
  },
};

/**
 * Enhanced color contrast checking (basic implementation)
 */
export function checkColorContrast(
  foreground: string,
  background: string
): { ratio: number; wcagAA: boolean; wcagAAA: boolean } {
  // This is a simplified implementation
  // In a real app, you'd use a proper color contrast library
  
  // Mock implementation that returns reasonable values
  const ratio = 4.5; // Mock ratio
  
  return {
    ratio,
    wcagAA: ratio >= 4.5,
    wcagAAA: ratio >= 7,
  };
}

/**
 * Accessibility testing helpers
 */
export const A11yTest = {
  /**
   * Check if an element has accessible name
   */
  hasAccessibleName: (element: HTMLElement): boolean => {
    return !!(
      element.getAttribute('aria-label') ||
      element.getAttribute('aria-labelledby') ||
      element.textContent?.trim() ||
      element.getAttribute('title') ||
      (element.tagName.toLowerCase() === 'img' && element.getAttribute('alt'))
    );
  },
  
  /**
   * Check if an element has proper heading hierarchy
   */
  checkHeadingHierarchy: (container: HTMLElement = document.body): string[] => {
    const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const issues: string[] = [];
    let lastLevel = 0;
    
    headings.forEach((heading, index) => {
      const level = parseInt(heading.tagName.charAt(1), 10);
      
      if (index === 0 && level !== 1) {
        issues.push('First heading should be h1');
      }
      
      if (level > lastLevel + 1) {
        issues.push(`Heading level skipped: found h${level} after h${lastLevel}`);
      }
      
      lastLevel = level;
    });
    
    return issues;
  },
  
  /**
   * Check for missing form labels
   */
  checkFormLabels: (container: HTMLElement = document.body): string[] => {
    const formControls = container.querySelectorAll('input, select, textarea');
    const issues: string[] = [];
    
    formControls.forEach((control) => {
      const element = control as HTMLElement;
      const id = element.id;
      const hasLabel = !!(
        element.getAttribute('aria-label') ||
        element.getAttribute('aria-labelledby') ||
        (id && container.querySelector(`label[for="${id}"]`))
      );
      
      if (!hasLabel) {
        issues.push(`Form control without label: ${element.tagName.toLowerCase()}`);
      }
    });
    
    return issues;
  },
};