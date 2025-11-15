
"use client";

import { useMemo, useState } from 'react';
import { useFirestore, useCollection, useUser } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import Image from "next/image";
import type { Receipt, ChamaGroup } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { UploadReceiptDialog } from '@/components/chama/upload-receipt-dialog';


export default function ReceiptsPage() {
    const firestore = useFirestore();
    const { user } = useUser();
    const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);

    const userGroupsQuery = useMemo(() => {
        if (!firestore || !user) return null;
        // This is a more robust way to query for groups the user is in.
        // It fetches all groups and we filter client-side.
        return collection(firestore, "groups");
    }, [firestore, user]);

    const { data: allUserGroups, loading: loadingUserGroups } = useCollection<ChamaGroup>(userGroupsQuery);
    
    const userGroups = useMemo(() => {
        if (!allUserGroups || !user) return [];
        return allUserGroups.filter(g => g.members.some(m => m.id === user.uid));
    }, [allUserGroups, user]);

    const receiptsQuery = useMemo(() => {
        if (!firestore) return null;
        return collection(firestore, 'receipts');
    }, [firestore]);

    const allGroupsQuery = useMemo(() => {
        if (!firestore) return null;
        return collection(firestore, 'groups');
    }, [firestore]);

    const { data: receipts, loading: loadingReceipts } = useCollection<Receipt>(receiptsQuery);
    const { data: allGroups, loading: loadingAllGroups } = useCollection<ChamaGroup>(allGroupsQuery);

    const allMembers = useMemo(() => {
        return allGroups?.flatMap(g => g.members) || [];
    }, [allGroups]);

    const getUploaderName = (uploaderId: string) => {
        return allMembers.find(m => m.id === uploaderId)?.name || 'Unknown User';
    };

    const loading = loadingReceipts || loadingAllGroups || loadingUserGroups;

    const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="space-y-8">
        <div>
            <h1 className="text-3xl font-bold font-headline">Receipts</h1>
            <p className="text-muted-foreground">All uploaded receipts for transparency.</p>
        </div>
        <Card>
            <CardHeader className="flex flex-row justify-between items-center">
              <div>
                <CardTitle>All Receipts</CardTitle>
                <CardDescription>A record of all uploaded proofs of payment.</CardDescription>
              </div>
              <div className="flex gap-2">
                <Select onValueChange={setSelectedGroupId} value={selectedGroupId || undefined}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select a group" />
                    </SelectTrigger>
                    <SelectContent>
                        {userGroups?.map(group => (
                            <SelectItem key={group.id} value={group.id}>{group.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {selectedGroupId && (
                    <UploadReceiptDialog groupId={selectedGroupId}>
                        <Button><Plus className="mr-2 h-4 w-4" />Upload</Button>
                    </UploadReceiptDialog>
                )}
              </div>
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
              { !loading && receipts?.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                    <p>No receipts have been uploaded yet.</p>
                </div>
              )}
            </CardContent>
          </Card>
    </div>
  );
}
