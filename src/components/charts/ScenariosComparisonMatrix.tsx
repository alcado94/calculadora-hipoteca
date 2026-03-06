import React, { useMemo } from "react";
import { Plus, RotateCcw, Trash2, TrendingDown, TrendingUp } from "lucide-react";
import { cn, formatCurrency } from "../../utils";
import { Card } from "../ui/ui";
import type { ScenarioInput, ScenarioComparison } from "../../types/scenarios";

interface ScenariosComparisonMatrixProps {
  data: ScenarioComparison[];
  onAddScenario: () => void;
  onUpdateScenario: (id: string, patch: Partial<ScenarioInput>) => void;
  onResetScenario: (id: string) => void;
  onRemoveScenario: (id: string) => void;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function ScenariosComparisonMatrix({
  data,
  onAddScenario,
  onUpdateScenario,
  onResetScenario,
  onRemoveScenario,
}: ScenariosComparisonMatrixProps) {
  const requiredEntryExtremes = useMemo(() => {
    if (data.length === 0) {
      return { min: 0, max: 0 };
    }

    const values = data.map((item) => item.requiredEntry);
    return {
      min: Math.min(...values),
      max: Math.max(...values),
    };
  }, [data]);

  return (
    <Card className="overflow-hidden p-0">
      <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Matriz de comparación
        </h3>
        <button
          type="button"
          onClick={onAddScenario}
          className="inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-none transition-colors"
        >
          <Plus className="w-4 h-4" />
          Añadir escenario
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-600 dark:text-slate-400">
          <thead className="text-xs text-slate-500 dark:text-slate-400 uppercase bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th className="px-5 py-3 font-medium">Escenario</th>
              <th className="px-5 py-3 font-medium text-right">Interés</th>
              <th className="px-5 py-3 font-medium text-right">LTV</th>
              <th className="px-5 py-3 font-medium text-right">Años</th>
              <th className="px-5 py-3 font-medium text-right">Entrada necesaria</th>
              <th className="px-5 py-3 font-medium text-right">Cuota</th>
              <th className="px-5 py-3 font-medium text-right">Delta cuota</th>
              <th className="px-5 py-3 font-medium text-right">Coste total</th>
              <th className="px-5 py-3 font-medium text-right">Delta coste</th>
              <th className="px-5 py-3 font-medium text-right">Cuota real final</th>
              <th className="px-5 py-3 font-medium text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => {
              const isGain = item.totalCostDelta < 0;
              const isLoss = item.totalCostDelta > 0;

              return (
                <tr
                  key={item.id}
                  className={cn(
                    "border-b border-slate-100 dark:border-slate-800 last:border-0",
                    item.isBaseline && "bg-indigo-50/40 dark:bg-indigo-900/20"
                  )}
                >
                  <td className="px-5 py-3 font-medium text-slate-900 dark:text-slate-100">
                    {item.isBaseline ? (
                      item.name
                    ) : (
                      <input
                        aria-label={`Nombre de ${item.name}`}
                        type="text"
                        value={item.name}
                        onChange={(e) => onUpdateScenario(item.id, { name: e.target.value })}
                        className="w-40 rounded-none border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-2 py-1.5 text-xs text-slate-900 dark:text-slate-100 focus:border-indigo-500 dark:focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                      />
                    )}
                  </td>
                  <td className="px-5 py-3 text-right">
                    {item.isBaseline ? (
                      `${item.interestRate.toFixed(2)}%`
                    ) : (
                      <input
                        aria-label={`Interés de ${item.name}`}
                        type="number"
                        min={0}
                        step={0.05}
                        value={item.interestRate}
                        onChange={(e) => {
                          const value = Number(e.target.value);
                          onUpdateScenario(item.id, {
                            interestRate: Number.isNaN(value) ? 0 : Math.max(0, value),
                          });
                        }}
                        className="w-20 ml-auto text-right rounded-none border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-2 py-1.5 text-xs text-slate-900 dark:text-slate-100 focus:border-indigo-500 dark:focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                      />
                    )}
                  </td>
                  <td className="px-5 py-3 text-right">
                    {item.isBaseline ? (
                      `${item.ltv.toFixed(0)}%`
                    ) : (
                      <input
                        aria-label={`LTV de ${item.name}`}
                        type="number"
                        min={0}
                        max={100}
                        step={1}
                        value={item.ltv}
                        onChange={(e) => {
                          const value = Number(e.target.value);
                          onUpdateScenario(item.id, {
                            ltv: Number.isNaN(value) ? 0 : clamp(value, 0, 100),
                          });
                        }}
                        className="w-20 ml-auto text-right rounded-none border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-2 py-1.5 text-xs text-slate-900 dark:text-slate-100 focus:border-indigo-500 dark:focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                      />
                    )}
                  </td>
                  <td className="px-5 py-3 text-right">
                    {item.isBaseline ? (
                      item.years
                    ) : (
                      <input
                        aria-label={`Años de ${item.name}`}
                        type="number"
                        min={1}
                        max={40}
                        step={1}
                        value={item.years}
                        onChange={(e) => {
                          const value = Number(e.target.value);
                          onUpdateScenario(item.id, {
                            years: Number.isNaN(value) ? 1 : clamp(value, 1, 40),
                          });
                        }}
                        className="w-16 ml-auto text-right rounded-none border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-2 py-1.5 text-xs text-slate-900 dark:text-slate-100 focus:border-indigo-500 dark:focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                      />
                    )}
                  </td>
                  <td
                    className={cn(
                      "px-5 py-3 text-right",
                      requiredEntryExtremes.max !== requiredEntryExtremes.min &&
                        item.requiredEntry === requiredEntryExtremes.max &&
                        "text-rose-600 dark:text-rose-400 font-semibold",
                      requiredEntryExtremes.max !== requiredEntryExtremes.min &&
                        item.requiredEntry === requiredEntryExtremes.min &&
                        "text-emerald-600 dark:text-emerald-400 font-semibold"
                    )}
                  >
                    {formatCurrency(item.requiredEntry)}
                  </td>
                  <td className="px-5 py-3 text-right">{formatCurrency(item.monthlyPayment)}</td>
                  <td className="px-5 py-3 text-right">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1",
                        item.paymentDelta < 0 && "text-emerald-600 dark:text-emerald-400",
                        item.paymentDelta > 0 && "text-rose-600 dark:text-rose-400"
                      )}
                    >
                      {item.paymentDelta < 0 && <TrendingDown className="w-3 h-3" />}
                      {item.paymentDelta > 0 && <TrendingUp className="w-3 h-3" />}
                      {item.paymentDelta === 0
                        ? "0"
                        : `${item.paymentDelta > 0 ? "+" : ""}${formatCurrency(item.paymentDelta)} (${item.paymentDeltaPercent.toFixed(2)}%)`}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">{formatCurrency(item.totalCost)}</td>
                  <td className="px-5 py-3 text-right">
                    <span
                      className={cn(
                        isGain && "text-emerald-600 dark:text-emerald-400",
                        isLoss && "text-rose-600 dark:text-rose-400"
                      )}
                    >
                      {item.totalCostDelta === 0
                        ? "0"
                        : `${item.totalCostDelta > 0 ? "+" : ""}${formatCurrency(item.totalCostDelta)} (${item.totalCostDeltaPercent.toFixed(2)}%)`}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    {formatCurrency(item.realMonthlyPaymentEnd)}
                  </td>
                  <td className="px-5 py-3">
                    {item.isBaseline ? (
                      <span className="text-xs text-slate-500 dark:text-slate-400">Base</span>
                    ) : (
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => onResetScenario(item.id)}
                          className="inline-flex items-center justify-center gap-1 px-2 py-1.5 text-xs font-medium border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-none transition-colors"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          Baseline
                        </button>
                        <button
                          type="button"
                          onClick={() => onRemoveScenario(item.id)}
                          className="inline-flex items-center justify-center gap-1 px-2 py-1.5 text-xs font-medium border border-rose-300 dark:border-rose-700 text-rose-700 dark:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-none transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Eliminar
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="px-5 py-4 text-xs text-slate-500 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800">
        La cuota real final se estima en euros de hoy aplicando la inflación global durante todo el
        plazo hipotecario.
      </p>
    </Card>
  );
}
