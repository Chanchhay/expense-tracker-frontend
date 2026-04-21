import LandingHeader from "@/components/landing/landing-header";
import LandingHero from "@/components/landing/landing-hero";
import LandingFeatures from "@/components/landing/landing-features";
import { Metadata } from "next";
import LandingFaq from "@/components/landing/landing-faq";
import LandingFooter from "@/components/landing/landing-footer";

export const metadata: Metadata = {
    title: "Plutolio | Personal Finance Tracker",
    description:
        "Track income, expenses, and manage budgets in one secure app.",
};

export default function LandingPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: "Plutolio",
        operatingSystem: "Web",
        applicationCategory: "FinanceApplication",
        description:
            "Track income, expenses, and manage budgets in one secure app.",
        offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
        },
    };

    return (
        <div className="min-h-screen bg-background text-foreground font-sans overflow-x-hidden selection:bg-primary/20">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

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

            <LandingHeader />
            <main>
                <LandingHero />
                <LandingFeatures />
                <LandingFaq />
                <LandingFooter />
            </main>
        </div>
    );
}
