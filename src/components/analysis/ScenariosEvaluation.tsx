import React, { useMemo, useRef, useState } from "react";
import { calculateMortgage, formatCurrency } from "../../utils";
import { Card } from "../ui/ui";
import { ScenariosComparisonChart } from "../charts/ScenariosComparisonChart";
import { ScenariosComparisonMatrix } from "../charts/ScenariosComparisonMatrix";
import type { ScenarioComparison, ScenarioInput } from "../../types/scenarios";

interface ScenariosEvaluationProps {
  propertyValue: number;
  years: number;
  inflationRate: number;
  totalExpenses: number;
  annualIbiAndCommunity: number;
  baselineInterestRate: number;
  baselineLtv: number;
}

function safePercentDelta(current: number, baseline: number) {
  if (baseline === 0) return 0;
  return (current / baseline - 1) * 100;
}

export function ScenariosEvaluation({
  propertyValue,
  years,
  inflationRate,
  totalExpenses,
  annualIbiAndCommunity,
  baselineInterestRate,
  baselineLtv,
}: ScenariosEvaluationProps) {
  const nextId = useRef(4);
  const [scenarios, setScenarios] = useState<ScenarioInput[]>([
    {
      id: "scenario-1",
      name: "Conservador",
      interestRate: Math.max(0, baselineInterestRate - 0.5),
      ltv: Math.max(0, baselineLtv - 10),
      years,
    },
    {
      id: "scenario-2",
      name: "Mercado +0.75",
      interestRate: baselineInterestRate + 0.75,
      ltv: baselineLtv,
      years,
    },
    {
      id: "scenario-3",
      name: "Mayor financiación",
      interestRate: baselineInterestRate + 0.4,
      ltv: Math.min(100, baselineLtv + 10),
      years,
    },
  ]);

  const baselineLoanAmount = propertyValue * (baselineLtv / 100);
  const baselineRequiredEntry = Math.max(0, propertyValue - baselineLoanAmount);
  const baselineMonthlyPayment =
    years > 0 ? calculateMortgage(baselineLoanAmount, baselineInterestRate, years) : 0;
  const baselineTotalInterest = baselineMonthlyPayment * years * 12 - baselineLoanAmount;
  const baselineTotalCost =
    propertyValue + totalExpenses + baselineTotalInterest + annualIbiAndCommunity * years;
  const baselineRealPaymentEnd =
    years > 0 ? baselineMonthlyPayment / Math.pow(1 + inflationRate / 100, years) : 0;

  const comparisonData = useMemo<ScenarioComparison[]>(() => {
    const base: ScenarioComparison = {
      id: "baseline",
      name: "Baseline",
      interestRate: baselineInterestRate,
      ltv: baselineLtv,
      years,
      requiredEntry: baselineRequiredEntry,
      loanAmount: baselineLoanAmount,
      monthlyPayment: baselineMonthlyPayment,
      realMonthlyPaymentEnd: baselineRealPaymentEnd,
      totalInterest: baselineTotalInterest,
      totalCost: baselineTotalCost,
      paymentDelta: 0,
      paymentDeltaPercent: 0,
      totalCostDelta: 0,
      totalCostDeltaPercent: 0,
      isBaseline: true,
    };

    const computed = scenarios.map((scenario) => {
      const loanAmount = propertyValue * (scenario.ltv / 100);
      const requiredEntry = Math.max(0, propertyValue - loanAmount);
      const monthlyPayment =
        scenario.years > 0
          ? calculateMortgage(loanAmount, scenario.interestRate, scenario.years)
          : 0;
      const totalInterest = monthlyPayment * scenario.years * 12 - loanAmount;
      const totalCost =
        propertyValue + totalExpenses + totalInterest + annualIbiAndCommunity * scenario.years;
      const realMonthlyPaymentEnd =
        scenario.years > 0 ? monthlyPayment / Math.pow(1 + inflationRate / 100, scenario.years) : 0;

      return {
        id: scenario.id,
        name: scenario.name.trim() || "Escenario",
        interestRate: scenario.interestRate,
        ltv: scenario.ltv,
        years: scenario.years,
        requiredEntry,
        loanAmount,
        monthlyPayment,
        realMonthlyPaymentEnd,
        totalInterest,
        totalCost,
        paymentDelta: monthlyPayment - baselineMonthlyPayment,
        paymentDeltaPercent: safePercentDelta(monthlyPayment, baselineMonthlyPayment),
        totalCostDelta: totalCost - baselineTotalCost,
        totalCostDeltaPercent: safePercentDelta(totalCost, baselineTotalCost),
        isBaseline: false,
      } satisfies ScenarioComparison;
    });

    return [base, ...computed];
  }, [
    annualIbiAndCommunity,
    baselineInterestRate,
    baselineLoanAmount,
    baselineRequiredEntry,
    baselineLtv,
    baselineMonthlyPayment,
    baselineRealPaymentEnd,
    baselineTotalCost,
    baselineTotalInterest,
    inflationRate,
    propertyValue,
    scenarios,
    totalExpenses,
    years,
  ]);

  const bestByTotalCost = useMemo(() => {
    return comparisonData
      .filter((item) => !item.isBaseline)
      .reduce<ScenarioComparison | null>((best, current) => {
        if (!best) return current;
        return current.totalCost < best.totalCost ? current : best;
      }, null);
  }, [comparisonData]);

  const bestByPayment = useMemo(() => {
    return comparisonData
      .filter((item) => !item.isBaseline)
      .reduce<ScenarioComparison | null>((best, current) => {
        if (!best) return current;
        return current.monthlyPayment < best.monthlyPayment ? current : best;
      }, null);
  }, [comparisonData]);

  const worstByTotalCost = useMemo(() => {
    return comparisonData
      .filter((item) => !item.isBaseline)
      .reduce<ScenarioComparison | null>((worst, current) => {
        if (!worst) return current;
        return current.totalCost > worst.totalCost ? current : worst;
      }, null);
  }, [comparisonData]);

  const addScenario = () => {
    const id = `scenario-${nextId.current}`;
    const order = nextId.current;
    nextId.current += 1;

    setScenarios((prev) => [
      ...prev,
      {
        id,
        name: `Escenario ${order}`,
        interestRate: baselineInterestRate,
        ltv: baselineLtv,
        years,
      },
    ]);
  };

  const updateScenario = (id: string, patch: Partial<ScenarioInput>) => {
    setScenarios((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  };

  const removeScenario = (id: string) => {
    setScenarios((prev) => prev.filter((item) => item.id !== id));
  };

  const resetScenarioToBaseline = (id: string) => {
    updateScenario(id, { interestRate: baselineInterestRate, ltv: baselineLtv, years });
  };

  return (
    <div className="space-y-6">
      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed px-1">
        Compara escenarios de interés y financiación frente al baseline del formulario principal. La
        inflación se aplica de forma global al cálculo de cuota real futura.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-2">
            Mejor coste total
          </div>
          {bestByTotalCost ? (
            <>
              <div className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">
                {bestByTotalCost.name}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-300 mt-2">
                {formatCurrency(Math.abs(bestByTotalCost.totalCostDelta))} (
                {Math.abs(bestByTotalCost.totalCostDeltaPercent).toFixed(2)}%)
                {bestByTotalCost.totalCostDelta <= 0
                  ? " de ahorro vs baseline"
                  : " de sobrecoste vs baseline"}
              </div>
            </>
          ) : (
            <div className="text-sm text-slate-500 dark:text-slate-400">
              Añade escenarios para comparar.
            </div>
          )}
        </Card>

        <Card>
          <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-2">
            Mejor cuota mensual
          </div>
          {bestByPayment ? (
            <>
              <div className="text-lg font-semibold text-sky-600 dark:text-sky-400">
                {bestByPayment.name}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-300 mt-2">
                {formatCurrency(bestByPayment.monthlyPayment)} (
                {bestByPayment.interestRate.toFixed(2)}% / {bestByPayment.ltv.toFixed(0)}% LTV)
              </div>
            </>
          ) : (
            <div className="text-sm text-slate-500 dark:text-slate-400">
              Añade escenarios para comparar.
            </div>
          )}
        </Card>

        <Card>
          <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-2">
            Mayor riesgo
          </div>
          {worstByTotalCost ? (
            <>
              <div className="text-lg font-semibold text-rose-600 dark:text-rose-400">
                {worstByTotalCost.name}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-300 mt-2">
                +{formatCurrency(Math.max(0, worstByTotalCost.totalCostDelta))} (+
                {Math.max(0, worstByTotalCost.totalCostDeltaPercent).toFixed(2)}%) de coste total.
              </div>
            </>
          ) : (
            <div className="text-sm text-slate-500 dark:text-slate-400">
              Añade escenarios para comparar.
            </div>
          )}
        </Card>
      </div>

      <ScenariosComparisonChart data={comparisonData} />

      <ScenariosComparisonMatrix
        data={comparisonData}
        onAddScenario={addScenario}
        onUpdateScenario={updateScenario}
        onResetScenario={resetScenarioToBaseline}
        onRemoveScenario={removeScenario}
      />
    </div>
  );
}
