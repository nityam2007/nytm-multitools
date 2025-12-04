// Blog Layout | TypeScript
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Online Tools - No Sign Up Required',
  description: 'Browse our collection of 2800+ free online tools. No registration, no email, no downloads. Text tools, image converters, developer utilities, and more.',
  keywords: ['free online tools', 'no sign up', 'free converter', 'online tool', 'browser tool'],
  openGraph: {
    title: 'Free Online Tools - No Sign Up Required',
    description: 'Browse our collection of 2800+ free online tools. No registration required.',
    type: 'website',
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
