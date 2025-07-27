# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React portfolio/landing page application built with Vite, TypeScript, and Tailwind CSS. It's a personal portfolio website featuring a responsive design with sections for about, experience, projects, and contact information.

## Development Commands

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production (runs TypeScript compilation first)
- `npm run lint` - Run ESLint for code quality checks
- `npm run preview` - Preview production build locally
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting without applying changes

## Architecture

### Key Technologies
- **React 19** with TypeScript for type safety
- **Vite** for fast development and building
- **Tailwind CSS 4** for utility-first styling
- **Framer Motion** for smooth animations and transitions
- **@dnd-kit** for drag and drop capabilities
- **React Three Fiber** for 3D graphics integration

### Component Generation System
This project uses a component generation approach where:
- All main components are in `src/components/generated/` 
- `App.tsx` has placeholders like `%EXPORT_STATEMENT%` for dynamic component insertion
- The theme system includes injection placeholders (`%INJECTED_THEME%`, `%INJECTED_CONTAINER%`)
- This suggests the project may be used as a template or code generation target

### Application Flow
1. **Entry Point**: `src/main.tsx` → `src/App.tsx`
2. **Theme Management**: App.tsx applies theme by toggling 'dark' class on document element
3. **Layout System**: Container can be 'centered' or 'none' affecting the root layout wrapper
4. **Main Component**: `PortfolioLandingPage.tsx` orchestrates all sections with:
   - Responsive detection (mobile <1024px)
   - Scroll-based section tracking for navigation
   - Smooth scrolling between sections

### Responsive Design Pattern
- Mobile-first approach with breakpoint at 1024px
- Desktop: Sidebar navigation with fixed positioning
- Mobile: Different navigation pattern (likely full-screen or overlay)
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
- `src/hooks/use-mobile.ts` - Custom hook for responsive behavior