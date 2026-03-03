import React from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Card } from '../ui';
import { formatCurrency } from '../../utils';

export function StressTestChart({ data, className }: { data: any[], className?: string }) {
  return (
    <Card className={className}>
      <h3 className="text-lg font-semibold mb-6">Impacto Subida de Tipos</h3>
      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis 
              dataKey="rate" 
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
              formatter={(value: number) => formatCurrency(value)}
              labelFormatter={(label) => `Tipo: ${label}`}
            />
            <Line 
              type="monotone" 
              dataKey="payment" 
              name="Cuota Mensual" 
              stroke="#ef4444" 
              strokeWidth={2}
              dot={{ r: 4, fill: '#ef4444' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
