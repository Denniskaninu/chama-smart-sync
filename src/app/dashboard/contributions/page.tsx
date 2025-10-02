"use client";
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
import { contributions } from "@/lib/placeholder-data";
import { MpesaReferenceCheck } from "@/components/chama/mpesa-check";

export default function ContributionsPage() {
    const formatCurrency = (amount: number) => `KSH ${amount.toLocaleString()}`;
    const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="space-y-8">
       <div>
          <h1 className="text-3xl font-bold font-headline">All Contributions</h1>
          <p className="text-muted-foreground">A record of all contributions across your groups.</p>
        </div>
        <Card>
            <CardHeader>
              <CardTitle>Contribution History</CardTitle>
              <CardDescription>All member contributions are recorded here.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead>Group</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>M-Pesa Ref</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contributions.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell className="font-medium">{c.memberName}</TableCell>
                      <TableCell>{c.groupId === 'group-1' ? 'Kilimani Young Investors': 'Family & Friends SACCO'}</TableCell>
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
    </div>
  );
}
