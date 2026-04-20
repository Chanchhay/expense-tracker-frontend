import Link from "next/link";
import { ArrowLeft, Home, FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
    return (
        <div className="flex min-h-dvh w-full flex-col items-center justify-center bg-background px-4 py-16 sm:px-6 lg:px-8 text-center">
            <div className="flex w-full max-w-sm sm:max-w-md md:max-w-lg flex-col items-center justify-center space-y-6 sm:space-y-8">
                <div className="flex size-20 sm:size-24 md:size-28 items-center justify-center rounded-full bg-muted/30 border border-muted/60 shadow-sm transition-all">
                    <FileQuestion className="size-10 sm:size-12 md:size-14 text-muted-foreground" />
                </div>

                <div className="space-y-3 sm:space-y-4 px-2 w-full">
                    <h1 className="text-6xl font-extrabold tracking-tight sm:text-7xl md:text-8xl lg:text-9xl text-foreground">
                        404
                    </h1>
                    <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl md:text-3xl">
                        Page Not Found
                    </h2>
                    <p className="text-sm text-muted-foreground sm:text-base md:text-lg leading-relaxed max-w-70 sm:max-w-sm md:max-w-md mx-auto">
                        Looks like this page is not in the budget. We
                        couldn&apos;t find the specific URL you were looking
                        for.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full pt-4 sm:pt-6 items-center justify-center">
                    <Link href="/">
                        <Button
                            variant="outline"
                            size="lg"
                            className="w-full rounded-md font-medium shadow-sm transition-all hover:bg-muted"
                        >
                            <ArrowLeft className="mr-2 size-4 sm:size-5" />
                            Go Back
                        </Button>
                    </Link>
                    <Button
                        asChild
                        size="lg"
                        className="w-full rounded-md font-semibold shadow-sm transition-all"
                    >
                        <Link href="/dashboard">
                            <Home className="mr-2 size-4 sm:size-5" />
                            Back to Dashboard
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
