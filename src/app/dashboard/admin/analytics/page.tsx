
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download, Users, Building, Briefcase, Award } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from '@/components/ui/skeleton';
import { getPlatformTotals, getRegionalData } from '@/services/adminService';

type RegionStat = {
  state: string;
  students: number;
  companies: number;
  internships: number;
};

type Totals = {
    students: number;
    companies: number;
    internships: number;
    placements: number;
}

export default function AdminAnalyticsPage() {
  const [regionalData, setRegionalData] = useState<RegionStat[]>([]);
  const [totals, setTotals] = useState<Totals | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchData() {
        try {
            setIsLoading(true);
            const [totalsData, regionData] = await Promise.all([
                getPlatformTotals(),
                getRegionalData()
            ]);
            // @ts-ignore
            setTotals(totalsData);
            // @ts-ignore
            setRegionalData(regionData);
        } catch (error) {
            console.error("Failed to fetch analytics data:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Could not load analytics data."
            })
        } finally {
            setIsLoading(false);
        }
    }
    fetchData();
  }, [toast]);

  const handleDownload = (state: string) => {
    toast({
      title: "Report Download Started",
      description: `Generating and downloading the report for ${state}.`,
    });
    
    const selectedStateData = regionalData.find(stat => stat.state === state);
    if (!selectedStateData) return;

    const csvContent = [
      "Category,Value",
      `State,${selectedStateData.state}`,
      `Student Registrations,${selectedStateData.students}`,
      `Company Sign-ups,${selectedStateData.companies}`,
      `Internships Posted,${selectedStateData.internships}`
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `report-${state.toLowerCase().replace(/\s/g, '-')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline">Platform Analytics</h1>
        <p className="text-muted-foreground">
          View key metrics and download region-wise statistics.
        </p>
      </div>

       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading || !totals ? <Skeleton className="h-8 w-24" /> : <div className="text-2xl font-bold">{totals.students.toLocaleString()}</div>}
            <p className="text-xs text-muted-foreground">Registered on the platform</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Companies</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
             {isLoading || !totals ? <Skeleton className="h-8 w-20" /> : <div className="text-2xl font-bold">{totals.companies.toLocaleString()}</div>}
            <p className="text-xs text-muted-foreground">Offering internships</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Internships</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading || !totals ? <Skeleton className="h-8 w-20" /> : <div className="text-2xl font-bold">{totals.internships.toLocaleString()}</div>}
            <p className="text-xs text-muted-foreground">Currently available for students</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Successful Placements</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading || !totals ? <Skeleton className="h-8 w-20" /> : <div className="text-2xl font-bold">{totals.placements.toLocaleString()}</div>}
            <p className="text-xs text-muted-foreground">Interns hired via platform</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Region-wise Statistics</CardTitle>
          <CardDescription>Breakdown of platform engagement across different states.</CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>State / Union Territory</TableHead>
                        <TableHead className="text-right">Student Registrations</TableHead>
                        <TableHead className="text-right">Company Sign-ups</TableHead>
                        <TableHead className="text-right">Internships Posted</TableHead>
                        <TableHead className="text-center">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading ? (
                        Array.from({length: 5}).map((_, i) => (
                             <TableRow key={i}>
                                <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                                <TableCell className="text-right"><Skeleton className="h-5 w-20 ml-auto" /></TableCell>
                                <TableCell className="text-right"><Skeleton className="h-5 w-20 ml-auto" /></TableCell>
                                <TableCell className="text-right"><Skeleton className="h-5 w-20 ml-auto" /></TableCell>
                                <TableCell className="text-center"><Skeleton className="h-8 w-32 mx-auto" /></TableCell>
                            </TableRow>
                        ))
                    ) : (
                        regionalData.map((stat: any) => (
                            <TableRow key={stat.state}>
                                <TableCell className="font-medium">{stat.state}</TableCell>
                                <TableCell className="text-right">{stat.students.toLocaleString()}</TableCell>
                                <TableCell className="text-right">{stat.companies.toLocaleString()}</TableCell>
                                <TableCell className="text-right">{stat.internships.toLocaleString()}</TableCell>
                                <TableCell className="text-center">
                                    <Button variant="outline" size="sm" onClick={() => handleDownload(stat.state)}>
                                        <Download className="mr-2 h-4 w-4" />
                                        Download Report
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </CardContent>
      </Card>
    </div>
  );
}
