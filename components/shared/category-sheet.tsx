"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
    MoreVertical,
    Edit2,
    Trash2,
    ArrowUpRight,
    ArrowDownRight,
    Lock,
} from "lucide-react";

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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
    const [categoryToDelete, setCategoryToDelete] = useState<number | null>(
        null,
    );

    const handleDelete = async (id: number) => {
        try {
            await deleteCategory(id).unwrap();
            toast.success("Category deleted successfully");

            if (editingCategory?.id === id) {
                setEditingCategory(null);
            }
            setCategoryToDelete(null);
        } catch (error: unknown) {
            toast.error(getErrorMessage(error));
        }
    };

    return (
        <Sheet>
            <SheetTrigger asChild>
                {trigger ?? (
                    <Button type="button" className="rounded-md">
                        Manage Categories
                    </Button>
                )}
            </SheetTrigger>

            <SheetContent className="w-full sm:max-w-md overflow-y-auto border-l-muted/60 p-6">
                <SheetHeader className="mb-6">
                    <SheetTitle className="text-xl">
                        Manage Categories
                    </SheetTitle>
                    <SheetDescription>
                        Create or update your transaction categories.
                    </SheetDescription>
                </SheetHeader>

                <div className="space-y-8">
                    {/* The Form */}
                    <div className="rounded-md border border-muted/60 bg-muted/10 p-4">
                        <CategoryForm
                            category={editingCategory}
                            onSuccess={() => setEditingCategory(null)}
                        />
                    </div>

                    {/* The List */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">
                                Existing Categories
                            </h3>
                            <span className="text-xs font-medium px-2 py-0.5 bg-muted rounded border border-muted/60 text-muted-foreground">
                                {categories?.length || 0}
                            </span>
                        </div>

                        {isLoading ? (
                            <div className="animate-pulse space-y-3">
                                {[1, 2, 3].map((i) => (
                                    <div
                                        key={i}
                                        className="h-16 w-full bg-muted/30 rounded-md"
                                    />
                                ))}
                            </div>
                        ) : isError ? (
                            <p className="text-sm text-red-500">
                                Failed to load categories.
                            </p>
                        ) : !categories || categories.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-6 border border-dashed border-muted/60 rounded-md">
                                No categories found.
                            </p>
                        ) : (
                            <div className="space-y-2.5">
                                {categories.map((category) => {
                                    const isIncome = category.type === "INCOME";

                                    return (
                                        <div
                                            key={category.id}
                                            className="group flex items-center justify-between rounded-md border border-muted/60 bg-background p-3 hover:border-muted-foreground/30 transition-colors shadow-sm"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className={`flex size-9 items-center justify-center rounded-md ${isIncome ? "bg-green-100 text-green-600" : "bg-red-50 text-red-600"}`}
                                                >
                                                    {isIncome ? (
                                                        <ArrowUpRight className="size-4" />
                                                    ) : (
                                                        <ArrowDownRight className="size-4" />
                                                    )}
                                                </div>

                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <p className="font-semibold text-sm leading-none text-foreground">
                                                            {category.name}
                                                        </p>
                                                        {category.isDefault && (
                                                            <span className="flex items-center gap-1 rounded bg-muted/50 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground border border-muted/60">
                                                                <Lock className="size-2.5" />{" "}
                                                                System
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="mt-1 text-xs font-medium text-muted-foreground">
                                                        {category.type}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Hide action menu if it's a default system category */}
                                            {!category.isDefault && (
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger
                                                        asChild
                                                    >
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 rounded-md opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground focus:opacity-100"
                                                        >
                                                            <MoreVertical className="size-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent
                                                        align="end"
                                                        className="rounded-md shadow-lg border-muted/60"
                                                    >
                                                        <DropdownMenuItem
                                                            onClick={() =>
                                                                setEditingCategory(
                                                                    category,
                                                                )
                                                            }
                                                            className="rounded-sm cursor-pointer"
                                                        >
                                                            <Edit2 className="size-4 mr-2" />{" "}
                                                            Edit Name
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() =>
                                                                setCategoryToDelete(
                                                                    category.id,
                                                                )
                                                            }
                                                            className="rounded-sm cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                                                        >
                                                            <Trash2 className="size-4 mr-2" />{" "}
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </SheetContent>

            {/* Controlled Delete Dialog */}
            <DeleteConfirmDialog
                isOpen={!!categoryToDelete}
                onOpenChange={(open) => !open && setCategoryToDelete(null)}
                isLoading={isDeleting}
                title="Delete Category?"
                description="Are you sure you want to delete this category? Transactions using this category might be affected."
                onConfirm={() => {
                    if (categoryToDelete) {
                        handleDelete(categoryToDelete);
                    }
                }}
            />
        </Sheet>
    );
}
