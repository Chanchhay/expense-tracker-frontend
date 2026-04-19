"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wallet } from "lucide-react"; // Using this as the logo icon

import { dashboardNavItems } from "@/lib/constants";
import { useGetCurrentUserQuery } from "@/features/auth/auth-api";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";

export function AppSidebar() {
    const pathname = usePathname();
    const { data: user } = useGetCurrentUserQuery();

    const visibleNavItems = dashboardNavItems.filter((item) => {
        if (item.adminOnly && user?.role !== "ADMIN") {
            return false;
        }
        return true;
    });

    return (
        <Sidebar className="border-r-0 shadow-sm bg-background/50 backdrop-blur-xl">
            {/* BRANDING / LOGO AREA */}
            <SidebarHeader className="pt-6 pb-4 px-6">
                <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
                        <Wallet className="size-5" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-lg tracking-tight">
                            Plutolio
                        </span>
                        <span className="text-xs font-medium text-muted-foreground">
                            Expense Tracker
                        </span>
                    </div>
                </div>
            </SidebarHeader>

            {/* NAVIGATION CONTENT */}
            <SidebarContent className="px-3">
                <SidebarGroup>
                    <SidebarGroupLabel className="px-3 text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider mb-2">
                        Main Menu
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu className="gap-1.5">
                            {visibleNavItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = pathname === item.href;

                                return (
                                    <SidebarMenuItem key={item.href}>
                                        <SidebarMenuButton
                                            asChild
                                            isActive={isActive}
                                            tooltip={item.title}
                                            className={`rounded-xl transition-all duration-200 h-11 px-3 ${
                                                isActive
                                                    ? "bg-primary/10 text-primary font-semibold hover:bg-primary/15 hover:text-primary"
                                                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground font-medium"
                                            }`}
                                        >
                                            <Link
                                                href={item.href}
                                                className="flex items-center gap-3"
                                            >
                                                <Icon
                                                    className={`size-5 ${isActive ? "text-primary" : "text-muted-foreground/70"}`}
                                                />
                                                <span className="text-sm">
                                                    {item.title}
                                                </span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}
