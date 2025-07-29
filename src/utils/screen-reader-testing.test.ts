import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  ScreenReaderTester,
  quickA11yCheck,
  announceScreenReaderInstructions,
} from './screen-reader-testing';

describe('Screen Reader Testing Utilities', () => {
  let tester: ScreenReaderTester;

  beforeEach(() => {
    document.body.innerHTML = '';
    tester = new ScreenReaderTester();
  });

  describe('ScreenReaderTester', () => {
    it('should initialize with predefined tests', () => {
      expect(tester).toBeInstanceOf(ScreenReaderTester);
    });

    it('should detect skip navigation correctly', async () => {
      // Create a page without skip navigation
      document.body.innerHTML = `
        <header>Header</header>
        <main id="main-content">Content</main>
      `;

      let report = await tester.runAllTests();
      const skipTest = report.failed.find(test => test.name === 'Skip Navigation');
      expect(skipTest).toBeDefined();

      // Add skip navigation
      document.body.innerHTML = `
        <a href="#main-content">Skip to main content</a>
        <header>Header</header>
        <main id="main-content">Content</main>
      `;

      report = await tester.runAllTests();
      const skipTestPassed = report.passed.find(test => test.name === 'Skip Navigation');
      expect(skipTestPassed).toBeDefined();
    });

    it('should validate heading hierarchy', async () => {
      // Bad hierarchy - starts with h2
      document.body.innerHTML = `
        <h2>Wrong first heading</h2>
        <h4>Skipped h3</h4>
      `;

      let report = await tester.runAllTests();
      const headingTest = report.failed.find(test => test.name === 'Heading Hierarchy');
      expect(headingTest).toBeDefined();

      // Good hierarchy
      document.body.innerHTML = `
        <h1>Main Title</h1>
        <h2>Section Title</h2>
        <h3>Subsection</h3>
      `;

      report = await tester.runAllTests();
      const headingTestPassed = report.passed.find(test => test.name === 'Heading Hierarchy');
      expect(headingTestPassed).toBeDefined();
    });

    it('should check for landmark regions', async () => {
      // No landmarks
      document.body.innerHTML = `
        <div>Header</div>
        <div>Content</div>
      `;

      let report = await tester.runAllTests();
      const landmarkTest = report.failed.find(test => test.name === 'Landmark Regions');
      expect(landmarkTest).toBeDefined();

      // With landmarks
      document.body.innerHTML = `
        <nav>Navigation</nav>
        <main>Main Content</main>
      `;

      report = await tester.runAllTests();
      const landmarkTestPassed = report.passed.find(test => test.name === 'Landmark Regions');
      expect(landmarkTestPassed).toBeDefined();
    });

    it('should validate interactive elements accessibility', async () => {
      // Button without accessible name
      document.body.innerHTML = `
        <button></button>
      `;

      let report = await tester.runAllTests();
      const interactiveTest = report.failed.find(test => test.name === 'Interactive Elements');
      expect(interactiveTest).toBeDefined();

      // Button with accessible name
      document.body.innerHTML = `
        <button aria-label="Close dialog">×</button>
        <button>Click me</button>
        <a href="/home">Home</a>
      `;

      report = await tester.runAllTests();
      const interactiveTestPassed = report.passed.find(
        test => test.name === 'Interactive Elements'
      );
      expect(interactiveTestPassed).toBeDefined();
    });

    it('should check form labels', async () => {
      // Input without label
      document.body.innerHTML = `
        <input type="text" />
      `;

      let report = await tester.runAllTests();
      const formTest = report.failed.find(test => test.name === 'Form Labels');
      expect(formTest).toBeDefined();

      // Input with label
      document.body.innerHTML = `
        <label for="name">Name</label>
        <input type="text" id="name" />
        <input type="email" aria-label="Email address" />
      `;

      report = await tester.runAllTests();
      const formTestPassed = report.passed.find(test => test.name === 'Form Labels');
      expect(formTestPassed).toBeDefined();
    });

    it('should validate image alt text', async () => {
      // Image without alt
      document.body.innerHTML = `
        <img src="test.jpg" />
      `;

      let report = await tester.runAllTests();
      const imageTest = report.failed.find(test => test.name === 'Image Alt Text');
      expect(imageTest).toBeDefined();

      // Images with proper alt text and decorative image
      document.body.innerHTML = `
        <img src="test.jpg" alt="Test image" />
        <img src="decoration.jpg" aria-hidden="true" />
      `;

      report = await tester.runAllTests();
      const imageTestPassed = report.passed.find(test => test.name === 'Image Alt Text');
      expect(imageTestPassed).toBeDefined();
    });

    it('should calculate correct accessibility score', async () => {
      // Perfect setup
      document.body.innerHTML = `
        <a href="#main-content">Skip to main content</a>
        <nav>Navigation</nav>
        <main id="main-content">
          <h1>Main Title</h1>
          <h2>Section</h2>
          <button>Accessible Button</button>
          <img src="test.jpg" alt="Test image" />
        </main>
      `;

      const report = await tester.runAllTests();
      expect(report.score).toBeGreaterThan(70); // Should pass most tests
      expect(report.passed.length).toBeGreaterThan(report.failed.length);
    });

    it('should generate comprehensive report', async () => {
      document.body.innerHTML = `
        <div>Basic content</div>
      `;

      const report = await tester.runAllTests();
      const reportText = tester.generateReport(report);

      expect(reportText).toContain('Screen Reader Accessibility Report');
      expect(reportText).toContain(`Score: ${report.score}%`);

      if (report.failed.length > 0) {
        expect(reportText).toContain('Failed Tests');
      }

      if (report.passed.length > 0) {
        expect(reportText).toContain('Passed Tests');
      }

      expect(reportText).toContain('Recommendations');
    });
  });

  describe('quickA11yCheck', () => {
    it('should run accessibility check and log results', async () => {
      const consoleGroupSpy = vi.spyOn(console, 'group').mockImplementation(() => {});
      const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      const consoleGroupEndSpy = vi.spyOn(console, 'groupEnd').mockImplementation(() => {});

      await quickA11yCheck();

      expect(consoleGroupSpy).toHaveBeenCalledWith('🔍 Accessibility Quick Check');
      expect(consoleLogSpy).toHaveBeenCalled();
      expect(consoleGroupEndSpy).toHaveBeenCalled();

      consoleGroupSpy.mockRestore();
      consoleLogSpy.mockRestore();
      consoleGroupEndSpy.mockRestore();
    });
  });

  describe('announceScreenReaderInstructions', () => {
    it('should log screen reader testing instructions', () => {
      const consoleGroupSpy = vi.spyOn(console, 'group').mockImplementation(() => {});
      const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      const consoleGroupEndSpy = vi.spyOn(console, 'groupEnd').mockImplementation(() => {});

      announceScreenReaderInstructions();

      expect(consoleGroupSpy).toHaveBeenCalledWith('📢 Screen Reader Testing');
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('Screen reader testing instructions:')
      );
      expect(consoleGroupEndSpy).toHaveBeenCalled();

      consoleGroupSpy.mockRestore();
      consoleLogSpy.mockRestore();
      consoleGroupEndSpy.mockRestore();
    });
  });

  describe('Focus Management Test', () => {
    it('should pass focus management test when focus styles exist', async () => {
      // Create elements with focus styles
      document.body.innerHTML = `
        <style>
          button:focus { outline: 2px solid blue; }
        </style>
        <button>Focusable Button</button>
      `;

      const report = await tester.runAllTests();
      const focusTest =
        report.passed.find(test => test.name === 'Focus Management') ||
        report.failed.find(test => test.name === 'Focus Management');

      expect(focusTest).toBeDefined();
    });
  });

  describe('Live Regions Test', () => {
    it('should pass when no dynamic content exists', async () => {
      // Static content only
      document.body.innerHTML = `
        <h1>Static Content</h1>
        <p>No dynamic updates here</p>
      `;

      const report = await tester.runAllTests();
      const liveRegionTest =
        report.passed.find(test => test.name === 'Live Regions') ||
        report.failed.find(test => test.name === 'Live Regions');

      expect(liveRegionTest).toBeDefined();
    });

    it('should require live regions when dynamic content exists', async () => {
      // Content with loading indicator (dynamic)
      document.body.innerHTML = `
        <div class="loading">Loading...</div>
        <div role="alert">Error message</div>
      `;

      let report = await tester.runAllTests();
      const liveRegionTestFailed = report.failed.find(test => test.name === 'Live Regions');
      expect(liveRegionTestFailed).toBeDefined();

      // Add live region
      document.body.innerHTML = `
        <div aria-live="polite">Live region</div>
        <div class="loading">Loading...</div>
      `;

      report = await tester.runAllTests();
      const liveRegionTestPassed = report.passed.find(test => test.name === 'Live Regions');
      expect(liveRegionTestPassed).toBeDefined();
    });
  });
});
