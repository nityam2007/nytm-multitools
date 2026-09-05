// Blog Layout | TypeScript
import { generateCollectionMetadata } from '@/lib/seo';
import { TOTAL_TOOLS } from '@/lib/site-config';

export const metadata = generateCollectionMetadata({
  title: 'Tool Guides for PDFs, Images, Text & Code | NYTM',
  description: `Explore guides to ${TOTAL_TOOLS} free online tools for PDFs, images, text, code and everyday tasks. Find the right tool and learn how to use it.`,
  path: '/blog',
  keywords: ['free online tools', 'no sign up', 'free converter', 'online tool', 'browser tool'],
});

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
