"use client";

import { useLocalStorage } from "@/hooks/use-local-storage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

type Application = {
  companyName: string;
  title: string;
  location: string;
  status: string;
  appliedDate: string;
};

export default function ApplicationTracker() {
  const [applications, setApplications] = useLocalStorage<Application[]>('tracked-applications', []);

  const handleStatusChange = (index: number, newStatus: string) => {
    const updatedApplications = [...applications];
    updatedApplications[index].status = newStatus;
    setApplications(updatedApplications);
  };
  
  if (applications.length === 0) {
    return (
      <div className="text-center py-20 border-2 border-dashed rounded-lg">
         <p className="text-muted-foreground">You haven't tracked any applications yet.</p>
         <p className="text-sm text-muted-foreground">Find internships and click "Track Application" to get started.</p>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Your Tracked Applications</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Position</TableHead>
              <TableHead>Company</TableHead>
              <TableHead className="hidden md:table-cell">Location</TableHead>
              <TableHead className="hidden sm:table-cell">Date Tracked</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.map((app, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{app.title}</TableCell>
                <TableCell>{app.companyName}</TableCell>
                <TableCell className="hidden md:table-cell">{app.location}</TableCell>
                <TableCell className="hidden sm:table-cell">{format(new Date(app.appliedDate), "PPP")}</TableCell>
                <TableCell>
                  <Select value={app.status} onValueChange={(value) => handleStatusChange(index, value)}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Set status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Interested"><Badge variant="outline" className="text-sky-500 border-sky-500">Interested</Badge></SelectItem>
                      <SelectItem value="Applied"><Badge variant="outline" className="text-blue-500 border-blue-500">Applied</Badge></SelectItem>
                      <SelectItem value="Interviewing"><Badge variant="outline" className="text-yellow-500 border-yellow-500">Interviewing</Badge></SelectItem>
                      <SelectItem value="Offer"><Badge variant="outline" className="text-green-500 border-green-500">Offer</Badge></SelectItem>
                      <SelectItem value="Rejected"><Badge variant="destructive">Rejected</Badge></SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
