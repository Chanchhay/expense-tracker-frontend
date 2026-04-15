import { baseApi } from "@/store/base-api";
import type {
    CreateTransactionRequest,
    TransactionResponse,
    TransactionType,
    UpdateTransactionRequest,
} from "./types";
import { FetchArgs } from "@reduxjs/toolkit/query";

type GetTransactionsParams = {
    type?: TransactionType;
    month?: string;
};

export const transactionsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getTransactions: builder.query<
            TransactionResponse[],
            GetTransactionsParams | void
        >({
            query: (params): FetchArgs => ({
                url: "/api/v1/transactions",
                method: "GET",
                params: params ?? undefined,
            }),
            providesTags: ["Transaction"],
        }),

        createTransaction: builder.mutation<
            TransactionResponse,
            CreateTransactionRequest
        >({
            query: (body) => ({
                url: "/api/v1/transactions",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Transaction", "Dashboard", "Account"],
        }),

        updateTransaction: builder.mutation<
            TransactionResponse,
            { id: string; body: UpdateTransactionRequest }
        >({
            query: ({ id, body }) => ({
                url: `/api/v1/transactions/${id}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: ["Transaction", "Dashboard", "Account"],
        }),

        deleteTransaction: builder.mutation<void, string>({
            query: (id) => ({
                url: `/api/v1/transactions/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Transaction", "Dashboard", "Account"],
        }),
    }),
});

export const {
    useGetTransactionsQuery,
    useCreateTransactionMutation,
    useUpdateTransactionMutation,
    useDeleteTransactionMutation,
} = transactionsApi;
