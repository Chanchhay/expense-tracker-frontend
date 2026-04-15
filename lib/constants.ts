import type { LucideIcon } from "lucide-react";
import {
    LayoutDashboard,
    Wallet,
    Tags,
    ReceiptText,
    PiggyBank,
    Target,
    BarChart3,
    User,
    Shield,
} from "lucide-react";

export type DashboardNavItem = {
    title: string;
    href: string;
    icon: LucideIcon;
    adminOnly?: boolean;
};

export const dashboardNavItems: DashboardNavItem[] = [
    {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Accounts",
        href: "/accounts",
        icon: Wallet,
    },
    {
        title: "Transactions",
        href: "/transactions",
        icon: ReceiptText,
    },
    {
        title: "Budgets",
        href: "/budgets",
        icon: PiggyBank,
    },
    {
        title: "Goals",
        href: "/goals",
        icon: Target,
    },
    {
        title: "Reports",
        href: "/reports",
        icon: BarChart3,
    },
    {
        title: "Profile",
        href: "/profile",
        icon: User,
    },
    {
        title: "Admin Users",
        href: "/admin/users",
        icon: Shield,
        adminOnly: true,
    },
];
