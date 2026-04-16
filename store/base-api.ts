import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.NEXT_PUBLIC_API_URL,
        credentials: "include",
    }),
    tagTypes: [
        "Auth",
        "User",
        "Account",
        "Category",
        "Transaction",
        "Budget",
        "Goal",
        "Dashboard",
        "Report",
        "AdminUser",
    ],
    endpoints: () => ({}),
});

console.log("API URL:", process.env.NEXT_PUBLIC_API_URL);
