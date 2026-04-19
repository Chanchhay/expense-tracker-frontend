"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
    Plus,
    MoreVertical,
    Edit2,
    Trash2,
    ArrowUpRight,
    ArrowDownRight,
    Filter,
    Calendar,
    X,
    Loader2,
} from "lucide-react";

import {
    useDeleteTransactionMutation,
    useGetTransactionsQuery,
} from "@/features/transactions/transactions-api";
import type {
    TransactionResponse,
    TransactionType,
} from "@/features/transactions/types";
import { getErrorMessage } from "@/lib/get-error-message";

import TransactionForm from "@/components/forms/transaction-form";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/shared/page-container";
import CategorySheet from "@/components/shared/category-sheet";
import DeleteConfirmDialog from "@/components/shared/delete-confirm-dialog";
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
import Image from "next/image";

function getCurrentMonthValue() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    return `${year}-${month}`;
}

export default function TransactionsPage() {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState<TransactionResponse | null>(null);
    const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const [typeFilter, setTypeFilter] = useState<"" | TransactionType>("");
    const [monthFilter, setMonthFilter] = useState(getCurrentMonthValue());

    const queryParams = useMemo(() => {
        return {
            ...(typeFilter ? { type: typeFilter } : {}),
            ...(monthFilter ? { month: monthFilter } : {}),
        };
    }, [typeFilter, monthFilter]);

    const {
        data: transactions,
        isLoading,
        isFetching,
        isError,
    } = useGetTransactionsQuery(queryParams, {
        refetchOnFocus: true,
        refetchOnReconnect: true,
    });

    const [deleteTransaction, { isLoading: isDeleting }] = useDeleteTransactionMutation();

    const handleDelete = async (id: string) => {
        try {
            await deleteTransaction(id).unwrap();
            toast.success("Transaction deleted successfully");

            if (editingTransaction?.id === id) {
                setEditingTransaction(null);
                setIsFormOpen(false);
            }
            setTransactionToDelete(null);
        } catch (error: unknown) {
            toast.error(getErrorMessage(error));
        }
    };

    const handleEdit = (transaction: TransactionResponse) => {
        setEditingTransaction(transaction);
        setIsFormOpen(true);
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setTimeout(() => setEditingTransaction(null), 200);
    };

    return (
        <PageContainer
            title="Transactions"
            description="View and manage your cash flow history."
        >
            <div className="space-y-6 pb-8">
                {/* Header Actions */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    {/* Filters */}
                    <div className="flex items-center gap-3">
                        <div className="flex items-center rounded-md border border-muted/60 bg-background px-3 shadow-sm focus-within:ring-2 focus-within:ring-primary/20">
                            <Filter className="size-4 text-muted-foreground mr-2 shrink-0" />
                            <select
                                value={typeFilter}
                                onChange={(e) => setTypeFilter(e.target.value as "" | TransactionType)}
                                className="appearance-none bg-transparent py-2 text-sm font-medium outline-none cursor-pointer pr-4"
                            >
                                <option value="">All Types</option>
                                <option value="INCOME">Income</option>
                                <option value="EXPENSE">Expense</option>
                            </select>
                        </div>

                        <div className="flex items-center rounded-md border border-muted/60 bg-background pl-3 pr-2 shadow-sm focus-within:ring-2 focus-within:ring-primary/20">
                            <Calendar className="size-4 text-muted-foreground mr-2 shrink-0" />
                            <input
                                type="month"
                                value={monthFilter}
                                onClick={(e) => {
                                    try {
                                        e.currentTarget.showPicker();
                                    } catch (error) {}
                                }}
                                onChange={(e) => setMonthFilter(e.target.value)}
                                className="bg-transparent py-2 text-sm font-medium outline-none w-[130px] sm:w-auto cursor-pointer [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                            />
                            {monthFilter && (
                                <button
                                    onClick={() => setMonthFilter("")}
                                    className="p-1 ml-1 rounded-md text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors"
                                    title="Clear month filter"
                                >
                                    <X className="size-4" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <CategorySheet
                            trigger={
                                <Button variant="outline" className="rounded-md w-full sm:w-auto">
                                    Categories
                                </Button>
                            }
                        />
                        <Button onClick={() => setIsFormOpen(true)} className="rounded-md shadow-sm w-full sm:w-auto">
                            <Plus className="mr-2 size-4" /> Add Record
                        </Button>
                    </div>
                </div>

                {/* Status Bar */}
                <div className="flex items-center justify-between text-sm font-medium text-muted-foreground">
                    <span>{transactions?.length || 0} Records Found</span>
                    {(isLoading || isFetching) && (
                        <span className="flex items-center text-primary">
                            <Loader2 className="size-4 animate-spin mr-2" /> Syncing...
                        </span>
                    )}
                </div>

                {/* Transaction Grid Layout */}
                {isError ? (
                    <div className="flex flex-col items-center justify-center p-12 border border-muted/60 rounded-lg bg-card shadow-sm">
                        <div className="size-12 rounded-full bg-red-50 flex items-center justify-center mb-4">
                            <X className="size-6 text-red-500" />
                        </div>
                        <p className="font-medium text-foreground">Failed to load transactions</p>
                        <p className="text-sm text-muted-foreground mt-1">Please try refreshing the page.</p>
                    </div>
                ) : !transactions || transactions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-12 border border-dashed border-muted/60 rounded-lg bg-transparent text-center">
                        <p className="font-medium text-foreground">No transactions logged yet.</p>
                        <p className="text-sm text-muted-foreground mt-1">Adjust your filters or click &quot;Add Record&quot; to start.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {transactions.map((transaction) => {
                            const isIncome = transaction.type === "INCOME";

                            return (
                                <Card key={transaction.id} className="rounded-lg shadow-sm border-muted/60 transition-all hover:shadow-md flex flex-col group">
                                    <CardContent className="p-5 flex flex-col h-full">

                                        {/* Top Row: Icon, Category & Menu */}
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`flex items-center justify-center size-10 rounded-md shrink-0 ${isIncome ? "bg-green-100 text-green-600 border border-green-200" : "bg-red-50 text-red-600 border border-red-100"}`}>
                                                    {isIncome ? <ArrowUpRight className="size-5" /> : <ArrowDownRight className="size-5" />}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-foreground leading-tight">
                                                        {transaction.categoryName}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground font-medium mt-0.5">
                                                        {transaction.accountName}
                                                    </p>
                                                </div>
                                            </div>

                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-md -mr-2 text-muted-foreground hover:text-foreground">
                                                        <MoreVertical className="size-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="rounded-md shadow-lg border-muted/60">
                                                    <DropdownMenuItem onClick={() => handleEdit(transaction)} className="rounded-sm cursor-pointer">
                                                        <Edit2 className="size-4 mr-2" /> Edit Details
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => setTransactionToDelete(transaction.id)} className="rounded-sm cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50">
                                                        <Trash2 className="size-4 mr-2" /> Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>

                                        {/* Middle Row: Massive Amount */}
                                        <div className="mb-5">
                                            <p className={`text-3xl font-bold tracking-tight ${isIncome ? "text-green-600" : "text-foreground"}`}>
                                                {isIncome ? "+" : "-"}{transaction.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                <span className="text-sm font-medium text-muted-foreground ml-1">{transaction.currency}</span>
                                            </p>
                                        </div>

                                        {/* Bottom Row: Tags, Notes, Images */}
                                        <div className="mt-auto flex flex-col gap-3">
                                            <div className="flex flex-wrap gap-2 text-xs font-medium text-muted-foreground">
                                                <span className="flex items-center gap-1.5 bg-muted/30 px-2.5 py-1 rounded-md border border-muted/60">
                                                    <Calendar className="size-3.5" /> {transaction.date}
                                                </span>
                                                {transaction.source && (
                                                    <span className="bg-muted/30 px-2.5 py-1 rounded-md border border-muted/60 truncate max-w-[140px]">
                                                        {transaction.source}
                                                    </span>
                                                )}
                                            </div>

                                            {transaction.note && (
                                                <p className="text-sm text-muted-foreground bg-muted/10 p-2.5 rounded-md border border-muted/30 italic">
                                                    &quot;{transaction.note}&quot;
                                                </p>
                                            )}

                                            {transaction.images && transaction.images.length > 0 && (
                                                <div className="flex flex-wrap items-center gap-2 pt-1">
                                                    {transaction.images.map((img) => (
                                                        <button
                                                            key={img.imagePublicId}
                                                            type="button"
                                                            onClick={() => setPreviewImage(img.imageUrl)}
                                                            className="relative size-12 rounded-md overflow-hidden border border-muted/60 hover:ring-2 hover:ring-primary/50 transition-all focus:outline-none bg-muted/20"
                                                            title="View Receipt"
                                                        >
                                                            <Image
                                                                src={img.imageUrl}
                                                                alt="Receipt"
                                                                className="object-cover w-full h-full"
                                                                width={600}
                                                                height={600}
                                                            />
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Form Dialog */}
            <Dialog open={isFormOpen} onOpenChange={(open) => !open && handleCloseForm()}>
                <DialogContent className="sm:max-w-[600px] rounded-lg border-muted/60 shadow-lg max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-xl">
                            {editingTransaction ? "Edit Transaction" : "New Transaction"}
                        </DialogTitle>
                        <DialogDescription>
                            {editingTransaction ? "Update the details of your record." : "Enter the details for this transaction."}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="pt-2">
                        <TransactionForm
                            transaction={editingTransaction}
                            onSuccess={handleCloseForm}
                        />
                    </div>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <DeleteConfirmDialog
                isOpen={!!transactionToDelete}
                onOpenChange={(open) => !open && setTransactionToDelete(null)}
                isLoading={isDeleting}
                title="Delete Transaction?"
                description="This action cannot be undone and will update your account balances."
                onConfirm={() => {
                    if (transactionToDelete) {
                        handleDelete(transactionToDelete);
                    }
                }}
            />

            {/* Image Preview Lightbox Dialog */}
            <Dialog open={!!previewImage} onOpenChange={(open) => !open && setPreviewImage(null)}>
                <DialogContent className="sm:max-w-[800px] rounded-lg border-muted/60 shadow-2xl p-4 bg-background">
                    <DialogHeader className="sr-only">
                        <DialogTitle>View Attachment</DialogTitle>
                    </DialogHeader>
                    <div className="relative flex items-center justify-center w-full min-h-[300px] bg-muted/10 rounded-md overflow-hidden">
                        {previewImage ? (
                            <Image
                                src={previewImage}
                                alt="Transaction Attachment"
                                className="max-w-full max-h-[75vh] object-contain rounded-md"
                                width={600}
                                height={600}
                            />
                        ) : (
                            <Loader2 className="size-8 animate-spin text-muted-foreground" />
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </PageContainer>
    );
}
