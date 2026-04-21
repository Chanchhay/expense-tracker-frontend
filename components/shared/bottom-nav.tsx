"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { dashboardNavItems } from "@/lib/constants";
import { useGetCurrentUserQuery } from "@/features/auth/auth-api";

export function BottomNav() {
    const pathname = usePathname();
    const { data: user } = useGetCurrentUserQuery();

    const visibleNavItems = dashboardNavItems.filter((item) => {
        if (item.adminOnly && user?.role !== "ADMIN") {
            return false;
        }
        return true;
    });

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t border-muted/60 bg-background/80 px-2 backdrop-blur-md md:hidden pb-safe">
            {visibleNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className="flex h-full flex-1 items-center justify-center"
                    >
                        <div
                            className={`flex flex-col items-center justify-center rounded-2xl p-2 transition-all duration-200 ${
                                isActive
                                    ? "bg-primary/10 text-primary"
                                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                            }`}
                        >
                            <Icon
                                className={`size-6 ${isActive ? "scale-110 transition-transform" : ""}`}
                            />
                            {isActive && (
                                <div className="absolute bottom-2 h-1 w-1 rounded-full bg-primary" />
                            )}
                        </div>
                    </Link>
                );
            })}
        </nav>
    );
}
