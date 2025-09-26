export interface BlogFrontmatter {
  title: string;
  date: string;
  excerpt: string;
  tags?: string[];
  readingTime?: number;
  featuredImage?: string;
}

export interface BlogPost extends BlogFrontmatter {
  slug: string;
  content?: React.ComponentType;
}

export interface MDXModule {
  frontmatter: BlogFrontmatter;
  default: React.ComponentType;
}
