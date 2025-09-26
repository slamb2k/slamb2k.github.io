/**
 * Blog post types and interfaces
 */

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  publishedAt: string; // ISO date string
  updatedAt?: string;
  author: string;
  featuredImage?: string;
  images: string[];
  tags?: string[];
  categories?: string[];
  originalUrl: string;
  readingTime?: number;
}

export interface BlogMetadata {
  totalPosts: number;
  categories: string[];
  tags: string[];
  authors: string[];
}

export interface BlogListItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  featuredImage?: string;
  readingTime?: number;
  tags?: string[];
}
