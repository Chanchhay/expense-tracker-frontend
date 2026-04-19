import { Skeleton } from "@/components/ui/skeleton";

type Props = {
    title?: string;
    description?: string;
};

export default function Loading({ title, description }: Props) {
    return (
        <div className="mx-auto w-full max-w-7xl px-4 py-6 md:px-8 md:py-8">
            {/* Header Section */}
            <div className="mb-8 space-y-3">
                {title ? (
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">
                        {title}
                    </h1>
                ) : (
                    <Skeleton className="h-9 w-48 rounded-full" />
                )}

                {description ? (
                    <p className="text-base text-muted-foreground">
                        {description}
                    </p>
                ) : (
                    <Skeleton className="h-5 w-72 rounded-full" />
                )}
            </div>

            {/* Generic Content Skeleton blocks (Works for any page type) */}
            <div className="space-y-6 w-full">
                {/* A generic top banner/card */}
                <Skeleton className="h-32 w-full rounded-3xl border border-muted/60 shadow-sm" />

                {/* A generic two-column layout */}
                <div className="grid gap-6 md:grid-cols-2">
                    <Skeleton className="h-64 w-full rounded-3xl border border-muted/60 shadow-sm" />
                    <Skeleton className="h-64 w-full rounded-3xl border border-muted/60 shadow-sm" />
                </div>

                {/* A generic list/table area at the bottom */}
                <div className="space-y-4 rounded-3xl border border-muted/60 p-6 shadow-sm">
                    <Skeleton className="h-8 w-1/4 rounded-full mb-4" />
                    <Skeleton className="h-12 w-full rounded-2xl" />
                    <Skeleton className="h-12 w-full rounded-2xl" />
                    <Skeleton className="h-12 w-full rounded-2xl" />
                </div>
            </div>
        </div>
    );
}
