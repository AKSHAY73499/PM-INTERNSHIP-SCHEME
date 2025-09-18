
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, Sparkles, User, GraduationCap, Briefcase, XCircle, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getCompanyInternships, getCompanyStudents, getShortlistedCandidates } from "@/services/companyService";
import { Skeleton } from "@/components/ui/skeleton";
import type { ShortlistedCandidate } from "@/ai/schema-and-types";

export default function CompanyApplicationsPage() {
  const [internships, setInternships] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [selectedInternshipId, setSelectedInternshipId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [shortlist, setShortlist] = useState<ShortlistedCandidate[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchData() {
        try {
            setIsLoadingData(true);
            const [internshipsData, studentsData] = await Promise.all([
                getCompanyInternships(),
                getCompanyStudents()
            ]);
            setInternships(internshipsData);
            setStudents(studentsData);
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Could not load initial data."
            });
        } finally {
            setIsLoadingData(false);
        }
    }
    fetchData();
  }, [toast]);

  const handleShortlist = async () => {
    if (!selectedInternshipId) {
        toast({
            variant: "destructive",
            title: "Error",
            description: "Please select an internship to shortlist candidates for.",
        });
      return;
    }

    setIsLoading(true);
    setShortlist([]);
    
    try {
        const internship = internships.find(i => i.id === selectedInternshipId);
        if (!internship) throw new Error("Internship not found");

      const result = await getShortlistedCandidates(selectedInternshipId);

      setShortlist(result);

    } catch (error: any) {
      console.error("Failed to shortlist candidates:", error);
      let description = "There was an error processing the candidate list. Please try again.";
      
       toast({
        variant: "destructive",
        title: "Shortlisting Failed",
        description: description,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCandidateAction = (candidateName: string, action: 'offer' | 'reject') => {
    toast({
      title: `Candidate ${action === 'offer' ? 'Offered' : 'Rejected'}`,
      description: `${candidateName} has been ${action === 'offer' ? 'sent an internship offer' : 'rejected'}.`,
    });
  }

  if (isLoadingData) {
      return (
          <div className="space-y-6">
               <div>
                    <h1 className="text-3xl font-bold font-headline">Received Applications</h1>
                    <p className="text-muted-foreground">
                    View AI-shortlisted candidates and manage your hiring process.
                    </p>
                </div>
                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-48" />
                        <Skeleton className="h-4 w-full max-w-sm" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-10 w-full" />
                    </CardContent>
                </Card>
          </div>
      )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline">Received Applications</h1>
        <p className="text-muted-foreground">
          View AI-shortlisted candidates and manage your hiring process.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Select Internship</CardTitle>
           <CardDescription>Choose one of your active internship postings to analyze.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-4 items-center">
            <Select onValueChange={setSelectedInternshipId}>
                <SelectTrigger className="w-full sm:w-[300px]">
                    <SelectValue placeholder="Select an internship..." />
                </SelectTrigger>
                <SelectContent>
                    {internships.map(internship => (
                        <SelectItem key={internship.id} value={internship.id}>
                            {internship.title}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <Button onClick={handleShortlist} disabled={isLoading || !selectedInternshipId}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                Shortlist Candidates
            </Button>
        </CardContent>
      </Card>

      {isLoading && (
        <div className="text-center py-10">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
          <p className="mt-2 text-muted-foreground">Our AI is analyzing the applicants... This may take a moment.</p>
        </div>
      )}

      {shortlist.length > 0 && (
         <Card>
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                    <Sparkles className="text-accent"/>
                    AI Shortlist Suggestions
                </CardTitle>
                <CardDescription>Top candidates sorted by their match score.</CardDescription>
            </CardHeader>
            <CardContent>
                 <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Candidate</TableHead>
                            <TableHead>Skills</TableHead>
                            <TableHead className="text-center">Match Score</TableHead>
                            <TableHead>AI Reasoning</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {shortlist.map((candidate, index) => (
                            <TableRow key={index}>
                                <TableCell className="font-medium">{candidate.name}</TableCell>
                                <TableCell>
                                    <div className="flex flex-wrap gap-1 max-w-xs">
                                        {candidate.skills.map(skill => <Badge key={skill} variant="secondary">{skill}</Badge>)}
                                    </div>
                                </TableCell>
                                <TableCell className="text-center">
                                    <Badge className="text-lg" variant={candidate.matchScore > 80 ? 'default' : 'outline'}>
                                        {candidate.matchScore}%
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-sm text-muted-foreground max-w-sm">{candidate.reasoning}</TableCell>
                                <TableCell className="text-right">
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="outline">View Profile</Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-md">
                                            <DialogHeader>
                                                <div className="flex items-center gap-4">
                                                    <Avatar className="h-16 w-16">
                                                        <AvatarImage src={`https://api.dicebear.com/8.x/initials/svg?seed=${candidate.name}`} alt={candidate.name} />
                                                        <AvatarFallback>{candidate.name.substring(0, 2)}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <DialogTitle className="text-2xl font-bold font-headline">{candidate.name}</DialogTitle>
                                                        <DialogDescription>AI Match Score: {candidate.matchScore}%</DialogDescription>
                                                    </div>
                                                </div>
                                            </DialogHeader>
                                            <div className="py-4 space-y-6">
                                                <div className="space-y-2">
                                                    <h4 className="font-semibold flex items-center gap-2"><GraduationCap className="h-4 w-4 text-muted-foreground" /> Qualifications</h4>
                                                    <p className="text-muted-foreground">{candidate.qualifications}</p>
                                                </div>
                                                 <div className="space-y-2">
                                                    <h4 className="font-semibold flex items-center gap-2"><Briefcase className="h-4 w-4 text-muted-foreground" /> Experience</h4>
                                                    <p className="text-muted-foreground">{candidate.experience || 'N/A'}</p>
                                                </div>
                                                <div className="space-y-2">
                                                    <h4 className="font-semibold">Skills</h4>
                                                    <div className="flex flex-wrap gap-2">
                                                        {candidate.skills.map(skill => (
                                                            <Badge key={skill} variant="secondary">{skill}</Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <h4 className="font-semibold">AI Reasoning</h4>
                                                    <p className="text-sm text-muted-foreground p-3 bg-muted/50 rounded-md">{candidate.reasoning}</p>
                                                </div>
                                            </div>
                                            <DialogFooter className="gap-2">
                                                <DialogClose asChild>
                                                    <Button type="button" variant="outline" onClick={() => handleCandidateAction(candidate.name, 'reject')}>
                                                        <XCircle className="mr-2 h-4 w-4"/> Reject
                                                    </Button>
                                                </DialogClose>
                                                <DialogClose asChild>
                                                    <Button type="button" onClick={() => handleCandidateAction(candidate.name, 'offer')}>
                                                        <CheckCircle className="mr-2 h-4 w-4"/> Offer Internship
                                                    </Button>
                                                </DialogClose>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
         </Card>
      )}

       {!isLoading && shortlist.length === 0 && (
         <div className="text-center py-10 border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground">Your AI-shortlisted candidates will appear here.</p>
         </div>
      )}

    </div>
  );
}
