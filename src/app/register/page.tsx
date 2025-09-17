
"use client"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { ThemeToggle } from "@/components/theme-toggle";

export default function RegisterPage() {
    const searchParams = useSearchParams();
    const role = searchParams.get('role') || 'student';

  return (
    <div className="flex items-center justify-center min-h-screen bg-background relative">
        <div className="absolute top-4 right-4">
            <ThemeToggle />
        </div>
        <div className="w-full max-w-md mx-4">
            <div className="flex justify-center mb-6">
                 <Link href="/" className="flex items-center justify-center gap-2" prefetch={false}>
                    <Image src="https://iic.viit.ac.in/images/Hackathon/SIH-logo.png" alt="SIH Logo" width={48} height={48} />
                    <div className="ml-2">
                        <span className="text-2xl font-bold text-primary">AI for Internships</span>
                        <p className="text-sm text-muted-foreground">Ministry of Corporate Affairs</p>
                    </div>
                </Link>
            </div>
            <Tabs defaultValue={role} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="student">Student</TabsTrigger>
                    <TabsTrigger value="company">Company</TabsTrigger>
                    <TabsTrigger value="institute">Institute</TabsTrigger>
                </TabsList>
                <RegisterTabContent 
                    value="student" 
                    title="Student Registration"
                    fields={[
                        { id: 'name', label: 'Full Name', placeholder: 'Priya Kumar' },
                        { id: 'email', label: 'Email Address', placeholder: 'priya@example.com', type: 'email' },
                        { id: 'college', label: 'College/Institute Name', placeholder: 'National Institute of Technology' },
                        { id: 'password', label: 'Password', type: 'password' },
                        { id: 'confirm-password', label: 'Confirm Password', type: 'password' },
                    ]}
                />
                <RegisterTabContent 
                    value="company" 
                    title="Company Registration"
                    fields={[
                        { id: 'company-name', label: 'Company Name', placeholder: 'Innovate Corp' },
                        { id: 'email', label: 'Company Email', placeholder: 'hr@innovate.com', type: 'email' },
                        { id: 'industry', label: 'Industry', placeholder: 'Information Technology' },
                        { id: 'password', label: 'Password', type: 'password' },
                        { id: 'confirm-password', label: 'Confirm Password', type: 'password' },
                    ]}
                />
                <RegisterTabContent 
                    value="institute" 
                    title="Institute Registration"
                    fields={[
                        { id: 'institute-name', label: 'Institute Name', placeholder: 'National Institute of Technology' },
                        { id: 'email', label: 'Institute Email', placeholder: 'registrar@nit.ac.in', type: 'email' },
                        { id: 'affiliation', label: 'University Affiliation', placeholder: 'Affiliated to VTU' },
                        { id: 'password', label: 'Password', type: 'password' },
                        { id: 'confirm-password', label: 'Confirm Password', type: 'password' },
                    ]}
                />
            </Tabs>
        </div>
    </div>
  );
}

type Field = {
    id: string;
    label: string;
    placeholder?: string;
    type?: string;
}

function RegisterTabContent({ value, title, fields }: { value: string, title: string, fields: Field[] }) {
    const dashboardPath = value === 'student' ? '/dashboard' : `/dashboard/${value}`;
    
    return (
        <TabsContent value={value}>
            <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>Create your account to get started.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {fields.map(field => (
                     <div key={field.id} className="space-y-2">
                        <Label htmlFor={`${value}-${field.id}`}>{field.label}</Label>
                        <Input id={`${value}-${field.id}`} type={field.type || 'text'} placeholder={field.placeholder} />
                    </div>
                ))}
                <Button className="w-full" asChild>
                    <Link href={dashboardPath}>Register</Link>
                </Button>
                <div className="mt-4 text-center text-sm">
                    Already have an account?{" "}
                    <Link href="/login" className="underline">
                        Login
                    </Link>
                </div>
            </CardContent>
            </Card>
        </TabsContent>
    )
}
