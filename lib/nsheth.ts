// NSheth referral destinations | TypeScript
import type { ToolConfig } from "@/lib/tools-config";

export function nshethUrl(source: string, service = "websites") {
  const url = new URL("https://nsheth.in/");
  url.search = new URLSearchParams({
    utm_source: "nytm.in",
    utm_medium: "referral",
    utm_campaign: service,
    utm_content: source,
  }).toString();
  return url.toString();
}

export function toolOffer(tool: ToolConfig) {
  if (tool.category === "image" || /catalogue|product/.test(tool.slug))
    return {
      service: "ecommerce",
      title: "Put your products on a website that works for you.",
      text: "NSheth builds online stores and business websites around how you sell.",
      action: "Explore website & store development",
    };
  if (/csv|json|quotation|automation|pdf/.test(tool.slug))
    return {
      service: "automation",
      title: "Doing this task again next week?",
      text: "NSheth builds custom tools and automations for repetitive business work.",
      action: "Discuss a custom workflow",
    };
  return {
    service: "websites",
    title: "Have a website or digital tool in mind?",
    text: "NYTM is built by NSheth. Bring the same practical approach to your business.",
    action: "Discuss your project",
  };
}
