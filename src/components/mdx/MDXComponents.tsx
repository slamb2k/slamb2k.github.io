import React, { HTMLAttributes, ImgHTMLAttributes, AnchorHTMLAttributes } from 'react';
import CodeBlock from './CodeBlock';
import Gist from './Gist';

interface CodeProps extends HTMLAttributes<HTMLElement> {
  className?: string;
  children?: React.ReactNode;
}

interface PreProps extends HTMLAttributes<HTMLPreElement> {
  children?: React.ReactElement<CodeProps>;
}

interface AnchorProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  children?: React.ReactNode;
}

interface ImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  alt?: string;
}

interface BaseProps extends HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
}

const MDXComponents = {
  pre: ({ children, ...props }: PreProps) => {
    const codeElement = children?.props;
    if (codeElement?.children && typeof codeElement.children === 'string') {
      return <CodeBlock className={codeElement.className}>{codeElement.children}</CodeBlock>;
    }
    return <pre {...props}>{children}</pre>;
  },
  code: ({ className, children, ...props }: CodeProps) => {
    // Inline code
    if (!className) {
      return (
        <code
          className="px-1.5 py-0.5 bg-slate-800/50 text-purple-300 rounded text-sm font-mono"
          {...props}
        >
          {children}
        </code>
      );
    }
    // Block code is handled by pre
    return (
      <code className={className} {...props}>
        {children}
      </code>
    );
  },
  h1: ({ children, ...props }: BaseProps) => (
    <h1 className="text-3xl font-bold text-slate-100 mb-6 mt-8" {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, ...props }: BaseProps) => (
    <h2 className="text-2xl font-semibold text-purple-300 mb-4 mt-6" {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }: BaseProps) => (
    <h3 className="text-xl font-semibold text-purple-400 mb-3 mt-4" {...props}>
      {children}
    </h3>
  ),
  p: ({ children, ...props }: BaseProps) => (
    <p className="text-slate-300 leading-relaxed mb-4" {...props}>
      {children}
    </p>
  ),
  ul: ({ children, ...props }: BaseProps) => (
    <ul className="list-disc pl-6 text-slate-300 mb-4 space-y-2" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }: BaseProps) => (
    <ol className="list-decimal pl-6 text-slate-300 mb-4 space-y-2" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }: BaseProps) => (
    <li className="text-slate-300" {...props}>
      {children}
    </li>
  ),
  a: ({ children, href, ...props }: AnchorProps) => (
    <a
      href={href}
      className="text-purple-400 hover:text-purple-300 underline decoration-purple-400/30 hover:decoration-purple-300/50 transition-colors"
      target={href?.startsWith('http') ? '_blank' : undefined}
      rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
      {...props}
    >
      {children}
    </a>
  ),
  blockquote: ({ children, ...props }: BaseProps) => (
    <blockquote
      className="border-l-4 border-purple-500 bg-slate-900/50 pl-4 py-2 mb-4 text-slate-400 italic"
      {...props}
    >
      {children}
    </blockquote>
  ),
  hr: () => <hr className="border-slate-800 my-8" />,
  img: ({ src, alt, ...props }: ImageProps) => (
    <img
      src={src}
      alt={alt || ''}
      className="rounded-lg shadow-lg my-6 max-w-full"
      loading="lazy"
      {...props}
    />
  ),
  strong: ({ children, ...props }: BaseProps) => (
    <strong className="text-slate-100 font-semibold" {...props}>
      {children}
    </strong>
  ),
  em: ({ children, ...props }: BaseProps) => (
    <em className="text-slate-300 italic" {...props}>
      {children}
    </em>
  ),
  Gist,
};

export default MDXComponents;
