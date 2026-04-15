"use client";

import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import {
    AccountFormInput,
    accountSchema,
    type AccountFormValues,
} from "@/features/accounts/schema";
import {
    useCreateAccountMutation,
    useUpdateAccountMutation,
} from "@/features/accounts/accounts-api";
import type { AccountResponse, AccountType } from "@/features/accounts/types";
import { getErrorMessage } from "@/lib/get-error-message";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const accountTypes: AccountType[] = [
    "CASH",
    "BANK",
    "CARD",
    "EWALLET",
    "SAVINGS",
];

type Props = {
    account?: AccountResponse | null;
    onSuccess?: () => void;
};

export default function AccountForm({ account, onSuccess }: Props) {
    const [createAccount, { isLoading: isCreating }] =
        useCreateAccountMutation();
    const [updateAccount, { isLoading: isUpdating }] =
        useUpdateAccountMutation();

    const form = useForm<AccountFormInput, unknown, AccountFormValues>({
        resolver: zodResolver(accountSchema),
        defaultValues: {
            name: "",
            type: "CASH",
            currency: "USD",
            initialBalance: 0,
        },
    });

    useEffect(() => {
        form.reset({
            name: account?.name ?? "",
            type: account?.type ?? "CASH",
            currency: account?.currency ?? "USD",
            initialBalance: account?.initialBalance ?? 0,
        });
    }, [account, form]);

    const onSubmit = async (values: AccountFormValues) => {
        try {
            if (account) {
                await updateAccount({
                    id: account.id,
                    body: values,
                }).unwrap();
                toast.success("Account updated successfully");
            } else {
                await createAccount(values).unwrap();
                toast.success("Account created successfully");
                form.reset({
                    name: "",
                    type: "CASH",
                    currency: "USD",
                    initialBalance: 0,
                });
            }

            onSuccess?.();
        } catch (error: unknown) {
            toast.error(getErrorMessage(error));
        }
    };

    const handleReset = () => {
        form.reset({
            name: account?.name ?? "",
            type: account?.type ?? "CASH",
            currency: account?.currency ?? "USD",
            initialBalance: account?.initialBalance ?? 0,
        });
    };

    const isSubmitting = isCreating || isUpdating;

    return (
        <form
            onSubmit={form.handleSubmit(onSubmit)}
            onReset={handleReset}
            className="space-y-8 @container border p-4 rounded-md"
        >
            <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12">
                    <p className="text-xl font-semibold">
                        {account ? "Edit Account" : "Create Account"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                        {account
                            ? "Update your account information"
                            : "Add a new account"}
                    </p>
                </div>

                <Controller
                    control={form.control}
                    name="name"
                    render={({ field, fieldState }) => (
                        <Field
                            className="col-span-12 flex flex-col gap-2"
                            data-invalid={fieldState.invalid}
                        >
                            <FieldLabel>Account Name</FieldLabel>
                            <Input
                                placeholder="Main Wallet"
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
                    name="type"
                    render={({ field, fieldState }) => (
                        <Field
                            className="col-span-12 md:col-span-6 flex flex-col gap-2"
                            data-invalid={fieldState.invalid}
                        >
                            <FieldLabel>Type</FieldLabel>
                            <select
                                {...field}
                                className="w-full rounded-md border px-3 py-2"
                            >
                                {accountTypes.map((type) => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />

                <Controller
                    control={form.control}
                    name="currency"
                    render={({ field, fieldState }) => (
                        <Field
                            className="col-span-12 md:col-span-6 flex flex-col gap-2"
                            data-invalid={fieldState.invalid}
                        >
                            <FieldLabel>Currency</FieldLabel>
                            <Input
                                placeholder="USD"
                                type="text"
                                {...field}
                                onChange={(e) =>
                                    field.onChange(e.target.value.toUpperCase())
                                }
                            />
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />

                <Controller
                    control={form.control}
                    name="initialBalance"
                    render={({ field, fieldState }) => (
                        <Field
                            className="col-span-12 flex flex-col gap-2"
                            data-invalid={fieldState.invalid}
                        >
                            <FieldLabel>Initial Balance</FieldLabel>
                            <Input
                                placeholder="0.00"
                                type="number"
                                step="0.01"
                                value={
                                    typeof field.value === "string" ||
                                    typeof field.value === "number"
                                        ? field.value
                                        : ""
                                }
                                onChange={(e) => field.onChange(e.target.value)}
                            />
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />

                <div className="col-span-12 grid grid-cols-2 gap-3">
                    <Button type="reset" variant="outline" className="w-full">
                        {account ? "Reset" : "Clear"}
                    </Button>

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isSubmitting}
                    >
                        {isSubmitting
                            ? account
                                ? "Updating..."
                                : "Creating..."
                            : account
                              ? "Update Account"
                              : "Create Account"}
                    </Button>
                </div>

                {account && (
                    <div className="col-span-12">
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full"
                            onClick={onSuccess}
                        >
                            Cancel Edit
                        </Button>
                    </div>
                )}
            </div>
        </form>
    );
}
