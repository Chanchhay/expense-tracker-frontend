"use client";

import { useState } from "react";
import { toast } from "sonner";

import {
    useDeleteCategoryMutation,
    useGetCategoriesQuery,
} from "@/features/categories/categories-api";
import type { CategoryResponse } from "@/features/categories/types";
import { getErrorMessage } from "@/lib/get-error-message";

import CategoryForm from "@/components/forms/category-form";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import DeleteConfirmDialog from "./delete-confirm-dialog";

type Props = {
    trigger?: React.ReactNode;
};

export default function CategorySheet({ trigger }: Props) {
    const { data: categories, isLoading, isError } = useGetCategoriesQuery();
    const [deleteCategory, { isLoading: isDeleting }] =
        useDeleteCategoryMutation();

    const [editingCategory, setEditingCategory] =
        useState<CategoryResponse | null>(null);

    const handleDelete = async (id: number) => {
        try {
            await deleteCategory(id).unwrap();
            toast.success("Category deleted successfully");

            if (editingCategory?.id === id) {
                setEditingCategory(null);
            }
        } catch (error: unknown) {
            toast.error(getErrorMessage(error));
        }
    };

    return (
        <Sheet>
            <SheetTrigger asChild>
                {trigger ?? <Button type="button">Manage Categories</Button>}
            </SheetTrigger>

            <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
                <SheetHeader>
                    <SheetTitle>Manage Categories</SheetTitle>
                    <SheetDescription>
                        Create, update, and delete categories
                    </SheetDescription>
                </SheetHeader>

                <div className="mt-6 space-y-6">
                    <CategoryForm
                        category={editingCategory}
                        onSuccess={() => setEditingCategory(null)}
                    />

                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Category List</h3>

                        {isLoading ? (
                            <p>Loading categories...</p>
                        ) : isError ? (
                            <p>Failed to load categories.</p>
                        ) : !categories || categories.length === 0 ? (
                            <p>No categories found.</p>
                        ) : (
                            <div className="space-y-3">
                                {categories.map((category) => (
                                    <div
                                        key={category.id}
                                        className="rounded-md border p-4 flex items-center justify-between"
                                    >
                                        <div>
                                            <p className="font-medium">
                                                {category.name}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {category.type}
                                            </p>
                                            <p className="text-sm">
                                                Default:{" "}
                                                {category.isDefault
                                                    ? "Yes"
                                                    : "No"}
                                            </p>
                                        </div>

                                        <div className="flex gap-2">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                disabled={category.isDefault}
                                                onClick={() =>
                                                    setEditingCategory(category)
                                                }
                                            >
                                                Edit
                                            </Button>

                                            <DeleteConfirmDialog
                                                isLoading={isDeleting}
                                                title="Delete category?"
                                                description={`This will permanently remove "${category.name}".`}
                                                onConfirm={() =>
                                                    handleDelete(category.id)
                                                }
                                                trigger={
                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        disabled={
                                                            category.isDefault
                                                        }
                                                    >
                                                        Delete
                                                    </Button>
                                                }
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
