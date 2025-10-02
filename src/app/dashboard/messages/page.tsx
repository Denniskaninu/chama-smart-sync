"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { messages, user as currentUser, groups } from "@/lib/placeholder-data";
import { Send, Paperclip } from "lucide-react";

export default function MessagesPage() {
    const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  return (
    <div className="space-y-8">
        <div>
            <h1 className="text-3xl font-bold font-headline">Messages</h1>
            <p className="text-muted-foreground">Group discussions and announcements.</p>
        </div>
      <Card className="flex flex-col h-[70vh]">
        <CardHeader>
          <CardTitle>All Group Messages</CardTitle>
          <CardDescription>Discuss group matters here.</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow overflow-y-auto space-y-4">
          {messages.map(message => {
            const isCurrentUser = message.senderId === currentUser.id;
            const member = groups.flatMap(g => g.members).find(m => m.id === message.senderId);
            const group = groups.find(g => g.id === message.groupId);
            return (
              <div key={message.id} className={`flex items-end gap-2 ${isCurrentUser ? 'justify-end' : ''}`}>
                {!isCurrentUser && (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={member?.avatarUrl} />
                    <AvatarFallback>{member?.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                )}
                <div className={`max-w-md rounded-lg p-3 ${isCurrentUser ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold">{member?.name}</p>
                    <p className="text-xs text-muted-foreground/80">in {group?.name}</p>
                  </div>
                  <p className="text-sm mt-1">{message.text}</p>
                  <p className={`text-xs mt-1 text-right ${isCurrentUser ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>{formatDate(message.timestamp)}</p>
                </div>
                 {isCurrentUser && (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={member?.avatarUrl} />
                    <AvatarFallback>{member?.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                )}
              </div>
            );
          })}
        </CardContent>
        <Separator />
        <div className="p-4 bg-background">
          <div className="relative">
            <Input placeholder="Type a message..." className="pr-20" />
            <div className="absolute top-1/2 right-2 -translate-y-1/2 flex items-center gap-2">
              <Button variant="ghost" size="icon"><Paperclip className="h-4 w-4" /></Button>
              <Button size="sm">Send <Send className="h-4 w-4 ml-2" /></Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
