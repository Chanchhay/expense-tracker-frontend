"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Menu } from "lucide-react";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
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
        <header className="flex h-16 items-center justify-between border-b px-4">
            <div className="flex items-center gap-3">
                <SidebarTrigger>
                    <Button variant="ghost" size="icon">
                        <Menu className="size-5" />
                    </Button>
                </SidebarTrigger>

                <div>
                    <p className="font-medium">Expense Tracker</p>
                    <p className="text-sm text-muted-foreground">
                        {user ? `Welcome, ${user.name}` : "Dashboard"}
                    </p>
                </div>
            </div>

            <Button
                variant="destructive"
                onClick={handleLogout}
                disabled={isLoading}
            >
                {isLoading ? "Logging out..." : "Logout"}
            </Button>
        </header>
    );
}
