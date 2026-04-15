export type MonthlySummaryResponse = {
    month: string;
    totalIncome: number;
    totalExpense: number;
    netBalance: number;
};

export type CategoryBreakdownItemResponse = {
    categoryId: number;
    categoryName: string;
    amount: number;
    percentage: number;
};

export type CategoryBreakdownResponse = {
    month: string;
    totalExpense: number;
    items: CategoryBreakdownItemResponse[];
};

export type CashFlowItemResponse = {
    period: string;
    income: number;
    expense: number;
    net: number;
};

export type CashFlowResponse = {
    from: string;
    to: string;
    groupBy: string;
    items: CashFlowItemResponse[];
};

export type TopExpenseItemResponse = {
    transactionId: string;
    accountId: string;
    accountName: string;
    categoryId: number;
    categoryName: string;
    amount: number;
    currency: string;
    date: string;
    note?: string;
};

export type TopExpensesResponse = {
    month: string;
    limit: number;
    items: TopExpenseItemResponse[];
};

export type AccountSummaryItemResponse = {
    accountId: string;
    accountName: string;
    accountType: "CASH" | "BANK" | "CARD" | "EWALLET" | "SAVINGS";
    currency: string;
    initialBalance: number;
    currentBalance: number;
};

export type AccountSummaryResponse = {
    totalCurrentBalance: number;
    items: AccountSummaryItemResponse[];
};
