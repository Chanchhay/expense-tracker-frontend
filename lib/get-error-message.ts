import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { SerializedError } from "@reduxjs/toolkit";

type ErrorResponseData = {
    message?: string;
    details?: string[];
};

function isFetchBaseQueryError(error: unknown): error is FetchBaseQueryError {
    return typeof error === "object" && error !== null && "status" in error;
}

function isSerializedError(error: unknown): error is SerializedError {
    return typeof error === "object" && error !== null && "message" in error;
}

export function getErrorMessage(error: unknown): string {
    if (isFetchBaseQueryError(error)) {
        const data = error.data as ErrorResponseData | undefined;

        // 1. Check for specific details first (e.g., "User account is inactive")
        if (data?.details && Array.isArray(data.details) && data.details.length > 0) {
            return data.details[0];
        }

        // 2. Fallback to generic message
        if (data?.message && typeof data.message === "string") {
            return data.message;
        }

        if ("error" in error && typeof error.error === "string") {
            return error.error;
        }

        return "Request failed";
    }

    if (isSerializedError(error)) {
        return error.message ?? "Something went wrong";
    }

    if (error instanceof Error) {
        return error.message;
    }

    return "Unexpected error";
}
