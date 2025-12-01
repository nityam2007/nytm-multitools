"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { TextArea } from "@/components/TextArea";
import { OutputBox } from "@/components/OutputBox";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";
import { logToolUsage } from "@/lib/actions";

const tool = getToolBySlug("sql-formatter")!;
const similarTools = getToolsByCategory("dev").filter(t => t.slug !== "sql-formatter");

const KEYWORDS = [
  "SELECT", "FROM", "WHERE", "AND", "OR", "NOT", "IN", "LIKE", "BETWEEN",
  "JOIN", "INNER", "LEFT", "RIGHT", "FULL", "OUTER", "ON", "AS",
  "ORDER", "BY", "ASC", "DESC", "GROUP", "HAVING", "LIMIT", "OFFSET",
  "INSERT", "INTO", "VALUES", "UPDATE", "SET", "DELETE",
  "CREATE", "TABLE", "INDEX", "VIEW", "DROP", "ALTER", "ADD", "COLUMN",
  "PRIMARY", "KEY", "FOREIGN", "REFERENCES", "UNIQUE", "CHECK", "DEFAULT",
  "NULL", "IS", "DISTINCT", "COUNT", "SUM", "AVG", "MIN", "MAX",
  "CASE", "WHEN", "THEN", "ELSE", "END", "CAST", "COALESCE", "UNION", "ALL",
  "EXISTS", "ANY", "SOME", "WITH", "RECURSIVE", "OVER", "PARTITION",
];

function formatSQL(sql: string): string {
  // Normalize whitespace
  let result = sql.replace(/\s+/g, " ").trim();
  
  // Uppercase keywords
  for (const keyword of KEYWORDS) {
    const regex = new RegExp(`\\b${keyword}\\b`, "gi");
    result = result.replace(regex, keyword);
  }
  
  // Add newlines before major clauses
  const majorClauses = ["SELECT", "FROM", "WHERE", "AND", "OR", "ORDER BY", "GROUP BY", "HAVING", "LIMIT", "OFFSET", "JOIN", "INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL JOIN", "ON", "SET", "VALUES", "UNION"];
  for (const clause of majorClauses) {
    const regex = new RegExp(`\\s+${clause}\\b`, "gi");
    result = result.replace(regex, `\n${clause}`);
  }
  
  // Handle INSERT INTO ... VALUES
  result = result.replace(/\)\s*VALUES\s*\(/gi, ")\nVALUES\n(");
  
  // Indent after SELECT, FROM, WHERE, etc.
  const lines = result.split("\n");
  const formatted: string[] = [];
  let indentLevel = 0;
  
  for (let line of lines) {
    line = line.trim();
    if (!line) continue;
    
    // Decrease indent for closing
    if (line.startsWith(")")) {
      indentLevel = Math.max(0, indentLevel - 1);
    }
    
    // Add indent
    const indent = "  ".repeat(indentLevel);
    
    // Indent sub-clauses
    if (line.startsWith("AND") || line.startsWith("OR")) {
      formatted.push(indent + "  " + line);
    } else if (line.startsWith("ON")) {
      formatted.push(indent + "  " + line);
    } else {
      formatted.push(indent + line);
    }
    
    // Increase indent for opening
    if (line.includes("(") && !line.includes(")")) {
      indentLevel++;
    }
  }
  
  return formatted.join("\n");
}

export default function SqlFormatterPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [uppercase, setUppercase] = useState(true);

  const handleFormat = async () => {
    if (!input.trim()) return;
    const startTime = Date.now();

    let formatted = formatSQL(input);
    if (!uppercase) {
      for (const keyword of KEYWORDS) {
        const regex = new RegExp(`\\b${keyword}\\b`, "g");
        formatted = formatted.replace(regex, keyword.toLowerCase());
      }
    }

    setOutput(formatted);

    await logToolUsage({
      toolName: tool.name,
      toolCategory: tool.category,
      inputType: "text",
      rawInput: input,
      outputResult: formatted,
      processingDuration: Date.now() - startTime,
    });
  };

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        <TextArea
          label="SQL Input"
          placeholder="select * from users where id = 1 and status = 'active' order by created_at desc"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={8}
        />

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={uppercase}
            onChange={(e) => setUppercase(e.target.checked)}
            className="w-4 h-4"
          />
          <span className="text-sm">Uppercase keywords</span>
        </label>

        <button
          onClick={handleFormat}
          disabled={!input.trim()}
          className="btn btn-primary w-full py-3"
        >
          Format SQL
        </button>

        <OutputBox label="Formatted SQL" value={output} downloadFileName="query.sql" />
      </div>
    </ToolLayout>
  );
}
