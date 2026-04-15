export type UserResponse = {
    id: string;
    name: string;
    email: string;
    role: string;
    isActive: boolean;
    createdAt: string;
    profile?: string | null;
};

export type UpdateProfileRequest = {
    name?: string;
    profile?: string;
};

export type UpdateUserProfileResponse = {
    name: string;
    profile?: string | null;
};
