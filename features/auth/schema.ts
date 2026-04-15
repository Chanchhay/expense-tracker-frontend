import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().min(1, "Email is required").email("Invalid email"),
    password: z.string().min(1, "Password is required"),
});

export const registerSchema = z
    .object({
        name: z
            .string()
            .min(5, "Name must be at least 5 characters")
            .max(30, "Name must not exceed 30 characters"),
        email: z.string().min(1, "Email is required").email("Invalid email"),
        password: z
            .string()
            .min(8, "Password must be at least 8 characters")
            .max(50, "Password must not exceed 50 characters"),
        confirmPassword: z.string().min(1, "Confirm password is required"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
