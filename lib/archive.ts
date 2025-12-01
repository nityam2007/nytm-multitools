// Archive stub - Analytics moved to PostHog
// This file provides type compatibility for existing imports

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

// Stub functions - data is now tracked via PostHog
export function addArchiveRecord(_record: Omit<ArchiveRecord, "id">): number {
  // No-op: Analytics moved to PostHog
  return 0;
}

export function getArchiveRecords(_options: {
  page?: number;
  limit?: number;
  tool?: string;
  category?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
}): { records: ArchiveRecord[]; total: number } {
  return { records: [], total: 0 };
}

export function getArchiveRecordById(_id: number): ArchiveRecord | undefined {
  return undefined;
}

export function deleteArchiveRecord(_id: number): boolean {
  return false;
}

export function getToolStats(): { tool: string; count: number }[] {
  return [];
}

export function getCategoryStats(): { category: string; count: number }[] {
  return [];
}

export function getDailyStats(_days: number = 7): { date: string; count: number }[] {
  return [];
}

export function getTotalStats(): { totalRecords: number; totalTools: number } {
  return { totalRecords: 0, totalTools: 0 };
}
