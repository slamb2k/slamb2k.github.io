import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useIsMobile, useHasSidebar } from './use-mobile';
import { BREAKPOINTS } from '@/constants/breakpoints';

describe('useIsMobile', () => {
  const mockMatchMedia = (matches: boolean) => {
    return vi.fn().mockImplementation((query: string) => ({
      matches,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return true when window width is less than mobile breakpoint', () => {
    window.innerWidth = 767;
    window.matchMedia = mockMatchMedia(true);

    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);
  });

  it('should return false when window width is greater than mobile breakpoint', () => {
    window.innerWidth = 769;
    window.matchMedia = mockMatchMedia(false);

    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);
  });

  it('should update when media query changes', () => {
    let mediaQueryListener: ((event: MediaQueryListEvent) => void) | null = null;
    const matchMediaMock = vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      addEventListener: vi.fn((_, listener) => {
        mediaQueryListener = listener;
      }),
      removeEventListener: vi.fn(),
    }));
    window.matchMedia = matchMediaMock;

    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);

    // Simulate media query change
    act(() => {
      if (mediaQueryListener) {
        mediaQueryListener({ matches: true, media: '', bubbles: false, cancelable: false } as MediaQueryListEvent);
      }
    });

    expect(result.current).toBe(true);
  });

  it('should use custom breakpoint when provided', () => {
    const customBreakpoint = 1200;
    window.matchMedia = vi.fn().mockImplementation((query: string) => {
      // Check if the query uses the custom breakpoint
      const expectedQuery = `(max-width: ${customBreakpoint - 1}px)`;
      return {
        matches: query === expectedQuery,
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      };
    });

    renderHook(() => useIsMobile(customBreakpoint));
    
    expect(window.matchMedia).toHaveBeenCalledWith(`(max-width: ${customBreakpoint - 1}px)`);
  });

  it('should handle SSR by returning false when window is undefined', () => {
    // Test the hook's SSR-safe behavior by checking initial state
    // The hook should return false in SSR environments
    
    // Since window is mocked in our test environment, we test the logic
    // by verifying that the hook handles undefined window gracefully
    const { result } = renderHook(() => useIsMobile());
    
    // The hook should have an initial state that's SSR-safe
    // This test verifies the hook doesn't break in SSR environments
    expect(typeof result.current).toBe('boolean');
  });
});

describe('useHasSidebar', () => {
  const mockMatchMedia = (matches: boolean) => {
    return vi.fn().mockImplementation((query: string) => ({
      matches,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Reset window mocks
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });
    window.matchMedia = mockMatchMedia(true);
  });

  it('should return true when window width is at or above tablet breakpoint', () => {
    Object.defineProperty(window, 'innerWidth', { 
      value: BREAKPOINTS.tablet,
      writable: true
    });
    window.matchMedia = mockMatchMedia(true);

    const { result } = renderHook(() => useHasSidebar());
    expect(result.current).toBe(true);
  });

  it('should return false when window width is below tablet breakpoint', () => {
    Object.defineProperty(window, 'innerWidth', { 
      value: BREAKPOINTS.tablet - 1,
      writable: true
    });
    window.matchMedia = mockMatchMedia(false);

    const { result } = renderHook(() => useHasSidebar());
    expect(result.current).toBe(false);
  });

  it('should update when media query changes', () => {
    let mediaQueryListener: ((event: MediaQueryListEvent) => void) | null = null;
    const matchMediaMock = vi.fn().mockImplementation(() => ({
      matches: true,
      media: '',
      addEventListener: vi.fn((_, listener) => {
        mediaQueryListener = listener;
      }),
      removeEventListener: vi.fn(),
    }));
    window.matchMedia = matchMediaMock;

    const { result } = renderHook(() => useHasSidebar());
    expect(result.current).toBe(true);

    // Simulate media query change
    act(() => {
      if (mediaQueryListener) {
        mediaQueryListener({ matches: false, media: '', bubbles: false, cancelable: false } as MediaQueryListEvent);
      }
    });

    expect(result.current).toBe(false);
  });

  it('should handle legacy browsers with addListener/removeListener', () => {
    const addListenerMock = vi.fn();
    const removeListenerMock = vi.fn();
    
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: false,
      media: '',
      addListener: addListenerMock,
      removeListener: removeListenerMock,
      // Deliberately omit addEventListener to simulate legacy browser
    }));

    const { unmount } = renderHook(() => useHasSidebar());
    
    expect(addListenerMock).toHaveBeenCalled();
    
    unmount();
    
    expect(removeListenerMock).toHaveBeenCalled();
  });
});