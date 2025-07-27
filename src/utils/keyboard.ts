/**
 * Keyboard navigation utilities for improved accessibility
 */

export interface KeyboardNavigationOptions {
  /** Whether to enable arrow key navigation */
  enableArrowKeys?: boolean;
  /** Whether to enable Home/End key navigation */
  enableHomeEnd?: boolean;
  /** Whether to wrap around when reaching the end of the list */
  wrap?: boolean;
  /** Whether to enable Enter/Space activation */
  enableActivation?: boolean;
  /** Whether to enable Escape to close/exit */
  enableEscape?: boolean;
}

/**
 * Key codes for common keyboard interactions
 */
export const KEYS = {
  TAB: 'Tab',
  ENTER: 'Enter',
  SPACE: ' ',
  ESCAPE: 'Escape',
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  HOME: 'Home',
  END: 'End',
} as const;

/**
 * Check if an element is focusable
 */
export function isFocusable(element: HTMLElement): boolean {
  const focusableSelectors = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable="true"]',
  ];

  const isFocusableElement = focusableSelectors.some(selector => 
    element.matches(selector)
  );

  return isFocusableElement && !element.hasAttribute('aria-hidden');
}

/**
 * Get all focusable elements within a container
 */
export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const focusableSelectors = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable="true"]',
  ].join(', ');

  const elements = Array.from(
    container.querySelectorAll<HTMLElement>(focusableSelectors)
  );

  return elements.filter(element => 
    !element.hasAttribute('aria-hidden') && 
    element.offsetParent !== null // Element is visible
  );
}

/**
 * Trap focus within a container (useful for modals, dropdowns)
 */
export function trapFocus(container: HTMLElement, event: KeyboardEvent): void {
  if (event.key !== KEYS.TAB) return;

  const focusableElements = getFocusableElements(container);
  if (focusableElements.length === 0) return;

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  if (event.shiftKey) {
    // Shift + Tab
    if (document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    }
  } else {
    // Tab
    if (document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  }
}

/**
 * Handle arrow key navigation for a list of elements
 */
export function handleArrowNavigation(
  elements: HTMLElement[],
  currentIndex: number,
  key: string,
  options: KeyboardNavigationOptions = {}
): number {
  const { wrap = true, enableHomeEnd = true } = options;
  let newIndex = currentIndex;

  switch (key) {
    case KEYS.ARROW_UP:
    case KEYS.ARROW_LEFT:
      newIndex = currentIndex > 0 ? currentIndex - 1 : wrap ? elements.length - 1 : 0;
      break;
    case KEYS.ARROW_DOWN:
    case KEYS.ARROW_RIGHT:
      newIndex = currentIndex < elements.length - 1 ? currentIndex + 1 : wrap ? 0 : elements.length - 1;
      break;
    case KEYS.HOME:
      if (enableHomeEnd) newIndex = 0;
      break;
    case KEYS.END:
      if (enableHomeEnd) newIndex = elements.length - 1;
      break;
    default:
      return currentIndex;
  }

  elements[newIndex]?.focus();
  return newIndex;
}

/**
 * Create a keyboard event handler for navigation
 */
export function createKeyboardNavigationHandler(
  getElements: () => HTMLElement[],
  getCurrentIndex: () => number,
  setCurrentIndex: (index: number) => void,
  options: KeyboardNavigationOptions = {}
) {
  return (event: KeyboardEvent) => {
    const { enableActivation = true, enableEscape = false } = options;
    const elements = getElements();
    const currentIndex = getCurrentIndex();

    // Handle activation (Enter/Space)
    if (enableActivation && (event.key === KEYS.ENTER || event.key === KEYS.SPACE)) {
      event.preventDefault();
      const currentElement = elements[currentIndex];
      if (currentElement) {
        currentElement.click();
      }
      return;
    }

    // Handle escape
    if (enableEscape && event.key === KEYS.ESCAPE) {
      event.preventDefault();
      // Custom escape handler can be passed via options
      return;
    }

    // Handle arrow navigation
    const newIndex = handleArrowNavigation(elements, currentIndex, event.key, options);
    if (newIndex !== currentIndex) {
      event.preventDefault();
      setCurrentIndex(newIndex);
    }
  };
}

/**
 * Add focus-visible polyfill behavior for better keyboard focus indicators
 */
export function enhanceFocusVisibility(element: HTMLElement): void {
  let hadKeyboardEvent = false;
  
  const keydownHandler = (event: KeyboardEvent) => {
    if (event.key === KEYS.TAB || event.key.startsWith('Arrow')) {
      hadKeyboardEvent = true;
    }
  };

  const focusHandler = () => {
    if (hadKeyboardEvent) {
      element.classList.add('focus-visible');
    }
    hadKeyboardEvent = false;
  };

  const blurHandler = () => {
    element.classList.remove('focus-visible');
  };

  document.addEventListener('keydown', keydownHandler);
  element.addEventListener('focus', focusHandler);
  element.addEventListener('blur', blurHandler);

  // Return cleanup function
  return () => {
    document.removeEventListener('keydown', keydownHandler);
    element.removeEventListener('focus', focusHandler);
    element.removeEventListener('blur', blurHandler);
  };
}

/**
 * Set up roving tabindex for a group of elements
 * This allows arrow key navigation while maintaining a single tab stop
 */
export function setupRovingTabindex(
  elements: HTMLElement[],
  initialIndex: number = 0
): {
  setActiveIndex: (index: number) => void;
  cleanup: () => void;
} {
  let activeIndex = initialIndex;

  const setActiveIndex = (index: number) => {
    if (index < 0 || index >= elements.length) return;
    
    // Remove tabindex from all elements
    elements.forEach(element => {
      element.setAttribute('tabindex', '-1');
    });
    
    // Set tabindex=0 for the active element
    elements[index].setAttribute('tabindex', '0');
    activeIndex = index;
  };

  // Initialize
  setActiveIndex(initialIndex);

  const cleanup = () => {
    elements.forEach(element => {
      element.removeAttribute('tabindex');
    });
  };

  return { setActiveIndex, cleanup };
}

/**
 * Announce text to screen readers
 */
export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;

  document.body.appendChild(announcement);

  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}