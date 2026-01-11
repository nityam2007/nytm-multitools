// Dynamic Blog Post Route | TypeScript
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getBlogEntryBySlug, getAllBlogSlugs, blogEntries } from '@/lib/blog-info';
import { toolsConfig } from '@/lib/tools-config';

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
    title: `${entry.title} - Free Online Tool | NYTM`,
    description: `${entry.description} Use this free online tool with no sign up required. Works in your browser instantly.`,
    keywords: [entry.title, 'free', 'online', 'no sign up', 'tool', entry.category, 'browser tool'],
    openGraph: {
      title: `${entry.title} - Free Online Tool`,
      description: entry.description,
      type: 'article',
      url: `${baseUrl}/blog/${slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${entry.title} - Free Online Tool`,
      description: entry.description,
    },
    alternates: {
      canonical: `${baseUrl}/blog/${slug}`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

// Get related tools by category
function getRelatedTools(category: string, currentToolSlug: string) {
  return blogEntries
    .filter(e => e.category === category && e.toolSlug !== currentToolSlug)
    .slice(0, 6);
}

// Get tool config for additional info
function getToolConfig(toolSlug: string) {
  return toolsConfig.find(t => t.slug === toolSlug);
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const entry = getBlogEntryBySlug(slug);
  
  if (!entry) {
    notFound();
  }

  const toolConfig = getToolConfig(entry.toolSlug);
  const relatedTools = getRelatedTools(entry.category, entry.toolSlug);

  return (
    <article className="max-w-4xl mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-[var(--muted-foreground)]">
        <Link href="/" className="hover:text-violet-500 transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/blog" className="hover:text-violet-500 transition-colors">Tools</Link>
        <span className="mx-2">/</span>
        <span className="text-[var(--foreground)]">{entry.title}</span>
      </nav>

      {/* Main Content */}
      <header className="mb-8">
        <span className="inline-block px-3 py-1 text-xs font-medium bg-violet-500/10 text-violet-500 rounded-full mb-4 capitalize">
          {entry.category}
        </span>
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{entry.title}</h1>
        <p className="text-lg text-[var(--muted-foreground)] leading-relaxed">
          {entry.description}
        </p>
      </header>

      {/* CTA to Tool */}
      <div className="bg-gradient-to-r from-violet-500/10 to-purple-500/10 rounded-2xl p-6 md:p-8 mb-10 border border-violet-500/20">
        <h2 className="text-xl font-semibold mb-3">Use This Tool Now</h2>
        <p className="text-[var(--muted-foreground)] mb-4">
          No sign up required. Works instantly in your browser. 100% free.
        </p>
        <Link
          href={`/tools/${entry.toolSlug}`}
          className="inline-flex items-center gap-2 px-6 py-3 bg-violet-500 hover:bg-violet-600 text-white font-medium rounded-xl transition-colors"
        >
          <span>Open {toolConfig?.name || entry.title}</span>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>
      </div>

      {/* Features Section */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Why Use This Tool?</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex gap-3 p-4 bg-[var(--muted)] rounded-xl">
            <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <div>
              <h3 className="font-medium mb-1">No Registration</h3>
              <p className="text-sm text-[var(--muted-foreground)]">Use instantly without creating an account</p>
            </div>
          </div>
          <div className="flex gap-3 p-4 bg-[var(--muted)] rounded-xl">
            <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <div>
              <h3 className="font-medium mb-1">100% Free</h3>
              <p className="text-sm text-[var(--muted-foreground)]">No hidden fees or premium features</p>
            </div>
          </div>
          <div className="flex gap-3 p-4 bg-[var(--muted)] rounded-xl">
            <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <div>
              <h3 className="font-medium mb-1">Privacy First</h3>
              <p className="text-sm text-[var(--muted-foreground)]">Data processed in your browser, never uploaded</p>
            </div>
          </div>
          <div className="flex gap-3 p-4 bg-[var(--muted)] rounded-xl">
            <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <div>
              <h3 className="font-medium mb-1">Works Offline</h3>
              <p className="text-sm text-[var(--muted-foreground)]">Many tools work without internet connection</p>
            </div>
          </div>
        </div>
      </section>

      {/* How to Use */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">How to Use</h2>
        <ol className="space-y-3">
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-7 h-7 bg-violet-500 text-white rounded-full flex items-center justify-center text-sm font-medium">1</span>
            <p className="pt-0.5">Click the button above to open the tool</p>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-7 h-7 bg-violet-500 text-white rounded-full flex items-center justify-center text-sm font-medium">2</span>
            <p className="pt-0.5">Enter or paste your content into the input area</p>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-7 h-7 bg-violet-500 text-white rounded-full flex items-center justify-center text-sm font-medium">3</span>
            <p className="pt-0.5">Get instant results and copy or download the output</p>
          </li>
        </ol>
      </section>

      {/* Related Tools */}
      {relatedTools.length > 0 && (
        <section className="mt-12 pt-8 border-t border-[var(--border)]">
          <h2 className="text-2xl font-bold mb-6">Related Tools</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {relatedTools.map((related) => (
              <Link
                key={related.blogSlug}
                href={`/tools/${related.toolSlug}`}
                className="p-4 bg-[var(--muted)] hover:bg-violet-500/10 rounded-xl transition-colors group"
              >
                <h3 className="font-medium mb-1 group-hover:text-violet-500 transition-colors">{related.title}</h3>
                <p className="text-sm text-[var(--muted-foreground)] line-clamp-2">{related.description}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
