"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import Link from "next/link";
import { Loader2, Eye, EyeOff } from "lucide-react";

import { useRegisterMutation } from "@/features/auth/auth-api";
import { RegisterFormValues, registerSchema } from "@/features/auth/schema";
import { getErrorMessage } from "@/lib/get-error-message";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Field,
    FieldError,
    FieldLabel,
    FieldSeparator,
} from "@/components/ui/field";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export default function RegisterForm() {
    const router = useRouter();
    const [registerUser, { isLoading }] = useRegisterMutation();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const form = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    const onSubmit = async (values: RegisterFormValues) => {
        try {
            await registerUser(values).unwrap();
            toast.success("Registration successful! Please sign in.");
            router.push("/login");
        } catch (error: unknown) {
            toast.error(getErrorMessage(error));
        }
    };

    const handleSocialAuth = (provider: "google" | "facebook") => {
        window.location.href = `/social-login/${provider}`;
    };

    return (
        <Card className="w-full rounded-lg shadow-lg border-muted/60">
            <CardHeader className="text-center space-y-2 pb-6">
                <CardTitle className="text-2xl font-bold tracking-tight">
                    Create an account
                </CardTitle>
                <CardDescription className="text-muted-foreground font-medium">
                    Sign up to start tracking your expenses
                </CardDescription>
            </CardHeader>

            <CardContent>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                >
                    <Controller
                        control={form.control}
                        name="name"
                        render={({ field, fieldState }) => (
                            <Field
                                className="flex flex-col gap-1.5"
                                data-invalid={fieldState.invalid}
                            >
                                <FieldLabel className="text-sm font-semibold">
                                    Full Name
                                </FieldLabel>
                                <Input
                                    type="text"
                                    placeholder="John Doe"
                                    className="rounded-md border-muted/60 bg-background shadow-sm h-11"
                                    {...field}
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />

                    <Controller
                        control={form.control}
                        name="email"
                        render={({ field, fieldState }) => (
                            <Field
                                className="flex flex-col gap-1.5"
                                data-invalid={fieldState.invalid}
                            >
                                <FieldLabel className="text-sm font-semibold">
                                    Email
                                </FieldLabel>
                                <Input
                                    type="email"
                                    placeholder="name@example.com"
                                    className="rounded-md border-muted/60 bg-background shadow-sm h-11"
                                    {...field}
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />

                    <Controller
                        control={form.control}
                        name="password"
                        render={({ field, fieldState }) => (
                            <Field
                                className="flex flex-col gap-1.5"
                                data-invalid={fieldState.invalid}
                            >
                                <FieldLabel className="text-sm font-semibold">
                                    Password
                                </FieldLabel>
                                <div className="relative">
                                    <Input
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        placeholder="Create a password"
                                        className="rounded-md border-muted/60 bg-background shadow-sm h-11 pr-10"
                                        {...field}
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none transition-colors"
                                        aria-label={
                                            showPassword
                                                ? "Hide password"
                                                : "Show password"
                                        }
                                    >
                                        {showPassword ? (
                                            <EyeOff className="size-4" />
                                        ) : (
                                            <Eye className="size-4" />
                                        )}
                                    </button>
                                </div>
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />

                    <Controller
                        control={form.control}
                        name="confirmPassword"
                        render={({ field, fieldState }) => (
                            <Field
                                className="flex flex-col gap-1.5"
                                data-invalid={fieldState.invalid}
                            >
                                <FieldLabel className="text-sm font-semibold">
                                    Confirm Password
                                </FieldLabel>
                                <div className="relative">
                                    <Input
                                        type={
                                            showConfirmPassword
                                                ? "text"
                                                : "password"
                                        }
                                        placeholder="Confirm your password"
                                        className="rounded-md border-muted/60 bg-background shadow-sm h-11 pr-10"
                                        {...field}
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowConfirmPassword(
                                                !showConfirmPassword,
                                            )
                                        }
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none transition-colors"
                                        aria-label={
                                            showConfirmPassword
                                                ? "Hide password"
                                                : "Show password"
                                        }
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="size-4" />
                                        ) : (
                                            <Eye className="size-4" />
                                        )}
                                    </button>
                                </div>
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />

                    <Button
                        type="submit"
                        className="w-full h-11 rounded-md font-semibold shadow-sm mt-2"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <Loader2 className="size-5 animate-spin" />
                        ) : (
                            "Register"
                        )}
                    </Button>
                </form>

                <div className="mt-6">
                    <FieldSeparator className="text-xs text-muted-foreground font-medium">
                        OR CONTINUE WITH
                    </FieldSeparator>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-6">
                    <Button
                        onClick={() => handleSocialAuth("google")}
                        disabled={isLoading}
                        variant="outline"
                        type="button"
                        className="rounded-md h-11 font-medium bg-background"
                    >
                        <svg className="size-4 mr-2" viewBox="0 0 24 24">
                            <path
                                d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                                fill="currentColor"
                            />
                        </svg>
                        Google
                    </Button>
                    <Button
                        onClick={() => handleSocialAuth("facebook")}
                        disabled={isLoading}
                        variant="outline"
                        type="button"
                        className="rounded-md h-11 font-medium bg-background"
                    >
                        <svg
                            className="size-4 mr-2 text-[#1877F2]"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                        >
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                        Facebook
                    </Button>
                </div>
            </CardContent>

            <CardFooter className="flex justify-center border-t border-muted/60 py-4 bg-muted/10 rounded-b-lg">
                <p className="text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Link
                        href="/login"
                        className="font-semibold text-primary hover:underline"
                    >
                        Sign in
                    </Link>
                </p>
            </CardFooter>
        </Card>
    );
}
