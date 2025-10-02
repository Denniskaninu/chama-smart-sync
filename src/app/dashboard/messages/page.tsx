"use client";
import React, { useMemo, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Send, Paperclip, Loader2 } from "lucide-react";
import { useUser, useFirestore } from "@/firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import { collectionGroup, query, orderBy } from "firebase/firestore";
import type { Message } from "@/lib/types";
import { groups as staticGroups } from "@/lib/placeholder-data"; 

export default function MessagesPage() {
    const { user: authUser } = useUser();
    const firestore = useFirestore();

    const messagesQuery = useMemo(() => {
        if (!firestore) return null;
        return query(collectionGroup(firestore, 'messages'), orderBy('timestamp', 'asc'));
    }, [firestore]);

    const [messagesSnapshot, loading, error] = useCollection(messagesQuery);

    const messages = useMemo(() => {
        if (!messagesSnapshot) return [];
        return messagesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message));
    }, [messagesSnapshot]);

    const allMembers = useMemo(() => staticGroups.flatMap(g => g.members), []);

    const formatDate = (date: any) => {
        if (!date) return '...';
        const jsDate = date.toDate ? date.toDate() : new Date(date);
        return jsDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    }

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
            {error && <p className="text-destructive text-center">Error loading messages. A Firestore index is required. Please check the console.</p>}
            {!loading && messages.map(message => {
                const isCurrentUser = message.senderId === authUser?.uid;
                const member = allMembers.find(m => m.id === message.senderId);
                const group = staticGroups.find(g => g.id === message.groupId);

                const senderPhoto = isCurrentUser ? authUser?.photoURL : member?.avatarUrl;
                const senderName = isCurrentUser ? authUser?.displayName : member?.name;
                const senderFallback = (senderName?.charAt(0) || 'U').toUpperCase();
                
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
                        <p className="text-sm font-semibold">{senderName || "Unknown User"}</p>
                        <p className="text-xs text-muted-foreground/80">in {group?.name || "Unknown Group"}</p>
                    </div>
                    <p className="text-sm mt-1">{message.text}</p>
                    <p className={`text-xs mt-1 text-right ${isCurrentUser ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>{formatDate(message.timestamp)}</p>
                    </div>
                    {isCurrentUser && (
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={senderPhoto || undefined} />
                        <AvatarFallback>{senderFallback}</AvatarFallback>
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
