"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown, ChevronRight, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetCurrentUserQuery } from "@/features/auth/auth-api";

function FAQItem({ q, a }: { q: string; a: string }) {
    const [open, setOpen] = useState(false);
    return (
        <div
            className="border border-border rounded-2xl overflow-hidden cursor-pointer"
            onClick={() => setOpen((o) => !o)}
        >
            <div className="flex items-center justify-between px-6 py-5 bg-card hover:bg-muted/20 transition-colors">
                <span className="font-semibold text-base">{q}</span>
                <ChevronDown
                    className={`size-4 text-muted-foreground shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                />
            </div>
            {open && (
                <div className="px-6 pb-5 pt-0 bg-card text-muted-foreground text-sm leading-relaxed border-t border-border">
                    {a}
                </div>
            )}
        </div>
    );
}

export default function LandingFaqAndFooter() {
    const { data: user } = useGetCurrentUserQuery();

    return (
        <>
            <section className="py-20 md:py-28">
                <div className="container mx-auto px-4">
                    <div className="relative overflow-hidden max-w-4xl mx-auto bg-foreground text-background rounded-3xl px-8 py-14 text-center">
                        <div
                            className="absolute inset-0 opacity-5"
                            style={{
                                backgroundImage:
                                    "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 50%, white 1px, transparent 1px)",
                                backgroundSize: "30px 30px",
                            }}
                        />
                        <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-4">
                            Ready?
                        </p>
                        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-5">
                            Your Investment Chaos
                            <br /> Is Costing You Right Now
                        </h2>
                        <p className="text-background/70 text-lg max-w-lg mx-auto mb-10">
                            Join thousands who have taken back control of their
                            finances. It&apos;s free to start.
                        </p>
                        {user ? (
                            <Button
                                asChild
                                size="lg"
                                className="rounded-full px-10 h-14 text-base bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
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
                                className="rounded-full px-10 h-14 text-base bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
                            >
                                <Link href="/register">
                                    Start Tracking Free{" "}
                                    <ChevronRight className="ml-1 size-5" />
                                </Link>
                            </Button>
                        )}
                    </div>
                </div>
            </section>

            <section
                id="faq"
                className="py-20 md:py-32 bg-muted/20 border-t border-border"
            >
                <div className="container mx-auto px-4 max-w-3xl">
                    <div className="text-center mb-14">
                        <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">
                            FAQ
                        </p>
                        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
                            Got Questions?
                        </h2>
                        <p className="text-muted-foreground text-lg">
                            Everything you need to know about Plutolio.
                        </p>
                    </div>

                    <div className="space-y-3">
                        {[
                            {
                                q: "Is Plutolio free to use?",
                                a: "Yes! You can register and start tracking your income, expenses, and accounts entirely for free with no credit card required.",
                            },
                            {
                                q: "Can I track cash and credit cards separately?",
                                a: "Absolutely. Our multi-account management lets you create separate ledgers for bank accounts, cash wallets, and credit cards — all in one dashboard.",
                            },
                            {
                                q: "How does receipt attachment work?",
                                a: "When logging a transaction, simply upload an image of your physical receipt. It's stored securely alongside the transaction for future reference.",
                            },
                            {
                                q: "Is my financial data secure?",
                                a: "Security is our top priority. We use secure authentication (including Google and Facebook OAuth) and HTTP-only cookies to protect your session data.",
                            },
                            {
                                q: "Can I set budgets for specific categories?",
                                a: "Yes! You can define monthly spending limits for each expense category and track your progress in real time via visual progress bars.",
                            },
                            {
                                q: "Do you support transfers between accounts?",
                                a: "Yes. You can log transfers between your own accounts and they'll be correctly reflected in both account balances without affecting your net income/expense totals.",
                            },
                        ].map((faq) => (
                            <FAQItem key={faq.q} q={faq.q} a={faq.a} />
                        ))}
                    </div>
                </div>
            </section>

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
                            <Link
                                href="#how-it-works"
                                className="hover:text-foreground transition-colors"
                            >
                                How it Works
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
                            {!user && (
                                <>
                                    <Link
                                        href="/login"
                                        className="hover:text-foreground transition-colors"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="hover:text-foreground transition-colors"
                                    >
                                        Register
                                    </Link>
                                </>
                            )}
                        </nav>

                        {user ? (
                            <Button
                                asChild
                                className="rounded-full px-6 bg-foreground text-background hover:bg-foreground/90"
                            >
                                <Link href="/dashboard">Dashboard →</Link>
                            </Button>
                        ) : (
                            <Button
                                asChild
                                className="rounded-full px-6 bg-foreground text-background hover:bg-foreground/90"
                            >
                                <Link href="/register">Start Free →</Link>
                            </Button>
                        )}
                    </div>

                    <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
                        <p>
                            © {new Date().getFullYear()} Plutolio. All rights
                            reserved.
                        </p>
                        <div className="flex gap-4">
                            <Link
                                href="#"
                                className="hover:text-foreground transition-colors"
                            >
                                Privacy Policy
                            </Link>
                            <Link
                                href="#"
                                className="hover:text-foreground transition-colors"
                            >
                                Terms of Service
                            </Link>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
}
