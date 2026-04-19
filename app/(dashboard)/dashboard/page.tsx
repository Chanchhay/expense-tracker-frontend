"use client";

import { useGetDashboardQuery } from "@/features/dashboard/dashboard-api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageContainer } from "@/components/shared/page-container";
import { ArrowDownRight, ArrowUpRight, Activity, PieChart } from "lucide-react";
import { AllocationChart } from "@/components/dashboard/allocation-chart";
import { OverviewChart } from "@/components/dashboard/overview-chart";
import {
    useGetCashFlowQuery,
    useGetCategoryBreakdownQuery,
} from "@/features/reports/reports-api";
import dayjs from "dayjs";
import { useState } from "react";
import Loading from "@/components/shared/loading";
import ErrorMessage from "@/components/shared/error-message";

function getCurrentMonthValue() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    return `${year}-${month}`;
}

export default function DashboardPage() {
    const [month] = useState(getCurrentMonthValue());

    const { data, isLoading, isError } = useGetDashboardQuery(undefined, {
        refetchOnFocus: true,
        refetchOnReconnect: true,
    });

    const {
        data: cashFlow,
    } = useGetCashFlowQuery({
        from: dayjs().subtract(30, "day").format("YYYY-MM-DD"),
        to: dayjs().format("YYYY-MM-DD"),
        groupBy: "DAY",
    });

    const {
        data: categoryBreakdown,
        isLoading: isCategoryBreakdownLoading,
        isError: isCategoryBreakdownError,
    } = useGetCategoryBreakdownQuery(month, {
        refetchOnFocus: true,
        refetchOnReconnect: true,
    });
    const [selectedCurrency, setSelectedCurrency] = useState("");

    const effectiveCurrency =
        selectedCurrency || data?.totalsByCurrency?.[0]?.currency || "";

    const selectedCashFlowGroup = cashFlow?.groups?.find(
        (group) => group.currency === effectiveCurrency,
    );

    const chartData = selectedCashFlowGroup
        ? selectedCashFlowGroup.items.map((item) => ({
              name: item.period,
              income: item.income,
              expense: item.expense,
          }))
        : [];

    const chartColors = [
        "#10b981",
        "#3b82f6",
        "#f59e0b",
        "#8b5cf6",
        "#ef4444",
        "#14b8a6",
        "#f97316",
        "#6366f1",
    ];

    const selectedCategoryGroup = categoryBreakdown?.groups.find(
        (group) => group.currency === effectiveCurrency,
    );

    const allocationData =
        selectedCategoryGroup?.items.map((item, index) => ({
            name: item.categoryName,
            value: item.amount,
            color: chartColors[index % chartColors.length],
        })) ?? [];

    if (isLoading) {
        return (
            <Loading
                title="Overview"
                description="Track your income, expenses, and cash flow."
            />
        );
    }

    if (isError || !data) {
        return (
            <ErrorMessage message="Failed to load dashboard data. Please try again." />
        );
    }

    return (
        <PageContainer
            title="Overview"
            description="Track your income, expenses, and cash flow."
        >
            <div className="space-y-6 pb-8">
                {/* TOP CARDS: Totals by Currency */}
                {!data.totalsByCurrency.length ? (
                    <Card className="rounded-3xl shadow-sm border-muted/60">
                        <CardContent className="p-6 text-center text-muted-foreground">
                            No balance data found. Add a transaction to get
                            started.
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {data.totalsByCurrency.map((total) => {
                            const isPositive = total.netCashFlowLast30Days >= 0;

                            return (
                                <Card
                                    key={total.currency}
                                    className="rounded-3xl shadow-sm border-muted/60 overflow-hidden"
                                >
                                    <CardHeader className="pb-2 flex flex-row items-center justify-between">
                                        <CardTitle className="text-sm font-medium text-muted-foreground">
                                            Last 30 Days ({total.currency})
                                        </CardTitle>
                                        <div
                                            className={`p-2 rounded-xl ${
                                                isPositive
                                                    ? "bg-green-100 text-green-600"
                                                    : "bg-red-100 text-red-600"
                                            }`}
                                        >
                                            <Activity className="size-4" />
                                        </div>
                                    </CardHeader>

                                    <CardContent className="space-y-4">
                                        <div>
                                            <p className="text-sm text-muted-foreground">
                                                Net Cash Flow
                                            </p>
                                            <p
                                                className={`text-3xl font-bold tracking-tight ${
                                                    isPositive
                                                        ? "text-green-600"
                                                        : "text-red-600"
                                                }`}
                                            >
                                                {total.currency}{" "}
                                                {total.netCashFlowLast30Days.toLocaleString(
                                                    undefined,
                                                    {
                                                        minimumFractionDigits: 2,
                                                    },
                                                )}
                                            </p>
                                        </div>

                                        <div className="flex gap-4 text-sm">
                                            <div className="flex items-center gap-1 text-green-600 font-medium">
                                                <ArrowUpRight className="size-4" />
                                                <span>
                                                    {total.incomeLast30Days.toLocaleString(
                                                        undefined,
                                                        {
                                                            minimumFractionDigits: 2,
                                                        },
                                                    )}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-1 text-red-500 font-medium">
                                                <ArrowDownRight className="size-4" />
                                                <span>
                                                    {total.expenseLast30Days.toLocaleString(
                                                        undefined,
                                                        {
                                                            minimumFractionDigits: 2,
                                                        },
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}

                <div className="flex items-center gap-3 bg-muted/30 w-fit px-4 py-2 rounded-2xl border border-muted/60">
                    <label className="text-sm font-semibold text-muted-foreground">
                        Currency View
                    </label>
                    <div className="relative">
                        <select
                            value={effectiveCurrency}
                            onChange={(e) =>
                                setSelectedCurrency(e.target.value)
                            }
                            className="appearance-none rounded-xl border-none bg-background py-1.5 pl-3 pr-8 text-sm font-medium shadow-sm focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer"
                        >
                            {data.totalsByCurrency.map((item) => (
                                <option
                                    key={item.currency}
                                    value={item.currency}
                                >
                                    {item.currency}
                                </option>
                            ))}
                        </select>
                        {/* Custom Arrow for Select */}
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-muted-foreground">
                            <svg
                                className="h-4 w-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M19 9l-7 7-7-7"
                                ></path>
                            </svg>
                        </div>
                    </div>
                </div>

                {/* MIDDLE ROW: Charts */}
                <div className="grid gap-6 md:grid-cols-3">
                    {/* Area Chart: Cash Flow Performance */}
                    <Card className="rounded-3xl shadow-sm border-muted/60 md:col-span-2 flex flex-col">
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                <Activity className="size-5 text-primary" />
                                Cash Flow Performance
                            </CardTitle>
                        </CardHeader>
                        {/* FIX: Replaced min-h with a strict h-[350px] and w-full */}
                        <CardContent className="h-[350px] w-full pb-6">
                            <OverviewChart data={chartData} />
                        </CardContent>
                    </Card>

                    {/* Donut Chart: Expense Allocation */}
                    <Card className="rounded-3xl shadow-sm border-muted/60 md:col-span-1 flex flex-col">
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                <PieChart className="size-5 text-primary" />
                                Expense Allocation
                            </CardTitle>
                        </CardHeader>
                        {/* FIX: Replaced min-h with a strict h-[350px] and w-full */}
                        <CardContent className="h-[350px] w-full flex items-center justify-center pb-6">
                            {isCategoryBreakdownLoading ? (
                                <p className="text-sm text-muted-foreground">
                                    Loading allocation...
                                </p>
                            ) : isCategoryBreakdownError ? (
                                <p className="text-sm text-red-500">
                                    Failed to load allocation.
                                </p>
                            ) : allocationData.length === 0 ? (
                                <p className="text-sm text-muted-foreground">
                                    No expense allocation data.
                                </p>
                            ) : (
                                <AllocationChart data={allocationData} />
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* BOTTOM ROW: Recent Transactions */}
                <Card className="rounded-3xl shadow-sm border-muted/60">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold">
                            Recent Transactions
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {data.recentTransactions.length === 0 ? (
                            <p className="text-muted-foreground text-sm py-4">
                                No recent transactions.
                            </p>
                        ) : (
                            <div className="space-y-1">
                                {data.recentTransactions.map((transaction) => {
                                    // Determine if it's income or expense based on amount or a type field
                                    // Assuming positive is income, negative is expense for styling
                                    const isIncome =
                                        transaction.type === "INCOME";
                                    return (
                                        <div
                                            key={transaction.id}
                                            className="flex items-center justify-between p-4 hover:bg-muted/30 rounded-2xl transition-colors"
                                        >
                                            <div className="flex items-center gap-4">
                                                {/* Icon block resembling the sample's stock/crypto logos */}
                                                <div
                                                    className={`flex items-center justify-center size-10 rounded-full ${isIncome ? "bg-green-100 text-green-600" : "bg-red-100 text-red-500"}`}
                                                >
                                                    {isIncome ? (
                                                        <ArrowUpRight className="size-5" />
                                                    ) : (
                                                        <ArrowDownRight className="size-5" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-sm">
                                                        {
                                                            transaction.categoryName
                                                        }
                                                    </p>
                                                    <p className="text-xs text-muted-foreground mt-0.5">
                                                        {
                                                            transaction.accountName
                                                        }{" "}
                                                        • {transaction.date}
                                                    </p>
                                                </div>
                                            </div>
                                            <div
                                                className={`font-semibold ${isIncome ? "text-green-600" : ""}`}
                                            >
                                                {isIncome ? "+" : ""}
                                                {transaction.amount}{" "}
                                                <span className="text-xs font-normal text-muted-foreground">
                                                    {transaction.currency}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </PageContainer>
    );
}
