import Header from "@/components/header";
import MainNav from "@/components/main-nav";
import { Sidebar, SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import Chatbot from "@/components/chatbot";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="min-h-screen">
        <Sidebar collapsible="icon">
          <MainNav />
        </Sidebar>
        <SidebarInset>
          <Header />
          <main className="p-4 sm:p-6 lg:p-8">{children}</main>
        </SidebarInset>
        <Chatbot />
      </div>
    </SidebarProvider>
  );
}
