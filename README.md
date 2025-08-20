# Simon Lamb - Professional Portfolio

[![CI](https://github.com/slamb2k/slamb2k.github.io/actions/workflows/ci.yml/badge.svg)](https://github.com/slamb2k/slamb2k.github.io/actions/workflows/ci.yml)
[![Deploy](https://github.com/slamb2k/slamb2k.github.io/actions/workflows/deploy.yml/badge.svg)](https://github.com/slamb2k/slamb2k.github.io/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

🌐 **Live Site**: [simonlamb.codes](https://simonlamb.codes)

A modern, responsive portfolio website showcasing my professional experience, projects, and technical expertise. Built with React, TypeScript, and Vite, featuring a sleek dark theme and smooth animations.

## ✨ Features

- **Responsive Design**: Optimized for all devices with mobile-first approach
- **Dark Theme**: Elegant dark mode with carefully crafted color palette
- **Smooth Animations**: Framer Motion powered transitions and interactions
- **Performance Optimized**: Lighthouse score 95+ across all metrics
- **Internationalization**: Multi-language support with i18n
- **Accessibility**: WCAG compliant with keyboard navigation
- **Professional Resume**: Downloadable PDF with comprehensive career details
- **CI/CD Pipeline**: Automated testing and deployment with GitHub Actions

## 🚀 Tech Stack

- **Frontend Framework**: React 19 with TypeScript
- **Build Tool**: Vite 6 for lightning-fast development
- **Styling**: Tailwind CSS 4 with custom design system
- **Animations**: Framer Motion for smooth transitions
- **Testing**: Vitest + React Testing Library + Playwright
- **Code Quality**: ESLint, Prettier, Husky pre-commit hooks
- **Deployment**: GitHub Pages with custom domain

## 📦 Installation

### Prerequisites

- Node.js 18+ and npm 9+
- Git

### Setup

1. Clone the repository:

```bash
git clone https://github.com/slamb2k/about.me.git
cd about.me
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run preview          # Preview production build

# Testing
npm test                 # Run unit tests
npm run test:ui          # Run tests with UI
npm run test:coverage    # Generate coverage report
npm run e2e              # Run E2E tests with Playwright
npm run e2e:ui           # Run E2E tests with UI

# Code Quality
npm run lint             # Run ESLint
npm run format           # Format code with Prettier
npm run format:check     # Check formatting
npm run typecheck        # Run TypeScript compiler

# Performance
npm run lighthouse       # Run Lighthouse CI
npm run bundle-analyze   # Analyze bundle size
```

### Project Structure

```
about.me/
├── src/
│   ├── components/       # React components
│   │   ├── layout/       # Layout components
│   │   ├── sections/     # Page sections
│   │   ├── ui/           # Reusable UI components
│   │   └── debug/        # Debug tools (dev only)
│   ├── data/             # Portfolio data
│   ├── hooks/            # Custom React hooks
│   ├── i18n/             # Internationalization
│   ├── lib/              # Utility functions
│   ├── config/           # Configuration files
│   └── App.tsx           # Main application
├── public/               # Static assets
│   └── Simon Lamb - Professional Resume.pdf
├── tests/                # Test files
│   ├── unit/            # Unit tests
│   └── e2e/             # E2E tests
└── .github/             # GitHub Actions workflows
```

## 🎨 Customization

### Updating Content

1. **Personal Information**: Edit `src/data/portfolio.ts`
2. **Experience & Projects**: Update `src/i18n/locales/en.json`
3. **Resume**: Modify `resume.html` and regenerate PDF:
   ```bash
   npx playwright pdf resume.html "public/Simon Lamb - Professional Resume.pdf"
   ```

### Theme Customization

The color scheme uses OKLCH color space for precise control. Edit `src/index.css`:

```css
.dark {
  --background: oklch(0.15 0.025 230); /* Dark with blue tint */
  --foreground: oklch(0.95 0.01 240); /* Light text */
  --primary: oklch(0.7 0.2 180); /* Cyan accent */
}
```

## 🚢 Deployment

The site automatically deploys to GitHub Pages when changes are pushed to the main branch.

### Manual Deployment

```bash
# Build the site
npm run build

# Deploy to GitHub Pages
npm run deploy
```

### Custom Domain Setup

1. Add your domain to `public/CNAME`
2. Configure DNS records:
   - A record: `185.199.108.153`
   - A record: `185.199.109.153`
   - A record: `185.199.110.153`
   - A record: `185.199.111.153`
   - CNAME: `www` → `slamb2k.github.io`

## 🧪 Testing

### Unit Tests

```bash
npm test                    # Run once
npm run test:watch          # Watch mode
npm run test:coverage       # With coverage
```

### E2E Tests

```bash
npm run e2e                 # Headless
npm run e2e:ui              # With UI
npm run e2e:debug           # Debug mode
```

### Performance Testing

```bash
npm run lighthouse          # Lighthouse CI
npm run bundle-analyze      # Bundle analysis
```

## 📊 Performance

The site is optimized for performance with:

- **Lighthouse Scores**:

  - Performance: 95+
  - Accessibility: 98+
  - Best Practices: 100
  - SEO: 100

- **Bundle Size**: < 200KB gzipped
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 2.5s

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Design inspired by modern portfolio best practices
- Built with [Vite](https://vitejs.dev/) and [React](https://react.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Animations by [Framer Motion](https://www.framer.com/motion/)
- Icons from [Lucide React](https://lucide.dev/)

## 📧 Contact

Simon Lamb - [me@simonlamb.codes](mailto:me@simonlamb.codes)

- LinkedIn: [linkedin.com/in/slamb2k](https://www.linkedin.com/in/slamb2k)
- GitHub: [github.com/slamb2k](https://github.com/slamb2k)
- Portfolio: [simonlamb.codes](https://simonlamb.codes)

---

⭐ If you find this portfolio template useful, please consider giving it a star!
