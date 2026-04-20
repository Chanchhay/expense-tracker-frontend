import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";
import StoreProvider from "@/store/provider";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/shared/theme-provider";

const jakarta = Plus_Jakarta_Sans({
    variable: "--font-jakarta",
    subsets: ["latin"],
    display: "swap",
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
    display: "swap",
});

const BASE_URL = "https://expense-tracker-frontend-one-lake.vercel.app";

export const metadata: Metadata = {
    metadataBase: new URL(BASE_URL),

    title: {
        default: "Plutolio – From Financial Chaos to Perfect Clarity",
        template: "%s | Plutolio",
    },

    description:
        "Track income and expenses, manage multiple accounts, control budgets, and attach receipts — all in one secure personal finance app.",

    keywords: [
        "expense tracker",
        "personal finance app",
        "budget planner",
        "spending tracker",
        "income tracker",
        "receipt manager",
        "financial dashboard",
        "money management",
    ],

    openGraph: {
        type: "website",
        url: BASE_URL,
        siteName: "Plutolio",
        title: "Plutolio – From Financial Chaos to Perfect Clarity",
        description:
            "Track income and expenses, manage multiple accounts, control budgets, and attach receipts — all in one secure personal finance app.",
        images: [
            {
                url: "/opengraph-image",
                width: 1200,
                height: 630,
                alt: "Plutolio – Personal Finance Tracker",
            },
        ],
    },

    twitter: {
        card: "summary_large_image",
        title: "Plutolio – From Financial Chaos to Perfect Clarity",
        description:
            "Track income and expenses, manage multiple accounts, control budgets, and attach receipts — all in one secure personal finance app.",
        images: ["/opengraph-image"],
    },

    robots: { index: true, follow: true },
};

export default function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <html
            lang="en"
            className={`${jakarta.variable} ${geistMono.variable} h-full antialiased`}
            suppressHydrationWarning
        >
            <body className="min-h-full font-sans bg-background text-foreground flex flex-col">
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <StoreProvider>
                        {children}
                        <Toaster richColors position="top-center" />
                    </StoreProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
