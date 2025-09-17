
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Check, X, AlertTriangle, Building, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const mockCompanies = [
    { id: "comp1", name: "Innovate Inc.", reason: "GST number mismatch with MCA21 database.", trustScore: 65, details: { pan: "ABCDE1234F", gst: "29ABCDE1234F1Z5", cin: "U74999DL2016PTC298987" } },
    { id: "comp2", name: "Data Entry Solutions", reason: "Suspicious keywords ('data entry', 'no skills required') found in past internship descriptions.", trustScore: 40, details: { pan: "FGHIJ5678K", gst: "27FGHIJ5678K1Z9", cin: "L72900MH2018OPC312345" } },
];

const mockInternships = [
    { id: "int1", title: "Graphic Design Intern", company: "Creative Minds", reason: "Stipend mentioned (₹2,000/month) is significantly below the industry average for this role.", details: { skills: "Adobe Photoshop, Illustrator", location: "Remote" } },
    { id: "int2", title: "Marketing Assistant", company: "Growth Co.", reason: "Key details missing: internship duration and specific required skills are not mentioned.", details: { skills: "Marketing", location: "Mumbai" } },
];


export default function AdminVerificationPage() {
    const { toast } = useToast();
    const [companies, setCompanies] = useState(mockCompanies);
    const [internships, setInternships] = useState(mockInternships);

    const handleAction = (type: "company" | "internship", id: string, action: "approve" | "reject") => {
        const message = `${type === 'company' ? 'Company' : 'Internship'} has been ${action === 'approve' ? 'approved' : 'rejected'}.`;
        
        if (type === 'company') {
            setCompanies(companies.filter(c => c.id !== id));
        } else {
            setInternships(internships.filter(i => i.id !== id));
        }

        toast({
            title: `Action: ${action.charAt(0).toUpperCase() + action.slice(1)}`,
            description: message,
        });
    };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline">Verification Center</h1>
        <p className="text-muted-foreground">
          Review entities and postings flagged for manual verification by the AI system.
        </p>
      </div>

       <Tabs defaultValue="companies">
        <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="companies">
                <Building className="mr-2 h-4 w-4" />
                Company Verification ({companies.length})
            </TabsTrigger>
            <TabsTrigger value="internships">
                <FileText className="mr-2 h-4 w-4"/>
                Internship Posts ({internships.length})
            </TabsTrigger>
        </TabsList>
        <TabsContent value="companies" className="space-y-4">
            {companies.length > 0 ? companies.map(company => (
                 <Card key={company.id}>
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle>{company.name}</CardTitle>
                                <CardDescription>PAN: {company.details.pan} | GST: {company.details.gst}</CardDescription>
                            </div>
                            <Badge variant="destructive" className="text-base">Trust Score: {company.trustScore}%</Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div>
                                <h4 className="font-semibold text-sm flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-orange-500" /> AI Analysis & Reason for Flagging</h4>
                                <p className="text-muted-foreground text-sm mt-1 p-3 bg-muted rounded-md">{company.reason}</p>
                            </div>
                            <div className="flex gap-2 justify-end">
                                <Button variant="outline" size="sm" onClick={() => handleAction('company', company.id, 'reject')}><X className="mr-2 h-4 w-4"/> Reject</Button>
                                <Button size="sm" onClick={() => handleAction('company', company.id, 'approve')}><Check className="mr-2 h-4 w-4"/> Approve</Button>
                            </div>
                        </div>
                    </CardContent>
                 </Card>
            )) : (
                 <div className="text-center py-10 border-2 border-dashed rounded-lg">
                    <p className="text-muted-foreground">No companies are currently awaiting verification.</p>
                 </div>
            )}
        </TabsContent>
        <TabsContent value="internships" className="space-y-4">
            {internships.length > 0 ? internships.map(internship => (
                 <Card key={internship.id}>
                    <CardHeader>
                        <CardTitle>{internship.title}</CardTitle>
                        <CardDescription>Posted by: {internship.company}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div>
                                <h4 className="font-semibold text-sm flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-orange-500" /> AI Analysis & Reason for Flagging</h4>
                                <p className="text-muted-foreground text-sm mt-1 p-3 bg-muted rounded-md">{internship.reason}</p>
                            </div>
                            <div className="flex gap-2 justify-end">
                                 <Button variant="outline" size="sm" onClick={() => handleAction('internship', internship.id, 'reject')}><X className="mr-2 h-4 w-4"/> Reject</Button>
                                <Button size="sm" onClick={() => handleAction('internship', internship.id, 'approve')}><Check className="mr-2 h-4 w-4"/> Approve</Button>
                            </div>
                        </div>
                    </CardContent>
                 </Card>
            )) : (
                 <div className="text-center py-10 border-2 border-dashed rounded-lg">
                    <p className="text-muted-foreground">No internship postings are currently awaiting verification.</p>
                 </div>
            )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

