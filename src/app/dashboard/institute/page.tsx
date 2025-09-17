
"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Pie, PieChart, Cell, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, Award, Lightbulb, GraduationCap } from "lucide-react";

// Mock Data
const performanceData = [
  { name: 'Hired', value: 45, fill: 'hsl(var(--chart-2))' },
  { name: 'Interviewing', value: 80, fill: 'hsl(var(--chart-4))' },
  { name: 'Applied', value: 150, fill: 'hsl(var(--chart-1))' },
  { name: 'Not Applied', value: 75, fill: 'hsl(var(--chart-5))' },
];

const skillGapData = [
  { skill: 'Python', missing: 120 },
  { skill: 'Communication', missing: 95 },
  { skill: 'Data Analysis', missing: 80 },
  { skill: 'Project Mgmt', missing: 60 },
  { skill: 'Cloud (AWS/Azure)', missing: 55 },
];

const mockTotals = {
    totalStudents: 350,
    internshipsSecured: 45,
    studentsWithGaps: 180,
}

export default function InstituteDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline">Institute Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your students and gain valuable insights.
        </p>
      </div>

       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockTotals.totalStudents}</div>
            <p className="text-xs text-muted-foreground">Registered from your institute</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Internships Secured</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockTotals.internshipsSecured}</div>
            <p className="text-xs text-muted-foreground">Students successfully placed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Students with Skill Gaps</CardTitle>
            <Lightbulb className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockTotals.studentsWithGaps}</div>
            <p className="text-xs text-muted-foreground">Could benefit from training</p>
          </CardContent>
        </Card>
      </div>


      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-5">
         <Card className="lg:col-span-2">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 font-headline"><GraduationCap/> Student Performance Tracking</CardTitle>
                <CardDescription>Current internship status of all registered students.</CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                        <Pie data={performanceData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                            {performanceData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                        </Pie>
                        <Tooltip cursor={{fill: 'hsl(var(--muted))'}} contentStyle={{backgroundColor: 'hsl(var(--background))'}}/>
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>

        <Card className="lg:col-span-3">
            <CardHeader>
                <CardTitle className="font-headline">Institute-Wide Skill Gap Report</CardTitle>
                <CardDescription>Identified skill gaps based on desired roles vs. student profiles.</CardDescription>
            </CardHeader>
            <CardContent>
                 <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={skillGapData}>
                        <XAxis dataKey="skill" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip cursor={{fill: 'hsl(var(--muted))'}} contentStyle={{backgroundColor: 'hsl(var(--background))'}}/>
                        <Bar dataKey="missing" name="Students Missing Skill" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
      </div>

    </div>
  );
}
