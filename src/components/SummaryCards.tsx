import React from 'react';
import { MortgageQuotaCard } from './summary/MortgageQuotaCard';
import { RequiredSavingsCard } from './summary/RequiredSavingsCard';
import { MortgageAmountCard } from './summary/MortgageAmountCard';

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
  ltv
}: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <MortgageQuotaCard 
        monthlyMortgage={monthlyMortgage}
        monthlyIbiAndCommunity={monthlyIbiAndCommunity}
        years={years}
        affordabilityRatio={affordabilityRatio}
      />
      
      <RequiredSavingsCard 
        totalInitialCash={totalInitialCash}
        downPayment={downPayment}
        totalExpenses={totalExpenses}
        missingSavings={missingSavings}
        monthlySavings={monthlySavings}
        monthsToSave={monthsToSave}
        yearsToSave={yearsToSave}
        isSavingsRealistic={isSavingsRealistic}
        freeIncome={freeIncome}
        equivalentRent={equivalentRent}
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
