import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, ChevronRight, Tag } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import LazySection from '@/components/ui/LazySection';
import { blogMetadata } from '@/data/blog-metadata';
import type { BlogMetadata } from '@/data/blog-metadata';

// Blog post card component
const BlogCard: React.FC<{ post: BlogMetadata; index: number }> = React.memo(({ post, index }) => {
  const publishDate = new Date(post.date);
  const formattedDate = publishDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <motion.article
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 + index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      className="group relative p-6 rounded-lg border border-slate-800 hover:border-purple-500/30 hover:bg-purple-950/10 transition-all duration-300 shadow-lg hover:shadow-purple-500/10"
    >
      <Link to={`/blog/${post.slug}`} className="block">
        <div className="flex flex-col space-y-4">
          {/* Title */}
          <h2 className="text-xl font-semibold text-slate-100 group-hover:text-purple-400 transition-colors line-clamp-2">
            {post.title}
          </h2>

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
            <div className="flex items-center gap-1">
              <Calendar size={14} />
              <time dateTime={post.date}>{formattedDate}</time>
            </div>
            {post.readingTime && (
              <div className="flex items-center gap-1">
                <Clock size={14} />
                <span>{post.readingTime} min read</span>
              </div>
            )}
          </div>

          {/* Excerpt */}
          {post.excerpt && <p className="text-slate-400 line-clamp-2">{post.excerpt}</p>}

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.slice(0, 3).map(tag => (
                <div key={tag} className="flex items-center gap-1">
                  <Tag size={12} className="text-purple-400" />
                  <span className="text-xs text-purple-400/70 uppercase tracking-wider">{tag}</span>
                </div>
              ))}
            </div>
          )}

          {/* Read more indicator */}
          <div className="flex items-center gap-1 text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-sm">Read more</span>
            <ChevronRight size={16} />
          </div>
        </div>
      </Link>
    </motion.article>
  );
});

BlogCard.displayName = 'BlogCard';

const BlogPage: React.FC = () => {
  const { t } = useTranslation();

  // Sort posts by date (newest first)
  const blogPosts = useMemo(() => {
    return [...blogMetadata].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, []);

  // Group posts by year
  const postsByYear = useMemo(() => {
    const grouped: { [key: string]: typeof blogPosts } = {};
    blogPosts.forEach(post => {
      const year = new Date(post.date).getFullYear().toString();
      if (!grouped[year]) {
        grouped[year] = [];
      }
      grouped[year].push(post);
    });
    return grouped;
  }, [blogPosts]);

  const years = Object.keys(postsByYear).sort((a, b) => Number(b) - Number(a));

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="max-w-7xl mx-auto px-8 lg:px-16 py-12 lg:py-24"
    >
      {/* Page Subtitle */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-12"
      >
        <p className="text-lg text-neutral-400">{t('blog.subtitle')}</p>
      </motion.div>

      {/* Posts by Year */}
      <div className="space-y-16">
        {years.map(year => (
          <LazySection key={year}>
            <div>
              {/* Year Header */}
              <motion.h2
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="text-2xl font-bold text-purple-400 mb-8 flex items-center gap-3"
              >
                <span className="w-12 h-px bg-purple-400/30"></span>
                {year}
                <span className="text-sm text-slate-500 font-normal">
                  ({postsByYear[year].length} {postsByYear[year].length === 1 ? 'post' : 'posts'})
                </span>
              </motion.h2>

              {/* Posts Grid */}
              <div className="grid gap-6 lg:grid-cols-2">
                {postsByYear[year].map((post, index) => (
                  <BlogCard key={post.slug} post={post} index={index} />
                ))}
              </div>
            </div>
          </LazySection>
        ))}
      </div>

      {/* Empty State */}
      {blogPosts.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center py-16"
        >
          <p className="text-lg text-slate-500">{t('blog.noPosts')}</p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default BlogPage;
