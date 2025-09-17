
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, Sparkles } from "lucide-react";
import { shortlistCandidates, ShortlistCandidatesOutput } from "@/ai/flows/candidate-shortlisting";
import { useToast } from "@/hooks/use-toast";

// Mock Data
const mockInternships = [
  { id: "swe1", title: "Software Development Intern", requiredSkills: ["React", "Node.js", "TypeScript"] },
  { id: "ds1", title: "Data Science Intern", requiredSkills: ["Python", "Pandas", "SQL"] },
  { id: "pm1", title: "Product Management Intern", requiredSkills: ["JIRA", "Agile", "Market Research"] },
];

const mockStudents = [
    { name: "Amit Kumar", skills: ["React", "TypeScript", "Next.js"], qualifications: "B.Tech CSE", experience: "Built a social media app." },
    { name: "Sneha Reddy", skills: ["Python", "PyTorch", "Data Analysis"], qualifications: "M.Sc Data Science", experience: "Kaggle competition winner." },
    { name: "Raj Patel", skills: ["Java", "Spring Boot"], qualifications: "B.E. IT", experience: "" },
    { name: "Priya Singh", skills: ["React", "Node.js", "MongoDB", "TypeScript"], qualifications: "B.Tech CSE", experience: "Full-stack e-commerce project." },
    { name: "Kavita Joshi", skills: ["Python", "Pandas", "SQL", "Tableau"], qualifications: "B.Sc Statistics", experience: "Analyzed sales data for a retail client." },
];

export default function CompanyApplicationsPage() {
  const [selectedInternshipId, setSelectedInternshipId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [shortlist, setShortlist] = useState<ShortlistCandidatesOutput>([]);
  const { toast } = useToast();

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
        const internship = mockInternships.find(i => i.id === selectedInternshipId);
        if (!internship) throw new Error("Internship not found");

      const result = await shortlistCandidates({
        internship: {
          title: internship.title,
          requiredSkills: internship.requiredSkills,
        },
        students: mockStudents,
      });

      setShortlist(result);

    } catch (error) {
      console.error("Failed to shortlist candidates:", error);
       toast({
        variant: "destructive",
        title: "AI Shortlisting Failed",
        description: "There was an error processing the candidate list. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

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
                    {mockInternships.map(internship => (
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
                                    <Button>View Profile</Button>
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
