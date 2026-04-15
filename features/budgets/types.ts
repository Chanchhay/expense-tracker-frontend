export type BudgetResponse = {
    id: string;
    categoryId: number;
    categoryName: string;
    amount: number;
    month: number;
    year: number;
    createdAt: string;
};

export type CreateBudgetRequest = {
    categoryId: number;
    amount: number;
    month: number;
    year: number;
};

export type UpdateBudgetRequest = {
    categoryId: number;
    amount: number;
    month: number;
    year: number;
};

export type BudgetSummaryItemResponse = {
    budgetId: string;
    categoryId: number;
    categoryName: string;
    budgetAmount: number;
    spentAmount: number;
    remainingAmount: number;
    percentageUsed: number;
};

export type BudgetSummaryResponse = {
    month: string;
    totalBudget: number;
    totalSpent: number;
    totalRemaining: number;
    items: BudgetSummaryItemResponse[];
};
