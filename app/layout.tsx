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
    description: "Manage your finances with clarity.",
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
            {/* Swapped to font-sans to use our new variable by default */}
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
