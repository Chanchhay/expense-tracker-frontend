import { ReactNode } from "react";

type Props = {
    title: string;
    description?: string;
    children: ReactNode;
};

export function PageContainer({ title, description, children }: Props) {
    return (
        <div className="mx-auto w-full max-w-7xl px-4 py-6 md:px-8 md:py-8">
            <div className="mb-8 space-y-1.5">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                    {title}
                </h1>
                {description && (
                    <p className="text-base text-muted-foreground">
                        {description}
                    </p>
                )}
            </div>

            <div className="w-full">{children}</div>
        </div>
    );
}
