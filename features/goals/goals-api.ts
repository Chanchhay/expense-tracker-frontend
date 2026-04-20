import { baseApi } from "@/store/base-api";
import type {
    CreateSavingsGoalRequest,
    SavingsGoalResponse,
    UpdateSavingsGoalProgressRequest,
    UpdateSavingsGoalRequest,
    UpdateSavingsGoalStatusRequest,
} from "./types";

export const goalsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getGoals: builder.query<SavingsGoalResponse[], void>({
            query: () => ({
                url: "/api/goals",
            }),
            providesTags: ["Goal"],
        }),

        getGoalById: builder.query<SavingsGoalResponse, string>({
            query: (id) => ({
                url: `/api/goals/${id}`,
            }),
            providesTags: ["Goal"],
        }),

        createGoal: builder.mutation<
            SavingsGoalResponse,
            CreateSavingsGoalRequest
        >({
            query: (body) => ({
                url: "/api/goals",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Goal"],
        }),

        updateGoal: builder.mutation<
            SavingsGoalResponse,
            { id: string; body: UpdateSavingsGoalRequest }
        >({
            query: ({ id, body }) => ({
                url: `/api/goals/${id}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: ["Goal"],
        }),

        deleteGoal: builder.mutation<void, string>({
            query: (id) => ({
                url: `/api/goals/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Goal"],
        }),

        updateGoalStatus: builder.mutation<
            SavingsGoalResponse,
            { id: string; body: UpdateSavingsGoalStatusRequest }
        >({
            query: ({ id, body }) => ({
                url: `/api/goals/${id}/status`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["Goal"],
        }),

        updateGoalProgress: builder.mutation<
            SavingsGoalResponse,
            { id: string; body: UpdateSavingsGoalProgressRequest }
        >({
            query: ({ id, body }) => ({
                url: `/api/goals/${id}/progress`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["Goal"],
        }),
    }),
});

export const {
    useGetGoalsQuery,
    useGetGoalByIdQuery,
    useCreateGoalMutation,
    useUpdateGoalMutation,
    useDeleteGoalMutation,
    useUpdateGoalStatusMutation,
    useUpdateGoalProgressMutation,
} = goalsApi;
