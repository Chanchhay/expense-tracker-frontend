import { LoginForm } from "@/components/forms/login-form";

export default function LoginPage() {
    return (
        <div className="flex min-h-screen items-center justify-center p-4 bg-muted/10 dark:bg-background bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-muted/20 via-background to-background">
            <div className="w-full max-w-md">
                <LoginForm />
            </div>
        </div>
    );
}
