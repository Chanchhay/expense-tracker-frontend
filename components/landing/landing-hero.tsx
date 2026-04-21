"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useGetCurrentUserQuery } from "@/features/auth/auth-api";
import {
    ChevronRight,
    Wallet,
    BarChart3,
    Plus,
    TrendingDown,
    TrendingUp,
} from "lucide-react";

function useInView(ref: React.RefObject<Element>, threshold = 0.15) {
    const [inView, setInView] = useState(false);
    useEffect(() => {
        const obs = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setInView(true);
                    obs.disconnect();
                }
            },
            { threshold },
        );
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, [ref, threshold]);
    return inView;
}

function Counter({
    to,
    prefix = "",
    suffix = "",
}: {
    to: number;
    prefix?: string;
    suffix?: string;
}) {
    const [val, setVal] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);
    const inView = useInView(ref as React.RefObject<Element>);
    useEffect(() => {
        if (!inView) return;
        let start = 0;
        const step = to / 40;
        const t = setInterval(() => {
            start += step;
            if (start >= to) {
                setVal(to);
                clearInterval(t);
            } else {
                setVal(Math.floor(start));
            }
        }, 30);
        return () => clearInterval(t);
    }, [inView, to]);
    return (
        <span ref={ref}>
            {prefix}
            {val.toLocaleString()}
            {suffix}
        </span>
    );
}

function DashboardMockup() {
    const transactions = [
        { label: "Grocery Store", cat: "Food", amount: -84.2, type: "expense" },
        {
            label: "Salary Deposit",
            cat: "Income",
            amount: 3200.0,
            type: "income",
        },
        {
            label: "Netflix",
            cat: "Entertainment",
            amount: -15.99,
            type: "expense",
        },
        {
            label: "Fuel Station",
            cat: "Transport",
            amount: -52.0,
            type: "expense",
        },
        {
            label: "Freelance Work",
            cat: "Income",
            amount: 450.0,
            type: "income",
        },
    ];
    const bars = [40, 65, 50, 80, 60, 90, 72];
    return (
        <div className="w-full rounded-3xl border border-border bg-card shadow-2xl overflow-hidden text-sm">
            {/* Top bar */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-card/80">
                <div className="flex items-center gap-2 font-bold text-base">
                    <div className="size-6 rounded-md bg-primary flex items-center justify-center">
                        <BarChart3 className="size-3.5 text-primary-foreground" />
                    </div>
                    Plutolio
                </div>
                <div className="flex gap-5 text-xs text-muted-foreground font-medium">
                    <span className="text-foreground border-b-2 border-primary pb-1">
                        Dashboard
                    </span>
                    <span>Accounts</span>
                    <span>Budgets</span>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-border">
                {/* Left: accounts */}
                <div className="p-5 space-y-3">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        My Accounts
                    </p>
                    {[
                        {
                            name: "Checking",
                            bal: "$4,230.50",
                            color: "bg-blue-500/15 text-blue-500",
                        },
                        {
                            name: "Savings",
                            bal: "$12,805.00",
                            color: "bg-primary/15 text-primary",
                        },
                        {
                            name: "Credit Card",
                            bal: "-$340.20",
                            color: "bg-rose-500/15 text-rose-500",
                        },
                    ].map((a) => (
                        <div
                            key={a.name}
                            className="flex items-center justify-between rounded-xl bg-muted/30 px-3 py-2.5"
                        >
                            <div className="flex items-center gap-2">
                                <div
                                    className={`size-7 rounded-lg flex items-center justify-center ${a.color}`}
                                >
                                    <Wallet className="size-3.5" />
                                </div>
                                <span className="font-medium text-xs">
                                    {a.name}
                                </span>
                            </div>
                            <span className="font-bold text-xs">{a.bal}</span>
                        </div>
                    ))}
                    <div className="flex items-center gap-1.5 text-xs text-primary font-medium mt-1 cursor-pointer hover:underline">
                        <Plus className="size-3" /> Add account
                    </div>
                </div>

                {/* Middle: chart */}
                <div className="p-5">
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            Monthly Spending
                        </p>
                        <span className="text-xs bg-primary/10 text-primary rounded-full px-2 py-0.5 font-medium">
                            July 2025
                        </span>
                    </div>
                    <div className="flex items-end gap-1 h-20 mb-1">
                        {bars.map((h, i) => (
                            <div
                                key={i}
                                className="flex-1 flex flex-col items-center gap-0.5"
                            >
                                <div
                                    className="w-full rounded-t-sm"
                                    style={{
                                        height: `${h}%`,
                                        background:
                                            i === 5
                                                ? "hsl(152 76% 53%)"
                                                : "oklch(0.922 0 0)",
                                        transition: "height 1s ease",
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between text-[10px] text-muted-foreground">
                        {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                            <span key={i}>{d}</span>
                        ))}
                    </div>
                    <div className="mt-3 flex items-center gap-3">
                        <div className="flex-1 bg-muted/40 rounded-xl p-2.5">
                            <p className="text-[10px] text-muted-foreground">
                                Total Spent
                            </p>
                            <p className="font-bold text-sm text-rose-500">
                                $1,842.40
                            </p>
                        </div>
                        <div className="flex-1 bg-muted/40 rounded-xl p-2.5">
                            <p className="text-[10px] text-muted-foreground">
                                Income
                            </p>
                            <p className="font-bold text-sm text-primary">
                                $3,650.00
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right: transactions */}
                <div className="p-5">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                        Recent Transactions
                    </p>
                    <div className="space-y-2">
                        {transactions.map((t, i) => (
                            <div
                                key={i}
                                className="flex items-center justify-between gap-2"
                            >
                                <div
                                    className={`size-7 rounded-lg flex items-center justify-center shrink-0 ${t.type === "income" ? "bg-primary/10 text-primary" : "bg-rose-500/10 text-rose-500"}`}
                                >
                                    {t.type === "income" ? (
                                        <TrendingUp className="size-3" />
                                    ) : (
                                        <TrendingDown className="size-3" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium truncate">
                                        {t.label}
                                    </p>
                                    <p className="text-[10px] text-muted-foreground">
                                        {t.cat}
                                    </p>
                                </div>
                                <span
                                    className={`text-xs font-bold tabular-nums ${t.type === "income" ? "text-primary" : "text-rose-500"}`}
                                >
                                    {t.amount > 0 ? "+" : ""}
                                    {t.amount.toFixed(2)}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function LandingHero() {
    const { data: user, isLoading } = useGetCurrentUserQuery();

    const particles = Array.from({ length: 12 }, (_, i) => ({
        id: i,
        x: (i * 137.5) % 100,
        y: (i * 97.3) % 100,
        size: 4 + (i % 4) * 3,
        delay: i * 0.4,
        duration: 4 + (i % 3),
    }));

    return (
        <section className="relative pt-20 pb-28 md:pt-28 md:pb-36 overflow-hidden">
            <div
                className="absolute inset-0 -z-10 opacity-[0.04]"
                style={{
                    backgroundImage:
                        "linear-gradient(hsl(152 76% 53%) 1px, transparent 1px), linear-gradient(90deg, hsl(152 76% 53%) 1px, transparent 1px)",
                    backgroundSize: "40px 40px",
                }}
            />
            <div
                className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 w-[800px] h-[500px] rounded-full opacity-10"
                style={{
                    background:
                        "radial-gradient(circle, hsl(152 76% 53%) 0%, transparent 70%)",
                }}
            />

            {particles.map((p) => (
                <div
                    key={p.id}
                    className="absolute -z-10 rounded-full bg-primary/20 hero-particle"
                    style={{
                        left: `${p.x}%`,
                        top: `${p.y}%`,
                        width: p.size,
                        height: p.size,
                        ["--delay" as string]: `${p.delay}s`,
                        ["--dur" as string]: `${p.duration}s`,
                    }}
                />
            ))}

            <div className="container mx-auto px-4 text-center flex flex-col items-center">
                <div className="anim-fadeup inline-flex items-center gap-2 rounded-full border border-border bg-card/60 backdrop-blur-sm px-4 py-1.5 text-xs font-semibold text-muted-foreground mb-8 shadow-sm">
                    <span className="size-4 rounded-full bg-primary/20 text-[10px] flex items-center justify-center">
                        💸
                    </span>
                    Your Personal Finance Masterpiece
                </div>

                <h1 className="anim-fadeup anim-delay-1 text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight max-w-4xl mb-6 leading-[1.08]">
                    From Financial Chaos
                    <br className="hidden md:block" />
                    <span className="text-primary"> to Perfect Clarity</span>
                </h1>

                <p className="anim-fadeup anim-delay-2 text-base sm:text-lg md:text-xl text-muted-foreground max-w-xl mb-10 px-4">
                    Track accounts, categorize expenses, attach receipts, and
                    set budgets — all with beautiful analytics built in.
                </p>

                <div className="anim-fadeup anim-delay-3 flex flex-col sm:flex-row items-center gap-3 mb-16 md:mb-20">
                    {isLoading ? (
                        <div className="h-14 w-48 bg-muted animate-pulse rounded-full" />
                    ) : user ? (
                        <Button
                            asChild
                            size="lg"
                            className="rounded-full px-8 h-14 text-base bg-foreground text-background hover:bg-foreground/90 font-medium"
                        >
                            <Link href="/dashboard">
                                Go to Dashboard{" "}
                                <ChevronRight className="ml-1 size-5" />
                            </Link>
                        </Button>
                    ) : (
                        <Button
                            asChild
                            size="lg"
                            className="rounded-full px-8 h-14 text-base bg-foreground text-background hover:bg-foreground/90 font-medium"
                        >
                            <Link href="/register">
                                Start Tracking Free{" "}
                                <ChevronRight className="ml-1 size-5" />
                            </Link>
                        </Button>
                    )}
                    <Button
                        asChild
                        variant="outline"
                        size="lg"
                        className="rounded-full px-8 h-14 text-base font-medium"
                    >
                        <Link href="#how-it-works">See How It Works</Link>
                    </Button>
                </div>

                {/* Stats row */}
                <div className="anim-fadeup anim-delay-4 flex flex-wrap justify-center gap-8 md:gap-16 mb-16 text-center">
                    {[
                        { n: 2800, suffix: "+", label: "Active Users" },
                        {
                            n: 120000,
                            suffix: "+",
                            label: "Transactions Logged",
                        },
                        { n: 98, suffix: "%", label: "Satisfaction" },
                    ].map((s) => (
                        <div key={s.label}>
                            <p className="text-3xl md:text-4xl font-bold">
                                <Counter to={s.n} suffix={s.suffix} />
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                                {s.label}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="w-full max-w-4xl mx-auto anim-fadeup anim-delay-4">
                    <DashboardMockup />
                </div>
            </div>
        </section>
    );
}
