import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function calculateMaxLoan(monthlyIncome: number, annualRate: number, years: number, maxRatio: number = 0.35) {
  const maxMonthlyPayment = monthlyIncome * maxRatio;
  const monthlyRate = annualRate / 100 / 12;
  const numPayments = years * 12;
  
  if (monthlyRate === 0) return maxMonthlyPayment * numPayments;
  
  // Formula derived from standard mortgage calculation:
  // P = (M * (1 - (1 + r)^-n)) / r
  return (maxMonthlyPayment * (1 - Math.pow(1 + monthlyRate, -numPayments))) / monthlyRate;
}

export function calculateMortgage(principal: number, annualRate: number, years: number) {
  const monthlyRate = annualRate / 100 / 12;
  const numPayments = years * 12;
  
  if (monthlyRate === 0) return principal / numPayments;
  
  return (principal * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
         (Math.pow(1 + monthlyRate, numPayments) - 1);
}

export function generateAmortizationSchedule(principal: number, annualRate: number, years: number, inflationRate: number = 0) {
  const monthlyRate = annualRate / 100 / 12;
  const numPayments = years * 12;
  const monthlyPayment = calculateMortgage(principal, annualRate, years);
  
  let balance = principal;
  const schedule = [];
  
  let totalInterest = 0;
  let totalPrincipal = 0;
  
  for (let i = 1; i <= numPayments; i++) {
    const interestPayment = balance * monthlyRate;
    const principalPayment = monthlyPayment - interestPayment;
    
    balance -= principalPayment;
    totalInterest += interestPayment;
    totalPrincipal += principalPayment;
    
    if (i % 12 === 0 || i === numPayments) {
      const year = Math.ceil(i / 12);
      const realMonthlyPayment = monthlyPayment / Math.pow(1 + inflationRate / 100, year);
      
      schedule.push({
        year: year,
        balance: Math.max(0, balance),
        totalInterest: totalInterest,
        principalPaid: totalPrincipal,
        monthlyPayment: monthlyPayment,
        realMonthlyPayment: realMonthlyPayment,
      });
    }
  }
  
  return schedule;
}
