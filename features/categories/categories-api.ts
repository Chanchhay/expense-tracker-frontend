import { baseApi } from "@/store/base-api";
import type {
    CategoryResponse,
    CreateCategoryRequest,
    UpdateCategoryRequest,
} from "./types";

export const categoriesApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getCategories: builder.query<CategoryResponse[], void>({
            query: () => ({
                url: "/api/categories",
                method: "GET",
            }),
            providesTags: ["Category"],
        }),

        createCategory: builder.mutation<
            CategoryResponse,
            CreateCategoryRequest
        >({
            query: (body) => ({
                url: "/api/categories",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Category"],
        }),

        updateCategory: builder.mutation<
            CategoryResponse,
            { id: number; body: UpdateCategoryRequest }
        >({
            query: ({ id, body }) => ({
                url: `/api/categories/${id}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: ["Category"],
        }),

        deleteCategory: builder.mutation<void, number>({
            query: (id) => ({
                url: `/api/categories/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Category"],
        }),
    }),
});

export const {
    useGetCategoriesQuery,
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
} = categoriesApi;
