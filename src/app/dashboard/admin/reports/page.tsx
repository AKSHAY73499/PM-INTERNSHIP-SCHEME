
"use client";

import { useState, useEffect } from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Pie, PieChart, Cell, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getFairnessReportData, FairnessReportData } from "@/ai/flows/fairness-reports";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";


export default function AdminReportsPage() {
  const [reportData, setReportData] = useState<FairnessReportData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await getFairnessReportData();
        setReportData(data);
      } catch (error) {
        console.error("Failed to fetch fairness reports:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not load real-time fairness data. Displaying sample data instead.",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [toast]);


  const renderPieChart = (data: any[], height = 250, innerRadius = 0) => (
     <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} innerRadius={innerRadius} label>
            {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
        </Pie>
        <Tooltip cursor={{fill: 'hsl(var(--muted))'}} contentStyle={{backgroundColor: 'hsl(var(--background))', color: 'hsl(var(--foreground))', border: '1px solid hsl(var(--border))'}}/>
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline">Fairness Reports</h1>
        <p className="text-muted-foreground">
          Monitor diversity and inclusion across the platform.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
            <CardHeader>
                <CardTitle>AI Fairness Filter</CardTitle>
                <CardDescription>Automated bias reduction engine status.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                    <Switch id="fairness-filter" defaultChecked />
                    <Label htmlFor="fairness-filter">Filter Active</Label>
                </div>
                <p className="text-sm text-muted-foreground">
                    The AI is actively boosting visibility for under-represented groups to ensure equitable opportunities.
                </p>
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Current Bias Score:</span>
                    <Badge variant="destructive">High</Badge>
                </div>
                 <Button size="sm" variant="outline">Recalibrate Algorithm</Button>
            </CardContent>
        </Card>
         <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Geographical Diversity</CardTitle>
            <CardDescription>Distribution of applicants by location type.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-[250px] w-full" /> : reportData && renderPieChart(reportData.geoDiversity)}
          </CardContent>
        </Card>
      </div>

       <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-5">
            <Card className="lg:col-span-3">
                <CardHeader>
                    <CardTitle>Social Category Distribution</CardTitle>
                    <CardDescription>Applicant breakdown by social category.</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? <Skeleton className="h-[300px] w-full" /> : reportData && (
                         <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={reportData.socialCategory}>
                                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip cursor={{fill: 'hsl(var(--muted))'}} contentStyle={{backgroundColor: 'hsl(var(--background))', color: 'hsl(var(--foreground))', border: '1px solid hsl(var(--border))'}}/>
                                <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </CardContent>
            </Card>
            <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle>Gender Distribution</CardTitle>
                    <CardDescription>Gender diversity across all applications.</CardDescription>
                </CardHeader>
                <CardContent>
                     {isLoading ? <Skeleton className="h-[300px] w-full" /> : reportData && renderPieChart(reportData.genderDiversity, 300, 60)}
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
