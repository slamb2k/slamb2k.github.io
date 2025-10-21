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

<!-- BEGIN DEVSOLO MANAGED SECTION - DO NOT EDIT -->

## 🚀 devsolo Git Workflow Management

This section is automatically managed by devsolo. Last updated: 2025-09-25T18:39:38.122Z

### IMPORTANT: Always Use Slash Commands for devsolo Operations

When working with devsolo workflows, **ALWAYS use slash commands** instead of calling MCP tools directly:

✅ **CORRECT**: Use `SlashCommand` tool
- `/devsolo:launch` - Start new feature workflow
- `/devsolo:commit` - Commit changes
- `/devsolo:ship` - Push, create PR, and merge
- `/devsolo:hotfix` - Create emergency hotfix
- `/devsolo:swap` - Switch between workflow sessions
- `/devsolo:abort` - Abort current workflow
- `/devsolo:cleanup` - Clean up expired sessions

❌ **INCORRECT**: Direct MCP tool calls (e.g., `mcp__devsolo__devsolo_launch`)

**Why slash commands?**
Slash commands provide essential context that MCP tools need:
- Load configuration (autoMode, verboseMode) from .devsolo/config.yaml
- Provide commit message guidance and PR description templates
- Set up proper workflow context and instructions
- Ensure consistent behavior across operations

**Exception**: Read-only query tools can be called directly:
- `devsolo_info` - Show current workflow information
- `devsolo_sessions` - List workflow sessions

### Workflow Detection

Before performing git operations, check for active devsolo session on current branch:

```javascript
// Check if devsolo is managing current branch
const currentBranch = execSync('git branch --show-current').toString().trim();

// Scan session files to find one matching current branch
if (fs.existsSync('.devsolo/sessions')) {
  const files = fs.readdirSync('.devsolo/sessions');
  for (const file of files) {
    if (!file.endsWith('.json')) continue;

    const sessionPath = `.devsolo/sessions/${file}`;
    const session = JSON.parse(fs.readFileSync(sessionPath, 'utf-8'));

    if (session.branchName === currentBranch &&
        session.currentState !== 'COMPLETE' &&
        session.currentState !== 'ABORTED') {
      // devsolo is active on this branch - MUST use MCP tools
      return 'use-devsolo-mcp';
    }
  }
}
// No active session on current branch - can use standard git
return 'use-standard-git';
```

### ⛔ When devsolo Session is Active

If an active session exists for the current branch, **NEVER** use these commands:
- `git commit` → Use `/devsolo:commit` instead
- `git push` → Use `/devsolo:ship` instead
- `gh pr create` → Use `/devsolo:ship` instead
- `git checkout -b` → Use `/devsolo:launch` instead
- `git rebase` → devsolo handles this automatically

### ✅ When No Session Exists

If no active session exists for the current branch:
- Safe to use standard git commands
- Can optionally start devsolo workflow with `/devsolo:launch`
- Direct git operations won't conflict with devsolo

### Why This Enforcement?

devsolo maintains a state machine tracking:
- Linear history enforcement
- Automatic rebasing and conflict resolution
- PR readiness validation
- Workflow audit trail

Direct git operations bypass this state tracking and will cause workflow corruption.

### Team Collaboration

- **With devsolo**: Follow session-based rules above
- **Without devsolo**: Use standard git workflow
- **Mixed teams**: Both can work simultaneously using session detection

<!-- END DEVSOLO MANAGED SECTION -->

## 📚 Documentation Guidelines

When creating or updating documentation, follow the structure defined in `docs/README.md`.

### Folder Structure

- **`docs/guides/`** - User-facing how-to documentation (installation, quickstart, usage, troubleshooting, integrations)
- **`docs/reference/`** - External references and AI context (cached external docs, repomix snapshots)
- **`docs/dev/system/`** - Internal system documentation (source of truth for generating user docs)
- **`docs/dev/plans/`** - Implementation plans, task lists, roadmaps
- **`docs/dev/reports/`** - Bug reports, reviews, implementation summaries
- **`docs/dev/learnings/`** - Reusable patterns, strategies, best practices
- **`docs/specs/`** - Product specifications and design philosophy
- **`docs/archive/`** - Superseded or historical documentation

### Naming Conventions

Always use **lowercase-with-hyphens.md** format:

```
✅ CORRECT: quickstart.md, mcp-integration.md, feature-plan.md
❌ INCORRECT: QuickStart.md, mcp_integration.md, Feature Plan.md
```

For dated snapshots: `repomix-2025-10-09.md`, `export-2025-01-15.md`

### Placement Rules

**Before creating documentation**, read `docs/README.md` for the complete decision tree. Quick guide:

- **User guides** (how-to for end users) → `docs/guides/`
- **External references** (cached external docs, repomix snapshots) → `docs/reference/`
- **Internal system docs** (APIs, commands, config schema) → `docs/dev/system/`
- **Implementation plans** → `docs/dev/plans/`
- **Bug reports, reviews** → `docs/dev/reports/`
- **Patterns, learnings** → `docs/dev/learnings/`
- **Product specs** → `docs/specs/`
- **Completed/superseded docs** → `docs/archive/`

### Using the /devsolo:docs Command

The `/devsolo:docs` slash command has two modes:

**AUDIT MODE** (no arguments): `/devsolo:docs`
- Scans all documentation for naming and placement issues
- Checks for missing README.md entries
- Identifies documents that should be archived
- Offers to fix issues automatically
- Updates all README.md files
- Reports all findings and actions

**CREATE MODE** (with content): `/devsolo:docs <name> <content>`
- Analyzes your content to determine correct placement
- Applies naming conventions automatically
- Updates relevant README.md files
- Archives superseded documents
- Reports all actions taken

### Maintaining READMEs

When adding significant documentation:
1. Create the document in the appropriate folder
2. Update that folder's README.md with an entry
3. Link related documents for cross-references
- If we know the MCP server is running old compiled code, and we should use a devsolo feature, first rebuild the code and then allow the user to restart Claude Code.
