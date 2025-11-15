
'use client';
import { useMemo } from 'react';
import { useUser, useFirestore, useCollection } from '@/firebase';
import { collection } from 'firebase/firestore';
import { DashboardClient } from "@/components/chama/dashboard-client";
import type { UserProfile, ChamaGroup } from "@/lib/types";

export default function DashboardPage() {
  const { user: authUser, loading: loadingUser } = useUser();
  const firestore = useFirestore();

  const groupsQuery = useMemo(() => {
    if (!firestore) return null;
    return collection(firestore, 'groups');
  }, [firestore]);

  const { data: groups, loading: loadingGroups } = useCollection<ChamaGroup>(groupsQuery);

  const userGroups = useMemo(() => {
    if (!groups || !authUser) return [];
    // Filter groups where the current user is a member
    return groups.filter(g => g.members.some(m => m.id === authUser.uid));
  }, [groups, authUser]);

  const userProfile: UserProfile | null = authUser ? {
    id: authUser.uid,
    name: authUser.displayName || 'User',
    email: authUser.email || '',
    avatarUrl: authUser.photoURL || undefined,
    groups: userGroups.map(g => g.id), // assuming you want an array of group IDs
    role: 'member', // This might need to be determined from your data
  } : null;

  const loading = loadingUser || loadingGroups;

  // Render a skeleton or loading state while data is being fetched
  if (loading || !userProfile) {
    // You can replace this with a proper skeleton component
    return <div>Loading Dashboard...</div>;
  }
  
  return <DashboardClient user={userProfile} groups={userGroups} />;
}
