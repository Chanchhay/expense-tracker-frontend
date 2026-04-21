"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

export interface AllocationDataPoint {
    name: string;
    value: number;
    color: string;
}

interface AllocationChartProps {
    data: AllocationDataPoint[];
}

export function AllocationChart({ data }: AllocationChartProps) {
    const totalValue = data.reduce((sum, item) => sum + item.value, 0);

    return (
        <div className="flex h-full w-full items-center justify-between gap-4 px-2">
            {/* The Donut Chart */}
            <div className="h-62.5 w-1/2 flex-1">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius="65%"
                            outerRadius="85%"
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
                            formatter={(value) => {
                                if (typeof value === "number") {
                                    return value.toLocaleString();
                                }
                                return value;
                            }}
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

            {/* Custom Legend */}
            <div className="flex w-1/2 flex-col gap-3">
                {data.map((item) => {
                    const percentage =
                        totalValue > 0
                            ? Math.round((item.value / totalValue) * 100)
                            : 0;

                    return (
                        <div
                            key={item.name}
                            className="flex items-center justify-between text-sm"
                        >
                            <div className="flex items-center gap-2">
                                <div
                                    className="size-3 rounded-full shrink-0"
                                    style={{ backgroundColor: item.color }}
                                />
                                <span className="font-medium text-muted-foreground truncate max-w-[100px]">
                                    {item.name}
                                </span>
                            </div>
                            <span className="font-semibold text-foreground">
                                {percentage}%
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
