"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useGetCurrentUserQuery } from "@/features/auth/auth-api";
import { AppSidebar } from "@/components/shared/app-sidebar";
import { AppHeader } from "@/components/shared/app-header";
import { BottomNav } from "@/components/shared/bottom-nav"; // <-- ADD THIS IMPORT
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import Loading from "@/components/shared/loading"; // Assuming you want to use the global loading here too
import { TooltipProvider } from "@/components/ui/tooltip";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();

    const { data, isLoading, isFetching, isError } = useGetCurrentUserQuery(
        undefined,
        {
            refetchOnFocus: true,
            refetchOnReconnect: true,
        },
    );

    useEffect(() => {
        if (isLoading || isFetching) return;

        if (isError) {
            router.replace("/login");
        }
    }, [isLoading, isFetching, isError, router]);

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
                    {/* ADDED pb-20 for mobile, md:pb-0 for desktop so the bottom nav doesn't cover content */}
                    <main className="min-h-[calc(100vh-4rem)] bg-background pb-20 md:pb-0 relative">
                        {children}
                    </main>
                    <BottomNav /> {/* <-- ADD THE BOTTOM NAV HERE */}
                </SidebarInset>
            </SidebarProvider>
        </TooltipProvider>
    );
}
