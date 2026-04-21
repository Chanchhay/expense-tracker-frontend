"use client";

import { useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ChevronDown } from "lucide-react";

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
    onSuccessAction?: () => void;
};

function getCurrentMonth() {
    return String(new Date().getMonth() + 1);
}

function getCurrentYear() {
    return String(new Date().getFullYear());
}

export default function BudgetForm({ budget, onSuccessAction }: Props) {
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

    const selectedYear = form.watch("year");

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
                await updateBudget({ id: budget.id, body: payload }).unwrap();
                toast.success("Budget updated successfully");
            } else {
                await createBudget(payload).unwrap();
                toast.success("Budget created successfully");
                form.reset();
            }

            onSuccessAction?.();
        } catch (error: unknown) {
            toast.error(getErrorMessage(error));
        }
    };

    const isSubmitting = isCreating || isUpdating;

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Category */}
            <Controller
                control={form.control}
                name="categoryId"
                render={({ field, fieldState }) => (
                    <Field
                        className="flex flex-col gap-1.5"
                        data-invalid={fieldState.invalid}
                    >
                        <FieldLabel className="text-sm font-semibold text-foreground">
                            Expense Category
                        </FieldLabel>
                        <div className="relative">
                            <select
                                {...field}
                                className="w-full appearance-none rounded-md border border-muted/60 bg-background px-3 py-2 text-sm shadow-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer font-medium"
                            >
                                <option value="">Select category...</option>
                                {expenseCategories.map((category) => (
                                    <option
                                        key={category.id}
                                        value={category.id}
                                    >
                                        {category.name}
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

            <div className="grid grid-cols-2 gap-4">
                {/* Amount */}
                <Controller
                    control={form.control}
                    name="amount"
                    render={({ field, fieldState }) => (
                        <Field
                            className="flex flex-col gap-1.5"
                            data-invalid={fieldState.invalid}
                        >
                            <FieldLabel className="text-sm font-semibold text-foreground">
                                Limit Amount
                            </FieldLabel>
                            <Input
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                className="rounded-md border-muted/60 bg-background shadow-sm focus-visible:ring-primary/20"
                                value={field.value ?? ""}
                                onChange={(e) => field.onChange(e.target.value)}
                            />
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />

                {/* Currency */}
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

            <div className="grid grid-cols-2 gap-4">
                {/* Month */}
                <Controller
                    control={form.control}
                    name="month"
                    render={({ field, fieldState }) => {
                        const currentYearStr = getCurrentYear();
                        const minMonth =
                            selectedYear === currentYearStr
                                ? getCurrentMonth()
                                : "1";

                        return (
                            <Field
                                className="flex flex-col gap-1.5"
                                data-invalid={fieldState.invalid}
                            >
                                <FieldLabel className="text-sm font-semibold text-foreground">
                                    Month
                                </FieldLabel>
                                <Input
                                    type="number"
                                    min={minMonth}
                                    max="12"
                                    placeholder="e.g. 4"
                                    className="rounded-md border-muted/60 bg-background shadow-sm focus-visible:ring-primary/20"
                                    value={field.value ?? ""}
                                    onChange={(e) => {
                                        let val = e.target.value;
                                        if (
                                            selectedYear === currentYearStr &&
                                            Number(val) < Number(minMonth) &&
                                            val !== ""
                                        ) {
                                            val = minMonth;
                                        }
                                        field.onChange(val);
                                    }}
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        );
                    }}
                />

                {/* Year */}
                <Controller
                    control={form.control}
                    name="year"
                    render={({ field, fieldState }) => (
                        <Field
                            className="flex flex-col gap-1.5"
                            data-invalid={fieldState.invalid}
                        >
                            <FieldLabel className="text-sm font-semibold text-foreground">
                                Year
                            </FieldLabel>
                            <Input
                                type="number"
                                min={getCurrentYear()}
                                max="2100"
                                placeholder="e.g. 2026"
                                className="rounded-md border-muted/60 bg-background shadow-sm focus-visible:ring-primary/20"
                                value={field.value ?? ""}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    field.onChange(val);

                                    if (val === getCurrentYear()) {
                                        const currentMonth =
                                            Number(getCurrentMonth());
                                        const formMonth = Number(
                                            form.getValues("month"),
                                        );
                                        if (formMonth < currentMonth) {
                                            form.setValue(
                                                "month",
                                                String(currentMonth),
                                            );
                                        }
                                    }
                                }}
                            />
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-muted/60 mt-6">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onSuccessAction}
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
                        ? budget
                            ? "Updating..."
                            : "Creating..."
                        : budget
                          ? "Save Changes"
                          : "Create Budget"}
                </Button>
            </div>
        </form>
    );
}
