"use client";

import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { ChevronDown } from "lucide-react";

import { useUpdateGoalStatusMutation } from "@/features/goals/goals-api";
import type { SavingsGoalResponse } from "@/features/goals/types";
import { getErrorMessage } from "@/lib/get-error-message";

import { Field, FieldLabel } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { GoalStatusFormValues, goalStatusSchema } from "@/features/goals/schema";
import { zodResolver } from "@hookform/resolvers/zod";

type Props = {
    goal: SavingsGoalResponse;
    onSuccess?: () => void;
};

const statuses = ["ACTIVE", "PAUSED", "COMPLETED", "CANCELLED"];

export default function GoalStatusForm({ goal, onSuccess }: Props) {
    const [updateGoalStatus, { isLoading }] = useUpdateGoalStatusMutation();

    const form = useForm<GoalStatusFormValues>({
        resolver: zodResolver(goalStatusSchema),
        defaultValues: {
            status: goal.status,
        },
    });

    const onSubmit = async (values: GoalStatusFormValues) => {
        try {
            await updateGoalStatus({
                id: goal.id,
                body: {
                    status: values.status,
                },
            }).unwrap();

            toast.success("Goal status updated successfully");
        } catch (error: unknown) {
            toast.error(getErrorMessage(error));
        }
    };

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-2">
            <Controller
                control={form.control}
                name="status"
                render={({ field }) => (
                    <Field className="flex flex-col gap-1.5">
                        <FieldLabel className="text-sm font-semibold text-foreground">
                            Current Status
                        </FieldLabel>
                        <div className="relative">
                            <select
                                {...field}
                                className="w-full appearance-none rounded-md border border-muted/60 bg-background px-3 py-2 text-sm shadow-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer font-medium"
                            >
                                {statuses.map((s) => (
                                    <option key={s} value={s}>
                                        {s}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                        </div>
                    </Field>
                )}
            />

            <div className="flex justify-end gap-2 pt-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onSuccess}
                    className="rounded-md"
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    disabled={isLoading}
                    className="rounded-md"
                >
                    {isLoading ? "Saving..." : "Change Status"}
                </Button>
            </div>
        </form>
    );
}
