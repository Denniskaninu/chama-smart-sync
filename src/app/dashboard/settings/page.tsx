
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUser, useAuth } from "@/firebase";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { updateProfile } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export default function SettingsPage() {
  const { user } = useUser();
  const auth = useAuth();
  const { toast } = useToast();
  
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [isSaving, setIsSaving] = useState(false);

  const handleUpdateProfile = async () => {
    if (!user || !auth || !displayName || displayName === user.displayName) {
        return;
    }
    
    setIsSaving(true);
    try {
        await updateProfile(user, { displayName });
        toast({
            title: "Profile Updated",
            description: "Your display name has been successfully updated.",
        });
    } catch (error: any) {
        toast({
            variant: "destructive",
            title: "Update Failed",
            description: error.message || "Could not update your profile.",
        });
    } finally {
        setIsSaving(false);
    }
  };


  if (!user) return null;

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold font-headline">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account and notification settings.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>
            This is your public display name.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" defaultValue={user.email || ""} disabled />
          </div>
          <Button onClick={handleUpdateProfile} disabled={isSaving || displayName === user.displayName}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Update Profile
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>
            Choose what you want to be notified about.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <Label htmlFor="contributions-notifications" className="font-medium">New Contributions</Label>
                    <p className="text-sm text-muted-foreground">When a member makes a contribution.</p>
                </div>
                <Switch id="contributions-notifications" defaultChecked />
            </div>
            <Separator />
             <div className="flex items-center justify-between">
                <div>
                    <Label htmlFor="loans-notifications" className="font-medium">Loan Applications</Label>
                    <p className="text-sm text-muted-foreground">When a member applies for a loan.</p>
                </div>
                <Switch id="loans-notifications" defaultChecked />
            </div>
             <Separator />
             <div className="flex items-center justify-between">
                <div>
                    <Label htmlFor="messages-notifications" className="font-medium">New Messages</Label>
                    <p className="text-sm text-muted-foreground">When you receive a new message in a group.</p>
                </div>
                <Switch id="messages-notifications" />
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
