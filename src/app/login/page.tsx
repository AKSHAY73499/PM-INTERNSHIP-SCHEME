
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

export default function LoginPage() {
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
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="student">Student</TabsTrigger>
                    <TabsTrigger value="company">Company</TabsTrigger>
                    <TabsTrigger value="institute">Institute</TabsTrigger>
                    <TabsTrigger value="admin">Admin</TabsTrigger>
                </TabsList>
                <LoginTabContent value="student" title="Student Login" />
                <LoginTabContent value="company" title="Company Login" />
                <LoginTabContent value="institute" title="Institute Login" />
                <LoginTabContent value="admin" title="Admin Login" />
            </Tabs>
        </div>
    </div>
  );
}


function LoginTabContent({ value, title }: { value: string, title: string }) {
    const dashboardPath = value === 'student' ? '/dashboard' : `/dashboard/${value}`;
    
    return (
        <TabsContent value={value}>
            <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>Enter your credentials to access your dashboard.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor={`${value}-email`}>Email</Label>
                    <Input id={`${value}-email`} type="email" placeholder="user@example.com" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor={`${value}-password`}>Password</Label>
                    <Input id={`${value}-password`} type="password" />
                </div>
                <Button className="w-full" asChild>
                    <Link href={dashboardPath}>Login</Link>
                </Button>
                <div className="mt-4 text-center text-sm">
                    Don't have an account?{" "}
                    <Link href="/register" className="underline">
                        Register
                    </Link>
                </div>
            </CardContent>
            </Card>
        </TabsContent>
    )
}
