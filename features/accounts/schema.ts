import { z } from "zod";

export const accountSchema = z.object({
    name: z.string().min(1, "Account name is required"),
    type: z.enum(["CASH", "BANK", "CARD", "EWALLET", "SAVINGS"]),
    currency: z
        .string()
        .length(3, "Currency must be exactly 3 characters")
        .transform((value) => value.toUpperCase()),
    initialBalance: z.coerce
        .number()
        .min(0, "Initial balance must be greater than or equal to 0"),
});

export type AccountFormInput = z.input<typeof accountSchema>;
export type AccountFormValues = z.output<typeof accountSchema>;
