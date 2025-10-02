"use client";

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
import { useUser } from "@/firebase";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
  const { user } = useUser();

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
            <Input id="name" defaultValue={user.displayName || ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" defaultValue={user.email || ""} disabled />
          </div>
          <Button>Update Profile</Button>
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
