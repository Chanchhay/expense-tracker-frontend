"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Bell, LogOut } from "lucide-react";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/shared/theme-toggle"; // <-- Add this
import {
    useGetCurrentUserQuery,
    useLogoutMutation,
} from "@/features/auth/auth-api";
import { getErrorMessage } from "@/lib/get-error-message";

export function AppHeader() {
    const router = useRouter();
    const { data: user } = useGetCurrentUserQuery();
    const [logout, { isLoading }] = useLogoutMutation();

    const handleLogout = async () => {
        try {
            const res = await logout().unwrap();
            toast.success(res.message || "Logged out successfully");
            router.push("/login");
        } catch (error: unknown) {
            toast.error(getErrorMessage(error));
        }
    };

    return (
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between bg-background/80 px-4 md:px-8 backdrop-blur-md">
            {/* LEFT SIDE: Trigger & Greeting */}
            <div className="flex items-center gap-4">
                <SidebarTrigger className="-ml-2 hidden md:flex hover:bg-muted/50 rounded-md transition-colors" />

                <div>
                    <h1 className="text-xl font-bold tracking-tight">
                        {user
                            ? `Welcome back, ${user.name.split(" ")[0]} 👋`
                            : "Dashboard"}
                    </h1>
                    <p className="text-sm text-muted-foreground hidden md:block">
                        Here is what&apos;s happening with your money today.
                    </p>
                </div>
            </div>

            {/* RIGHT SIDE: Actions */}
            <div className="flex items-center gap-2 md:gap-4">
                {/* Dark Mode Toggle */}
                <ThemeToggle />

                {/* Mock Notification Bell */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-md hover:bg-muted/50 text-muted-foreground"
                >
                    <Bell className="size-5" />
                </Button>

                {/* Refined Logout Button */}
                <Button
                    variant="ghost"
                    onClick={handleLogout}
                    disabled={isLoading}
                    className="rounded-md bg-muted/30 hover:bg-red-50 hover:text-red-600 text-muted-foreground transition-all px-4 font-medium"
                >
                    <LogOut className="size-4 mr-2" />
                    <span className="hidden md:inline">
                        {isLoading ? "Logging out..." : "Logout"}
                    </span>
                </Button>
            </div>
        </header>
    );
}
