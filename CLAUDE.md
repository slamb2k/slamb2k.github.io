# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React portfolio template system built with Vite, TypeScript, and Tailwind CSS. Named "about-me-simon-lamb", it serves as a code generation target with placeholder injection points for dynamic component creation. The current implementation displays a personal portfolio website with responsive design featuring sections for about, experience, projects, and contact information.

## Development Commands

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production (runs TypeScript compilation first)
- `npm run lint` - Run ESLint for code quality checks
- `npm run preview` - Preview production build locally
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting without applying changes

## Development Workflow

1. Think hard.
2. /sc:implement the remainder of the tasks in TASKS.md.
3. For the next top-level task:
   a. Sync main
   b. Create a feature branch from main for the work and check it out.
   c. Complete the work on that newly created branch.
   d. Commit all changes with an appropriate commit message and push to the feature branch.
   e. Create a descriptive PR and ensure a successful review before merging it to main.
   f. When the merge is complete, delete the feature branch.
   g. Update TASKS.md when complete.
   h. /clear the history.

## Architecture

### Key Technologies

- **React 19** with TypeScript for type safety
- **Vite** for fast development and building
- **Tailwind CSS 4** for utility-first styling
- **Framer Motion** for smooth animations and transitions
- **@dnd-kit** for drag and drop capabilities
- **React Three Fiber** for 3D graphics integration

### Template Injection System

This project serves as a code generation template with several injection points:

- **Dynamic Component Replacement**: `%EXPORT_STATEMENT%` placeholder in App.tsx (line 21) for swapping main component
- **Theme Injection**: `%INJECTED_THEME%`, `%INJECTED_CONTAINER%` placeholders designed for runtime configuration
- **Generated Components**: All main components in `src/components/generated/` are dynamically created/replaced
- **Hard-coded Runtime Values**: Current implementation has `theme: 'dark'` and `container: 'none'` but designed for external configuration
- **Template Nature**: The useMemo wrapper and placeholder comments indicate this is a generation target rather than a static application

### Application Flow

1. **Entry Point**: `src/main.tsx` → `src/App.tsx`
2. **Theme Management**: App.tsx applies theme by toggling 'dark' class on document element
3. **Layout System**: Container can be 'centered' or 'none' affecting the root layout wrapper
4. **Main Component**: `PortfolioLandingPage.tsx` orchestrates all sections with:
   - Responsive detection (mobile <1024px)
   - Scroll-based section tracking for navigation
   - Smooth scrolling between sections

### Navigation Architecture

- **Scroll-based Active Section**: Uses intersection detection with 100px offset (`scrollY + 100`) for navigation highlighting
- **Section Management**: Hard-coded sections array: `['about', 'experience', 'projects', 'contact']`
- **Smooth Scrolling**: Programmatic `scrollIntoView({ behavior: 'smooth' })` for section navigation
- **Mobile Header**: Conditional rendering with backdrop blur effect (`bg-slate-900/95 backdrop-blur-sm`)
- **State Synchronization**: Active section state drives both navigation highlighting and scroll position

### Responsive Design Pattern

- **Dual Breakpoint System**: Two different mobile breakpoints exist:
  - `use-mobile.ts` hook: 768px (standard mobile breakpoint)
  - `PortfolioLandingPage.tsx`: 1024px (desktop sidebar threshold)
  - This creates a tablet intermediate state (768px-1024px) where the hook reports desktop but layout uses mobile patterns
- Desktop (≥1024px): Sidebar navigation with fixed positioning
- Mobile (<1024px): Mobile header with backdrop blur, no sidebar
- Sections use scroll detection to update active navigation state

### Path Configuration

- `@/*` alias maps to `./src/*` (configured in vite.config.ts and tsconfig.json)
- Use absolute imports with `@/` prefix for all internal modules

## Key Files to Understand

### Theme and Settings System

- `src/settings/types.d.ts` - Type definitions for Theme ('light'|'dark') and Container ('centered'|'none')
- `src/settings/theme.ts` - Theme configuration with injection placeholders for dynamic theming
- Theme is hardcoded to 'dark' in App.tsx but designed to be configurable

### Component Structure

- `src/components/generated/PortfolioLandingPage.tsx` - Main orchestrator component
  - Manages responsive state and scroll tracking
  - Composes all other section components
  - Handles section navigation and active states
- Individual section components import and render specific portfolio sections
- All components use Framer Motion for animations

### Utility Structure

- `src/lib/utils.ts` - Utility functions (likely includes cn() for className merging)
- `src/hooks/use-mobile.ts` - Mobile detection hook using 768px breakpoint (different from layout's 1024px breakpoint)

## Development Guidelines

### Test-Driven Development (TDD)

This project follows strict TDD principles from `.cursorrules`:

- **Always write tests FIRST** before implementing any feature
- Follow Red-Green-Refactor cycle: failing test → minimal implementation → refactor
- Use Jest and React Testing Library for testing
- Test file extensions: `.test.tsx` or `.spec.tsx`
- Aim for 80%+ test coverage

### Code Quality Standards

- **TypeScript**: Use strict configuration, avoid `any` type, proper interfaces for all data structures
- **React**: Functional components with hooks, keep components small and focused, proper prop types
- **Testing**: Mirror test structure to source code, test both happy path and edge cases
- **Commits**: Use conventional commit format: `type(scope): description`

### Before Code Submission Checklist

- [ ] All tests pass
- [ ] New features have corresponding tests
- [ ] TypeScript strict mode compliance
- [ ] No console.log statements in production code
- [ ] Proper error handling implemented
- [ ] Code properly formatted with ESLint/Prettier

### Accessibility Requirements

- Follow WCAG 2.1 guidelines
- Use semantic HTML elements and proper ARIA labels
- Ensure keyboard navigation functionality
- Include accessibility tests using axe-core

<!-- BEGIN HAN-SOLO MANAGED SECTION - DO NOT EDIT -->

## 🚀 han-solo Git Workflow Management

This section is automatically managed by han-solo. Last updated: 2025-09-27T14:45:00.527Z

### Workflow Detection

Before performing git operations, check for active han-solo session:

```javascript
// Check if han-solo is managing current work
if (fs.existsSync('.hansolo/session.json')) {
  // han-solo is active - MUST use MCP tools
  return 'use-hansolo-mcp';
} else {
  // No active session - can use standard git
  return 'use-standard-git';
}
```

### ⛔ When han-solo Session is Active

If `.hansolo/session.json` exists, **NEVER** use these commands:

- `git commit` → Use `/hansolo:ship` instead
- `git push` → Use `/hansolo:ship --push` instead
- `gh pr create` → Use `/hansolo:ship --create-pr` instead
- `git checkout -b` → Use `/hansolo:launch` instead
- `git rebase` → han-solo handles this automatically

### ✅ When No Session Exists

If no `.hansolo/session.json` file:

- Safe to use standard git commands
- Can optionally start han-solo workflow with `/hansolo:launch`
- Direct git operations won't conflict with han-solo

### Why This Enforcement?

han-solo maintains a state machine tracking:

- Linear history enforcement
- Automatic rebasing and conflict resolution
- PR readiness validation
- Workflow audit trail

Direct git operations bypass this state tracking and will cause workflow corruption.

### Team Collaboration

- **With han-solo**: Follow session-based rules above
- **Without han-solo**: Use standard git workflow
- **Mixed teams**: Both can work simultaneously using session detection

<!-- END HAN-SOLO MANAGED SECTION -->
