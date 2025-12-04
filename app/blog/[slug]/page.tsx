// Dynamic Blog Post Route | TypeScript
import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { getBlogEntryBySlug, getAllBlogSlugs } from '@/lib/blog-info';
import { getToolBySlug } from '@/lib/tools-config';

interface Props {
  params: Promise<{ slug: string }>;
}

// Generate static params for all blog entries
export async function generateStaticParams() {
  const slugs = getAllBlogSlugs();
  return slugs.map((slug) => ({ slug }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const entry = getBlogEntryBySlug(slug);
  
  if (!entry) {
    return {
      title: 'Not Found',
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://nytm.in';

  return {
    title: entry.title,
    description: entry.description,
    keywords: [entry.title, 'free', 'online', 'no sign up', 'tool', entry.category],
    openGraph: {
      title: entry.title,
      description: entry.description,
      type: 'article',
      url: `${baseUrl}/blog/${slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: entry.title,
      description: entry.description,
    },
    alternates: {
      canonical: `${baseUrl}/tools/${entry.toolSlug}`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const entry = getBlogEntryBySlug(slug);
  
  if (!entry) {
    notFound();
  }

  const tool = getToolBySlug(entry.toolSlug);
  
  if (!tool) {
    notFound();
  }

  // Redirect to the actual tool page
  redirect(`/tools/${entry.toolSlug}`);
}
