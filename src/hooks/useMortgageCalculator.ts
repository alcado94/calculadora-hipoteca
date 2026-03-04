import React, { useState, useMemo } from 'react';
import { calculateMortgage, generateAmortizationSchedule, calculateMaxLoan, MORTGAGE_DEFAULTS } from '../utils';

export { MORTGAGE_DEFAULTS } from '../utils';

export function useMortgageCalculator() {
  // Main Inputs
  const [budgetName, setBudgetName] = useState<string>(MORTGAGE_DEFAULTS.budgetName);
  const [propertyValue, setPropertyValue] = useState<string | number>(MORTGAGE_DEFAULTS.propertyValue);
  const [ltv, setLtv] = useState<string | number>(MORTGAGE_DEFAULTS.ltv);
  const [savings, setSavings] = useState<string | number>(MORTGAGE_DEFAULTS.savings);
  const [monthlySavings, setMonthlySavings] = useState<string | number>(MORTGAGE_DEFAULTS.monthlySavings);
  const [years, setYears] = useState<string | number>(MORTGAGE_DEFAULTS.years);
  const [mortgageType, setMortgageType] = useState(MORTGAGE_DEFAULTS.mortgageType);
  const [interestRate, setInterestRate] = useState<string | number>(MORTGAGE_DEFAULTS.interestRate);
  const [inflationRate, setInflationRate] = useState<string | number>(MORTGAGE_DEFAULTS.inflationRate);
  const [monthlyIncome, setMonthlyIncome] = useState<string | number>(MORTGAGE_DEFAULTS.monthlyIncome);
  const [equivalentRent, setEquivalentRent] = useState<string | number>(MORTGAGE_DEFAULTS.equivalentRent);
  const [propertyType, setPropertyType] = useState(MORTGAGE_DEFAULTS.propertyType);

  // Advanced / Tax Inputs
  const [itpRate, setItpRate] = useState<string | number>(MORTGAGE_DEFAULTS.itpRate);
  const [ivaRate, setIvaRate] = useState<string | number>(MORTGAGE_DEFAULTS.ivaRate);
  const [ajdRate, setAjdRate] = useState<string | number>(MORTGAGE_DEFAULTS.ajdRate);
  const [ibiAndCommunity, setIbiAndCommunity] = useState<string | number>(MORTGAGE_DEFAULTS.ibiAndCommunity);

  const handleNumberChange = (setter: React.Dispatch<React.SetStateAction<string | number>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === '') {
      setter('');
      return;
    }
    const num = Number(val);
    if (!isNaN(num) && num >= 0) {
      setter(val);
    }
  };

  // Derived Calculations
  const numPropertyValue = Number(propertyValue) || 0;
  const numLtv = Number(ltv) || 0;
  const numSavings = Number(savings) || 0;
  const numMonthlySavings = Number(monthlySavings) || 0;
  const numYears = Number(years) || 0;
  const numInterestRate = Number(interestRate) || 0;
  const numInflationRate = Number(inflationRate) || 0;
  const numMonthlyIncome = Number(monthlyIncome) || 0;
  const numEquivalentRent = Number(equivalentRent) || 0;
  const numItpRate = Number(itpRate) || 0;
  const numIvaRate = Number(ivaRate) || 0;
  const numAjdRate = Number(ajdRate) || 0;
  const numIbiAndCommunity = Number(ibiAndCommunity) || 0;
  const monthlyIbiAndCommunity = numIbiAndCommunity / 12;

  // Auto-calculated fees based on property value (Standard Spanish estimations)
  const numNotaryFee = Math.round(numPropertyValue * 0.003 + 300); // ~0.3% + base
  const numRegistryFee = Math.round(numPropertyValue * 0.0015 + 150); // ~0.15% + base
  const numGestoriaFee = 400; // Usually fixed
  const numTasacionFee = Math.round(Math.max(300, numPropertyValue * 0.001)); // Min 300 or 0.1%

  const loanAmount = Math.max(0, numPropertyValue * (numLtv / 100));
  const downPayment = Math.max(0, numPropertyValue - loanAmount);
  
  const taxes = propertyType === 'new' 
    ? (numPropertyValue * (numIvaRate / 100)) + (numPropertyValue * (numAjdRate / 100))
    : (numPropertyValue * (numItpRate / 100));
    
  const otherExpenses = numNotaryFee + numRegistryFee + numGestoriaFee + numTasacionFee;
  const totalExpenses = taxes + otherExpenses;
  const totalInitialCash = downPayment + totalExpenses;
  
  // Savings calculations
  const missingSavings = Math.max(0, totalInitialCash - numSavings);
  const monthsToSave = numMonthlySavings > 0 ? Math.ceil(missingSavings / numMonthlySavings) : 0;
  const yearsToSave = +(monthsToSave / 12).toFixed(1);
  const freeIncome = numMonthlyIncome - numEquivalentRent - numMonthlySavings;
  const isSavingsRealistic = freeIncome >= 0;
  
  const monthlyPayment = calculateMortgage(loanAmount, numInterestRate, numYears);
  const totalMonthlyPayment = monthlyPayment + monthlyIbiAndCommunity;
  const affordabilityRatio = numMonthlyIncome > 0 ? (totalMonthlyPayment / numMonthlyIncome) * 100 : 0;
  const totalInterestPaid = (monthlyPayment * numYears * 12) - loanAmount;
  const totalCostOfProperty = numPropertyValue + totalExpenses + totalInterestPaid + (numIbiAndCommunity * numYears);
  const maxLoanAmount = calculateMaxLoan(numMonthlyIncome, numInterestRate, numYears, 0.30);

  // Chart Data
  const amortizationData = useMemo(() => {
    return generateAmortizationSchedule(loanAmount, numInterestRate, numYears, numInflationRate);
  }, [loanAmount, numInterestRate, numYears, numInflationRate]);

  const pieData = [
    { name: 'Valor Inmueble', value: numPropertyValue, color: '#3b82f6' },
    { name: 'Intereses', value: totalInterestPaid, color: '#f59e0b' },
    { name: 'Impuestos y Gastos', value: totalExpenses, color: '#ef4444' },
    { name: 'IBI y Comunidad', value: numIbiAndCommunity * numYears, color: '#10b981' },
  ];

  const stressTestData = useMemo(() => {
    const data = [];
    for (let i = -4; i <= 4; i++) {
      const rate = Math.max(0, numInterestRate + (i * 0.1));
      data.push({
        rate: `${rate.toFixed(2)}%`,
        payment: calculateMortgage(loanAmount, rate, numYears),
      });
    }
    return data;
  }, [loanAmount, numInterestRate, numYears]);

  const scenarioData = useMemo(() => {
    return [
      {
        scenario: 'Actual',
        rate: `${numInterestRate.toFixed(2)}%`,
        payment: calculateMortgage(loanAmount, numInterestRate, numYears),
        isCurrent: true
      },
      {
        scenario: '+1%',
        rate: `${(numInterestRate + 1).toFixed(2)}%`,
        payment: calculateMortgage(loanAmount, numInterestRate + 1, numYears),
        isCurrent: false
      },
      {
        scenario: '+2%',
        rate: `${(numInterestRate + 2).toFixed(2)}%`,
        payment: calculateMortgage(loanAmount, numInterestRate + 2, numYears),
        isCurrent: false
      },
      {
        scenario: '+3%',
        rate: `${(numInterestRate + 3).toFixed(2)}%`,
        payment: calculateMortgage(loanAmount, numInterestRate + 3, numYears),
        isCurrent: false
      }
    ];
  }, [loanAmount, numInterestRate, numYears]);

  return {
    state: {
      budgetName,
      propertyValue,
      ltv,
      savings,
      monthlySavings,
      years,
      mortgageType,
      interestRate,
      inflationRate,
      monthlyIncome,
      equivalentRent,
      propertyType,
      itpRate,
      ivaRate,
      ajdRate,
      ibiAndCommunity,
    },
    setters: {
      setBudgetName,
      setPropertyValue,
      setLtv,
      setSavings,
      setMonthlySavings,
      setYears,
      setMortgageType,
      setInterestRate,
      setInflationRate,
      setMonthlyIncome,
      setEquivalentRent,
      setPropertyType,
      setItpRate,
      setIvaRate,
      setAjdRate,
      setIbiAndCommunity,
    },
    handleNumberChange,
    derived: {
      numPropertyValue,
      numLtv,
      numSavings,
      numMonthlySavings,
      numYears,
      numInterestRate,
      numInflationRate,
      numMonthlyIncome,
      numEquivalentRent,
      numItpRate,
      numIvaRate,
      numAjdRate,
      numIbiAndCommunity,
      monthlyIbiAndCommunity,
      numNotaryFee,
      numRegistryFee,
      numGestoriaFee,
      numTasacionFee,
      loanAmount,
      downPayment,
      taxes,
      otherExpenses,
      totalExpenses,
      totalInitialCash,
      missingSavings,
      monthsToSave,
      yearsToSave,
      freeIncome,
      isSavingsRealistic,
      monthlyPayment,
      totalMonthlyPayment,
      affordabilityRatio,
      totalInterestPaid,
      totalCostOfProperty,
      maxLoanAmount,
    },
    charts: {
      amortizationData,
      pieData,
      stressTestData,
      scenarioData,
    }
  };
}
