import { z } from "zod";

export const transactionSchema = z.object({
    amount: z.coerce.number().min(0.01, "Amount must be greater than 0"),
    type: z.enum(["INCOME", "EXPENSE"]),
    accountId: z.string().min(1, "Account is required"),
    categoryId: z.coerce.number().min(1, "Category is required"),
    date: z.string().min(1, "Date is required"),
    source: z.string().min(1, "Source is required"),
    note: z.string().optional(),
});

export type TransactionFormInput = z.input<typeof transactionSchema>;
export type TransactionFormValues = z.output<typeof transactionSchema>;
