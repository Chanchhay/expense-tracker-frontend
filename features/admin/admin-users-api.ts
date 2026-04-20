import { baseApi } from "@/store/base-api";
import type {
    AdminUserResponse,
    UpdateUserRoleRequest,
    UpdateUserStatusRequest,
} from "./types";

export const adminUsersApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAdminUsers: builder.query<AdminUserResponse[], void>({
            query: () => ({
                url: "/api/admin/users",
            }),
            providesTags: ["User"],
        }),

        getAdminUserById: builder.query<AdminUserResponse, string>({
            query: (id) => ({
                url: `/api/admin/users/${id}`,
            }),
            providesTags: ["User"],
        }),

        updateAdminUserRole: builder.mutation<
            AdminUserResponse,
            { id: string; body: UpdateUserRoleRequest }
        >({
            query: ({ id, body }) => ({
                url: `/api/admin/users/${id}/role`,
                method: "PUT",
                body,
            }),
            invalidatesTags: ["User"],
        }),

        updateAdminUserStatus: builder.mutation<
            AdminUserResponse,
            { id: string; body: UpdateUserStatusRequest }
        >({
            query: ({ id, body }) => ({
                url: `/api/admin/users/${id}/status`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["User"],
        }),
    }),
});

export const {
    useGetAdminUsersQuery,
    useGetAdminUserByIdQuery,
    useUpdateAdminUserRoleMutation,
    useUpdateAdminUserStatusMutation,
} = adminUsersApi;
