export type CategoryType = "INCOME" | "EXPENSE";

export type CategoryResponse = {
    id: number;
    name: string;
    type: CategoryType;
    isDefault: boolean;
    createdAt: string;
};

export type CreateCategoryRequest = {
    name: string;
    type: CategoryType;
};

export type UpdateCategoryRequest = {
    name: string;
    type: CategoryType;
};
