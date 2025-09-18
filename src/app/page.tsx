
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Briefcase, Building, Contact, GraduationCap, Shield } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="px-4 lg:px-6 h-20 flex items-center border-b bg-card">
        <Link href="#" className="flex items-center justify-center gap-2" prefetch={false}>
          <Image src="https://iic.viit.ac.in/images/Hackathon/SIH-logo.png" alt="SIH Logo" width={40} height={40} />
          <div className="ml-2">
            <span className="text-xl font-bold text-primary">AI for Internships</span>
            <p className="text-sm text-muted-foreground">Ministry of Corporate Affairs</p>
          </div>
        </Link>
        <nav className="ml-auto flex items-center gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#about">
            About
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#eligibility">
            Eligibility
          </Link>
          <Link className="text_sm font-medium hover:underline underline-offset-4" href="#contact">
            Contact
          </Link>
          <Button asChild variant="outline">
            <Link href="/login">Login / Register</Link>
          </Button>
          <ThemeToggle />
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-card">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-[1fr_550px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-primary">
                    Unlock Your Career Potential with Government-Backed Internships
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Connecting India's talent with premier companies through the Ministry of Corporate Affairs' AI-powered internship platform.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild size="lg">
                    <Link href="/login">
                      Find an Internship
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
              <Image
                src="https://wpblogassets.paytm.com/paytmblog/uploads/2024/11/518_PM-internship-Scheme.jpg"
                width="600"
                height="400"
                alt="PM Internship Scheme"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full"
              />
            </div>
          </div>
        </section>
        
        <section id="about" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter text-center sm:text-4xl md:text-5xl">About the Scheme</h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed text-center mt-4">
              The AI for Internships platform is a flagship initiative by the Ministry of Corporate Affairs to bridge the gap between students and the corporate world. We leverage artificial intelligence to create fair, transparent, and effective internship matches nationwide.
            </p>
          </div>
        </section>

        <section id="login-roles" className="w-full py-12 md:py-24 lg:py-32 bg-card">
          <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Join the Ecosystem</h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Register based on your role to get started. Are you a student looking for opportunities, a company seeking talent, an institute verifying students, or an admin overseeing the program?
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              <RoleCard icon={GraduationCap} title="Students" description="Create your profile, find AI-matched internships, and track your applications." href="/register?role=student" />
              <RoleCard icon={Building} title="Companies" description="Post internships, get AI-shortlisted candidates, and manage your hiring pipeline." href="/register?role=company" />
              <RoleCard icon={Briefcase} title="Institutes" description="Verify student credentials, monitor progress, and access institute-level analytics." href="/register?role=institute" />
              <RoleCard icon={Shield} title="Admins" description="Oversee the platform, ensure fairness, and generate national-level reports." href="/login?role=admin" />
            </div>
          </div>
        </section>

        <section id="eligibility" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter text-center sm:text-4xl md:text-5xl">Eligibility & Guidelines</h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed text-center mt-4">
              This program is open to all students enrolled in recognized Indian educational institutions. Please read the detailed guidelines for application procedures, company requirements, and program policies.
            </p>
            <div className="text-center mt-6">
              <Button variant="secondary" asChild>
                <Link href="/dashboard/guidelines">Read Guidelines <BookOpen className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
          </div>
        </section>

        <section id="contact" className="w-full py-12 md:py-24 lg:py-32 bg-card">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter text-center sm:text-4xl md:text-5xl">Contact & Support</h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed text-center mt-4">
              Have questions or need assistance? Our support team is here to help. Reach out to us via email or phone for any queries regarding the internship platform.
            </p>
            <div className="text-center mt-6">
              <Button asChild>
                <Link href="#">Contact Us <Contact className="ml-2 h-4 w-4"/></Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">&copy; 2024 Ministry of Corporate Affairs, Government of India.</p>
      </footer>
    </div>
  );
}

function RoleCard({ icon: Icon, title, description, href }: { icon: React.ElementType, title: string, description: string, href: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-6 bg-background rounded-lg shadow-md text-center h-full">
      <Icon className="w-12 h-12 text-primary mb-4" />
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground mb-4 flex-grow">{description}</p>
      <Button variant="link" asChild><Link href={href}>Get Started <ArrowRight className="ml-2 h-4 w-4"/></Link></Button>
    </div>
  )
}
