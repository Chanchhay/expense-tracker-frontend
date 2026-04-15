"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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

type RoleState = Record<string, "USER" | "ADMIN">;

export default function AdminUsersPage() {
    const router = useRouter();

    const {
        data: currentUser,
        isLoading: isCurrentUserLoading,
        isError: isCurrentUserError,
    } = useGetCurrentUserQuery();

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
        if (!isCurrentUserLoading) {
            if (isCurrentUserError || !currentUser) {
                router.replace("/login");
                return;
            }

            if (currentUser.role !== "ADMIN") {
                router.replace("/dashboard");
            }
        }
    }, [currentUser, isCurrentUserLoading, isCurrentUserError, router]);

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

            toast.success("User status updated successfully");
        } catch (error: unknown) {
            toast.error(getErrorMessage(error));
        }
    };

    if (isCurrentUserLoading) {
        return <div className="p-6">Loading...</div>;
    }

    if (!currentUser || currentUser.role !== "ADMIN") {
        return null;
    }

    if (isUsersLoading) {
        return <div className="p-6">Loading admin users...</div>;
    }

    if (isUsersError) {
        return <div className="p-6">Failed to load admin users.</div>;
    }

    return (
        <PageContainer
            title="Admin Users"
            description="Manage system users, roles, and statuses"
        >
            <div className="space-y-4">
                {!users || users.length === 0 ? (
                    <p>No users found.</p>
                ) : (
                    <div className="space-y-3">
                        {users.map((user) => {
                            const currentSelectedRole =
                                selectedRoles[user.id] ?? user.role;
                            const roleChanged =
                                currentSelectedRole !== user.role;

                            return (
                                <div
                                    key={user.id}
                                    className="rounded-md border p-4 space-y-4"
                                >
                                    <div>
                                        <p className="font-medium">
                                            {user.name}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {user.email}
                                        </p>
                                        <p className="text-sm">
                                            Current Role: {user.role}
                                        </p>
                                        <p className="text-sm">
                                            Status:{" "}
                                            {user.isActive
                                                ? "Active"
                                                : "Inactive"}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            Created At: {user.createdAt}
                                        </p>
                                    </div>

                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <p className="text-sm font-medium">
                                                Update Role
                                            </p>
                                            <div className="flex gap-2">
                                                <select
                                                    value={currentSelectedRole}
                                                    onChange={(e) =>
                                                        handleRoleChange(
                                                            user.id,
                                                            e.target.value as
                                                                | "USER"
                                                                | "ADMIN",
                                                        )
                                                    }
                                                    className="w-full rounded-md border px-3 py-2"
                                                >
                                                    <option value="USER">
                                                        USER
                                                    </option>
                                                    <option value="ADMIN">
                                                        ADMIN
                                                    </option>
                                                </select>

                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    disabled={
                                                        isUpdatingRole ||
                                                        !roleChanged
                                                    }
                                                    onClick={() =>
                                                        handleUpdateRole(user)
                                                    }
                                                >
                                                    {isUpdatingRole
                                                        ? "Updating..."
                                                        : "Update Role"}
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <p className="text-sm font-medium">
                                                Update Status
                                            </p>
                                            <Button
                                                type="button"
                                                variant={
                                                    user.isActive
                                                        ? "destructive"
                                                        : "default"
                                                }
                                                disabled={isUpdatingStatus}
                                                onClick={() =>
                                                    handleToggleStatus(user)
                                                }
                                            >
                                                {isUpdatingStatus
                                                    ? "Updating..."
                                                    : user.isActive
                                                      ? "Deactivate"
                                                      : "Activate"}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </PageContainer>
    );
}
