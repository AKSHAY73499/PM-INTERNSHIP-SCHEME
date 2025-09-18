
"use client";

import { useState, useEffect } from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Pie, PieChart, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { getCompletedInterns, submitFeedback } from "@/services/companyService";
import { Skeleton } from "@/components/ui/skeleton";
import { getCompanyStudents, getCompanyInternships } from "@/services/companyService";


export default function CompanyDashboardPage() {
    const [completedInterns, setCompletedInterns] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();
    const [analytics, setAnalytics] = useState<any>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                setIsLoading(true);
                const [interns, students, internships] = await Promise.all([
                    getCompletedInterns(),
                    getCompanyStudents(),
                    getCompanyInternships()
                ]);

                setCompletedInterns(interns);

                // Calculate analytics
                const allSkills = students.flatMap(s => s.skills);
                const skillCounts = allSkills.reduce((acc, skill) => {
                    acc[skill] = (acc[skill] || 0) + 1;
                    return acc;
                }, {});

                const skillDistributionData = Object.entries(skillCounts)
                    .map(([name, value]) => ({ name, value }))
                    .sort((a:any, b:any) => b.value - a.value)
                    .slice(0, 6);

                const applicantDiversityData = [
                    { name: 'Tier 1 Cities', value: students.filter(s => ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad'].includes(s.location)).length, fill: '#0088FE' },
                    { name: 'Tier 2 Cities', value: students.filter(s => !['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad'].includes(s.location) && s.location !== 'Remote').length, fill: '#00C49F' },
                    { name: 'Remote', value: students.filter(s => s.location === 'Remote').length, fill: '#FFBB28'},
                ];
                
                setAnalytics({ skillDistributionData, applicantDiversityData });

            } catch (error) {
                 toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Failed to load dashboard data.",
                });
            } finally {
                setIsLoading(false);
            }
        }
        fetchData();
    }, [toast]);

    const handleFeedbackSubmit = async (internId: string, internName: string) => {
        try {
            await submitFeedback(internId, { rating: 8, comments: "Great work!" });
            setCompletedInterns(prevInterns => 
                prevInterns.map(intern => 
                    intern.id === internId ? { ...intern, status: "Feedback Submitted" } : intern
                )
            );
            toast({
                title: "Feedback Submitted",
                description: `Thank you for providing feedback for ${internName}.`,
            });
        } catch (error) {
             toast({
                variant: "destructive",
                title: "Error",
                description: `Failed to submit feedback for ${internName}.`,
            });
        }
    };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline">Company Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your internships and find the best talent.
        </p>
      </div>

       <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
            <Card className="lg:col-span-3">
                <CardHeader>
                    <CardTitle className="font-headline">Applicant Skill Distribution</CardTitle>
                    <CardDescription>Top skills across all your applicants.</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading || !analytics ? <Skeleton className="w-full h-[300px]" /> : (
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={analytics.skillDistributionData} layout="vertical" margin={{ left: 20, right: 20 }}>
                                <XAxis type="number" hide />
                                <YAxis 
                                    dataKey="name" 
                                    type="category" 
                                    tickLine={false} 
                                    axisLine={false}
                                    stroke="hsl(var(--muted-foreground))"
                                    fontSize={12}
                                    width={80}
                                />
                                <Tooltip cursor={{fill: 'hsl(var(--muted))'}} contentStyle={{backgroundColor: 'hsl(var(--background))'}}/>
                                <Bar dataKey="value" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </CardContent>
            </Card>

            <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle className="font-headline">Applicant Diversity</CardTitle>
                    <CardDescription>Breakdown by geographical location type.</CardDescription>
                </CardHeader>
                <CardContent>
                     {isLoading || !analytics ? <Skeleton className="w-full h-[300px]" /> : (
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={analytics.applicantDiversityData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                >
                                    {analytics.applicantDiversityData.map((entry: any, index: number) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{backgroundColor: 'hsl(var(--background))'}}/>
                            </PieChart>
                        </ResponsiveContainer>
                     )}
                </CardContent>
            </Card>
        </div>
      
       <Card>
        <CardHeader>
            <CardTitle className="font-headline">Intern Feedback System</CardTitle>
            <CardDescription>Rate interns who have recently completed their program.</CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Intern Name</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading ? Array.from({length: 3}).map((_, i) => (
                        <TableRow key={i}>
                            <TableCell><Skeleton className="h-5 w-28" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-36" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                            <TableCell className="text-right"><Skeleton className="h-9 w-36 ml-auto" /></TableCell>
                        </TableRow>
                    )) : completedInterns.map((intern) => (
                        <TableRow key={intern.id}>
                            <TableCell className="font-medium">{intern.name}</TableCell>
                            <TableCell>{intern.role}</TableCell>
                            <TableCell>{intern.status}</TableCell>
                            <TableCell className="text-right">
                                {intern.status === "Awaiting Feedback" ? (
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button>
                                                <Star className="mr-2 h-4 w-4" />
                                                Provide Feedback
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-[425px]">
                                            <DialogHeader>
                                                <DialogTitle>Feedback for {intern.name}</DialogTitle>
                                                <DialogDescription>
                                                    Rate their performance during the {intern.role} internship.
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className="grid gap-4 py-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="rating">Overall Rating (out of 10)</Label>
                                                    <Slider defaultValue={[5]} max={10} step={1} />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="comments">Comments</Label>
                                                    <Textarea id="comments" placeholder="Enter your feedback..." />
                                                </div>
                                            </div>
                                            <DialogFooter>
                                                <DialogClose asChild>
                                                    <Button type="button" onClick={() => handleFeedbackSubmit(intern.id, intern.name)}>Submit Feedback</Button>
                                                </DialogClose>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                ) : (
                                    <Button variant="outline" disabled>Feedback Submitted</Button>
                                )}
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
