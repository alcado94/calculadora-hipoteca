import React from 'react';
import { Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Line, ComposedChart } from 'recharts';
import { Card } from '../ui';
import { formatCurrency } from '../../utils';

export function AmortizationChart({ data, className }: { data: any[], className?: string }) {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const renderMobileLegend = (props: any) => {
    const { payload } = props;
    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px', marginTop: '12px', padding: '0 4px' }}>
        {payload.map((entry: any, index: number) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{
              display: 'inline-block',
              width: 14,
              height: 14,
              borderRadius: 3,
              backgroundColor: entry.color,
              flexShrink: 0,
              ...(entry.payload?.strokeDasharray ? { background: 'none', border: `2px dashed ${entry.color}`, borderRadius: 0 } : {})
            }} />
            <span style={{ fontSize: 11, color: '#475569', lineHeight: 1.3 }}>{entry.value}</span>
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
                <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis 
              dataKey="year" 
              tickFormatter={(val) => `Año ${val}`}
              tick={{ fontSize: 12, fill: '#64748b' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              yAxisId="left"
              tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`}
              tick={{ fontSize: 12, fill: '#64748b' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              tickFormatter={(val) => `${val.toFixed(0)}€`}
              tick={{ fontSize: 12, fill: '#64748b' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip 
              formatter={(value: number) => formatCurrency(value)}
              labelFormatter={(label) => `Año ${label}`}
            />
            <Legend
              verticalAlign={isMobile ? 'bottom' : 'top'}
              height={isMobile ? 72 : 36}
              content={isMobile ? renderMobileLegend : undefined}
            />
            <Area 
              yAxisId="left"
              type="monotone" 
              dataKey="balance" 
              name="Capital Pendiente" 
              stroke="#4f46e5" 
              fillOpacity={1} 
              fill="url(#colorBalance)" 
            />
            <Area 
              yAxisId="left"
              type="monotone" 
              dataKey="totalInterest" 
              name="Intereses Acumulados" 
              stroke="#f59e0b" 
              fill="#fef3c7" 
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="realMonthlyPayment"
              name="Cuota (Valor Real)"
              stroke="#10b981"
              strokeWidth={2}
              dot={false}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="monthlyPayment"
              name="Cuota (Nominal)"
              stroke="#94a3b8"
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
