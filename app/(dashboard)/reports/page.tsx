"use client";

import { useState } from "react";
import {
    useGetAccountSummaryQuery,
    useGetCashFlowQuery,
    useGetCategoryBreakdownQuery,
    useGetMonthlySummaryQuery,
    useGetTopExpensesQuery,
} from "@/features/reports/reports-api";

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
    } = useGetMonthlySummaryQuery(month);

    const {
        data: categoryBreakdown,
        isLoading: isCategoryBreakdownLoading,
        isError: isCategoryBreakdownError,
    } = useGetCategoryBreakdownQuery(month);

    const {
        data: topExpenses,
        isLoading: isTopExpensesLoading,
        isError: isTopExpensesError,
    } = useGetTopExpensesQuery({
        month,
        limit: Number(topExpenseLimit),
    });

    const {
        data: cashFlow,
        isLoading: isCashFlowLoading,
        isError: isCashFlowError,
    } = useGetCashFlowQuery({
        from: fromDate,
        to: toDate,
        groupBy,
    });

    const {
        data: accountSummary,
        isLoading: isAccountSummaryLoading,
        isError: isAccountSummaryError,
    } = useGetAccountSummaryQuery();

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Reports</h2>

            <div className="space-y-4 border rounded-md p-4">
                <h3 className="text-xl font-semibold">Filters</h3>

                <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-12 md:col-span-4">
                        <label className="mb-2 block text-sm font-medium">
                            Month
                        </label>
                        <input
                            type="month"
                            value={month}
                            onChange={(e) => setMonth(e.target.value)}
                            className="w-full rounded-md border px-3 py-2"
                        />
                    </div>

                    <div className="col-span-12 md:col-span-4">
                        <label className="mb-2 block text-sm font-medium">
                            Top Expenses Limit
                        </label>
                        <input
                            type="number"
                            min="1"
                            max="20"
                            value={topExpenseLimit}
                            onChange={(e) => setTopExpenseLimit(e.target.value)}
                            className="w-full rounded-md border px-3 py-2"
                        />
                    </div>

                    <div className="col-span-12 md:col-span-4">
                        <label className="mb-2 block text-sm font-medium">
                            Group By
                        </label>
                        <select
                            value={groupBy}
                            onChange={(e) => setGroupBy(e.target.value)}
                            className="w-full rounded-md border px-3 py-2"
                        >
                            <option value="DAY">DAY</option>
                            <option value="WEEK">WEEK</option>
                            <option value="MONTH">MONTH</option>
                        </select>
                    </div>

                    <div className="col-span-12 md:col-span-6">
                        <label className="mb-2 block text-sm font-medium">
                            From
                        </label>
                        <input
                            type="date"
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                            className="w-full rounded-md border px-3 py-2"
                        />
                    </div>

                    <div className="col-span-12 md:col-span-6">
                        <label className="mb-2 block text-sm font-medium">
                            To
                        </label>
                        <input
                            type="date"
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                            className="w-full rounded-md border px-3 py-2"
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-4 border rounded-md p-4">
                <h3 className="text-xl font-semibold">Monthly Summary</h3>

                {isMonthlySummaryLoading ? (
                    <p>Loading monthly summary...</p>
                ) : isMonthlySummaryError || !monthlySummary ? (
                    <p>Failed to load monthly summary.</p>
                ) : (
                    <div className="grid gap-4 md:grid-cols-3">
                        <div className="border rounded-md p-4">
                            <p className="font-medium">Total Income</p>
                            <p>{monthlySummary.totalIncome}</p>
                        </div>

                        <div className="border rounded-md p-4">
                            <p className="font-medium">Total Expense</p>
                            <p>{monthlySummary.totalExpense}</p>
                        </div>

                        <div className="border rounded-md p-4">
                            <p className="font-medium">Net Balance</p>
                            <p>{monthlySummary.netBalance}</p>
                        </div>
                    </div>
                )}
            </div>

            <div className="space-y-4 border rounded-md p-4">
                <h3 className="text-xl font-semibold">Category Breakdown</h3>

                {isCategoryBreakdownLoading ? (
                    <p>Loading category breakdown...</p>
                ) : isCategoryBreakdownError || !categoryBreakdown ? (
                    <p>Failed to load category breakdown.</p>
                ) : !categoryBreakdown.items.length ? (
                    <p>No category breakdown data found.</p>
                ) : (
                    <div className="space-y-3">
                        <p>Total Expense: {categoryBreakdown.totalExpense}</p>

                        {categoryBreakdown.items.map((item) => (
                            <div
                                key={item.categoryId}
                                className="border rounded-md p-4"
                            >
                                <p className="font-medium">
                                    {item.categoryName}
                                </p>
                                <p className="text-sm">Amount: {item.amount}</p>
                                <p className="text-sm">
                                    Percentage: {item.percentage}%
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="space-y-4 border rounded-md p-4">
                <h3 className="text-xl font-semibold">Top Expenses</h3>

                {isTopExpensesLoading ? (
                    <p>Loading top expenses...</p>
                ) : isTopExpensesError || !topExpenses ? (
                    <p>Failed to load top expenses.</p>
                ) : !topExpenses.items.length ? (
                    <p>No top expenses found.</p>
                ) : (
                    <div className="space-y-3">
                        {topExpenses.items.map((item) => (
                            <div
                                key={item.transactionId}
                                className="border rounded-md p-4"
                            >
                                <p className="font-medium">
                                    {item.categoryName} - {item.amount}{" "}
                                    {item.currency}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {item.accountName} | {item.date}
                                </p>
                                {item.note && (
                                    <p className="text-sm">Note: {item.note}</p>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="space-y-4 border rounded-md p-4">
                <h3 className="text-xl font-semibold">Cash Flow</h3>

                {isCashFlowLoading ? (
                    <p>Loading cash flow...</p>
                ) : isCashFlowError || !cashFlow ? (
                    <p>Failed to load cash flow.</p>
                ) : !cashFlow.items.length ? (
                    <p>No cash flow data found.</p>
                ) : (
                    <div className="space-y-3">
                        {cashFlow.items.map((item) => (
                            <div
                                key={item.period}
                                className="border rounded-md p-4"
                            >
                                <p className="font-medium">
                                    Period: {item.period}
                                </p>
                                <p className="text-sm">Income: {item.income}</p>
                                <p className="text-sm">
                                    Expense: {item.expense}
                                </p>
                                <p className="text-sm">Net: {item.net}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="space-y-4 border rounded-md p-4">
                <h3 className="text-xl font-semibold">Account Summary</h3>

                {isAccountSummaryLoading ? (
                    <p>Loading account summary...</p>
                ) : isAccountSummaryError || !accountSummary ? (
                    <p>Failed to load account summary.</p>
                ) : (
                    <div className="space-y-4">
                        <div className="border rounded-md p-4">
                            <p className="font-medium">Total Current Balance</p>
                            <p>{accountSummary.totalCurrentBalance}</p>
                        </div>

                        {!accountSummary.items.length ? (
                            <p>No account summary items found.</p>
                        ) : (
                            <div className="space-y-3">
                                {accountSummary.items.map((item) => (
                                    <div
                                        key={item.accountId}
                                        className="border rounded-md p-4"
                                    >
                                        <p className="font-medium">
                                            {item.accountName}
                                        </p>
                                        <p className="text-sm">
                                            Type: {item.accountType}
                                        </p>
                                        <p className="text-sm">
                                            Currency: {item.currency}
                                        </p>
                                        <p className="text-sm">
                                            Initial Balance:{" "}
                                            {item.initialBalance}
                                        </p>
                                        <p className="text-sm">
                                            Current Balance:{" "}
                                            {item.currentBalance}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
