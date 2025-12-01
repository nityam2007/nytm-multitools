"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { TextArea } from "@/components/TextArea";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";

const tool = getToolBySlug("markdown-preview")!;
const similarTools = getToolsByCategory("dev").filter(t => t.slug !== "markdown-preview");

export default function MarkdownPreviewPage() {
  const [input, setInput] = useState(`# Hello World

This is a **bold** and *italic* text.

## Features

- Item 1
- Item 2
- Item 3

### Code

\`\`\`javascript
console.log("Hello!");
\`\`\`

> This is a blockquote

[Link](https://example.com)
`);

  // Simple markdown to HTML converter
  const parseMarkdown = (md: string): string => {
    let html = md
      // Code blocks
      .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>')
      // Inline code
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      // Headers
      .replace(/^### (.*$)/gm, '<h3>$1</h3>')
      .replace(/^## (.*$)/gm, '<h2>$1</h2>')
      .replace(/^# (.*$)/gm, '<h1>$1</h1>')
      // Bold
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      // Italic
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
      // Images
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />')
      // Blockquotes
      .replace(/^> (.*$)/gm, '<blockquote>$1</blockquote>')
      // Unordered lists
      .replace(/^- (.*$)/gm, '<li>$1</li>')
      // Horizontal rule
      .replace(/^---$/gm, '<hr />')
      // Paragraphs
      .replace(/\n\n/g, '</p><p>')
      // Line breaks
      .replace(/\n/g, '<br />');
    
    // Wrap lists
    html = html.replace(/(<li>[\s\S]*<\/li>)/g, '<ul>$1</ul>');
    
    return `<div class="prose">${html}</div>`;
  };

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <TextArea
            label="Markdown"
            placeholder="Enter markdown..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={20}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Preview</label>
          <div 
            className="bg-[var(--background)] rounded-xl border border-[var(--border)] p-4 min-h-[400px] overflow-auto prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: parseMarkdown(input) }}
            style={{
              ['--tw-prose-headings' as string]: 'var(--foreground)',
              ['--tw-prose-body' as string]: 'var(--foreground)',
            }}
          />
        </div>
      </div>

      <style jsx global>{`
        .prose h1 { font-size: 2em; font-weight: bold; margin: 0.5em 0; }
        .prose h2 { font-size: 1.5em; font-weight: bold; margin: 0.5em 0; }
        .prose h3 { font-size: 1.25em; font-weight: bold; margin: 0.5em 0; }
        .prose p { margin: 0.5em 0; }
        .prose code { background: var(--muted); padding: 0.2em 0.4em; border-radius: 4px; font-size: 0.9em; }
        .prose pre { background: var(--muted); padding: 1em; border-radius: 8px; overflow-x: auto; }
        .prose pre code { background: none; padding: 0; }
        .prose blockquote { border-left: 3px solid var(--primary); padding-left: 1em; margin: 0.5em 0; opacity: 0.8; }
        .prose ul { list-style: disc; padding-left: 1.5em; margin: 0.5em 0; }
        .prose li { margin: 0.25em 0; }
        .prose a { color: var(--primary); text-decoration: underline; }
        .prose hr { border-color: var(--border); margin: 1em 0; }
        .prose img { max-width: 100%; border-radius: 8px; }
      `}</style>
    </ToolLayout>
  );
}
