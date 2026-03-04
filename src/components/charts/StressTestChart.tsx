import React from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Card } from '../ui';
import { formatCurrency } from '../../utils';
import { useThemeContext } from '../ThemeProvider';

export function StressTestChart({ data, className }: { data: any[], className?: string }) {
  const { theme } = useThemeContext();
  const isDark = theme === 'dark';
  const gridColor = isDark ? '#334155' : '#e2e8f0';
  const tickColor = isDark ? '#94a3b8' : '#64748b';
  const lineColor = isDark ? '#fb7185' : '#ef4444';

  return (
    <Card className={className}>
      <h3 className="text-lg font-semibold mb-6">Impacto Subida de Tipos</h3>
      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
            <XAxis 
              dataKey="rate" 
              tick={{ fontSize: 12, fill: tickColor }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              domain={['auto', 'auto']}
              tickFormatter={(val) => `${val.toFixed(0)}€`}
              tick={{ fontSize: 12, fill: tickColor }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip 
              formatter={(value: number | string | undefined) => formatCurrency(Number(value) || 0)}
              labelFormatter={(label) => `Tipo: ${label}`}
              contentStyle={{ backgroundColor: isDark ? '#0f172a' : '#ffffff', border: `1px solid ${isDark ? '#334155' : '#cbd5e1'}`, color: isDark ? '#e2e8f0' : '#0f172a' }}
            />
            <Line 
              type="monotone" 
              dataKey="payment" 
              name="Cuota Mensual" 
              stroke={lineColor}
              strokeWidth={2}
              dot={{ r: 4, fill: lineColor }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
