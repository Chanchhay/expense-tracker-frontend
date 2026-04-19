export type BudgetResponse = {
    id: string;
    categoryId: number;
    categoryName: string;
    amount: number;
    currency: string;
    month: number;
    year: number;
    createdAt: string;
};

export type CreateBudgetRequest = {
    categoryId: number;
    amount: number;
    currency: string;
    month: number;
    year: number;
};

export type UpdateBudgetRequest = {
    categoryId: number;
    amount: number;
    currency: string;
    month: number;
    year: number;
};

export type BudgetSummaryItemResponse = {
    budgetId: string;
    categoryId: number;
    categoryName: string;
    budgetAmount: number;
    currency: string;
    spentAmount: number;
    remainingAmount: number;
    percentageUsed: number;
};

export type BudgetCurrencyTotalResponse = {
    currency: string;
    totalBudget: number;
    totalSpent: number;
    totalRemaining: number;
};

export type BudgetSummaryResponse = {
    month: string;
    totalsByCurrency: BudgetCurrencyTotalResponse[];
    items: BudgetSummaryItemResponse[];
};
