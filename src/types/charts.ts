export interface AmortizationRow {
  year: number;
  balance: number;
  totalInterest: number;
  principalPaid: number;
  monthlyPayment: number;
  realMonthlyPayment: number;
}

export interface PieChartEntry {
  name: string;
  value: number;
  color: string;
}

export interface StressTestEntry {
  rate: string;
  payment: number;
}

export interface ScenarioEntry {
  scenario: string;
  rate: string;
  payment: number;
  isCurrent: boolean;
}
