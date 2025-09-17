"use client";

import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import {
  Compass,
  LayoutDashboard,
  Search,
  Lightbulb,
  Briefcase,
  UserCircle,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/find-internships", label: "Find Internships", icon: Search },
  { href: "/dashboard/skill-analysis", label: "Skill Analysis", icon: Lightbulb },
  { href: "/dashboard/my-applications", label: "My Applications", icon: Briefcase },
  { href: "/dashboard/my-profile", label: "My Profile", icon: UserCircle },
];

export default function MainNav() {
  const pathname = usePathname();
  
  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Compass className="size-7 text-primary" />
          <span className="text-xl font-bold font-headline text-sidebar-foreground">
            InternCompass
          </span>
        </div>
      </SidebarHeader>
      <SidebarMenu>
        {links.map((link) => (
          <SidebarMenuItem key={link.href}>
            <SidebarMenuButton
              asChild
              isActive={pathname.startsWith(link.href) && (link.href !== "/dashboard" || pathname === "/dashboard")}
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
