
'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useFirestore, useDoc, useUser } from '@/firebase';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import type { ChamaGroup, UserProfile } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, Users, CheckCircle, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Logo } from '@/components/icons';
import Link from 'next/link';

export default function JoinGroupPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const id = params.id as string;

  const firestore = useFirestore();
  const { user: currentUser, loading: loadingUser } = useUser();

  const [isJoining, setIsJoining] = useState(false);

  const groupRef = useMemo(() => {
    if (!firestore || !id) return null;
    return doc(firestore, 'groups', id);
  }, [firestore, id]);

  const { data: group, loading: loadingGroup, error: errorGroup } = useDoc<ChamaGroup>(groupRef);

  const isAlreadyMember = useMemo(() => {
    if (!group || !currentUser) return false;
    return group.members.some(member => member.id === currentUser.uid);
  }, [group, currentUser]);

  const handleJoinGroup = async () => {
    if (!firestore || !currentUser || !group || isAlreadyMember) return;

    setIsJoining(true);

    const userProfileToAdd: Pick<UserProfile, 'id' | 'name' | 'avatarUrl'> = {
        id: currentUser.uid,
        name: currentUser.displayName || currentUser.email || 'New Member',
        avatarUrl: currentUser.photoURL || '',
    };
    
    try {
      await updateDoc(groupRef, {
        members: arrayUnion(userProfileToAdd)
      });

      toast({
        title: 'Success!',
        description: `You have successfully joined the group "${group.name}".`,
      });
      router.push(`/dashboard/group/${id}`);

    } catch (error) {
      console.error("Error joining group:", error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not join the group. Please try again.',
      });
      setIsJoining(false);
    }
  };

  useEffect(() => {
    if (!loadingUser && !currentUser) {
      // If user is not logged in, redirect to login page but keep the invite url to redirect back
      router.push(`/login?redirect=/join/${id}`);
    }
  }, [currentUser, loadingUser, router, id]);

  const loading = loadingUser || loadingGroup;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted p-4">
       <div className="absolute top-8 flex items-center gap-2">
            <Logo className="h-8 w-8 text-primary" />
            <span className="text-3xl font-bold font-headline tracking-tighter">ChamaSync</span>
        </div>
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-headline">Group Invitation</CardTitle>
          <CardDescription>You have been invited to join a savings group.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading && (
            <div className="flex flex-col items-center justify-center space-y-4 p-8">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p className="text-muted-foreground">Loading group details...</p>
            </div>
          )}

          {!loading && errorGroup && (
             <div className="flex flex-col items-center justify-center space-y-4 p-8 text-center">
              <AlertTriangle className="h-10 w-10 text-destructive" />
              <p className="font-semibold text-destructive">Group Not Found</p>
              <p className="text-sm text-muted-foreground">
                This invitation link may be invalid or expired.
              </p>
               <Button asChild variant="outline">
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
            </div>
          )}

          {!loading && group && currentUser && (
             <div className="space-y-6 text-center">
                <div className="space-y-2">
                    <h2 className="text-xl font-semibold">{group.name}</h2>
                    <p className="text-muted-foreground">{group.description}</p>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{group.members.length} members</span>
                </div>

                {isAlreadyMember ? (
                    <div className="flex flex-col items-center gap-4 rounded-lg bg-green-500/10 p-4 text-green-700">
                        <CheckCircle className="h-8 w-8"/>
                        <p className="font-semibold">You are already a member of this group.</p>
                        <Button asChild>
                            <Link href={`/dashboard/group/${id}`}>View Group</Link>
                        </Button>
                    </div>
                ) : (
                    <Button onClick={handleJoinGroup} disabled={isJoining} className="w-full">
                        {isJoining ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : null}
                        Join Group
                    </Button>
                )}
             </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
