"use client";

import { useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { budgetSchema, type BudgetFormValues } from "@/features/budgets/schema";
import {
    useCreateBudgetMutation,
    useUpdateBudgetMutation,
} from "@/features/budgets/budgets-api";
import type { BudgetResponse } from "@/features/budgets/types";
import { useGetCategoriesQuery } from "@/features/categories/categories-api";
import { getErrorMessage } from "@/lib/get-error-message";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supportedCurrencies } from "@/features/accounts/types";

type Props = {
    budget?: BudgetResponse | null;
    onSuccess?: () => void;
};

function getCurrentMonth() {
    return String(new Date().getMonth() + 1);
}

function getCurrentYear() {
    return String(new Date().getFullYear());
}

export default function BudgetForm({ budget, onSuccess }: Props) {
    const { data: categories = [] } = useGetCategoriesQuery();

    const [createBudget, { isLoading: isCreating }] = useCreateBudgetMutation();
    const [updateBudget, { isLoading: isUpdating }] = useUpdateBudgetMutation();

    const expenseCategories = useMemo(() => {
        return categories.filter((category) => category.type === "EXPENSE");
    }, [categories]);

    const form = useForm<BudgetFormValues>({
        resolver: zodResolver(budgetSchema),
        defaultValues: {
            categoryId: "",
            amount: "",
            currency: "USD",
            month: getCurrentMonth(),
            year: getCurrentYear(),
        },
    });

    useEffect(() => {
        form.reset({
            categoryId: budget ? String(budget.categoryId) : "",
            amount: budget ? String(budget.amount) : "",
            currency: budget ? budget.currency : "USD",
            month: budget ? String(budget.month) : getCurrentMonth(),
            year: budget ? String(budget.year) : getCurrentYear(),
        });
    }, [budget, form]);

    const onSubmit = async (values: BudgetFormValues) => {
        try {
            const payload = {
                categoryId: Number(values.categoryId),
                amount: Number(values.amount),
                currency: values.currency,
                month: Number(values.month),
                year: Number(values.year),
            };

            if (budget) {
                await updateBudget({
                    id: budget.id,
                    body: payload,
                }).unwrap();
                toast.success("Budget updated successfully");
            } else {
                await createBudget(payload).unwrap();
                toast.success("Budget created successfully");

                form.reset({
                    categoryId: "",
                    amount: "",
                    currency: "USD",
                    month: getCurrentMonth(),
                    year: getCurrentYear(),
                });
            }

            onSuccess?.();
        } catch (error: unknown) {
            toast.error(getErrorMessage(error));
        }
    };

    const handleReset = () => {
        form.reset({
            categoryId: budget ? String(budget.categoryId) : "",
            amount: budget ? String(budget.amount) : "",
            currency: budget ? budget.currency : "USD",
            month: budget ? String(budget.month) : getCurrentMonth(),
            year: budget ? String(budget.year) : getCurrentYear(),
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
                        {budget ? "Edit Budget" : "Create Budget"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                        {budget ? "Update your budget" : "Add a new budget"}
                    </p>
                </div>

                <Controller
                    control={form.control}
                    name="categoryId"
                    render={({ field, fieldState }) => (
                        <Field
                            className="col-span-12 flex flex-col gap-2"
                            data-invalid={fieldState.invalid}
                        >
                            <FieldLabel>Category</FieldLabel>
                            <select
                                {...field}
                                className="w-full rounded-md border px-3 py-2"
                            >
                                <option value="">
                                    Select expense category
                                </option>
                                {expenseCategories.map((category) => (
                                    <option
                                        key={category.id}
                                        value={category.id}
                                    >
                                        {category.name}
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
                    name="amount"
                    render={({ field, fieldState }) => (
                        <Field
                            className="col-span-12 md:col-span-4 flex flex-col gap-2"
                            data-invalid={fieldState.invalid}
                        >
                            <FieldLabel>Amount</FieldLabel>
                            <Input
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                value={field.value ?? ""}
                                onChange={(e) => field.onChange(e.target.value)}
                            />
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
                            className="col-span-12 md:col-span-4 flex flex-col gap-2"
                            data-invalid={fieldState.invalid}
                        >
                            <FieldLabel>Currency</FieldLabel>
                            <select
                                {...field}
                                className="w-full rounded-md border px-3 py-2"
                            >
                                {supportedCurrencies.map((currency) => (
                                    <option
                                        key={currency.code}
                                        value={currency.code}
                                    >
                                        {currency.label}
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
                    name="month"
                    render={({ field, fieldState }) => (
                        <Field
                            className="col-span-12 md:col-span-4 flex flex-col gap-2"
                            data-invalid={fieldState.invalid}
                        >
                            <FieldLabel>Month</FieldLabel>
                            <Input
                                type="number"
                                min="1"
                                max="12"
                                placeholder="Month"
                                value={field.value ?? ""}
                                onChange={(e) => field.onChange(e.target.value)}
                            />
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />

                <Controller
                    control={form.control}
                    name="year"
                    render={({ field, fieldState }) => (
                        <Field
                            className="col-span-12 md:col-span-4 flex flex-col gap-2"
                            data-invalid={fieldState.invalid}
                        >
                            <FieldLabel>Year</FieldLabel>
                            <Input
                                type="number"
                                min="2026"
                                max="3000"
                                placeholder="Year"
                                value={field.value ?? ""}
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
                        {budget ? "Reset" : "Clear"}
                    </Button>

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isSubmitting}
                    >
                        {isSubmitting
                            ? budget
                                ? "Updating..."
                                : "Creating..."
                            : budget
                              ? "Update Budget"
                              : "Create Budget"}
                    </Button>
                </div>

                {budget && (
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
