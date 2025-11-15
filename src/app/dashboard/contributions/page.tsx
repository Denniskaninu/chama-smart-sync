
"use client";
import { useMemo } from 'react';
import { useFirestore, useCollection } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MpesaReferenceCheck } from "@/components/chama/mpesa-check";
import type { Contribution, ChamaGroup } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function ContributionsPage() {
    const firestore = useFirestore();

    const contributionsQuery = useMemo(() => {
        if (!firestore) return null;
        return query(collection(firestore, 'contributions'), orderBy('date', 'desc'));
    }, [firestore]);

    const groupsQuery = useMemo(() => {
        if (!firestore) return null;
        return collection(firestore, 'groups');
    }, [firestore]);

    const { data: contributions, loading: loadingContributions } = useCollection<Contribution>(contributionsQuery);
    const { data: groups, loading: loadingGroups } = useCollection<ChamaGroup>(groupsQuery);

    const getGroupName = (groupId: string) => {
        return groups?.find(g => g.id === groupId)?.name || 'Unknown Group';
    };

    const loading = loadingContributions || loadingGroups;

    const formatCurrency = (amount: number) => `KSH ${amount.toLocaleString()}`;
    const formatDate = (date: any) => {
        if (!date) return '...';
        const jsDate = date.toDate ? date.toDate() : new Date(date);
        return jsDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    }

  return (
    <div className="space-y-8">
       <div>
          <h1 className="text-3xl font-bold font-headline">All Contributions</h1>
          <p className="text-muted-foreground">A record of all contributions across your groups.</p>
        </div>
        <Card>
            <CardHeader>
              <CardTitle>Contribution History</CardTitle>
              <CardDescription>All member contributions are recorded here.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead>Group</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>M-Pesa Ref</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading && (
                      [...Array(5)].map((_, i) => (
                          <TableRow key={i}>
                              <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                              <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                              <TableCell className="text-right"><Skeleton className="h-5 w-20 ml-auto" /></TableCell>
                              <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                              <TableCell><Skeleton className="h-5 w-28" /></TableCell>
                          </TableRow>
                      ))
                  )}
                  {!loading && contributions?.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell className="font-medium">{c.memberName}</TableCell>
                      <TableCell>{getGroupName(c.groupId)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(c.amount)}</TableCell>
                      <TableCell>{formatDate(c.date)}</TableCell>
                      <TableCell className="flex items-center gap-2">
                        {c.ref} <MpesaReferenceCheck referenceCode={c.ref} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
    </div>
  );
}
