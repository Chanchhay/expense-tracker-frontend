import { baseApi } from "@/store/base-api";
import type { UpdateProfileRequest, UpdateUserProfileResponse } from "./types";

export const usersApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        updateProfile: builder.mutation<
            UpdateUserProfileResponse,
            UpdateProfileRequest
        >({
            query: (body) => ({
                url: "/api/v1/users",
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["User"],
        }),
    }),
});

export const { useUpdateProfileMutation } = usersApi;
