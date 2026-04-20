import { baseApi } from "@/store/base-api";
import type {
    AccountResponse,
    CreateAccountRequest,
    UpdateAccountRequest,
} from "./types";

export const accountsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAccounts: builder.query<AccountResponse[], void>({
            query: () => ({
                url: "/api/accounts",
                method: "GET",
            }),
            providesTags: ["Account"],
        }),

        getAccountById: builder.query<AccountResponse, string>({
            query: (id) => ({
                url: `/api/accounts/${id}`,
                method: "GET",
            }),
            providesTags: ["Account"],
        }),

        createAccount: builder.mutation<AccountResponse, CreateAccountRequest>({
            query: (body) => ({
                url: "/api/accounts",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Account", "Dashboard"],
        }),

        updateAccount: builder.mutation<
            AccountResponse,
            { id: string; body: UpdateAccountRequest }
        >({
            query: ({ id, body }) => ({
                url: `/api/accounts/${id}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: ["Account", "Dashboard"],
        }),

        deleteAccount: builder.mutation<void, string>({
            query: (id) => ({
                url: `/api/accounts/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Account", "Dashboard"],
        }),
    }),
});

export const {
    useGetAccountsQuery,
    useGetAccountByIdQuery,
    useCreateAccountMutation,
    useUpdateAccountMutation,
    useDeleteAccountMutation,
} = accountsApi;
