
"use client";

import { useMemo, useState } from "react";
import { useFirestore, useCollection, useUser } from "@/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import Link from "next/link";
import { Plus, Users, Loader2 } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import type { ChamaGroup } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";

function CreateGroupDialog() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreateGroup = async () => {
    if (!firestore || !user || !name || !description) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill out all fields.",
      });
      return;
    }
    setLoading(true);

    const groupData = {
      name,
      description,
      createdBy: user.uid,
      kittyBalance: 0,
      merryGoRoundIndex: 0,
      members: [
        {
          id: user.uid,
          name: user.displayName || user.email,
          avatarUrl: user.photoURL || "",
        },
      ],
      createdAt: serverTimestamp(),
    };

    const groupsCollection = collection(firestore, "groups");
    addDoc(groupsCollection, groupData)
      .then(() => {
        toast({
          title: "Group Created!",
          description: `The group "${name}" has been successfully created.`,
        });
        setOpen(false);
        setName("");
        setDescription("");
      })
      .catch((serverError) => {
        const permissionError = new FirestorePermissionError({
          path: "groups",
          operation: "create",
          requestResourceData: groupData,
        });
        errorEmitter.emit("permission-error", permissionError);
        toast({
          variant: "destructive",
          title: "Error Creating Group",
          description: "Could not create the group. Please check permissions.",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create New Group
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a New Savings Group</DialogTitle>
          <DialogDescription>
            Fill in the details below to start a new chama.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
              placeholder="e.g., Kilimani Young Investors"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3"
              placeholder="A short description of the group"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            onClick={handleCreateGroup}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Create Group
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function GroupCardSkeleton() {
    return (
        <Card className="flex flex-col">
            <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent className="flex-grow space-y-4">
                 <Skeleton className="h-4 w-full" />
                 <Skeleton className="h-4 w-2/3" />
            </CardContent>
            <CardFooter>
                 <Skeleton className="h-10 w-full" />
            </CardFooter>
        </Card>
    )
}

export default function GroupsPage() {
  const firestore = useFirestore();
  const { user } = useUser();

  const groupsQuery = useMemo(() => {
    if (!firestore) return null;
    return collection(firestore, "groups");
  }, [firestore]);

  const { data: groups, loading } = useCollection<ChamaGroup>(groupsQuery);
  const userGroups = useMemo(() => {
    if (!groups || !user) return [];
    return groups.filter(g => g.members.some(m => m.id === user.uid));
  }, [groups, user]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline">My Groups</h1>
          <p className="text-muted-foreground">
            All your savings groups in one place.
          </p>
        </div>
        <CreateGroupDialog />
      </div>

      {loading && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => <GroupCardSkeleton key={i} />)}
        </div>
      )}

      {!loading && userGroups.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {userGroups.map((group) => (
            <Card key={group.id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="font-headline">{group.name}</CardTitle>
                <CardDescription>{group.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Kitty Balance
                  </span>
                  <span className="font-semibold">
                    KSH {group.kittyBalance.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">Members</span>
                  <div className="flex -space-x-2 overflow-hidden">
                    {group.members.slice(0, 5).map((member, index) => (
                      <Avatar
                        key={index}
                        className="h-6 w-6 border-2 border-card"
                      >
                        <AvatarImage
                          src={member.avatarUrl}
                          alt={member.name}
                        />
                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                  {group.members.length > 5 && (
                    <span className="text-xs text-muted-foreground">
                      +{group.members.length - 5}
                    </span>
                  )}
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
      ) : !loading && (
        <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed">
          <Users className="w-12 h-12 text-muted-foreground mb-4" />
          <CardTitle>No groups yet!</CardTitle>
          <CardDescription className="mt-2">
            Create or join a group to get started.
          </CardDescription>
          <div className="mt-4">
            <CreateGroupDialog />
          </div>
        </Card>
      )}
    </div>
  );
}
