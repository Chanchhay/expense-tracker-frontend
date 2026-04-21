import Link from "next/link";
import { ChevronRight, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingFooter() {
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
                    </div>
                </div>
            </section>

            {/* Main Footer */}
            <footer className="border-t border-border bg-card/50 py-10 md:py-14">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-8">
                        <div className="flex items-center gap-2.5 font-bold text-xl">
                            <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                                <Wallet className="size-4" />
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
                        </nav>

                        <Button
                            asChild
                            className="rounded-full px-6 bg-foreground text-background hover:bg-foreground/90"
                        >
                            <Link href="/register">Get Started →</Link>
                        </Button>
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
