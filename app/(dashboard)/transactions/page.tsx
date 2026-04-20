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
    const [editingTransaction, setEditingTransaction] =
        useState<TransactionResponse | null>(null);
    const [transactionToDelete, setTransactionToDelete] = useState<
        string | null
    >(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const [typeFilter, setTypeFilter] = useState<"" | TransactionType>("");
    const [monthFilter, setMonthFilter] = useState(getCurrentMonthValue());

    const queryParams = useMemo(
        () => ({
            ...(typeFilter ? { type: typeFilter } : {}),
            ...(monthFilter ? { month: monthFilter } : {}),
        }),
        [typeFilter, monthFilter],
    );

    const {
        data: transactions,
        isLoading,
        isFetching,
        isError,
    } = useGetTransactionsQuery(queryParams, {
        refetchOnFocus: true,
        refetchOnReconnect: true,
    });

    const [deleteTransaction, { isLoading: isDeleting }] =
        useDeleteTransactionMutation();

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
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 w-full">
                    <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                        <div className="flex items-center rounded-md border border-muted/60 bg-background px-3 shadow-sm focus-within:ring-2 focus-within:ring-primary/20 min-w-0">
                            <Filter className="size-4 text-muted-foreground mr-2 shrink-0" />
                            <select
                                value={typeFilter}
                                onChange={(e) =>
                                    setTypeFilter(
                                        e.target.value as "" | TransactionType,
                                    )
                                }
                                className="appearance-none bg-transparent py-2 text-sm font-medium outline-none cursor-pointer w-full min-w-0"
                            >
                                <option value="">All Types</option>
                                <option value="INCOME">Income</option>
                                <option value="EXPENSE">Expense</option>
                            </select>
                        </div>

                        <div className="flex items-center rounded-md border border-muted/60 bg-background pl-3 pr-2 shadow-sm focus-within:ring-2 focus-within:ring-primary/20 min-w-0">
                            <Calendar className="size-4 text-muted-foreground mr-2 shrink-0" />
                            <input
                                type="month"
                                value={monthFilter}
                                onClick={(e) => {
                                    try {
                                        e.currentTarget.showPicker();
                                    } catch {}
                                }}
                                onChange={(e) => setMonthFilter(e.target.value)}
                                className="bg-transparent py-2 text-sm font-medium outline-none cursor-pointer flex-1 min-w-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                            />
                            {monthFilter && (
                                <button
                                    onClick={() => setMonthFilter("")}
                                    className="p-1 ml-1 shrink-0 rounded-md text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors"
                                    title="Clear month filter"
                                >
                                    <X className="size-4" />
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                        <CategorySheet
                            trigger={
                                <Button
                                    variant="outline"
                                    className="rounded-md w-full sm:w-auto"
                                >
                                    Categories
                                </Button>
                            }
                        />
                        <Button
                            onClick={() => setIsFormOpen(true)}
                            className="rounded-md shadow-sm w-full sm:w-auto"
                        >
                            <Plus className="mr-2 size-4 shrink-0" />
                            Add Record
                        </Button>
                    </div>
                </div>

                {/* Status bar */}
                <div className="flex items-center justify-between text-sm font-medium text-muted-foreground">
                    <span>{transactions?.length || 0} Records Found</span>
                    {(isLoading || isFetching) && (
                        <span className="flex items-center text-primary">
                            <Loader2 className="size-4 animate-spin mr-2" />{" "}
                            Syncing...
                        </span>
                    )}
                </div>

                {/* Transaction grid */}
                {isError ? (
                    <div className="flex flex-col items-center justify-center p-12 border border-muted/60 rounded-lg bg-card shadow-sm">
                        <div className="size-12 rounded-full bg-red-50 flex items-center justify-center mb-4">
                            <X className="size-6 text-red-500" />
                        </div>
                        <p className="font-medium text-foreground">
                            Failed to load transactions
                        </p>
                        <p className="text-sm text-muted-foreground mt-1 text-center">
                            Please try refreshing the page.
                        </p>
                    </div>
                ) : !transactions || transactions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-12 border border-dashed border-muted/60 rounded-lg bg-transparent text-center">
                        <p className="font-medium text-foreground">
                            No transactions logged yet.
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                            Adjust your filters or click &quot;Add Record&quot;
                            to start.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 w-full">
                        {transactions.map((transaction) => {
                            const isIncome = transaction.type === "INCOME";

                            return (
                                <Card
                                    key={transaction.id}
                                    className="rounded-lg shadow-sm border-muted/60 transition-all hover:shadow-md flex flex-col group overflow-hidden"
                                >
                                    <CardContent className="p-5 flex flex-col h-full min-w-0">
                                        {/* Top: icon + category + menu */}
                                        <div className="flex items-start justify-between mb-4 gap-2 min-w-0">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div
                                                    className={`flex items-center justify-center size-10 rounded-md shrink-0 ${isIncome ? "bg-green-100 text-green-600 border border-green-200" : "bg-red-50 text-red-600 border border-red-100"}`}
                                                >
                                                    {isIncome ? (
                                                        <ArrowUpRight className="size-5" />
                                                    ) : (
                                                        <ArrowDownRight className="size-5" />
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-semibold text-foreground leading-tight truncate">
                                                        {
                                                            transaction.categoryName
                                                        }
                                                    </p>
                                                    <p className="text-xs text-muted-foreground font-medium mt-0.5 truncate">
                                                        {
                                                            transaction.accountName
                                                        }
                                                    </p>
                                                </div>
                                            </div>

                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 rounded-md shrink-0 -mr-2 text-muted-foreground hover:text-foreground"
                                                    >
                                                        <MoreVertical className="size-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent
                                                    align="end"
                                                    className="rounded-md shadow-lg border-muted/60"
                                                >
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            handleEdit(
                                                                transaction,
                                                            )
                                                        }
                                                        className="rounded-sm cursor-pointer"
                                                    >
                                                        <Edit2 className="size-4 mr-2" />{" "}
                                                        Edit Details
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            setTransactionToDelete(
                                                                transaction.id,
                                                            )
                                                        }
                                                        className="rounded-sm cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                                                    >
                                                        <Trash2 className="size-4 mr-2" />{" "}
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>

                                        {/* Amount */}
                                        {/*
                                         * FIX: switched from text-3xl to text-2xl sm:text-3xl.
                                         * At the sm:grid-cols-2 breakpoint cards are roughly
                                         * 300px wide — text-3xl (30px) with a long number and
                                         * currency code overflows. text-2xl is safe at that
                                         * width; text-3xl is restored at xl where cards are wider.
                                         */}
                                        <div className="mb-5 min-w-0">
                                            <p
                                                className={`text-2xl xl:text-3xl font-bold tracking-tight break-all ${isIncome ? "text-green-600" : "text-foreground"}`}
                                            >
                                                {isIncome ? "+" : "-"}
                                                {transaction.amount.toLocaleString(
                                                    undefined,
                                                    {
                                                        minimumFractionDigits: 2,
                                                    },
                                                )}
                                                <span className="text-sm font-medium text-muted-foreground ml-1 break-normal">
                                                    {transaction.currency}
                                                </span>
                                            </p>
                                        </div>

                                        {/* Footer: tags, notes, images */}
                                        <div className="mt-auto flex flex-col gap-3 min-w-0">
                                            <div className="flex flex-wrap gap-2 text-xs font-medium text-muted-foreground">
                                                <span className="flex items-center gap-1.5 bg-muted/30 px-2.5 py-1 rounded-md border border-muted/60 whitespace-nowrap">
                                                    <Calendar className="size-3.5 shrink-0" />
                                                    {transaction.date}
                                                </span>
                                                {transaction.source && (
                                                    /*
                                                     * FIX: added max-w-[160px] + truncate so a very
                                                     * long source string doesn't push the tag row
                                                     * wider than the card.
                                                     */
                                                    <span className="bg-muted/30 px-2.5 py-1 rounded-md border border-muted/60 truncate max-w-[160px]">
                                                        {transaction.source}
                                                    </span>
                                                )}
                                            </div>

                                            {transaction.note && (
                                                <p className="text-sm text-muted-foreground bg-muted/10 p-2.5 rounded-md border border-muted/30 italic break-words line-clamp-3">
                                                    &quot;{transaction.note}
                                                    &quot;
                                                </p>
                                            )}

                                            {transaction.images &&
                                                transaction.images.length >
                                                    0 && (
                                                    <div className="flex flex-wrap items-center gap-2 pt-1">
                                                        {[
                                                            ...new Map(
                                                                transaction.images.map(
                                                                    (img) => [
                                                                        img.imagePublicId,
                                                                        img,
                                                                    ],
                                                                ),
                                                            ).values(),
                                                        ].map((img, i) => (
                                                            <button
                                                                key={
                                                                    img.imagePublicId ??
                                                                    i
                                                                }
                                                                type="button"
                                                                onClick={() =>
                                                                    setPreviewImage(
                                                                        img.imageUrl,
                                                                    )
                                                                }
                                                                className="relative size-12 rounded-md overflow-hidden border border-muted/60 hover:ring-2 hover:ring-primary/50 transition-all focus:outline-none bg-muted/20 shrink-0"
                                                                title="View Receipt"
                                                            >
                                                                <Image
                                                                    src={
                                                                        img.imageUrl
                                                                    }
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

            <Dialog
                open={isFormOpen}
                onOpenChange={(open) => !open && handleCloseForm()}
            >
                <DialogContent className="w-[95vw] sm:w-full sm:max-w-[600px] rounded-lg border-muted/60 shadow-lg max-h-[90dvh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-xl">
                            {editingTransaction
                                ? "Edit Transaction"
                                : "New Transaction"}
                        </DialogTitle>
                        <DialogDescription>
                            {editingTransaction
                                ? "Update the details of your record."
                                : "Enter the details for this transaction."}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="pt-2 pb-2">
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
                    if (transactionToDelete) handleDelete(transactionToDelete);
                }}
            />

            {/* Image preview lightbox */}
            {/*
             * FIX: image was fixed at width/height 600 which caused it to
             * overflow on mobile. Now we let the image fill its container
             * with object-contain and remove the fixed dimensions in favour
             * of fill + a sized parent, which is the correct Next.js pattern
             * for unknown-size remote images.
             */}
            <Dialog
                open={!!previewImage}
                onOpenChange={(open) => !open && setPreviewImage(null)}
            >
                <DialogContent className="w-[95vw] sm:w-full sm:max-w-[800px] rounded-lg border-muted/60 shadow-2xl p-4 bg-background">
                    <DialogHeader className="sr-only">
                        <DialogTitle>View Attachment</DialogTitle>
                    </DialogHeader>
                    <div className="relative w-full min-h-[240px] max-h-[75dvh] bg-muted/10 rounded-md overflow-hidden flex items-center justify-center">
                        {previewImage ? (
                            <Image
                                src={previewImage}
                                alt="Transaction Attachment"
                                fill
                                className="object-contain"
                                sizes="(max-width: 640px) 95vw, 800px"
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
