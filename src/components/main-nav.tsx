"use client";

import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import {
  Shield,
  LayoutDashboard,
  Search,
  Lightbulb,
  Briefcase,
  UserCircle,
  Building,
  GraduationCap,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

const studentLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/find-internships", label: "Find Internships", icon: Search },
  { href: "/dashboard/skill-analysis", label: "Skill Analysis", icon: Lightbulb },
  { href: "/dashboard/my-applications", label: "My Applications", icon: Briefcase },
  { href: "/dashboard/my-profile", label: "My Profile", icon: UserCircle },
];

const companyLinks = [
  { href: "/dashboard/company", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/company/post-internship", label: "Post Internship", icon: Briefcase },
  { href: "/dashboard/company/applications", label: "Applications", icon: Search },
];

const instituteLinks = [
    { href: "/dashboard/institute", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/institute/students", label: "Student List", icon: GraduationCap },
    { href: "/dashboard/institute/verification", label: "Verification", icon: Shield },
];

const adminLinks = [
    { href: "/dashboard/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/admin/reports", label: "Fairness Reports", icon: Shield },
    { href: "/dashboard/admin/analytics", label: "Analytics", icon: Briefcase },
];

// In a real app, you would get the user's role from auth state.
// For now, we'll simulate it based on the path.
const getLinksForRole = (pathname: string) => {
    if (pathname.startsWith('/dashboard/company')) return companyLinks;
    if (pathname.startsWith('/dashboard/institute')) return instituteLinks;
    if (pathname.startsWith('/dashboard/admin')) return adminLinks;
    return studentLinks; // default to student
}

const getRoleIcons = (pathname: string) => {
    if (pathname.startsWith('/dashboard/company')) return Building;
    if (pathname.startsWith('/dashboard/institute')) return GraduationCap;
    if (pathname.startsWith('/dashboard/admin')) return Shield;
    return UserCircle;
}

export default function MainNav() {
  const pathname = usePathname();
  const links = getLinksForRole(pathname);
  const RoleIcon = getRoleIcons(pathname);
  
  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Image src="/moca-logo.png" alt="MoCA Logo" width={36} height={36} />
          <span className="text-lg font-bold text-sidebar-foreground">
            AI for Internships
          </span>
        </div>
      </SidebarHeader>
      <SidebarMenu>
        {links.map((link) => (
          <SidebarMenuItem key={link.href}>
            <SidebarMenuButton
              asChild
              isActive={pathname === link.href}
              tooltip={link.label}
            >
              <Link href={link.href}>
                <link.icon />
                <span>{link.label}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </>
  );
}
