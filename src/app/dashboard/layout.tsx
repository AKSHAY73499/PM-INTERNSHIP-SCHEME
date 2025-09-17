import Header from "@/components/header";
import MainNav from "@/components/main-nav";
import Chatbot from "@/components/chatbot";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { PanelLeft } from "lucide-react";
import Image from "next/image";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-64 flex-col border-r bg-background sm:flex">
        <div className="flex h-[60px] items-center border-b px-6">
           <div className="flex items-center gap-2">
              <Image src="https://iic.viit.ac.in/images/Hackathon/SIH-logo.png" alt="SIH Logo" width={32} height={32} />
              <span className="font-bold">
                AI for Internships
              </span>
            </div>
        </div>
        <nav className="flex-1 overflow-auto py-2">
            <MainNav />
        </nav>
      </aside>
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-64">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
           <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline" className="sm:hidden">
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:max-w-xs p-0">
               <div className="flex h-[60px] items-center border-b px-6">
                  <div className="flex items-center gap-2">
                    <Image src="https://iic.viit.ac.in/images/Hackathon/SIH-logo.png" alt="SIH Logo" width={32} height={32} />
                    <span className="font-bold">
                      AI for Internships
                    </span>
                  </div>
              </div>
              <nav className="grid gap-6 text-lg font-medium p-6">
                <MainNav />
              </nav>
            </SheetContent>
          </Sheet>
          <Header />
        </header>
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          {children}
        </main>
      </div>
       <Chatbot />
    </div>
  );
}
