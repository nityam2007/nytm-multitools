<p align="center">
  <img src="https://img.shields.io/badge/dynamic/json?url=https://raw.githubusercontent.com/nityam2007/nytm-multitools/main/package.json&query=$.toolCount&label=Tools&color=8b5cf6&style=for-the-badge" alt="Tools" />
  <img src="https://img.shields.io/badge/Next.js-16.0.6-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19.2.0-61dafb?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.9.3-3178c6?style=for-the-badge&logo=typescript" alt="TypeScript" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/License-NSAL_v1.0-8b5cf6?style=flat-square" alt="License" />
  <img src="https://img.shields.io/badge/Ads-None-22c55e?style=flat-square" alt="No Ads" />
  <img src="https://img.shields.io/badge/Price-Free-22c55e?style=flat-square" alt="Free" />
  <img src="https://img.shields.io/badge/Privacy-Client--Side-8b5cf6?style=flat-square" alt="Privacy" />
</p>

---

# NYTM MULTITOOLS

**🌐 Website: [nytm.in](https://nytm.in)**

Free online tools for everyone. No ads. No bullshit.

171+ tools across text, images, converters, generators, security, coding utilities, and more. Everything runs in your browser — your data stays with you.

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
<td>All tools process data in your browser. Nothing is sent to any server.</td>
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
<td><strong>✅ No Tracking</strong></td>
<td>Optional privacy-respecting analytics (PostHog) only. No advertising trackers.</td>
</tr>
<tr>
<td><strong>⚠️ Exception</strong></td>
<td>IP Lookup tool uses ipinfo.io API (clearly disclosed on the tool page).</td>
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
<td>Next.js 16.0.6 (Turbopack)</td>
</tr>
<tr>
<td><strong>UI</strong></td>
<td>React 19.2.0 + React Compiler</td>
</tr>
<tr>
<td><strong>Language</strong></td>
<td>TypeScript 5.9.3</td>
</tr>
<tr>
<td><strong>Styling</strong></td>
<td>Tailwind CSS 4.1.17</td>
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

## Updating Tool Count

When adding or removing tools, update the count in these locations:

| File | What to Update |
|------|----------------|
| `lib/tools-config.ts` | Add/remove tool from `toolsConfig` array (this is the source of truth) |
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

NYTM is a project name, not a registered organization or legal entity. The owner (Nityam Sheth) and all affiliated third-party services are not liable for any damages arising from use. Tools are provided "as-is" without warranty. See [Terms](https://nytm.in/terms).

---

## Contributing

Found a bug? Want a feature? Open an issue or start a discussion. PRs welcome for bug fixes.

---

## License

<img src="https://img.shields.io/badge/NSAL_v1.0-Source_Available-8b5cf6?style=for-the-badge" alt="NSAL v1.0" />

Licensed under the **NYTM Source Available License (NSAL) v1.0**.

Source code is public for transparency. Not open source. See [LICENSE](LICENSE) for full terms.

Third-party dependencies retain their original open source licenses.

---

## Contact

**Nityam Sheth** — hello@nytm.in / hello@nsheth.in

GitHub: [@nityam2007](https://github.com/nityam2007)
