"use client";

import { useState } from "react";
import { toast } from "sonner";

import {
    useDeleteAccountMutation,
    useGetAccountsQuery,
} from "@/features/accounts/accounts-api";
import type { AccountResponse } from "@/features/accounts/types";
import { getErrorMessage } from "@/lib/get-error-message";
import { Button } from "@/components/ui/button";
import AccountForm from "@/components/forms/account-form";
import { PageContainer } from "@/components/shared/page-container";
import DeleteConfirmDialog from "@/components/shared/delete-confirm-dialog";

export default function AccountsPage() {
    const { data: accounts, isLoading, isError } = useGetAccountsQuery(undefined, {
        refetchOnFocus: true,
        refetchOnReconnect: true,
    });
    const [deleteAccount, { isLoading: isDeleting }] =
        useDeleteAccountMutation();
    const [editingAccount, setEditingAccount] =
        useState<AccountResponse | null>(null);

    const handleDelete = async (id: string) => {
        try {
            await deleteAccount(id).unwrap();
            toast.success("Account deleted successfully");
            if (editingAccount?.id === id) {
                setEditingAccount(null);
            }
        } catch (error: unknown) {
            toast.error(getErrorMessage(error));
        }
    };

    if (isLoading) {
        return <div>Loading accounts...</div>;
    }

    if (isError) {
        return <div>Failed to load accounts.</div>;
    }

    return (
        <PageContainer
            title="Accounts"
            description="Manage your financial accounts"
        >
            <div className="space-y-6">
                <AccountForm
                    account={editingAccount}
                    onSuccess={() => setEditingAccount(null)}
                />

                <div className="space-y-4">
                    <h3 className="text-xl font-semibold">Account List</h3>

                    {!accounts || accounts.length === 0 ? (
                        <p>No accounts found.</p>
                    ) : (
                        <div className="space-y-3">
                            {accounts.map((account) => (
                                <div
                                    key={account.id}
                                    className="border rounded-md p-4 flex items-center justify-between"
                                >
                                    <div>
                                        <p className="font-medium">
                                            {account.name}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {account.type} | {account.currency}
                                        </p>
                                        <p className="text-sm">
                                            Initial: {account.initialBalance} |
                                            Current: {account.currentBalance}
                                        </p>
                                    </div>

                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            onClick={() =>
                                                setEditingAccount(account)
                                            }
                                        >
                                            Edit
                                        </Button>
                                        <DeleteConfirmDialog
                                            isLoading={isDeleting}
                                            title="Delete account?"
                                            description="This will permanently remove this account."
                                            onConfirm={() =>
                                                handleDelete(account.id)
                                            }
                                            trigger={
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                >
                                                    Delete
                                                </Button>
                                            }
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </PageContainer>
    );
}
