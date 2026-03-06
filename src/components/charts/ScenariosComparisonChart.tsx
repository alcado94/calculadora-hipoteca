import React from "react";
import {
  CartesianGrid,
  ComposedChart,
  Bar,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from "recharts";
import { Card } from "../ui/ui";
import { formatCurrency } from "../../utils";
import { useThemeContext } from "../ui/ThemeProvider";
import type { ScenarioComparison } from "../../types/scenarios";

interface ScenariosComparisonChartProps {
  data: ScenarioComparison[];
  className?: string;
}

export function ScenariosComparisonChart({ data, className }: ScenariosComparisonChartProps) {
  const { theme } = useThemeContext();
  const isDark = theme === "dark";
  const gridColor = isDark ? "#334155" : "#e2e8f0";
  const tickColor = isDark ? "#94a3b8" : "#64748b";
  const lineColor = isDark ? "#fbbf24" : "#d97706";

  return (
    <Card className={className}>
      <h3 className="text-lg font-semibold mb-2">Comparativa de escenarios</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
        Barra: cuota mensual. Línea: variación de cuota frente al baseline.
      </p>

      <div className="h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12, fill: tickColor }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              yAxisId="payment"
              tickFormatter={(val) => `${Math.round(val)}€`}
              tick={{ fontSize: 12, fill: tickColor }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              yAxisId="delta"
              orientation="right"
              tickFormatter={(val) => `${val.toFixed(0)}%`}
              tick={{ fontSize: 12, fill: tickColor }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              formatter={(value: number | string | undefined, name) => {
                const numericValue = Number(value) || 0;
                if (name === "Cuota") return formatCurrency(numericValue);
                return `${numericValue.toFixed(2)}%`;
              }}
              labelFormatter={(label, payload) => {
                const item = payload?.[0]?.payload as ScenarioComparison | undefined;
                if (!item) return label;

                return `${item.name} · ${item.interestRate.toFixed(2)}% interés · ${item.ltv.toFixed(0)}% LTV · ${item.years} años`;
              }}
              contentStyle={{
                backgroundColor: isDark ? "#0f172a" : "#ffffff",
                border: `1px solid ${isDark ? "#334155" : "#cbd5e1"}`,
                color: isDark ? "#e2e8f0" : "#0f172a",
              }}
            />

            <Bar yAxisId="payment" dataKey="monthlyPayment" name="Cuota" maxBarSize={64}>
              {data.map((entry) => (
                <Cell
                  key={entry.id}
                  fill={entry.isBaseline ? (isDark ? "#818cf8" : "#4f46e5") : "#0ea5e9"}
                  fillOpacity={entry.isBaseline ? 1 : 0.75}
                />
              ))}
            </Bar>

            <Line
              yAxisId="delta"
              type="monotone"
              dataKey="paymentDeltaPercent"
              name="Delta % vs baseline"
              stroke={lineColor}
              strokeWidth={2}
              dot={{ r: 4, fill: lineColor }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
