export type AuthResponse = {
    message: string;
};

export type LoginRequest = {
    email: string;
    password: string;
};

export type RegisterRequest = {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
};
