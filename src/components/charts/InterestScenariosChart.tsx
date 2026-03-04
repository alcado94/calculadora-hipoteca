import React from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, BarChart, Bar } from 'recharts';
import { Card } from '../ui';
import { formatCurrency } from '../../utils';

export function InterestScenariosChart({ data, className }: { data: any[], className?: string }) {
  return (
    <Card className={className}>
      <h3 className="text-lg font-semibold mb-6">Escenarios Macro (+1%, +2%, +3%)</h3>
      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis 
              dataKey="scenario" 
              tick={{ fontSize: 12, fill: '#64748b' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              domain={['auto', 'auto']}
              tickFormatter={(val) => `${val.toFixed(0)}€`}
              tick={{ fontSize: 12, fill: '#64748b' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip 
              formatter={(value: number | string | undefined) => formatCurrency(Number(value) || 0)}
              labelFormatter={(label, payload) => {
                if (payload && payload.length > 0) {
                  return `Escenario: ${label} (${payload[0].payload.rate})`;
                }
                return label;
              }}
              cursor={{ fill: '#f8fafc' }}
            />
            <Bar dataKey="payment" name="Cuota Mensual" radius={[4, 4, 0, 0]} maxBarSize={50}>
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.isCurrent ? '#4f46e5' : '#f43f5e'} 
                  fillOpacity={entry.isCurrent ? 1 : 0.5 + (index * 0.15)} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
