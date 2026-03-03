import React from 'react';
import { Target, TrendingUp, AlertTriangle } from 'lucide-react';
import { Card } from './ui';
import { formatCurrency } from '../utils';

interface ViabilityAnalysisProps {
  monthlyIncome: number;
  maxLoanAmount: number;
  currentLoanAmount: number;
  savings: number;
}

export function ViabilityAnalysis({ 
  monthlyIncome, 
  maxLoanAmount, 
  currentLoanAmount,
  savings
}: ViabilityAnalysisProps) {
  const maxPropertyValue = maxLoanAmount + savings;
  const isViable = currentLoanAmount <= maxLoanAmount;
  const maxMonthlyPayment = monthlyIncome * 0.35; // 35% effort ratio

  return (
    <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white border-none">
      <div className="flex items-center gap-2 mb-6">
        <Target className="w-5 h-5 text-indigo-400" />
        <h3 className="text-lg font-semibold">Análisis de Viabilidad</h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div>
          <div className="text-slate-400 text-sm mb-1">Préstamo Máximo Recomendado</div>
          <div className="text-3xl font-bold text-white">{formatCurrency(maxLoanAmount)}</div>
          <div className="text-slate-400 text-xs mt-1">
            Basado en cuota máx. de {formatCurrency(maxMonthlyPayment)} (35% ingresos)
          </div>
        </div>
        
        <div>
          <div className="text-slate-400 text-sm mb-1">Precio Máximo de Compra</div>
          <div className="text-2xl font-bold text-indigo-300">{formatCurrency(maxPropertyValue)}</div>
          <div className="text-slate-400 text-xs mt-1">
            Sumando tus ahorros actuales ({formatCurrency(savings)})
          </div>
        </div>

        <div className={`p-4 rounded-none flex items-start gap-3 h-full ${
          isViable 
            ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-100' 
            : 'bg-red-500/20 border border-red-500/30 text-red-100'
        }`}>
          {isViable ? (
            <TrendingUp className="w-5 h-5 shrink-0 mt-0.5 text-emerald-400" />
          ) : (
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-red-400" />
          )}
          <div>
            <h4 className="font-semibold text-sm mb-1">
              {isViable ? 'Operación Viable' : 'Operación de Alto Riesgo'}
            </h4>
            <p className="text-sm opacity-90">
              {isViable 
                ? `El préstamo solicitado (${formatCurrency(currentLoanAmount)}) está por debajo de tu límite máximo recomendado.`
                : `El préstamo solicitado supera tu límite máximo recomendado por ${formatCurrency(currentLoanAmount - maxLoanAmount)}.`
              }
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
