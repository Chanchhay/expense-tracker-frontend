import { AlertCircle } from "lucide-react";

type Props = {
    message?: string;
};

interface ErrorResponseData {
    message?: string;
    details?: string[];
    error?: string;
}

export function getErrorMessage(error: unknown): string {
    if (typeof error === "object" && error !== null && "data" in error) {
        const errData = (error as { data: ErrorResponseData }).data;

        if (
            errData?.details &&
            Array.isArray(errData.details) &&
            errData.details.length > 0
        ) {
            return errData.details[0];
        }

        if (errData?.message) {
            return errData.message;
        }
    }

    if (error instanceof Error) return error.message;
    return "An unexpected error occurred. Please try again.";
}

export default function ErrorMessage({
    message = "Something went wrong.",
}: Props) {
    return (
        <div className="flex min-h-[50vh] items-center justify-center p-6">
            <div className="flex w-full max-w-sm flex-col items-center justify-center gap-3 text-center rounded-3xl border border-red-100 bg-red-50/50 p-8 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-600">
                    <AlertCircle className="h-6 w-6" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-red-900 tracking-tight">
                        Oops!
                    </h3>
                    <p className="text-sm text-red-600/80 mt-1">{message}</p>
                </div>
            </div>
        </div>
    );
}
