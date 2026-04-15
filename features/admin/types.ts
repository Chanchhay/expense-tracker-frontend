export type AdminUserResponse = {
    id: string;
    name: string;
    email: string;
    role: "USER" | "ADMIN";
    isActive: boolean;
    createdAt: string;
};

export type UpdateUserRoleRequest = {
    role: "USER" | "ADMIN";
};

export type UpdateUserStatusRequest = {
    isActive: boolean;
};
