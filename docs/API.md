# Component API Documentation

This document provides comprehensive API documentation for all components in the Component Forge UI library.

## Core UI Components

### Button

A versatile button component with multiple variants, sizes, and accessibility features.

#### Props

```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  asChild?: boolean;
  children: React.ReactNode;
}
```

#### Variants

- **default**: Primary button with solid background
- **destructive**: Red button for dangerous actions
- **outline**: Button with border and transparent background
- **secondary**: Muted button for secondary actions
- **ghost**: Transparent button with hover effects
- **link**: Button styled as a link

#### Sizes

- **default**: Standard button size (h-10 px-4 py-2)
- **sm**: Small button (h-9 px-3)
- **lg**: Large button (h-11 px-8)
- **icon**: Square button for icons (h-10 w-10)

#### Usage Examples

```tsx
// Basic usage
<Button>Click me</Button>

// With variant and size
<Button variant="outline" size="sm">Small Outline</Button>

// As a link
<Button asChild>
  <a href="/page">Link Button</a>
</Button>

// With icon
<Button size="icon" aria-label="Settings">
  <Settings className="h-4 w-4" />
</Button>
```

### Card

A flexible card component with header, content, and footer sections for displaying content in a structured way.

#### Components

- **Card**: Main container
- **CardHeader**: Header section
- **CardTitle**: Title within header
- **CardDescription**: Description within header
- **CardContent**: Main content area
- **CardFooter**: Footer section

#### Props

```typescript
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: React.ReactNode;
}

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: React.ReactNode;
}

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  className?: string;
  children: React.ReactNode;
}

interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  className?: string;
  children: React.ReactNode;
}

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: React.ReactNode;
}

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: React.ReactNode;
}
```

#### Usage Examples

```tsx
// Basic card
<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Main content goes here</p>
  </CardContent>
</Card>

// Card with footer
<Card>
  <CardHeader>
    <CardTitle>Project</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Project description</p>
  </CardContent>
  <CardFooter>
    <Button>View</Button>
    <Button variant="outline">Edit</Button>
  </CardFooter>
</Card>
```

### Section

A layout component that provides consistent spacing and structure for page sections.

#### Props

```typescript
interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  id?: string;
  className?: string;
  children: React.ReactNode;
}
```

#### Usage Examples

```tsx
// Basic section
<Section>
  <h2>Section Title</h2>
  <p>Section content</p>
</Section>

// Section with ID for navigation
<Section id="about">
  <h2>About</h2>
  <p>About content</p>
</Section>

// Section with custom styling
<Section className="bg-gray-50">
  <h2>Featured Content</h2>
</Section>
```

### AnimatedText

A text component with smooth fade-in animation using Framer Motion. Perfect for progressive content disclosure.

#### Props

```typescript
interface AnimatedTextProps {
  as?: keyof JSX.IntrinsicElements;
  className?: string;
  delay?: number;
  children: React.ReactNode;
}
```

#### Parameters

- **as**: HTML element to render (default: 'div')
- **className**: Additional CSS classes
- **delay**: Animation delay in seconds (default: 0)
- **children**: Text content to animate

#### Usage Examples

```tsx
// Basic animated text
<AnimatedText>This text will fade in</AnimatedText>

// With delay
<AnimatedText delay={0.5}>Delayed animation</AnimatedText>

// As heading with styling
<AnimatedText as="h1" className="text-4xl font-bold">
  Animated Heading
</AnimatedText>

// Sequential animations
<AnimatedText delay={0}>First line</AnimatedText>
<AnimatedText delay={0.2}>Second line</AnimatedText>
<AnimatedText delay={0.4}>Third line</AnimatedText>
```

### IconButton

A specialized button component designed for icon-only interactions with proper accessibility support.

#### Props

```typescript
interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
  asChild?: boolean;
  children: React.ReactNode;
  'aria-label': string; // Required for accessibility
}
```

#### Variants

- **default**: Primary icon button
- **destructive**: Red button for dangerous actions
- **outline**: Button with border
- **secondary**: Muted button
- **ghost**: Transparent button

#### Sizes

- **sm**: Small icon button (h-8 w-8)
- **default**: Standard icon button (h-10 w-10)
- **lg**: Large icon button (h-12 w-12)

#### Usage Examples

```tsx
// Basic icon button
<IconButton aria-label="Like this post">
  <Heart className="h-4 w-4" />
</IconButton>

// With variant and size
<IconButton variant="destructive" size="sm" aria-label="Delete item">
  <Trash2 className="h-3 w-3" />
</IconButton>

// As link
<IconButton asChild aria-label="Visit GitHub">
  <a href="https://github.com">
    <Github className="h-4 w-4" />
  </a>
</IconButton>
```

## Performance Components

### LazySection

Performance-optimized section component with intersection observer for lazy loading.

#### Props

```typescript
interface LazySectionProps extends React.HTMLAttributes<HTMLElement> {
  id?: string;
  threshold?: number;
  rootMargin?: string;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}
```

#### Parameters

- **threshold**: Intersection threshold (0-1, default: 0.1)
- **rootMargin**: Root margin for intersection observer (default: '100px')
- **fallback**: Loading placeholder component

#### Usage

```tsx
<LazySection id="projects" threshold={0.2} rootMargin="200px" fallback={<div>Loading...</div>}>
  <ProjectsContent />
</LazySection>
```

### OptimizedImage

Image component with lazy loading, responsive design, and error handling.

#### Props

```typescript
interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  sizes?: string;
  className?: string;
  fallback?: string;
  onError?: () => void;
}
```

#### Usage

```tsx
<OptimizedImage
  src="/hero-image.jpg"
  alt="Hero image"
  width={800}
  height={600}
  sizes="(max-width: 768px) 100vw, 50vw"
  priority
/>
```

### VirtualList

Performance component for efficiently rendering large lists.

#### Props

```typescript
interface VirtualListProps<T> {
  items: T[];
  itemHeight: number;
  height: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
  overscan?: number;
}
```

#### Usage

```tsx
<VirtualList
  items={largeDataSet}
  itemHeight={60}
  height={400}
  renderItem={(item, index) => (
    <div key={index} className="p-4 border-b">
      {item.name}
    </div>
  )}
  overscan={5}
/>
```

## Accessibility Components

### SkipNavigation

Accessibility component that allows keyboard users to skip repetitive navigation.

#### Props

```typescript
interface SkipNavigationProps {
  targetId: string;
  className?: string;
  children?: React.ReactNode;
}
```

#### Usage

```tsx
<SkipNavigation targetId="main-content">
  Skip to main content
</SkipNavigation>

<main id="main-content">
  {/* Main content */}
</main>
```

## Layout Components

### LanguageSwitcher

Component for switching between different languages in internationalized applications.

#### Props

```typescript
interface LanguageSwitcherProps {
  variant?: 'desktop' | 'mobile';
  className?: string;
}
```

#### Usage

```tsx
// Desktop dropdown
<LanguageSwitcher variant="desktop" />

// Mobile friendly version
<LanguageSwitcher variant="mobile" />
```

## Common Patterns

### Responsive Design

All components support responsive design through Tailwind CSS classes:

```tsx
<Card className="w-full md:w-1/2 lg:w-1/3">
  <CardContent className="p-4 md:p-6">Responsive content</CardContent>
</Card>
```

### Theme Support

Components work with both light and dark themes:

```tsx
<Button className="bg-blue-600 dark:bg-blue-400">Theme-aware button</Button>
```

### Accessibility

All interactive components include proper ARIA attributes:

```tsx
<IconButton aria-label="Close dialog" aria-expanded={isOpen} aria-controls="dialog-content">
  <X className="h-4 w-4" />
</IconButton>
```

### Animation

Components with animations respect user preferences:

```css
@media (prefers-reduced-motion: reduce) {
  .animated-element {
    animation: none;
  }
}
```

## TypeScript Support

All components are fully typed with TypeScript. Import types as needed:

```typescript
import type { ButtonProps } from '@/components/ui/Button';
import type { CardProps } from '@/components/ui/Card';
```

## Best Practices

1. **Always provide aria-label for IconButton**
2. **Use semantic HTML structure with Card components**
3. **Implement proper focus management**
4. **Test with keyboard navigation**
5. **Verify screen reader compatibility**
6. **Consider mobile touch targets (minimum 44px)**
7. **Use appropriate color contrast ratios**
8. **Provide alternative text for images**
9. **Test with reduced motion preferences**
10. **Validate HTML semantics**
