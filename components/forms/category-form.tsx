"use client";

import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import {
    categorySchema,
    type CategoryFormValues,
} from "@/features/categories/schema";
import {
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
} from "@/features/categories/categories-api";
import type {
    CategoryResponse,
    CategoryType,
} from "@/features/categories/types";
import { getErrorMessage } from "@/lib/get-error-message";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const categoryTypes: CategoryType[] = ["INCOME", "EXPENSE"];

type Props = {
    category?: CategoryResponse | null;
    onSuccess?: () => void;
};

export default function CategoryForm({ category, onSuccess }: Props) {
    const [createCategory, { isLoading: isCreating }] =
        useCreateCategoryMutation();
    const [updateCategory, { isLoading: isUpdating }] =
        useUpdateCategoryMutation();

    const form = useForm<CategoryFormValues>({
        resolver: zodResolver(categorySchema),
        defaultValues: {
            name: "",
            type: "EXPENSE",
        },
    });

    useEffect(() => {
        form.reset({
            name: category?.name ?? "",
            type: category?.type ?? "EXPENSE",
        });
    }, [category, form]);

    const onSubmit = async (values: CategoryFormValues) => {
        try {
            if (category) {
                await updateCategory({
                    id: category.id,
                    body: values,
                }).unwrap();
                toast.success("Category updated successfully");
            } else {
                await createCategory(values).unwrap();
                toast.success("Category created successfully");
                form.reset({
                    name: "",
                    type: "EXPENSE",
                });
            }

            onSuccess?.();
        } catch (error: unknown) {
            toast.error(getErrorMessage(error));
        }
    };

    const handleReset = () => {
        form.reset({
            name: category?.name ?? "",
            type: category?.type ?? "EXPENSE",
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
                        {category ? "Edit Category" : "Create Category"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                        {category
                            ? "Update your category information"
                            : "Add a new category"}
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
                            <FieldLabel>Category Name</FieldLabel>
                            <Input placeholder="Food" type="text" {...field} />
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
                            className="col-span-12 flex flex-col gap-2"
                            data-invalid={fieldState.invalid}
                        >
                            <FieldLabel>Type</FieldLabel>
                            <select
                                {...field}
                                className="w-full rounded-md border px-3 py-2"
                            >
                                {categoryTypes.map((type) => (
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

                <div className="col-span-12 grid grid-cols-2 gap-3">
                    <Button type="reset" variant="outline" className="w-full">
                        {category ? "Reset" : "Clear"}
                    </Button>

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isSubmitting}
                    >
                        {isSubmitting
                            ? category
                                ? "Updating..."
                                : "Creating..."
                            : category
                              ? "Update Category"
                              : "Create Category"}
                    </Button>
                </div>

                {category && (
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
