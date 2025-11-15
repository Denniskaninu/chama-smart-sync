"use client";

import { ContributionsLineChart, LoansPieChart } from "@/components/chama/charts";
import { contributionsChartData, loansChartData } from "@/lib/placeholder-data";

export default function ReportsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Reports</h1>
        <p className="text-muted-foreground">Visual overview of your groups' financial activity.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        <ContributionsLineChart data={contributionsChartData} />
        <LoansPieChart data={loansChartData} />
      </div>
    </div>
  );
}
