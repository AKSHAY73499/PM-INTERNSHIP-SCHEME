
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Check, X, AlertTriangle, Building, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
    getCompanyVerificationRequests, 
    getInternshipVerificationRequests, 
    handleCompanyVerification, 
    handleInternshipVerification 
} from "@/services/adminService";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminVerificationPage() {
    const { toast } = useToast();
    const [companies, setCompanies] = useState<any[]>([]);
    const [internships, setInternships] = useState<any[]>([]);
    const [isLoadingCompanies, setIsLoadingCompanies] = useState(true);
    const [isLoadingInternships, setIsLoadingInternships] = useState(true);

    useEffect(() => {
        async function fetchRequests() {
            try {
                setIsLoadingCompanies(true);
                setIsLoadingInternships(true);
                const [companyReqs, internshipReqs] = await Promise.all([
                    getCompanyVerificationRequests(),
                    getInternshipVerificationRequests()
                ]);
                setCompanies(companyReqs);
                setInternships(internshipReqs);
            } catch (error) {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Failed to load verification requests."
                });
            } finally {
                setIsLoadingCompanies(false);
                setIsLoadingInternships(false);
            }
        }
        fetchRequests();
    }, [toast]);

    const handleAction = async (type: "company" | "internship", id: string, action: "approve" | "reject") => {
        try {
            if (type === 'company') {
                await handleCompanyVerification(id, action);
                setCompanies(companies.filter(c => c.id !== id));
            } else {
                await handleInternshipVerification(id, action);
                setInternships(internships.filter(i => i.id !== id));
            }

            toast({
                title: `Action: ${action.charAt(0).toUpperCase() + action.slice(1)}`,
                description: `${type === 'company' ? 'Company' : 'Internship'} has been ${action === 'approve' ? 'approved' : 'rejected'}.`,
            });
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: `Failed to ${action} the ${type}.`
            });
        }
    };

    const renderCompanySkeletons = () => Array.from({length: 2}).map((_, i) => (
        <Card key={i}><CardContent className="p-6 space-y-4"><Skeleton className="h-24 w-full" /></CardContent></Card>
    ));

     const renderInternshipSkeletons = () => Array.from({length: 2}).map((_, i) => (
        <Card key={i}><CardContent className="p-6 space-y-4"><Skeleton className="h-24 w-full" /></CardContent></Card>
    ));

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
                Company Verification ({isLoadingCompanies ? '...' : companies.length})
            </TabsTrigger>
            <TabsTrigger value="internships">
                <FileText className="mr-2 h-4 w-4"/>
                Internship Posts ({isLoadingInternships ? '...' : internships.length})
            </TabsTrigger>
        </TabsList>
        <TabsContent value="companies" className="space-y-4">
            {isLoadingCompanies ? renderCompanySkeletons() : (
                companies.length > 0 ? companies.map(company => (
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
                )
            )}
        </TabsContent>
        <TabsContent value="internships" className="space-y-4">
            {isLoadingInternships ? renderInternshipSkeletons() : (
                internships.length > 0 ? internships.map(internship => (
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
                )
            )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
