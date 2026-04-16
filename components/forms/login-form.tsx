"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLoginMutation } from "@/features/auth/auth-api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { Field, FieldError, FieldLabel, FieldSeparator } from "../ui/field";
import { LoginFormValues, loginSchema } from "@/features/auth/schema";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/get-error-message";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../ui/card";

export function LoginForm() {
    const router = useRouter();
    const [login, { isLoading }] = useLoginMutation();

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
        <Card className="w-full sm:max-w-md">
            <CardHeader>
                <CardTitle>Login Form</CardTitle>
                <CardDescription>
                    Login with your Apple or Google account
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8 @container"
                >
                    <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-12">
                            <p className="text-xl font-semibold">Login Form</p>
                        </div>

                        {/* {error && (
                    <div className="col-span-12 rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-600">
                        {error}
                    </div>
                )} */}

                        <Controller
                            control={form.control}
                            name="email"
                            render={({ field, fieldState }) => (
                                <Field
                                    className="col-span-12 flex flex-col gap-2"
                                    data-invalid={fieldState.invalid}
                                >
                                    <FieldLabel>Email</FieldLabel>
                                    <Input
                                        type="email"
                                        placeholder="example@gmail.com"
                                        {...field}
                                    />
                                    {fieldState.invalid && (
                                        <FieldError
                                            errors={[fieldState.error]}
                                        />
                                    )}
                                </Field>
                            )}
                        />

                        <Controller
                            control={form.control}
                            name="password"
                            render={({ field, fieldState }) => (
                                <Field
                                    className="col-span-12 flex flex-col gap-2"
                                    data-invalid={fieldState.invalid}
                                >
                                    <FieldLabel>Password</FieldLabel>
                                    <Input
                                        type="password"
                                        placeholder="Enter password"
                                        {...field}
                                    />
                                    {fieldState.invalid && (
                                        <FieldError
                                            errors={[fieldState.error]}
                                        />
                                    )}
                                </Field>
                            )}
                        />

                        <div className="col-span-12 grid grid-cols-2 gap-3">
                            <Button
                                type="reset"
                                variant="outline"
                                className="w-full"
                            >
                                Reset
                            </Button>

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isLoading}
                            >
                                {isLoading ? "Logging in..." : "Login"}
                            </Button>
                        </div>

                        <div className="col-span-12 text-center text-sm text-muted-foreground">
                            Don&apos;t have an account?{" "}
                            <Link
                                href="/register"
                                className="font-medium underline"
                            >
                                Register
                            </Link>
                        </div>
                    </div>
                </form>
            </CardContent>
            <CardFooter>
                <Field orientation="horizontal">
                    <Button
                        type="submit"
                        form="form-rhf-demo"
                        className="w-full"
                    >
                        Sign In
                    </Button>
                </Field>
            </CardFooter>
            <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                Or continue with
            </FieldSeparator>

            <CardFooter>
                <Field>
                    <Button
                        onClick={() => handleSocialAuth("google")}
                        disabled={isLoading}
                        variant="outline"
                        type="button"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                        >
                            <path
                                d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                                fill="currentColor"
                            />
                        </svg>
                        Login with Google
                    </Button>
                    <Button
                        onClick={() => handleSocialAuth("facebook")}
                        disabled={isLoading}
                        variant="outline"
                        type="button"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                        >
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                        Continue with Facebook
                    </Button>
                </Field>
            </CardFooter>
        </Card>
    );
}
