"use client";

import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ChevronDown } from "lucide-react";

import {
    AccountFormInput,
    accountSchema,
    type AccountFormValues,
} from "@/features/accounts/schema";
import {
    useCreateAccountMutation,
    useUpdateAccountMutation,
} from "@/features/accounts/accounts-api";
import {
    supportedCurrencies,
    type AccountResponse,
    type AccountType,
} from "@/features/accounts/types";
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
                await updateAccount({ id: account.id, body: values }).unwrap();
                toast.success("Account updated successfully");
            } else {
                await createAccount(values).unwrap();
                toast.success("Account created successfully");
                form.reset();
            }
            onSuccess?.();
        } catch (error: unknown) {
            toast.error(getErrorMessage(error));
        }
    };

    const isSubmitting = isCreating || isUpdating;

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <Controller
                control={form.control}
                name="name"
                render={({ field, fieldState }) => (
                    <Field
                        className="flex flex-col gap-1.5"
                        data-invalid={fieldState.invalid}
                    >
                        <FieldLabel className="text-sm font-semibold text-foreground">
                            Account Name
                        </FieldLabel>
                        <Input
                            placeholder="e.g. Chase Sapphire"
                            type="text"
                            className="rounded-md border-muted/60 bg-background shadow-sm focus-visible:ring-primary/20"
                            {...field}
                        />
                        {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                        )}
                    </Field>
                )}
            />

            <div className="grid grid-cols-2 gap-4">
                <Controller
                    control={form.control}
                    name="type"
                    render={({ field, fieldState }) => (
                        <Field
                            className="flex flex-col gap-1.5"
                            data-invalid={fieldState.invalid}
                        >
                            <FieldLabel className="text-sm font-semibold text-foreground">
                                Type
                            </FieldLabel>
                            <div className="relative">
                                <select
                                    {...field}
                                    className="w-full appearance-none rounded-md border border-muted/60 bg-background px-3 py-2 text-sm shadow-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer font-medium"
                                >
                                    {accountTypes.map((type) => (
                                        <option key={type} value={type}>
                                            {type}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                            </div>
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
                            className="flex flex-col gap-1.5"
                            data-invalid={fieldState.invalid}
                        >
                            <FieldLabel className="text-sm font-semibold text-foreground">
                                Currency
                            </FieldLabel>
                            <div className="relative">
                                <select
                                    {...field}
                                    className="w-full appearance-none rounded-md border border-muted/60 bg-background px-3 py-2 text-sm shadow-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer font-medium"
                                >
                                    {supportedCurrencies.map((currency) => (
                                        <option
                                            key={currency.code}
                                            value={currency.code}
                                        >
                                            {currency.code}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                            </div>
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />
            </div>

            <Controller
                control={form.control}
                name="initialBalance"
                render={({ field, fieldState }) => (
                    <Field
                        className="flex flex-col gap-1.5"
                        data-invalid={fieldState.invalid}
                    >
                        <FieldLabel className="text-sm font-semibold text-foreground">
                            Initial Balance
                        </FieldLabel>
                        <Input
                            placeholder="0.00"
                            type="number"
                            step="0.01"
                            className="rounded-md border-muted/60 bg-background shadow-sm focus-visible:ring-primary/20"
                            value={
                                typeof field.value === "string" ||
                                typeof field.value === "number"
                                    ? field.value
                                    : 0
                            }
                            onChange={(e) => field.onChange(e.target.value)}
                        />
                        {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                        )}
                    </Field>
                )}
            />

            <div className="flex justify-end gap-2 pt-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onSuccess}
                    className="rounded-md font-medium"
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-md font-semibold shadow-sm"
                >
                    {isSubmitting
                        ? account
                            ? "Updating..."
                            : "Creating..."
                        : account
                          ? "Save Changes"
                          : "Create Account"}
                </Button>
            </div>
        </form>
    );
}
