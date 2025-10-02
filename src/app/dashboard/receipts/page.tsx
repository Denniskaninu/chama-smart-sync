
"use client";

import { useMemo } from 'react';
import { useFirestore, useCollection, useUser } from '@/firebase';
import { collection } from 'firebase/firestore';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import Image from "next/image";
import type { Receipt, UserProfile, ChamaGroup } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function ReceiptsPage() {
    const firestore = useFirestore();
    const { user } = useUser();

    const receiptsQuery = useMemo(() => {
        if (!firestore) return null;
        return collection(firestore, 'receipts');
    }, [firestore]);

    const groupsQuery = useMemo(() => {
        if (!firestore) return null;
        return collection(firestore, 'groups');
    }, [firestore]);

    const { data: receipts, loading: loadingReceipts } = useCollection<Receipt>(receiptsQuery);
    const { data: groups, loading: loadingGroups } = useCollection<ChamaGroup>(groupsQuery);

    const allMembers = useMemo(() => {
        return groups?.flatMap(g => g.members) || [];
    }, [groups]);

    const getUploaderName = (uploaderId: string) => {
        return allMembers.find(m => m.id === uploaderId)?.name || 'Unknown User';
    };

    const loading = loadingReceipts || loadingGroups;

    const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="space-y-8">
        <div>
            <h1 className="text-3xl font-bold font-headline">Receipts</h1>
            <p className="text-muted-foreground">All uploaded receipts for transparency.</p>
        </div>
        <Card>
            <CardHeader>
              <CardTitle>All Receipts</CardTitle>
              <CardDescription>A record of all uploaded proofs of payment.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {loading && [...Array(6)].map((_, i) => (
                    <Skeleton key={i} className="aspect-[2/3] rounded-lg" />
                ))}
                {!loading && receipts?.map(receipt => (
                   <div key={receipt.id} className="relative aspect-[2/3] rounded-lg overflow-hidden border shadow-sm group">
                     <Image src={receipt.url} alt={`Receipt from ${formatDate(receipt.timestamp)}`} fill objectFit="cover" data-ai-hint="receipt paper" />
                     <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button variant="secondary">View</Button>
                     </div>
                     <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2 text-white">
                        <p className="text-xs font-bold truncate">{getUploaderName(receipt.uploadedBy)}</p>
                        <p className="text-xs truncate">{formatDate(receipt.timestamp)}</p>
                     </div>
                   </div>
                ))}
              </div>
               <div className="flex justify-center mt-8">
                <Button variant="outline"><Plus className="mr-2 h-4 w-4" />Upload New Receipt</Button>
              </div>
            </CardContent>
          </Card>
    </div>
  );
}
