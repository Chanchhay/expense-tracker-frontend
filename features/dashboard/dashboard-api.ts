import { baseApi } from "@/store/base-api";
import type { DashboardResponse } from "./types";

export const dashboardApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getDashboard: builder.query<DashboardResponse, void>({
            query: () => "/api/dashboard",
            providesTags: ["Dashboard"],
        }),
    }),
});

export const { useGetDashboardQuery } = dashboardApi;
