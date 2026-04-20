import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";
import StoreProvider from "@/store/provider";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/shared/theme-provider";

const jakarta = Plus_Jakarta_Sans({
    variable: "--font-jakarta",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Expense Tracker",
    description:
        "Track income and expenses, manage accounts, control budgets, and upload receipts in one secure finance application.",
    metadataBase: new URL("https://expense-tracker-frontend-one-lake.vercel.app"),
    openGraph: {
        title: "Expense Tracker",
        description:
            "Track income and expenses, manage accounts, control budgets, and upload receipts in one secure finance application.",
        url: "https://expense-tracker-frontend-one-lake.vercel.app",
        siteName: "Expense Tracker",
        images: [
            {
                url: "/opengraph-image",
                width: 1200,
                height: 630,
                alt: "Expense Tracker Open Graph Preview",
            },
        ],
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Expense Tracker",
        description:
            "Track income and expenses, manage accounts, control budgets, and upload receipts in one secure finance application.",
        images: ["/opengraph-image"],
    },
};
export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
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
