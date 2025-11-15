
"use client";

import React, { useState, useMemo } from "react";
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
import { CheckCircle, CreditCard, Download, Plus, Check, Loader2 } from "lucide-react";
import { useUser } from "@/firebase";
import { subscriptions as allPlans, paymentMethods as initialPaymentMethods, invoices as initialInvoices } from "@/lib/placeholder-data";
import type { SubscriptionPlan, PaymentMethod, Invoice } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

export default function BillingPage() {
    const { user } = useUser();
    const { toast } = useToast();
    
    // Simulate fetching and managing state for billing data
    const [currentPlanId, setCurrentPlanId] = useState('free');
    const [isLoading, setIsLoading] = useState<string | null>(null);

    const currentPlan = useMemo(() => {
        const plan = allPlans.find(sub => sub.planId === currentPlanId);
        // Let's create a dynamic usage for the active plan
        if (plan) {
            return {
                ...plan,
                status: 'active',
                usage: {
                    groupsUsed: 2,
                    groupsLimit: plan.planId === 'pro' ? 1000 : 3,
                }
            } as SubscriptionPlan
        }
        return allPlans.find(sub => sub.planId === 'free') as SubscriptionPlan;
    }, [currentPlanId]);

    const otherPlans = allPlans.filter(p => p.planId !== 'free');
    const freePlan = allPlans.find(p => p.planId === 'free') as SubscriptionPlan;
    
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(initialPaymentMethods);
    const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);


    const handlePlanChange = (planId: string) => {
        setIsLoading(planId);
        // Simulate an API call
        setTimeout(() => {
            setCurrentPlanId(planId);
            setIsLoading(null);
            toast({
                title: "Subscription Updated!",
                description: `You are now on the ${allPlans.find(p => p.planId === planId)?.name}.`
            })
        }, 1500);
    }

    if (!user) return null;

    const formatCurrency = (amount: number) => `KSH ${amount.toLocaleString()}`;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold font-headline">Billing</h1>
        <p className="text-muted-foreground">
          Manage your subscription and payment methods.
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-8">
            <Card>
                <CardHeader>
                <CardTitle>Current Plan</CardTitle>
                <CardDescription>You are currently on the <span className="font-semibold text-primary">{currentPlan.name}</span>.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                <div className="p-4 sm:p-6 bg-muted rounded-lg space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-baseline gap-2">
                        <h3 className="text-2xl font-bold font-headline">{currentPlan.name}</h3>
                        <p><span className="text-4xl font-bold">{formatCurrency(currentPlan.price)}</span>/month</p>
                    </div>
                    <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Group usage: {currentPlan.usage.groupsUsed} of {currentPlan.usage.groupsLimit === 1000 ? 'Unlimited' : currentPlan.usage.groupsLimit} groups</p>
                        <Progress value={(currentPlan.usage.groupsUsed / (currentPlan.usage.groupsLimit === 1000 ? currentPlan.usage.groupsUsed : currentPlan.usage.groupsLimit)) * 100} />
                    </div>
                </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[freePlan, ...otherPlans].map((plan: SubscriptionPlan) => (
                    <Card key={plan.planId} className={`flex flex-col ${currentPlan.planId === plan.planId ? 'border-primary ring-2 ring-primary' : ''}`}>
                        <CardHeader>
                            <CardTitle>{plan.name}</CardTitle>
                            <CardDescription>{plan.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow space-y-4">
                             <p className="text-4xl font-bold">{formatCurrency(plan.price)}<span className="text-sm font-normal text-muted-foreground">/month</span></p>
                            <ul className="space-y-2 text-sm">
                                {plan.features.map(feature => (
                                    <li key={feature} className="flex items-center gap-2">
                                        <Check className="h-4 w-4 text-green-500"/>
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button 
                                className="w-full" 
                                disabled={currentPlan.planId === plan.planId || isLoading === plan.planId}
                                onClick={() => handlePlanChange(plan.planId)}
                            >
                                {isLoading === plan.planId ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : currentPlan.planId === plan.planId ? 'Current Plan' : (currentPlan.price > plan.price ? 'Downgrade' : 'Upgrade')}
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>


             <Card>
                <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <div>
                        <CardTitle>Payment Methods</CardTitle>
                        <CardDescription>Manage your saved payment methods.</CardDescription>
                    </div>
                     <Button variant="outline" onClick={() => toast({ title: "Coming Soon!", description: "Adding new payment methods will be available in a future update."})}><Plus className="mr-2 h-4 w-4" /> Add Method</Button>
                </CardHeader>
                <CardContent>
                    {paymentMethods.map(method => (
                         <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center gap-4">
                                <CreditCard className="h-8 w-8 text-muted-foreground" />
                                <div>
                                    <p className="font-semibold">{method.cardType} ending in {method.last4}</p>
                                    <p className="text-sm text-muted-foreground">Expires {method.expiry}</p>
                                </div>
                            </div>
                            {method.isPrimary && <Badge variant="secondary">Primary</Badge>}
                        </div>
                    ))}
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
                                    <p className="font-semibold">{formatCurrency(invoice.amount)}</p>
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

    

    