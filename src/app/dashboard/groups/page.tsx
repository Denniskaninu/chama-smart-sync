"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, Users } from "lucide-react";
import Link from "next/link";
import { groups } from "@/lib/placeholder-data";

export default function GroupsPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline">My Groups</h1>
          <p className="text-muted-foreground">All your savings groups in one place.</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create New Group
        </Button>
      </div>

      {groups.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {groups.map((group) => (
            <Card key={group.id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="font-headline">{group.name}</CardTitle>
                <CardDescription>{group.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Kitty Balance</span>
                  <span className="font-semibold">KSH {group.kittyBalance.toLocaleString()}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">Members</span>
                  <div className="flex -space-x-2 overflow-hidden">
                    {group.members.slice(0, 5).map((member) => (
                       <Avatar key={member.id} className="h-6 w-6 border-2 border-card">
                         <AvatarImage src={member.avatarUrl} alt={member.name} />
                         <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                       </Avatar>
                    ))}
                  </div>
                   {group.members.length > 5 && <span className="text-xs text-muted-foreground">+{group.members.length - 5}</span>}
                </div>
              </CardContent>
              <CardFooter>
                <Link href={`/dashboard/group/${group.id}`} className="w-full">
                  <Button className="w-full">View Group</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed">
          <Users className="w-12 h-12 text-muted-foreground mb-4" />
          <CardTitle>No groups yet!</CardTitle>
          <CardDescription className="mt-2">Create or join a group to get started.</CardDescription>
          <Button className="mt-4">
            <Plus className="mr-2 h-4 w-4" />
            Create Group
          </Button>
        </Card>
      )}
    </div>
  );
}
