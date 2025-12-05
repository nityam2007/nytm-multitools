// Directory Tree Visualizer Tool | TypeScript
"use client";

import { useState, useMemo } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/Button";
import { TextArea } from "@/components/TextArea";
import { Select } from "@/components/Select";
import { OutputBox } from "@/components/OutputBox";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";

const tool = getToolBySlug("directory-tree-visualizer")!;
const similarTools = getToolsByCategory("dev").filter(t => t.slug !== "directory-tree-visualizer");

const styleOptions = [
  { value: "ascii", label: "ASCII (├── └──)" },
  { value: "unicode", label: "Unicode (┣━━ ┗━━)" },
  { value: "simple", label: "Simple (|-- `--)" },
  { value: "indent", label: "Indent Only" },
];

const sampleInput = `src
  components
    Button.tsx
    Input.tsx
    Header.tsx
  pages
    index.tsx
    about.tsx
    api
      users.ts
      posts.ts
  styles
    globals.css
  utils
    helpers.ts
public
  images
    logo.png
  favicon.ico
package.json
README.md`;

interface TreeNode {
  name: string;
  children: TreeNode[];
  isLast: boolean;
}

export default function DirectoryTreeVisualizerPage() {
  const [input, setInput] = useState(sampleInput);
  const [style, setStyle] = useState("ascii");
  const [showIcons, setShowIcons] = useState(true);

  const getChars = () => {
    switch (style) {
      case "unicode":
        return { branch: "┣━━ ", last: "┗━━ ", pipe: "┃   ", space: "    " };
      case "simple":
        return { branch: "|-- ", last: "`-- ", pipe: "|   ", space: "    " };
      case "indent":
        return { branch: "    ", last: "    ", pipe: "    ", space: "    " };
      default: // ascii
        return { branch: "├── ", last: "└── ", pipe: "│   ", space: "    " };
    }
  };

  const getIcon = (name: string) => {
    if (!showIcons) return "";
    
    // Folders (no extension)
    if (!name.includes(".")) return "📁 ";
    
    const ext = name.split(".").pop()?.toLowerCase();
    const icons: Record<string, string> = {
      tsx: "⚛️  ",
      ts: "📘 ",
      jsx: "⚛️  ",
      js: "📜 ",
      css: "🎨 ",
      scss: "🎨 ",
      html: "🌐 ",
      json: "📋 ",
      md: "📝 ",
      png: "🖼️  ",
      jpg: "🖼️  ",
      svg: "🎭 ",
      ico: "🔷 ",
      py: "🐍 ",
      go: "🔵 ",
      rs: "🦀 ",
      java: "☕ ",
      rb: "💎 ",
      php: "🐘 ",
      yml: "⚙️  ",
      yaml: "⚙️  ",
      env: "🔐 ",
      git: "🔀 ",
      lock: "🔒 ",
    };
    
    return icons[ext || ""] || "📄 ";
  };

  const parseInput = (text: string): TreeNode[] => {
    const lines = text.split("\n").filter(line => line.trim());
    const root: TreeNode[] = [];
    const stack: { node: TreeNode; indent: number }[] = [];

    for (const line of lines) {
      const trimmed = line.trimStart();
      const indent = line.length - trimmed.length;
      const name = trimmed;

      const node: TreeNode = { name, children: [], isLast: false };

      // Find parent based on indentation
      while (stack.length > 0 && stack[stack.length - 1].indent >= indent) {
        stack.pop();
      }

      if (stack.length === 0) {
        root.push(node);
      } else {
        stack[stack.length - 1].node.children.push(node);
      }

      stack.push({ node, indent });
    }

    // Mark last children
    const markLast = (nodes: TreeNode[]) => {
      if (nodes.length > 0) {
        nodes[nodes.length - 1].isLast = true;
        nodes.forEach(n => markLast(n.children));
      }
    };
    markLast(root);

    return root;
  };

  const renderTree = (nodes: TreeNode[], prefix: string = ""): string => {
    const chars = getChars();
    let result = "";

    nodes.forEach((node, index) => {
      const isLast = index === nodes.length - 1;
      const connector = isLast ? chars.last : chars.branch;
      const icon = getIcon(node.name);
      
      result += prefix + connector + icon + node.name + "\n";

      if (node.children.length > 0) {
        const newPrefix = prefix + (isLast ? chars.space : chars.pipe);
        result += renderTree(node.children, newPrefix);
      }
    });

    return result;
  };

  const tree = useMemo(() => {
    const nodes = parseInput(input);
    return renderTree(nodes);
  }, [input, style, showIcons]);

  const stats = useMemo(() => {
    const lines = input.split("\n").filter(line => line.trim());
    const files = lines.filter(line => line.trim().includes(".")).length;
    const folders = lines.length - files;
    return { total: lines.length, files, folders };
  }, [input]);

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        {/* Input */}
        <TextArea
          label="Directory Structure (Indent = Hierarchy)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={10}
          placeholder="Enter directory structure with indentation..."
          helperText="Use 2 spaces for each level of nesting"
        />

        {/* Options */}
        <div className="flex flex-wrap gap-4 items-end">
          <div className="w-48">
            <Select
              label="Style"
              options={styleOptions}
              value={style}
              onChange={(e) => setStyle(e.target.value)}
            />
          </div>
          <label className="flex items-center gap-2 cursor-pointer pb-3">
            <input
              type="checkbox"
              checked={showIcons}
              onChange={(e) => setShowIcons(e.target.checked)}
              className="w-4 h-4 rounded border-[var(--border)] text-violet-500 focus:ring-violet-500"
            />
            <span className="text-sm">Show File Icons</span>
          </label>
        </div>

        {/* Output */}
        <div className="p-4 sm:p-6 bg-[var(--muted)] rounded-xl border border-[var(--border)] overflow-x-auto">
          <pre className="font-mono text-xs sm:text-sm whitespace-pre leading-relaxed">
            {tree}
          </pre>
        </div>

        {/* Copy/Download */}
        <OutputBox
          value={tree}
          label="Copy or Download"
          downloadFileName="directory-tree.txt"
        />

        {/* Stats */}
        <div className="flex gap-6 justify-center text-sm">
          <div className="flex items-center gap-2">
            <span className="text-[var(--muted-foreground)]">Total:</span>
            <span className="font-medium">{stats.total}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[var(--muted-foreground)]">📁 Folders:</span>
            <span className="font-medium">{stats.folders}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[var(--muted-foreground)]">📄 Files:</span>
            <span className="font-medium">{stats.files}</span>
          </div>
        </div>

        {/* Info */}
        <div className="p-4 bg-violet-500/10 rounded-xl border border-violet-500/20">
          <h3 className="font-semibold mb-2 text-sm">How to Use</h3>
          <ul className="text-xs sm:text-sm text-[var(--muted-foreground)] space-y-1">
            <li>• Enter folder/file names, one per line</li>
            <li>• Use spaces (2 per level) to indicate nesting</li>
            <li>• Files are detected by having an extension (.tsx, .js, etc.)</li>
            <li>• Perfect for README files and documentation</li>
          </ul>
        </div>
      </div>
    </ToolLayout>
  );
}
