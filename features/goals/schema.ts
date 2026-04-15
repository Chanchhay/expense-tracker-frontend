import { z } from "zod";

export const goalSchema = z.object({
    name: z.string().min(1, "Goal name is required"),
    targetAmount: z
        .string()
        .min(1, "Target amount is required")
        .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
            message: "Target amount must be greater than 0",
        }),
    deadline: z.string().optional(),
});

export type GoalFormValues = z.infer<typeof goalSchema>;

export const goalProgressSchema = z.object({
    currentAmount: z
        .string()
        .min(1, "Current amount is required")
        .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
            message: "Current amount must be at least 0",
        }),
});

export type GoalProgressFormValues = z.infer<typeof goalProgressSchema>;

export const goalStatusSchema = z.object({
    status: z.enum(["ACTIVE", "COMPLETED", "CANCELLED"]),
});

export type GoalStatusFormValues = z.infer<typeof goalStatusSchema>;
