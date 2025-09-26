import React, { useEffect, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, ChevronLeft, Tag, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';
import { BlogPost } from '@/types/blog';

const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useTranslation();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadPost = async () => {
      if (!slug) {
        setError(true);
        setLoading(false);
        return;
      }

      try {
        // Load post metadata
        const postData = await import(`@/data/blog/posts/${slug}.json`);
        setPost(postData.default);

        // Load post content from JSON (content field)
        // Since we stored content in the JSON file
        setContent(postData.default.content || '');

        setLoading(false);
      } catch (err) {
        console.error('Failed to load blog post:', err);
        setError(true);
        setLoading(false);
      }
    };

    loadPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-8 lg:px-16 py-12 lg:py-24">
        <div className="animate-pulse">
          <div className="h-8 w-32 bg-slate-800/50 rounded mb-4" />
          <div className="h-12 bg-slate-800/50 rounded mb-6" />
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-4 bg-slate-800/50 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return <Navigate to="/blog" replace />;
  }

  const publishDate = new Date(post.publishedAt);
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
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <Link
          to="/blog"
          className="inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors"
        >
          <ChevronLeft size={20} />
          <span>Back to Blog</span>
        </Link>
      </motion.div>

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mb-8"
      >
        <h1 className="text-3xl lg:text-5xl font-bold text-white mb-4 leading-tight">
          {post.title}
        </h1>

        {/* Metadata */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
          <div className="flex items-center gap-1">
            <User size={14} />
            <span>{post.author}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar size={14} />
            <time dateTime={post.publishedAt}>{formattedDate}</time>
          </div>
          {post.readingTime && (
            <div className="flex items-center gap-1">
              <Clock size={14} />
              <span>{post.readingTime} min read</span>
            </div>
          )}
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {post.tags.map((tag: string) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-3 py-1 text-xs bg-purple-500/10 text-purple-300 rounded-full border border-purple-500/20"
              >
                <Tag size={12} />
                {tag}
              </span>
            ))}
          </div>
        )}
      </motion.header>

      {/* Featured Image */}
      {post.featuredImage && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8 rounded-lg overflow-hidden"
        >
          <img src={post.featuredImage} alt={post.title} className="w-full h-auto" loading="lazy" />
        </motion.div>
      )}

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="prose prose-invert prose-lg max-w-none
          prose-headings:text-slate-100 prose-headings:font-bold
          prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
          prose-p:text-slate-300 prose-p:leading-relaxed
          prose-a:text-purple-400 prose-a:no-underline hover:prose-a:text-purple-300
          prose-strong:text-slate-200 prose-strong:font-semibold
          prose-code:text-purple-300 prose-code:bg-slate-800/50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
          prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-800
          prose-blockquote:border-purple-500 prose-blockquote:text-slate-400
          prose-ul:text-slate-300 prose-ol:text-slate-300
          prose-li:marker:text-purple-500
          prose-hr:border-slate-800"
      >
        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
          {content || post.content}
        </ReactMarkdown>
      </motion.div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mt-12 pt-8 border-t border-slate-800"
      >
        <div className="flex items-center justify-between">
          <Link
            to="/blog"
            className="inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors"
          >
            <ChevronLeft size={20} />
            <span>Back to Blog</span>
          </Link>

          {post.originalUrl && (
            <a
              href={post.originalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-slate-500 hover:text-slate-400 transition-colors"
            >
              View original post →
            </a>
          )}
        </div>
      </motion.footer>
    </motion.article>
  );
};

export default React.memo(BlogPostPage);
