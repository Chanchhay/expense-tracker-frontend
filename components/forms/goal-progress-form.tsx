"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { goalProgressSchema, type GoalProgressFormValues } from "@/features/goals/schema";
import { useUpdateGoalProgressMutation } from "@/features/goals/goals-api";
import type { SavingsGoalResponse } from "@/features/goals/types";
import { getErrorMessage } from "@/lib/get-error-message";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Props = {
    goal: SavingsGoalResponse;
    onSuccess?: () => void;
};

export default function GoalProgressForm({ goal, onSuccess }: Props) {
    const [updateGoalProgress, { isLoading }] = useUpdateGoalProgressMutation();

    const form = useForm<GoalProgressFormValues>({
        resolver: zodResolver(goalProgressSchema),
        defaultValues: {
            currentAmount: String(goal.currentAmount),
        },
    });

    const onSubmit = async (values: GoalProgressFormValues) => {
        try {
            await updateGoalProgress({
                id: goal.id,
                body: { currentAmount: Number(values.currentAmount) },
            }).unwrap();

            toast.success("Goal progress updated successfully");
            onSuccess?.();
        } catch (error: unknown) {
            toast.error(getErrorMessage(error));
        }
    };

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-2">
            <Controller
                control={form.control}
                name="currentAmount"
                render={({ field, fieldState }) => (
                    <Field className="flex flex-col gap-1.5" data-invalid={fieldState.invalid}>
                        <FieldLabel className="text-sm font-semibold text-foreground">Total Saved Amount</FieldLabel>
                        <Input
                            type="number"
                            step="0.01"
                            className="rounded-md border-muted/60 bg-background shadow-sm focus-visible:ring-primary/20 text-lg"
                            value={field.value ?? ""}
                            onChange={(e) => field.onChange(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                            Target: {goal.targetAmount.toLocaleString()}
                        </p>
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                )}
            />

            <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={onSuccess} className="rounded-md">
                    Cancel
                </Button>
                <Button type="submit" disabled={isLoading} className="rounded-md">
                    {isLoading ? "Saving..." : "Update Progress"}
                </Button>
            </div>
        </form>
    );
}
