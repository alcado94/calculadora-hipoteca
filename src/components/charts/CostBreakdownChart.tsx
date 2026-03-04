import React from 'react';
import { Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Card } from '../ui';
import { formatCurrency } from '../../utils';
import { useThemeContext } from '../ThemeProvider';

export function CostBreakdownChart({ data, totalCost, className }: { data: any[], totalCost: number, className?: string }) {
  const { theme } = useThemeContext();
  const isDark = theme === 'dark';

  return (
    <Card className={className}>
      <h3 className="text-lg font-semibold mb-6">Coste Total de la Operación</h3>
      <div className="h-[250px] w-full flex flex-col items-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="45%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number | string | undefined) => formatCurrency(Number(value) || 0)}
              contentStyle={{ backgroundColor: isDark ? '#0f172a' : '#ffffff', border: `1px solid ${isDark ? '#334155' : '#cbd5e1'}`, color: isDark ? '#e2e8f0' : '#0f172a' }}
            />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
        <div className="text-center mt-[-20px]">
          <div className="text-xs text-slate-500 dark:text-slate-400">Coste Total</div>
          <div className="font-bold text-lg text-slate-900 dark:text-slate-100">{formatCurrency(totalCost)}</div>
        </div>
      </div>
    </Card>
  );
}
