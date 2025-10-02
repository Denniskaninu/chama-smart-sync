"use client";

import type { ChamaGroup } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Share2, UserPlus } from "lucide-react";

export function GroupHeader({ group }: { group: ChamaGroup }) {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline">{group.name}</h1>
          <p className="text-muted-foreground">{group.description}</p>
        </div>
        <div className="flex gap-2 shrink-0">
          <Button variant="outline"><UserPlus className="mr-2 h-4 w-4" /> Invite</Button>
          <Button variant="outline" size="icon"><Share2 className="h-4 w-4" /></Button>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
        <div className="flex items-center gap-2">
            <span className="font-semibold">Kitty Balance:</span>
            <span className="text-primary font-bold">KSH {group.kittyBalance.toLocaleString()}</span>
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
