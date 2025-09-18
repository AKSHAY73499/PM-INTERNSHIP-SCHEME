
"use client";

import {
  Shield,
  LayoutDashboard,
  Search,
  Lightbulb,
  Briefcase,
  UserCircle,
  Building,
  GraduationCap,
  BookOpen,
  CheckCircle,
  BarChart,
  FileText,
  List,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { cn } from "@/lib/utils";

const studentLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/find-internships", label: "Find Internships", icon: Search },
  { href: "/dashboard/skill-analysis", label: "Skill Analysis", icon: Lightbulb },
  { href: "/dashboard/my-applications", label: "My Applications", icon: Briefcase },
  { href: "/dashboard/my-profile", label: "My Profile", icon: UserCircle },
  { href: "/dashboard/guidelines", label: "Guidelines", icon: FileText },
  { href: "/dashboard/resources", label: "Resources", icon: BookOpen },
];

const companyLinks = [
  { href: "/dashboard/company", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/company/post-internship", label: "Post Internship", icon: Briefcase },
  { href: "/dashboard/company/manage-internships", label: "Manage Internships", icon: List },
  { href: "/dashboard/company/applications", label: "Applications", icon: Search },
];

const instituteLinks = [
    { href: "/dashboard/institute", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/institute/students", label: "Student List", icon: GraduationCap },
    { href: "/dashboard/institute/verification", label: "Verification", icon: Shield },
];

const adminLinks = [
    { href: "/dashboard/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/admin/verification", label: "Verification Center", icon: CheckCircle },
    { href: "/dashboard/admin/reports", label: "Fairness Reports", icon: Shield },
    { href: "/dashboard/admin/analytics", label: "Analytics", icon: BarChart },
];

// In a real app, you would get the user's role from auth state.
// For now, we'll simulate it based on the path.
const getLinksForRole = (pathname: string) => {
    if (pathname.startsWith('/dashboard/company')) return companyLinks;
    if (pathname.startsWith('/dashboard/institute')) return instituteLinks;
    if (pathname.startsWith('/dashboard/admin')) return adminLinks;
    return studentLinks; // default to student
}

export default function MainNav() {
  const pathname = usePathname();
  const links = getLinksForRole(pathname);
  
  return (
    <nav className="flex flex-col gap-2 p-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                pathname === link.href && "bg-muted text-primary"
            )}
            >
            <link.icon className="h-4 w-4" />
            {link.label}
          </Link>
        ))}
    </nav>
  );
}
