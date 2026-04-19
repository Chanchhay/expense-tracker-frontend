"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
    Plus,
    MoreVertical,
    Edit2,
    Trash2,
    Calendar,
    Target,
    Wallet,
    TrendingDown,
    X,
    Loader2,
} from "lucide-react";

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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

function getCurrentSummaryMonth() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    return `${year}-${month}`;
}

export default function BudgetsPage() {
    // UI State
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingBudget, setEditingBudget] = useState<BudgetResponse | null>(null);
    const [budgetToDelete, setBudgetToDelete] = useState<string | null>(null);

    // Filters
    const [summaryMonth, setSummaryMonth] = useState(getCurrentSummaryMonth());

    // Queries
    const { data: budgets, isLoading: isBudgetsLoading } = useGetBudgetsQuery(undefined, {
        refetchOnFocus: true,
        refetchOnReconnect: true,
    });

    const {
        data: budgetSummary,
        isLoading: isSummaryLoading,
        isFetching: isSummaryFetching,
        isError: isSummaryError,
    } = useGetBudgetSummaryQuery(summaryMonth, {
        refetchOnFocus: true,
        refetchOnReconnect: true,
    });

    const [deleteBudget, { isLoading: isDeleting }] = useDeleteBudgetMutation();

    const sortedBudgets = useMemo(() => {
        return [...(budgets ?? [])].sort((a, b) => {
            if (a.year !== b.year) return b.year - a.year;
            if (a.month !== b.month) return b.month - a.month;
            if (a.categoryName !== b.categoryName) return a.categoryName.localeCompare(b.categoryName);
            return a.currency.localeCompare(b.currency);
        });
    }, [budgets]);

    const handleDelete = async (id: string) => {
        try {
            await deleteBudget(id).unwrap();
            toast.success("Budget deleted successfully");
            if (editingBudget?.id === id) {
                setEditingBudget(null);
                setIsFormOpen(false);
            }
            setBudgetToDelete(null);
        } catch (error: unknown) {
            toast.error(getErrorMessage(error));
        }
    };

    const handleEdit = (budget: BudgetResponse) => {
        setEditingBudget(budget);
        setIsFormOpen(true);
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setTimeout(() => setEditingBudget(null), 200);
    };

    return (
        <PageContainer
            title="Budgets"
            description="Set limits and track your spending."
        >
            <div className="space-y-6 pb-8">

                {/* ── Header: month picker + action buttons ───────────────── */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    {/* Month picker */}
                    <div className="inline-flex items-center self-start rounded-md border border-muted/60 bg-background pl-3 pr-2 shadow-sm focus-within:ring-2 focus-within:ring-primary/20">
                        <Calendar className="size-4 text-muted-foreground mr-2 shrink-0" />
                        <input
                            type="month"
                            value={summaryMonth}
                            onClick={(e) => {
                                try { e.currentTarget.showPicker(); } catch {}
                            }}
                            onChange={(e) => setSummaryMonth(e.target.value)}
                            className="bg-transparent py-2 text-sm font-medium outline-none cursor-pointer [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                        />
                        {summaryMonth && (
                            <button
                                onClick={() => setSummaryMonth("")}
                                className="p-1 ml-1 rounded-md text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors"
                            >
                                <X className="size-4" />
                            </button>
                        )}
                    </div>

                    {/* Action buttons — full-width on mobile, auto on sm+ */}
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <CategorySheet
                            trigger={
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="rounded-md flex-1 sm:flex-none"
                                >
                                    Categories
                                </Button>
                            }
                        />
                        <Button
                            onClick={() => setIsFormOpen(true)}
                            className="rounded-md shadow-sm flex-1 sm:flex-none"
                        >
                            <Plus className="mr-2 size-4" /> Add Budget
                        </Button>
                    </div>
                </div>

                {/* ── Two-column layout (stacks on < lg) ──────────────────── */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                    {/* LEFT — Analytics (7 cols on lg+) */}
                    <div className="lg:col-span-7 space-y-6 min-w-0">
                        {isSummaryLoading || isSummaryFetching ? (
                            <div className="flex flex-col items-center justify-center p-12 text-muted-foreground border rounded-lg bg-card shadow-sm">
                                <Loader2 className="size-8 animate-spin text-primary mb-4" />
                                <p className="font-medium">Calculating budgets...</p>
                            </div>
                        ) : isSummaryError || !budgetSummary ? (
                            <div className="flex flex-col items-center justify-center p-12 border rounded-lg bg-card shadow-sm">
                                <p className="font-medium text-foreground">Failed to load summary</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {/* Summary stat cards */}
                                {!budgetSummary.totalsByCurrency.length ? (
                                    <Card className="rounded-lg shadow-sm border-muted/60 bg-muted/10">
                                        <CardContent className="flex items-center justify-center p-8 text-muted-foreground font-medium">
                                            No budget data for this month.
                                        </CardContent>
                                    </Card>
                                ) : (
                                    budgetSummary.totalsByCurrency.map((total) => (
                                        /*
                                         * FIX: was sm:grid-cols-3 — that kicks in at ~640px which is
                                         * too narrow for 3 equal cards. Now we use a single column on
                                         * mobile, 3 cols only when there's enough room (xl inside the
                                         * lg:col-span-7 container, or min-[520px] as a reasonable
                                         * breakpoint for the standalone column width).
                                         */
                                        <div
                                            key={total.currency}
                                            className="grid grid-cols-1 min-[520px]:grid-cols-3 gap-3"
                                        >
                                            <Card className="rounded-lg shadow-sm border-muted/60">
                                                <CardContent className="p-4 sm:p-5">
                                                    <div className="flex items-center gap-2 text-muted-foreground mb-2">
                                                        <Target className="size-4 shrink-0 text-blue-500" />
                                                        <span className="font-medium text-xs uppercase tracking-wider truncate">Total Budget</span>
                                                    </div>
                                                    <p className="text-lg sm:text-xl font-bold tracking-tight truncate">
                                                        {total.currency} {total.totalBudget.toLocaleString()}
                                                    </p>
                                                </CardContent>
                                            </Card>

                                            <Card className="rounded-lg shadow-sm border-muted/60">
                                                <CardContent className="p-4 sm:p-5">
                                                    <div className="flex items-center gap-2 text-muted-foreground mb-2">
                                                        <TrendingDown className="size-4 shrink-0 text-red-500" />
                                                        <span className="font-medium text-xs uppercase tracking-wider truncate">Total Spent</span>
                                                    </div>
                                                    <p className="text-lg sm:text-xl font-bold tracking-tight truncate">
                                                        {total.currency} {total.totalSpent.toLocaleString()}
                                                    </p>
                                                </CardContent>
                                            </Card>

                                            <Card className="rounded-lg shadow-sm border-muted/60">
                                                <CardContent className="p-4 sm:p-5">
                                                    <div className="flex items-center gap-2 text-muted-foreground mb-2">
                                                        <Wallet className="size-4 shrink-0 text-primary" />
                                                        <span className="font-medium text-xs uppercase tracking-wider truncate">
                                                            {total.totalRemaining < 0 ? "Exceeded" : "Remaining"}
                                                        </span>
                                                    </div>
                                                    <p className={`text-lg sm:text-xl font-bold tracking-tight truncate ${total.totalRemaining < 0 ? "text-red-500" : "text-primary"}`}>
                                                        {total.currency} {total.totalRemaining.toLocaleString()}
                                                    </p>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    ))
                                )}

                                {/* Per-category progress bars */}
                                {budgetSummary.items.length > 0 && (
                                    <Card className="rounded-lg shadow-sm border-muted/60">
                                        <CardHeader className="bg-muted/20 border-b border-muted/60 py-4">
                                            <CardTitle className="text-base font-semibold">
                                                Spending by Category
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-4 sm:p-6 space-y-5">
                                            {budgetSummary.items.map((item) => {
                                                const pct = Math.min(Math.max(item.percentageUsed, 0), 100);
                                                const isOverBudget = item.percentageUsed >= 100;
                                                const isWarning = item.percentageUsed >= 85 && !isOverBudget;
                                                const barColor = isOverBudget ? "bg-red-500" : isWarning ? "bg-amber-500" : "bg-primary";

                                                return (
                                                    <div key={item.budgetId} className="space-y-1.5">
                                                        <div className="flex items-center justify-between gap-2 text-sm min-w-0">
                                                            <span className="font-semibold text-foreground truncate shrink">
                                                                {item.categoryName}
                                                            </span>
                                                            <span className="font-medium text-muted-foreground whitespace-nowrap shrink-0">
                                                                <span className={isOverBudget ? "text-red-500 font-bold" : "text-foreground"}>
                                                                    {item.spentAmount.toLocaleString()}
                                                                </span>
                                                                {" / "}{item.budgetAmount.toLocaleString()} {item.currency}
                                                            </span>
                                                        </div>
                                                        <div className="h-2.5 w-full bg-muted/60 rounded-full overflow-hidden">
                                                            <div
                                                                className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                                                                style={{ width: `${pct}%` }}
                                                            />
                                                        </div>
                                                        <p className="text-xs font-medium text-muted-foreground text-right">
                                                            {item.percentageUsed}% used
                                                            {item.remainingAmount > 0 && ` (${item.remainingAmount.toLocaleString()} remaining)`}
                                                        </p>
                                                    </div>
                                                );
                                            })}
                                        </CardContent>
                                    </Card>
                                )}
                            </div>
                        )}
                    </div>

                    {/* RIGHT — Budget list (5 cols on lg+) */}
                    {/*
                     * FIX: added max-h + overflow-y-auto so the sticky card never
                     * overflows the viewport on short screens. On mobile it just
                     * stacks naturally without sticky behaviour.
                     */}
                    <div className="lg:col-span-5 lg:sticky lg:top-24 min-w-0">
                        <Card className="rounded-lg shadow-sm border-muted/60 overflow-hidden">
                            <CardHeader className="bg-muted/20 border-b border-muted/60 py-4">
                                <CardTitle className="text-base font-semibold flex items-center justify-between gap-2 min-w-0">
                                    <span className="truncate">All Configured Budgets</span>
                                    <span className="text-xs font-medium text-muted-foreground px-2 py-1 bg-background rounded border border-muted/60 shrink-0">
                                        {sortedBudgets?.length || 0} Total
                                    </span>
                                </CardTitle>
                            </CardHeader>

                            {/* Scrollable list — capped so it doesn't push off-screen when sticky */}
                            <CardContent className="p-0 lg:max-h-[calc(100vh-14rem)] lg:overflow-y-auto">
                                {isBudgetsLoading ? (
                                    <div className="p-8 text-center text-muted-foreground">
                                        Loading configurations...
                                    </div>
                                ) : !sortedBudgets.length ? (
                                    <div className="p-8 text-center text-muted-foreground font-medium">
                                        No budgets configured yet.
                                    </div>
                                ) : (
                                    <div className="divide-y divide-muted/60">
                                        {sortedBudgets.map((budget) => (
                                            <div
                                                key={budget.id}
                                                className="flex items-center justify-between gap-3 p-4 hover:bg-muted/10 transition-colors group min-w-0"
                                            >
                                                {/* Category + period — truncates gracefully */}
                                                <div className="min-w-0 flex-1">
                                                    <p className="font-semibold text-foreground leading-none truncate">
                                                        {budget.categoryName}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground font-medium mt-1.5">
                                                        {budget.month}/{budget.year}
                                                    </p>
                                                </div>

                                                {/* Amount + actions — never shrinks below its content */}
                                                <div className="flex items-center gap-2 shrink-0">
                                                    <p className="font-bold text-foreground text-sm tabular-nums">
                                                        {budget.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                        <span className="text-[10px] font-medium text-muted-foreground ml-1 uppercase">
                                                            {budget.currency}
                                                        </span>
                                                    </p>

                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 rounded-md opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity text-muted-foreground hover:text-foreground"
                                                            >
                                                                <MoreVertical className="size-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="rounded-md shadow-lg border-muted/60">
                                                            <DropdownMenuItem
                                                                onClick={() => handleEdit(budget)}
                                                                className="rounded-sm cursor-pointer"
                                                            >
                                                                <Edit2 className="size-4 mr-2" /> Edit
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() => setBudgetToDelete(budget.id)}
                                                                className="rounded-sm cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                                                            >
                                                                <Trash2 className="size-4 mr-2" /> Delete
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Form Dialog */}
            <Dialog open={isFormOpen} onOpenChange={(open) => !open && handleCloseForm()}>
                <DialogContent className="sm:max-w-[500px] rounded-lg border-muted/60 shadow-lg">
                    <DialogHeader>
                        <DialogTitle className="text-xl">
                            {editingBudget ? "Edit Budget" : "New Budget"}
                        </DialogTitle>
                        <DialogDescription>
                            {editingBudget ? "Update your budget limit." : "Set a spending limit for a category."}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="pt-2">
                        <BudgetForm budget={editingBudget} onSuccess={handleCloseForm} />
                    </div>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <DeleteConfirmDialog
                isOpen={!!budgetToDelete}
                onOpenChange={(open) => !open && setBudgetToDelete(null)}
                isLoading={isDeleting}
                title="Delete Budget?"
                description="This will permanently remove this budget configuration."
                onConfirm={() => { if (budgetToDelete) handleDelete(budgetToDelete); }}
            />
        </PageContainer>
    );
}
