
"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@/firebase";
import { groups, contributions } from "@/lib/placeholder-data";
import { Edit, AtSign, Calendar, Landmark } from "lucide-react";

export default function ProfilePage() {
  const { user } = useUser();

  if (!user) return null;

  const userGroups = groups.filter(g => g.members.some(m => m.id === 'user-1'));
  const userContributions = contributions.filter(c => c.memberId === 'user-1');
  const totalContributed = userContributions.reduce((acc, c) => acc + c.amount, 0);

  return (
    <div className="space-y-8">
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
            <div className="relative">
              <Avatar className="h-32 w-32 border-4 border-primary/50">
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
            <div className="text-center sm:text-right">
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
            {userGroups.map(group => (
                <div key={group.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="font-semibold">{group.name}</div>
                    <div className="text-sm text-muted-foreground">
                        Balance: KSH {group.kittyBalance.toLocaleString()}
                    </div>
                </div>
            ))}
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
