# Portfolio Web Application Style Guide

This comprehensive style guide documents the design system, patterns, and standards used throughout the portfolio web application. It serves as a reference for maintaining consistency across all components and ensuring a cohesive user experience.

## 1. Typography & Text Styles

### Font Families

- **Primary Font**: Inter (sans-serif) - Used for UI elements and body text
- **Monospace Font**: `font-mono` (system monospace) - Used for code, technical elements, and button labels
- **Fallback Fonts**: Arial, Helvetica, system-ui

### Font Sizes

```
Text Sizes (Tailwind Classes):
- Display: text-5xl to text-7xl (48px-72px)
- Headings: text-2xl to text-4xl (24px-36px)
- Body: text-sm to text-lg (14px-18px)
- Small: text-xs (12px)
- Monospace: text-sm (14px)
```

### Font Weights

- **Bold**: font-bold (700) - Used for headings and emphasis
- **Semibold**: font-semibold (600) - Used for subheadings
- **Medium**: font-medium (500) - Used for highlighted text
- **Normal**: font-normal (400) - Default body text

### Line Heights & Spacing

- **Headings**: leading-tight (1.25)
- **Body Text**: leading-relaxed (1.625)
- **Letter Spacing**: Default (no custom letter-spacing applied)
- **Text Transform**: No uppercase transforms; maintain natural casing

## 2. Color Palette

### Light Theme

```css
--background: oklch(0.2178 0 0) /* Near white */ --foreground: oklch(0.145 0 0) /* Near black */
  --primary: oklch(0.205 0 0) /* Dark gray */ --secondary: oklch(0.97 0 0) /* Light gray */
  --accent: oklch(0.97 0 0) /* Light gray */ --muted: oklch(0.97 0 0) /* Light gray */
  --destructive: oklch(0.577 0.245 27.325) /* Red-orange */ --border: oklch(0.922 0 0)
  /* Light gray border */;
```

### Dark Theme (Primary)

```css
--background: oklch(0.145 0 0) /* #0f172a - slate-900 */ --foreground: oklch(0.985 0 0)
  /* #f8fafc - slate-50 */ --primary: oklch(0.922 0 0) /* #e2e8f0 - slate-200 */
  --secondary: oklch(0.269 0 0) /* #334155 - slate-700 */ --accent: oklch(0.269 0 0)
  /* #334155 - slate-700 */ --muted: oklch(0.269 0 0) /* #334155 - slate-700 */
  --destructive: oklch(0.704 0.191 22.216) /* #ef4444 - red-500 */ --border: oklch(1 0 0 / 10%)
  /* rgba(255,255,255,0.1) */;
```

### Brand Colors

- **Teal Accent**: #5eead4 (teal-300) - Primary brand color for links, buttons, and highlights
- **Teal Hover**: #2dd4bf (teal-400) - Hover state for teal elements
- **Teal Subtle**: rgba(94,234,212,0.1) - Background for badges and subtle highlights

### Text Colors

- **Primary Text**: text-slate-100 - Main headings and important text
- **Body Text**: text-slate-300/400 - Regular content
- **Muted Text**: text-slate-500 - Secondary information, timestamps
- **Brand Text**: text-teal-300 - Links, highlighted elements

### Background Colors

- **Page Background**: bg-slate-900
- **Card Background**: bg-slate-800
- **Hover Background**: bg-slate-800/50
- **Subtle Background**: bg-teal-400/10

## 3. Spacing & Layout

### Spacing Tokens

```
Base unit: 0.25rem (4px)
- xs: 0.5rem (8px)    - space-2
- sm: 1rem (16px)     - space-4
- md: 1.5rem (24px)   - space-6
- lg: 2rem (32px)     - space-8
- xl: 3rem (48px)     - space-12
- 2xl: 6rem (96px)    - space-24
```

### Container Widths

- **Max Content Width**: max-w-4xl (896px)
- **Sidebar Width**: lg:ml-96 (384px on desktop)
- **Mobile Padding**: px-6 (24px)
- **Desktop Padding**: lg:px-12 (48px)

### Section Spacing

- **Section Margin**: mb-24 (96px between major sections)
- **Element Spacing**: space-y-4 to space-y-8 (16px-32px)
- **Card Padding**: p-6 (24px)

### Grid System

- **Layout**: Flexbox-based layouts
- **Responsive Breakpoint**: lg (1024px) - Desktop sidebar appears
- **Mobile Layout**: Full-width with fixed header
- **Desktop Layout**: Fixed sidebar + scrollable content

## 4. Buttons & Links

### Button Styles

#### Primary Button

```css
- Background: bg-teal-300
- Text: text-slate-900
- Hover: hover:bg-teal-200
- Padding: px-6 py-3 (md), px-8 py-4 (lg)
- Border Radius: rounded-lg
```

#### Outline Button

```css
- Border: border border-teal-300
- Text: text-teal-300
- Hover: hover:bg-teal-300/10
- Same padding and radius as primary
```

#### Ghost Button

```css
- Text: text-slate-400
- Hover: hover:text-teal-300
- No background or border
```

### Button States

- **Default**: Normal appearance
- **Hover**: Scale 1.05 with Framer Motion
- **Active/Tap**: Scale 0.95 with Framer Motion
- **Disabled**: opacity-50 cursor-not-allowed
- **Focus**: ring-2 ring-teal-300/50

### Link Styles

- **Default**: text-teal-300
- **Hover**: Brightness increase or underline
- **External Links**: Include appropriate icon (e.g., ExternalLink)
- **Navigation Links**: text-slate-400 hover:text-slate-100

### Usage Guidelines

- **CTAs**: Use primary buttons for main actions
- **Secondary Actions**: Use outline buttons
- **Tertiary Actions**: Use ghost buttons or text links
- **Button Labels**: Use font-mono text-sm
- **Icon Position**: Right side by default, with hover animation

## 5. UI Components & Patterns

### Cards

```css
Variants:
- default: border-slate-800 bg-slate-900
- experience: hover:border-slate-700 hover:bg-slate-800/50
- project: bg-slate-800 border-slate-700
- feature: bg-slate-800/50 border-slate-700

Common properties:
- Padding: p-6
- Border Radius: rounded-lg
- Hover Scale: scale-[1.02]
- Transition: duration-300
```

### Form Elements

- **Input Fields**: bg-slate-800 border-slate-700 rounded-lg px-4 py-2
- **Focus State**: focus:border-teal-300 focus:ring-2 focus:ring-teal-300/50
- **Labels**: text-slate-300 text-sm mb-2
- **Error State**: border-red-500 text-red-400

### Navigation Components

- **Desktop Sidebar**: Fixed position, 384px width, full height
- **Mobile Header**: Fixed top, backdrop blur, border-b
- **Nav Items**: p-3 rounded-lg hover:bg-slate-800
- **Active State**: bg-slate-800 text-slate-100

### Badges & Tags

```css
- Background: bg-teal-400/10
- Text: text-teal-300
- Padding: px-3 py-1
- Border Radius: rounded-full
- Font Size: text-xs
```

## 6. Icons, Illustrations, Imagery

### Icon Guidelines

- **Library**: Lucide React icons
- **Size**: 14-18px depending on context
- **Color**: Match text color or use currentColor
- **Stroke Width**: Default (2px)
- **Hover Effects**: Translate or rotate animations

### Icon Usage

- **Navigation**: Home, User, Briefcase, Code2, Mail
- **Actions**: ArrowDown, ExternalLink, Github, Linkedin
- **Decorative**: Use sparingly, ensure accessibility

### Image Guidelines

- **Placeholder**: Use gradient backgrounds or blur effects
- **Lazy Loading**: Implement for performance
- **Alt Text**: Required for all images
- **Aspect Ratios**: Maintain consistent ratios in grids

## 7. Interactive Elements & Animations

### Motion Principles

- **Library**: Framer Motion
- **Duration**: 0.3s (quick), 0.6s (standard), 0.8s (emphasis)
- **Easing**: Default Framer Motion easing
- **Direction**: Consistent with user flow

### Common Animations

```javascript
// Fade In Up
initial: { opacity: 0, y: 50 }
animate: { opacity: 1, y: 0 }
transition: { duration: 0.6 }

// Scale on Hover
whileHover: { scale: 1.05 }
whileTap: { scale: 0.95 }

// Stagger Children
staggerChildren: 0.1
```

### Hover Effects

- **Cards**: Scale up slightly (1.02)
- **Buttons**: Scale up (1.05) or background change
- **Links**: Color change to teal-300
- **Icons**: Translate or rotate

### Scroll Animations

- **Viewport Trigger**: `viewport={{ once: true }}`
- **Fade In**: On scroll with y-axis movement
- **Parallax**: Subtle effects for hero sections

## 8. Voice & Tone / Copy Guidelines

### Writing Style

- **Professional but Approachable**: Balance technical expertise with accessibility
- **Active Voice**: "I build" not "Building is done by me"
- **Concise**: Get to the point quickly
- **Technical Accuracy**: Use correct terminology

### Content Patterns

- **Headings**: Direct and descriptive
- **CTAs**: Action-oriented ("Check out my work!" not "Click here")
- **Descriptions**: Focus on impact and outcomes
- **Technical Terms**: Explain when necessary

### Button & Link Text

- **CTAs**: Verb + Object ("Download Resume", "View Project")
- **Navigation**: Single word or short phrase
- **External Links**: Include context about destination
- **Consistency**: Use the same terms throughout

## 9. Content Structure & Page Layouts

### Page Structure

```
1. Hero Section (100vh)
   - Introduction
   - Tagline
   - Primary CTA

2. About Section
   - Brief bio
   - Skills/expertise

3. Experience Section
   - Chronological list
   - Role details
   - Technologies used

4. Projects Section
   - Grid layout
   - Featured projects
   - Links to demos/code

5. Contact Section
   - Email link
   - Social links
   - Contact form (optional)
```

### Navigation Patterns

- **Desktop**: Fixed sidebar with section links
- **Mobile**: Sticky header (appears on scroll)
- **Scroll Spy**: Highlight active section
- **Smooth Scrolling**: For section navigation

### Content Hierarchy

1. **Primary**: Name, current role
2. **Secondary**: About, key skills
3. **Tertiary**: Project details, past experience
4. **Supporting**: Social links, additional info

## 10. Accessibility & Web Standards

### Semantic HTML

- Use proper heading hierarchy (h1 → h2 → h3)
- Semantic elements: `<nav>`, `<main>`, `<section>`, `<article>`
- Meaningful element structure
- Proper list markup for groups

### Color Contrast

- **Large Text**: Minimum 3:1 ratio
- **Body Text**: Minimum 4.5:1 ratio
- **Interactive Elements**: Clear focus indicators
- **Testing**: Use tools to verify WCAG compliance

### Keyboard Navigation

- **Tab Order**: Logical flow through page
- **Focus Indicators**: Visible ring on all interactive elements
- **Skip Links**: For screen reader users
- **Escape Key**: Close modals/overlays

### ARIA Attributes

```html
<!-- Examples -->
aria-label="Navigation menu" aria-current="page" aria-expanded="true/false" role="navigation"
```

### Screen Reader Support

- **Alt Text**: For all images
- **Button Labels**: Descriptive aria-labels
- **Loading States**: Announce changes
- **Error Messages**: Associated with inputs

## 11. Code Snippets & Markup Examples

### Component Structure

```tsx
// Consistent component pattern
interface ComponentProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  className?: string;
}

const Component: React.FC<ComponentProps> = ({ children, variant = 'primary', className = '' }) => {
  const baseClasses = 'base styles';
  const variantClasses = {
    primary: 'primary styles',
    secondary: 'secondary styles',
  };

  return <div className={`${baseClasses} ${variantClasses[variant]} ${className}`}>{children}</div>;
};
```

### Tailwind Class Organization

```tsx
// Order: Layout → Spacing → Typography → Colors → Effects
className =
  'flex items-center px-6 py-3 text-sm font-medium text-slate-100 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors';
```

### Animation Patterns

```tsx
// Framer Motion consistent patterns
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
  whileHover={{ scale: 1.02 }}
>
  Content
</motion.div>
```

### Responsive Patterns

```tsx
// Mobile-first with lg breakpoint
className = 'px-6 lg:px-12 text-base lg:text-lg';
```

## Implementation Notes

1. **Dark Mode**: Currently hardcoded but designed for theme switching
2. **Container Options**: 'centered' or 'none' layout modes
3. **Performance**: Lazy loading and code splitting implemented
4. **Testing**: Aim for 80%+ coverage with React Testing Library
5. **Type Safety**: Strict TypeScript usage throughout

This style guide is a living document and should be updated as the design system evolves.
