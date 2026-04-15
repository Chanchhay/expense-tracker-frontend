import { baseApi } from "@/store/base-api";
import type { AuthResponse, LoginRequest, RegisterRequest } from "./types";
import type { UserResponse } from "@/features/users/types";

export const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation<AuthResponse, LoginRequest>({
            query: (body) => ({
                url: "/api/v1/auth/login",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Auth", "User"],
        }),

        register: builder.mutation<AuthResponse, RegisterRequest>({
            query: (body) => ({
                url: "/api/v1/auth/register",
                method: "POST",
                body,
            }),
        }),

        logout: builder.mutation<AuthResponse, void>({
            query: () => ({
                url: "/api/v1/auth/logout",
                method: "POST",
            }),
            invalidatesTags: ["Auth", "User"],
        }),

        getCurrentUser: builder.query<UserResponse, void>({
            query: () => ({
                url: "/api/v1/users/me",
                method: "GET",
            }),
            providesTags: ["User"],
        }),
    }),
});

export const {
    useLoginMutation,
    useRegisterMutation,
    useLogoutMutation,
    useGetCurrentUserQuery,
} = authApi;
