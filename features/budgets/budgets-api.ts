import { baseApi } from "@/store/base-api";
import type {
    BudgetResponse,
    BudgetSummaryResponse,
    CreateBudgetRequest,
    UpdateBudgetRequest,
} from "./types";

export const budgetsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getBudgets: builder.query<BudgetResponse[], void>({
            query: () => ({
                url: "/api/budgets",
            }),
            providesTags: ["Budget"],
        }),

        getBudgetById: builder.query<BudgetResponse, string>({
            query: (id) => ({
                url: `/api/budgets/${id}`,
            }),
            providesTags: ["Budget"],
        }),

        createBudget: builder.mutation<BudgetResponse, CreateBudgetRequest>({
            query: (body) => ({
                url: "/api/budgets",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Budget"],
        }),

        updateBudget: builder.mutation<
            BudgetResponse,
            { id: string; body: UpdateBudgetRequest }
        >({
            query: ({ id, body }) => ({
                url: `/api/budgets/${id}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: ["Budget"],
        }),

        deleteBudget: builder.mutation<void, string>({
            query: (id) => ({
                url: `/api/budgets/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Budget"],
        }),

        getBudgetSummary: builder.query<BudgetSummaryResponse, string>({
            query: (month) => ({
                url: "/api/budgets/summary",
                params: { month },
            }),
            providesTags: ["Budget"],
        }),
    }),
});

export const {
    useGetBudgetsQuery,
    useGetBudgetByIdQuery,
    useCreateBudgetMutation,
    useUpdateBudgetMutation,
    useDeleteBudgetMutation,
    useGetBudgetSummaryQuery,
} = budgetsApi;
