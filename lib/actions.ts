"use server";

import { headers } from "next/headers";
import { PostHog } from "posthog-node";

// Initialize PostHog server-side client
const posthog = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
  host: "https://eu.i.posthog.com",
  flushAt: 1,
  flushInterval: 0,
});

export interface LogToolUsageParams {
  toolName: string;
  toolCategory: string;
  inputType: string;
  rawInput?: string;
  filePath?: string;
  outputResult?: string;
  outputFilePath?: string;
  processingDuration?: number;
  metadata?: Record<string, any>;
}

export async function logToolUsage(params: LogToolUsageParams): Promise<{ success: boolean }> {
  try {
    const headersList = await headers();
    const userAgent = headersList.get("user-agent") || "unknown";
    const forwardedFor = headersList.get("x-forwarded-for");
    const realIp = headersList.get("x-real-ip");
    const ipAddress = forwardedFor?.split(",")[0] || realIp || "anonymous";

    const inputSize = params.rawInput?.length || 0;

    // Use IP or a hash as distinct_id for anonymous tracking
    const distinctId = `anon_${ipAddress.replace(/\./g, "_")}`;

    posthog.capture({
      distinctId,
      event: "tool_used",
      properties: {
        tool_name: params.toolName,
        tool_category: params.toolCategory,
        input_type: params.inputType,
        input_size: inputSize,
        processing_duration: params.processingDuration || null,
        user_agent: userAgent,
        ...params.metadata,
      },
    });

    // Ensure events are sent
    await posthog.flush();

    return { success: true };
  } catch (error) {
    console.error("Failed to log tool usage:", error);
    return { success: false };
  }
}
