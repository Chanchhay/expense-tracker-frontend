"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLoginMutation } from "@/features/auth/auth-api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { LoginFormValues, loginSchema } from "@/features/auth/schema";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/get-error-message";

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
    return (
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
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />

                <div className="col-span-12 grid grid-cols-2 gap-3">
                    <Button type="reset" variant="outline" className="w-full">
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
                    <Link href="/register" className="font-medium underline">
                        Register
                    </Link>
                </div>
            </div>
        </form>
    );
}
