import React, { Suspense } from "react";
import {
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Line,
  ComposedChart,
} from "recharts";
import { Card } from "../ui";
import { formatCurrency } from "../../utils";
import { useThemeContext } from "../ThemeProvider";

export function AmortizationChart({ data, className }: { data: any[]; className?: string }) {
  const [isMobile, setIsMobile] = React.useState(false);
  const { theme } = useThemeContext();
  const isDark = theme === "dark";

  const gridColor = isDark ? "#334155" : "#e2e8f0";
  const tickColor = isDark ? "#94a3b8" : "#64748b";
  const tooltipBackground = isDark ? "#0f172a" : "#ffffff";
  const tooltipBorder = isDark ? "#334155" : "#cbd5e1";
  const tooltipText = isDark ? "#e2e8f0" : "#0f172a";
  const balanceStroke = isDark ? "#818cf8" : "#4f46e5";
  const balanceGradient = isDark ? "#a5b4fc" : "#818cf8";
  const interestStroke = isDark ? "#fbbf24" : "#f59e0b";
  const interestFill = isDark ? "#422006" : "#fef3c7";
  const realPaymentStroke = isDark ? "#34d399" : "#10b981";
  const nominalPaymentStroke = isDark ? "#cbd5e1" : "#94a3b8";

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const renderMobileLegend = (props: any) => {
    const { payload } = props;
    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "8px 16px",
          marginTop: "12px",
          padding: "0 4px",
        }}
      >
        {payload.map((entry: any, index: number) => (
          <div key={index} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span
              style={{
                display: "inline-block",
                width: 14,
                height: 14,
                borderRadius: 3,
                backgroundColor: entry.color,
                flexShrink: 0,
                ...(entry.payload?.strokeDasharray
                  ? { background: "none", border: `2px dashed ${entry.color}`, borderRadius: 0 }
                  : {}),
              }}
            />
            <span style={{ fontSize: 11, color: tickColor, lineHeight: 1.3 }}>{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card className={className}>
      <h3 className="text-lg font-semibold mb-6">Evolución de la Deuda y Pagos</h3>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={balanceGradient} stopOpacity={0.3} />
                <stop offset="95%" stopColor={balanceGradient} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
            <XAxis
              dataKey="year"
              tickFormatter={(val) => `Año ${val}`}
              tick={{ fontSize: 12, fill: tickColor }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              yAxisId="left"
              tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`}
              tick={{ fontSize: 12, fill: tickColor }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tickFormatter={(val) => `${val.toFixed(0)}€`}
              tick={{ fontSize: 12, fill: tickColor }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              formatter={(value: number | string | undefined) => formatCurrency(Number(value) || 0)}
              labelFormatter={(label) => `Año ${label}`}
              contentStyle={{
                backgroundColor: tooltipBackground,
                border: `1px solid ${tooltipBorder}`,
                color: tooltipText,
              }}
              labelStyle={{ color: tooltipText }}
            />
            <Legend
              verticalAlign={isMobile ? "bottom" : "top"}
              height={isMobile ? 72 : 36}
              content={isMobile ? renderMobileLegend : undefined}
            />
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="balance"
              name="Capital Pendiente"
              stroke={balanceStroke}
              fillOpacity={1}
              fill="url(#colorBalance)"
            />
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="totalInterest"
              name="Intereses Acumulados"
              stroke={interestStroke}
              fill={interestFill}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="realMonthlyPayment"
              name="Cuota (Valor Real)"
              stroke={realPaymentStroke}
              strokeWidth={2}
              dot={false}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="monthlyPayment"
              name="Cuota (Nominal)"
              stroke={nominalPaymentStroke}
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
