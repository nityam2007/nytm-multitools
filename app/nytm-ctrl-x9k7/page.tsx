import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import AdminDashboard from "./dashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const authenticated = await isAuthenticated();
  
  if (!authenticated) {
    redirect("/nytm-ctrl-x9k7/login");
  }

  // Analytics are now tracked via PostHog
  // Visit your PostHog dashboard for detailed analytics
  return <AdminDashboard />;
}
