import { GroupClient } from "@/components/chama/group-client";
import { groups, contributions, loans, messages, receipts, user } from "@/lib/placeholder-data";
import { notFound } from "next/navigation";

export default function GroupPage({ params }: { params: { id: string } }) {
  const group = groups.find(g => g.id === params.id);

  if (!group) {
    notFound();
  }

  // Filter data for the specific group
  const groupContributions = contributions.filter(c => c.groupId === group.id);
  const groupLoans = loans.filter(l => l.groupId === group.id);
  const groupMessages = messages.filter(m => m.groupId === group.id);
  const groupReceipts = receipts.filter(r => r.groupId === group.id);

  return (
    <GroupClient 
      group={group} 
      contributions={groupContributions}
      loans={groupLoans}
      messages={groupMessages}
      receipts={groupReceipts}
      currentUser={user}
    />
  );
}

export function generateStaticParams() {
  return groups.map(group => ({
    id: group.id,
  }));
}
