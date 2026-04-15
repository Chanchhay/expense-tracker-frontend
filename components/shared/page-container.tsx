import { ReactNode } from "react";

type Props = {
    title: string;
    description?: string;
    children: ReactNode;
};

export function PageContainer({ title, description, children }: Props) {
    return (
        <div className="space-y-6 p-6">
            <div>
                <h1 className="text-2xl font-bold">{title}</h1>
                {description && (
                    <p className="text-sm text-muted-foreground">
                        {description}
                    </p>
                )}
            </div>

            <div>{children}</div>
        </div>
    );
}
