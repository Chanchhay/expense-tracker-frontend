"use client";

import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { goalSchema, type GoalFormValues } from "@/features/goals/schema";
import {
    useCreateGoalMutation,
    useUpdateGoalMutation,
} from "@/features/goals/goals-api";
import type { SavingsGoalResponse } from "@/features/goals/types";
import { getErrorMessage } from "@/lib/get-error-message";
import { uploadToCloudinary } from "@/lib/upload-to-cloudinary";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import SingleImagePicker from "@/components/shared/single-image-picker";

type Props = {
    goal?: SavingsGoalResponse | null;
    onSuccess?: () => void;
};

export default function GoalForm({ goal, onSuccess }: Props) {
    const [createGoal, { isLoading: isCreating }] = useCreateGoalMutation();
    const [updateGoal, { isLoading: isUpdating }] = useUpdateGoalMutation();

    const [goalImageFile, setGoalImageFile] = useState<File | null>(null);
    const [existingGoalImage, setExistingGoalImage] = useState<string | null>(
        goal?.image ?? null,
    );

    const [prevGoalId, setPrevGoalId] = useState<string | undefined>(goal?.id);

    if (goal?.id !== prevGoalId) {
        setPrevGoalId(goal?.id);
        setExistingGoalImage(goal?.image ?? null);
        setGoalImageFile(null);
    }

    const form = useForm<GoalFormValues>({
        resolver: zodResolver(goalSchema),
        defaultValues: {
            name: "",
            targetAmount: "",
            deadline: "",
        },
    });

    useEffect(() => {
        form.reset({
            name: goal?.name ?? "",
            targetAmount: goal ? String(goal.targetAmount) : "",
            deadline: goal?.deadline ?? "",
        });
    }, [goal, form]);

    const onSubmit = async (values: GoalFormValues) => {
        try {
            let imageUrl = existingGoalImage ?? undefined;

            if (goalImageFile) {
                const uploaded = await uploadToCloudinary(goalImageFile);
                imageUrl = uploaded.imageUrl;
            }

            const payload = {
                name: values.name,
                targetAmount: Number(values.targetAmount),
                deadline: values.deadline?.trim() ? values.deadline : undefined,
                image: imageUrl,
            };

            if (goal) {
                await updateGoal({ id: goal.id, body: payload }).unwrap();
                toast.success("Goal updated successfully");
            } else {
                await createGoal(payload).unwrap();
                toast.success("Goal created successfully");
                form.reset();
                setGoalImageFile(null);
                setExistingGoalImage(null);
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
                            Goal Name
                        </FieldLabel>
                        <Input
                            type="text"
                            placeholder="e.g. New Car, Emergency Fund"
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
                    name="targetAmount"
                    render={({ field, fieldState }) => (
                        <Field
                            className="flex flex-col gap-1.5"
                            data-invalid={fieldState.invalid}
                        >
                            <FieldLabel className="text-sm font-semibold text-foreground">
                                Target Amount
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

                <Controller
                    control={form.control}
                    name="deadline"
                    render={({ field, fieldState }) => (
                        <Field
                            className="flex flex-col gap-1.5"
                            data-invalid={fieldState.invalid}
                        >
                            <FieldLabel className="text-sm font-semibold text-foreground">
                                Target Date
                            </FieldLabel>
                            <Input
                                type="date"
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
            </div>

            <div className="space-y-2 pt-2">
                <FieldLabel className="text-sm font-semibold text-foreground">
                    Cover Image (Optional)
                </FieldLabel>
                <div className="rounded-md border border-dashed border-muted-foreground/30 bg-muted/10 p-4">
                    <SingleImagePicker
                        file={goalImageFile}
                        previewUrl={existingGoalImage}
                        onChange={(file) => {
                            setGoalImageFile(file);
                            if (!file && existingGoalImage)
                                setExistingGoalImage(null);
                        }}
                    />
                </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-muted/60 mt-6">
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
                        ? goal
                            ? "Updating..."
                            : "Creating..."
                        : goal
                          ? "Save Changes"
                          : "Create Goal"}
                </Button>
            </div>
        </form>
    );
}
