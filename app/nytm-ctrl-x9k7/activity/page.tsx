import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { getArchiveRecords, getToolStats, getCategoryStats } from "@/lib/archive";
import ActivityLog from "./activity-log";

export const dynamic = "force-dynamic";

export default async function ActivityPage() {
  const authenticated = await isAuthenticated();
  
  if (!authenticated) {
    redirect("/nytm-ctrl-x9k7/login");
  }

  const { records, total } = getArchiveRecords({ page: 1, limit: 50 });
  const toolStats = getToolStats();
  const categoryStats = getCategoryStats();

  return (
    <ActivityLog
      initialRecords={records}
      initialTotal={total}
      toolStats={toolStats}
      categoryStats={categoryStats}
    />
  );
}
