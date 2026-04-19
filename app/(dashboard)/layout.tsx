"use client";
import { useGetCurrentUserQuery } from "@/features/auth/auth-api";
import { AppSidebar } from "@/components/shared/app-sidebar";
import { AppHeader } from "@/components/shared/app-header";
import { BottomNav } from "@/components/shared/bottom-nav";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import Loading from "@/components/shared/loading";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { data, isLoading, isFetching, isError } = useGetCurrentUserQuery(
        undefined,
        {
            refetchOnFocus: true,
            refetchOnReconnect: true,
        },
    );

    if (isLoading || isFetching) {
        return <Loading />;
    }

    if (isError || !data) {
        return null;
    }

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
