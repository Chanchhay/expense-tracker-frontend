"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import RegisterForm from "@/components/forms/register-form";
import { useGetCurrentUserQuery } from "@/features/auth/auth-api";

export default function RegisterPage() {
    const router = useRouter();
    const { data: user, isLoading } = useGetCurrentUserQuery();

    useEffect(() => {
        if (!isLoading && user) {
            router.replace("/dashboard");
        }
    }, [user, isLoading, router]);

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center p-4 bg-muted/10 dark:bg-background">
                <Loader2 className="size-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="flex min-h-screen items-center justify-center p-4 bg-muted/10 dark:bg-background bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-muted/20 via-background to-background">
            <div className="w-full max-w-md">
                <RegisterForm />
            </div>
        </div>
    );
}
