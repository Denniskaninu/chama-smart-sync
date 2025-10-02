import { DashboardClient } from "@/components/chama/dashboard-client";
import { user, groups } from "@/lib/placeholder-data";

export default function DashboardPage() {
  // In a real app, you would fetch this data based on the logged-in user
  const userGroups = groups.filter(g => user.groups.includes(g.id));
  
  return <DashboardClient user={user} groups={userGroups} />;
}
