import { AppSidebar } from "@/components/shared/app-sidebar";
import { AppHeader } from "@/components/shared/app-header";
import { BottomNav } from "@/components/shared/bottom-nav";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <TooltipProvider>
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                    <AppHeader />
                    <main className="min-h-[calc(100vh-4rem)] bg-background pb-20 md:pb-0 relative">
                        {children}
                    </main>
                    <BottomNav />
                </SidebarInset>
            </SidebarProvider>
        </TooltipProvider>
    );
}
