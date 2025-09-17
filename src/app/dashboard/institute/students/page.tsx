
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CheckCircle, Clock, Briefcase, Award } from "lucide-react";
import { getInstituteStudents } from "@/services/instituteService";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

type StudentStatus = "Verified" | "Pending Verification";
type InternshipStatus = "Hired" | "Interviewing" | "Applied" | "Not Applied";


const getInternshipStatusConfig = (status: InternshipStatus) => {
    switch (status) {
        case 'Hired': return { icon: Award, color: 'text-green-500', label: 'Hired' };
        case 'Interviewing': return { icon: Briefcase, color: 'text-yellow-500', label: 'Interviewing' };
        case 'Applied': return { icon: CheckCircle, color: 'text-blue-500', label: 'Applied' };
        default: return { icon: Clock, color: 'text-muted-foreground', label: 'Not Applied' };
    }
}


export default function InstituteStudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchStudents() {
        try {
            setIsLoading(true);
            // Assuming instituteId would be available from an auth context
            const studentData = await getInstituteStudents("some-institute-id");
            setStudents(studentData);
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to load student list."
            });
        } finally {
            setIsLoading(false);
        }
    }
    fetchStudents();
  }, [toast]);

  const renderSkeletons = () => Array.from({length: 5}).map((_, i) => (
      <TableRow key={i}>
          <TableCell><div className="flex items-center gap-3"><Skeleton className="h-10 w-10 rounded-full" /><Skeleton className="h-5 w-28" /></div></TableCell>
          <TableCell><div className="flex flex-col gap-2"><Skeleton className="h-4 w-40" /><Skeleton className="h-3 w-24" /></div></TableCell>
          <TableCell><Skeleton className="h-6 w-24 rounded-full" /></TableCell>
          <TableCell className="text-center"><Skeleton className="h-5 w-8 mx-auto" /></TableCell>
          <TableCell><Skeleton className="h-5 w-24" /></TableCell>
      </TableRow>
  ));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline">Student List</h1>
        <p className="text-muted-foreground">
          See all your institute's students and their application statuses.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Registered Students</CardTitle>
          <CardDescription>A list of all students from your institute registered on the platform.</CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead>Course & Enrollment ID</TableHead>
                        <TableHead>Verification Status</TableHead>
                        <TableHead className="text-center">Applications</TableHead>
                        <TableHead>Internship Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading ? renderSkeletons() : (
                        students.map(student => (
                            <TableRow key={student.id}>
                                <TableCell className="font-medium">
                                    <div className="flex items-center gap-3">
                                        <Avatar>
                                            <AvatarImage src={`https://api.dicebear.com/8.x/initials/svg?seed=${student.name}`} />
                                            <AvatarFallback>{student.name.substring(0,2)}</AvatarFallback>
                                        </Avatar>
                                        <span>{student.name}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span>{student.course}</span>
                                        <span className="text-sm text-muted-foreground">{student.enrollmentId}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={student.status === 'Verified' ? 'default' : 'secondary'}>
                                        {student.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-center">{student.applications}</TableCell>
                                <TableCell>
                                    {(() => {
                                        const { icon: Icon, color, label } = getInternshipStatusConfig(student.internshipStatus);
                                        return (
                                            <div className={`flex items-center gap-2 ${color}`}>
                                                <Icon className="h-4 w-4" />
                                                <span>{label}</span>
                                            </div>
                                        )
                                    })()}
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
