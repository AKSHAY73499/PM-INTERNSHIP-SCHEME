
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { FileText, Check, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getVerificationRequests, handleStudentVerification } from '@/services/instituteService';
import { Skeleton } from '@/components/ui/skeleton';

type Document = {
  name: string;
  url: string; 
};

type VerificationRequest = {
  id: string;
  studentId: string;
  studentName: string;
  course: string;
  enrollmentId: string;
  submittedDate: string;
  documents: Document[];
};


export default function InstituteVerificationPage() {
    const [requests, setRequests] = useState<VerificationRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        async function fetchRequests() {
            try {
                setIsLoading(true);
                // Assuming instituteId is available from auth context
                const reqs = await getVerificationRequests("some-institute-id");
                // @ts-ignore
                setRequests(reqs);
            } catch (error) {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Failed to load verification requests."
                });
            } finally {
                setIsLoading(false);
            }
        }
        fetchRequests();
    }, [toast]);

    const handleAction = async (requestId: string, studentId: string, action: 'approve' | 'reject') => {
        const student = requests.find(req => req.id === requestId);
        if (!student) return;

        try {
            await handleStudentVerification(requestId, studentId, action);
            setRequests(prev => prev.filter(req => req.id !== requestId));
            toast({
                title: `Student ${action === 'approve' ? 'Approved' : 'Rejected'}`,
                description: `${student.studentName}'s documents have been ${action === 'approve' ? 'verified' : 'rejected'}.`,
            });
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to process verification."
            });
        }
    }
    
    const renderSkeletons = () => Array.from({length: 2}).map((_, i) => (
        <Card key={i} className="p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                 <div className="flex items-center gap-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-5 w-28" />
                        <Skeleton className="h-4 w-36" />
                         <Skeleton className="h-3 w-24" />
                    </div>
                </div>
                <div className="flex-grow space-y-2">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                    <Skeleton className="h-9 w-24" />
                    <Skeleton className="h-9 w-24" />
                </div>
            </div>
        </Card>
    ));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline">Document Verification</h1>
        <p className="text-muted-foreground">
          Approve student certificates and academic records.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Pending Verifications</CardTitle>
          <CardDescription>
            The following students have submitted documents for verification.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            {isLoading ? renderSkeletons() : (
                requests.length > 0 ? (
                    requests.map(request => (
                        <Card key={request.id} className="p-4">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <Avatar className="h-12 w-12">
                                        <AvatarImage src={`https://api.dicebear.com/8.x/initials/svg?seed=${request.studentName}`} />
                                        <AvatarFallback>{request.studentName.substring(0,2)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h3 className="font-semibold">{request.studentName}</h3>
                                        <p className="text-sm text-muted-foreground">{request.course}</p>
                                        <p className="text-xs text-muted-foreground">{request.enrollmentId}</p>
                                    </div>
                                </div>
                                <div className="flex-grow space-y-2">
                                    {request.documents.map(doc => (
                                        <div key={doc.name} className="flex items-center justify-between p-2 bg-muted/50 rounded-md">
                                            <div className="flex items-center gap-2">
                                                <FileText className="h-4 w-4 text-muted-foreground"/>
                                                <span className="text-sm">{doc.name}</span>
                                            </div>
                                            <Button variant="link" size="sm" asChild>
                                                <a href={doc.url} target="_blank" rel="noopener noreferrer">View</a>
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex flex-col sm:flex-row gap-2">
                                    <Button size="sm" variant="outline" onClick={() => handleAction(request.id, request.studentId, 'reject')}>
                                        <X className="mr-2 h-4 w-4" /> Reject
                                    </Button>
                                    <Button size="sm" onClick={() => handleAction(request.id, request.studentId, 'approve')}>
                                        <Check className="mr-2 h-4 w-4" /> Approve
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))
                ) : (
                    <div className="text-center py-10 border-2 border-dashed rounded-lg">
                        <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                        <h3 className="mt-4 text-lg font-semibold">No Pending Verifications</h3>
                        <p className="mt-1 text-sm text-muted-foreground">All student documents have been reviewed.</p>
                    </div>
                )
            )}
        </CardContent>
      </Card>
    </div>
  );
}
