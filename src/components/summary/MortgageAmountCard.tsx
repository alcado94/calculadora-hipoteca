import React from 'react';
import { Card } from '../ui';
import { formatCurrency } from '../../utils';

interface MortgageAmountCardProps {
  loanAmount: number;
  ltv: number;
  totalInterestPaid: number;
  totalCostOfProperty: number;
  downPayment: number;
  totalExpenses: number;
  monthlyIbiAndCommunity: number;
  years: number;
}

export function MortgageAmountCard({
  loanAmount,
  ltv,
  totalInterestPaid,
  totalCostOfProperty,
  downPayment,
  totalExpenses,
  monthlyIbiAndCommunity,
  years
}: MortgageAmountCardProps) {
  return (
    <Card className="flex flex-col">
      <div className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">Importe Hipoteca</div>
      <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{formatCurrency(loanAmount)}</div>
      
      <div className="mt-auto pt-4 flex-1 flex flex-col justify-end">
        <div className="bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-none border border-slate-100 dark:border-slate-700 text-xs">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-slate-500 dark:text-slate-400">% Financiación:</span>
            <span className="font-medium text-slate-700 dark:text-slate-200">{ltv.toFixed(1)}%</span>
          </div>
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-slate-500 dark:text-slate-400">Intereses totales:</span>
            <span className="font-medium text-amber-600 dark:text-amber-400">{formatCurrency(totalInterestPaid)}</span>
          </div>
          <div className="flex justify-between items-center border-t border-slate-200 dark:border-slate-700 pt-1.5 mt-1.5">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Coste Total Operación:</span>
            <span className="font-bold text-indigo-700 dark:text-indigo-400">{formatCurrency(totalCostOfProperty)}</span>
          </div>
          
          <div className="mt-2">
            <div className="h-1.5 w-full rounded-none flex overflow-hidden mb-2">
              <div className="bg-blue-500 h-full" style={{ width: `${((loanAmount + downPayment) / totalCostOfProperty) * 100}%` }}></div>
              <div className="bg-amber-500 h-full" style={{ width: `${(totalInterestPaid / totalCostOfProperty) * 100}%` }}></div>
              <div className="bg-red-500 h-full" style={{ width: `${(totalExpenses / totalCostOfProperty) * 100}%` }}></div>
              <div className="bg-emerald-500 h-full" style={{ width: `${((monthlyIbiAndCommunity * 12 * years) / totalCostOfProperty) * 100}%` }}></div>
            </div>
            
            <div className="grid grid-cols-2 gap-x-1 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-none bg-blue-500"></div>Inmueble ({(((loanAmount + downPayment) / totalCostOfProperty) * 100).toFixed(0)}%)</div>
              <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-none bg-amber-500"></div>Intereses ({((totalInterestPaid / totalCostOfProperty) * 100).toFixed(0)}%)</div>
              <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-none bg-red-500"></div>Impuestos ({((totalExpenses / totalCostOfProperty) * 100).toFixed(0)}%)</div>
              <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-none bg-emerald-500"></div>IBI/Com. ({(((monthlyIbiAndCommunity * 12 * years) / totalCostOfProperty) * 100).toFixed(0)}%)</div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
