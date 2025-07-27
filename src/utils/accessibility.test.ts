import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import {
  createLiveRegion,
  announce,
  LiveRegionManager,
  A11Y_MESSAGES,
  ARIA,
  createSROnlyText,
  isVisibleToScreenReader,
  FocusManager,
  A11yTest,
} from './accessibility';

describe('Accessibility Utilities', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  afterEach(() => {
    // Clean up any live regions
    const liveRegions = document.querySelectorAll('[aria-live]');
    liveRegions.forEach(region => region.remove());
  });

  describe('createLiveRegion', () => {
    it('should create a live region with correct attributes', () => {
      const liveRegion = createLiveRegion('polite', 'test-region');
      
      expect(liveRegion.getAttribute('aria-live')).toBe('polite');
      expect(liveRegion.getAttribute('aria-atomic')).toBe('true');
      expect(liveRegion.className).toBe('sr-only');
      expect(liveRegion.id).toBe('test-region');
      expect(document.body.contains(liveRegion)).toBe(true);
    });

    it('should create assertive live region', () => {
      const liveRegion = createLiveRegion('assertive');
      expect(liveRegion.getAttribute('aria-live')).toBe('assertive');
    });
  });

  describe('announce', () => {
    it('should create and remove announcement', () => {
      vi.useFakeTimers();
      
      announce('Test announcement');
      
      const liveRegion = document.querySelector('[aria-live]');
      expect(liveRegion).toBeInTheDocument();
      expect(liveRegion?.textContent).toBe('Test announcement');
      
      vi.advanceTimersByTime(1000);
      
      expect(document.querySelector('[aria-live]')).not.toBeInTheDocument();
      
      vi.useRealTimers();
    });
  });

  describe('LiveRegionManager', () => {
    let manager: LiveRegionManager;

    beforeEach(() => {
      manager = new LiveRegionManager();
    });

    afterEach(() => {
      manager.destroy();
    });

    it('should create persistent live region', () => {
      const liveRegion = document.getElementById('live-region-manager');
      expect(liveRegion).toBeInTheDocument();
      expect(liveRegion?.getAttribute('aria-live')).toBe('polite');
    });

    it('should announce messages', () => {
      manager.announce('Test message');
      
      const liveRegion = document.getElementById('live-region-manager');
      expect(liveRegion?.textContent).toBe('Test message');
    });

    it('should clear messages', () => {
      manager.announce('Test message');
      manager.clear();
      
      const liveRegion = document.getElementById('live-region-manager');
      expect(liveRegion?.textContent).toBe('');
    });

    it('should auto-clear after timeout', () => {
      vi.useFakeTimers();
      
      manager.announce('Test message', 500);
      
      const liveRegion = document.getElementById('live-region-manager');
      expect(liveRegion?.textContent).toBe('Test message');
      
      vi.advanceTimersByTime(500);
      expect(liveRegion?.textContent).toBe('');
      
      vi.useRealTimers();
    });
  });

  describe('A11Y_MESSAGES', () => {
    it('should provide navigation messages', () => {
      expect(A11Y_MESSAGES.NAVIGATION.PAGE_LOADED('Home')).toBe('Home page loaded');
      expect(A11Y_MESSAGES.NAVIGATION.SECTION_CHANGED('About')).toBe('Navigated to About section');
    });

    it('should provide form messages', () => {
      expect(A11Y_MESSAGES.FORMS.FIELD_REQUIRED('Email')).toBe('Email is required');
      expect(A11Y_MESSAGES.FORMS.VALIDATION_ERROR(2)).toBe('Form has 2 validation errors');
      expect(A11Y_MESSAGES.FORMS.VALIDATION_ERROR(1)).toBe('Form has 1 validation error');
    });
  });

  describe('ARIA', () => {
    it('should create controls button attributes', () => {
      const attrs = ARIA.controlsButton('menu', true, 'menu');
      
      expect(attrs).toEqual({
        'aria-controls': 'menu',
        'aria-expanded': true,
        'aria-haspopup': 'menu',
      });
    });

    it('should create option attributes', () => {
      const attrs = ARIA.option(true, false);
      
      expect(attrs).toEqual({
        'role': 'option',
        'aria-selected': true,
      });
    });

    it('should create tab attributes', () => {
      const attrs = ARIA.tab(true, 'panel-1');
      
      expect(attrs).toEqual({
        'role': 'tab',
        'aria-selected': true,
        'aria-controls': 'panel-1',
        'tabIndex': 0,
      });
    });

    it('should create dialog attributes', () => {
      const attrs = ARIA.dialog('dialog-title', 'dialog-desc');
      
      expect(attrs).toEqual({
        'role': 'dialog',
        'aria-modal': 'true',
        'aria-labelledby': 'dialog-title',
        'aria-describedby': 'dialog-desc',
      });
    });

    it('should create progress bar attributes', () => {
      const attrs = ARIA.progressBar(50, 100, 'Loading');
      
      expect(attrs).toEqual({
        'role': 'progressbar',
        'aria-valuenow': 50,
        'aria-valuemin': 0,
        'aria-valuemax': 100,
        'aria-valuetext': '50%',
        'aria-label': 'Loading',
      });
    });
  });

  describe('createSROnlyText', () => {
    it('should create screen reader only text', () => {
      const element = createSROnlyText('Screen reader text');
      
      expect(element.tagName).toBe('SPAN');
      expect(element.className).toBe('sr-only');
      expect(element.textContent).toBe('Screen reader text');
    });
  });

  describe('isVisibleToScreenReader', () => {
    it('should detect aria-hidden elements', () => {
      const element = document.createElement('div');
      element.setAttribute('aria-hidden', 'true');
      document.body.appendChild(element);
      
      expect(isVisibleToScreenReader(element)).toBe(false);
    });

    it('should detect visible elements', () => {
      const element = document.createElement('div');
      element.textContent = 'Visible content';
      document.body.appendChild(element);
      
      // Mock offsetParent
      Object.defineProperty(element, 'offsetParent', {
        value: document.body,
        configurable: true,
      });
      
      expect(isVisibleToScreenReader(element)).toBe(true);
    });
  });

  describe('FocusManager', () => {
    it('should save and restore focus', () => {
      const button = document.createElement('button');
      button.textContent = 'Test Button';
      document.body.appendChild(button);
      
      button.focus();
      const restoreFocus = FocusManager.saveFocus();
      
      document.body.focus();
      expect(document.activeElement).toBe(document.body);
      
      restoreFocus();
      expect(document.activeElement).toBe(button);
    });

    it('should focus first focusable element', () => {
      const container = document.createElement('div');
      container.innerHTML = `
        <div>Not focusable</div>
        <button>First focusable</button>
        <input type="text" />
      `;
      document.body.appendChild(container);
      
      const button = container.querySelector('button') as HTMLElement;
      button.focus = vi.fn();
      
      const success = FocusManager.focusFirst(container);
      
      expect(success).toBe(true);
      expect(button.focus).toHaveBeenCalled();
    });

    it('should handle focus with fallback', () => {
      const primary = document.createElement('button');
      const fallback = document.createElement('button');
      
      primary.focus = vi.fn();
      fallback.focus = vi.fn();
      
      FocusManager.focusWithFallback(primary, fallback);
      expect(primary.focus).toHaveBeenCalled();
      expect(fallback.focus).not.toHaveBeenCalled();
      
      FocusManager.focusWithFallback(null, fallback);
      expect(fallback.focus).toHaveBeenCalled();
    });
  });

  describe('A11yTest', () => {
    it('should check if element has accessible name', () => {
      const button1 = document.createElement('button');
      button1.setAttribute('aria-label', 'Close dialog');
      
      const button2 = document.createElement('button');
      button2.textContent = 'Click me';
      
      const button3 = document.createElement('button');
      
      expect(A11yTest.hasAccessibleName(button1)).toBe(true);
      expect(A11yTest.hasAccessibleName(button2)).toBe(true);
      expect(A11yTest.hasAccessibleName(button3)).toBe(false);
    });

    it('should check heading hierarchy', () => {
      const container = document.createElement('div');
      container.innerHTML = `
        <h2>Wrong first heading</h2>
        <h4>Skipped h3</h4>
      `;
      
      const issues = A11yTest.checkHeadingHierarchy(container);
      
      expect(issues).toContain('First heading should be h1');
      expect(issues).toContain('Heading level skipped: found h4 after h2');
    });

    it('should check form labels', () => {
      const container = document.createElement('div');
      container.innerHTML = `
        <input type="text" id="name" />
        <label for="name">Name</label>
        <input type="email" />
      `;
      
      const issues = A11yTest.checkFormLabels(container);
      
      expect(issues).toHaveLength(1);
      expect(issues[0]).toContain('Form control without label: input');
    });
  });
});