import React from "react";

export type MortgageType = "fixed" | "variable";
export type PropertyType = "second-hand" | "new";

/** Shape del estado de los inputs del formulario */
export interface MortgageState {
  budgetName: string;
  propertyValue: string | number;
  ltv: string | number;
  savings: string | number;
  monthlySavings: string | number;
  years: string | number;
  mortgageType: string;
  interestRate: string | number;
  inflationRate: string | number;
  monthlyIncome: string | number;
  equivalentRent: string | number;
  propertyType: string;
  itpRate: string | number;
  ivaRate: string | number;
  ajdRate: string | number;
  ibiAndCommunity: string | number;
}

/** Dispatchers para actualizar cada campo del estado */
export interface MortgageSetters {
  setBudgetName: React.Dispatch<React.SetStateAction<string>>;
  setPropertyValue: React.Dispatch<React.SetStateAction<string | number>>;
  setLtv: React.Dispatch<React.SetStateAction<string | number>>;
  setSavings: React.Dispatch<React.SetStateAction<string | number>>;
  setMonthlySavings: React.Dispatch<React.SetStateAction<string | number>>;
  setYears: React.Dispatch<React.SetStateAction<string | number>>;
  setMortgageType: React.Dispatch<React.SetStateAction<string>>;
  setInterestRate: React.Dispatch<React.SetStateAction<string | number>>;
  setInflationRate: React.Dispatch<React.SetStateAction<string | number>>;
  setMonthlyIncome: React.Dispatch<React.SetStateAction<string | number>>;
  setEquivalentRent: React.Dispatch<React.SetStateAction<string | number>>;
  setPropertyType: React.Dispatch<React.SetStateAction<string>>;
  setItpRate: React.Dispatch<React.SetStateAction<string | number>>;
  setIvaRate: React.Dispatch<React.SetStateAction<string | number>>;
  setAjdRate: React.Dispatch<React.SetStateAction<string | number>>;
  setIbiAndCommunity: React.Dispatch<React.SetStateAction<string | number>>;
}

/** Todos los valores calculados derivados de los inputs */
export interface MortgageDerived {
  numPropertyValue: number;
  numLtv: number;
  numSavings: number;
  numMonthlySavings: number;
  numYears: number;
  numInterestRate: number;
  numInflationRate: number;
  numMonthlyIncome: number;
  numEquivalentRent: number;
  numItpRate: number;
  numIvaRate: number;
  numAjdRate: number;
  numIbiAndCommunity: number;
  monthlyIbiAndCommunity: number;
  numNotaryFee: number;
  numRegistryFee: number;
  numGestoriaFee: number;
  numTasacionFee: number;
  loanAmount: number;
  downPayment: number;
  taxes: number;
  otherExpenses: number;
  totalExpenses: number;
  totalInitialCash: number;
  missingSavings: number;
  monthsToSave: number;
  yearsToSave: number;
  freeIncome: number;
  isSavingsRealistic: boolean;
  monthlyPayment: number;
  totalMonthlyPayment: number;
  affordabilityRatio: number;
  totalInterestPaid: number;
  totalCostOfProperty: number;
  maxLoanAmount: number;
}

/** Factory que crea handlers de onChange para inputs numéricos */
export type HandleNumberChange = (
  setter: React.Dispatch<React.SetStateAction<string | number>>
) => React.ChangeEventHandler<HTMLInputElement>;
