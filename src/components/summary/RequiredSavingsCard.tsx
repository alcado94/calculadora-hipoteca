import React from "react";
import { Card } from "../ui/ui";
import { formatCurrency } from "../../utils";

interface RequiredSavingsCardProps {
  totalInitialCash: number;
  downPayment: number;
  totalExpenses: number;
  missingSavings: number;
  savings: number;
  monthlySavings: number;
  monthsToSave: number;
  yearsToSave: number;
  isSavingsRealistic: boolean;
  freeIncome: number;
  equivalentRent: number;
  monthlyIncome: number;
}

export function RequiredSavingsCard({
  totalInitialCash,
  downPayment,
  totalExpenses,
  missingSavings,
  savings,
  monthlySavings,
  monthsToSave,
  yearsToSave,
  isSavingsRealistic,
  freeIncome,
  equivalentRent,
  monthlyIncome,
}: RequiredSavingsCardProps) {
  return (
    <Card className="flex flex-col">
      <div className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">
        Ahorro Necesario (Entrada + Gastos)
      </div>
      <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
        {formatCurrency(totalInitialCash)}
      </div>

      <div className="mt-auto pt-4 flex-1 flex flex-col justify-end">
        <div className="mb-2 space-y-2">
          {monthlyIncome > 0 && !isSavingsRealistic && monthlySavings > 0 && (
            <div className="bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-300 p-2 rounded-none text-xs border border-red-100 dark:border-red-800">
              ⚠️ <strong>Poco realista:</strong> Tu alquiler ({formatCurrency(equivalentRent)}) +
              ahorro ({formatCurrency(monthlySavings)}) superan tus ingresos.
            </div>
          )}
          {monthlyIncome > 0 && isSavingsRealistic && monthlySavings > 0 && freeIncome < 400 && (
            <div className="bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 p-2 rounded-none text-xs border border-amber-100 dark:border-amber-800">
              ⚠️ <strong>Ajustado:</strong> Te quedan {formatCurrency(freeIncome)}/mes para otros
              gastos de vida.
            </div>
          )}
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-none border border-slate-100 dark:border-slate-700 text-xs">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-slate-500 dark:text-slate-400">Entrada a aportar:</span>
            <span className="font-medium text-slate-700 dark:text-slate-200">
              {formatCurrency(downPayment)}
            </span>
          </div>
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-slate-500 dark:text-slate-400">Gastos e impuestos:</span>
            <span className="font-medium text-slate-700 dark:text-slate-200">
              {formatCurrency(totalExpenses)}
            </span>
          </div>

          {savings > 0 ? (
            <>
              <div className="flex justify-between items-center border-t border-slate-200 dark:border-slate-700 pt-1.5 mt-1.5">
                <span className="text-slate-500 dark:text-slate-400 font-medium">
                  Falta por ahorrar:
                </span>
                <span className="font-semibold text-amber-600 dark:text-amber-400">
                  {formatCurrency(missingSavings)}
                </span>
              </div>

              {missingSavings > 0 && monthlySavings > 0 && (
                <div className="border-t border-slate-200 dark:border-slate-700 pt-1.5 mt-1.5">
                  <div className="text-slate-500 dark:text-slate-400 mb-0.5">
                    Tiempo estimado para ahorrar lo que falta:
                  </div>
                  <div className="font-semibold text-slate-700 dark:text-slate-200">
                    {monthsToSave} meses{" "}
                    <span className="font-normal text-slate-500 dark:text-slate-400">
                      ({yearsToSave} años)
                    </span>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="border-t border-slate-200 dark:border-slate-700 pt-1.5 mt-1.5 text-slate-400 dark:text-slate-500 italic">
              Introduce tu ahorro actual para ver cuánto te falta
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
