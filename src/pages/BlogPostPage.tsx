import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Calendar, Clock, Tag } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { MDXModule } from '@/types/blog';

const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [module, setModule] = useState<MDXModule | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setError('No slug provided');
      setLoading(false);
      return;
    }

    const loadPost = async () => {
      try {
        setLoading(true);
        setError(null);

        // Dynamically import the MDX file
        const mdxModule = (await import(`../content/blog/${slug}.mdx`)) as MDXModule;

        if (!mdxModule) {
          throw new Error('Post not found');
        }

        setModule(mdxModule);
      } catch (err) {
        console.error('Error loading blog post:', err);
        setError('Post not found');
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-8 lg:px-16 py-12 lg:py-24">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-800/50 rounded mb-4 w-3/4" />
          <div className="h-4 bg-slate-800/50 rounded mb-2 w-1/2" />
          <div className="h-64 bg-slate-800/50 rounded mt-8" />
        </div>
      </div>
    );
  }

  if (error || !module) {
    return (
      <div className="max-w-4xl mx-auto px-8 lg:px-16 py-12 lg:py-24 text-center">
        <h1 className="text-3xl font-bold text-red-400 mb-4">Post Not Found</h1>
        <p className="text-slate-400 mb-8">
          {error || "The blog post you're looking for doesn't exist."}
        </p>
        <Link
          to="/blog"
          className="inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors"
        >
          <ChevronLeft size={20} className="mr-1" />
          Back to Blog
        </Link>
      </div>
    );
  }

  const { frontmatter, default: MDXContent } = module;
  const publishDate = new Date(frontmatter.date);
  const formattedDate = publishDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <motion.article
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-4xl mx-auto px-8 lg:px-16 py-12 lg:py-24"
    >
      {/* Back button */}
      <Link
        to="/blog"
        className="inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors mb-8"
      >
        <ChevronLeft size={20} className="mr-1" />
        {t('nav.blog')}
      </Link>

      {/* Article header */}
      <header className="mb-12">
        <h1 className="text-3xl lg:text-5xl font-bold bg-gradient-to-r from-purple-300 to-pink-500 bg-clip-text text-transparent mb-4 leading-tight">
          {frontmatter.title}
        </h1>

        {/* Metadata */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
          <div className="flex items-center gap-1">
            <Calendar size={16} />
            <time dateTime={frontmatter.date}>{formattedDate}</time>
          </div>
          {frontmatter.readingTime && (
            <div className="flex items-center gap-1">
              <Clock size={16} />
              <span>{frontmatter.readingTime} min read</span>
            </div>
          )}
        </div>

        {/* Tags */}
        {frontmatter.tags && frontmatter.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {frontmatter.tags.map((tag: string) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-purple-500/10 text-purple-300 rounded-full border border-purple-500/20"
              >
                <Tag size={12} />
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>

      {/* Article content */}
      <div
        className="prose prose-invert prose-lg max-w-none
        prose-headings:text-slate-100
        prose-h1:text-3xl prose-h1:font-bold prose-h1:mb-6 prose-h1:mt-8
        prose-h2:text-2xl prose-h2:font-semibold prose-h2:mb-4 prose-h2:mt-6 prose-h2:text-purple-300
        prose-h3:text-xl prose-h3:font-semibold prose-h3:mb-3 prose-h3:mt-4 prose-h3:text-purple-400
        prose-p:text-slate-300 prose-p:leading-relaxed prose-p:mb-4
        prose-a:text-purple-400 prose-a:no-underline hover:prose-a:text-purple-300
        prose-strong:text-slate-100 prose-strong:font-semibold
        prose-code:text-purple-300 prose-code:bg-slate-800/50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
        prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-800 prose-pre:overflow-x-auto
        prose-blockquote:border-l-purple-500 prose-blockquote:bg-slate-900/50 prose-blockquote:text-slate-400
        prose-ul:text-slate-300 prose-ul:list-disc prose-ul:pl-6
        prose-ol:text-slate-300 prose-ol:list-decimal prose-ol:pl-6
        prose-li:mb-2
        prose-hr:border-slate-800
        prose-img:rounded-lg prose-img:shadow-lg
      "
      >
        <MDXContent />
      </div>

      {/* Footer navigation */}
      <footer className="mt-16 pt-8 border-t border-slate-800">
        <Link
          to="/blog"
          className="inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors"
        >
          <ChevronLeft size={20} className="mr-1" />
          Back to all posts
        </Link>
      </footer>
    </motion.article>
  );
};

export default React.memo(BlogPostPage);
