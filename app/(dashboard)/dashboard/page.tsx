"use client";

import { useGetDashboardQuery } from "@/features/dashboard/dashboard-api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageContainer } from "@/components/shared/page-container";

export default function DashboardPage() {
    const { data, isLoading, isError } = useGetDashboardQuery(undefined, {
        refetchOnFocus: true,
        refetchOnReconnect: true,
    });

    if (isLoading) {
        return <div className="p-6">Loading dashboard...</div>;
    }

    if (isError || !data) {
        return <div className="p-6">Failed to load dashboard.</div>;
    }

    return (
        <PageContainer
            title="Dashboard"
            description="Overview of your finances"
        >
            <div className="space-y-6">
                {!data.totalsByCurrency.length ? (
                    <div className="grid gap-4 md:grid-cols-3">
                        <Card>
                            <CardHeader>
                                <CardTitle>No Balance Data</CardTitle>
                            </CardHeader>
                            <CardContent>No transactions found.</CardContent>
                        </Card>
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-3">
                        {data.totalsByCurrency.map((total) => (
                            <Card key={total.currency}>
                                <CardHeader>
                                    <CardTitle>{total.currency}</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <div>
                                        <p className="text-sm text-muted-foreground">
                                            Total Income
                                        </p>
                                        <p>{total.totalIncome}</p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-muted-foreground">
                                            Total Expense
                                        </p>
                                        <p>{total.totalExpense}</p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-muted-foreground">
                                            Net Cash Flow
                                        </p>
                                        <p
                                            className={
                                                total.currentBalance < 0
                                                    ? "text-red-600"
                                                    : "text-green-600"
                                            }
                                        >
                                            {total.currentBalance}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                <Card>
                    <CardHeader>
                        <CardTitle>Recent Transactions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {data.recentTransactions.length === 0 ? (
                            <p>No recent transactions.</p>
                        ) : (
                            <div className="space-y-3">
                                {data.recentTransactions.map((transaction) => (
                                    <div
                                        key={transaction.id}
                                        className="flex items-center justify-between border-b pb-2"
                                    >
                                        <div>
                                            <p>{transaction.categoryName}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {transaction.accountName} -{" "}
                                                {transaction.date}
                                            </p>
                                        </div>
                                        <div>
                                            {transaction.amount}{" "}
                                            {transaction.currency}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </PageContainer>
    );
}
