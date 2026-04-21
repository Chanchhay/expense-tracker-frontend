"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { useGetCurrentUserQuery } from "@/features/auth/auth-api";
import { ChevronRight, Wallet } from "lucide-react";

export default function LandingHeader() {
    const { data: user, isLoading } = useGetCurrentUserQuery();

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-md">
            <div className="container mx-auto px-4 md:px-6 h-[72px] flex items-center justify-between">
                <div className="flex items-center gap-2.5 font-bold text-xl tracking-tight">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                        <Wallet className="size-5" />
                    </div>
                    <span>Plutolio</span>
                </div>

                <nav className="hidden md:flex items-center gap-8 font-medium text-sm text-muted-foreground">
                    <Link
                        href="#how-it-works"
                        className="hover:text-foreground transition-colors"
                    >
                        How It Works
                    </Link>
                    <Link
                        href="#features"
                        className="hover:text-foreground transition-colors"
                    >
                        Features
                    </Link>
                    <Link
                        href="#budgets"
                        className="hover:text-foreground transition-colors"
                    >
                        Budgets
                    </Link>
                    <Link
                        href="#faq"
                        className="hover:text-foreground transition-colors"
                    >
                        FAQ
                    </Link>
                </nav>

                <div className="flex items-center gap-3">
                    <ThemeToggle />
                    {isLoading ? (
                        <div className="h-9 w-24 bg-muted animate-pulse rounded-full" />
                    ) : user ? (
                        <Button
                            asChild
                            className="rounded-full px-5 bg-foreground text-background hover:bg-foreground/90 font-medium"
                        >
                            <Link href="/dashboard">
                                Dashboard{" "}
                                <ChevronRight className="ml-1 size-4" />
                            </Link>
                        </Button>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className="hidden sm:block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                            >
                                Login
                            </Link>
                            <Button
                                asChild
                                className="rounded-full px-5 bg-foreground text-background hover:bg-foreground/90 font-medium cta-pulse"
                            >
                                <Link href="/register">Start Free</Link>
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
