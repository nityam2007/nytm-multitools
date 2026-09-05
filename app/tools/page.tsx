// Complete tool library page | TypeScript
import Link from "next/link";
import { Suspense } from "react";
import { ToolLibrary } from "@/components/ToolLibrary";
import { RecentTools } from "@/components/RecentTools";
import { toolsConfig } from "@/lib/tools-config";
export default function ToolsPage() {
  return (
    <div className="discovery-page">
      <header className="library-header">
        <div>
          <p className="eyebrow">YOUR EVERYDAY TOOLBOX</p>
          <h1>Find the right tool.</h1>
          <p>
            Explore {toolsConfig.length} free tools for PDFs, images, text,
            code, and business. Search by what you want to do, then get straight
            to work.
          </p>
        </div>
        <div className="action-row">
          <Link className="btn btn-secondary" href="/business-tools">
            Business tools →
          </Link>
          <Link className="btn btn-secondary" href="/guides">
            How-to guides →
          </Link>
        </div>
      </header>
      <Suspense
        fallback={
          <p role="status" className="py-8">
            Loading the tool library…
          </p>
        }
      >
        <ToolLibrary />
      </Suspense>
      <RecentTools />
    </div>
  );
}
