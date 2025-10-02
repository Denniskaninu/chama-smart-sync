
'use client';

import { useMemo } from 'react';
import { notFound, useParams } from 'next/navigation';
import { useFirestore, useDoc, useCollection, useUser } from '@/firebase';
import { doc, collection, query, where } from 'firebase/firestore';
import type { ChamaGroup, Contribution, Loan, Receipt } from '@/lib/types';
import { GroupClient } from '@/components/chama/group-client';
import { Skeleton } from '@/components/ui/skeleton';

function GroupPageSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-40 w-full" />
      <div className="flex gap-2">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-24" />
      </div>
      <Skeleton className="h-96 w-full" />
    </div>
  );
}


export default function GroupPage() {
  const params = useParams();
  const id = params.id as string;
  const firestore = useFirestore();
  const { user: currentUser, loading: loadingUser } = useUser();

  // --- Group Data ---
  const groupRef = useMemo(() => {
    if (!firestore || !id) return null;
    return doc(firestore, 'groups', id);
  }, [firestore, id]);
  const { data: group, loading: loadingGroup, error: errorGroup } = useDoc<ChamaGroup>(groupRef);

  // --- Collections Data ---
  const contributionsQuery = useMemo(() => {
    if (!firestore || !id) return null;
    return query(collection(firestore, 'contributions'), where('groupId', '==', id));
  }, [firestore, id]);
  const { data: contributions, loading: loadingContributions } = useCollection<Contribution>(contributionsQuery);

  const loansQuery = useMemo(() => {
    if (!firestore || !id) return null;
    return query(collection(firestore, 'loans'), where('groupId', '==', id));
  }, [firestore, id]);
  const { data: loans, loading: loadingLoans } = useCollection<Loan>(loansQuery);

  const receiptsQuery = useMemo(() => {
    if (!firestore || !id) return null;
    return query(collection(firestore, 'receipts'), where('groupId', '==', id));
  }, [firestore, id]);
  const { data: receipts, loading: loadingReceipts } = useCollection<Receipt>(receiptsQuery);

  const loading = loadingGroup || loadingContributions || loadingLoans || loadingReceipts || loadingUser;

  if (loading) {
    return <GroupPageSkeleton />;
  }
  
  // This is the important part: if the group isn't found OR there was an error fetching it, show 404.
  if (!group || errorGroup) {
    notFound();
  }

  // Also ensure we have a current user before rendering the client
  if (!currentUser) {
    // or redirect to login
    return <GroupPageSkeleton />;
  }

  return (
    <GroupClient 
      group={group} 
      initialContributions={contributions || []}
      initialLoans={loans || []}
      initialReceipts={receipts || []}
    />
  );
}
