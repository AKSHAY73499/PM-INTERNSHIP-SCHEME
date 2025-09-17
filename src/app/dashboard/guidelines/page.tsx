
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Check, X, FileText, Clock, Badge, User, Users, GraduationCap, Briefcase } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const whoCanApply = [
    "Must be an Indian citizen.",
    "Age between 21 – 24 years (on the cut-off date).",
    "Minimum qualification: Class 10 / ITI / Polytechnic / Diploma / Graduate degree.",
    "Should not be employed full-time or enrolled in a full-time academic programme.",
];

const whoCannotApply = [
    "Students from premier institutes (IITs, IIMs, NIDs, IISERs, NITs, NLUs, etc.).",
    "Holders of higher/professional qualifications (MBA, PhD, CA, CS, MBBS, etc.).",
    "Students already enrolled in other govt apprenticeship / internship schemes (like NAPS, NATS).",
    "Candidates with family income above ₹8 lakh/year.",
    "Students whose parents/spouse are permanent govt/PSU employees (except contractual staff).",
]

const documentsRequired = [
    "Aadhaar or valid Govt ID proof.",
    "Educational certificates (10th, 12th, Diploma/Degree).",
    "Address proof (ration card, voter ID, etc.).",
    "Income certificate (to validate income criteria).",
    "Institute verification of student record.",
]

const durationAndStipend = [
    "Duration: 6–12 weeks (varies by company/sector).",
    "Stipend/allowance: May be provided by company/industry partner.",
    "Certificate issued after successful completion.",
]

export default function GuidelinesPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Eligibility & Guidelines – PM Internship Scheme</h1>
        <p className="text-muted-foreground mt-2">
          The scheme ensures opportunity for youth with basic qualifications, while excluding over-qualified candidates so that internships remain accessible to those who truly need them.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 font-headline"><User className="text-accent"/> Who Can Apply</CardTitle>
            </CardHeader>
            <CardContent>
                <ul className="space-y-3">
                    {whoCanApply.map((item, index) => (
                        <li key={index} className="flex items-start gap-3">
                            <Check className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                            <span>{item}</span>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 font-headline"><Users className="text-destructive"/> Who Cannot Apply</CardTitle>
            </CardHeader>
            <CardContent>
                <ul className="space-y-3">
                     {whoCannotApply.map((item, index) => (
                        <li key={index} className="flex items-start gap-3">
                            <X className="h-5 w-5 text-red-500 mt-1 flex-shrink-0" />
                            <span>{item}</span>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline"><FileText className="text-primary"/> Documents Required</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                {documentsRequired.map((item, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                        <GraduationCap className="h-6 w-6 text-muted-foreground flex-shrink-0" />
                        <span className="text-sm">{item}</span>
                    </div>
                ))}
            </div>
        </CardContent>
      </Card>
       <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline"><Briefcase className="text-primary"/> Duration & Stipend</CardTitle>
        </CardHeader>
        <CardContent>
             <ul className="space-y-3">
                {durationAndStipend.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                        <Clock className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
                        <span>{item}</span>
                    </li>
                ))}
            </ul>
        </CardContent>
      </Card>
    </div>
  );
}
