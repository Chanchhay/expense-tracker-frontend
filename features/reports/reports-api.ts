import { baseApi } from "@/store/base-api";
import type {
    AccountSummaryResponse,
    CashFlowResponse,
    CategoryBreakdownResponse,
    MonthlySummaryResponse,
    TopExpensesResponse,
} from "./types";

export const reportsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getMonthlySummary: builder.query<MonthlySummaryResponse, string>({
            query: (month) => ({
                url: "/api/v1/reports/monthly-summary",
                params: { month },
            }),
            providesTags: ["Report"],
        }),

        getCategoryBreakdown: builder.query<CategoryBreakdownResponse, string>({
            query: (month) => ({
                url: "/api/v1/reports/category-breakdown",
                params: { month },
            }),
            providesTags: ["Report"],
        }),

        getCashFlow: builder.query<
            CashFlowResponse,
            { from: string; to: string; groupBy?: string }
        >({
            query: ({ from, to, groupBy = "DAY" }) => ({
                url: "/api/v1/reports/cash-flow",
                params: { from, to, groupBy },
            }),
            providesTags: ["Report"],
        }),

        getTopExpenses: builder.query<
            TopExpensesResponse,
            { month: string; limit?: number }
        >({
            query: ({ month, limit = 5 }) => ({
                url: "/api/v1/reports/top-expenses",
                params: { month, limit },
            }),
            providesTags: ["Report"],
        }),

        getAccountSummary: builder.query<AccountSummaryResponse, void>({
            query: () => ({
                url: "/api/v1/reports/account-summary",
            }),
            providesTags: ["Report"],
        }),
    }),
});

export const {
    useGetMonthlySummaryQuery,
    useGetCategoryBreakdownQuery,
    useGetCashFlowQuery,
    useGetTopExpensesQuery,
    useGetAccountSummaryQuery,
} = reportsApi;
