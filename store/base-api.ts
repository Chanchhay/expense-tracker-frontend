import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
    BaseQueryFn,
    FetchArgs,
    FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { clearUser } from "@/features/auth/auth-slice";

const rawBaseQuery = fetchBaseQuery({
    baseUrl: "",
    credentials: "include",
});

const baseQueryWithReauth: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
> = async (args, api, extraOptions) => {
    let result = await rawBaseQuery(args, api, extraOptions);

    if (result.error && result.error.status === 401) {
        console.log("Access token expired, trying refresh...");
        const refreshResult = await rawBaseQuery(
            {
                url: "/api/v1/auth/refresh",
                method: "POST",
            },
            api,
            extraOptions,
        );

        if (!refreshResult.error) {
            result = await rawBaseQuery(args, api, extraOptions);
        } else {
            api.dispatch(clearUser());

            if (typeof window !== "undefined") {
                window.location.href = "/login";
            }
        }
    }

    return result;
};

export const baseApi = createApi({
    reducerPath: "api",
    baseQuery: baseQueryWithReauth,
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
