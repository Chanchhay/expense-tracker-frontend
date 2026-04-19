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

export const supportedCurrencies = [
    { code: "KHR", label: "Cambodian Riel (KHR)" },
    { code: "USD", label: "US Dollar (USD)" },
    { code: "EUR", label: "Euro (EUR)" },
    { code: "GBP", label: "British Pound (GBP)" },
    { code: "JPY", label: "Japanese Yen (JPY)" },
    { code: "CNY", label: "Chinese Yuan (CNY)" },
    { code: "SGD", label: "Singapore Dollar (SGD)" },
    { code: "MYR", label: "Malaysian Ringgit (MYR)" },
    { code: "KRW", label: "South Korean Won (KRW)" },
    { code: "AUD", label: "Australian Dollar (AUD)" },
    { code: "CAD", label: "Canadian Dollar (CAD)" },
    { code: "VND", label: "Vietnamese Dong (VND)" },
] as const;
