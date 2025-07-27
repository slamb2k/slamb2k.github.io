# Scripts

This directory contains utility scripts for the component-forge project.

## Component Generator

Generate new React components with boilerplate code and optional tests.

### Usage

```bash
npm run generate:component
```

### Options

1. **Component Name**: Must start with a capital letter (e.g., Button, Card, UserProfile)
2. **Component Type**:
   - `default`: Standard component in `src/components/generated/`
   - `ui`: UI library component in `src/components/ui/` with CVA variants
   - `page`: Page component in `src/pages/` with Framer Motion and i18n
3. **Test File**: Optionally generate a test file alongside the component

### Examples

```bash
# Generate a default component
npm run generate:component
# > Component name: MyComponent
# > Component type: default
# > Include test file?: y

# Generate a UI component
npm run generate:component
# > Component name: Badge
# > Component type: ui
# > Include test file?: y

# Generate a page component
npm run generate:component
# > Component name: AboutPage
# > Component type: page
# > Include test file?: n
```

### Generated Files

- Component file: `{ComponentName}.tsx`
- Test file (optional): `{ComponentName}.test.tsx`
- UI components are automatically added to the barrel export in `src/components/ui/index.ts`

### Component Templates

- **Default**: Basic React component with TypeScript props
- **UI**: Component with CVA (class-variance-authority) for variants and sizes
- **Page**: Page component with Framer Motion animations and i18n support
