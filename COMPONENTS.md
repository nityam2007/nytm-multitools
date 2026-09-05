# UI Components Guide

Modern, minimal design system for NYTM MULTITOOLS (202 tools). Clean, consistent, and accessible across all tools.

## Product UI refinement (v2.14–2.15)

NYTM keeps its violet identity, existing routes and light/dark themes. The direction is a familiar utility workspace: clear actions, readable settings, restrained decoration and predictable keyboard behavior. Design dials: variance 3, motion 2, density 5. Framer informs spacing and hierarchy; native controls serve dense tool forms.

`app/product-ui.css` holds fluid spacing, input and action tokens. Tool titles, homepage headings, workspace padding and section spacing use `clamp()` so they scale between narrow phones and desktop screens. Controls keep at least 44px action targets and mobile text inputs use 16px text. Primary actions use a solid violet surface; secondary actions use a visible border. Focus rings and reduced-motion preferences remain visible and respected.

Use shared `Input`, `Select` and `TextArea` with a `label`. They connect the label, help and validation messages with stable IDs. Native fields need `id`/`htmlFor` or a descriptive accessible name. Never use a placeholder as the only label. Global native form defaults live in `@layer base` so icon padding and component styles can override them; do not restore global padding `!important` rules.

### File selection

Use `FilePicker` for native `onChange` handlers, and `FileUpload` for the older `onFileSelect(file)` API. Both provide a real Browse files button, dashed drop zone, supported formats, selection status and error feedback. The hidden native input is opened by a keyboard-operable button. Drag/drop dispatches the same native change event as the picker.

```tsx
<FilePicker
  label="Choose product images"
  accept="image/jpeg,image/png,image/webp"
  multiple
  maxFiles={30}
  maxSize={20 * 1024 * 1024}
  maxTotalSize={100 * 1024 * 1024}
  onChange={event => setFiles(Array.from(event.target.files || []))}
/>
```

Keep tool-specific decoding, limits and processing errors in each tool; picker validation is an initial check, not a file safety guarantee. Local preview object URLs are revoked on replacement/unmount. The file itself is not sent by the picker.

### Navigation and discovery

Guide, download and service actions use `.btn` or `Button`; navigation still uses real links. Sidebar search reserves space for its icon and clear action, reports empty results, and supports `/` while expanded (the homepage shortcut targets the main search). On mobile, the drawer always shows labels, traps keyboard focus, closes on Escape and restores focus. Desktop collapse remains a saved preference.

The homepage keeps task search, category shortcuts and useful tools near the top. Related guides and the contextual NSheth service links remain after the workspace. Internal UI demo routes carry `noindex`; public tools retain canonical URLs and their search-intent metadata.

## Utility components

Toast, skeleton, output, alert and layout APIs remain available. Use loading states for actual work and preserve the action label while busy. `Button` defaults to `type="button"`; form submission must explicitly use `type="submit"`.

## Core Components

### Button

Solid action button with multiple variants and stable loading states.

```tsx
import { Button } from "@/components/Button";

// Primary action button
<Button variant="primary" size="lg">
  Beautify JSON
</Button>

// With loading state
<Button variant="primary" loading={isProcessing}>
  Processing...
</Button>

// With icon
<Button
  variant="secondary"
  icon={<DownloadIcon />}
  iconPosition="right"
>
  Download
</Button>

// Full width
<Button variant="primary" fullWidth>
  Submit
</Button>
```

**Variants:**
- `primary` - Gradient violet/purple with shadow
- `secondary` - Muted background with border
- `outline` - Transparent with border
- `ghost` - No background, subtle hover
- `destructive` - Red surface for destructive actions

**Sizes:** `sm`, `md`, `lg`

---

### Input

Text input with label, icon support, and error states.

```tsx
import { Input } from "@/components/Input";

// Basic input
<Input
  label="API Key"
  placeholder="Enter your API key..."
  value={apiKey}
  onChange={(e) => setApiKey(e.target.value)}
/>

// With icon
<Input
  label="Search"
  icon={<SearchIcon />}
  iconPosition="left"
  placeholder="Search tools..."
/>

// With error
<Input
  label="Email"
  type="email"
  error="Invalid email address"
  value={email}
/>

// With helper text
<Input
  label="Username"
  helperText="Choose a unique username"
/>
```

---

### TextArea

Multi-line text input with character counting and error states.

```tsx
import { TextArea } from "@/components/TextArea";

// Basic textarea
<TextArea
  label="Input JSON"
  placeholder='{"example": "Paste here..."}'
  value={input}
  onChange={(e) => setInput(e.target.value)}
/>

// With character count
<TextArea
  label="Description"
  value={description}
  onChange={(e) => setDescription(e.target.value)}
  charCount
  maxLength={500}
/>

// With error
<TextArea
  label="Code"
  value={code}
  error="Invalid syntax on line 5"
/>
```

---

### OutputBox

Display formatted output with copy, download, and stats.

```tsx
import { OutputBox } from "@/components/OutputBox";

// Basic output
<OutputBox
  label="Output"
  value={result}
  format="json"
  downloadFileName="result.json"
/>

// With stats
<OutputBox
  label="Formatted Output"
  value={output}
  stats={[
    { label: "Lines", value: lineCount },
    { label: "Size", value: `${fileSize} KB` },
    { label: "Words", value: wordCount }
  ]}
/>

// Disable actions
<OutputBox
  value={output}
  copyable={false}
  downloadable={false}
/>
```

**Formats:** `text`, `json`, `html`, `code`

---

### Select

Modern dropdown with consistent styling.

```tsx
import { Select } from "@/components/Select";

// Basic select
<Select
  label="Output Format"
  options={[
    { value: "json", label: "JSON" },
    { value: "xml", label: "XML" },
    { value: "yaml", label: "YAML" },
  ]}
  value={format}
  onChange={(e) => setFormat(e.target.value)}
/>

// With error
<Select
  label="Country"
  options={countries}
  error="Please select a country"
/>

// With helper text
<Select
  label="Language"
  options={languages}
  helperText="Select your preferred language"
/>
```

---

### FileUpload

Drag-and-drop file upload with preview.

```tsx
import { FileUpload } from "@/components/FileUpload";

// Image upload
<FileUpload
  label="Upload Image"
  onFileSelect={(file) => handleFile(file)}
  accept={{ "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"] }}
  maxSize={10 * 1024 * 1024} // 10MB
  preview
/>

// Any file type
<FileUpload
  label="Upload File"
  onFileSelect={(file) => handleFile(file)}
  accept={{ "*/*": [] }}
  helperText="Maximum file size: 50MB"
  maxSize={50 * 1024 * 1024}
/>
```

---

### ToolLayout

Wrapper for all tool pages with breadcrumb, hero header, and similar tools section.

```tsx
import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";

const tool = getToolBySlug("json-pretty")!;
const similarTools = getToolsByCategory("dev").filter(t => t.slug !== "json-pretty");

export default function JsonPrettyPage() {
  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      {/* Your tool content here */}
      <div className="space-y-6">
        {/* ... */}
      </div>
    </ToolLayout>
  );
}
```

---

## Utility Components & Classes

### Alert Boxes

```tsx
// Info alert
<div className="alert alert-info">
  <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
  <div className="text-sm">Your message here</div>
</div>

// Success alert
<div className="alert alert-success">
  <svg>...</svg>
  <div>Success message</div>
</div>

// Warning alert
<div className="alert alert-warning">
  <svg>...</svg>
  <div>Warning message</div>
</div>

// Error alert
<div className="alert alert-error">
  <svg>...</svg>
  <div>Error message</div>
</div>
```

---

### Option Cards

For selecting between options (indent size, file format, etc.)

```tsx
<div className="grid grid-cols-3 gap-3">
  {[2, 4, 8].map((size) => (
    <button
      key={size}
      onClick={() => setIndentSize(size)}
      className={`option-card ${indentSize === size ? 'active' : ''}`}
    >
      <div className="text-center">
        <div className="text-sm font-semibold">{size} spaces</div>
        <div className="text-xs text-[var(--muted-foreground)]">
          {size === 2 ? 'Compact' : 'Standard'}
        </div>
      </div>
    </button>
  ))}
</div>
```

---

### Badges

```tsx
<span className="badge badge-primary">Primary</span>
<span className="badge badge-success">Success</span>
<span className="badge badge-warning">Warning</span>
<span className="badge badge-error">Error</span>
```

---

### Toggle Switch

```tsx
<label className="toggle">
  <input type="checkbox" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} />
  <span className="toggle-slider"></span>
</label>
```

---

### Select Dropdown

```tsx
<select className="select-modern" value={format} onChange={(e) => setFormat(e.target.value)}>
  <option value="json">JSON</option>
  <option value="xml">XML</option>
  <option value="yaml">YAML</option>
</select>
```

---

### Checkbox

```tsx
<label className="flex items-center gap-2">
  <input
    type="checkbox"
    className="checkbox-modern"
    checked={removeWhitespace}
    onChange={(e) => setRemoveWhitespace(e.target.checked)}
  />
  <span className="text-sm">Remove whitespace</span>
</label>
```

---

### Radio Button

```tsx
<label className="flex items-center gap-2">
  <input
    type="radio"
    name="format"
    value="json"
    className="radio-modern"
    checked={format === 'json'}
    onChange={(e) => setFormat(e.target.value)}
  />
  <span className="text-sm">JSON</span>
</label>
```

---

### Stats Card

```tsx
<div className="stats-card">
  <div className="stats-card-icon">
    📊
  </div>
  <div>
    <div className="text-2xl font-bold tabular-nums">1,234</div>
    <div className="text-xs text-[var(--muted-foreground)]">Total conversions</div>
  </div>
</div>
```

---

### Separator with Text

```tsx
<div className="separator">
  <span>OR</span>
</div>
```

---

### Tool Container

Main container for tool content (used in ToolLayout automatically):

```tsx
<div className="tool-container">
  {/* Your tool content */}
</div>
```

---

### Tool Section

For dividing tool content into sections:

```tsx
<div className="tool-section">
  <label className="block text-sm font-semibold mb-3">Settings</label>
  {/* Section content */}
</div>

<div className="tool-section">
  <label className="block text-sm font-semibold mb-3">Advanced Options</label>
  {/* Section content */}
</div>
```

---

## Layout Patterns

### Standard Tool Layout

```tsx
export default function ToolPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        {/* Info Alert */}
        <div className="alert alert-info">
          <svg>...</svg>
          <div>Tool description and usage info</div>
        </div>

        {/* Input */}
        <TextArea
          label="Input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        {/* Settings (optional) */}
        <div className="tool-section">
          <label className="block text-sm font-semibold mb-3">Settings</label>
          {/* Your settings */}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button variant="primary" onClick={handleProcess} loading={loading} fullWidth>
            Process
          </Button>
          <Button variant="ghost" onClick={handleClear}>
            Clear
          </Button>
        </div>

        {/* Output */}
        <OutputBox
          label="Output"
          value={output}
        />
      </div>
    </ToolLayout>
  );
}
```

---

### Two-Column Layout (Advanced)

```tsx
<div className="grid md:grid-cols-2 gap-6">
  <div className="space-y-4">
    <TextArea label="Input" value={input} onChange={...} />
    {/* Settings */}
  </div>
  <div className="space-y-4">
    <OutputBox label="Output" value={output} />
    {/* Stats */}
  </div>
</div>
```

---

## Animations

All components come with built-in animations:

- **Fade slide up**: `animate-fade-slide-up`
- **Fade slide right**: `animate-fade-slide-right`
- **Float**: `animate-float`
- **Pulse glow**: `animate-pulse-glow`
- **Shimmer**: `animate-shimmer`

Delays: `animate-delay-100`, `animate-delay-200`, etc.

---

## Color System

Uses CSS variables that adapt to light/dark mode:

- `var(--background)` - Page background
- `var(--foreground)` - Primary text
- `var(--card)` - Card backgrounds
- `var(--muted)` - Muted backgrounds
- `var(--muted-foreground)` - Secondary text
- `var(--border)` - Border colors
- `var(--primary)` - Violet accent
- `var(--destructive)` - Error/danger color

Gradient: `gradient-text`, `gradient-bg`

---

## Typography

```tsx
// Headings automatically have proper letter-spacing
<h1 className="text-3xl font-bold">Heading 1</h1>
<h2 className="text-2xl font-bold tracking-[-0.02em]">Heading 2</h2>

// Body text
<p className="text-base" style={{ lineHeight: '1.6' }}>Body text</p>

// Muted text
<p className="text-sm text-[var(--muted-foreground)]">Secondary text</p>

// Monospace for code/numbers
<code className="font-mono text-sm">const x = 10;</code>

// Tabular numbers for data
<span className="tabular-nums">1,234,567</span>
```

---

## Spacing Scale

Use Tailwind's spacing scale:

- `gap-2` = 0.5rem
- `gap-3` = 0.75rem
- `gap-4` = 1rem
- `gap-6` = 1.5rem
- `gap-8` = 2rem

Same for padding (`p-`, `px-`, `py-`) and margin (`m-`, `mx-`, `my-`)

---

## Best Practices

1. **Always use ToolLayout** for tool pages
2. **Use semantic spacing** - `space-y-6` for vertical stacks
3. **Include info alerts** at the top of tools to explain usage
4. **Show success/error feedback** after actions
5. **Disable buttons** when inputs are invalid or processing
6. **Add loading states** for async operations
7. **Include stats** in OutputBox when relevant
8. **Use charCount** for TextArea when there's a limit
9. **Group related settings** with tool-section
10. **Add helpful helperText** to form fields

---

## Examples in Action

Check these tools for implementation examples:
- `/tools/json-pretty` - TextArea, OutputBox, Button, alerts
- More examples coming soon!

---

## Support

For questions or improvements, check the main README.md or open an issue.


## Business workspace additions (September 2026)

`components/business/ToolUI.tsx` provides labelled `Field`, `Choice`, `Result`, `Notice`, and `Workspace` components. Use `Workspace` for the existing ToolLayout and related-service invitation. Heavy CSV/image operations run in workers; OCR and qpdf use version-matched local assets. Downloads are never gated by contact forms. Use `lib/browser-files.ts` for safe downloads and escaped printable documents.
