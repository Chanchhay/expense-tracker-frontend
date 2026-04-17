"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";

import {
    useDeleteBudgetMutation,
    useGetBudgetsQuery,
    useGetBudgetSummaryQuery,
} from "@/features/budgets/budgets-api";
import type { BudgetResponse } from "@/features/budgets/types";
import { getErrorMessage } from "@/lib/get-error-message";
import BudgetForm from "@/components/forms/budget-form";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/shared/page-container";
import CategorySheet from "@/components/shared/category-sheet";
import DeleteConfirmDialog from "@/components/shared/delete-confirm-dialog";

function getCurrentSummaryMonth() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    return `${year}-${month}`;
}

export default function BudgetsPage() {
    const [editingBudget, setEditingBudget] = useState<BudgetResponse | null>(
        null,
    );
    const [summaryMonth, setSummaryMonth] = useState(getCurrentSummaryMonth());

    const {
        data: budgets,
        isLoading,
        isError,
    } = useGetBudgetsQuery(undefined, {
        refetchOnFocus: true,
        refetchOnReconnect: true,
    });
    const [deleteBudget, { isLoading: isDeleting }] = useDeleteBudgetMutation();

    const {
        data: budgetSummary,
        isLoading: isSummaryLoading,
        isError: isSummaryError,
    } = useGetBudgetSummaryQuery(summaryMonth, {
        refetchOnFocus: true,
        refetchOnReconnect: true,
    });

    const sortedBudgets = useMemo(() => {
        return [...(budgets ?? [])].sort((a, b) => {
            if (a.year !== b.year) return b.year - a.year;
            if (a.month !== b.month) return b.month - a.month;
            return a.categoryName.localeCompare(b.categoryName);
        });
    }, [budgets]);

    const handleDelete = async (id: string) => {
        try {
            await deleteBudget(id).unwrap();
            toast.success("Budget deleted successfully");

            if (editingBudget?.id === id) {
                setEditingBudget(null);
            }
        } catch (error: unknown) {
            toast.error(getErrorMessage(error));
        }
    };

    if (isLoading) {
        return <div>Loading budgets...</div>;
    }

    if (isError) {
        return <div>Failed to load budgets.</div>;
    }

    return (
        <PageContainer title="Budgets" description="Manage your budgets">
            <div className="space-y-6">
                <div className="flex justify-end">
                    <CategorySheet
                        trigger={
                            <Button type="button" variant="outline">
                                Manage Categories
                            </Button>
                        }
                    />
                </div>
                <BudgetForm
                    budget={editingBudget}
                    onSuccess={() => setEditingBudget(null)}
                />

                <div className="space-y-4">
                    <h3 className="text-xl font-semibold">Budget List</h3>

                    {!sortedBudgets.length ? (
                        <p>No budgets found.</p>
                    ) : (
                        <div className="space-y-3">
                            {sortedBudgets.map((budget) => (
                                <div
                                    key={budget.id}
                                    className="border rounded-md p-4 flex items-center justify-between"
                                >
                                    <div>
                                        <p className="font-medium">
                                            {budget.categoryName}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            Month: {budget.month} | Year:{" "}
                                            {budget.year}
                                        </p>
                                        <p className="text-sm">
                                            Amount: {budget.amount}
                                        </p>
                                    </div>

                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            onClick={() =>
                                                setEditingBudget(budget)
                                            }
                                        >
                                            Edit
                                        </Button>
                                        <DeleteConfirmDialog
                                            isLoading={isDeleting}
                                            title="Delete budget?"
                                            description={`This will permanently remove the budget for "${budget.categoryName}".`}
                                            onConfirm={() =>
                                                handleDelete(budget.id)
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

                <div className="space-y-4 border rounded-md p-4">
                    <h3 className="text-xl font-semibold">
                        Monthly Budget Summary
                    </h3>

                    <div className="max-w-xs">
                        <label className="mb-2 block text-sm font-medium">
                            Month
                        </label>
                        <input
                            type="month"
                            value={summaryMonth}
                            onChange={(e) => setSummaryMonth(e.target.value)}
                            className="w-full rounded-md border px-3 py-2"
                        />
                    </div>

                    {isSummaryLoading ? (
                        <p>Loading summary...</p>
                    ) : isSummaryError || !budgetSummary ? (
                        <p>Failed to load summary.</p>
                    ) : (
                        <div className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-3">
                                <div className="border rounded-md p-4">
                                    <p className="font-medium">Total Budget</p>
                                    <p>{budgetSummary.totalBudget}</p>
                                </div>

                                <div className="border rounded-md p-4">
                                    <p className="font-medium">Total Spent</p>
                                    <p>{budgetSummary.totalSpent}</p>
                                </div>

                                <div className="border rounded-md p-4">
                                    <p className="font-medium">
                                        Total Remaining
                                    </p>
                                    <p>{budgetSummary.totalRemaining}</p>
                                </div>
                            </div>

                            {!budgetSummary.items.length ? (
                                <p>No summary items found for this month.</p>
                            ) : (
                                <div className="space-y-3">
                                    {budgetSummary.items.map((item) => (
                                        <div
                                            key={item.budgetId}
                                            className="border rounded-md p-4"
                                        >
                                            <p className="font-medium">
                                                {item.categoryName}
                                            </p>
                                            <p className="text-sm">
                                                Budget: {item.budgetAmount}
                                            </p>
                                            <p className="text-sm">
                                                Spent: {item.spentAmount}
                                            </p>
                                            <p className="text-sm">
                                                Remaining:{" "}
                                                {item.remainingAmount}
                                            </p>
                                            <p className="text-sm">
                                                Used: {item.percentageUsed}%
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </PageContainer>
    );
}
