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
                await updateGoal({
                    id: goal.id,
                    body: payload,
                }).unwrap();
                toast.success("Goal updated successfully");
            } else {
                await createGoal(payload).unwrap();
                toast.success("Goal created successfully");

                form.reset({
                    name: "",
                    targetAmount: "",
                    deadline: "",
                });
                setGoalImageFile(null);
                setExistingGoalImage(null);
            }

            onSuccess?.();
        } catch (error: unknown) {
            toast.error(getErrorMessage(error));
        }
    };

    const handleReset = () => {
        form.reset({
            name: goal?.name ?? "",
            targetAmount: goal ? String(goal.targetAmount) : "",
            deadline: goal?.deadline ?? "",
        });

        setGoalImageFile(null);
        setExistingGoalImage(goal?.image ?? null);
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
                        {goal ? "Edit Goal" : "Create Goal"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                        {goal
                            ? "Update your savings goal"
                            : "Add a new savings goal"}
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
                            <FieldLabel>Goal Name</FieldLabel>
                            <Input
                                type="text"
                                placeholder="Emergency Fund"
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
                    name="targetAmount"
                    render={({ field, fieldState }) => (
                        <Field
                            className="col-span-12 md:col-span-6 flex flex-col gap-2"
                            data-invalid={fieldState.invalid}
                        >
                            <FieldLabel>Target Amount</FieldLabel>
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
                    name="deadline"
                    render={({ field, fieldState }) => (
                        <Field
                            className="col-span-12 md:col-span-6 flex flex-col gap-2"
                            data-invalid={fieldState.invalid}
                        >
                            <FieldLabel>Deadline</FieldLabel>
                            <Input
                                type="date"
                                value={field.value ?? ""}
                                onChange={(e) => field.onChange(e.target.value)}
                            />
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />

                <div className="col-span-12 space-y-2">
                    <FieldLabel>Goal Image</FieldLabel>
                    <SingleImagePicker
                        file={goalImageFile}
                        previewUrl={existingGoalImage}
                        onChange={(file) => {
                            setGoalImageFile(file);

                            if (!file && existingGoalImage) {
                                setExistingGoalImage(null);
                            }
                        }}
                    />
                </div>

                <div className="col-span-12 grid grid-cols-2 gap-3">
                    <Button type="reset" variant="outline" className="w-full">
                        {goal ? "Reset" : "Clear"}
                    </Button>

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isSubmitting}
                    >
                        {isSubmitting
                            ? goal
                                ? "Updating..."
                                : "Creating..."
                            : goal
                              ? "Update Goal"
                              : "Create Goal"}
                    </Button>
                </div>

                {goal && (
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
