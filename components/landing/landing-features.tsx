"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useGetCurrentUserQuery } from "@/features/auth/auth-api";
import {
    ChevronRight,
    Wallet,
    Camera,
    Target,
    ShieldCheck,
    Tags,
    UserCircle,
    BarChart3,
    ArrowDownUp,
    Repeat2,
} from "lucide-react";

function BudgetBar({
    label,
    spent,
    total,
    color,
}: {
    label: string;
    spent: number;
    total: number;
    color: string;
}) {
    const pct = Math.min((spent / total) * 100, 100);
    return (
        <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
                <span className="font-medium">{label}</span>
                <span className="text-muted-foreground">
                    ${spent} / ${total}
                </span>
            </div>
            <div className="h-2 w-full rounded-full bg-muted/60">
                <div
                    className={`h-full rounded-full ${color}`}
                    style={{ width: `${pct}%` }}
                />
            </div>
        </div>
    );
}

export default function LandingFeatures() {
    const { data: user } = useGetCurrentUserQuery();

    return (
        <>
            <section
                id="how-it-works"
                className="py-20 md:py-32 bg-muted/20 border-y border-border"
            >
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">
                            Simple Process
                        </p>
                        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
                            Get Started in 3 Steps
                        </h2>
                        <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                            From signup to full financial clarity in minutes —
                            no spreadsheets needed.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        {[
                            {
                                n: "01",
                                icon: <Wallet className="size-6" />,
                                title: "Set Up Accounts",
                                desc: "Create custom accounts for cash, credit cards, and savings to manage multiple balances in one place.",
                                color: "bg-blue-500/10 text-blue-500",
                            },
                            {
                                n: "02",
                                icon: <ArrowDownUp className="size-6" />,
                                title: "Log Transactions",
                                desc: "Record income and expenses, assign categories, and attach photos of your physical receipts instantly.",
                                color: "bg-primary/10 text-primary",
                            },
                            {
                                n: "03",
                                icon: <BarChart3 className="size-6" />,
                                title: "Monitor & Control",
                                desc: "Set monthly budgets and use powerful dashboard charts to visualize your spending habits.",
                                color: "bg-purple-500/10 text-purple-500",
                            },
                        ].map((step) => (
                            <div
                                key={step.n}
                                className="relative bg-card border border-border rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="absolute top-6 right-6 text-5xl font-black text-muted/30 select-none">
                                    {step.n}
                                </div>
                                <div
                                    className={`size-14 rounded-2xl ${step.color} flex items-center justify-center mb-6`}
                                >
                                    {step.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-3">
                                    {step.title}
                                </h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">
                                    {step.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section id="features" className="py-20 md:py-32">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">
                            Features
                        </p>
                        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
                            Everything to Master
                            <br className="hidden sm:block" /> Your Money
                        </h2>
                        <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                            A full-stack personal finance engine built for
                            clarity, control, and security.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 max-w-5xl mx-auto">
                        {/* Large card – Multi-account */}
                        <div className="feature-card md:col-span-7 bg-card border border-border rounded-3xl p-8 hover:border-primary/40 transition-colors group">
                            <div className="feature-icon size-14 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-6">
                                <Wallet className="size-7" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">
                                Manage Multiple Accounts
                            </h3>
                            <p className="text-muted-foreground text-sm leading-relaxed max-w-sm mb-6">
                                Separate your checking, savings, and credit
                                cards. See exactly where your money sits across
                                your entire financial picture.
                            </p>
                            <div className="flex gap-2 flex-wrap">
                                {[
                                    "Checking",
                                    "Savings",
                                    "Credit Card",
                                    "Cash Wallet",
                                ].map((tag) => (
                                    <span
                                        key={tag}
                                        className="text-xs bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full px-3 py-1 font-medium"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Receipt */}
                        <div className="feature-card md:col-span-5 bg-card border border-border rounded-3xl p-8 hover:border-primary/40 transition-colors">
                            <div className="feature-icon size-14 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-6">
                                <Camera className="size-7" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">
                                Attach Receipts
                            </h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                Never lose a paper trail. Upload receipt images
                                directly to any transaction record.
                            </p>
                        </div>

                        {/* Categories */}
                        <div className="feature-card md:col-span-4 bg-card border border-border rounded-3xl p-8 hover:border-primary/40 transition-colors">
                            <div className="feature-icon size-14 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center mb-6">
                                <Tags className="size-7" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">
                                Smart Categories
                            </h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                Organize every transaction with predefined
                                categories for crystal-clear spending reports.
                            </p>
                        </div>

                        {/* Budgets */}
                        <div className="feature-card md:col-span-4 bg-card border border-border rounded-3xl p-8 hover:border-primary/40 transition-colors">
                            <div className="feature-icon size-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                                <Target className="size-7" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">
                                Set Budgets
                            </h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                Define spending limits per category and monitor
                                your pacing before you overspend.
                            </p>
                        </div>

                        {/* Security */}
                        <div className="feature-card md:col-span-4 bg-card border border-border rounded-3xl p-8 hover:border-primary/40 transition-colors">
                            <div className="flex gap-2.5 mb-6">
                                <div className="feature-icon size-14 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                                    <ShieldCheck className="size-7" />
                                </div>
                                <div className="feature-icon size-14 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
                                    <UserCircle className="size-7" />
                                </div>
                            </div>
                            <h3 className="text-xl font-bold mb-2">
                                Secure & Personal
                            </h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                OAuth login, HTTP-only cookies, and a
                                customizable personal profile keep your data
                                safe.
                            </p>
                        </div>

                        {/* Transfers */}
                        <div className="feature-card md:col-span-12 bg-primary/5 border border-primary/20 rounded-3xl p-8 hover:bg-primary/10 transition-colors flex flex-col md:flex-row items-start md:items-center gap-6">
                            <div className="feature-icon size-14 rounded-2xl bg-primary/15 text-primary flex items-center justify-center shrink-0">
                                <Repeat2 className="size-7" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl font-bold mb-2">
                                    Transfer Between Accounts
                                </h3>
                                <p className="text-muted-foreground text-sm leading-relaxed max-w-lg">
                                    Move money between your accounts with a
                                    single tap. Transfers are tracked
                                    automatically so your net worth is always
                                    accurate.
                                </p>
                            </div>
                            {user ? (
                                <Button
                                    asChild
                                    className="rounded-full font-medium shrink-0 bg-primary text-primary-foreground hover:bg-primary/90"
                                >
                                    <Link href="/dashboard">
                                        Go to Dashboard{" "}
                                        <ChevronRight className="ml-1 size-4" />
                                    </Link>
                                </Button>
                            ) : (
                                <Button
                                    asChild
                                    className="rounded-full font-medium shrink-0 bg-primary text-primary-foreground hover:bg-primary/90"
                                >
                                    <Link href="/register">
                                        Try It Free{" "}
                                        <ChevronRight className="ml-1 size-4" />
                                    </Link>
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <section
                id="budgets"
                className="py-20 md:py-32 bg-muted/20 border-y border-border"
            >
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center max-w-5xl mx-auto">
                        <div>
                            <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">
                                Budgets
                            </p>
                            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-5">
                                Stop Guessing.
                                <br /> Start Controlling.
                            </h2>
                            <p className="text-muted-foreground leading-relaxed mb-8">
                                Set spending limits for each category every
                                month. Our visual progress bars show exactly how
                                much runway you have left — before it&apos;s too
                                late.
                            </p>
                            <ul className="space-y-3 text-sm">
                                {[
                                    "Category-level budget limits",
                                    "Live progress tracking",
                                    "Instant overspend alerts",
                                    "Month-by-month history",
                                ].map((item) => (
                                    <li
                                        key={item}
                                        className="flex items-center gap-2.5"
                                    >
                                        <span className="size-5 rounded-full bg-primary/15 text-primary flex items-center justify-center text-xs font-bold">
                                            ✓
                                        </span>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-card border border-border rounded-3xl p-7 shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-bold text-lg">
                                    July 2025 Budgets
                                </h3>
                                <span className="text-xs text-muted-foreground bg-muted rounded-full px-3 py-1">
                                    5 categories
                                </span>
                            </div>
                            <div className="space-y-5">
                                <BudgetBar
                                    label="🍔 Food & Dining"
                                    spent={340}
                                    total={500}
                                    color="bg-amber-400"
                                />
                                <BudgetBar
                                    label="🚗 Transport"
                                    spent={190}
                                    total={200}
                                    color="bg-rose-500"
                                />
                                <BudgetBar
                                    label="🎬 Entertainment"
                                    spent={45}
                                    total={150}
                                    color="bg-primary"
                                />
                                <BudgetBar
                                    label="🛒 Shopping"
                                    spent={220}
                                    total={400}
                                    color="bg-blue-500"
                                />
                                <BudgetBar
                                    label="💡 Utilities"
                                    spent={95}
                                    total={120}
                                    color="bg-purple-500"
                                />
                            </div>
                            <div className="mt-6 pt-5 border-t border-border flex justify-between text-sm">
                                <span className="text-muted-foreground">
                                    Total budgeted
                                </span>
                                <span className="font-bold">
                                    $1,370 / $1,370
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
