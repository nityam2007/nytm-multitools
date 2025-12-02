"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { TextArea } from "@/components/TextArea";
import { OutputBox } from "@/components/OutputBox";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";
import { logToolUsage } from "@/lib/actions";

const tool = getToolBySlug("markdown-to-html")!;
const similarTools = getToolsByCategory("converter").filter(t => t.slug !== "markdown-to-html");

function markdownToHtml(md: string): string {
  let html = md;
  
  // Code blocks (must be before other transformations)
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
    return `<pre><code class="language-${lang || 'plaintext'}">${escapeHtml(code.trim())}</code></pre>`;
  });
  
  // Inline code
  html = html.replace(/`([^`]+)`/g, "<code>$1</code>");
  
  // Headers
  html = html.replace(/^###### (.+)$/gm, "<h6>$1</h6>");
  html = html.replace(/^##### (.+)$/gm, "<h5>$1</h5>");
  html = html.replace(/^#### (.+)$/gm, "<h4>$1</h4>");
  html = html.replace(/^### (.+)$/gm, "<h3>$1</h3>");
  html = html.replace(/^## (.+)$/gm, "<h2>$1</h2>");
  html = html.replace(/^# (.+)$/gm, "<h1>$1</h1>");
  
  // Bold and italic
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>");
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");
  html = html.replace(/___(.+?)___/g, "<strong><em>$1</em></strong>");
  html = html.replace(/__(.+?)__/g, "<strong>$1</strong>");
  html = html.replace(/_(.+?)_/g, "<em>$1</em>");
  
  // Strikethrough
  html = html.replace(/~~(.+?)~~/g, "<del>$1</del>");
  
  // Links and images
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />');
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  
  // Blockquotes
  html = html.replace(/^> (.+)$/gm, "<blockquote>$1</blockquote>");
  html = html.replace(/<\/blockquote>\n<blockquote>/g, "\n");
  
  // Horizontal rules
  html = html.replace(/^(?:---|\*\*\*|___)$/gm, "<hr />");
  
  // Unordered lists
  html = html.replace(/^[\*\-\+] (.+)$/gm, "<li>$1</li>");
  html = html.replace(/(<li>.*<\/li>\n?)+/g, "<ul>\n$&</ul>\n");
  
  // Ordered lists
  html = html.replace(/^\d+\. (.+)$/gm, "<li>$1</li>");
  
  // Paragraphs
  html = html.replace(/^(?!<[a-z]|$)(.+)$/gm, "<p>$1</p>");
  
  // Line breaks
  html = html.replace(/  $/gm, "<br />");
  
  // Clean up empty paragraphs
  html = html.replace(/<p><\/p>/g, "");
  html = html.replace(/\n{3,}/g, "\n\n");
  
  return html.trim();
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export default function MarkdownToHtmlPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  const handleConvert = async () => {
    if (!input.trim()) return;
    const startTime = Date.now();

    const html = markdownToHtml(input);
    setOutput(html);

    await logToolUsage({
      toolName: tool.name,
      toolCategory: tool.category,
      inputType: "text",
      rawInput: input,
      outputResult: html,
      processingDuration: Date.now() - startTime,
    });
  };

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        <TextArea
          label="Markdown Input"
          placeholder={"# Hello World\n\nThis is a **paragraph** with *emphasis*.\n\n- List item 1\n- List item 2"}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={8}
        />

        <button
          onClick={handleConvert}
          disabled={!input.trim()}
          className="btn btn-primary w-full py-3"
        >
          Convert to HTML
        </button>

        <div className="flex gap-2 mb-2">
          <button
            onClick={() => setShowPreview(false)}
            className={`px-4 py-2 rounded-lg text-sm ${!showPreview ? "bg-primary text-primary-foreground" : "bg-muted"}`}
          >
            HTML Code
          </button>
          <button
            onClick={() => setShowPreview(true)}
            className={`px-4 py-2 rounded-lg text-sm ${showPreview ? "bg-primary text-primary-foreground" : "bg-muted"}`}
          >
            Preview
          </button>
        </div>

        {showPreview ? (
          <div
            className="card p-4 prose dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: output }}
          />
        ) : (
          <OutputBox label="HTML Output" value={output} downloadFileName="converted.html" />
        )}
      </div>
    </ToolLayout>
  );
}
