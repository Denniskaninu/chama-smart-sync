"use client";

import Link from "next/link";
import { Plus, Users, Wallet, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import type { UserProfile, ChamaGroup } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export function DashboardClient({ user, groups }: { user: UserProfile, groups: ChamaGroup[] }) {
  const totalBalance = groups.reduce((acc, group) => acc + group.kittyBalance, 0);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline">Welcome, {user.name.split(' ')[0]}!</h1>
          <p className="text-muted-foreground">Here's your ChamaSync overview.</p>
        </div>
        <Button>
          <Plus className="-ml-1 mr-2 h-4 w-4" />
          Create New Group
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Kitty Balance</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">KSH {totalBalance.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Across all your groups</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Groups</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{groups.length}</div>
            <p className="text-xs text-muted-foreground">You are a member of {groups.length} groups</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month's Trend</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12.5%</div>
            <p className="text-xs text-muted-foreground">Increase in contributions</p>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-2xl font-semibold font-headline mb-4">Your Groups</h2>
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
          <Card className="flex flex-col items-center justify-center p-12 text-center">
            <CardTitle>No groups yet!</CardTitle>
            <CardDescription className="mt-2">Create a new group to get started.</CardDescription>
            <Button className="mt-4">
              <Plus className="-ml-1 mr-2 h-4 w-4" />
              Create Group
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
