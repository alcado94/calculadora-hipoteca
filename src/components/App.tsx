import React, { useState } from 'react';
import { Calculator, Pencil } from 'lucide-react';
import { cn } from '../utils';
import { AmortizationChart, StressTestChart, CostBreakdownChart, InterestScenariosChart } from './charts';
import { SummaryCards } from './SummaryCards';
import { AmortizationTable } from './AmortizationTable';
import { ViabilityAnalysis } from './ViabilityAnalysis';
import { RentVsBuyAnalysis } from './RentVsBuyAnalysis';
import { useMortgageCalculator } from '../hooks/useMortgageCalculator';
import { PropertyForm } from './forms/PropertyForm';
import { FinancialProfileForm } from './forms/FinancialProfileForm';
import { TaxesForm } from './forms/TaxesForm';

export default function App() {
  const { state, setters, handleNumberChange, derived, charts } = useMortgageCalculator();
  const [activeTab, setActiveTab] = useState<'charts' | 'table' | 'viability' | 'rent-vs-buy'>('table');

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-none">
              <Calculator className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-semibold tracking-tight hidden sm:block">Calculadora Hipotecaria España</h1>
          </div>
          
          <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-none border border-slate-200 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all">
            <Pencil className="w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              value={state.budgetName}
              onChange={(e) => setters.setBudgetName(e.target.value)}
              placeholder="Nombre del presupuesto..."
              className="bg-transparent border-none outline-none text-sm font-medium text-slate-700 w-48 sm:w-64 placeholder:text-slate-400"
            />
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Inputs */}
          <div className="lg:col-span-4 xl:col-span-3 space-y-6">
            <PropertyForm 
              state={state} 
              setters={setters} 
              handleNumberChange={handleNumberChange} 
            />
            <FinancialProfileForm 
              state={state} 
              setters={setters} 
              handleNumberChange={handleNumberChange} 
            />
            <TaxesForm 
              state={state} 
              setters={setters} 
              handleNumberChange={handleNumberChange} 
              derived={derived} 
            />
          </div>

          {/* Right Column: Results & Charts */}
          <div className="lg:col-span-8 xl:col-span-9 space-y-6">
            <SummaryCards 
              monthlyMortgage={derived.monthlyPayment}
              monthlyIbiAndCommunity={derived.monthlyIbiAndCommunity}
              years={derived.numYears}
              totalInitialCash={derived.totalInitialCash}
              totalExpenses={derived.totalExpenses}
              loanAmount={derived.loanAmount}
              downPayment={derived.downPayment}
              affordabilityRatio={derived.affordabilityRatio}
              savings={derived.numSavings}
              monthlySavings={derived.numMonthlySavings}
              missingSavings={derived.missingSavings}
              monthsToSave={derived.monthsToSave}
              yearsToSave={derived.yearsToSave}
              isSavingsRealistic={derived.isSavingsRealistic}
              freeIncome={derived.freeIncome}
              equivalentRent={derived.numEquivalentRent}
              totalInterestPaid={derived.totalInterestPaid}
              totalCostOfProperty={derived.totalCostOfProperty}
              ltv={derived.numLtv}
            />

            {/* Tabs Navigation */}
            <div className="border-b border-slate-200 mb-6">
              <nav className="-mb-px flex space-x-8 overflow-x-auto" aria-label="Tabs">
                <button
                  onClick={() => setActiveTab('table')}
                  className={cn(
                    "whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors",
                    activeTab === 'table'
                      ? "border-indigo-500 text-indigo-600"
                      : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                  )}
                >
                  Detalle de Amortización
                </button>
                <button
                  onClick={() => setActiveTab('viability')}
                  className={cn(
                    "whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors",
                    activeTab === 'viability'
                      ? "border-indigo-500 text-indigo-600"
                      : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                  )}
                >
                  Análisis de Viabilidad
                </button>
                <button
                  onClick={() => setActiveTab('rent-vs-buy')}
                  className={cn(
                    "whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors",
                    activeTab === 'rent-vs-buy'
                      ? "border-indigo-500 text-indigo-600"
                      : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                  )}
                >
                  Comprar vs Alquilar
                </button>
                <button
                  onClick={() => setActiveTab('charts')}
                  className={cn(
                    "whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors",
                    activeTab === 'charts'
                      ? "border-indigo-500 text-indigo-600"
                      : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                  )}
                >
                  Gráficos
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            <div className="animate-in fade-in duration-300">
              {(() => {
                switch (activeTab) {
                  case 'table':
                    return (
                      <div className="grid grid-cols-1 gap-6">
                        <AmortizationChart data={charts.amortizationData} />
                        <AmortizationTable data={charts.amortizationData} />
                      </div>
                    );
                  case 'viability':
                    return (
                      <ViabilityAnalysis 
                        monthlyIncome={derived.numMonthlyIncome}
                        maxLoanAmount={derived.maxLoanAmount}
                        currentLoanAmount={derived.loanAmount}
                        savings={derived.numSavings}
                      />
                    );
                  case 'rent-vs-buy':
                    return (
                      <RentVsBuyAnalysis 
                        propertyValue={derived.numPropertyValue}
                        monthlyRent={state.equivalentRent}
                      />
                    );
                  case 'charts':
                    return (
                      <div className="grid grid-cols-1 gap-6">
                        <StressTestChart data={charts.stressTestData} />
                        <InterestScenariosChart data={charts.scenarioData} />
                      </div>
                    );
                  default:
                    return null;
                }
              })()}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
