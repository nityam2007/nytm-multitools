<p align="center">
  <img src="https://img.shields.io/badge/dynamic/json?url=https://raw.githubusercontent.com/nityam2007/nytm-multitools/main/package.json&query=$.toolCount&label=Tools&color=8b5cf6&style=for-the-badge" alt="Tools" />
  <img src="https://img.shields.io/badge/Next.js-16.3.4-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19.2.7-61dafb?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.9.3-3178c6?style=for-the-badge&logo=typescript" alt="TypeScript" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/License-NSAL_v1.1-8b5cf6?style=flat-square" alt="License" />
  <img src="https://img.shields.io/badge/Ads-None-22c55e?style=flat-square" alt="No Ads" />
  <img src="https://img.shields.io/badge/Price-Free-22c55e?style=flat-square" alt="Free" />
  <img src="https://img.shields.io/badge/Processing-Browser--First-8b5cf6?style=flat-square" alt="Browser-first processing" />
</p>

---

# NYTM MULTITOOLS

**🌐 Website: [nytm.in](https://nytm.in)**

Free online tools for everyone. No ads. No bullshit.

202 tools across text, images, converters, generators, security, coding utilities, and more. Most processing runs in your browser. Analytics and network-tool exceptions are explained in the [Privacy Notice](https://nytm.in/privacy).

> **Note:** The exact tool count is managed dynamically. See [Updating Tool Count](#updating-tool-count) below.

---

## Quick Start

```bash
npm install
npm run dev
```

> Requires Node.js 24+ and npm 11+

---

## What's Inside

<table>
<tr>
<td width="50%">

### 📝 Text Tools
Case conversion, diff checker, find/replace, word counter, line sorter, duplicate remover...

### 🔄 Converters
JSON ↔ YAML ↔ CSV ↔ XML, base conversions, timestamps, colors, units...

### 🎲 Generators
UUID, passwords, hashes, QR codes, barcodes, fake data, lorem ipsum...

</td>
<td width="50%">

### 🔐 Security
Hash generators (MD5, SHA, bcrypt), AES encrypt/decrypt, JWT decoder, password strength...

### 💻 Code & Dev Tools
JSON/HTML/CSS/JS beautifiers & minifiers, regex tester, cron parser, diff checker...

### 🖼️ Image Tools
Resize, compress, crop, rotate, filters, format conversion, base64...

</td>
</tr>
</table>

### ⚡ And More
Calculators, timers, color pickers, emoji picker, keyboard tester, screen info...

---

## Privacy & Data Handling

<table>
<tr>
<td><strong>✅ Client-Side</strong></td>
<td>Most tool processing is local. Some usage calls send input/output text or filenames to our server; analytics and network tools make additional requests. See the privacy notice.</td>
</tr>
<tr>
<td><strong>✅ Self-Hosted Fonts</strong></td>
<td>Fonts (Inter, JetBrains Mono) are bundled at build time via Next.js. No runtime requests to external font CDNs.</td>
</tr>
<tr>
<td><strong>✅ No External Icons</strong></td>
<td>All icons are inline SVG components. No requests to icon CDNs or external services.</td>
</tr>
<tr>
<td><strong>Analytics</strong></td>
<td>Configured PostHog analytics uses identifiers, cookies/storage, page and interaction events. Some configurations permit session replay. There is currently no site-wide consent switch.</td>
</tr>
<tr>
<td><strong>⚠️ Exception</strong></td>
<td>Network features use ipinfo.io, ipify, Google DNS, AllOrigins and our HTTP Headers endpoint. Some AI tools download third-party model assets.</td>
</tr>
</table>

---

## Tech Stack

<table>
<tr>
<td><strong>Runtime</strong></td>
<td>Node.js 24.8.0 / npm 11.6.0</td>
</tr>
<tr>
<td><strong>Framework</strong></td>
<td>Next.js 16.3.4 (Turbopack)</td>
</tr>
<tr>
<td><strong>UI</strong></td>
<td>React 19.2.7 + React Compiler</td>
</tr>
<tr>
<td><strong>Language</strong></td>
<td>TypeScript 5.9.3</td>
</tr>
<tr>
<td><strong>Styling</strong></td>
<td>Tailwind CSS 4.3.2</td>
</tr>
<tr>
<td><strong>Icons</strong></td>
<td>Inline SVG components (no external dependencies)</td>
</tr>
<tr>
<td><strong>Fonts</strong></td>
<td>Inter, JetBrains Mono (self-hosted via next/font)</td>
</tr>
</table>

---

## Business tools and NSheth referrals

NYTM now includes 18 additional browser tools for business workflows. Start at `/business-tools`, read practical tutorials at `/guides`, and meet the studio behind NYTM at `/work-with-nsheth`. All agency content is hosted here; nsheth.in itself is unchanged.

- Launch: WhatsApp links/QR, UTM URLs, vCards, website briefs, launch checklists, email signatures.
- Marketing: SEO previews, social metadata, JSON-LD, and colour contrast.
- Operations: quotations, automation estimates, CSV cleanup, product image batches, catalogues, PDF page organising, metadata removal, and English OCR.
- Existing PDF lock, unlock, and compression now use self-hosted qpdf WebAssembly with verified results.
- OCR uses self-hosted Tesseract 7 and the English tessdata_fast model. Load the engine before working offline in the current tab. Browser cache availability is device-dependent.
- Files stay in tool memory; launch-checklist progress is saved only on request. Recent tools and favourites store tool identifiers. Existing analytics/privacy configuration has not been changed.

### Releases on 5 September 2026

| Version | Scope |
|---|---|
| 2.3.0 | NSheth referrals, business collection, recent tools, compact headers |
| 2.4.0 | Eight business tools |
| 2.5.0 | Five marketing/data tools |
| 2.6.0 | Five image/document tools; 202 total tools |
| 2.7.0 | Verified PDF processing, sidebar and embed fixes |
| 2.8.0 | Four original guides and promotion preparation |
| 2.9.0 | Dependency patches and cross-browser usability checks |
| 2.10.0 | Visible action buttons, readable tool cards, keyboard navigation |
| 2.11.0 | Search-first homepage, URL filters, grid/list views, pins, pagination |
| 2.13.0 | Legal refresh, NSAL v1.1, DPDP notice, precautions and direct contact routes |
| 2.12.0 | SEO titles and search intents, nine crawlable collections, social previews |

### Discovery and SEO maintenance

`lib/tool-discovery.ts` defines the eight registry categories, shared workflows, and featured tool slugs. `HomeToolPicker` in `components/ToolCard.tsx` groups homepage shortcuts into quick picks, PDFs, images, text, code/data, and business. `lib/tool-search.ts` adds task phrases and ranks multi-word queries for the homepage, library, and sidebar. Search state lives in `/tools?q=...&category=...&file=...&scope=...&sort=...&view=...&page=...`; the older `search` parameter is accepted. Pins remain local to the browser.

`lib/seo-intents.ts` contains editorial tool titles and category guidance. These are capability-based phrases, not measured search-volume claims. `lib/seo.ts` produces unique tool metadata, canonical URLs, and structured data. `/categories/[category]` serves the eight registry categories plus a PDF collection with full server-rendered tool lists. Add a matching category description when extending the registry. Sitemap modification dates must reflect an actual content release, rather than every build.

The homepage and guides use links for navigation; native buttons handle local actions. Keep Open and Pin separate, label controls, retain visible keyboard focus, and check 320px layouts in both themes when changing shared discovery styles.

### Runtime asset maintenance

When changing `tesseract.js`, copy the matching worker and all core `.wasm.js` variants into `public/ocr`, retaining licences. The English model comes from `tesseract-ocr/tessdata_fast`. When changing `pdfstudio`, copy its browser JS modules and WASM into `public/pdf-engine`. Keep `public/workers/pdf.worker.mjs` matched to `pdfjs-dist`. Bump the service-worker cache version when changing these files.

## Updating Tool Count

When adding or removing tools, update the count in these locations:

| File | What to Update |
|------|----------------|
| `lib/tools-config.ts` and `lib/business-tools-config.ts` | Add/remove entries; the main registry includes both |
| `app/layout.tsx` | Update `TOOL_COUNT` constant (for SEO metadata) |

**Automatic Updates:** Most of the site uses `lib/site-config.ts` which dynamically calculates the tool count from `toolsConfig.length`. These locations update automatically:
- Homepage stats
- Footer tagline
- Pricing page
- About page
- Privacy/Terms pages
- Contact page FAQ

**Manual Updates Required:**
- `app/layout.tsx` → `TOOL_COUNT` constant (Next.js metadata can't use dynamic imports)
- `README.md`, `COMPONENTS.md`, `goal.md` → Documentation files

The count and SEO-layout scripts read both registry files. Run `node scripts/update-tool-count.js` and `node scripts/generate-seo-layouts.js` after adding tools. Write original guides separately rather than generating repetitive blog variants.

---

## Environment

Create `.env.local`:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=NYTM Tools
NEXT_PUBLIC_POSTHOG_KEY=optional_analytics_key
NEXT_PUBLIC_DONATION_URL=https://razorpay.me/@yourhandle  # optional
```

---

## Support the Project

NYTM is free and always will be. It runs on voluntary donations and is self-funded by the owner when needed.

If you find it useful:
- **Donate**: Visit [nytm.in/pricing](https://nytm.in/pricing)
- **Star**: Give us a ⭐ on GitHub

---

## Disclaimer

NYTM is a project name, not a registered organization or legal entity. Nityam Sheth operates the project as an individual. Service and licence limitations are subject to applicable law; statutory consumer and privacy rights are preserved. See [Terms](https://nytm.in/terms).

---

## Contributing

Found a bug? Want a feature? Open an issue or start a discussion. PRs welcome for bug fixes.

---

## License

<img src="https://img.shields.io/badge/NSAL_v1.1-Source_Available-8b5cf6?style=for-the-badge" alt="NSAL v1.1" />

Licensed under the **NYTM Source Available License (NSAL) v1.1**.

Source code is public for transparency. Not open source. See [LICENSE](LICENSE) for full terms.

Hosted tools and their outputs may be used for lawful personal and client work. Source reuse, rebranding and deployments require permission except for the evaluation and contribution rights in the licence. Third-party dependencies retain their own licences.

---

## Contact

**Nityam Sheth** — hello@nytm.in / hello@nsheth.in

GitHub: [@nityam2007](https://github.com/nityam2007)


### Validation and remaining maintenance

Production builds and TypeScript checks cover all routes. Focused browser checks exercise the new tools, exports, PDF password roundtrips, and offline engine use. Repository-wide lint still contains pre-existing issues in older tools; do not describe it as clean. The current npm audit retains three high advisories in the existing kokoro-js → transformers → sharp dependency chain, for which npm reports no available upstream fix.

Release 2.9.0 validation: production build generated 1,149 routes; changed TypeScript sources have no lint errors. Chrome checks cover 320px layouts, QR and CSV exports, image ZIPs, PDF page order, password roundtrips, and offline OCR. WebKit checks cover CSV cleanup, image ZIPs, PDF export, narrow layouts, and local OCR while connected. WebKit's automated offline mode failed reading image files, so Safari offline OCR remains unverified. Firefox could not launch in this Windows test environment. The sandboxed email preview remains isolated; WebKit automation reported a frame-access diagnostic during that check.

### Validation for the homepage and SEO refresh

The v2.12.0 production build generates 1,158 routes. Focused checks cover Chrome and WebKit search navigation, URL filters, refresh/Back, list/pagination, mobile menu dismissal, and 320–1366px layouts. Chrome keyboard checks include the skip link and focus return; both themes were visually reviewed. All 202 tool metadata records have unique titles and canonical URLs. The nine category collections expose their complete tool lists with JavaScript disabled. Repository-wide legacy lint and dependency caveats above still apply.


### Legal operations and DPDP readiness (5 September 2026)

The current public notices describe the existing implementation; they are not a compliance certification. Analytics remains unchanged by request. The contact page now opens email rather than claiming a simulated form submission succeeded.

Before claiming DPDP readiness, the operator needs to complete and document these operational checks:

- Confirm that hello@nytm.in and the alternate mailbox receive mail and are monitored. Record and resolve privacy requests; the notice sets a 30-day target, subject to shorter legal deadlines, and a maximum of 90 days where the DPDP grievance rule applies.
- Audit production PostHog initialization, replay/masking settings, vendor contracts and retention. Existing tools send raw inputs/outputs to a server action even though its analytics event primarily uses size and metadata. Decide and implement data minimisation and an appropriate consent/withdrawal flow; a notice is not consent. Do not treat IP-derived identifiers as anonymous.
- Set justified retention and deletion schedules for logs, analytics, email and payment records; verify deletion across processors and backups. Verify transfer locations and access controls rather than asserting India-only storage or immediate erasure.
- Before processing children's information, establish applicable age/parental-authority safeguards or prevent that processing. The adult-use statement alone is not verification. Review accessible, language-appropriate notices and requests.
- Maintain an incident response process, provider contacts and a record of disclosures. When applicable, DPDP breach rules require prompt affected-person/Board notification and additional Board details within 72 hours unless extended. Separately assess current CERT-In and other sector-specific obligations; the DPDP transition does not suspend them.
- Review third-party licences, including the background-removal dependency's copyleft terms and bundled models, before distributing or reusing code. NSAL does not override those licences. Have Indian counsel review the licence, privacy practices and terms against actual operations.

Official references: [DPDP Act](https://www.meity.gov.in/static/uploads/2024/06/2bf1f0e9f04e6fb4f8fef35e82c42aa5.pdf), [commencement notification](https://www.meity.gov.in/static/uploads/2025/11/c56ceae6c383460ca69577428d36828b.pdf), [final Rules](https://www.meity.gov.in/static/uploads/2025/11/53450e6e5dc0bfa85ebd78686cadad39.pdf), and [MeitY rules and corrigendum index](https://www.meity.gov.in/documents/act-and-policies/digital-personal-data-protection-rules-2025-gDOxUjMtQWa?pageTitle=Digital-Personal-Data-Protection-Rules-2025). Core duties and rights have a notified eighteen-month phase; do not present the whole framework as already enforceable or ignore other currently applicable law.

Release v2.13.0 validation: production build and TypeScript passed (1,159 generated pages); focused ESLint passed. Chrome and WebKit checked all four legal/contact pages at 320, 390 and 1,366 px (24 checks), with no horizontal overflow, broken section targets or short action buttons. Canonical URLs and JavaScript-disabled privacy content passed. The privacy-request anchor and mailto destination were verified; no email was sent. Dark and light layouts were visually reviewed.

## UI release verification — v2.16.0

The v2.14–v2.16 releases add consistent upload controls, connected field labels, fluid workspace and homepage spacing, and accessible mobile tool navigation. Public tool URLs are preserved; internal UI demos are excluded from indexing.

Final checks: `npx tsc --noEmit` passed; repository-wide `npx eslint .` reported zero errors and 100 warnings. Remaining warnings include existing image-element guidance, unused variables and effect dependencies. CommonJS maintenance scripts have a language-specific lint override. The SDK readiness effect has a documented local exception so analytics initialization behavior stays unchanged.

After the request to stop testing, verification used TypeScript and ESLint only; no further browser tests or production builds were run locally. These checks do not guarantee every legacy tool's runtime behavior or search rankings.

## Homepage release verification - v2.17.0

The homepage now puts search and direct tool shortcuts first, with six task filters, separate pin controls, compact category navigation, and contextual NSheth services. Existing colours, tool URLs, metadata, and analytics configuration are retained. Search supports initial suggestions, arrow-key selection, Enter, Escape, clear/reset, and the `/` shortcut. The service-worker cache version advances with this release.

Validation: the production build and TypeScript passed with 1,159 generated pages. Changed TypeScript files passed focused ESLint; repository-wide lint reported zero errors and 100 existing warnings. Browser checks covered desktop and phone layouts, both themes, filtering, pin/unpin, search navigation, empty-result recovery, and shortcut focus positioning. A local mobile Lighthouse report scored 88 for performance and 100 for accessibility, best practices, and SEO; these are lab measurements, not evidence of increased conversions. Lighthouse wrote its report but reported a Windows temporary-directory cleanup error afterward.
