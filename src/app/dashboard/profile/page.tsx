
"use client";
import { useMemo } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser, useFirestore, useCollection } from "@/firebase";
import { collection, query, where } from 'firebase/firestore';
import { Edit, AtSign, Calendar } from "lucide-react";
import type { ChamaGroup, Contribution } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProfilePage() {
  const { user, loading: loadingUser } = useUser();
  const firestore = useFirestore();

  const allGroupsQuery = useMemo(() => {
    if (!firestore || !user) return null;
    return collection(firestore, 'groups');
  }, [firestore, user]);

  const { data: allGroups, loading: loadingGroups } = useCollection<ChamaGroup>(allGroupsQuery);

  const userGroups = useMemo(() => {
    if (!allGroups || !user) return [];
    return allGroups.filter(group => group.members.some(member => member.id === user.uid));
  }, [allGroups, user]);

  const userContributionsQuery = useMemo(() => {
      if (!firestore || !user) return null;
      return query(collection(firestore, 'contributions'), where('memberId', '==', user.uid));
  }, [firestore, user]);

  const { data: userContributions, loading: loadingContributions } = useCollection<Contribution>(userContributionsQuery);

  const totalContributed = useMemo(() => {
      if (!userContributions) return 0;
      return userContributions.reduce((acc, c) => acc + c.amount, 0);
  }, [userContributions]);
  
  const loading = loadingUser || loadingGroups || loadingContributions;

  if (loading || !user) {
    return (
        <div className="space-y-8">
            <Card>
                <CardContent className="pt-6">
                     <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
                          <Skeleton className="h-24 w-24 sm:h-32 sm:w-32 rounded-full" />
                          <div className="text-center sm:text-left flex-1 space-y-2">
                              <Skeleton className="h-8 w-48 mx-auto sm:mx-0" />
                              <Skeleton className="h-5 w-64 mx-auto sm:mx-0" />
                              <Skeleton className="h-5 w-56 mx-auto sm:mx-0" />
                          </div>
                          <div className="text-center sm:text-right space-y-1 pt-4 sm:pt-0">
                              <Skeleton className="h-5 w-24 ml-auto" />
                              <Skeleton className="h-8 w-32 ml-auto" />
                          </div>
                     </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                  <CardTitle><Skeleton className="h-7 w-32" /></CardTitle>
                  <CardDescription><Skeleton className="h-4 w-48" /></CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                </CardContent>
            </Card>
        </div>
    );
  }


  return (
    <div className="space-y-8">
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
            <div className="relative">
              <Avatar className="h-24 w-24 sm:h-32 sm:w-32 border-4 border-primary/50">
                <AvatarImage src={user.photoURL || undefined} alt={user.displayName || ""} />
                <AvatarFallback className="text-4xl">{user.displayName ? user.displayName.charAt(0) : user.email?.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <Button size="icon" className="absolute -bottom-2 -right-2 rounded-full h-8 w-8">
                <Edit className="h-4 w-4" />
              </Button>
            </div>
            <div className="text-center sm:text-left flex-1">
              <h1 className="text-3xl font-bold font-headline">{user.displayName}</h1>
              <p className="text-muted-foreground flex items-center justify-center sm:justify-start gap-2 mt-1">
                <AtSign className="h-4 w-4" /> {user.email}
              </p>
              <p className="text-muted-foreground flex items-center justify-center sm:justify-start gap-2 mt-1">
                <Calendar className="h-4 w-4" /> Joined on {user.metadata.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : 'N/A'}
              </p>
            </div>
            <div className="text-center sm:text-right pt-4 sm:pt-0">
              <p className="text-sm text-muted-foreground">Total Contributed</p>
              <p className="text-3xl font-bold text-primary">KSH {totalContributed.toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
            <CardTitle>My Groups</CardTitle>
            <CardDescription>Groups you are a member of.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="space-y-4">
            {(userGroups || []).map(group => (
                <div key={group.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="font-semibold">{group.name}</div>
                    <div className="text-sm text-muted-foreground">
                        Balance: KSH {group.kittyBalance.toLocaleString()}
                    </div>
                </div>
            ))}
             {userGroups?.length === 0 && !loadingGroups && (
                <p className="text-sm text-muted-foreground text-center py-4">You are not a member of any groups yet.</p>
            )}
            {loadingGroups && <p className="text-sm text-muted-foreground text-center py-4">Loading groups...</p>}
            </div>
        </CardContent>
      </Card>
    </div>
  );
}

    