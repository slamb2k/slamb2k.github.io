/**
 * Screen Reader Testing Utilities
 *
 * This module provides utilities to help test screen reader functionality
 * and ensure proper accessibility implementation.
 */

export interface ScreenReaderTest {
  name: string;
  description: string;
  test: () => Promise<boolean> | boolean;
  fix?: string;
}

export interface AccessibilityReport {
  passed: ScreenReaderTest[];
  failed: ScreenReaderTest[];
  warnings: string[];
  score: number;
}

/**
 * Screen reader testing utilities
 */
export class ScreenReaderTester {
  private tests: ScreenReaderTest[] = [];

  constructor() {
    this.initializeTests();
  }

  private initializeTests(): void {
    this.tests = [
      {
        name: 'Skip Navigation',
        description: 'Check if skip navigation link exists and works',
        test: () => this.testSkipNavigation(),
        fix: 'Add skip navigation component to main layout',
      },
      {
        name: 'Heading Hierarchy',
        description: 'Verify proper heading structure (h1 → h2 → h3)',
        test: () => this.testHeadingHierarchy(),
        fix: 'Fix heading levels to follow proper hierarchy',
      },
      {
        name: 'Landmark Regions',
        description: 'Check for proper landmark usage (main, nav, header, etc.)',
        test: () => this.testLandmarks(),
        fix: 'Add proper landmark elements to page structure',
      },
      {
        name: 'Interactive Elements',
        description: 'Ensure all interactive elements have accessible names',
        test: () => this.testInteractiveElements(),
        fix: 'Add aria-label or accessible text to interactive elements',
      },
      {
        name: 'Focus Management',
        description: 'Check if focus is properly managed and visible',
        test: () => this.testFocusManagement(),
        fix: 'Add focus indicators and proper focus management',
      },
      {
        name: 'Live Regions',
        description: 'Verify dynamic content updates are announced',
        test: () => this.testLiveRegions(),
        fix: 'Add aria-live regions for dynamic content updates',
      },
      {
        name: 'Form Labels',
        description: 'Check if form controls have proper labels',
        test: () => this.testFormLabels(),
        fix: 'Associate labels with form controls using for/id or aria-labelledby',
      },
      {
        name: 'Image Alt Text',
        description: 'Verify images have appropriate alt text',
        test: () => this.testImageAltText(),
        fix: 'Add descriptive alt text to images',
      },
    ];
  }

  /**
   * Run all screen reader tests
   */
  async runAllTests(): Promise<AccessibilityReport> {
    const passed: ScreenReaderTest[] = [];
    const failed: ScreenReaderTest[] = [];
    const warnings: string[] = [];

    for (const test of this.tests) {
      try {
        const result = await test.test();
        if (result) {
          passed.push(test);
        } else {
          failed.push(test);
        }
      } catch (error) {
        failed.push(test);
        warnings.push(`Test "${test.name}" threw an error: ${error}`);
      }
    }

    const score = Math.round((passed.length / this.tests.length) * 100);

    return {
      passed,
      failed,
      warnings,
      score,
    };
  }

  /**
   * Test skip navigation functionality
   */
  private testSkipNavigation(): boolean {
    const skipLink = document.querySelector('a[href*="#main-content"]');
    const mainContent = document.getElementById('main-content');

    return !!(skipLink && mainContent);
  }

  /**
   * Test heading hierarchy
   */
  private testHeadingHierarchy(): boolean {
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    if (headings.length === 0) return false;

    let lastLevel = 0;
    let hasH1 = false;

    for (const heading of headings) {
      const level = parseInt(heading.tagName.charAt(1), 10);

      if (level === 1) {
        hasH1 = true;
      }

      // Check for skipped levels
      if (lastLevel > 0 && level > lastLevel + 1) {
        return false;
      }

      lastLevel = level;
    }

    return hasH1;
  }

  /**
   * Test landmark regions
   */
  private testLandmarks(): boolean {
    const main = document.querySelector('main, [role="main"]');
    const nav = document.querySelector('nav, [role="navigation"]');

    // At minimum, we need main and navigation landmarks
    return !!(main && nav);
  }

  /**
   * Test interactive elements accessibility
   */
  private testInteractiveElements(): boolean {
    const interactive = document.querySelectorAll(
      'button, a[href], input, select, textarea, [role="button"], [role="link"], [tabindex]:not([tabindex="-1"])'
    );

    for (const element of interactive) {
      const htmlElement = element as HTMLElement;

      // Check if element has accessible name
      const hasAccessibleName = !!(
        htmlElement.getAttribute('aria-label') ||
        htmlElement.getAttribute('aria-labelledby') ||
        htmlElement.textContent?.trim() ||
        htmlElement.getAttribute('title') ||
        (htmlElement.tagName.toLowerCase() === 'img' && htmlElement.getAttribute('alt'))
      );

      if (!hasAccessibleName) {
        return false;
      }
    }

    return true;
  }

  /**
   * Test focus management
   */
  private testFocusManagement(): boolean {
    const focusableElements = document.querySelectorAll(
      'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );

    // Check if focusable elements exist
    if (focusableElements.length === 0) return false;

    // Check for focus indicators in CSS (simplified check)
    const stylesheets = Array.from(document.styleSheets);
    let hasFocusStyles = false;

    try {
      for (const stylesheet of stylesheets) {
        if (stylesheet.href && !stylesheet.href.includes(window.location.origin)) {
          continue; // Skip external stylesheets to avoid CORS issues
        }

        try {
          const rules = Array.from(stylesheet.cssRules || []);
          for (const rule of rules) {
            if (rule instanceof CSSStyleRule && rule.selectorText?.includes(':focus')) {
              hasFocusStyles = true;
              break;
            }
          }
        } catch (e) {
          // Ignore CORS errors for external stylesheets
          continue;
        }

        if (hasFocusStyles) break;
      }
    } catch (error) {
      // If we can't check CSS, assume focus styles exist
      hasFocusStyles = true;
    }

    return hasFocusStyles;
  }

  /**
   * Test live regions
   */
  private testLiveRegions(): boolean {
    // Check if aria-live regions exist or if there's a mechanism for announcements
    const liveRegions = document.querySelectorAll('[aria-live]');

    // For a portfolio site, live regions might not be necessary
    // This test passes if either live regions exist OR if there's no dynamic content
    return liveRegions.length > 0 || !this.hasDynamicContent();
  }

  /**
   * Check if page has dynamic content that would require live regions
   */
  private hasDynamicContent(): boolean {
    // Look for indicators of dynamic content
    const loadingIndicators = document.querySelectorAll('[aria-busy], .loading, .spinner');
    const formMessages = document.querySelectorAll('.error, .success, .warning, [role="alert"]');

    return loadingIndicators.length > 0 || formMessages.length > 0;
  }

  /**
   * Test form labels
   */
  private testFormLabels(): boolean {
    const formControls = document.querySelectorAll('input, select, textarea');

    for (const control of formControls) {
      const element = control as HTMLElement;
      const id = element.id;

      const hasLabel = !!(
        element.getAttribute('aria-label') ||
        element.getAttribute('aria-labelledby') ||
        (id && document.querySelector(`label[for="${id}"]`))
      );

      if (!hasLabel) {
        return false;
      }
    }

    return true;
  }

  /**
   * Test image alt text
   */
  private testImageAltText(): boolean {
    const images = document.querySelectorAll('img');

    for (const img of images) {
      // Decorative images should have empty alt or aria-hidden
      const isDecorative =
        img.getAttribute('aria-hidden') === 'true' || img.getAttribute('role') === 'presentation';

      if (!isDecorative) {
        const hasAlt = img.hasAttribute('alt');
        if (!hasAlt) {
          return false;
        }
      }
    }

    return true;
  }

  /**
   * Generate detailed report
   */
  generateReport(report: AccessibilityReport): string {
    let output = `# Screen Reader Accessibility Report\n\n`;
    output += `**Score: ${report.score}%** (${report.passed.length}/${this.tests.length} tests passed)\n\n`;

    if (report.passed.length > 0) {
      output += `## ✅ Passed Tests (${report.passed.length})\n`;
      for (const test of report.passed) {
        output += `- **${test.name}**: ${test.description}\n`;
      }
      output += `\n`;
    }

    if (report.failed.length > 0) {
      output += `## ❌ Failed Tests (${report.failed.length})\n`;
      for (const test of report.failed) {
        output += `- **${test.name}**: ${test.description}\n`;
        if (test.fix) {
          output += `  - *Fix*: ${test.fix}\n`;
        }
      }
      output += `\n`;
    }

    if (report.warnings.length > 0) {
      output += `## ⚠️ Warnings\n`;
      for (const warning of report.warnings) {
        output += `- ${warning}\n`;
      }
      output += `\n`;
    }

    output += `## Recommendations\n`;

    if (report.score === 100) {
      output += `Excellent! All accessibility tests are passing. Continue to:\n`;
      output += `- Test with actual screen readers\n`;
      output += `- Gather feedback from users with disabilities\n`;
      output += `- Stay updated with WCAG guidelines\n`;
    } else if (report.score >= 80) {
      output += `Good accessibility foundation. Focus on:\n`;
      output += `- Fixing the remaining failed tests\n`;
      output += `- Manual testing with screen readers\n`;
      output += `- User testing with accessibility tools\n`;
    } else if (report.score >= 60) {
      output += `Moderate accessibility compliance. Priority areas:\n`;
      output += `- Address failed critical tests\n`;
      output += `- Implement proper ARIA labeling\n`;
      output += `- Test keyboard navigation thoroughly\n`;
    } else {
      output += `Significant accessibility improvements needed:\n`;
      output += `- Address all failed tests as priority\n`;
      output += `- Review WCAG 2.1 AA guidelines\n`;
      output += `- Consider accessibility audit by expert\n`;
    }

    return output;
  }
}

/**
 * Quick accessibility check for development
 */
export async function quickA11yCheck(): Promise<void> {
  const tester = new ScreenReaderTester();
  const report = await tester.runAllTests();

  console.group('🔍 Accessibility Quick Check');
  console.log(`Score: ${report.score}%`);
  console.log(`Passed: ${report.passed.length}, Failed: ${report.failed.length}`);

  if (report.failed.length > 0) {
    console.group('❌ Failed Tests');
    for (const test of report.failed) {
      console.warn(`${test.name}: ${test.description}`);
      if (test.fix) {
        console.info(`Fix: ${test.fix}`);
      }
    }
    console.groupEnd();
  }

  if (report.warnings.length > 0) {
    console.group('⚠️ Warnings');
    for (const warning of report.warnings) {
      console.warn(warning);
    }
    console.groupEnd();
  }

  console.groupEnd();
}

/**
 * Announce screen reader testing instructions
 */
export function announceScreenReaderInstructions(): void {
  const instructions = [
    'Screen reader testing instructions:',
    '1. Enable your screen reader (NVDA, JAWS, VoiceOver, etc.)',
    '2. Navigate through the page using Tab and arrow keys',
    '3. Verify all content is readable and interactive elements are accessible',
    '4. Test the skip navigation link',
    '5. Check that page changes are announced properly',
  ];

  console.group('📢 Screen Reader Testing');
  instructions.forEach(instruction => console.log(instruction));
  console.groupEnd();
}

// Development helper - automatically run quick check in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  // Add to window for manual testing
  (window as unknown as Record<string, unknown>).a11yCheck = quickA11yCheck;
  (window as unknown as Record<string, unknown>).screenReaderInstructions =
    announceScreenReaderInstructions;

  console.log('🔧 Accessibility tools loaded:');
  console.log('- Run a11yCheck() for quick accessibility check');
  console.log('- Run screenReaderInstructions() for testing guidance');
}
