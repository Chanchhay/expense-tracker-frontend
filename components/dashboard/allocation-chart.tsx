"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const data = [
    { name: "Housing", value: 1200, color: "#10b981" }, // Primary Green
    { name: "Food", value: 600, color: "#3b82f6" }, // Blue
    { name: "Transport", value: 400, color: "#f59e0b" }, // Amber
    { name: "Utilities", value: 300, color: "#8b5cf6" }, // Purple
];

export function AllocationChart({
    data,
}: {
    data: { name: string; value: number; color?: string }[];
}) {
    return (
        <div className="flex h-full w-full items-center justify-between">
            {/* The Donut Chart */}
            <div className="h-full w-1/2 min-w-[150px]">
                <ResponsiveContainer width="100%" height="100%" minHeight={300} minWidth={300} aspect={undefined}>
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                            cornerRadius={4}
                        >
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={entry.color}
                                />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                borderRadius: "12px",
                                border: "none",
                                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                            }}
                            itemStyle={{
                                fontSize: "14px",
                                fontWeight: 500,
                                color: "#111827",
                            }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            {/* Custom Legend to match sample */}
            <div className="flex w-1/2 flex-col gap-3 pl-4">
                {data.map((item) => (
                    <div
                        key={item.name}
                        className="flex items-center gap-2 text-sm"
                    >
                        <div
                            className="size-3 rounded-full"
                            style={{ backgroundColor: item.color }}
                        />
                        <span className="font-medium text-muted-foreground flex-1">
                            {item.name}
                        </span>
                        <span className="font-semibold">
                            {Math.round((item.value / 2500) * 100)}%
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
