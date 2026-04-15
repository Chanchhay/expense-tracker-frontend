export type DashboardTransaction = {
    id: string;
    amount: number;
    type: "INCOME" | "EXPENSE";
    accountId: string;
    accountName: string;
    categoryId: number;
    categoryName: string;
    currency: string;
    date: string;
    source: string;
    note?: string;
    images?: {
        id: string;
        imageUrl: string;
        imagePublicId: string;
    }[];
};

export type DashboardResponse = {
    totalIncome: number;
    totalExpense: number;
    currentBalance: number;
    recentTransactions: DashboardTransaction[];
};
