
"use client";

import { useState, useEffect } from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Pie, PieChart, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Building, Star } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { getCompletedInterns, submitFeedback } from "@/services/companyService";
import { Skeleton } from "@/components/ui/skeleton";


// Mock Data for Analytics - to be replaced with real data aggregation
const skillDistributionData = [
  { name: 'React', value: 45 },
  { name: 'Python', value: 38 },
  { name: 'Node.js', value: 32 },
  { name: 'SQL', value: 28 },
  { name: 'TypeScript', value: 25 },
  { name: 'AWS', value: 18 },
];

const applicantDiversityData = [
  { name: 'Tier 1 Cities', value: 400 },
  { name: 'Tier 2 Cities', value: 300 },
  { name: 'Rural Areas', value: 200 },
  { name: 'Other', value: 100 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];


export default function CompanyDashboardPage() {
    const [completedInterns, setCompletedInterns] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        async function fetchData() {
            try {
                setIsLoading(true);
                const interns = await getCompletedInterns();
                setCompletedInterns(interns);
            } catch (error) {
                 toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Failed to load intern data for feedback.",
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
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={skillDistributionData} layout="vertical" margin={{ left: 10 }}>
                            <XAxis type="number" hide />
                            <YAxis 
                                dataKey="name" 
                                type="category" 
                                tickLine={false} 
                                axisLine={false}
                                stroke="hsl(var(--muted-foreground))"
                                fontSize={12}
                            />
                            <Tooltip cursor={{fill: 'hsl(var(--muted))'}} contentStyle={{backgroundColor: 'hsl(var(--background))'}}/>
                            <Bar dataKey="value" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle className="font-headline">Applicant Diversity</CardTitle>
                    <CardDescription>Breakdown by geographical location.</CardDescription>
                </CardHeader>
                <CardContent>
                     <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={applicantDiversityData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                                {applicantDiversityData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{backgroundColor: 'hsl(var(--background))'}}/>
                        </PieChart>
                    </ResponsiveContainer>
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
                            <TableCell className="text-right"><Skeleton className="h-9 w-36" /></TableCell>
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
