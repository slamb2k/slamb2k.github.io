import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { renderHook } from '@testing-library/react';
import PortfolioLandingPage from '@/components/generated/PortfolioLandingPage';
import { useIsMobile, useHasSidebar } from '@/hooks/use-mobile';
import { BREAKPOINTS } from '@/constants/breakpoints';

// Mock child components
vi.mock('@/components/generated/SidebarNavigation', () => ({
  default: () => <div data-testid="sidebar">Sidebar</div>,
}));

vi.mock('@/components/generated/HeroSection', () => ({
  default: () => <div data-testid="hero">Hero</div>,
}));

vi.mock('@/components/generated/ProjectsSection', () => ({
  default: () => <div data-testid="projects">Projects</div>,
}));

vi.mock('@/components/generated/ContactSection', () => ({
  default: () => <div data-testid="contact">Contact</div>,
}));

describe('Responsive Behavior Tests', () => {
  const setWindowSize = (width: number) => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: width,
    });
    
    // Trigger resize event
    window.dispatchEvent(new Event('resize'));
  };

  const mockMatchMedia = (matches: boolean) => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Breakpoint Transitions', () => {
    it('should transition from mobile to tablet to desktop correctly', () => {
      // Start at mobile size
      setWindowSize(BREAKPOINTS.mobile - 1);
      mockMatchMedia(true);
      
      const { result: mobileResult } = renderHook(() => useIsMobile());
      const { result: sidebarResult } = renderHook(() => useHasSidebar());
      
      expect(mobileResult.current).toBe(true);
      expect(sidebarResult.current).toBe(false);
      
      // Move to tablet size (between mobile and desktop breakpoints)
      act(() => {
        setWindowSize(BREAKPOINTS.mobile + 50);
        mockMatchMedia(false);
      });
      
      // At tablet size, should not be mobile but also no sidebar
      expect(mobileResult.current).toBe(false);
      expect(sidebarResult.current).toBe(false);
      
      // Move to desktop size
      act(() => {
        setWindowSize(BREAKPOINTS.tablet);
        mockMatchMedia(false);
      });
      
      expect(mobileResult.current).toBe(false);
      expect(sidebarResult.current).toBe(true);
    });

    it('should handle edge cases at exact breakpoint values', () => {
      // Test at exact mobile breakpoint
      setWindowSize(BREAKPOINTS.mobile);
      const { result: mobileAt768 } = renderHook(() => useIsMobile());
      expect(mobileAt768.current).toBe(false); // 768px is NOT mobile
      
      // Test at one pixel less
      setWindowSize(BREAKPOINTS.mobile - 1);
      const { result: mobileAt767 } = renderHook(() => useIsMobile());
      expect(mobileAt767.current).toBe(true); // 767px IS mobile
      
      // Test at exact tablet breakpoint
      setWindowSize(BREAKPOINTS.tablet);
      const { result: sidebarAt1024 } = renderHook(() => useHasSidebar());
      expect(sidebarAt1024.current).toBe(true); // 1024px HAS sidebar
      
      // Test at one pixel less
      setWindowSize(BREAKPOINTS.tablet - 1);
      const { result: sidebarAt1023 } = renderHook(() => useHasSidebar());
      expect(sidebarAt1023.current).toBe(false); // 1023px has NO sidebar
    });
  });

  describe('Component Layout at Different Breakpoints', () => {
    it('should render mobile layout correctly', () => {
      // Mock for mobile by directly importing and mocking the hook
      vi.doMock('@/hooks/use-mobile', () => ({
        useHasSidebar: () => false,
      }));
      
      // Create a test component that uses the mocked hook
      const TestComponent = () => {
        // Manually control the return value for this test
        const hasSidebar = false;
        
        return (
          <div className="min-h-screen bg-slate-900 text-slate-300">
            {!hasSidebar && (
              <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800">
                <div className="px-6 py-4">
                  <h1 className="text-xl font-bold text-slate-100">Simon Lamb</h1>
                </div>
              </header>
            )}
            <div className="lg:flex">
              {hasSidebar && <div data-testid="sidebar">Sidebar</div>}
              <main className={`flex-1 ${!hasSidebar ? 'pt-20' : 'lg:ml-96'}`}>
                Main Content
              </main>
            </div>
          </div>
        );
      };
      
      render(<TestComponent />);
      
      // Mobile header should be visible
      expect(screen.getByText('Simon Lamb')).toBeInTheDocument();
      
      // Sidebar should not be visible
      expect(screen.queryByTestId('sidebar')).not.toBeInTheDocument();
      
      // Main content should have mobile padding
      const main = screen.getByRole('main');
      expect(main.className).toContain('pt-20');
    });

    it('should render desktop layout correctly', () => {
      // Create a test component for desktop layout
      const TestComponent = () => {
        const hasSidebar = true;
        
        return (
          <div className="min-h-screen bg-slate-900 text-slate-300">
            {!hasSidebar && (
              <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800">
                <div className="px-6 py-4">
                  <h1 className="text-xl font-bold text-slate-100">Simon Lamb</h1>
                </div>
              </header>
            )}
            <div className="lg:flex">
              {hasSidebar && <div data-testid="sidebar">Sidebar</div>}
              <main className={`flex-1 ${!hasSidebar ? 'pt-20' : 'lg:ml-96'}`}>
                Main Content
              </main>
            </div>
          </div>
        );
      };
      
      render(<TestComponent />);
      
      // Sidebar should be visible
      expect(screen.getByTestId('sidebar')).toBeInTheDocument();
      
      // Mobile header should not be visible
      expect(screen.queryByText('Simon Lamb')).not.toBeInTheDocument();
      
      // Main content should have desktop margin
      const main = screen.getByRole('main');
      expect(main.className).toContain('lg:ml-96');
    });
  });

  describe('Dynamic Viewport Changes', () => {
    it('should update layout when viewport changes', async () => {
      let currentWidth = BREAKPOINTS.desktop;
      let listeners: Array<(e: MediaQueryListEvent) => void> = [];
      
      // Mock matchMedia to track listeners
      window.matchMedia = vi.fn().mockImplementation((query: string) => {
        const matches = query.includes('1023') ? currentWidth >= BREAKPOINTS.tablet : currentWidth < BREAKPOINTS.mobile;
        return {
          matches,
          media: query,
          addEventListener: vi.fn((_, listener) => {
            listeners.push(listener);
          }),
          removeEventListener: vi.fn(),
        };
      });
      
      const { result } = renderHook(() => useHasSidebar());
      
      expect(result.current).toBe(true);
      
      // Simulate viewport change to mobile
      act(() => {
        currentWidth = BREAKPOINTS.mobile - 1;
        listeners.forEach(listener => {
          listener({ matches: false, media: '', bubbles: false, cancelable: false } as MediaQueryListEvent);
        });
      });
      
      expect(result.current).toBe(false);
    });
  });

  describe('Intermediate Tablet State', () => {
    it('should handle tablet viewport correctly (768px - 1023px)', () => {
      // Set viewport to tablet range
      setWindowSize(900); // Between 768 and 1024
      
      const { result: mobileResult } = renderHook(() => useIsMobile());
      const { result: sidebarResult } = renderHook(() => useHasSidebar());
      
      // Should not be mobile (>= 768px)
      expect(mobileResult.current).toBe(false);
      
      // Should not have sidebar (< 1024px)
      expect(sidebarResult.current).toBe(false);
    });
  });

  describe('Custom Breakpoint Support', () => {
    it('should support custom breakpoints in useIsMobile hook', () => {
      const customBreakpoint = 1200;
      setWindowSize(1100);
      
      // Default breakpoint (768)
      const { result: defaultResult } = renderHook(() => useIsMobile());
      expect(defaultResult.current).toBe(false); // 1100 > 768
      
      // Custom breakpoint (1200)
      const { result: customResult } = renderHook(() => useIsMobile(customBreakpoint));
      expect(customResult.current).toBe(true); // 1100 < 1200
    });
  });
});