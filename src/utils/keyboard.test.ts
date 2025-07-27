import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  KEYS,
  isFocusable,
  getFocusableElements,
  trapFocus,
  handleArrowNavigation,
  createKeyboardNavigationHandler,
  setupRovingTabindex,
  announceToScreenReader,
} from './keyboard';

describe('Keyboard Utilities', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  describe('KEYS constant', () => {
    it('should have all expected key values', () => {
      expect(KEYS.TAB).toBe('Tab');
      expect(KEYS.ENTER).toBe('Enter');
      expect(KEYS.SPACE).toBe(' ');
      expect(KEYS.ESCAPE).toBe('Escape');
      expect(KEYS.ARROW_UP).toBe('ArrowUp');
      expect(KEYS.ARROW_DOWN).toBe('ArrowDown');
      expect(KEYS.ARROW_LEFT).toBe('ArrowLeft');
      expect(KEYS.ARROW_RIGHT).toBe('ArrowRight');
      expect(KEYS.HOME).toBe('Home');
      expect(KEYS.END).toBe('End');
    });
  });

  describe('isFocusable', () => {
    it('should identify focusable elements', () => {
      const button = document.createElement('button');
      const link = document.createElement('a');
      link.href = '#';
      const input = document.createElement('input');
      const div = document.createElement('div');

      expect(isFocusable(button)).toBe(true);
      expect(isFocusable(link)).toBe(true);
      expect(isFocusable(input)).toBe(true);
      expect(isFocusable(div)).toBe(false);
    });

    it('should not consider disabled elements focusable', () => {
      const button = document.createElement('button');
      button.disabled = true;
      expect(isFocusable(button)).toBe(false);
    });

    it('should not consider aria-hidden elements focusable', () => {
      const button = document.createElement('button');
      button.setAttribute('aria-hidden', 'true');
      expect(isFocusable(button)).toBe(false);
    });

    it('should consider elements with tabindex focusable', () => {
      const div = document.createElement('div');
      div.setAttribute('tabindex', '0');
      expect(isFocusable(div)).toBe(true);

      const divNegative = document.createElement('div');
      divNegative.setAttribute('tabindex', '-1');
      expect(isFocusable(divNegative)).toBe(false);
    });
  });

  describe('getFocusableElements', () => {
    it('should find all focusable elements in a container', () => {
      const container = document.createElement('div');
      container.innerHTML = `
        <button>Button 1</button>
        <a href="#">Link</a>
        <input type="text" />
        <button disabled>Disabled Button</button>
        <div>Not focusable</div>
        <button>Button 2</button>
      `;

      const focusableElements = getFocusableElements(container);
      expect(focusableElements).toHaveLength(4); // button, link, input, button2
    });

    it('should exclude aria-hidden elements', () => {
      const container = document.createElement('div');
      container.innerHTML = `
        <button>Visible Button</button>
        <button aria-hidden="true">Hidden Button</button>
      `;

      const focusableElements = getFocusableElements(container);
      expect(focusableElements).toHaveLength(1);
    });
  });

  describe('trapFocus', () => {
    it('should trap focus on Tab key', () => {
      const container = document.createElement('div');
      container.innerHTML = `
        <button id="first">First</button>
        <button id="second">Second</button>
        <button id="last">Last</button>
      `;
      document.body.appendChild(container);

      const firstButton = container.querySelector('#first') as HTMLElement;
      const lastButton = container.querySelector('#last') as HTMLElement;

      // Mock focus methods
      const firstFocus = vi.fn();
      const lastFocus = vi.fn();
      firstButton.focus = firstFocus;
      lastButton.focus = lastFocus;

      // Test Tab from last element
      Object.defineProperty(document, 'activeElement', {
        value: lastButton,
        configurable: true,
      });

      const tabEvent = new KeyboardEvent('keydown', { key: 'Tab' });
      const preventDefaultSpy = vi.spyOn(tabEvent, 'preventDefault');

      trapFocus(container, tabEvent);

      expect(preventDefaultSpy).toHaveBeenCalled();
      expect(firstFocus).toHaveBeenCalled();
    });

    it('should trap focus on Shift+Tab key', () => {
      const container = document.createElement('div');
      container.innerHTML = `
        <button id="first">First</button>
        <button id="second">Second</button>
        <button id="last">Last</button>
      `;
      document.body.appendChild(container);

      const firstButton = container.querySelector('#first') as HTMLElement;
      const lastButton = container.querySelector('#last') as HTMLElement;

      // Mock focus methods
      const lastFocus = vi.fn();
      lastButton.focus = lastFocus;

      // Test Shift+Tab from first element
      Object.defineProperty(document, 'activeElement', {
        value: firstButton,
        configurable: true,
      });

      const shiftTabEvent = new KeyboardEvent('keydown', { 
        key: 'Tab', 
        shiftKey: true 
      });
      const preventDefaultSpy = vi.spyOn(shiftTabEvent, 'preventDefault');

      trapFocus(container, shiftTabEvent);

      expect(preventDefaultSpy).toHaveBeenCalled();
      expect(lastFocus).toHaveBeenCalled();
    });
  });

  describe('handleArrowNavigation', () => {
    let elements: HTMLElement[];

    beforeEach(() => {
      elements = [
        document.createElement('button'),
        document.createElement('button'),
        document.createElement('button'),
      ];
      
      elements.forEach((el, index) => {
        el.focus = vi.fn();
        el.id = `button-${index}`;
      });
    });

    it('should navigate down with ArrowDown', () => {
      const newIndex = handleArrowNavigation(elements, 0, KEYS.ARROW_DOWN);
      expect(newIndex).toBe(1);
      expect(elements[1].focus).toHaveBeenCalled();
    });

    it('should navigate up with ArrowUp', () => {
      const newIndex = handleArrowNavigation(elements, 1, KEYS.ARROW_UP);
      expect(newIndex).toBe(0);
      expect(elements[0].focus).toHaveBeenCalled();
    });

    it('should wrap around when enabled', () => {
      const newIndex = handleArrowNavigation(elements, 2, KEYS.ARROW_DOWN, { wrap: true });
      expect(newIndex).toBe(0);
      expect(elements[0].focus).toHaveBeenCalled();
    });

    it('should not wrap around when disabled', () => {
      const newIndex = handleArrowNavigation(elements, 2, KEYS.ARROW_DOWN, { wrap: false });
      expect(newIndex).toBe(2);
    });

    it('should handle Home and End keys', () => {
      let newIndex = handleArrowNavigation(elements, 1, KEYS.HOME, { enableHomeEnd: true });
      expect(newIndex).toBe(0);
      expect(elements[0].focus).toHaveBeenCalled();

      newIndex = handleArrowNavigation(elements, 1, KEYS.END, { enableHomeEnd: true });
      expect(newIndex).toBe(2);
      expect(elements[2].focus).toHaveBeenCalled();
    });
  });

  describe('createKeyboardNavigationHandler', () => {
    it('should create a handler that manages keyboard navigation', () => {
      const elements = [
        document.createElement('button'),
        document.createElement('button'),
      ];
      
      elements.forEach(el => {
        el.click = vi.fn();
        el.focus = vi.fn();
      });

      let currentIndex = 0;
      const setCurrentIndex = vi.fn((index) => { currentIndex = index; });

      const handler = createKeyboardNavigationHandler(
        () => elements,
        () => currentIndex,
        setCurrentIndex
      );

      // Test Enter key activation
      const enterEvent = new KeyboardEvent('keydown', { key: KEYS.ENTER });
      const preventDefaultSpy = vi.spyOn(enterEvent, 'preventDefault');
      
      handler(enterEvent);
      
      expect(preventDefaultSpy).toHaveBeenCalled();
      expect(elements[0].click).toHaveBeenCalled();
    });
  });

  describe('setupRovingTabindex', () => {
    it('should set up roving tabindex correctly', () => {
      const elements = [
        document.createElement('button'),
        document.createElement('button'),
        document.createElement('button'),
      ];

      const { setActiveIndex, cleanup } = setupRovingTabindex(elements, 1);

      // Check initial state
      expect(elements[0].getAttribute('tabindex')).toBe('-1');
      expect(elements[1].getAttribute('tabindex')).toBe('0');
      expect(elements[2].getAttribute('tabindex')).toBe('-1');

      // Test changing active index
      setActiveIndex(2);
      expect(elements[0].getAttribute('tabindex')).toBe('-1');
      expect(elements[1].getAttribute('tabindex')).toBe('-1');
      expect(elements[2].getAttribute('tabindex')).toBe('0');

      // Test cleanup
      cleanup();
      elements.forEach(element => {
        expect(element.hasAttribute('tabindex')).toBe(false);
      });
    });
  });

  describe('announceToScreenReader', () => {
    it('should create and remove announcement element', () => {
      vi.useFakeTimers();

      announceToScreenReader('Test announcement');

      const announcement = document.querySelector('[aria-live]');
      expect(announcement).toBeInTheDocument();
      expect(announcement?.textContent).toBe('Test announcement');
      expect(announcement?.getAttribute('aria-live')).toBe('polite');

      // Fast-forward time
      vi.advanceTimersByTime(1000);

      expect(document.querySelector('[aria-live]')).not.toBeInTheDocument();

      vi.useRealTimers();
    });

    it('should support assertive priority', () => {
      announceToScreenReader('Urgent announcement', 'assertive');

      const announcement = document.querySelector('[aria-live]');
      expect(announcement?.getAttribute('aria-live')).toBe('assertive');
    });
  });
});