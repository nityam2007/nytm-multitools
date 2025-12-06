// Dynamic Blog Post Route | TypeScript
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getBlogEntryBySlug, getAllBlogSlugs } from '@/lib/blog-info';

interface Props {
  params: Promise<{ slug: string }>;
}

// Generate static params for all blog entries
export async function generateStaticParams() {
  const slugs = getAllBlogSlugs();
  return slugs.map((slug) => ({ slug }));
}

// Generate metadata for SEO (Google Search Console)
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

  // Note: 301 redirect handled in next.config.ts for SEO
  // This page is only rendered if redirect config fails
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">{entry.title}</h1>
        <p className="text-gray-600 mb-4">Redirecting to tool page...</p>
        <a 
          href={`/tools/${entry.toolSlug}`}
          className="text-blue-600 hover:underline"
        >
          Click here if not redirected automatically
        </a>
      </div>
    </div>
  );
}
