
"use client";

import { useState } from "react";
import type { ChamaGroup } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Share2, UserPlus, Copy } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export function GroupHeader({ group }: { group: ChamaGroup }) {
  const { toast } = useToast();
  const [inviteLink, setInviteLink] = useState("");

  const generateInviteLink = () => {
    // In a real app, you might generate a unique, short-lived token.
    // For now, we'll use the group ID.
    const link = `${window.location.origin}/join/${group.id}`;
    setInviteLink(link);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(inviteLink).then(() => {
      toast({
        title: "Copied to Clipboard",
        description: "The invite link has been copied.",
      });
    }).catch(err => {
        toast({
            variant: "destructive",
            title: "Failed to Copy",
            description: "Could not copy the link to your clipboard.",
        });
    });
  };

  const handleShare = () => {
    const shareData = {
        title: `Join my Chama: ${group.name}`,
        text: `You've been invited to join the savings group "${group.name}". Use this link to join:`,
        url: `${window.location.origin}/join/${group.id}`
    };

    if (navigator.share && navigator.canShare(shareData)) {
        navigator.share(shareData).catch((err) => {
            if (err.name !== 'AbortError') {
                 toast({
                    variant: "destructive",
                    title: "Share Failed",
                    description: "There was an error trying to share the invitation.",
                });
            }
        });
    } else {
        // Fallback for browsers that don't support navigator.share
        navigator.clipboard.writeText(shareData.url).then(() => {
            toast({
                title: "Link Copied",
                description: "Sharing is not available on this browser. The invite link has been copied to your clipboard instead.",
            });
        });
    }
  }


  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline">{group.name}</h1>
          <p className="text-muted-foreground">{group.description}</p>
        </div>
        <div className="flex gap-2 shrink-0">
          <Dialog onOpenChange={(open) => open && generateInviteLink()}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <UserPlus className="mr-2 h-4 w-4" /> Invite
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Invite Members</DialogTitle>
                <DialogDescription>
                  Share this link with people you want to invite to join "{group.name}".
                </DialogDescription>
              </DialogHeader>
              <div className="flex items-center space-x-2 pt-4">
                <div className="grid flex-1 gap-2">
                  <Label htmlFor="link" className="sr-only">
                    Link
                  </Label>
                  <Input
                    id="link"
                    defaultValue={inviteLink}
                    readOnly
                  />
                </div>
                <Button type="button" size="icon" className="px-3" onClick={copyToClipboard}>
                  <span className="sr-only">Copy</span>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <Button variant="outline" size="icon" onClick={handleShare}>
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
        <div className="flex items-center gap-2">
          <span className="font-semibold">Kitty Balance:</span>
          <span className="text-primary font-bold">
            KSH {group.kittyBalance.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-semibold">Members:</span>
          <div className="flex -space-x-2 overflow-hidden">
            {group.members.map((member) => (
              <Avatar key={member.id} className="h-6 w-6 border-2 border-card">
                <AvatarImage src={member.avatarUrl} alt={member.name} />
                <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
              </Avatar>
            ))}
          </div>
          <span>{group.members.length}</span>
        </div>
      </div>
    </div>
  );
}
