<!-- Project overview and contributor setup | Markdown -->
# NYTM MULTITOOLS

Free online tools for everyday work. No signup. No ads.

Merge PDFs, resize images, clean up text, format code, and prepare business documents in one place.

[Use the tools](https://nytm.in) · [Browse all tools](https://nytm.in/tools) · [Business tools](https://nytm.in/business-tools) · [Guides](https://nytm.in/guides)

## What you can do

| Tools | Examples |
| --- | --- |
| PDFs & documents | Merge, split, organise, rotate, and convert PDFs |
| Images & photos | Compress, resize, crop, convert, remove backgrounds, and prepare product photos |
| Text & writing | Count words, change case, compare text, and remove duplicate lines |
| Code & data | Format JSON and SQL, test regular expressions, convert data, and clean CSV files |
| Generators & security | Create QR codes, passwords, UUIDs, hashes, and encrypted text |
| Business | Prepare quotations, catalogues, email signatures, WhatsApp links, and website briefs |
| Everyday utilities | Calculators, timers, unit conversions, and network lookups |

Search by tool name or task, browse by category, and pin useful tools for next time. The site supports light and dark themes and works on desktop and mobile.

## Privacy

Most tool processing runs in your browser. Some usage calls send input/output text or filenames to the server, and network tools make external requests. The site uses PostHog analytics, including cookies or browser storage and, depending on configuration, session replay.

See the [Privacy Notice](https://nytm.in/privacy) for details and the [Terms of Service](https://nytm.in/terms) for using the hosted tools.

## Run locally

Requires **Node.js 24+** and **npm 11+**. Local evaluation and contribution are permitted under the [licence](LICENSE).

```bash
git clone https://github.com/nityam2007/nytm-multitools.git
cd nytm-multitools
npm ci
npm run dev
```

Open [localhost:3000](http://localhost:3000). See [.env.example](.env.example) for environment configuration.

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run start` | Serve the production build locally |
| `npm run lint` | Run ESLint |

Built with Next.js, React, TypeScript, and Tailwind CSS. Fonts are bundled with the app, and icons use inline SVG.

## Contributing

Found a bug or have an idea? [Open an issue](https://github.com/nityam2007/nytm-multitools/issues). For bug reports, include the tool name, browser, steps to reproduce, and a non-sensitive example where possible.

Bug-fix pull requests are welcome. Read the [repository guide](AGENTS.md) and [component documentation](COMPONENTS.md) before making changes.

## Support

NYTM is supported by voluntary donations and its creator. If you find the tools useful, you can [support the project](https://nytm.in/pricing) or star this repository.

Need a website, online store, or custom tool? [Work with NSheth](https://nytm.in/work-with-nsheth).

## Licence

The source is available under the **NYTM Source Available License (NSAL) v1.1**. It is not an open-source licence.

The hosted tools and their outputs may be used for personal and client work. Source reuse, rebranding, and public deployment require permission except where the licence or applicable law allows otherwise. Third-party components retain their own licences. Read [LICENSE](LICENSE) for the full terms.

## Contact

Created and maintained by [Nityam Sheth](https://github.com/nityam2007).

[hello@nytm.in](mailto:hello@nytm.in) · [hello@nsheth.in](mailto:hello@nsheth.in)
