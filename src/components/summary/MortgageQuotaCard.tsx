import React from 'react';
import { Card } from '../ui';
import { formatCurrency } from '../../utils';

interface MortgageQuotaCardProps {
  monthlyMortgage: number;
  monthlyIbiAndCommunity: number;
  years: number;
  affordabilityRatio: number;
  monthlyIncome: number;
}

export function MortgageQuotaCard({
  monthlyMortgage,
  monthlyIbiAndCommunity,
  years,
  affordabilityRatio,
  monthlyIncome
}: MortgageQuotaCardProps) {
  const totalMonthly = monthlyMortgage + monthlyIbiAndCommunity;

  let effortColor = 'bg-emerald-400/20 text-emerald-100';
  let effortText = 'Saludable';
  let tooltipText = 'Tu cuota está dentro del límite recomendado del 30%';

  if (affordabilityRatio > 35) {
    effortColor = 'bg-red-400/20 text-red-100';
    effortText = 'Peligro';
    tooltipText = 'Tu cuota supera el límite de riesgo del 35%';
  } else if (affordabilityRatio > 30) {
    effortColor = 'bg-amber-400/20 text-amber-100';
    effortText = 'Precaución';
    tooltipText = 'Tu cuota está por encima del 30% recomendado';
  }

  return (
    <Card className="bg-indigo-600 text-white border-none flex flex-col">
      <div className="flex justify-between items-start mb-1">
        <div className="text-indigo-100 text-sm font-medium">Cuota Hipoteca</div>
        <div className="flex gap-2">
          {monthlyIncome > 0 && (
            <div className="relative group cursor-help">
              <div className={`text-xs px-2 py-0.5 rounded-none ${effortColor} border border-white/10`}>
                Esfuerzo: {affordabilityRatio.toFixed(1)}%
              </div>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-slate-800 text-white text-xs rounded-none shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 text-center">
                <span className="font-semibold block mb-0.5">{effortText}</span>
                {tooltipText}
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
              </div>
            </div>
          )}
          <div className="text-indigo-200 text-xs bg-indigo-500/40 px-2 py-0.5 rounded-none">{years} años</div>
        </div>
      </div>
      <div className="text-3xl font-bold mt-1">{formatCurrency(monthlyMortgage)}</div>
      
      <div className="text-indigo-200 text-xs mt-auto pt-4 flex-1 flex flex-col justify-end">
        <div className="bg-indigo-700/50 p-2.5 rounded-none">
          <div className="flex justify-between items-center mb-1.5">
            <span>Hipoteca:</span>
            <span>{formatCurrency(monthlyMortgage)}</span>
          </div>
          <div className="flex justify-between items-center mb-1.5">
            <span>IBI y Com.:</span>
            <span>+{formatCurrency(monthlyIbiAndCommunity)}</span>
          </div>
          <div className="flex justify-between items-center border-t border-indigo-400/30 pt-1.5 mt-1.5 font-semibold text-white">
            <span>Total Mensual:</span>
            <span>{formatCurrency(totalMonthly)}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
