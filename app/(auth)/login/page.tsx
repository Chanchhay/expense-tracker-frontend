import { LoginForm } from "@/components/forms/login-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function Page() {
    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Login</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <LoginForm />
                    <p className="text-sm">
                        Don&apos;t have an account?{" "}
                        <Link href="/register" className="underline">
                            Register
                        </Link>
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
