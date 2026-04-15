"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";

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

export default function TransactionsPage() {
    const [editingTransaction, setEditingTransaction] =
        useState<TransactionResponse | null>(null);

    const [typeFilter, setTypeFilter] = useState<"" | TransactionType>("");
    const [monthFilter, setMonthFilter] = useState("");

    const queryParams = useMemo(() => {
        return {
            ...(typeFilter ? { type: typeFilter } : {}),
            ...(monthFilter ? { month: monthFilter } : {}),
        };
    }, [typeFilter, monthFilter]);

    const {
        data: transactions,
        isLoading,
        isError,
    } = useGetTransactionsQuery(queryParams);

    const [deleteTransaction, { isLoading: isDeleting }] =
        useDeleteTransactionMutation();

    const handleDelete = async (id: string) => {
        try {
            await deleteTransaction(id).unwrap();
            toast.success("Transaction deleted successfully");

            if (editingTransaction?.id === id) {
                setEditingTransaction(null);
            }
        } catch (error: unknown) {
            toast.error(getErrorMessage(error));
        }
    };

    if (isLoading) {
        return <div>Loading transactions...</div>;
    }

    if (isError) {
        return <div>Failed to load transactions.</div>;
    }

    return (
        <PageContainer
            title="Transactions"
            description="Manage ur Transactions"
        >
            <div className="space-y-6">
                <div className="flex justify-end">
                    <CategorySheet
                        trigger={
                            <Button type="button" variant="outline">
                                Manage Categories
                            </Button>
                        }
                    />{" "}
                </div>
                <TransactionForm
                    transaction={editingTransaction}
                    onSuccess={() => setEditingTransaction(null)}
                />

                <div className="space-y-4 border rounded-md p-4">
                    <h3 className="text-xl font-semibold">Filters</h3>

                    <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-12 md:col-span-6">
                            <label className="mb-2 block text-sm font-medium">
                                Type
                            </label>
                            <select
                                value={typeFilter}
                                onChange={(e) =>
                                    setTypeFilter(
                                        e.target.value as "" | TransactionType,
                                    )
                                }
                                className="w-full rounded-md border px-3 py-2"
                            >
                                <option value="">All</option>
                                <option value="INCOME">INCOME</option>
                                <option value="EXPENSE">EXPENSE</option>
                            </select>
                        </div>

                        <div className="col-span-12 md:col-span-6">
                            <label className="mb-2 block text-sm font-medium">
                                Month
                            </label>
                            <input
                                type="month"
                                value={monthFilter}
                                onChange={(e) => setMonthFilter(e.target.value)}
                                className="w-full rounded-md border px-3 py-2"
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-xl font-semibold">Transaction List</h3>

                    {!transactions || transactions.length === 0 ? (
                        <p>No transactions found.</p>
                    ) : (
                        <div className="space-y-3">
                            {transactions.map((transaction) => (
                                <div
                                    key={transaction.id}
                                    className="border rounded-md p-4 flex items-center justify-between"
                                >
                                    <div>
                                        <p className="font-medium">
                                            {transaction.categoryName} -{" "}
                                            {transaction.amount}{" "}
                                            {transaction.currency}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {transaction.type} |{" "}
                                            {transaction.accountName} |{" "}
                                            {transaction.date}
                                        </p>
                                        <p className="text-sm">
                                            Source: {transaction.source}
                                        </p>
                                        {transaction.note && (
                                            <p className="text-sm">
                                                Note: {transaction.note}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            onClick={() =>
                                                setEditingTransaction(
                                                    transaction,
                                                )
                                            }
                                        >
                                            Edit
                                        </Button>
                                        <DeleteConfirmDialog
                                            isLoading={isDeleting}
                                            title="Delete transaction?"
                                            description="This will permanently remove this transaction."
                                            onConfirm={() =>
                                                handleDelete(transaction.id)
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
