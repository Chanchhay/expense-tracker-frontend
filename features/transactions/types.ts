export type TransactionType = "INCOME" | "EXPENSE";

export type TransactionImageRequest = {
    imageUrl: string;
    imagePublicId: string;
};

export type TransactionImageResponse = {
    id: string;
    imageUrl: string;
    imagePublicId: string;
};

export type CreateTransactionRequest = {
    amount: number;
    type: TransactionType;
    accountId: string;
    categoryId: number;
    date: string;
    source: string;
    note?: string;
    images?: TransactionImageRequest[];
};

export type UpdateTransactionRequest = {
    amount: number;
    type: TransactionType;
    accountId: string;
    categoryId: number;
    date: string;
    source: string;
    note?: string;
    images?: TransactionImageRequest[];
};

export type TransactionResponse = {
    id: string;
    amount: number;
    type: TransactionType;
    accountId: string;
    accountName: string;
    categoryId: number;
    categoryName: string;
    currency: string;
    date: string;
    source: string;
    note?: string;
    images?: TransactionImageResponse[];
};
