"use client";

import { useState } from "react";
import { toast } from "sonner";

import {
    useDeleteCategoryMutation,
    useGetCategoriesQuery,
} from "@/features/categories/categories-api";
import type { CategoryResponse } from "@/features/categories/types";
import { getErrorMessage } from "@/lib/get-error-message";
import { Button } from "@/components/ui/button";
import CategoryForm from "@/components/forms/category-form";
import { PageContainer } from "@/components/shared/page-container";
import DeleteConfirmDialog from "@/components/shared/delete-confirm-dialog";

export default function CategoriesPage() {
    const {
        data: categories,
        isLoading,
        isError,
    } = useGetCategoriesQuery(undefined, {
        refetchOnFocus: true,
        refetchOnReconnect: true,
    });
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

    if (isLoading) {
        return <div>Loading categories...</div>;
    }

    if (isError) {
        return <div>Failed to load categories.</div>;
    }

    return (
        <PageContainer
            title="Categories"
            description="Create ur own categories"
        >
            <div className="space-y-6">
                <CategoryForm
                    category={editingCategory}
                    onSuccess={() => setEditingCategory(null)}
                />

                <div className="space-y-4">
                    <h3 className="text-xl font-semibold">Category List</h3>

                    {!categories || categories.length === 0 ? (
                        <p>No categories found.</p>
                    ) : (
                        <div className="space-y-3">
                            {categories.map((category) => (
                                <div
                                    key={category.id}
                                    className="border rounded-md p-4 flex items-center justify-between"
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
                                            {category.isDefault ? "Yes" : "No"}
                                        </p>
                                    </div>

                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            onClick={() =>
                                                setEditingCategory(category)
                                            }
                                        >
                                            Edit
                                        </Button>
                                        <DeleteConfirmDialog
                                            isLoading={isDeleting}
                                            title="Delete account?"
                                            description="This will permanently remove this account."
                                            onConfirm={() =>
                                                handleDelete(category.id)
                                            }
                                            trigger={
                                                <Button
                                                    type="button"
                                                    variant="destructive"
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
        </PageContainer>
    );
}
