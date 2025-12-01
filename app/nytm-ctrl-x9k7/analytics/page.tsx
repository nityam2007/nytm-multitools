import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { 
  getToolStats, 
  getCategoryStats, 
  getTotalStats,
  getDailyStats 
} from "@/lib/archive";
import AnalyticsDashboard from "./analytics-dashboard";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  const authenticated = await isAuthenticated();
  
  if (!authenticated) {
    redirect("/nytm-ctrl-x9k7/login");
  }

  const toolStats = getToolStats();
  const categoryStats = getCategoryStats();
  const totalStats = getTotalStats();
  const dailyStats = getDailyStats(30); // Last 30 days

  return (
    <AnalyticsDashboard
      toolStats={toolStats}
      categoryStats={categoryStats}
      totalStats={totalStats}
      dailyStats={dailyStats}
    />
  );
}
