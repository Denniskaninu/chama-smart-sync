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
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, CreditCard, Download, Plus } from "lucide-react";

export default function BillingPage() {
    const invoices = [
        { id: "INV001", date: "June 2024", amount: "5.00", status: "Paid" },
        { id: "INV002", date: "May 2024", amount: "5.00", status: "Paid" },
        { id: "INV003", date: "April 2024", amount: "5.00", status: "Paid" },
    ];

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold font-headline">Billing</h1>
        <p className="text-muted-foreground">
          Manage your subscription and payment methods.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
            <Card>
                <CardHeader>
                <CardTitle>Current Plan</CardTitle>
                <CardDescription>You are currently on the Free plan.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                <div className="p-6 bg-muted rounded-lg space-y-4">
                    <div className="flex justify-between items-baseline">
                        <h3 className="text-2xl font-bold font-headline">Free Plan</h3>
                        <p><span className="text-4xl font-bold">$0</span>/month</p>
                    </div>
                    <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Group usage: 2 of 3 groups</p>
                        <Progress value={66} />
                    </div>
                </div>
                <Button>Upgrade Plan</Button>
                </CardContent>
            </Card>

             <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Payment Methods</CardTitle>
                        <CardDescription>Manage your saved payment methods.</CardDescription>
                    </div>
                     <Button variant="outline"><Plus className="mr-2 h-4 w-4" /> Add Method</Button>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                            <CreditCard className="h-8 w-8 text-muted-foreground" />
                            <div>
                                <p className="font-semibold">Visa ending in 1234</p>
                                <p className="text-sm text-muted-foreground">Expires 06/2027</p>
                            </div>
                        </div>
                        <Badge variant="secondary">Primary</Badge>
                    </div>
                </CardContent>
            </Card>

        </div>
        <div className="space-y-8">
             <Card>
                <CardHeader>
                    <CardTitle>Billing History</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    {invoices.map((invoice, index) => (
                        <React.Fragment key={invoice.id}>
                            <div className="flex justify-between items-center py-2">
                                <div>
                                    <p className="font-semibold">{invoice.date}</p>
                                    <p className="text-sm text-muted-foreground">Invoice #{invoice.id}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold">${invoice.amount}</p>
                                    <Badge variant={invoice.status === 'Paid' ? 'default' : 'secondary'} className="mt-1 bg-green-500/20 text-green-700 border-green-500/30">
                                        <CheckCircle className="mr-1 h-3 w-3"/>{invoice.status}
                                    </Badge>
                                </div>
                                <Button variant="ghost" size="icon">
                                    <Download className="h-4 w-4" />
                                </Button>
                            </div>
                            {index < invoices.length - 1 && <Separator />}
                        </React.Fragment>
                    ))}
                </CardContent>
                <CardFooter>
                    <Button variant="outline" className="w-full">View all</Button>
                </CardFooter>
            </Card>
        </div>
      </div>
    </div>
  );
}
import React from "react";
