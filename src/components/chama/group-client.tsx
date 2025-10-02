"use client";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GroupHeader } from "@/components/chama/group-header";
import { ContributionsLineChart, LoansPieChart } from "@/components/chama/charts";
import { MpesaReferenceCheck } from "@/components/chama/mpesa-check";
import type { ChamaGroup, Contribution, Loan, Message, Receipt, UserProfile } from "@/lib/types";
import { loansChartData, contributionsChartData } from "@/lib/placeholder-data";
import { Plus, Check, X, ThumbsUp, ThumbsDown, ArrowRight, Paperclip, Send } from "lucide-react";
import Image from "next/image";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";

type GroupClientProps = {
  group: ChamaGroup;
  contributions: Contribution[];
  loans: Loan[];
  messages: Message[];
  receipts: Receipt[];
  currentUser: UserProfile;
};

export function GroupClient({ group, contributions, loans, messages, receipts, currentUser }: GroupClientProps) {
  const currentMerryGoRoundMember = group.members[group.merryGoRoundIndex];

  const formatCurrency = (amount: number) => `KSH ${amount.toLocaleString()}`;
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="space-y-6">
      <GroupHeader group={group} />
      <Tabs defaultValue="contributions" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-6">
          <TabsTrigger value="contributions">Contributions</TabsTrigger>
          <TabsTrigger value="merry-go-round">Merry-Go-Round</TabsTrigger>
          <TabsTrigger value="loans">Loans</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="receipts">Receipts</TabsTrigger>
        </TabsList>
        
        <TabsContent value="contributions">
          <Card>
            <CardHeader>
              <CardTitle>Contributions</CardTitle>
              <CardDescription>All member contributions are recorded here.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>M-Pesa Ref</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contributions.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell className="font-medium">{c.memberName}</TableCell>
                      <TableCell className="text-right">{formatCurrency(c.amount)}</TableCell>
                      <TableCell>{formatDate(c.date)}</TableCell>
                      <TableCell className="flex items-center gap-2">
                        {c.ref} <MpesaReferenceCheck referenceCode={c.ref} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="merry-go-round">
          <Card>
            <CardHeader>
              <CardTitle>Merry-Go-Round</CardTitle>
              <CardDescription>Current rotational savings status.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center text-center space-y-4">
              <p className="text-muted-foreground">Current Beneficiary</p>
              <Avatar className="h-24 w-24 border-4 border-primary shadow-lg">
                <AvatarImage src={currentMerryGoRoundMember.avatarUrl} />
                <AvatarFallback className="text-3xl">{currentMerryGoRoundMember.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <h3 className="text-2xl font-bold font-headline">{currentMerryGoRoundMember.name}</h3>
              <Badge>Cycle {group.merryGoRoundIndex + 1} of {group.members.length}</Badge>
              <Button>
                Advance to Next Member <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="loans">
          <Card>
            <CardHeader>
              <CardTitle>Loan Requests</CardTitle>
              <CardDescription>Manage and vote on loan applications.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-end">
                <Button><Plus className="mr-2 h-4 w-4" />Request Loan</Button>
              </div>
              <div className="space-y-4">
                {loans.map(loan => (
                  <div key={loan.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold">{loan.memberName}</p>
                        <p className="text-sm text-muted-foreground">Requesting <span className="font-bold text-foreground">{formatCurrency(loan.amount)}</span></p>
                      </div>
                      <Badge variant={loan.status === 'approved' ? 'default' : loan.status === 'rejected' ? 'destructive' : 'secondary'}>{loan.status}</Badge>
                    </div>
                    {loan.status === 'pending' && (
                       <div className="flex items-center justify-between pt-2 border-t">
                         <p className="text-sm text-muted-foreground">Vote now:</p>
                         <div className="flex gap-2">
                          <Button variant="outline" size="sm"><ThumbsUp className="h-4 w-4 mr-2 text-green-500" />Approve</Button>
                          <Button variant="outline" size="sm"><ThumbsDown className="h-4 w-4 mr-2 text-red-500" />Reject</Button>
                         </div>
                       </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports">
          <div className="grid gap-6 md:grid-cols-2">
            <ContributionsLineChart data={contributionsChartData} />
            <LoansPieChart data={loansChartData} />
          </div>
        </TabsContent>
        
        <TabsContent value="messages">
          <Card className="flex flex-col h-[60vh]">
            <CardHeader>
              <CardTitle>Community Wall</CardTitle>
              <CardDescription>Discuss group matters here.</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow overflow-y-auto space-y-4">
              {messages.map(message => {
                const isCurrentUser = message.senderId === currentUser.id;
                const member = group.members.find(m => m.id === message.senderId);
                return (
                  <div key={message.id} className={`flex items-end gap-2 ${isCurrentUser ? 'justify-end' : ''}`}>
                    {!isCurrentUser && (
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={member?.avatarUrl} />
                        <AvatarFallback>{member?.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    )}
                    <div className={`max-w-xs rounded-lg p-3 ${isCurrentUser ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                      <p className="text-sm">{message.text}</p>
                      <p className={`text-xs mt-1 ${isCurrentUser ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>{formatDate(message.timestamp)}</p>
                    </div>
                     {isCurrentUser && (
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={member?.avatarUrl} />
                        <AvatarFallback>{member?.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                );
              })}
            </CardContent>
            <Separator />
            <div className="p-4">
              <div className="relative">
                <Input placeholder="Type a message..." className="pr-20" />
                <div className="absolute top-1/2 right-2 -translate-y-1/2 flex items-center gap-2">
                  <Button variant="ghost" size="icon"><Paperclip className="h-4 w-4" /></Button>
                  <Button size="sm">Send <Send className="h-4 w-4 ml-2" /></Button>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="receipts">
          <Card>
            <CardHeader>
              <CardTitle>Receipts & Proof</CardTitle>
              <CardDescription>Uploaded receipts for transparency.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {receipts.map(receipt => (
                   <div key={receipt.id} className="relative aspect-[2/3] rounded-lg overflow-hidden border shadow-sm">
                     <Image src={receipt.url} alt={`Receipt from ${formatDate(receipt.timestamp)}`} layout="fill" objectFit="cover" data-ai-hint="receipt paper" />
                     <div className="absolute inset-x-0 bottom-0 bg-black/50 p-2 text-white">
                        <p className="text-xs truncate">Uploaded by {group.members.find(m => m.id === receipt.uploadedBy)?.name}</p>
                     </div>
                   </div>
                ))}
              </div>
               <div className="flex justify-center mt-6">
                <Button variant="outline"><Plus className="mr-2 h-4 w-4" />Upload Receipt</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
