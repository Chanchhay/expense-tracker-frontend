"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
    Shield,
    User,
    Mail,
    Calendar,
    CheckCircle2,
    XCircle,
    ChevronDown,
    Loader2,
} from "lucide-react";

import { useGetCurrentUserQuery } from "@/features/auth/auth-api";
import {
    useGetAdminUsersQuery,
    useUpdateAdminUserRoleMutation,
    useUpdateAdminUserStatusMutation,
} from "@/features/admin/admin-users-api";
import type { AdminUserResponse } from "@/features/admin/types";
import { getErrorMessage } from "@/lib/get-error-message";
import { PageContainer } from "@/components/shared/page-container";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Loading from "@/components/shared/loading";

type RoleState = Record<string, "USER" | "ADMIN">;

export default function AdminUsersPage() {
    const router = useRouter();

    const {
        data: currentUser,
        isLoading,
        isFetching,
        isError,
    } = useGetCurrentUserQuery(undefined, {
        refetchOnFocus: true,
        refetchOnReconnect: true,
    });

    const {
        data: users,
        isLoading: isUsersLoading,
        isError: isUsersError,
    } = useGetAdminUsersQuery(undefined, {
        skip: currentUser?.role !== "ADMIN",
    });

    const [updateAdminUserRole, { isLoading: isUpdatingRole }] =
        useUpdateAdminUserRoleMutation();

    const [updateAdminUserStatus, { isLoading: isUpdatingStatus }] =
        useUpdateAdminUserStatusMutation();

    const [selectedRoles, setSelectedRoles] = useState<RoleState>({});

    useEffect(() => {
        if (isLoading || isFetching) return;

        if (isError) {
            router.replace("/login");
            return;
        }

        if (currentUser && currentUser.role !== "ADMIN") {
            router.replace("/dashboard");
        }
    }, [currentUser, isLoading, isFetching, isError, router]);

    useEffect(() => {
        if (users) {
            const initialRoles: RoleState = {};
            users.forEach((user) => {
                initialRoles[user.id] = user.role;
            });
        }
    }, [users]);

    const handleRoleChange = (userId: string, role: "USER" | "ADMIN") => {
        setSelectedRoles((prev) => ({
            ...prev,
            [userId]: role,
        }));
    };

    const handleUpdateRole = async (user: AdminUserResponse) => {
        try {
            const selectedRole = selectedRoles[user.id];

            if (!selectedRole || selectedRole === user.role) {
                toast.info("No role changes to update");
                return;
            }

            await updateAdminUserRole({
                id: user.id,
                body: { role: selectedRole },
            }).unwrap();

            toast.success("User role updated successfully");
        } catch (error: unknown) {
            toast.error(getErrorMessage(error));
        }
    };

    const handleToggleStatus = async (user: AdminUserResponse) => {
        try {
            await updateAdminUserStatus({
                id: user.id,
                body: { isActive: !user.isActive },
            }).unwrap();

            toast.success(
                `User ${user.isActive ? "deactivated" : "activated"} successfully`,
            );
        } catch (error: unknown) {
            toast.error(getErrorMessage(error));
        }
    };

    if (isLoading || isFetching)
        return (
            <Loading
                title="Admin Panel"
                description="Verifying permissions..."
            />
        );

    if (!currentUser || currentUser.role !== "ADMIN") return null;

    if (isUsersLoading)
        return (
            <Loading
                title="Admin Panel"
                description="Loading system users..."
            />
        );

    if (isUsersError) {
        return (
            <div className="p-8 text-center text-red-500 border border-red-100 rounded-lg bg-red-50 max-w-xl mx-auto mt-10">
                Failed to load admin users.
            </div>
        );
    }

    return (
        <PageContainer
            title="User Management"
            description="Manage system users, roles, and account statuses."
        >
            <div className="space-y-6 pb-8">
                {/* Status Bar */}
                <div className="flex items-center justify-between text-sm font-medium text-muted-foreground">
                    <span>{users?.length || 0} Total Users Registered</span>
                </div>

                {!users || users.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-12 border border-dashed border-muted/60 rounded-lg bg-transparent text-center">
                        <Shield className="size-10 text-muted-foreground/50 mb-3" />
                        <p className="font-medium text-foreground">
                            No users found.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {users.map((user) => {
                            const currentSelectedRole =
                                selectedRoles[user.id] ?? user.role;
                            const roleChanged =
                                currentSelectedRole !== user.role;
                            const isAdmin = user.role === "ADMIN";
                            const isSelf = user.id === currentUser.id;

                            return (
                                <Card
                                    key={user.id}
                                    className="rounded-lg shadow-sm border-muted/60 flex flex-col transition-all hover:shadow-md"
                                >
                                    <CardContent className="p-5 flex-1 flex flex-col">
                                        {/* User Header */}
                                        <div className="flex items-start gap-4 mb-5">
                                            <div
                                                className={`size-12 rounded-full flex items-center justify-center shrink-0 shadow-sm border ${isAdmin ? "bg-primary/10 border-primary/20 text-primary" : "bg-muted border-muted/60 text-muted-foreground"}`}
                                            >
                                                {isAdmin ? (
                                                    <Shield className="size-6" />
                                                ) : (
                                                    <User className="size-6" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between gap-2">
                                                    <h3 className="font-bold text-foreground truncate">
                                                        {user.name}
                                                    </h3>
                                                    {isSelf && (
                                                        <span className="text-[10px] uppercase font-bold tracking-wider bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                                                            You
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-sm font-medium text-muted-foreground flex items-center gap-1.5 truncate mt-0.5">
                                                    <Mail className="size-3.5 shrink-0" />
                                                    <span className="truncate">
                                                        {user.email}
                                                    </span>
                                                </p>
                                            </div>
                                        </div>

                                        {/* Meta Stats Box */}
                                        <div className="bg-muted/10 rounded-md p-3 mb-5 space-y-2.5 text-sm border border-muted/30">
                                            <div className="flex items-center justify-between">
                                                <span className="text-muted-foreground font-medium">
                                                    Account Status
                                                </span>
                                                {user.isActive ? (
                                                    <span className="font-bold text-green-600 flex items-center gap-1.5">
                                                        <CheckCircle2 className="size-4" />{" "}
                                                        Active
                                                    </span>
                                                ) : (
                                                    <span className="font-bold text-red-500 flex items-center gap-1.5">
                                                        <XCircle className="size-4" />{" "}
                                                        Inactive
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-muted-foreground font-medium">
                                                    Joined Date
                                                </span>
                                                <span className="font-semibold text-foreground flex items-center gap-1.5">
                                                    <Calendar className="size-4 text-muted-foreground" />
                                                    {user.createdAt}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="mt-auto space-y-4 pt-4 border-t border-muted/60">
                                            {/* Role Update */}
                                            <div className="space-y-2">
                                                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                                    Assign Role
                                                </label>
                                                <div className="flex gap-2">
                                                    <div className="relative flex-1">
                                                        <select
                                                            value={
                                                                currentSelectedRole
                                                            }
                                                            disabled={isSelf} // Prevent demoting yourself easily
                                                            onChange={(e) =>
                                                                handleRoleChange(
                                                                    user.id,
                                                                    e.target
                                                                        .value as
                                                                        | "USER"
                                                                        | "ADMIN",
                                                                )
                                                            }
                                                            className="w-full appearance-none rounded-md border border-muted/60 bg-background px-3 py-2 text-sm font-medium shadow-sm outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                                        >
                                                            <option value="USER">
                                                                User
                                                            </option>
                                                            <option value="ADMIN">
                                                                Admin
                                                            </option>
                                                        </select>
                                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                                                    </div>

                                                    <Button
                                                        type="button"
                                                        variant={
                                                            roleChanged
                                                                ? "default"
                                                                : "secondary"
                                                        }
                                                        className="rounded-md"
                                                        disabled={
                                                            isUpdatingRole ||
                                                            !roleChanged ||
                                                            isSelf
                                                        }
                                                        onClick={() =>
                                                            handleUpdateRole(
                                                                user,
                                                            )
                                                        }
                                                    >
                                                        {isUpdatingRole &&
                                                        roleChanged ? (
                                                            <Loader2 className="size-4 animate-spin" />
                                                        ) : (
                                                            "Save"
                                                        )}
                                                    </Button>
                                                </div>
                                            </div>

                                            {/* Status Toggle */}
                                            <div className="space-y-2">
                                                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                                    Access Control
                                                </label>
                                                <Button
                                                    type="button"
                                                    variant={
                                                        user.isActive
                                                            ? "destructive"
                                                            : "default"
                                                    }
                                                    className="w-full rounded-md shadow-sm font-semibold"
                                                    disabled={
                                                        isUpdatingStatus ||
                                                        isSelf
                                                    } // Prevent deactivating yourself
                                                    onClick={() =>
                                                        handleToggleStatus(user)
                                                    }
                                                >
                                                    {isUpdatingStatus
                                                        ? "Updating..."
                                                        : user.isActive
                                                          ? "Deactivate Account"
                                                          : "Activate Account"}
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>
        </PageContainer>
    );
}
