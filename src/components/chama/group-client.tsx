
"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GroupHeader } from "@/components/chama/group-header";
import { ContributionsLineChart, LoansPieChart } from "@/components/chama/charts";
import { MpesaReferenceCheck } from "@/components/chama/mpesa-check";
import type { ChamaGroup, Contribution, Loan, Message, Receipt, UserProfile } from "@/lib/types";
import { loansChartData, contributionsChartData } from "@/lib/placeholder-data";
import { Plus, ArrowRight, Paperclip, Send, ThumbsDown, ThumbsUp, Loader2, Vote } from "lucide-react";
import Image from "next/image";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useUser, useFirestore, useCollection } from "@/firebase";
import { collection, query, orderBy, where, addDoc, serverTimestamp, setDoc, doc, updateDoc, writeBatch, runTransaction } from "firebase/firestore";
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { useToast } from "@/hooks/use-toast";
import { UploadReceiptDialog } from "./upload-receipt-dialog";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";


type GroupClientProps = {
  group: ChamaGroup;
  initialContributions: Contribution[];
  initialLoans: Loan[];
  initialReceipts: Receipt[];
};

function MakeContributionDialog({ group, user }: { group: ChamaGroup; user: UserProfile }) {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [open, setOpen] = useState(false);
    const [amount, setAmount] = useState("");
    const [mpesaRef, setMpesaRef] = useState("");
    const [loading, setLoading] = useState(false);

    const handleContribution = async () => {
        if (!firestore || !user || !amount || !mpesaRef || isNaN(parseInt(amount)) || parseInt(amount) <= 0) {
            toast({
                variant: "destructive",
                title: "Invalid Input",
                description: "Please fill in a valid amount and M-Pesa reference.",
            });
            return;
        }
        setLoading(true);

        const groupRef = doc(firestore, "groups", group.id);
        const contributionsCol = collection(firestore, "contributions");
        
        const contributionData = {
            groupId: group.id,
            memberId: user.id,
            memberName: user.name,
            amount: parseInt(amount),
            ref: mpesaRef.toUpperCase(),
            date: new Date().toISOString(),
            createdAt: serverTimestamp(),
        };

        try {
            await runTransaction(firestore, async (transaction) => {
                const groupDoc = await transaction.get(groupRef);
                if (!groupDoc.exists()) {
                    throw new Error("Group does not exist!");
                }
                const newBalance = groupDoc.data().kittyBalance + parseInt(amount);
                
                transaction.update(groupRef, { kittyBalance: newBalance });
                transaction.set(doc(contributionsCol), contributionData);
            });

            toast({
                title: "Contribution Successful!",
                description: `Your contribution of KSH ${parseInt(amount).toLocaleString()} has been recorded.`,
            });
            setOpen(false);
            setAmount("");
            setMpesaRef("");
        } catch (error: any) {
             const isPermissionError = error.code === 'permission-denied';
             const permissionError = new FirestorePermissionError({
                path: isPermissionError ? `groups/${group.id}` : 'contributions',
                operation: 'update',
                requestResourceData: { amount: parseInt(amount) },
            });
            errorEmitter.emit('permission-error', permissionError);
            toast({
                variant: "destructive",
                title: "Contribution Failed",
                description: error.message || "Could not record your contribution. Please check permissions.",
            });
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button><Plus className="mr-2 h-4 w-4" />Make Contribution</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Make a Contribution</DialogTitle>
                    <DialogDescription>
                        Record your contribution to the group. Please ensure you have already sent the money.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="amount" className="text-right">
                            Amount (KSH)
                        </Label>
                        <Input
                            id="amount"
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="col-span-3"
                            placeholder="e.g., 5000"
                        />
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="mpesaRef" className="text-right">
                            M-Pesa Ref
                        </Label>
                        <Input
                            id="mpesaRef"
                            value={mpesaRef}
                            onChange={(e) => setMpesaRef(e.target.value)}
                            className="col-span-3"
                            placeholder="e.g., SFT8A7S1L0"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        type="submit"
                        onClick={handleContribution}
                        disabled={loading}
                    >
                        {loading ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : null}
                        Record Contribution
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

function RequestLoanDialog({ group, user }: { group: ChamaGroup, user: UserProfile }) {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [open, setOpen] = useState(false);
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRequestLoan = async () => {
        if (!firestore || !user || !amount || isNaN(parseInt(amount)) || parseInt(amount) <= 0) {
            toast({
                variant: "destructive",
                title: "Invalid Amount",
                description: "Please enter a valid loan amount.",
            });
            return;
        }

        if (parseInt(amount) > group.kittyBalance) {
            toast({
                variant: "destructive",
                title: "Amount Exceeds Kitty Balance",
                description: `You cannot request a loan greater than the group's total balance of KSH ${group.kittyBalance.toLocaleString()}.`,
            });
            return;
        }

        setLoading(true);

        const loanData = {
            groupId: group.id,
            memberId: user.id,
            memberName: user.name,
            amount: parseInt(amount),
            status: "pending" as const,
            votes: [],
            repayments: [],
            createdAt: serverTimestamp(),
        };

        const loansCollection = collection(firestore, "loans");
        addDoc(loansCollection, loanData)
            .then(() => {
                toast({
                    title: "Loan Request Submitted!",
                    description: `Your request for KSH ${parseInt(amount).toLocaleString()} has been submitted for voting.`,
                });
                setOpen(false);
                setAmount("");
            })
            .catch((serverError) => {
                const permissionError = new FirestorePermissionError({
                    path: "loans",
                    operation: "create",
                    requestResourceData: loanData,
                });
                errorEmitter.emit("permission-error", permissionError);
                toast({
                    variant: "destructive",
                    title: "Error Submitting Request",
                    description: "Could not submit your loan request. Please check permissions.",
                });
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button><Plus className="mr-2 h-4 w-4" />Request Loan</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Request a Loan</DialogTitle>
                    <DialogDescription>
                        Your request will be subject to votes from other group members. The current kitty balance is KSH {group.kittyBalance.toLocaleString()}.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="amount" className="text-right">
                            Amount (KSH)
                        </Label>
                        <Input
                            id="amount"
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="col-span-3"
                            placeholder="e.g., 10000"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        type="submit"
                        onClick={handleRequestLoan}
                        disabled={loading}
                    >
                        {loading ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : null}
                        Submit Request
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}


export function GroupClient({ group, initialContributions, initialLoans, initialReceipts }: GroupClientProps) {
  const { user: authUser } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Real-time listeners for dynamic data
  const messagesQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'groups', group.id, 'messages'), orderBy('timestamp', 'asc'));
  }, [firestore, group.id]);
  const { data: messages, loading: loadingMessages } = useCollection<Message>(messagesQuery);
  
  const contributionsQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'contributions'), where('groupId', '==', group.id), orderBy('date', 'desc'));
  }, [firestore, group.id]);
  const { data: contributions } = useCollection<Contribution>(contributionsQuery, { initialData: initialContributions });

  const loansQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'loans'), where('groupId', '==', group.id));
  }, [firestore, group.id]);
  const { data: loans } = useCollection<Loan>(loansQuery, { initialData: initialLoans });
  
  const receiptsQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'receipts'), where('groupId', '==', group.id));
  }, [firestore, group.id]);
  const { data: receipts } = useCollection<Receipt>(receiptsQuery, { initialData: initialReceipts });


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);


  const handleSendMessage = async () => {
    if (!firestore || !authUser || !newMessage.trim()) return;

    setIsSending(true);
    const messageData = {
        groupId: group.id,
        senderId: authUser.uid,
        text: newMessage,
        timestamp: serverTimestamp(),
    };

    const messagesCol = collection(firestore, 'groups', group.id, 'messages');
    
    addDoc(messagesCol, messageData)
        .catch(async (serverError) => {
            const permissionError = new FirestorePermissionError({
                path: `groups/${group.id}/messages`,
                operation: 'create',
                requestResourceData: messageData,
            });
            errorEmitter.emit('permission-error', permissionError);
        });

    setNewMessage("");
    setIsSending(false);
  };
  
  const handleAdvanceMerryGoRound = async () => {
    if (!firestore) return;
    const groupRef = doc(firestore, 'groups', group.id);
    const nextIndex = (group.merryGoRoundIndex + 1) % group.members.length;
    
    updateDoc(groupRef, { merryGoRoundIndex: nextIndex })
        .then(() => {
            toast({ title: "Success", description: "Advanced to the next member in the merry-go-round." });
        })
        .catch(async (serverError) => {
            const permissionError = new FirestorePermissionError({
                path: groupRef.path,
                operation: 'update',
                requestResourceData: { merryGoRoundIndex: nextIndex },
            });
            errorEmitter.emit('permission-error', permissionError);
            toast({ variant: "destructive", title: "Error", description: "Could not advance merry-go-round." });
        });
  };

  const handleLoanVote = async (loanId: string, vote: 'approved' | 'rejected') => {
      if (!firestore || !authUser) return;
      
      const loanRef = doc(firestore, 'loans', loanId);
      const currentLoan = loans?.find(l => l.id === loanId);
      if (!currentLoan) return;

      const existingVote = currentLoan.votes.find(v => v.userId === authUser.uid);
      if (existingVote) {
          toast({ variant: "destructive", title: "Already Voted", description: "You have already voted on this loan." });
          return;
      }
      
      const batch = writeBatch(firestore);
      const newVote = { userId: authUser.uid, vote: vote === 'approved' };
      const newVotes = [...currentLoan.votes, newVote];

      // Simple majority vote logic
      const approvalVotes = newVotes.filter(v => v.vote).length;
      const rejectionVotes = newVotes.length - approvalVotes;
      const memberCount = group.members.length;
      
      let newStatus = currentLoan.status;
      if (approvalVotes > memberCount / 2) {
        newStatus = 'approved';
      } else if (rejectionVotes >= memberCount / 2) {
        newStatus = 'rejected';
      }
      
      batch.update(loanRef, { votes: newVotes, status: newStatus });

      batch.commit()
        .then(() => {
            toast({ title: "Vote Cast", description: `Your vote has been recorded.` });
        })
        .catch(async (serverError) => {
             const permissionError = new FirestorePermissionError({
                path: loanRef.path,
                operation: 'update',
                requestResourceData: { votes: newVotes, status: newStatus },
            });
            errorEmitter.emit('permission-error', permissionError);
            toast({ variant: "destructive", title: "Error", description: "Could not cast vote." });
        });
  };

  const currentMerryGoRoundMember = group.members[group.merryGoRoundIndex];
  
  const currentUserProfile: UserProfile | undefined = authUser ? {
    id: authUser.uid,
    name: authUser.displayName || 'User',
    email: authUser.email || '',
    avatarUrl: authUser.photoURL || undefined,
  } : undefined;


  const formatCurrency = (amount: number) => `KSH ${amount.toLocaleString()}`;
  const formatDate = (date: any) => {
    if (!date) return '...';
    const jsDate = date.toDate ? date.toDate() : new Date(date);
    return jsDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  return (
    <div className="space-y-6">
      <GroupHeader group={group} />
      <Tabs defaultValue="contributions" className="w-full">
        <ScrollArea className="w-full whitespace-nowrap">
            <TabsList className="grid-flow-col">
              <TabsTrigger value="contributions">Contributions</TabsTrigger>
              <TabsTrigger value="merry-go-round">Merry-Go-Round</TabsTrigger>
              <TabsTrigger value="loans">Loans</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
              <TabsTrigger value="messages">Messages</TabsTrigger>
              <TabsTrigger value="receipts">Receipts</TabsTrigger>
            </TabsList>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        
        <TabsContent value="contributions" className="mt-4">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <CardTitle>Contributions</CardTitle>
                <CardDescription>All member contributions are recorded here.</CardDescription>
              </div>
              {currentUserProfile && <MakeContributionDialog group={group} user={currentUserProfile} />}
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
                  {(contributions || []).map((c) => (
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

        <TabsContent value="merry-go-round" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Merry-Go-Round</CardTitle>
              <CardDescription>Current rotational savings status.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center text-center space-y-4">
              <p className="text-muted-foreground">Current Beneficiary</p>
              <Avatar className="h-24 w-24 border-4 border-primary shadow-lg">
                <AvatarImage src={currentMerryGoRoundMember?.avatarUrl} />
                <AvatarFallback className="text-3xl">{currentMerryGoRoundMember?.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <h3 className="text-2xl font-bold font-headline">{currentMerryGoRoundMember?.name}</h3>
              <Badge>Cycle {group.merryGoRoundIndex + 1} of {group.members.length}</Badge>
              <Button onClick={handleAdvanceMerryGoRound}>
                Advance to Next Member <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="loans" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Loan Requests</CardTitle>
              <CardDescription>Manage and vote on loan applications.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-end">
                {currentUserProfile && <RequestLoanDialog group={group} user={currentUserProfile} />}
              </div>
              <div className="space-y-4">
                {(loans || []).map(loan => (
                  <div key={loan.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold">{loan.memberName}</p>
                        <p className="text-sm text-muted-foreground">Requesting <span className="font-bold text-foreground">{formatCurrency(loan.amount)}</span></p>
                      </div>
                      <Badge variant={loan.status === 'approved' ? 'default' : loan.status === 'rejected' ? 'destructive' : 'secondary'}>{loan.status}</Badge>
                    </div>
                    {loan.status === 'pending' && (
                       <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-2 border-t gap-4">
                         <p className="text-sm text-muted-foreground flex items-center gap-2"><Vote className="h-4 w-4" /> Vote now:</p>
                         <div className="flex gap-2 shrink-0">
                          <Button variant="outline" size="sm" onClick={() => handleLoanVote(loan.id, 'approved')}><ThumbsUp className="h-4 w-4 mr-2 text-green-500" />Approve</Button>
                          <Button variant="outline" size="sm" onClick={() => handleLoanVote(loan.id, 'rejected')}><ThumbsDown className="h-4 w-4 mr-2 text-red-500" />Reject</Button>
                         </div>
                       </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports" className="mt-4">
          <div className="grid gap-6 md:grid-cols-2">
            <ContributionsLineChart data={contributionsChartData} />
            <LoansPieChart data={loansChartData} />
          </div>
        </TabsContent>
        
        <TabsContent value="messages" className="mt-4">
          <Card className="flex flex-col h-[60vh]">
            <CardHeader>
              <CardTitle>Community Wall</CardTitle>
              <CardDescription>Discuss group matters here.</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow overflow-y-auto space-y-4 p-4">
              {loadingMessages && <div className="flex justify-center items-center h-full"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>}
              {messages && messages.map(message => {
                const isCurrentUser = message.senderId === authUser?.uid;
                const member = group.members.find(m => m.id === message.senderId);
                // Fallback to authUser for current user's details if not in members list somehow
                const senderPhoto = isCurrentUser ? authUser?.photoURL : member?.avatarUrl;
                const senderName = isCurrentUser ? "You" : member?.name;
                const senderFallback = (member?.name?.charAt(0) || 'U').toUpperCase();

                return (
                  <div key={message.id} className={`flex items-end gap-2 ${isCurrentUser ? 'justify-end' : ''}`}>
                    {!isCurrentUser && (
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={senderPhoto || undefined} />
                        <AvatarFallback>{senderFallback}</AvatarFallback>
                      </Avatar>
                    )}
                    <div className={`max-w-xs md:max-w-md rounded-lg p-3 ${isCurrentUser ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                      {!isCurrentUser && <p className="text-sm font-semibold mb-1">{senderName}</p>}
                      <p className="text-sm">{message.text}</p>
                      <p className={`text-xs mt-1 text-right ${isCurrentUser ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>{formatDate(message.timestamp)}</p>
                    </div>
                     {isCurrentUser && (
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={senderPhoto || undefined} />
                        <AvatarFallback>{(authUser?.displayName?.charAt(0) || 'U').toUpperCase()}</AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                );
              })}
               <div ref={messagesEndRef} />
            </CardContent>
            <Separator />
            <div className="p-4">
              <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="relative">
                <Input 
                    placeholder="Type a message..." 
                    className="pr-28" 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    disabled={isSending}
                />
                <div className="absolute top-1/2 right-2 -translate-y-1/2 flex items-center gap-2">
                  <Button variant="ghost" size="icon" type="button" disabled={isSending}><Paperclip className="h-4 w-4" /></Button>
                  <Button size="sm" type="submit" disabled={isSending || !newMessage.trim()}>
                    {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Send <Send className="h-4 w-4 ml-2" /></>}
                  </Button>
                </div>
              </form>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="receipts" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Receipts & Proof</CardTitle>
              <CardDescription>Uploaded receipts for transparency.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {(receipts || []).map(receipt => (
                   <div key={receipt.id} className="relative aspect-[2/3] rounded-lg overflow-hidden border shadow-sm">
                     <Image src={receipt.url} alt={`Receipt from ${formatDate(receipt.timestamp)}`} fill objectFit="cover" data-ai-hint="receipt paper" />
                     <div className="absolute inset-x-0 bottom-0 bg-black/50 p-2 text-white">
                        <p className="text-xs truncate">Uploaded by {group.members.find(m => m.id === receipt.uploadedBy)?.name}</p>
                     </div>
                   </div>
                ))}
              </div>
               <div className="flex justify-center mt-6">
                <UploadReceiptDialog groupId={group.id}>
                    <Button variant="outline"><Plus className="mr-2 h-4 w-4" />Upload Receipt</Button>
                </UploadReceiptDialog>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

    