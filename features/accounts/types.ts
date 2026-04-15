export type AccountType = "CASH" | "BANK" | "CARD" | "EWALLET" | "SAVINGS";

export type AccountResponse = {
    id: string;
    name: string;
    type: AccountType;
    currency: string;
    initialBalance: number;
    currentBalance: number;
    createdAt: string;
};

export type CreateAccountRequest = {
    name: string;
    type: AccountType;
    currency: string;
    initialBalance: number;
};

export type UpdateAccountRequest = {
    name: string;
    type: AccountType;
    currency: string;
    initialBalance: number;
};
