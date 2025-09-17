
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Users, Building, Briefcase, ShieldCheck, ArrowRight, CheckCircle, Shield, BarChart, FileWarning, MessageSquareWarning, Star } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { getPlatformTotals, getRecentActivities, getDisputes, updateDispute } from "@/services/adminService";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminDashboardPage() {
    const { toast } = useToast();
    const [totals, setTotals] = useState<any>(null);
    const [activities, setActivities] = useState<any[]>([]);
    const [disputes, setDisputes] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                setIsLoading(true);
                const [totalsData, activitiesData, disputesData] = await Promise.all([
                    getPlatformTotals(),
                    getRecentActivities(),
                    getDisputes()
                ]);
                setTotals(totalsData);
                setActivities(activitiesData);
                setDisputes(disputesData);
            } catch (error) {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Failed to load dashboard data."
                });
            } finally {
                setIsLoading(false);
            }
        }
        fetchData();
    }, [toast]);

    const handleDisputeAction = async (id: string, action: string) => {
        try {
            await updateDispute(id, action);
            setDisputes(prev => prev.map(d => d.id === id ? { ...d, status: action } : d));
            toast({
                title: "Dispute Updated",
                description: `Dispute ${id} has been marked as '${action}'.`
            });
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to update dispute status."
            });
        }
    };

    const getActivityIcon = (type: string) => {
        switch (type) {
            case "company-registration": return <Building className="h-5 w-5 text-blue-500" />;
            case "internship-post": return <Star className="h-5 w-5 text-yellow-500" />;
            case "verification-cleared": return <CheckCircle className="h-5 w-5 text-green-500" />;
            case "report-generated": return <BarChart className="h-5 w-5 text-indigo-500" />;
            default: return <FileWarning className="h-5 w-5 text-muted-foreground" />;
        }
    }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Overall monitoring and platform management.
        </p>
      </div>

       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading || !totals ? <Skeleton className="h-8 w-20" /> : <div className="text-2xl font-bold">{totals.students.toLocaleString()}</div>}
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
            <p className="text-xs text-muted-foreground">Available for students</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Verifications</CardTitle>
            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totals?.pendingVerifications || 4}</div>
             <p className="text-xs text-muted-foreground">Items needing manual review</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-2">
            <CardHeader>
                <CardTitle className="font-headline">Dispute Resolution Triage</CardTitle>
                <CardDescription>A section to handle issues raised by students/companies.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Issue</TableHead>
                            <TableHead>Parties Involved</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? Array.from({length: 3}).map((_, i) => (
                            <TableRow key={i}>
                                <TableCell><Skeleton className="h-5 w-28" /></TableCell>
                                <TableCell><Skeleton className="h-5 w-36" /></TableCell>
                                <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                                <TableCell className="text-right"><Skeleton className="h-8 w-24" /></TableCell>
                            </TableRow>
                        )) : disputes.map(dispute => (
                             <TableRow key={dispute.id}>
                                <TableCell className="font-medium">{dispute.issue}</TableCell>
                                <TableCell>{dispute.parties}</TableCell>
                                <TableCell>
                                    <Badge variant={dispute.status === 'New' ? 'destructive' : (dispute.status === 'Resolved' ? 'default' : 'secondary')}>{dispute.status}</Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="outline" size="sm" onClick={() => handleDisputeAction(dispute.id, 'Investigating')}>Investigate</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>

        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Quick Links</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <Link href="/dashboard/admin/verification" className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                        <div className="flex items-center gap-3">
                            <CheckCircle className="h-5 w-5 text-accent"/>
                            <span className="font-semibold">Verification Center</span>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </Link>
                    <Link href="/dashboard/admin/reports" className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                        <div className="flex items-center gap-3">
                            <Shield className="h-5 w-5 text-accent"/>
                            <span className="font-semibold">Fairness Reports</span>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </Link>
                    <Link href="/dashboard/admin/analytics" className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                        <div className="flex items-center gap-3">
                            <BarChart className="h-5 w-5 text-accent"/>
                            <span className="font-semibold">Platform Analytics</span>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </Link>
                </CardContent>
            </Card>
        </div>
      </div>
       <Card>
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2"><MessageSquareWarning/> Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {isLoading ? Array.from({length: 4}).map((_, i) => (
                        <div key={i} className="flex items-center gap-4">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-4 w-3/4" />
                                <Skeleton className="h-3 w-1/4" />
                            </div>
                        </div>
                    )): activities.map((activity, index) => (
                         <div key={index} className="flex items-center gap-4">
                            <div className="p-2 bg-muted rounded-full">
                               {getActivityIcon(activity.type)}
                            </div>
                            <div className="flex-1">
                                <p className="text-sm">{activity.detail}</p>
                                <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    </div>
  );
}
