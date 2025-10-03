
"use client";
import React, { useMemo, useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Send, Paperclip, Loader2, AlertTriangle, MessagesSquare } from "lucide-react";
import { useUser, useFirestore, useCollection } from "@/firebase";
import { collection, query, orderBy, getDocs, Timestamp } from "firebase/firestore";
import type { Message, ChamaGroup, UserProfile } from "@/lib/types";

export default function MessagesPage() {
    const { user: authUser, loading: loadingUser } = useUser();
    const firestore = useFirestore();
    const [allMessages, setAllMessages] = useState<Message[]>([]);
    const [loadingMessages, setLoadingMessages] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const { data: allGroups, loading: loadingAllGroups } = useCollection<ChamaGroup>(
        useMemo(() => firestore ? collection(firestore, 'groups') : null, [firestore])
    );

    const userGroups = useMemo(() => {
        if (!authUser || !allGroups) return [];
        return allGroups.filter(g => g.members.some(m => m.id === authUser.uid));
    }, [authUser, allGroups]);
    
    useEffect(() => {
        if (loadingUser || loadingAllGroups || !userGroups || !firestore) {
            if(!loadingUser && !loadingAllGroups) {
                setLoadingMessages(false);
                setAllMessages([]);
            }
            return;
        }

        setLoadingMessages(true);
        
        const fetchAllMessages = async () => {
            if (userGroups.length === 0) {
                setAllMessages([]);
                setLoadingMessages(false);
                return;
            }

            try {
                const messagePromises = userGroups.map(group => {
                    const messagesQuery = query(
                        collection(firestore, 'groups', group.id, 'messages'),
                        orderBy('timestamp', 'desc')
                    );
                    return getDocs(messagesQuery);
                });

                const snapshots = await Promise.all(messagePromises);

                const fetchedMessages = snapshots.flatMap(snapshot => 
                    snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message))
                );
                
                fetchedMessages.sort((a, b) => {
                    const dateA = a.timestamp?.toDate ? a.timestamp.toDate().getTime() : 0;
                    const dateB = b.timestamp?.toDate ? b.timestamp.toDate().getTime() : 0;
                    return dateA - dateB;
                });

                setAllMessages(fetchedMessages);
                setError(null);
            } catch (err: any) {
                console.error("Error fetching all messages:", err);
                setError(err);
            } finally {
                setLoadingMessages(false);
            }
        };

        fetchAllMessages();

    }, [userGroups, loadingUser, loadingAllGroups, firestore]);

    const allMembers = useMemo(() => {
        if (!allGroups) return [];
        const memberMap = new Map<string, Pick<UserProfile, 'id' | 'name' | 'avatarUrl'>>();
        allGroups.forEach(g => {
            g.members.forEach(m => {
                if (!memberMap.has(m.id)) {
                    memberMap.set(m.id, m);
                }
            });
        });
        return Array.from(memberMap.values());
    }, [allGroups]);

    const getGroupAndMemberInfo = (message: Message) => {
        const member = allMembers.find(m => m.id === message.senderId);
        const group = allGroups?.find(g => g.id === message.groupId);

        const senderPhoto = member?.avatarUrl;
        const senderName = member?.name;
        const senderFallback = (senderName?.charAt(0) || 'U').toUpperCase();

        return { senderPhoto, senderName, senderFallback, groupName: group?.name };
    }

    const formatDate = (date: any) => {
        if (!date) return '...';
        const jsDate = date.toDate ? date.toDate() : new Date(date);
        return jsDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) + ', ' + jsDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    }
    
    const loading = loadingUser || loadingAllGroups || loadingMessages;

  return (
    <div className="space-y-8">
        <div>
            <h1 className="text-3xl font-bold font-headline">Messages</h1>
            <p className="text-muted-foreground">Group discussions and announcements.</p>
        </div>
      <Card className="flex flex-col h-[70vh]">
        <CardHeader>
          <CardTitle>All Group Messages</CardTitle>
          <CardDescription>A combined feed of all your group discussions.</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow overflow-y-auto space-y-4 p-4">
            {loading && <div className="flex justify-center items-center h-full"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>}
            
            {error && (
                 <div className="flex flex-col items-center justify-center h-full text-center">
                    <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
                    <h3 className="text-xl font-semibold text-destructive">Error Loading Messages</h3>
                    <p className="text-muted-foreground mt-2 max-w-md">
                        There was a problem fetching the messages. Please try refreshing the page.
                    </p>
                    <p className="text-xs text-muted-foreground mt-4 p-2 bg-muted rounded-md max-w-md">
                        <strong>Error:</strong> {error.message}
                    </p>
                </div>
            )}

            {!loading && !error && allMessages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                    <MessagesSquare className="h-12 w-12 mb-4" />
                    <h3 className="text-lg font-semibold">No messages yet</h3>
                    <p>Start a conversation in one of your groups.</p>
                </div>
            )}

            {!loading && !error && allMessages.map(message => {
                const isCurrentUser = message.senderId === authUser?.uid;
                const { senderPhoto, senderName, senderFallback, groupName } = getGroupAndMemberInfo(message);
                
                return (
                <div key={message.id} className={`flex items-end gap-2 ${isCurrentUser ? 'justify-end' : ''}`}>
                    {!isCurrentUser && (
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={senderPhoto || undefined} />
                        <AvatarFallback>{senderFallback}</AvatarFallback>
                    </Avatar>
                    )}
                    <div className={`max-w-md rounded-lg p-3 ${isCurrentUser ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                    <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold">{isCurrentUser ? "You" : (senderName || "Unknown User")}</p>
                        <p className={`text-xs ${isCurrentUser ? 'text-primary-foreground/80' : 'text-muted-foreground/80'}`}>in {groupName || "Unknown Group"}</p>
                    </div>
                    <p className="text-sm mt-1">{message.text}</p>
                    <p className={`text-xs mt-1 text-right ${isCurrentUser ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>{formatDate(message.timestamp)}</p>
                    </div>
                    {isCurrentUser && (
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={authUser?.photoURL || undefined} />
                        <AvatarFallback>{(authUser?.displayName?.charAt(0) || 'U').toUpperCase()}</AvatarFallback>
                    </Avatar>
                    )}
                </div>
                );
            })}
        </CardContent>
        <Separator />
        <div className="p-4 bg-background">
            <p className="text-xs text-center text-muted-foreground mb-2">
                Sending messages from this page is disabled. Please go to a specific group to send a message.
            </p>
          <div className="relative">
            <Input 
                placeholder="Go to a group to send a message..." 
                className="pr-20" 
                disabled
            />
            <div className="absolute top-1/2 right-2 -translate-y-1/2 flex items-center gap-2">
              <Button variant="ghost" size="icon" disabled><Paperclip className="h-4 w-4" /></Button>
              <Button size="sm" disabled>Send <Send className="h-4 w-4 ml-2" /></Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
