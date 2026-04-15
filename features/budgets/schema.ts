import { z } from "zod";

export const budgetSchema = z.object({
    categoryId: z.string().min(1, "Category is required"),
    amount: z
        .string()
        .min(1, "Amount is required")
        .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
            message: "Amount must be greater than 0",
        }),
    month: z
        .string()
        .min(1, "Month is required")
        .refine(
            (val) => {
                const num = Number(val);
                return !isNaN(num) && num >= 1 && num <= 12;
            },
            {
                message: "Month must be between 1 and 12",
            },
        ),
    year: z
        .string()
        .min(1, "Year is required")
        .refine(
            (val) => {
                const num = Number(val);
                return !isNaN(num) && num >= 2000 && num <= 3000;
            },
            {
                message: "Year must be between 2000 and 3000",
            },
        ),
});

export type BudgetFormValues = z.infer<typeof budgetSchema>;
