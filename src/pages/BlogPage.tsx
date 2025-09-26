import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, ChevronRight, Tag } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import blogMetadata from '@/data/blog/metadata/index.json';
import LazySection from '@/components/ui/LazySection';

// Blog post card component
interface BlogCardPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  featuredImage?: string | null;
  readingTime?: number;
  tags?: string[];
  categories?: string[];
}

const BlogCard: React.FC<{ post: BlogCardPost; index: number }> = React.memo(({ post, index }) => {
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
              <time dateTime={post.publishedAt}>{formattedDate}</time>
            </div>
            {post.readingTime && (
              <div className="flex items-center gap-1">
                <Clock size={14} />
                <span>{post.readingTime} min read</span>
              </div>
            )}
          </div>

          {/* Excerpt */}
          <p className="text-slate-400 line-clamp-3 text-sm leading-relaxed">{post.excerpt}</p>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.slice(0, 3).map((tag: string) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-purple-500/10 text-purple-300 rounded-full border border-purple-500/20"
                >
                  <Tag size={10} />
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Read more indicator */}
          <div className="flex items-center text-purple-400 text-sm font-medium group-hover:text-purple-300 transition-colors">
            <span>Read more</span>
            <ChevronRight
              size={16}
              className="ml-1 group-hover:translate-x-1 transition-transform"
            />
          </div>
        </div>
      </Link>
    </motion.article>
  );
});

const BlogPage: React.FC = () => {
  const { t } = useTranslation();

  // Sort posts by date (newest first)
  const sortedPosts = React.useMemo(() => {
    return [...blogMetadata.posts].sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  }, []);

  // Group posts by year
  const postsByYear = React.useMemo(() => {
    const grouped: { [key: string]: typeof sortedPosts } = {};
    sortedPosts.forEach(post => {
      const year = new Date(post.publishedAt).getFullYear().toString();
      if (!grouped[year]) {
        grouped[year] = [];
      }
      grouped[year].push(post);
    });
    return grouped;
  }, [sortedPosts]);

  const years = Object.keys(postsByYear).sort((a, b) => Number(b) - Number(a));

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-6xl mx-auto px-8 lg:px-16 py-12 lg:py-24"
    >
      {/* Header */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mb-12"
      >
        <h1 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-purple-300 to-pink-500 bg-clip-text text-transparent mb-2 leading-tight pb-2">
          {t('blog.title')}
        </h1>
        <p className="text-lg text-neutral-500 max-w-2xl">{t('blog.subtitle')}</p>
      </motion.section>

      {/* Blog posts grouped by year */}
      {years.map(year => (
        <LazySection
          key={year}
          fallback={
            <div className="mb-16">
              <div className="h-8 w-20 bg-slate-800/50 rounded mb-6 animate-pulse" />
              <div className="space-y-6">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="h-48 bg-slate-800/50 rounded-lg animate-pulse" />
                ))}
              </div>
            </div>
          }
          rootMargin="150px"
        >
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-slate-300 mb-6 flex items-center">
              <span className="text-purple-400 mr-2">{year}</span>
              <span className="text-sm font-normal text-slate-500">
                ({postsByYear[year].length} {postsByYear[year].length === 1 ? 'post' : 'posts'})
              </span>
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {postsByYear[year].map((post, index) => (
                <BlogCard key={post.id} post={post} index={index} />
              ))}
            </div>
          </section>
        </LazySection>
      ))}

      {/* Empty state */}
      {sortedPosts.length === 0 && (
        <div className="text-center py-16">
          <p className="text-slate-400">No blog posts yet. Check back soon!</p>
        </div>
      )}
    </motion.div>
  );
};

export default React.memo(BlogPage);
