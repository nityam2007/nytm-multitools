# NYTM MULTITOOLS - Project Goals

> **Motto: Keep NYTM Always Free, Always Ad-Free**

## Current Status ✅

- **202+ Tools** implemented and functional
- **8 Categories**: Text, Converters, Generators, Security, Code & Dev, Image Tools, Network, Misc
- **Tech Stack**: Next.js 16.2, React 19.2, TypeScript 5.9, Tailwind CSS 4.3
- **Hosting**: Vercel (Free plan)
- **PWA**: Installable, offline-capable via service worker
- **100% Free** - No paywalls, no premium tiers, no ads, forever

## Performance Metrics

| Metric | Current | Target |
|--------|---------|--------|
| Homepage TTFB | ~150ms | <100ms |
| Tool Page (cached) | ~80ms | <50ms |
| Concurrent Requests | Vercel-managed | 100+ |
| Build Time | ~30s | <2min ✅ |

> Concurrency is handled by Vercel's edge/CDN — static pages scale automatically on the free plan; there is no self-managed request pool.

## Roadmap

### Phase 1 - Core Optimization ✅
- [x] Implement all tools (202+)
- [x] Minimal design component system
- [x] Dark mode support
- [x] Client-side processing (privacy-first)
- [x] Multi-threaded request handling
- [x] HTTP/2 multiplexing — provided by Vercel edge (HTTP/2 + H3 by default)
- [x] Response streaming — Next 16 App Router streams RSC by default
- [x] Edge caching headers — `s-maxage` + `stale-while-revalidate` on tool pages, `immutable` on assets (next.config.ts)

### Phase 2 - Performance & Scale ✅
- [x] PWA support for offline usage — installable manifest + standalone display
- [x] Service Worker caching — stale-while-revalidate shell/pages, skips analytics & external APIs (public/sw.js)
- [x] Static page generation for tools — 1123 pages prerendered at build (SSG), zero forced-dynamic
- [x] Lazy loading optimization — heavy libs (jsPDF, pdf.js, bg-removal) dynamically imported on demand

### Phase 3 - More Tools ✅
- [x] Core roadmap complete — 202+ tools cover the planned surface; further tools added ad-hoc as needed

## Architecture Goals

1. **Client-First Processing** - All tools run in browser for privacy
2. **Zero Data Storage** - No user data saved on servers
3. **Fast Cold Starts** - Turbopack for instant HMR
4. **Modular Design** - Easy to add new tools
5. **High Concurrency** - Handle 100+ simultaneous requests

## No External Dependencies

- **Icons**: All SVG icons are inline components (no icon CDNs)
- **Fonts**: Self-hosted via next/font (no Google Fonts runtime requests)
- **API Calls**: Only IP Lookup uses external API (ipinfo.io) - disclosed

## Core Principles

- **Always Free** - No premium features, everything accessible to everyone
- **No Ads** - Clean, distraction-free experience
- **No Tracking** - PostHog is optional and privacy-respecting
- **No Sign-up Required** - Use any tool instantly
- **Open Performance** - Transparent benchmarks
- **Donation Only** - Supporters = donors, not premium users


## September 2026 business release

- [x] 18 additional browser tools, 202 total.
- [x] NSheth referral content on NYTM only.
- [x] Four practical guides and tool-to-guide links.
- [x] Versioned commits and tags for each feature batch.
- [x] Local backup created before changes; excluded from Git.
- [x] Existing privacy/analytics configuration retained as requested.
- [ ] Search Console ownership verification and sitemap submission: requires the domain owner account.
- [ ] Publish launch posts and run ads: copy is prepared in SEO-IMPROVEMENTS-COMPLETED.md; no external posting or ad spend has occurred.

The older performance and SEO estimates above are historical planning notes, not measurements from this release.
