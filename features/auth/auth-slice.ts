import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { UserResponse } from "@/features/users/types";

type AuthState = {
    user: UserResponse | null;
};

const initialState: AuthState = {
    user: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUser(state, action: PayloadAction<UserResponse | null>) {
            state.user = action.payload;
        },
        clearUser(state) {
            state.user = null;
        },
    },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;
