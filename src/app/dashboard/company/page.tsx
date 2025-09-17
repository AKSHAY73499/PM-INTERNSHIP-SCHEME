
"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Pie, PieChart, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Building, Star } from "lucide-react";

// Mock Data for Analytics
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

// Mock Data for Feedback
const completedInterns = [
    { name: "Priya Sharma", role: "Frontend Developer Intern", status: "Completed" },
    { name: "Rohan Kumar", role: "Data Science Intern", status: "Completed" },
    { name: "Anjali Mehta", role: "Product Management Intern", status: "Awaiting Feedback" },
    { name: "Vikram Singh", role: "Backend Developer Intern", status: "Completed" },
];


export default function CompanyDashboardPage() {
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
                    {completedInterns.map((intern, index) => (
                        <TableRow key={index}>
                            <TableCell className="font-medium">{intern.name}</TableCell>
                            <TableCell>{intern.role}</TableCell>
                            <TableCell>{intern.status}</TableCell>
                            <TableCell className="text-right">
                                {intern.status === "Awaiting Feedback" ? (
                                    <Button>
                                        <Star className="mr-2 h-4 w-4" />
                                        Provide Feedback
                                    </Button>
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

