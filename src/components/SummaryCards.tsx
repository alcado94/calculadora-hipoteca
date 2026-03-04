import React from "react";
import { MortgageQuotaCard } from "./summary/MortgageQuotaCard";
import { RequiredSavingsCard } from "./summary/RequiredSavingsCard";
import { MortgageAmountCard } from "./summary/MortgageAmountCard";

interface SummaryCardsProps {
  monthlyMortgage: number;
  monthlyIbiAndCommunity: number;
  years: number;
  totalInitialCash: number;
  totalExpenses: number;
  loanAmount: number;
  downPayment: number;
  affordabilityRatio: number;
  savings: number;
  monthlySavings: number;
  missingSavings: number;
  monthsToSave: number;
  yearsToSave: number;
  isSavingsRealistic: boolean;
  freeIncome: number;
  equivalentRent: number;
  totalInterestPaid: number;
  totalCostOfProperty: number;
  ltv: number;
  monthlyIncome: number;
}

export function SummaryCards({
  monthlyMortgage,
  monthlyIbiAndCommunity,
  years,
  totalInitialCash,
  totalExpenses,
  loanAmount,
  downPayment,
  affordabilityRatio,
  savings,
  monthlySavings,
  missingSavings,
  monthsToSave,
  yearsToSave,
  isSavingsRealistic,
  freeIncome,
  equivalentRent,
  totalInterestPaid,
  totalCostOfProperty,
  ltv,
  monthlyIncome,
}: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 auto-rows-fr md:grid-cols-3 gap-4 [&>*]:h-full">
      <MortgageQuotaCard
        monthlyMortgage={monthlyMortgage}
        monthlyIbiAndCommunity={monthlyIbiAndCommunity}
        years={years}
        affordabilityRatio={affordabilityRatio}
        monthlyIncome={monthlyIncome}
      />

      <RequiredSavingsCard
        totalInitialCash={totalInitialCash}
        downPayment={downPayment}
        totalExpenses={totalExpenses}
        missingSavings={missingSavings}
        savings={savings}
        monthlySavings={monthlySavings}
        monthsToSave={monthsToSave}
        yearsToSave={yearsToSave}
        isSavingsRealistic={isSavingsRealistic}
        freeIncome={freeIncome}
        equivalentRent={equivalentRent}
        monthlyIncome={monthlyIncome}
      />

      <MortgageAmountCard
        loanAmount={loanAmount}
        ltv={ltv}
        totalInterestPaid={totalInterestPaid}
        totalCostOfProperty={totalCostOfProperty}
        downPayment={downPayment}
        totalExpenses={totalExpenses}
        monthlyIbiAndCommunity={monthlyIbiAndCommunity}
        years={years}
      />
    </div>
  );
}
