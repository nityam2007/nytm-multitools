# GitHub Copilot Instructions

## Core Behavior

**Always use complete, working code.** No placeholders, no TODOs, no incomplete implementations. 90%+ success rate expected with latest libraries and syntax.

**Be concise.** Minimal explanations. Code speaks for itself. Only essential comments.

**No unsolicited files.** Never create test files, batch scripts, shell scripts, or additional files unless explicitly requested.

## File Headers

Add appropriate comment block at the top of every file based on type:

```javascript
// [File purpose/name] | JavaScript/TypeScript
```

```typescript
// [Component/Utility Name] | TypeScript
```

```css
/* [Stylesheet purpose] | CSS */
```

```python
# [Script purpose] | Python
```

Adapt syntax to avoid errors (use `<!--` for HTML, `#` for Python/Shell, etc.).

## Design Philosophy

**Swiss style keywords:** Apple, Swiss, Modern, Minimal, Interactive, Simple

- Clean typography and generous whitespace
- Functional, purposeful design
- Interactive but not distracting
- Focus on content and usability

**Visual elements:**
- Use SVG icons over emoji
- Icon libraries: Lucide, Heroicons, or inline SVG
- Avoid emoji characters in UI and code comments

## Code Organization

### File Length Management

**If a file exceeds 1000 lines of code:**

1. **Create backup first:**
   ```bash
   # Before splitting, backup to ~/BKP/
   cp path/to/code.txt ~/BKP/code.txt.bak
   ```

2. **Split by logical function groups:**
   - Group related functions/components
   - Maintain imports/exports correctly
   - Split into: `core.ts`, `utils.ts`, `helpers.ts`, `types.ts`, etc.
   - Never break mid-function or mid-class

3. **Avoid breaking code:**
   - Test import/export paths after split
   - Preserve all dependencies
   - Keep shared types/interfaces accessible
   - Update import statements in affected files

4. **Backup structure:**
   ```
   ~/BKP/
   ├── component.tsx.bak
   ├── utils.ts.bak
   └── [timestamp]/  # Optional: dated backups
   ```

**When to split:**
- File > 1000 LoC
- Multiple unrelated concerns in one file
- Difficult to navigate/maintain

**When NOT to split:**
- Would create artificial separation
- Tightly coupled code that belongs together
- Split would reduce code clarity

## General Coding Standards

- **Latest syntax**: Modern ES2024+, TypeScript 5.x patterns
- **No test files** unless explicitly requested
- **No build scripts** (run.bat, install.sh) unless explicitly requested
- **Error handling**: Always include try-catch for operations that can fail
- **Type safety**: Proper TypeScript types, no `any` unless necessary
- **Comments**: Only where logic is non-obvious, avoid stating the obvious

## What NOT to Do

- Create test files automatically
- Generate README.md unless asked
- Write batch/shell scripts for basic tasks
- Use placeholders like `// TODO: implement`
- Over-explain in comments
- Use emoji in code or UI
- Break code when refactoring/splitting

## What TO Do

- Complete, working implementations
- Add file header comments
- Handle errors gracefully
- Use SVG icons instead of emoji
- Modern, clean code following Swiss design principles
- Backup files before major refactoring (>1000 LoC splits)
- Maintain code integrity during splits

## Icon Usage Examples

**Good:**
```tsx
<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
</svg>

// Or with icon library
import { Check, X, Info } from 'lucide-react';
<Check className="w-5 h-5" />
```

**Bad:**
```tsx
<span>✓</span>  // Avoid emoji
<span>❌</span>  // Avoid emoji
<span>ℹ️</span>  // Avoid emoji
```

## Favicon Setup (Next.js)

**Required files in `/app` directory:**

| File | Size | Purpose |
|------|------|---------|
| `favicon.ico` | 48x48 | Browser tab icon (legacy) |
| `icon.png` | 192x192 | Modern browsers, PWA |
| `icon.svg` | Scalable | Vector icon for high DPI |
| `apple-icon.png` | 180x180 | iOS home screen |

**Next.js auto-detection:** Place files directly in `/app` folder. Next.js automatically generates correct `<link>` tags.

**Alternative - Metadata API:**
```tsx
// app/layout.tsx
export const metadata: Metadata = {
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '48x48' },
      { url: '/icon.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};
```

**For manual HTML (non-Next.js):**
```html
<link rel="icon" href="/favicon.ico" sizes="48x48" />
<link rel="icon" href="/icon.svg" type="image/svg+xml" />
<link rel="apple-touch-icon" href="/apple-icon.png" />
```