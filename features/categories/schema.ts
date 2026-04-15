import { z } from "zod";

export const categorySchema = z.object({
    name: z
        .string()
        .min(3, "Category name must be at least 3 characters")
        .max(20, "Category name must not exceed 20 characters")
        .trim(),
    type: z.enum(["INCOME", "EXPENSE"]),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;
