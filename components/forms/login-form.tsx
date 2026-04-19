"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import Link from "next/link";
import { Loader2 } from "lucide-react";

import { useLoginMutation } from "@/features/auth/auth-api";
import { LoginFormValues, loginSchema } from "@/features/auth/schema";
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

function LoginFormContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [login, { isLoading }] = useLoginMutation();

    useEffect(() => {
        const error = searchParams.get("error");
        if (error === "account_disabled") {
            toast.error(
                "Your account has been deactivated. Please contact support.",
            );
        } else if (error) {
            toast.error("Social login failed. Please try again.");
        }
    }, [searchParams]);

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (values: LoginFormValues) => {
        try {
            await login(values).unwrap();
            toast.success("Welcome back!");
            router.push("/dashboard");
        } catch (error: unknown) {
            toast.error(getErrorMessage(error));
        }
    };

    const handleSocialAuth = (provider: "google" | "facebook") => {
        const backendUrl = process.env.NEXT_PUBLIC_API_URL;

        if (!backendUrl) {
            toast.error("Backend URL is missing");
            return;
        }

        window.location.href = `${backendUrl}/oauth2/authorization/${provider}`;
    };

    return (
        <Card className="w-full rounded-lg shadow-lg border-muted/60">
            <CardHeader className="text-center space-y-2 pb-6">
                <CardTitle className="text-2xl font-bold tracking-tight">
                    Welcome back
                </CardTitle>
                <CardDescription className="text-muted-foreground font-medium">
                    Enter your credentials to access your account
                </CardDescription>
            </CardHeader>

            <CardContent>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                >
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
                                <div className="flex items-center justify-between">
                                    <FieldLabel className="text-sm font-semibold">
                                        Password
                                    </FieldLabel>
                                    <Link
                                        href="/forgot-password"
                                        className="text-xs font-medium text-primary hover:underline"
                                    >
                                        Forgot password?
                                    </Link>
                                </div>
                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    className="rounded-md border-muted/60 bg-background shadow-sm h-11"
                                    {...field}
                                />
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
                            "Sign In"
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
                    Don&apos;t have an account?{" "}
                    <Link
                        href="/register"
                        className="font-semibold text-primary hover:underline"
                    >
                        Sign up
                    </Link>
                </p>
            </CardFooter>
        </Card>
    );
}

export function LoginForm() {
    return (
        <Suspense
            fallback={
                <div className="flex justify-center p-8">
                    <Loader2 className="size-6 animate-spin text-muted-foreground" />
                </div>
            }
        >
            <LoginFormContent />
        </Suspense>
    );
}
