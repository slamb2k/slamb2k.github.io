# Accessibility Testing Guide

This guide provides comprehensive instructions for testing the accessibility of this portfolio application, with a focus on screen reader compatibility and WCAG 2.1 AA compliance.

## Quick Start Checklist

- [ ] **Keyboard Navigation**: Test all interactive elements with Tab, Enter, Space, Arrow keys
- [ ] **Screen Reader Testing**: Test with NVDA (Windows), JAWS (Windows), VoiceOver (macOS), or Orca (Linux)
- [ ] **Color Contrast**: Verify 4.5:1 minimum contrast ratio for normal text
- [ ] **Focus Management**: Ensure focus is visible and logical
- [ ] **ARIA Labels**: Check all interactive elements have accessible names
- [ ] **Automated Testing**: Run axe-core tests (`npm run test:accessibility`)

## Screen Reader Testing

### Recommended Screen Readers

#### Free Options
- **NVDA (Windows)**: [Download](https://www.nvaccess.org/download/)
- **VoiceOver (macOS)**: Built into macOS (Cmd+F5 to enable)
- **Orca (Linux)**: Usually pre-installed or available via package manager
- **ChromeVox (Chrome Extension)**: Available in Chrome Web Store

#### Commercial Options
- **JAWS (Windows)**: Industry standard, expensive but comprehensive
- **Dragon NaturallySpeaking**: Voice control software

### Screen Reader Testing Checklist

#### Page Structure
- [ ] Page has proper heading hierarchy (h1 → h2 → h3, no skips)
- [ ] Main landmarks are identified (main, nav, header, footer)
- [ ] Lists are properly marked up (ul, ol, dl)
- [ ] Tables have proper headers and captions (if applicable)

#### Navigation
- [ ] Skip link appears on first Tab press and functions correctly
- [ ] All navigation items are announced with their purpose
- [ ] Current page/section is identified
- [ ] Breadcrumbs are logical and helpful (if present)

#### Interactive Elements
- [ ] All buttons have accessible names
- [ ] Link purposes are clear from context or aria-label
- [ ] Form controls have associated labels
- [ ] Required fields are identified
- [ ] Error messages are associated with form controls

#### Dynamic Content
- [ ] Loading states are announced
- [ ] Error messages are announced
- [ ] Success messages are announced
- [ ] Content changes are communicated via live regions

#### Mobile Testing
- [ ] VoiceOver gestures work on iOS
- [ ] TalkBack works correctly on Android
- [ ] Touch exploration functions properly
- [ ] Swipe navigation is logical

## Keyboard Testing

### Essential Keyboard Shortcuts

| Action | Key(s) | Expected Behavior |
|--------|--------|-------------------|
| Navigate forward | Tab | Move to next focusable element |
| Navigate backward | Shift + Tab | Move to previous focusable element |
| Activate | Enter or Space | Activate buttons, links, form controls |
| Close/Cancel | Escape | Close modals, menus, dropdowns |
| Menu navigation | Arrow keys | Navigate within menus and lists |
| Jump to start | Home | Move to first item in list/menu |
| Jump to end | End | Move to last item in list/menu |

### Keyboard Testing Checklist

#### Basic Navigation
- [ ] All interactive elements are keyboard accessible
- [ ] Tab order is logical and intuitive
- [ ] Focus indicators are clearly visible
- [ ] No keyboard traps (can always Tab away)

#### Skip Navigation
- [ ] Skip link appears on first Tab press
- [ ] Skip link moves focus to main content area
- [ ] Multiple skip links if page has complex structure

#### Menus and Dropdowns
- [ ] Arrow keys work for menu navigation
- [ ] Enter/Space activates menu items
- [ ] Escape closes menus and returns focus
- [ ] Home/End jump to first/last items

#### Forms
- [ ] All form controls are keyboard accessible
- [ ] Error validation doesn't trap focus
- [ ] Form submission works via keyboard
- [ ] Required field indicators are keyboard accessible

## Automated Testing

### Running Accessibility Tests

```bash
# Run all accessibility tests
npm run test:accessibility

# Run tests with coverage
npm run test:coverage

# Run specific accessibility test
npm run test -- accessibility.test

# Run tests in watch mode
npm run test -- --watch accessibility
```

### Automated Testing Tools

#### 1. axe-core Integration
We use axe-core for automated accessibility testing:

```typescript
// Example usage in tests
import axeCore from 'axe-core';

async function runAxeTest(container: HTMLElement) {
  const results = await axeCore.run(container, {
    rules: {
      'color-contrast': { enabled: true },
      'keyboard-navigation': { enabled: true },
      'focus-management': { enabled: true },
    }
  });
  
  expect(results.violations).toEqual([]);
}
```

#### 2. Custom Accessibility Utilities
Located in `src/utils/accessibility.ts`:

```typescript
import { A11yTest } from '@/utils/accessibility';

// Check heading hierarchy
const headingIssues = A11yTest.checkHeadingHierarchy();

// Check form labels
const formIssues = A11yTest.checkFormLabels();

// Check accessible names
const hasName = A11yTest.hasAccessibleName(element);
```

### Browser Testing Tools

#### Chrome DevTools
1. Open DevTools (F12)
2. Go to Lighthouse tab
3. Run Accessibility audit
4. Review suggestions and errors

#### axe DevTools Extension
1. Install axe DevTools browser extension
2. Open DevTools and go to axe tab
3. Run full page scan
4. Fix reported issues

#### WAVE (Web Accessibility Evaluation Tool)
1. Visit [wave.webaim.org](https://wave.webaim.org)
2. Enter your site URL
3. Review accessibility feedback
4. Address any errors or warnings

## Testing Scenarios

### Critical User Journeys

#### 1. First-time Visitor
**As a keyboard-only user visiting for the first time:**
- [ ] Can skip navigation to main content
- [ ] Can navigate through all sections
- [ ] Can access contact information
- [ ] Can view project details

**As a screen reader user:**
- [ ] Page purpose is clear from page title
- [ ] Navigation structure is understandable
- [ ] Contact methods are accessible
- [ ] All content is readable

#### 2. Browsing Projects
**Navigation and discovery:**
- [ ] Can browse project list with keyboard
- [ ] Project details are accessible
- [ ] External links are clearly identified
- [ ] Technology tags are readable

#### 3. Contact and Social Media
**Getting in touch:**
- [ ] Email link works and is clearly labeled
- [ ] Social media links are accessible
- [ ] Contact form (if present) is fully accessible
- [ ] Success/error states are communicated

### Edge Cases
- [ ] Very long content scrolling
- [ ] Connection errors and retry mechanisms
- [ ] Empty states (no projects, etc.)
- [ ] Loading and timeout states

## Common Issues and Solutions

### Focus Management Issues

**Problem**: Focus disappears after modal closes
**Solution**: 
```typescript
const restoreFocus = FocusManager.saveFocus();
// ... modal operations
restoreFocus();
```

**Problem**: Focus trap not working in modal
**Solution**:
```typescript
import { trapFocus } from '@/utils/keyboard';

const handleKeyDown = (event: KeyboardEvent) => {
  trapFocus(modalElement, event);
};
```

### Screen Reader Issues

**Problem**: Dynamic content changes not announced
**Solution**:
```typescript
import { announce } from '@/utils/accessibility';

// Announce important changes
announce('Content loaded successfully', 'polite');

// For urgent announcements
announce('Error occurred', 'assertive');
```

**Problem**: Complex UI components not understandable
**Solution**:
- Add proper ARIA roles and properties
- Use ARIA relationships (aria-describedby, aria-labelledby)
- Provide clear instructions

### Keyboard Navigation Issues

**Problem**: Custom components not keyboard accessible
**Solution**:
```typescript
import { createKeyboardNavigationHandler } from '@/utils/keyboard';

const handleKeyDown = createKeyboardNavigationHandler(
  () => elements,
  () => currentIndex,
  setCurrentIndex,
  { enableActivation: true, enableEscape: true }
);
```

## Accessibility Checklist for Developers

### Before Development
- [ ] Review accessibility requirements
- [ ] Plan keyboard navigation patterns
- [ ] Consider screen reader experience
- [ ] Choose accessible color schemes

### During Development
- [ ] Use semantic HTML elements
- [ ] Add ARIA labels and descriptions
- [ ] Implement keyboard navigation
- [ ] Test with keyboard and screen reader
- [ ] Ensure sufficient color contrast
- [ ] Add focus indicators

### Before Deployment
- [ ] Run automated accessibility tests
- [ ] Perform manual keyboard testing
- [ ] Test with at least one screen reader
- [ ] Validate with Lighthouse or axe
- [ ] Review with accessibility checklist

### Ongoing Maintenance
- [ ] Regular accessibility audits
- [ ] User feedback collection
- [ ] Keep up with WCAG updates
- [ ] Train team on accessibility best practices

## Resources and Tools

### Documentation
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [WebAIM Resources](https://webaim.org/resources/)

### Testing Tools
- [axe-core](https://github.com/dequelabs/axe-core)
- [WAVE](https://wave.webaim.org/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [Color Contrast Analyzers](https://www.tpgi.com/color-contrast-checker/)

### Screen Readers
- [NVDA](https://www.nvaccess.org/)
- [JAWS](https://www.freedomscientific.com/products/software/jaws/)
- [VoiceOver Guide](https://www.apple.com/accessibility/vision/)

### Learning Resources
- [Web Accessibility Initiative (WAI)](https://www.w3.org/WAI/)
- [A11y Project](https://www.a11yproject.com/)
- [Deque University](https://dequeuniversity.com/)

## Reporting Issues

When reporting accessibility issues, include:

1. **Issue Description**: What's not working
2. **User Impact**: Who is affected and how
3. **Reproduction Steps**: How to reproduce the issue
4. **Environment**: OS, browser, assistive technology used
5. **Expected Behavior**: What should happen
6. **Screenshots/Videos**: If applicable
7. **WCAG Criterion**: Which guideline is violated

## Getting Help

For accessibility questions or issues:
1. Review this documentation
2. Check existing GitHub issues
3. Create a new issue with accessibility label
4. Consider consulting accessibility experts for complex issues

Remember: Accessibility is not a checklist, it's an ongoing commitment to inclusive design.