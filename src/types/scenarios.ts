export interface ScenarioInput {
  id: string;
  name: string;
  interestRate: number;
  ltv: number;
  years: number;
}

export interface ScenarioComparison {
  id: string;
  name: string;
  interestRate: number;
  ltv: number;
  years: number;
  requiredEntry: number;
  loanAmount: number;
  monthlyPayment: number;
  realMonthlyPaymentEnd: number;
  totalInterest: number;
  totalCost: number;
  paymentDelta: number;
  paymentDeltaPercent: number;
  totalCostDelta: number;
  totalCostDeltaPercent: number;
  isBaseline: boolean;
}
