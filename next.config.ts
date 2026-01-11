import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  
  // Performance optimizations for high concurrency
  compress: true,
  poweredByHeader: false,
  
  // SEO redirects
  async redirects() {
    return [
      // Redirect www to non-www for SEO consolidation
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.nytm.in',
          },
        ],
        destination: 'https://nytm.in/:path*',
        permanent: true,
      },
    ];
  },
  
  // Enable HTTP/2 streaming and improved caching
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
        ],
      },
      {
        // Cache static assets aggressively
        source: '/assets/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          },
        ],
      },
      {
        // Cache tool pages for better concurrent handling
        source: '/tools/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=3600, stale-while-revalidate=86400'
          },
        ],
      },
    ];
  },
  
  async rewrites() {
    return [
      {
        source: '/ingest/static/:path*',
        destination: 'https://eu-assets.i.posthog.com/static/:path*',
      },
      {
        source: '/ingest/:path*',
        destination: 'https://eu.i.posthog.com/:path*',
      },
    ];
  },
  
  // Enable support for PostHog trailing slash API requests
  skipTrailingSlashRedirect: true,
  
  // Experimental features for better performance
  experimental: {
    // Enable parallel route fetching
    parallelServerCompiles: true,
    parallelServerBuildTraces: true,
  },
};

export default nextConfig;
