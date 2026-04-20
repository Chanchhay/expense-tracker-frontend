"use client";

import { useState } from "react";
import {
    useGetAccountSummaryQuery,
    useGetCashFlowQuery,
    useGetMonthlySummaryQuery,
    useGetTopExpensesQuery,
} from "@/features/reports/reports-api";
import { PageContainer } from "@/components/shared/page-container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Calendar,
    Filter,
    TrendingDown,
    TrendingUp,
    Wallet,
    Activity,
    ChevronDown,
    ListOrdered,
    Landmark,
    Loader2,
} from "lucide-react";
import {
    Area,
    AreaChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
    CartesianGrid,
} from "recharts";

function getCurrentMonthValue() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    return `${year}-${month}`;
}

function getDefaultFromDate() {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    return firstDay.toISOString().split("T")[0];
}

function getDefaultToDate() {
    return new Date().toISOString().split("T")[0];
}

export default function ReportsPage() {
    const [month, setMonth] = useState(getCurrentMonthValue());
    const [topExpenseLimit, setTopExpenseLimit] = useState("5");
    const [fromDate, setFromDate] = useState(getDefaultFromDate());
    const [toDate, setToDate] = useState(getDefaultToDate());
    const [groupBy, setGroupBy] = useState("DAY");

    const {
        data: monthlySummary,
        isLoading: isMonthlySummaryLoading,
        isError: isMonthlySummaryError,
    } = useGetMonthlySummaryQuery(month, {
        refetchOnFocus: true,
        refetchOnReconnect: true,
    });

    const {
        data: topExpenses,
        isLoading: isTopExpensesLoading,
        isError: isTopExpensesError,
    } = useGetTopExpensesQuery(
        {
            month,
            limit: Number(topExpenseLimit),
        },
        {
            refetchOnFocus: true,
            refetchOnReconnect: true,
        },
    );

    const {
        data: cashFlow,
        isLoading: isCashFlowLoading,
        isError: isCashFlowError,
    } = useGetCashFlowQuery(
        {
            from: fromDate,
            to: toDate,
            groupBy,
        },
        {
            refetchOnFocus: true,
            refetchOnReconnect: true,
        },
    );

    const {
        data: accountSummary,
        isLoading: isAccountSummaryLoading,
        isError: isAccountSummaryError,
    } = useGetAccountSummaryQuery(undefined, {
        refetchOnFocus: true,
        refetchOnReconnect: true,
    });

    // --- NEW LOGIC ADDED BELOW (Does not change your logic above) ---
    const [selectedCurrency, setSelectedCurrency] = useState("");

    // Extract unique currencies from the fetched data
    const availableCurrencies = Array.from(
        new Set([
            ...(monthlySummary?.groups.map((g) => g.currency) || []),
            ...(cashFlow?.groups.map((g) => g.currency) || []),
            ...(accountSummary?.totalsByCurrency.map((t) => t.currency) || []),
        ]),
    );

    // Determine which currency view to display
    const effectiveCurrency = selectedCurrency || availableCurrencies[0] || "";

    // Filter data down to the effective currency for the UI
    const activeMonthlySummary = monthlySummary?.groups.find(
        (g) => g.currency === effectiveCurrency,
    );
    const activeCashFlow = cashFlow?.groups.find(
        (g) => g.currency === effectiveCurrency,
    );

    // Format chart data for Recharts
    const chartData =
        activeCashFlow?.items.map((item) => ({
            name: item.period,
            income: item.income,
            expense: item.expense,
        })) || [];

    const isAnyLoading =
        isMonthlySummaryLoading ||
        isTopExpensesLoading ||
        isCashFlowLoading ||
        isAccountSummaryLoading;

    return (
        <PageContainer
            title="Reports & Analytics"
            description="Deep dive into your financial data."
        >
            <div className="space-y-6 pb-8">
                {/* 1. COMPACT FILTER BAR */}
                <Card className="rounded-lg shadow-sm border-muted/60">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-foreground">
                            <Filter className="size-4" /> Report Parameters
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                            {/* Summary Month */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-muted-foreground uppercase">
                                    Summary Month
                                </label>
                                <div className="flex items-center rounded-md border border-muted/60 bg-muted/10 px-3 focus-within:ring-2 focus-within:ring-primary/20">
                                    <Calendar className="size-4 text-muted-foreground mr-2 shrink-0" />
                                    <input
                                        type="month"
                                        value={month}
                                        onClick={(e) => {
                                            try {
                                                e.currentTarget.showPicker();
                                            } catch (error) {}
                                        }}
                                        onChange={(e) =>
                                            setMonth(e.target.value)
                                        }
                                        className="bg-transparent py-2 text-sm font-medium outline-none w-full cursor-pointer [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                                    />
                                </div>
                            </div>

                            {/* Top Expenses Limit */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-muted-foreground uppercase">
                                    Top Limit
                                </label>
                                <div className="flex items-center rounded-md border border-muted/60 bg-muted/10 px-3 focus-within:ring-2 focus-within:ring-primary/20">
                                    <ListOrdered className="size-4 text-muted-foreground mr-2 shrink-0" />
                                    <input
                                        type="number"
                                        min="1"
                                        max="20"
                                        value={topExpenseLimit}
                                        onChange={(e) =>
                                            setTopExpenseLimit(e.target.value)
                                        }
                                        className="bg-transparent py-2 text-sm font-medium outline-none w-full"
                                    />
                                </div>
                            </div>

                            {/* Group By */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-muted-foreground uppercase">
                                    Cash Flow Grouping
                                </label>
                                <div className="relative">
                                    <select
                                        value={groupBy}
                                        onChange={(e) =>
                                            setGroupBy(e.target.value)
                                        }
                                        className="w-full appearance-none rounded-md border border-muted/60 px-3 py-2 text-sm font-medium shadow-sm outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer bg-background text-foreground"
                                    >
                                        <option value="DAY">Daily</option>
                                        <option value="MONTH">Monthly</option>
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                                </div>
                            </div>

                            {/* From Date */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-muted-foreground uppercase">
                                    From Date
                                </label>
                                <div className="flex items-center rounded-md border border-muted/60 bg-muted/10 px-3 focus-within:ring-2 focus-within:ring-primary/20">
                                    <input
                                        type="date"
                                        value={fromDate}
                                        onClick={(e) => {
                                            try {
                                                e.currentTarget.showPicker();
                                            } catch (error) {}
                                        }}
                                        onChange={(e) =>
                                            setFromDate(e.target.value)
                                        }
                                        className="bg-transparent py-2 text-sm font-medium outline-none w-full cursor-pointer [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                                    />
                                </div>
                            </div>

                            {/* To Date */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-muted-foreground uppercase">
                                    To Date
                                </label>
                                <div className="flex items-center rounded-md border border-muted/60 bg-muted/10 px-3 focus-within:ring-2 focus-within:ring-primary/20">
                                    <input
                                        type="date"
                                        value={toDate}
                                        onClick={(e) => {
                                            try {
                                                e.currentTarget.showPicker();
                                            } catch (error) {}
                                        }}
                                        onChange={(e) =>
                                            setToDate(e.target.value)
                                        }
                                        className="bg-transparent py-2 text-sm font-medium outline-none w-full cursor-pointer [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                                    />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* 2. CURRENCY SELECTOR (Global context for the report) */}
                {availableCurrencies.length > 0 && (
                    <div className="flex items-center justify-end gap-3">
                        <span className="text-sm font-semibold text-muted-foreground">
                            Viewing Currency:
                        </span>
                        <div className="relative w-32">
                            <select
                                value={effectiveCurrency}
                                onChange={(e) =>
                                    setSelectedCurrency(e.target.value)
                                }
                                className="w-full appearance-none rounded-md border border-muted/60 bg-background px-3 py-1.5 text-sm font-bold shadow-sm outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                            >
                                {availableCurrencies.map((c) => (
                                    <option key={c} value={c}>
                                        {c}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                        </div>
                    </div>
                )}

                {/* Loading State Overlay */}
                {isAnyLoading && (
                    <div className="flex items-center justify-center p-8 text-muted-foreground">
                        <Loader2 className="size-6 animate-spin mr-2 text-primary" />{" "}
                        Generating Reports...
                    </div>
                )}

                {/* 3. MONTHLY SUMMARY CARDS */}
                {!isMonthlySummaryLoading && activeMonthlySummary && (
                    <div className="grid gap-4 md:grid-cols-3">
                        <Card className="rounded-lg shadow-sm border-muted/60">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-3 text-muted-foreground mb-3">
                                    <TrendingUp className="size-5 text-green-500" />
                                    <span className="font-medium text-sm uppercase tracking-wider">
                                        Total Income
                                    </span>
                                </div>
                                <p className="text-3xl font-bold tracking-tight text-foreground">
                                    {activeMonthlySummary.totalIncome.toLocaleString()}{" "}
                                    <span className="text-base text-muted-foreground font-medium">
                                        {effectiveCurrency}
                                    </span>
                                </p>
                            </CardContent>
                        </Card>
                        <Card className="rounded-lg shadow-sm border-muted/60">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-3 text-muted-foreground mb-3">
                                    <TrendingDown className="size-5 text-red-500" />
                                    <span className="font-medium text-sm uppercase tracking-wider">
                                        Total Expense
                                    </span>
                                </div>
                                <p className="text-3xl font-bold tracking-tight text-foreground">
                                    {activeMonthlySummary.totalExpense.toLocaleString()}{" "}
                                    <span className="text-base text-muted-foreground font-medium">
                                        {effectiveCurrency}
                                    </span>
                                </p>
                            </CardContent>
                        </Card>
                        <Card className="rounded-lg shadow-sm border-muted/60 bg-muted/5">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-3 text-muted-foreground mb-3">
                                    <Wallet className="size-5 text-primary" />
                                    <span className="font-medium text-sm uppercase tracking-wider">
                                        Net Balance
                                    </span>
                                </div>
                                <p
                                    className={`text-3xl font-bold tracking-tight ${activeMonthlySummary.netBalance < 0 ? "text-red-500" : "text-primary"}`}
                                >
                                    {activeMonthlySummary.netBalance > 0
                                        ? "+"
                                        : ""}
                                    {activeMonthlySummary.netBalance.toLocaleString()}{" "}
                                    <span className="text-base font-medium">
                                        {effectiveCurrency}
                                    </span>
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* 4. CASH FLOW CHART */}
                {!isCashFlowLoading && activeCashFlow && (
                    <Card className="rounded-lg shadow-sm border-muted/60">
                        <CardHeader className="border-b border-muted/60 py-4 bg-muted/10">
                            <CardTitle className="text-base font-semibold flex items-center gap-2">
                                <Activity className="size-4 text-primary" />
                                Cash Flow Trend ({effectiveCurrency})
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 h-[350px] w-full dark:white">
                            <ResponsiveContainer
                                width="100%"
                                height="100%"
                                minHeight={300}
                            >
                                <AreaChart
                                    data={chartData}
                                    margin={{
                                        top: 10,
                                        right: 10,
                                        left: -20,
                                        bottom: 0,
                                    }}
                                >
                                    <defs>
                                        <linearGradient
                                            id="colorIncome"
                                            x1="0"
                                            y1="0"
                                            x2="0"
                                            y2="1"
                                        >
                                            <stop
                                                offset="5%"
                                                stopColor="#10b981"
                                                stopOpacity={0.3}
                                            />
                                            <stop
                                                offset="95%"
                                                stopColor="#10b981"
                                                stopOpacity={0}
                                            />
                                        </linearGradient>
                                        <linearGradient
                                            id="colorExpense"
                                            x1="0"
                                            y1="0"
                                            x2="0"
                                            y2="1"
                                        >
                                            <stop
                                                offset="5%"
                                                stopColor="#ef4444"
                                                stopOpacity={0.1}
                                            />
                                            <stop
                                                offset="95%"
                                                stopColor="#ef4444"
                                                stopOpacity={0}
                                            />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        vertical={false}
                                        stroke="#e5e7eb"
                                    />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 12, fill: "#6b7280" }}
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 12, fill: "#6b7280" }}
                                        tickFormatter={(value) => `$${value}`}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            borderRadius: "8px",
                                            border: "1px solid hsl(var(--border))",
                                            backgroundColor:
                                                "hsl(var(--background))",
                                        }}
                                        itemStyle={{
                                            fontSize: "14px",
                                            fontWeight: 600,
                                        }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="income"
                                        name="Income"
                                        stroke="#10b981"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorIncome)"
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="expense"
                                        name="Expense"
                                        stroke="#ef4444"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorExpense)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                )}

                {/* 5. SPLIT VIEW: Top Expenses & Account Summary */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                    {/* Top Expenses */}
                    <Card className="rounded-lg shadow-sm border-muted/60 overflow-hidden">
                        <CardHeader className="border-b border-muted/60 py-4 bg-muted/10">
                            <CardTitle className="text-base font-semibold flex items-center gap-2">
                                <TrendingDown className="size-4 text-red-500" />{" "}
                                Top Expenses
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            {!isTopExpensesLoading &&
                            (!topExpenses || !topExpenses.items.length) ? (
                                <div className="p-8 text-center text-muted-foreground font-medium">
                                    No expenses found for this period.
                                </div>
                            ) : (
                                <div className="divide-y divide-muted/60">
                                    {topExpenses?.items.map((item, i) => (
                                        <div
                                            key={item.transactionId}
                                            className="flex items-center justify-between p-4 hover:bg-muted/10 transition-colors"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="size-8 rounded-md bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">
                                                    #{i + 1}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-foreground leading-none">
                                                        {item.categoryName}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground font-medium mt-1">
                                                        {item.date} •{" "}
                                                        {item.accountName}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-foreground">
                                                    {item.amount.toLocaleString()}{" "}
                                                    <span className="text-xs text-muted-foreground font-medium">
                                                        {item.currency}
                                                    </span>
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Account Summary */}
                    <Card className="rounded-lg shadow-sm border-muted/60 overflow-hidden">
                        <CardHeader className="border-b border-muted/60 py-4 bg-muted/10">
                            <CardTitle className="text-base font-semibold flex items-center gap-2">
                                <Landmark className="size-4 text-primary" />{" "}
                                Balances Breakdown
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            {!isAccountSummaryLoading &&
                            (!accountSummary ||
                                !accountSummary.items.length) ? (
                                <div className="p-8 text-center text-muted-foreground font-medium">
                                    No account data found.
                                </div>
                            ) : (
                                <div className="divide-y divide-muted/60">
                                    {accountSummary?.items.map((item) => (
                                        <div
                                            key={item.accountId}
                                            className="flex items-center justify-between p-4 hover:bg-muted/10 transition-colors"
                                        >
                                            <div>
                                                <p className="font-semibold text-foreground leading-none">
                                                    {item.accountName}
                                                </p>
                                                <p className="text-xs text-muted-foreground font-medium mt-1">
                                                    {item.accountType} Account
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p
                                                    className={`font-bold ${item.currentBalance < 0 ? "text-red-500" : "text-foreground"}`}
                                                >
                                                    {item.currentBalance.toLocaleString()}{" "}
                                                    <span className="text-xs text-muted-foreground font-medium">
                                                        {item.currency}
                                                    </span>
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </PageContainer>
    );
}
