import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to combine class names with Tailwind CSS merge support.
 *
 * This function combines clsx and tailwind-merge to provide:
 * - Conditional class name handling (via clsx)
 * - Tailwind CSS class deduplication and conflicts resolution (via tailwind-merge)
 *
 * @param inputs - Array of class values that can be strings, objects, arrays, etc.
 * @returns Merged and deduplicated class string
 *
 * @example
 * ```tsx
 * // Basic usage
 * cn('bg-red-500', 'text-white') // 'bg-red-500 text-white'
 *
 * // Conditional classes
 * cn('base-class', { 'active-class': isActive, 'disabled-class': isDisabled })
 *
 * // Tailwind conflicts resolution
 * cn('bg-red-500', 'bg-blue-500') // 'bg-blue-500' (blue wins)
 * cn('p-4', 'px-2') // 'p-4 px-2' (both applied, px-2 overrides px from p-4)
 * ```
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Ensures light mode is always used by removing the dark class from the document element.
 * This can be called from any component that needs to ensure light mode.
 */
export function ensureLightMode() {
  if (typeof document !== 'undefined') {
    // Always set dark mode to false
    document.documentElement.classList.toggle('dark', false);
  }
}

/**
 * Removes any dark mode classes from a className string
 * @param className The class string to process
 * @returns The class string with dark mode classes removed
 */
export function removeDarkClasses(className: string): string {
  return className
    .split(' ')
    .filter(cls => !cls.startsWith('dark:'))
    .join(' ');
}
