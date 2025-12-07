Browser-Only Execution: Every tool must run 100% inside the user's browser. No server-side processing is allowed.

Zero API Calls: No requests to external servers, third-party APIs, or internal backends.

Offline Capable: The tool must function perfectly even if the internet connection is severed after the initial page load (The "Airplane Mode" Test).

Local AI & Compute: All AI, OCR, or heavy processing must utilize WebAssembly (WASM) or WebGPU locally. No external model calls.

Ephemeral Data: User data must never leave the browser's RAM. It is never logged, uploaded, or stored in a persistent database.

No Authentication: No logins, accounts, sign-ups, or "email to unlock" barriers.

No Tracking or Analytics: No Google Analytics, Facebook Pixels, cookies, or behavioral trackers.

Static Architecture: The site must be fully static (HTML/CSS/JS/WASM bundles only). No dynamic backend generation.

Zero External Dependencies: No loading scripts, fonts, or styles from external CDNs. All assets must be self-hosted/bundled.

Local Input/Output: Inputs are restricted to copy-paste, drag-and-drop, or file upload. Outputs are restricted to download, clipboard copy, or screen rendering.

Ad-Free & Free Forever: Monetization is strictly donation-based. No banner ads, pop-ups, or paywalls.

Speed & Simplicity: Tools must load instantly and require minimal steps. No "gimmick" tools; only high-utility functions.