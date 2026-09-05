# Repository guide

This file provides repository guidance for contributors and coding assistants.

## Commands

```bash
npm run dev          # Dev server (Next.js + Turbopack) on :3000
npm run starthttps   # Dev server with experimental HTTPS
npm run build        # Production build
npm run start        # Serve production build
npm run lint         # ESLint (eslint-config-next: core-web-vitals + typescript)
```

Requires Node.js 24+ and npm 11+ (`.nvmrc` pins 24). There is no test runner configured.

### Maintenance scripts (`scripts/`)

```bash
node scripts/update-tool-count.js     # Recount tools from tools-config.ts, rewrite TOOL_COUNT in app/layout.tsx et al.
node scripts/generate-seo-layouts.js  # Regenerate every app/tools/<slug>/layout.tsx from the config's slugs
node scripts/generate-blog-titles.js  # Regenerate lib/blog-info.ts (marked "DO NOT EDIT MANUALLY")
node scripts/update-changelog.js      # Interactive CLI to prepend a Changelog.tsx entry
```

Run `update-tool-count.js` and `generate-seo-layouts.js` after adding/removing tools. Both scripts read `lib/business-tools-config.ts` as well as the core registry.

## Architecture

Next.js 16 App Router, React 19 (React Compiler on via `next.config.ts`), TypeScript, Tailwind CSS 4. `@/*` maps to the repo root. This is a collection of ~202 self-contained browser utilities under one site.

### The tool registry is the source of truth

[lib/tools-config.ts](lib/tools-config.ts) exports `toolsConfig: ToolConfig[]` — the combined core and business registry where every entry (slug, name, description, `category`, `icon`, `inputType`, `keywords`) defines one tool. Everything else derives from it:

- [lib/site-config.ts](lib/site-config.ts) computes `TOTAL_TOOLS = toolsConfig.length` and all taglines. Import counts/strings from here; don't hardcode.
- [lib/seo.ts](lib/seo.ts) generates per-tool `<title>`/description/JSON-LD and holds `categoryMeta` (category display names + descriptions).
- Helpers: `getToolBySlug(slug)`, `getToolsByCategory(category)`, `searchTools(query)`.
- Categories are a fixed union: `text | image | dev | converter | generator | security | network | misc`.

`TOOL_COUNT` in [app/layout.tsx](app/layout.tsx) is a **manual** duplicate of the count (Next metadata can't use dynamic imports) — keep it in sync via `update-tool-count.js`.

### Adding a tool

1. Add a `ToolConfig` entry to `toolsConfig`.
2. Create `app/tools/<slug>/page.tsx` — a `"use client"` component wrapped in `<ToolLayout>`. Pattern (see [app/tools/json-pretty/page.tsx](app/tools/json-pretty/page.tsx)):
   ```tsx
   const tool = getToolBySlug("<slug>")!;
   const similarTools = getToolsByCategory("<category>").filter(t => t.slug !== "<slug>");
   ```
3. Create `app/tools/<slug>/layout.tsx` for SEO — or just run `generate-seo-layouts.js`, which emits the standard layout calling `generateToolMetadata` + `generateToolJsonLd`.
4. Run `update-tool-count.js`.

### UI system

Shared components in [components/](components/) (`Button`, `Input`, `TextArea`, `Select`, `OutputBox`, `FileUpload`, `ToolLayout`, `Toast`, `Skeleton`, …). Global CSS in [app/globals.css](app/globals.css) auto-styles plain HTML elements and provides utility classes (`.btn`, `.alert alert-*`, `.badge`, `.tool-section`, `.option-card`, `.toggle`). Full catalog with usage examples in [COMPONENTS.md](COMPONENTS.md). Colors are CSS variables (`var(--primary)` violet accent, etc.) that adapt to light/dark via `ThemeProvider`. Icons are inline SVG components from [assets/icons/index.tsx](assets/icons/index.tsx) (`getToolIcon(name)`), never an icon CDN or emoji.

`ToolLayout` also drives **embed mode**: it watches for `body.embed-mode` and renders bare tool content (no header/breadcrumb) for the `/embed` and `EmbedButton` flows.

### Client-side execution rule

[apprules.md](apprules.md) is the product contract: **every tool must run 100% in the browser** — no server round-trips, offline-capable after load, no external CDNs, ephemeral data, no auth walls. Heavy compute uses WASM/WebGPU locally (`kokoro-js` TTS, `@imgly/background-removal`, `pdf-lib`, `pdfjs-dist`, `sharp`, `jspdf`). Honor this when building tools.

**Known exceptions to that rule** (don't "fix" them as bugs):
- [lib/actions.ts](lib/actions.ts) `logToolUsage` is a `"use server"` action that sends usage + input metadata to PostHog server-side. It is called from tool pages despite the "no tracking" language in apprules.md.
- `app/api/http-headers/route.ts` and the IP Lookup tool (`ipinfo.io`) are the only intentional network calls.
- Analytics: PostHog (client via `PostHogProvider`, proxied through `/ingest/*` rewrites in `next.config.ts`).

### Other notable pieces

- [proxy.ts](proxy.ts) — CORS allowlist logic (origins overridable via `NEXT_ALLOWED_ORIGINS`).
- [lib/auth.ts](lib/auth.ts) — JWT (jose) admin session for gated/admin surfaces; `Paywall.tsx` + `subscription-context.tsx` exist but the site is free.
- Blog: `app/blog/[slug]` renders from generated [lib/blog-info.ts](lib/blog-info.ts) (one SEO landing page per tool). SEO context in [BLOG-SEO.md](BLOG-SEO.md) / [SEO-IMPROVEMENTS-COMPLETED.md](SEO-IMPROVEMENTS-COMPLETED.md).
- `sitemap.ts` / `robots.ts` / `feed.xml` are generated from the config.

## Conventions (from `.github/copilot-instructions.md`)

- **File header comment** on every file: `// <Purpose> | TypeScript` (`/* ... | CSS */` for CSS, `#` for shell/py).
- Ship complete implementations — no `// TODO` placeholders.
- SVG icons only, never emoji, in UI or comments (Swiss/minimal design language).
- Don't create test/build/shell scripts or extra files unless asked.
- Files over ~1000 LoC: back up to `BKP/` before splitting by logical concern (`.bkp` files in the tree are these backups — ignore them).
