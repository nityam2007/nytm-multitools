// NSheth referral event with non-sensitive attribution | TypeScript
"use client";
import type { ReactNode } from "react";
import posthog from "posthog-js";
import { nshethUrl } from "@/lib/nsheth";
export function NShethLink({
  source,
  service,
  children,
  className,
}: {
  source: string;
  service: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <a
      className={className}
      href={nshethUrl(source, service)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => {
        if (posthog.__loaded)
          posthog.capture("nsheth_referral_click", {
            tool_slug: source,
            service,
            placement: "nytm-services",
          });
      }}
    >
      {children}
    </a>
  );
}
