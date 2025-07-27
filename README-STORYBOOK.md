# Storybook Documentation

This project uses Storybook for component documentation and development. Storybook provides an isolated environment for building and testing UI components.

## Quick Start

```bash
# Start Storybook development server
npm run storybook

# Build Storybook for production
npm run build-storybook
```

## What's Included

### Component Stories

All UI components have comprehensive Storybook stories:

- **Button**: All variants, sizes, states, and interactive examples
- **Card**: Layout combinations with headers, content, and footers
- **Section**: Layout examples with different content types
- **AnimatedText**: Animation demonstrations with various delays
- **IconButton**: Icon variants and accessibility examples

### Documentation Features

- **Controls**: Interactive controls for testing component props
- **Actions**: Event logging for interaction testing
- **Accessibility**: Built-in accessibility testing with axe-core
- **Responsive**: Testing across different viewport sizes
- **Themes**: Light and dark theme examples

## Component Documentation Standards

Each component story includes:

1. **Default Example**: Basic usage demonstration
2. **Variants**: All available style variants
3. **Sizes**: Different size options
4. **States**: Interactive states (hover, focus, disabled)
5. **Accessibility**: ARIA labels and keyboard navigation
6. **Real-world Examples**: Practical usage scenarios

## Accessibility Testing

Storybook includes automated accessibility testing:

- WCAG 2.1 compliance checking
- Color contrast validation
- Keyboard navigation testing
- Screen reader compatibility

## Development Workflow

1. **Component Development**: Create components with full TypeScript support
2. **Story Creation**: Write comprehensive stories for all use cases
3. **Visual Testing**: Use Storybook for visual regression testing
4. **Documentation**: Auto-generated docs from TypeScript props
5. **Accessibility Validation**: Automated a11y testing in every story

## Best Practices

### Writing Stories

```typescript
// Example story structure
import type { Meta, StoryObj } from '@storybook/react';
import { ComponentName } from './ComponentName';

const meta = {
  title: 'UI/ComponentName',
  component: ComponentName,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Component description...',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    // Define prop controls
  },
} satisfies Meta<typeof ComponentName>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Default props
  },
};
```

### Documentation Guidelines

- Include clear component descriptions
- Document all props with types and descriptions
- Provide real-world usage examples
- Include accessibility considerations
- Show interactive states and variants

## Deployment

Storybook can be deployed as a static site:

```bash
# Build static Storybook
npm run build-storybook

# Deploy to static hosting (Netlify, Vercel, etc.)
# Upload the storybook-static folder
```

## Integrations

### With Testing

- Stories can be imported and used in unit tests
- Visual regression testing with Chromatic
- Accessibility testing with axe-core

### With Design Systems

- Consistent theming across all stories
- Design token documentation
- Component API documentation

## Troubleshooting

### Common Issues

1. **Import Errors**: Ensure proper path aliases in Storybook config
2. **CSS Not Loading**: Verify CSS imports in preview.ts
3. **TypeScript Errors**: Check component prop types and story definitions

### Performance

- Use lazy loading for large component libraries
- Optimize asset loading in stories
- Use efficient story organization
