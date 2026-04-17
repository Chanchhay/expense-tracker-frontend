"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useGetCurrentUserQuery } from "@/features/auth/auth-api";
import { AppSidebar } from "@/components/shared/app-sidebar";
import { AppHeader } from "@/components/shared/app-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

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
        return <div className="p-6">Loading...</div>;
    }

    if (isError) {
        return null;
    }

    if (!data) {
        return <div className="p-6">Loading user...</div>;
    }

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <AppHeader />
                <main className="min-h-[calc(100vh-4rem)] bg-background">
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}
