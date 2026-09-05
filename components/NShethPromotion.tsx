// Contextual NSheth service invitation | TypeScript
import Link from "next/link";
import type { ToolConfig } from "@/lib/tools-config";
import { toolOffer } from "@/lib/nsheth";

export function NShethPromotion({ tool }: { tool: ToolConfig }) {
  const offer = toolOffer(tool);
  return (
    <aside
      className="my-8 border-y border-[var(--border)] py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-5"
      aria-label="Built by NSheth"
    >
      <div>
        <p className="text-xs font-mono uppercase tracking-wider text-[var(--primary)] mb-2">
          Built by NSheth
        </p>
        <h2 className="text-lg font-semibold">{offer.title}</h2>
        <p className="text-sm text-[var(--muted-foreground)] mt-2 max-w-xl">
          {offer.text}
        </p>
      </div>
      <Link
        className="btn btn-secondary shrink-0"
        href={`/work-with-nsheth?service=${offer.service}&from=${tool.slug}`}
      >
        {offer.action} <span aria-hidden="true">→</span>
      </Link>
    </aside>
  );
}
