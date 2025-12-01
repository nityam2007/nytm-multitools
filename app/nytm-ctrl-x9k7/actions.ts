"use server";

import { isAuthenticated } from "@/lib/auth";

// Archive records type for compatibility
export interface ArchiveRecord {
  id?: number;
  tool_name: string;
  tool_category: string;
  input_type: string;
  raw_input: string | null;
  file_path: string | null;
  output_result: string | null;
  output_file_path: string | null;
  timestamp: string;
  user_agent: string | null;
  ip_address: string | null;
  processing_duration: number | null;
  input_size: number | null;
  metadata: string | null;
}

export async function fetchRecords(_options: {
  page?: number;
  limit?: number;
  tool?: string;
  category?: string;
  search?: string;
}): Promise<{ records: ArchiveRecord[]; total: number }> {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    throw new Error("Unauthorized");
  }

  // Analytics moved to PostHog - return empty data
  return { records: [], total: 0 };
}

export async function deleteRecordAction(_id: number): Promise<boolean> {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    throw new Error("Unauthorized");
  }

  // No local records to delete - data is in PostHog
  return false;
}
