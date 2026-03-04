import React, { useState, useEffect } from 'react';
import { Calculator, Pencil, ChevronDown, ChevronUp, Settings } from 'lucide-react';
import { cn } from '../utils';
import { AmortizationChart } from './charts';
import { SummaryCards } from './SummaryCards';
import { AmortizationTable } from './AmortizationTable';
import { ViabilityAnalysis } from './ViabilityAnalysis';
import { RentVsBuyAnalysis } from './RentVsBuyAnalysis';
import { useMortgageCalculator } from '../hooks/useMortgageCalculator';
import { PropertyForm } from './forms/PropertyForm';
import { FinancialProfileForm } from './forms/FinancialProfileForm';
import { TaxesForm } from './forms/TaxesForm';
import { InitialForm } from './InitialForm';

export default function App() {
  const { state, setters, handleNumberChange, derived, charts } = useMortgageCalculator();
  const [activeTab, setActiveTab] = useState<'table' | 'viability' | 'rent-vs-buy'>('table');
  const [hash, setHash] = useState('');
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [configTab, setConfigTab] = useState<'property' | 'financial' | 'taxes'>('property');

  useEffect(() => {
    const onHashChange = () => setHash(window.location.hash);
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const goHome = () => {
    window.location.hash = '';
  };

  const goToResults = () => {
    window.location.hash = 'resultado';
  };

  if (hash !== '#resultado') {
    return (
      <InitialForm
        state={state}
        setters={setters}
        handleNumberChange={handleNumberChange}
        onCalculate={goToResults}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <button
            onClick={goHome}
            className="flex items-center gap-3 group"
            aria-label="Volver al inicio"
          >
            <div className="bg-indigo-600 p-2 rounded-none group-hover:bg-indigo-700 transition-colors">
              <Calculator className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-semibold tracking-tight hidden sm:block group-hover:text-indigo-600 transition-colors">Simulador de hipoteca</h1>
          </button>
          
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
          
          {/* Left Column: Inputs — solo visible en desktop */}
          <div className="hidden lg:block lg:col-span-4 xl:col-span-3 space-y-6">
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

            {/* Panel desplegable de configuración — solo visible en móvil */}
            <div className="lg:hidden border border-slate-200 bg-white shadow-sm">
              <button
                onClick={() => setIsConfigOpen(!isConfigOpen)}
                className="w-full flex items-center justify-between px-4 py-3.5 text-left"
                aria-expanded={isConfigOpen}
              >
                <div className="flex items-center gap-2.5">
                  <Settings className="w-4 h-4 text-indigo-600" />
                  <span className="text-sm font-semibold text-slate-800">Datos de la hipoteca</span>
                </div>
                {isConfigOpen
                  ? <ChevronUp className="w-4 h-4 text-slate-500" />
                  : <ChevronDown className="w-4 h-4 text-slate-500" />
                }
              </button>

              {isConfigOpen && (
                <div className="border-t border-slate-200">
                  {/* Tabs */}
                  <div className="flex border-b border-slate-200">
                    {([
                      { id: 'property', label: 'Propiedad' },
                      { id: 'financial', label: 'Perfil' },
                      { id: 'taxes', label: 'Gastos' },
                    ] as const).map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setConfigTab(tab.id)}
                        className={cn(
                          "flex-1 py-2.5 text-sm font-medium transition-colors border-b-2",
                          configTab === tab.id
                            ? "border-indigo-500 text-indigo-600"
                            : "border-transparent text-slate-500"
                        )}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Contenido del tab activo */}
                  <div className="p-3">
                    {configTab === 'property' && (
                      <PropertyForm
                        state={state}
                        setters={setters}
                        handleNumberChange={handleNumberChange}
                        flatOnMobile
                      />
                    )}
                    {configTab === 'financial' && (
                      <FinancialProfileForm
                        state={state}
                        setters={setters}
                        handleNumberChange={handleNumberChange}
                        flatOnMobile
                      />
                    )}
                    {configTab === 'taxes' && (
                      <TaxesForm
                        state={state}
                        setters={setters}
                        handleNumberChange={handleNumberChange}
                        derived={derived}
                        flatOnMobile
                      />
                    )}
                  </div>
                </div>
              )}
            </div>

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
              monthlyIncome={derived.numMonthlyIncome}
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
