#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = query => new Promise(resolve => rl.question(query, resolve));

// Component template
const componentTemplate = (name, type = 'default') => {
  const templates = {
    default: `import React from 'react';
import { cn } from '@/lib/utils';

interface ${name}Props {
  className?: string;
  children?: React.ReactNode;
}

const ${name}: React.FC<${name}Props> = ({ className, children }) => {
  return (
    <div className={cn('', className)}>
      {children}
    </div>
  );
};

export default React.memo(${name});`,

    ui: `import React from 'react';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const ${name.toLowerCase()}Variants = cva(
  '',
  {
    variants: {
      variant: {
        default: '',
        primary: '',
        secondary: '',
      },
      size: {
        default: '',
        sm: '',
        lg: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

interface ${name}Props extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof ${name.toLowerCase()}Variants> {
  children?: React.ReactNode;
}

const ${name} = React.forwardRef<HTMLDivElement, ${name}Props>(
  ({ className, variant, size, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(${name.toLowerCase()}Variants({ variant, size, className }))}
        {...props}
      >
        {children}
      </div>
    );
  }
);

${name}.displayName = '${name}';

export default ${name};`,

    page: `import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const ${name}: React.FC = () => {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen py-24 px-8"
    >
      <motion.section className="max-w-5xl mx-auto">
        <h1 className="text-4xl lg:text-6xl font-bold text-slate-100 mb-6">
          ${name}
        </h1>
        <p className="text-lg text-slate-400">
          Content goes here...
        </p>
      </motion.section>
    </motion.div>
  );
};

export default React.memo(${name});`,
  };

  return templates[type] || templates.default;
};

// Test template
const testTemplate = (name, type = 'default') => `import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ${name} from './${name}';

describe('${name}', () => {
  it('renders without crashing', () => {
    render(<${name} />);
    expect(screen.getByRole('${type === 'ui' ? 'region' : 'generic'}')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<${name} className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('renders children correctly', () => {
    render(<${name}>Test Content</${name}>);
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });
});`;

// Main function
async function main() {
  try {
    console.log('🧩 Component Generator\n');

    const name = await question('Component name (e.g., Button, Card): ');
    if (!name || !/^[A-Z][a-zA-Z0-9]*$/.test(name)) {
      console.error(
        '❌ Invalid component name. Must start with capital letter and contain only letters and numbers.'
      );
      process.exit(1);
    }

    const type = (await question('Component type (default/ui/page) [default]: ')) || 'default';
    if (!['default', 'ui', 'page'].includes(type)) {
      console.error('❌ Invalid type. Must be: default, ui, or page');
      process.exit(1);
    }

    const withTest = await question('Include test file? (y/n) [y]: ');
    const includeTest = withTest.toLowerCase() !== 'n';

    // Determine directory based on type
    let targetDir;
    switch (type) {
      case 'ui':
        targetDir = path.join(projectRoot, 'src', 'components', 'ui');
        break;
      case 'page':
        targetDir = path.join(projectRoot, 'src', 'pages');
        break;
      default:
        targetDir = path.join(projectRoot, 'src', 'components', 'generated');
    }

    // Create directory if it doesn't exist
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    // Generate component file
    const componentPath = path.join(targetDir, `${name}.tsx`);
    if (fs.existsSync(componentPath)) {
      console.error(`❌ Component ${name} already exists at ${componentPath}`);
      process.exit(1);
    }

    fs.writeFileSync(componentPath, componentTemplate(name, type));
    console.log(`✅ Created component: ${componentPath}`);

    // Generate test file if requested
    if (includeTest) {
      const testPath = path.join(targetDir, `${name}.test.tsx`);
      fs.writeFileSync(testPath, testTemplate(name, type));
      console.log(`✅ Created test: ${testPath}`);
    }

    // Update barrel export for UI components
    if (type === 'ui') {
      const indexPath = path.join(targetDir, 'index.ts');
      let indexContent = '';

      if (fs.existsSync(indexPath)) {
        indexContent = fs.readFileSync(indexPath, 'utf-8');
      }

      const exportLine = `export { default as ${name} } from './${name}';\n`;
      if (!indexContent.includes(exportLine)) {
        indexContent += exportLine;
        fs.writeFileSync(indexPath, indexContent);
        console.log(`✅ Updated barrel export: ${indexPath}`);
      }
    }

    console.log('\n🎉 Component generated successfully!');
    console.log(`\nTo use your component:`);
    console.log(
      `import ${name} from '@/components/${type === 'ui' ? 'ui' : type === 'page' ? 'pages' : 'generated'}/${name}';`
    );
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

// Run the generator
main();
