
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CheckCircle, Clock, Briefcase, Award } from "lucide-react";

type StudentStatus = "Verified" | "Pending Verification";
type InternshipStatus = "Hired" | "Interviewing" | "Applied" | "Not Applied";

const mockStudents = [
  {
    id: "s1",
    name: "Aarav Sharma",
    enrollmentId: "VJA2021001",
    course: "B.Tech Computer Science",
    applications: 5,
    status: "Verified" as StudentStatus,
    internshipStatus: "Interviewing" as InternshipStatus,
  },
  {
    id: "s2",
    name: "Diya Patel",
    enrollmentId: "VJA2021002",
    course: "B.Com",
    applications: 3,
    status: "Verified" as StudentStatus,
    internshipStatus: "Applied" as InternshipStatus,
  },
  {
    id: "s3",
    name: "Rohan Gupta",
    enrollmentId: "VJA2022003",
    course: "Diploma in Mechanical Engg.",
    applications: 0,
    status: "Pending Verification" as StudentStatus,
    internshipStatus: "Not Applied" as InternshipStatus,
  },
  {
    id: "s4",
    name: "Priya Singh",
    enrollmentId: "VJA2020004",
    course: "B.Sc Physics",
    applications: 8,
    status: "Verified" as StudentStatus,
    internshipStatus: "Hired" as InternshipStatus,
  },
   {
    id: "s5",
    name: "Aditya Verma",
    enrollmentId: "VJA2021005",
    course: "B.Tech Electrical Engineering",
    applications: 2,
    status: "Verified" as StudentStatus,
    internshipStatus: "Applied" as InternshipStatus,
  },
];

const getInternshipStatusConfig = (status: InternshipStatus) => {
    switch (status) {
        case 'Hired': return { icon: Award, color: 'text-green-500', label: 'Hired' };
        case 'Interviewing': return { icon: Briefcase, color: 'text-yellow-500', label: 'Interviewing' };
        case 'Applied': return { icon: CheckCircle, color: 'text-blue-500', label: 'Applied' };
        default: return { icon: Clock, color: 'text-muted-foreground', label: 'Not Applied' };
    }
}


export default function InstituteStudentsPage() {
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
                    {mockStudents.map(student => (
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
                    ))}
                </TableBody>
            </Table>
        </CardContent>
      </Card>
    </div>
  );
}
