"use client";
import { Controller, useForm } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Link from "next/link";
import { useRegisterMutation } from "@/features/auth/auth-api";
import { RegisterFormValues, registerSchema } from "@/features/auth/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/get-error-message";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
    const router = useRouter();
    const [registerUser, { isLoading }] = useRegisterMutation();

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
            const res = await registerUser(values).unwrap();
            toast.success(res.message || "Register successful");
            router.push("/login");
        } catch (error: unknown) {
            toast.error(getErrorMessage(error));
        }
    };

    return (
        <>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                // onReset={onReset}
                className="space-y-8 @container"
            >
                <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-12">
                        <p className="text-xl font-semibold">Register</p>
                        <p className="text-sm text-muted-foreground">
                            Create your account
                        </p>
                    </div>

                    {/* {error && (
                        <div className="col-span-12 rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-600">
                            {error}
                        </div>
                    )} */}

                    <Controller
                        control={form.control}
                        name="name"
                        render={({ field, fieldState }) => (
                            <Field
                                className="col-span-12 flex flex-col gap-2"
                                data-invalid={fieldState.invalid}
                            >
                                <FieldLabel>Name</FieldLabel>
                                <Input
                                    placeholder="John Doe"
                                    type="text"
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
                                className="col-span-12 flex flex-col gap-2"
                                data-invalid={fieldState.invalid}
                            >
                                <FieldLabel>Email</FieldLabel>
                                <Input
                                    placeholder="example@gmail.com"
                                    type="email"
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
                                    placeholder="Enter password"
                                    type="password"
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
                        name="confirmPassword"
                        render={({ field, fieldState }) => (
                            <Field
                                className="col-span-12 flex flex-col gap-2"
                                data-invalid={fieldState.invalid}
                            >
                                <FieldLabel>Confirm Password</FieldLabel>
                                <Input
                                    placeholder="Confirm password"
                                    type="password"
                                    {...field}
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
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
                            {isLoading ? "Creating..." : "Register"}
                        </Button>
                    </div>

                    <div className="col-span-12 text-center text-sm text-muted-foreground">
                        Already have an account?{" "}
                        <Link href="/login" className="font-medium underline">
                            Login
                        </Link>
                    </div>
                </div>
            </form>
        </>
    );
}
