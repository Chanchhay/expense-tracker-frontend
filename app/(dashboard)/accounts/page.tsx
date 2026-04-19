"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
    Wallet,
    Landmark,
    CreditCard,
    Smartphone,
    PiggyBank,
    MoreVertical,
    Edit2,
    Trash2,
    Plus,
} from "lucide-react";

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
import Loading from "@/components/shared/loading";
import { Card, CardContent } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

const getAccountStyles = (type: string) => {
    switch (type) {
        case "BANK":
            return { icon: Landmark, colorClass: "bg-blue-100 text-blue-600" };
        case "CARD":
            return {
                icon: CreditCard,
                colorClass: "bg-purple-100 text-purple-600",
            };
        case "EWALLET":
            return {
                icon: Smartphone,
                colorClass: "bg-amber-100 text-amber-600",
            };
        case "SAVINGS":
            return {
                icon: PiggyBank,
                colorClass: "bg-emerald-100 text-emerald-600",
            };
        case "CASH":
        default:
            return { icon: Wallet, colorClass: "bg-primary/20 text-primary" };
    }
};

export default function AccountsPage() {
    const {
        data: accounts,
        isLoading,
        isError,
    } = useGetAccountsQuery(undefined, {
        refetchOnFocus: true,
        refetchOnReconnect: true,
    });
    const [deleteAccount, { isLoading: isDeleting }] =
        useDeleteAccountMutation();

    // UI State
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingAccount, setEditingAccount] =
        useState<AccountResponse | null>(null);
    const [accountToDelete, setAccountToDelete] = useState<string | null>(null);

    const handleDelete = async (id: string) => {
        try {
            await deleteAccount(id).unwrap();
            toast.success("Account deleted successfully");
            if (editingAccount?.id === id) {
                setEditingAccount(null);
                setIsFormOpen(false);
            }
            setAccountToDelete(null);
        } catch (error: unknown) {
            toast.error(getErrorMessage(error));
        }
    };

    const handleEdit = (account: AccountResponse) => {
        setEditingAccount(account);
        setIsFormOpen(true);
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        // Slight delay to allow dialog out-animation before clearing data
        setTimeout(() => setEditingAccount(null), 200);
    };

    if (isLoading)
        return (
            <Loading title="Accounts" description="Syncing your wallets..." />
        );
    if (isError)
        return <div className="p-8 text-red-500">Failed to load accounts.</div>;

    return (
        <PageContainer
            title="Accounts"
            description="Manage your wallets, banks, and credit cards."
        >
            <div className="space-y-6 pb-8">
                {/* Header Actions */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold tracking-tight text-foreground">
                            Your Wallets
                        </h3>
                        <span className="text-xs font-medium px-2.5 py-0.5 bg-muted rounded-md text-muted-foreground border border-muted-foreground/20">
                            {accounts?.length || 0} Total
                        </span>
                    </div>

                    <Button
                        onClick={() => setIsFormOpen(true)}
                        className="rounded-md shadow-sm"
                    >
                        <Plus className="mr-2 size-4" /> Add Account
                    </Button>
                </div>

                {/* Account Grid */}
                {!accounts || accounts.length === 0 ? (
                    <Card className="rounded-lg border-dashed border-2 border-muted/60 bg-transparent shadow-none h-48 flex items-center justify-center">
                        <p className="text-muted-foreground font-medium">
                            No accounts found. Create one to get started.
                        </p>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {accounts.map((account) => {
                            const { icon: Icon, colorClass } = getAccountStyles(
                                account.type,
                            );

                            return (
                                <Card
                                    key={account.id}
                                    className="rounded-lg shadow-sm border-muted/60 transition-all hover:shadow-md"
                                >
                                    <CardContent className="p-5 flex flex-col h-full justify-between gap-6">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className={`p-2.5 rounded-lg ${colorClass}`}
                                                >
                                                    <Icon className="size-5" />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-foreground leading-none">
                                                        {account.name}
                                                    </p>
                                                    <p className="text-xs font-medium text-muted-foreground mt-1.5 tracking-wide">
                                                        {account.type} •{" "}
                                                        {account.currency}
                                                    </p>
                                                </div>
                                            </div>

                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 rounded-md -mr-2 text-muted-foreground hover:text-foreground"
                                                    >
                                                        <MoreVertical className="size-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent
                                                    align="end"
                                                    className="rounded-lg shadow-lg border-muted/60"
                                                >
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            handleEdit(account)
                                                        }
                                                        className="rounded-md cursor-pointer"
                                                    >
                                                        <Edit2 className="size-4 mr-2" />{" "}
                                                        Edit Details
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            setAccountToDelete(
                                                                account.id,
                                                            )
                                                        }
                                                        className="rounded-md cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                                                    >
                                                        <Trash2 className="size-4 mr-2" />{" "}
                                                        Delete Account
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>

                                        <div>
                                            <p className="text-2xl font-bold tracking-tight">
                                                {account.currency}{" "}
                                                {account.currentBalance.toLocaleString(
                                                    undefined,
                                                    {
                                                        minimumFractionDigits: 2,
                                                    },
                                                )}
                                            </p>
                                            <p className="text-sm font-medium text-muted-foreground mt-1">
                                                Initial:{" "}
                                                {account.initialBalance.toLocaleString()}
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Modal for Creating/Editing Account */}
            <Dialog
                open={isFormOpen}
                onOpenChange={(open) => !open && handleCloseForm()}
            >
                <DialogContent className="sm:max-w-[450px] rounded-lg border-muted/60 shadow-lg">
                    <DialogHeader>
                        <DialogTitle className="text-xl">
                            {editingAccount ? "Edit Account" : "Add Account"}
                        </DialogTitle>
                        <DialogDescription>
                            {editingAccount
                                ? "Update your wallet details below."
                                : "Create a new wallet to track."}
                        </DialogDescription>
                    </DialogHeader>

                    {/* The Form */}
                    <div className="pt-2">
                        <AccountForm
                            account={editingAccount}
                            onSuccess={handleCloseForm}
                        />
                    </div>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            {/* Delete Confirmation */}
            <DeleteConfirmDialog
                isOpen={!!accountToDelete}
                onOpenChange={(open) => !open && setAccountToDelete(null)}
                isLoading={isDeleting}
                title="Delete Account?"
                description="This will permanently remove this account. This action cannot be undone."
                onConfirm={() => {
                    if (accountToDelete) {
                        handleDelete(accountToDelete);
                    }
                }}
            />
        </PageContainer>
    );
}
