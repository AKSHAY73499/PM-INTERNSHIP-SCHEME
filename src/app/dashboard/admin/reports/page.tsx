
"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Pie, PieChart, Cell, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Mock Data for Charts
const geoDiversityData = [
  { name: 'Tier 1 Cities', value: 450, fill: 'hsl(var(--chart-1))' },
  { name: 'Tier 2 Cities', value: 300, fill: 'hsl(var(--chart-2))' },
  { name: 'Rural Areas', value: 250, fill: 'hsl(var(--chart-3))' },
];

const genderData = [
    { name: 'Male', value: 600, fill: 'hsl(var(--chart-1))' },
    { name: 'Female', value: 380, fill: 'hsl(var(--chart-2))' },
    { name: 'Other', value: 20, fill: 'hsl(var(--chart-4))'},
];

const socialCategoryData = [
  { name: 'General', value: 400 },
  { name: 'OBC', value: 270 },
  { name: 'SC', value: 150 },
  { name: 'ST', value: 80 },
  { name: 'EWS', value: 100 },
];


export default function AdminReportsPage() {
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
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={geoDiversityData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                    {geoDiversityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                </Pie>
                <Tooltip contentStyle={{backgroundColor: 'hsl(var(--background))'}}/>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
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
                     <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={socialCategoryData}>
                            <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip cursor={{fill: 'hsl(var(--muted))'}} contentStyle={{backgroundColor: 'hsl(var(--background))'}}/>
                            <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
            <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle>Gender Distribution</CardTitle>
                    <CardDescription>Gender diversity across all applications.</CardDescription>
                </CardHeader>
                <CardContent>
                     <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={genderData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} label>
                               {genderData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{backgroundColor: 'hsl(var(--background))'}}/>
                        </PieChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
