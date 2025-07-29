# Component API Documentation

This document provides comprehensive API documentation for all reusable UI components in the about-me-simon-lamb portfolio template system.

## Table of Contents

- [UI Components](#ui-components)
  - [Button](#button)
  - [Card](#card)
  - [Section](#section)
  - [AnimatedText](#animatedtext)
  - [IconButton](#iconbutton)
  - [OptimizedImage](#optimizedimage)
  - [LazySection](#lazysection)
  - [SkipNavigation](#skipnavigation)
  - [VirtualList](#virtuallist)
  - [LanguageSwitcher](#languageswitcher)
- [Layout Components](#layout-components)
  - [NavigationSidebar](#navigationsidebar)
  - [NavigationHeader](#navigationheader)
  - [PortfolioLayout](#portfoliolayout)
- [Debug Components](#debug-components)
  - [EnvironmentInfo](#environmentinfo)
  - [PerformanceMonitor](#performancemonitor)
- [Error Boundary Components](#error-boundary-components)
  - [ErrorBoundary](#errorboundary)
  - [RouteErrorBoundary](#routeerrorboundary)

---

## UI Components

### Button

A versatile button component with multiple variants, sizes, and animation support.

#### Props

| Prop           | Type                                | Default      | Description                   |
| -------------- | ----------------------------------- | ------------ | ----------------------------- |
| `children`     | `React.ReactNode`                   | **required** | Button content                |
| `variant`      | `'primary' \| 'outline' \| 'ghost'` | `'primary'`  | Visual style variant          |
| `size`         | `'sm' \| 'md' \| 'lg'`              | `'md'`       | Button size                   |
| `icon`         | `LucideIcon`                        | `undefined`  | Optional icon component       |
| `iconPosition` | `'left' \| 'right'`                 | `'right'`    | Icon placement                |
| `onClick`      | `() => void`                        | `undefined`  | Click handler for button mode |
| `href`         | `string`                            | `undefined`  | URL for link mode             |
| `target`       | `string`                            | `undefined`  | Link target attribute         |
| `rel`          | `string`                            | `undefined`  | Link rel attribute            |
| `className`    | `string`                            | `''`         | Additional CSS classes        |
| `disabled`     | `boolean`                           | `false`      | Disabled state                |
| `aria-label`   | `string`                            | `undefined`  | Accessibility label           |

#### Variants

- **primary**: Solid teal background with dark text
- **outline**: Transparent with teal border
- **ghost**: Text-only with hover effects

#### Sizes

- **sm**: Small padding (px-4 py-2), 14px icon, text-xs
- **md**: Medium padding (px-6 py-3), 16px icon, text-sm
- **lg**: Large padding (px-8 py-4), 18px icon, text-sm

#### Usage Examples

```tsx
import Button from '@/components/ui/Button';
import { Download } from 'lucide-react';

// Primary button
<Button onClick={() => console.log('clicked')}>
  Click Me
</Button>

// Link button with icon
<Button
  href="/resume.pdf"
  target="_blank"
  icon={Download}
  variant="outline"
>
  Download Resume
</Button>

// Disabled button
<Button disabled variant="ghost">
  Disabled
</Button>
```

#### Accessibility Features

- Full keyboard navigation support
- ARIA label support
- Focus indicators with ring styling
- Disabled state properly communicated to screen readers

---

### Card

A flexible card container component with multiple variants and optional hover effects.

#### Props

| Prop        | Type                                                  | Default      | Description             |
| ----------- | ----------------------------------------------------- | ------------ | ----------------------- |
| `children`  | `React.ReactNode`                                     | **required** | Card content            |
| `variant`   | `'default' \| 'experience' \| 'project' \| 'feature'` | `'default'`  | Visual style variant    |
| `hover`     | `boolean`                                             | `true`       | Enable hover animations |
| `className` | `string`                                              | `''`         | Additional CSS classes  |
| `onClick`   | `() => void`                                          | `undefined`  | Click handler           |

#### Variants

- **default**: Basic card with slate background and border
- **experience**: Card optimized for experience entries with hover effects
- **project**: Card styled for project showcases
- **feature**: Card with semi-transparent background for feature highlights

#### Subcomponents

The Card component includes three subcomponents for structured layouts:

##### CardHeader

| Prop        | Type              | Default      | Description            |
| ----------- | ----------------- | ------------ | ---------------------- |
| `children`  | `React.ReactNode` | **required** | Header content         |
| `className` | `string`          | `''`         | Additional CSS classes |

##### CardContent

| Prop        | Type              | Default      | Description            |
| ----------- | ----------------- | ------------ | ---------------------- |
| `children`  | `React.ReactNode` | **required** | Main content           |
| `className` | `string`          | `''`         | Additional CSS classes |

##### CardFooter

| Prop        | Type              | Default      | Description            |
| ----------- | ----------------- | ------------ | ---------------------- |
| `children`  | `React.ReactNode` | **required** | Footer content         |
| `className` | `string`          | `''`         | Additional CSS classes |

#### Usage Examples

```tsx
import Card, { CardHeader, CardContent, CardFooter } from '@/components/ui/Card';

// Basic card
<Card variant="project">
  <h3>Project Title</h3>
  <p>Project description</p>
</Card>

// Structured card
<Card variant="experience">
  <CardHeader>
    <h3>Software Engineer</h3>
    <p>Company Name</p>
  </CardHeader>
  <CardContent>
    <p>Job description and responsibilities</p>
  </CardContent>
  <CardFooter>
    <span>2020 - Present</span>
  </CardFooter>
</Card>

// Interactive card
<Card onClick={() => navigate('/project/1')} hover>
  <h3>Click to view details</h3>
</Card>
```

---

### Section

A section wrapper component with consistent spacing and optional animations.

#### Props

| Prop        | Type                                     | Default      | Description               |
| ----------- | ---------------------------------------- | ------------ | ------------------------- |
| `children`  | `React.ReactNode`                        | **required** | Section content           |
| `id`        | `string`                                 | `undefined`  | Section ID for navigation |
| `className` | `string`                                 | `''`         | Additional CSS classes    |
| `maxWidth`  | `'sm' \| 'md' \| 'lg' \| 'xl' \| 'full'` | `'lg'`       | Maximum width constraint  |
| `padding`   | `'none' \| 'sm' \| 'md' \| 'lg'`         | `'md'`       | Padding size              |

#### Usage Examples

```tsx
import Section from '@/components/ui/Section';

<Section id="about" maxWidth="xl">
  <h2>About Me</h2>
  <p>Content here...</p>
</Section>;
```

---

### AnimatedText

A text component with entrance animations using Framer Motion.

#### Props

| Prop        | Type                          | Default      | Description                |
| ----------- | ----------------------------- | ------------ | -------------------------- |
| `text`      | `string`                      | **required** | Text content to animate    |
| `delay`     | `number`                      | `0`          | Animation delay in seconds |
| `className` | `string`                      | `''`         | Additional CSS classes     |
| `as`        | `keyof JSX.IntrinsicElements` | `'span'`     | HTML element type          |

#### Usage Examples

```tsx
import AnimatedText from '@/components/ui/AnimatedText';

<AnimatedText text="Welcome to my portfolio" as="h1" delay={0.2} className="text-4xl font-bold" />;
```

---

### IconButton

A compact button component optimized for icon-only interactions.

#### Props

| Prop         | Type                                | Default      | Description            |
| ------------ | ----------------------------------- | ------------ | ---------------------- |
| `icon`       | `LucideIcon`                        | **required** | Icon component         |
| `onClick`    | `() => void`                        | `undefined`  | Click handler          |
| `href`       | `string`                            | `undefined`  | URL for link mode      |
| `size`       | `'sm' \| 'md' \| 'lg'`              | `'md'`       | Button size            |
| `variant`    | `'default' \| 'ghost' \| 'outline'` | `'default'`  | Visual style           |
| `className`  | `string`                            | `''`         | Additional CSS classes |
| `aria-label` | `string`                            | **required** | Accessibility label    |

#### Usage Examples

```tsx
import IconButton from '@/components/ui/IconButton';
import { Menu, X } from 'lucide-react';

<IconButton icon={Menu} onClick={() => setIsOpen(true)} aria-label="Open menu" size="lg" />;
```

---

### OptimizedImage

An image component with lazy loading, responsive srcsets, and error handling.

#### Props

| Prop          | Type      | Default      | Description                |
| ------------- | --------- | ------------ | -------------------------- |
| `src`         | `string`  | **required** | Image source URL           |
| `alt`         | `string`  | **required** | Alt text for accessibility |
| `width`       | `number`  | `undefined`  | Image width                |
| `height`      | `number`  | `undefined`  | Image height               |
| `className`   | `string`  | `''`         | Additional CSS classes     |
| `lazy`        | `boolean` | `true`       | Enable lazy loading        |
| `quality`     | `number`  | `75`         | Image quality (1-100)      |
| `placeholder` | `string`  | `undefined`  | Placeholder image URL      |

#### Usage Examples

```tsx
import OptimizedImage from '@/components/ui/OptimizedImage';

<OptimizedImage src="/profile.jpg" alt="Profile photo" width={400} height={400} quality={90} />;
```

---

### LazySection

A section component that loads its content only when it enters the viewport.

#### Props

| Prop        | Type              | Default         | Description                  |
| ----------- | ----------------- | --------------- | ---------------------------- |
| `children`  | `React.ReactNode` | **required**    | Section content              |
| `threshold` | `number`          | `0.1`           | Intersection threshold (0-1) |
| `className` | `string`          | `''`            | Additional CSS classes       |
| `fallback`  | `React.ReactNode` | Loading spinner | Content shown while loading  |

#### Usage Examples

```tsx
import LazySection from '@/components/ui/LazySection';

<LazySection threshold={0.2}>
  <ExpensiveComponent />
</LazySection>;
```

---

### SkipNavigation

An accessibility component that provides skip links for keyboard navigation.

#### Props

| Prop    | Type                                   | Default            | Description           |
| ------- | -------------------------------------- | ------------------ | --------------------- |
| `links` | `Array<{href: string, label: string}>` | Default skip links | Navigation skip links |

#### Usage Examples

```tsx
import SkipNavigation from '@/components/ui/SkipNavigation';

<SkipNavigation
  links={[
    { href: '#main', label: 'Skip to main content' },
    { href: '#nav', label: 'Skip to navigation' },
  ]}
/>;
```

---

### VirtualList

A virtualized list component for efficient rendering of large datasets.

#### Props

| Prop              | Type                                          | Default      | Description                                |
| ----------------- | --------------------------------------------- | ------------ | ------------------------------------------ |
| `items`           | `T[]`                                         | **required** | Array of items to render                   |
| `itemHeight`      | `number`                                      | **required** | Fixed height per item                      |
| `containerHeight` | `number`                                      | **required** | Container height                           |
| `renderItem`      | `(item: T, index: number) => React.ReactNode` | **required** | Item render function                       |
| `overscan`        | `number`                                      | `5`          | Number of items to render outside viewport |

#### Usage Examples

```tsx
import VirtualList from '@/components/ui/VirtualList';

<VirtualList
  items={projects}
  itemHeight={100}
  containerHeight={500}
  renderItem={(project, index) => <div key={project.id}>{project.title}</div>}
  overscan={3}
/>;
```

---

### LanguageSwitcher

A language selection component with responsive design (dropdown on desktop, buttons on mobile).

#### Props

| Prop        | Type     | Default | Description            |
| ----------- | -------- | ------- | ---------------------- |
| `className` | `string` | `''`    | Additional CSS classes |

#### Usage Examples

```tsx
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';

<LanguageSwitcher />;
```

---

## Layout Components

### NavigationSidebar

Desktop sidebar navigation component with section highlighting.

#### Props

| Prop             | Type                        | Default      | Description              |
| ---------------- | --------------------------- | ------------ | ------------------------ |
| `activeSection`  | `string`                    | **required** | Currently active section |
| `onSectionClick` | `(section: string) => void` | **required** | Section click handler    |

---

### NavigationHeader

Mobile header navigation component with backdrop blur.

#### Props

| Prop             | Type                        | Default      | Description              |
| ---------------- | --------------------------- | ------------ | ------------------------ |
| `activeSection`  | `string`                    | **required** | Currently active section |
| `onSectionClick` | `(section: string) => void` | **required** | Section click handler    |

---

### PortfolioLayout

Main layout wrapper that handles responsive navigation rendering.

#### Props

| Prop       | Type              | Default      | Description  |
| ---------- | ----------------- | ------------ | ------------ |
| `children` | `React.ReactNode` | **required** | Page content |

---

## Debug Components

### EnvironmentInfo

Development-only component that displays current environment configuration.

#### Props

No props - automatically reads environment configuration.

### PerformanceMonitor

Component that displays real-time Core Web Vitals and performance metrics.

#### Props

| Prop          | Type      | Default | Description           |
| ------------- | --------- | ------- | --------------------- |
| `showDetails` | `boolean` | `false` | Show detailed metrics |

---

## Error Boundary Components

### ErrorBoundary

React error boundary component with fallback UI and error reporting.

#### Props

| Prop       | Type                                                     | Default      | Description       |
| ---------- | -------------------------------------------------------- | ------------ | ----------------- |
| `children` | `React.ReactNode`                                        | **required** | Protected content |
| `fallback` | `React.ComponentType<{error: Error, retry: () => void}>` | Default UI   | Custom error UI   |

### RouteErrorBoundary

Specialized error boundary for React Router error handling.

#### Props

Similar to ErrorBoundary but optimized for routing errors.

---

## Import Patterns

All UI components are available through the barrel export:

```tsx
// Individual imports
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

// Barrel import
import { Button, Card, Section } from '@/components/ui';
```

## Design System

All components follow a consistent design system:

- **Colors**: Slate and teal color palette with dark theme
- **Typography**: Mono font family for consistent spacing
- **Spacing**: Tailwind CSS spacing scale
- **Animations**: Framer Motion with consistent timing
- **Accessibility**: WCAG 2.1 AA compliance
- **Responsive**: Mobile-first responsive design

## Testing

All components include comprehensive test coverage with:

- Render testing
- Interaction testing
- Accessibility testing with axe-core
- Responsive behavior testing
- Animation testing

To run component tests:

```bash
npm run test src/components/ui
```
