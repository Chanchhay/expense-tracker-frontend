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
                url: "/api/transactions",
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
                url: "/api/transactions",
                method: "POST",
                body,
            }),
            invalidatesTags: [
                "Transaction",
                "Dashboard",
                "Report",
                "Account",
                "Budget",
            ],
        }),

        updateTransaction: builder.mutation<
            TransactionResponse,
            { id: string; body: UpdateTransactionRequest }
        >({
            query: ({ id, body }) => ({
                url: `/api/transactions/${id}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: [
                "Transaction",
                "Dashboard",
                "Report",
                "Account",
                "Budget",
            ],
        }),

        deleteTransaction: builder.mutation<void, string>({
            query: (id) => ({
                url: `/api/transactions/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: [
                "Transaction",
                "Dashboard",
                "Report",
                "Account",
                "Budget",
            ],
        }),
    }),
});

export const {
    useGetTransactionsQuery,
    useCreateTransactionMutation,
    useUpdateTransactionMutation,
    useDeleteTransactionMutation,
} = transactionsApi;
