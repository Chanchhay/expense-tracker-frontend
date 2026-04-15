"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import {
    goalStatusSchema,
    type GoalStatusFormValues,
} from "@/features/goals/schema";
import { useUpdateGoalStatusMutation } from "@/features/goals/goals-api";
import type { GoalStatus, SavingsGoalResponse } from "@/features/goals/types";
import { getErrorMessage } from "@/lib/get-error-message";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Button } from "@/components/ui/button";

type Props = {
    goal: SavingsGoalResponse;
};

const statuses: GoalStatus[] = ["ACTIVE", "COMPLETED", "CANCELLED"];

export default function GoalStatusForm({ goal }: Props) {
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
        <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 border p-4 rounded-md"
        >
            <Controller
                control={form.control}
                name="status"
                render={({ field, fieldState }) => (
                    <Field
                        className="flex flex-col gap-2"
                        data-invalid={fieldState.invalid}
                    >
                        <FieldLabel>Status</FieldLabel>
                        <select
                            {...field}
                            className="w-full rounded-md border px-3 py-2"
                        >
                            {statuses.map((status) => (
                                <option key={status} value={status}>
                                    {status}
                                </option>
                            ))}
                        </select>
                        {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                        )}
                    </Field>
                )}
            />

            <Button type="submit" disabled={isLoading}>
                {isLoading ? "Updating..." : "Update Status"}
            </Button>
        </form>
    );
}
