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
    const { data, isLoading, isError } = useGetCurrentUserQuery();

    useEffect(() => {
        if (!isLoading && (isError || !data)) {
            router.replace("/login");
        }
    }, [isLoading, isError, data, router]);

    if (isLoading) {
        return <div className="p-6">Loading...</div>;
    }

    if (!data) {
        return null;
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
