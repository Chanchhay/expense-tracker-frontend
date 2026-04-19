"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { useGetCurrentUserQuery } from "@/features/auth/auth-api"; // <-- Import auth hook
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
    Plus,
    TrendingDown,
    TrendingUp,
    Repeat2,
    ChevronDown,
} from "lucide-react";

// ─── Tiny hook: run a callback once element is in viewport ────────────────────
function useInView(ref: React.RefObject<Element>, threshold = 0.15) {
    const [inView, setInView] = useState(false);
    useEffect(() => {
        const obs = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
            { threshold }
        );
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, [ref, threshold]);
    return inView;
}

// ─── Animated counter ─────────────────────────────────────────────────────────
function Counter({ to, prefix = "", suffix = "" }: { to: number; prefix?: string; suffix?: string }) {
    const [val, setVal] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);
    const inView = useInView(ref as React.RefObject<Element>);
    useEffect(() => {
        if (!inView) return;
        let start = 0;
        const step = to / 40;
        const t = setInterval(() => {
            start += step;
            if (start >= to) { setVal(to); clearInterval(t); } else { setVal(Math.floor(start)); }
        }, 30);
        return () => clearInterval(t);
    }, [inView, to]);
    return <span ref={ref}>{prefix}{val.toLocaleString()}{suffix}</span>;
}

// ─── Fake mini dashboard card ──────────────────────────────────────────────────
function DashboardMockup() {
    const transactions = [
        { label: "Grocery Store", cat: "Food", amount: -84.20, type: "expense" },
        { label: "Salary Deposit", cat: "Income", amount: 3200.00, type: "income" },
        { label: "Netflix", cat: "Entertainment", amount: -15.99, type: "expense" },
        { label: "Fuel Station", cat: "Transport", amount: -52.00, type: "expense" },
        { label: "Freelance Work", cat: "Income", amount: 450.00, type: "income" },
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
                    <span className="text-foreground border-b-2 border-primary pb-1">Dashboard</span>
                    <span>Accounts</span>
                    <span>Budgets</span>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-border">
                {/* Left: accounts */}
                <div className="p-5 space-y-3">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">My Accounts</p>
                    {[
                        { name: "Checking", bal: "$4,230.50", color: "bg-blue-500/15 text-blue-500" },
                        { name: "Savings", bal: "$12,805.00", color: "bg-primary/15 text-primary" },
                        { name: "Credit Card", bal: "-$340.20", color: "bg-rose-500/15 text-rose-500" },
                    ].map(a => (
                        <div key={a.name} className="flex items-center justify-between rounded-xl bg-muted/30 px-3 py-2.5">
                            <div className="flex items-center gap-2">
                                <div className={`size-7 rounded-lg flex items-center justify-center ${a.color}`}>
                                    <Wallet className="size-3.5" />
                                </div>
                                <span className="font-medium text-xs">{a.name}</span>
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
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Monthly Spending</p>
                        <span className="text-xs bg-primary/10 text-primary rounded-full px-2 py-0.5 font-medium">July 2025</span>
                    </div>
                    <div className="flex items-end gap-1 h-20 mb-1">
                        {bars.map((h, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
                                <div
                                    className="w-full rounded-t-sm"
                                    style={{ height: `${h}%`, background: i === 5 ? "hsl(152 76% 53%)" : "oklch(0.922 0 0)", transition: "height 1s ease" }}
                                />
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between text-[10px] text-muted-foreground">
                        {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => <span key={i}>{d}</span>)}
                    </div>
                    <div className="mt-3 flex items-center gap-3">
                        <div className="flex-1 bg-muted/40 rounded-xl p-2.5">
                            <p className="text-[10px] text-muted-foreground">Total Spent</p>
                            <p className="font-bold text-sm text-rose-500">$1,842.40</p>
                        </div>
                        <div className="flex-1 bg-muted/40 rounded-xl p-2.5">
                            <p className="text-[10px] text-muted-foreground">Income</p>
                            <p className="font-bold text-sm text-primary">$3,650.00</p>
                        </div>
                    </div>
                </div>

                {/* Right: transactions */}
                <div className="p-5">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Recent Transactions</p>
                    <div className="space-y-2">
                        {transactions.map((t, i) => (
                            <div key={i} className="flex items-center justify-between gap-2">
                                <div className={`size-7 rounded-lg flex items-center justify-center shrink-0 ${t.type === "income" ? "bg-primary/10 text-primary" : "bg-rose-500/10 text-rose-500"}`}>
                                    {t.type === "income" ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium truncate">{t.label}</p>
                                    <p className="text-[10px] text-muted-foreground">{t.cat}</p>
                                </div>
                                <span className={`text-xs font-bold tabular-nums ${t.type === "income" ? "text-primary" : "text-rose-500"}`}>
                                    {t.amount > 0 ? "+" : ""}{t.amount.toFixed(2)}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Budget progress bar ───────────────────────────────────────────────────────
function BudgetBar({ label, spent, total, color }: { label: string; spent: number; total: number; color: string }) {
    const pct = Math.min((spent / total) * 100, 100);
    return (
        <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
                <span className="font-medium">{label}</span>
                <span className="text-muted-foreground">${spent} / ${total}</span>
            </div>
            <div className="h-2 w-full rounded-full bg-muted/60">
                <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
            </div>
        </div>
    );
}

// ─── FAQ item ─────────────────────────────────────────────────────────────────
function FAQItem({ q, a }: { q: string; a: string }) {
    const [open, setOpen] = useState(false);
    return (
        <div
            className="border border-border rounded-2xl overflow-hidden cursor-pointer"
            onClick={() => setOpen(o => !o)}
        >
            <div className="flex items-center justify-between px-6 py-5 bg-card hover:bg-muted/20 transition-colors">
                <span className="font-semibold text-base">{q}</span>
                <ChevronDown className={`size-4 text-muted-foreground shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
            </div>
            {open && (
                <div className="px-6 pb-5 pt-0 bg-card text-muted-foreground text-sm leading-relaxed border-t border-border">
                    {a}
                </div>
            )}
        </div>
    );
}

export default function LandingPage() {
    // Check if the user is already logged in
    const { data: user, isLoading } = useGetCurrentUserQuery();

    // Floating particles
    const particles = Array.from({ length: 12 }, (_, i) => ({
        id: i,
        x: (i * 137.5) % 100,
        y: (i * 97.3) % 100,
        size: 4 + (i % 4) * 3,
        delay: i * 0.4,
        duration: 4 + (i % 3),
    }));

    return (
        <div className="min-h-screen bg-background text-foreground font-sans overflow-x-hidden selection:bg-primary/20">
            <style>{`
                @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
                @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
                @keyframes pulse-ring { 0%{box-shadow:0 0 0 0 hsl(152 76% 53% / 40%)} 70%{box-shadow:0 0 0 12px hsl(152 76% 53% / 0%)} 100%{box-shadow:0 0 0 0 hsl(152 76% 53% / 0%)} }
                .anim-fadeup { animation: fadeUp 0.7s ease both; }
                .anim-delay-1 { animation-delay: 0.1s; }
                .anim-delay-2 { animation-delay: 0.22s; }
                .anim-delay-3 { animation-delay: 0.34s; }
                .anim-delay-4 { animation-delay: 0.46s; }
                .hero-particle { animation: float var(--dur,5s) ease-in-out var(--delay,0s) infinite; }
                .cta-pulse { animation: pulse-ring 2s infinite; }
                .feature-card:hover .feature-icon { transform: scale(1.1) rotate(-4deg); transition: transform 0.3s ease; }
                .feature-icon { transition: transform 0.3s ease; }
            `}</style>

            {/* ── Navigation ─────────────────────────────────────────────────── */}
            <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-md">
                <div className="container mx-auto px-4 md:px-6 h-[72px] flex items-center justify-between">
                    <div className="flex items-center gap-2.5 font-bold text-xl tracking-tight">
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                            <Wallet className="size-5" />
                        </div>
                        <span>Plutolio</span>
                    </div>

                    <nav className="hidden md:flex items-center gap-8 font-medium text-sm text-muted-foreground">
                        <Link href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</Link>
                        <Link href="#features" className="hover:text-foreground transition-colors">Features</Link>
                        <Link href="#budgets" className="hover:text-foreground transition-colors">Budgets</Link>
                        <Link href="#faq" className="hover:text-foreground transition-colors">FAQ</Link>
                    </nav>

                    <div className="flex items-center gap-3">
                        <ThemeToggle />
                        {isLoading ? (
                            <div className="h-9 w-24 bg-muted animate-pulse rounded-full" />
                        ) : user ? (
                            <Button asChild className="rounded-full px-5 bg-foreground text-background hover:bg-foreground/90 font-medium">
                                <Link href="/dashboard">
                                    Dashboard <ChevronRight className="ml-1 size-4" />
                                </Link>
                            </Button>
                        ) : (
                            <>
                                <Link href="/login" className="hidden sm:block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                                    Login
                                </Link>
                                <Button asChild className="rounded-full px-5 bg-foreground text-background hover:bg-foreground/90 font-medium cta-pulse">
                                    <Link href="/register">Start Free</Link>
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </header>

            <main>
                {/* ── Hero ───────────────────────────────────────────────────── */}
                <section className="relative pt-20 pb-28 md:pt-28 md:pb-36 overflow-hidden">
                    {/* Background grid */}
                    <div className="absolute inset-0 -z-10 opacity-[0.04]"
                        style={{ backgroundImage: "linear-gradient(hsl(152 76% 53%) 1px, transparent 1px), linear-gradient(90deg, hsl(152 76% 53%) 1px, transparent 1px)", backgroundSize: "40px 40px" }}
                    />
                    {/* Radial glow */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 w-[800px] h-[500px] rounded-full opacity-10"
                        style={{ background: "radial-gradient(circle, hsl(152 76% 53%) 0%, transparent 70%)" }}
                    />
                    {/* Floating particles */}
                    {particles.map(p => (
                        <div key={p.id}
                            className="absolute -z-10 rounded-full bg-primary/20 hero-particle"
                            style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size, ["--delay" as string]: `${p.delay}s`, ["--dur" as string]: `${p.duration}s` }}
                        />
                    ))}

                    <div className="container mx-auto px-4 text-center flex flex-col items-center">
                        <div className="anim-fadeup inline-flex items-center gap-2 rounded-full border border-border bg-card/60 backdrop-blur-sm px-4 py-1.5 text-xs font-semibold text-muted-foreground mb-8 shadow-sm">
                            <span className="size-4 rounded-full bg-primary/20 text-[10px] flex items-center justify-center">💸</span>
                            Your Personal Finance Masterpiece
                        </div>

                        <h1 className="anim-fadeup anim-delay-1 text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight max-w-4xl mb-6 leading-[1.08]">
                            From Financial Chaos<br className="hidden md:block" />
                            <span className="text-primary"> to Perfect Clarity</span>
                        </h1>

                        <p className="anim-fadeup anim-delay-2 text-base sm:text-lg md:text-xl text-muted-foreground max-w-xl mb-10 px-4">
                            Track accounts, categorize expenses, attach receipts, and set budgets — all with beautiful analytics built in.
                        </p>

                        <div className="anim-fadeup anim-delay-3 flex flex-col sm:flex-row items-center gap-3 mb-16 md:mb-20">
                            {isLoading ? (
                                <div className="h-14 w-48 bg-muted animate-pulse rounded-full" />
                            ) : user ? (
                                <Button asChild size="lg" className="rounded-full px-8 h-14 text-base bg-foreground text-background hover:bg-foreground/90 font-medium">
                                    <Link href="/dashboard">
                                        Go to Dashboard
                                        <ChevronRight className="ml-1 size-5" />
                                    </Link>
                                </Button>
                            ) : (
                                <Button asChild size="lg" className="rounded-full px-8 h-14 text-base bg-foreground text-background hover:bg-foreground/90 font-medium">
                                    <Link href="/register">
                                        Start Tracking Free
                                        <ChevronRight className="ml-1 size-5" />
                                    </Link>
                                </Button>
                            )}
                            <Button asChild variant="outline" size="lg" className="rounded-full px-8 h-14 text-base font-medium">
                                <Link href="#how-it-works">See How It Works</Link>
                            </Button>
                        </div>

                        {/* Stats row */}
                        <div className="anim-fadeup anim-delay-4 flex flex-wrap justify-center gap-8 md:gap-16 mb-16 text-center">
                            {[
                                { n: 2800, suffix: "+", label: "Active Users" },
                                { n: 120000, suffix: "+", label: "Transactions Logged" },
                                { n: 98, suffix: "%", label: "Satisfaction" },
                            ].map(s => (
                                <div key={s.label}>
                                    <p className="text-3xl md:text-4xl font-bold">
                                        <Counter to={s.n} suffix={s.suffix} />
                                    </p>
                                    <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
                                </div>
                            ))}
                        </div>

                        {/* Dashboard mockup */}
                        <div className="w-full max-w-4xl mx-auto anim-fadeup anim-delay-4">
                            <DashboardMockup />
                        </div>
                    </div>
                </section>

                {/* ── How It Works ───────────────────────────────────────────── */}
                <section id="how-it-works" className="py-20 md:py-32 bg-muted/20 border-y border-border">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16">
                            <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">Simple Process</p>
                            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Get Started in 3 Steps</h2>
                            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                                From signup to full financial clarity in minutes — no spreadsheets needed.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                            {[
                                {
                                    n: "01", icon: <Wallet className="size-6" />, title: "Set Up Accounts",
                                    desc: "Create custom accounts for cash, credit cards, and savings to manage multiple balances in one place.",
                                    color: "bg-blue-500/10 text-blue-500"
                                },
                                {
                                    n: "02", icon: <ArrowDownUp className="size-6" />, title: "Log Transactions",
                                    desc: "Record income and expenses, assign categories, and attach photos of your physical receipts instantly.",
                                    color: "bg-primary/10 text-primary"
                                },
                                {
                                    n: "03", icon: <BarChart3 className="size-6" />, title: "Monitor & Control",
                                    desc: "Set monthly budgets and use powerful dashboard charts to visualize your spending habits.",
                                    color: "bg-purple-500/10 text-purple-500"
                                },
                            ].map((step) => (
                                <div key={step.n} className="relative bg-card border border-border rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="absolute top-6 right-6 text-5xl font-black text-muted/30 select-none">{step.n}</div>
                                    <div className={`size-14 rounded-2xl ${step.color} flex items-center justify-center mb-6`}>
                                        {step.icon}
                                    </div>
                                    <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                                    <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── Features Bento ─────────────────────────────────────────── */}
                <section id="features" className="py-20 md:py-32">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16">
                            <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">Features</p>
                            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
                                Everything to Master<br className="hidden sm:block" /> Your Money
                            </h2>
                            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                                A full-stack personal finance engine built for clarity, control, and security.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 max-w-5xl mx-auto">
                            {/* Large card – Multi-account */}
                            <div className="feature-card md:col-span-7 bg-card border border-border rounded-3xl p-8 hover:border-primary/40 transition-colors group">
                                <div className="feature-icon size-14 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-6">
                                    <Wallet className="size-7" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">Manage Multiple Accounts</h3>
                                <p className="text-muted-foreground text-sm leading-relaxed max-w-sm mb-6">
                                    Separate your checking, savings, and credit cards. See exactly where your money sits across your entire financial picture.
                                </p>
                                <div className="flex gap-2 flex-wrap">
                                    {["Checking", "Savings", "Credit Card", "Cash Wallet"].map(tag => (
                                        <span key={tag} className="text-xs bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full px-3 py-1 font-medium">{tag}</span>
                                    ))}
                                </div>
                            </div>

                            {/* Receipt */}
                            <div className="feature-card md:col-span-5 bg-card border border-border rounded-3xl p-8 hover:border-primary/40 transition-colors">
                                <div className="feature-icon size-14 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-6">
                                    <Camera className="size-7" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">Attach Receipts</h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">
                                    Never lose a paper trail. Upload receipt images directly to any transaction record.
                                </p>
                            </div>

                            {/* Categories */}
                            <div className="feature-card md:col-span-4 bg-card border border-border rounded-3xl p-8 hover:border-primary/40 transition-colors">
                                <div className="feature-icon size-14 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center mb-6">
                                    <Tags className="size-7" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">Smart Categories</h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">
                                    Organize every transaction with predefined categories for crystal-clear spending reports.
                                </p>
                            </div>

                            {/* Budgets */}
                            <div className="feature-card md:col-span-4 bg-card border border-border rounded-3xl p-8 hover:border-primary/40 transition-colors">
                                <div className="feature-icon size-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                                    <Target className="size-7" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">Set Budgets</h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">
                                    Define spending limits per category and monitor your pacing before you overspend.
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
                                <h3 className="text-xl font-bold mb-2">Secure & Personal</h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">
                                    OAuth login, HTTP-only cookies, and a customizable personal profile keep your data safe.
                                </p>
                            </div>

                            {/* Transfers */}
                            <div className="feature-card md:col-span-12 bg-primary/5 border border-primary/20 rounded-3xl p-8 hover:bg-primary/10 transition-colors flex flex-col md:flex-row items-start md:items-center gap-6">
                                <div className="feature-icon size-14 rounded-2xl bg-primary/15 text-primary flex items-center justify-center shrink-0">
                                    <Repeat2 className="size-7" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold mb-2">Transfer Between Accounts</h3>
                                    <p className="text-muted-foreground text-sm leading-relaxed max-w-lg">
                                        Move money between your accounts with a single tap. Transfers are tracked automatically so your net worth is always accurate.
                                    </p>
                                </div>
                                {user ? (
                                    <Button asChild className="rounded-full font-medium shrink-0 bg-primary text-primary-foreground hover:bg-primary/90">
                                        <Link href="/dashboard">Go to Dashboard <ChevronRight className="ml-1 size-4" /></Link>
                                    </Button>
                                ) : (
                                    <Button asChild className="rounded-full font-medium shrink-0 bg-primary text-primary-foreground hover:bg-primary/90">
                                        <Link href="/register">Try It Free <ChevronRight className="ml-1 size-4" /></Link>
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── Budget tracker preview ──────────────────────────────────── */}
                <section id="budgets" className="py-20 md:py-32 bg-muted/20 border-y border-border">
                    <div className="container mx-auto px-4">
                        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center max-w-5xl mx-auto">
                            <div>
                                <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">Budgets</p>
                                <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-5">
                                    Stop Guessing.<br /> Start Controlling.
                                </h2>
                                <p className="text-muted-foreground leading-relaxed mb-8">
                                    Set spending limits for each category every month. Our visual progress bars show exactly how much runway you have left — before it&apos;s too late.
                                </p>
                                <ul className="space-y-3 text-sm">
                                    {["Category-level budget limits", "Live progress tracking", "Instant overspend alerts", "Month-by-month history"].map(item => (
                                        <li key={item} className="flex items-center gap-2.5">
                                            <span className="size-5 rounded-full bg-primary/15 text-primary flex items-center justify-center text-xs font-bold">✓</span>
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Budget card */}
                            <div className="bg-card border border-border rounded-3xl p-7 shadow-sm">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="font-bold text-lg">July 2025 Budgets</h3>
                                    <span className="text-xs text-muted-foreground bg-muted rounded-full px-3 py-1">5 categories</span>
                                </div>
                                <div className="space-y-5">
                                    <BudgetBar label="🍔 Food & Dining" spent={340} total={500} color="bg-amber-400" />
                                    <BudgetBar label="🚗 Transport" spent={190} total={200} color="bg-rose-500" />
                                    <BudgetBar label="🎬 Entertainment" spent={45} total={150} color="bg-primary" />
                                    <BudgetBar label="🛒 Shopping" spent={220} total={400} color="bg-blue-500" />
                                    <BudgetBar label="💡 Utilities" spent={95} total={120} color="bg-purple-500" />
                                </div>
                                <div className="mt-6 pt-5 border-t border-border flex justify-between text-sm">
                                    <span className="text-muted-foreground">Total budgeted</span>
                                    <span className="font-bold">$1,370 / $1,370</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── Social proof / CTA banner ───────────────────────────────── */}
                <section className="py-20 md:py-28">
                    <div className="container mx-auto px-4">
                        <div className="relative overflow-hidden max-w-4xl mx-auto bg-foreground text-background rounded-3xl px-8 py-14 text-center">
                            <div className="absolute inset-0 opacity-5"
                                style={{ backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 50%, white 1px, transparent 1px)", backgroundSize: "30px 30px" }}
                            />
                            <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-4">Ready?</p>
                            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-5">
                                Your Investment Chaos<br /> Is Costing You Right Now
                            </h2>
                            <p className="text-background/70 text-lg max-w-lg mx-auto mb-10">
                                Join thousands who have taken back control of their finances. It&apos;s free to start.
                            </p>
                            {user ? (
                                <Button asChild size="lg" className="rounded-full px-10 h-14 text-base bg-primary text-primary-foreground hover:bg-primary/90 font-medium">
                                    <Link href="/dashboard">
                                        Go to Dashboard
                                        <ChevronRight className="ml-1 size-5" />
                                    </Link>
                                </Button>
                            ) : (
                                <Button asChild size="lg" className="rounded-full px-10 h-14 text-base bg-primary text-primary-foreground hover:bg-primary/90 font-medium">
                                    <Link href="/register">
                                        Start Tracking Free
                                        <ChevronRight className="ml-1 size-5" />
                                    </Link>
                                </Button>
                            )}
                        </div>
                    </div>
                </section>

                {/* ── FAQ ─────────────────────────────────────────────────────── */}
                <section id="faq" className="py-20 md:py-32 bg-muted/20 border-t border-border">
                    <div className="container mx-auto px-4 max-w-3xl">
                        <div className="text-center mb-14">
                            <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">FAQ</p>
                            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Got Questions?</h2>
                            <p className="text-muted-foreground text-lg">Everything you need to know about Plutolio.</p>
                        </div>

                        <div className="space-y-3">
                            {[
                                { q: "Is Plutolio free to use?", a: "Yes! You can register and start tracking your income, expenses, and accounts entirely for free with no credit card required." },
                                { q: "Can I track cash and credit cards separately?", a: "Absolutely. Our multi-account management lets you create separate ledgers for bank accounts, cash wallets, and credit cards — all in one dashboard." },
                                { q: "How does receipt attachment work?", a: "When logging a transaction, simply upload an image of your physical receipt. It's stored securely alongside the transaction for future reference." },
                                { q: "Is my financial data secure?", a: "Security is our top priority. We use secure authentication (including Google and Facebook OAuth) and HTTP-only cookies to protect your session data." },
                                { q: "Can I set budgets for specific categories?", a: "Yes! You can define monthly spending limits for each expense category and track your progress in real time via visual progress bars." },
                                { q: "Do you support transfers between accounts?", a: "Yes. You can log transfers between your own accounts and they'll be correctly reflected in both account balances without affecting your net income/expense totals." },
                            ].map((faq) => (
                                <FAQItem key={faq.q} q={faq.q} a={faq.a} />
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            {/* ── Footer ─────────────────────────────────────────────────────── */}
            <footer className="border-t border-border bg-card/50 py-10 md:py-14">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-8">
                        <div className="flex items-center gap-2.5 font-bold text-xl">
                            <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                                <BarChart3 className="size-4" />
                            </div>
                            Plutolio
                        </div>

                        <nav className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground font-medium">
                            <Link href="#how-it-works" className="hover:text-foreground transition-colors">How it Works</Link>
                            <Link href="#features" className="hover:text-foreground transition-colors">Features</Link>
                            <Link href="#budgets" className="hover:text-foreground transition-colors">Budgets</Link>
                            <Link href="#faq" className="hover:text-foreground transition-colors">FAQ</Link>
                            {!user && (
                                <>
                                    <Link href="/login" className="hover:text-foreground transition-colors">Login</Link>
                                    <Link href="/register" className="hover:text-foreground transition-colors">Register</Link>
                                </>
                            )}
                        </nav>

                        {user ? (
                            <Button asChild className="rounded-full px-6 bg-foreground text-background hover:bg-foreground/90">
                                <Link href="/dashboard">Dashboard →</Link>
                            </Button>
                        ) : (
                            <Button asChild className="rounded-full px-6 bg-foreground text-background hover:bg-foreground/90">
                                <Link href="/register">Start Free →</Link>
                            </Button>
                        )}
                    </div>

                    <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
                        <p>© {new Date().getFullYear()} Plutolio. All rights reserved.</p>
                        <div className="flex gap-4">
                            <Link href="#" className="hover:text-foreground transition-colors">Privacy Policy</Link>
                            <Link href="#" className="hover:text-foreground transition-colors">Terms of Service</Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
