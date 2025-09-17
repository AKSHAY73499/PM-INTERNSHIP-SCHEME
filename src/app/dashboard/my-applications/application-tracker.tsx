
"use client";

import React from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { Briefcase, Calendar, CheckCircle, Clock, Send, XCircle, TrendingUp } from "lucide-react";

type Application = {
  companyName: string;
  title: string;
  location: string;
  status: 'Interested' | 'Applied' | 'Interviewing' | 'Offer' | 'Rejected';
  appliedDate: string;
};

const statusConfig: Record<Application['status'], { icon: React.ElementType; color: string, label: string }> = {
    Interested: { icon: Clock, color: "text-sky-500", label: "Interested" },
    Applied: { icon: Send, color: "text-blue-500", label: "Applied" },
    Interviewing: { icon: TrendingUp, color: "text-yellow-500", label: "Interviewing" },
    Offer: { icon: CheckCircle, color: "text-green-500", label: "Offer" },
    Rejected: { icon: XCircle, color: "text-red-500", label: "Rejected" },
};

export default function ApplicationTracker() {
  const [applications, setApplications] = useLocalStorage<Application[]>('tracked-applications', []);

  const handleStatusChange = (index: number, newStatus: Application['status']) => {
    const updatedApplications = [...applications];
    updatedApplications[index].status = newStatus;
    setApplications(updatedApplications);
  };
  
  if (applications.length === 0) {
    return (
      <div className="text-center py-20 border-2 border-dashed rounded-lg">
         <Briefcase className="mx-auto h-12 w-12 text-muted-foreground" />
         <h3 className="mt-4 text-lg font-semibold">No Applications Tracked</h3>
         <p className="mt-1 text-sm text-muted-foreground">Find internships and click "Track Application" to get started.</p>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Your Tracked Applications</CardTitle>
        <CardDescription>Manage and monitor all your internship applications in one place.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Position</TableHead>
              <TableHead className="hidden md:table-cell">Company</TableHead>
              <TableHead className="hidden sm:table-cell">Date Tracked</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.map((app, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">
                    <div className="flex flex-col">
                        <span>{app.title}</span>
                        <span className="text-sm text-muted-foreground md:hidden">{app.companyName}</span>
                    </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">{app.companyName}</TableCell>
                <TableCell className="hidden sm:table-cell">
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {format(new Date(app.appliedDate), "PPP")}
                    </div>
                </TableCell>
                <TableCell className="text-right">
                  <Select value={app.status} onValueChange={(value: Application['status']) => handleStatusChange(index, value)}>
                    <SelectTrigger className="w-[160px] ml-auto">
                        <SelectValue>
                           <div className="flex items-center gap-2">
                               {React.createElement(statusConfig[app.status].icon, { className: "h-4 w-4"})}
                               <span>{statusConfig[app.status].label}</span>
                           </div>
                        </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        {Object.entries(statusConfig).map(([key, config]) => (
                            <SelectItem key={key} value={key}>
                                 <div className="flex items-center gap-3">
                                    {React.createElement(config.icon, { className: `h-4 w-4 ${config.color}`})}
                                    <span>{config.label}</span>
                                </div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        </div>
      </CardContent>
    </Card>
  );
}
