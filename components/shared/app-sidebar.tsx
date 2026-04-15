"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
        <Sidebar>
            <SidebarHeader className="border-b">
                <div className="px-2 py-2">
                    <p className="text-lg font-semibold">Expense Tracker</p>
                    <p className="text-sm text-muted-foreground">
                        Management Panel
                    </p>
                </div>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Navigation</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {visibleNavItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = pathname === item.href;

                                return (
                                    <SidebarMenuItem key={item.href}>
                                        <SidebarMenuButton
                                            asChild
                                            isActive={isActive}
                                        >
                                            <Link href={item.href}>
                                                <Icon className="size-4" />
                                                <span>{item.title}</span>
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
