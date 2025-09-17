
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Users, Building, Briefcase, ShieldCheck, ArrowRight, CheckCircle, Shield, BarChart, FileWarning, MessageSquareWarning, Star } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

const mockTotals = {
    students: 15840,
    companies: 1230,
    internships: 4590,
    pendingVerifications: 4,
};

const mockActivities = [
    { type: "company-registration", detail: "Innovate Inc. just registered.", timestamp: "2 mins ago" },
    { type: "internship-post", detail: "Tech Solutions posted a 'Frontend Dev' role with 5 stars.", timestamp: "15 mins ago" },
    { type: "verification-cleared", detail: "Student profile for Priya Sharma was auto-verified.", timestamp: "1 hour ago" },
    { type: "report-generated", detail: "Weekly analytics report is ready.", timestamp: "3 hours ago" },
];

const mockDisputes = [
    { id: "d1", issue: "Unpaid Stipend", parties: "Ananya vs. BizCorp", date: "2024-07-20", status: "New" },
    { id: "d2", issue: "Fake Internship Posting", parties: "System Flagged", date: "2024-07-19", status: "Under Review" },
    { id: "d3", issue: "Unfair Rejection", parties: "Ravi K. vs. Data Dynamics", date: "2024-07-18", status: "Resolved" },
];

export default function AdminDashboardPage() {
    const { toast } = useToast();

    const handleDisputeAction = (id: string, action: string) => {
        toast({
            title: "Dispute Updated",
            description: `Dispute ${id} has been marked as '${action}'.`
        });
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
            <div className="text-2xl font-bold">{mockTotals.students.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Registered on the platform</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Companies</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockTotals.companies.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Offering internships</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Internships</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockTotals.internships.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Available for students</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Verifications</CardTitle>
            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockTotals.pendingVerifications}</div>
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
                        {mockDisputes.map(dispute => (
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
                    {mockActivities.map((activity, index) => (
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

    