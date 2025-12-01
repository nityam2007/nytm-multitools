"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { OutputBox } from "@/components/OutputBox";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";
import { logToolUsage } from "@/lib/actions";

const tool = getToolBySlug("lorem-ipsum")!;
const similarTools = getToolsByCategory("text").filter(t => t.slug !== "lorem-ipsum");

const words = [
  "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit",
  "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore",
  "magna", "aliqua", "enim", "ad", "minim", "veniam", "quis", "nostrud",
  "exercitation", "ullamco", "laboris", "nisi", "aliquip", "ex", "ea", "commodo",
  "consequat", "duis", "aute", "irure", "in", "reprehenderit", "voluptate",
  "velit", "esse", "cillum", "fugiat", "nulla", "pariatur", "excepteur", "sint",
  "occaecat", "cupidatat", "non", "proident", "sunt", "culpa", "qui", "officia",
  "deserunt", "mollit", "anim", "id", "est", "laborum", "perspiciatis", "unde",
  "omnis", "iste", "natus", "error", "voluptatem", "accusantium", "doloremque",
  "laudantium", "totam", "rem", "aperiam", "eaque", "ipsa", "quae", "ab", "illo",
  "inventore", "veritatis", "quasi", "architecto", "beatae", "vitae", "dicta",
  "explicabo", "nemo", "ipsam", "quia", "voluptas", "aspernatur", "aut", "odit",
  "fugit", "consequuntur", "magni", "dolores", "eos", "ratione", "sequi",
  "nesciunt", "neque", "porro", "quisquam", "nihil", "impedit", "quo", "minus",
];

function generateWord(): string {
  return words[Math.floor(Math.random() * words.length)];
}

function generateSentence(minWords = 5, maxWords = 15): string {
  const count = Math.floor(Math.random() * (maxWords - minWords + 1)) + minWords;
  const sentence = Array.from({ length: count }, generateWord).join(" ");
  return sentence.charAt(0).toUpperCase() + sentence.slice(1) + ".";
}

function generateParagraph(minSentences = 3, maxSentences = 7): string {
  const count = Math.floor(Math.random() * (maxSentences - minSentences + 1)) + minSentences;
  return Array.from({ length: count }, () => generateSentence()).join(" ");
}

export default function LoremIpsumPage() {
  const [type, setType] = useState<"paragraphs" | "sentences" | "words">("paragraphs");
  const [count, setCount] = useState(3);
  const [output, setOutput] = useState("");
  const [startWithLorem, setStartWithLorem] = useState(true);

  const handleGenerate = async () => {
    const startTime = Date.now();
    let result = "";

    if (type === "paragraphs") {
      const paragraphs = Array.from({ length: count }, generateParagraph);
      if (startWithLorem && paragraphs.length > 0) {
        paragraphs[0] = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. " + paragraphs[0];
      }
      result = paragraphs.join("\n\n");
    } else if (type === "sentences") {
      const sentences = Array.from({ length: count }, () => generateSentence());
      if (startWithLorem && sentences.length > 0) {
        sentences[0] = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";
      }
      result = sentences.join(" ");
    } else {
      const wordList = Array.from({ length: count }, generateWord);
      if (startWithLorem && wordList.length >= 2) {
        wordList[0] = "Lorem";
        wordList[1] = "ipsum";
      }
      result = wordList.join(" ");
    }

    setOutput(result);

    await logToolUsage({
      toolName: tool.name,
      toolCategory: tool.category,
      inputType: "text",
      rawInput: `${count} ${type}`,
      outputResult: result,
      processingDuration: Date.now() - startTime,
    });
  };

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as typeof type)}
              className="input w-full"
            >
              <option value="paragraphs">Paragraphs</option>
              <option value="sentences">Sentences</option>
              <option value="words">Words</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Count</label>
            <input
              type="number"
              min={1}
              max={100}
              value={count}
              onChange={(e) => setCount(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
              className="input w-full"
            />
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={startWithLorem}
                onChange={(e) => setStartWithLorem(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm">Start with "Lorem ipsum"</span>
            </label>
          </div>
        </div>

        <button onClick={handleGenerate} className="btn btn-primary w-full py-3">
          Generate Lorem Ipsum
        </button>

        <OutputBox label="Generated Text" value={output} downloadFileName="lorem-ipsum.txt" />
      </div>
    </ToolLayout>
  );
}
