import React from 'react';
import { Calculator } from 'lucide-react';
import { Input, Select } from './ui';

interface InitialFormProps {
  state: {
    propertyValue: string | number;
    ltv: string | number;
    years: string | number;
    mortgageType: string;
    interestRate: string | number;
    savings: string | number;
    monthlyIncome: string | number;
    monthlySavings: string | number;
  };
  setters: {
    setPropertyValue: (v: any) => void;
    setLtv: (v: any) => void;
    setYears: (v: any) => void;
    setMortgageType: (v: any) => void;
    setInterestRate: (v: any) => void;
    setSavings: (v: any) => void;
    setMonthlyIncome: (v: any) => void;
    setMonthlySavings: (v: any) => void;
  };
  handleNumberChange: (setter: any) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCalculate: () => void;
}

export function InitialForm({ state, setters, handleNumberChange, onCalculate }: InitialFormProps) {
  const mortgageTypeOptions = [
    { value: 'fixed', label: 'Fija' },
    { value: 'variable', label: 'Variable' },
  ];

  const interestRateLabel = state.mortgageType === 'fixed'
    ? 'Tipo de Interés Fijo'
    : 'Tipo de Interés Variable';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-none">
              <Calculator className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-semibold tracking-tight">Simulador de hipoteca</h1>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="w-full max-w-2xl">
          {/* Title */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-2">Calcula tu hipoteca</h2>
          </div>

          <div className="bg-white border border-slate-200 shadow-sm p-6 sm:p-8 space-y-8">
            {/* Sección 1: Datos del inmueble */}
            <div>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-5">Datos del Inmueble</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2">
                  <Input
                    label="Precio del Inmueble"
                    value={state.propertyValue}
                    onChange={handleNumberChange(setters.setPropertyValue)}
                    suffix="€"
                    step={1000}
                    min={0}
                  />
                </div>
                <Input
                  label="Porcentaje de Financiación (LTV)"
                  value={state.ltv}
                  onChange={handleNumberChange(setters.setLtv)}
                  suffix="%"
                  step={1}
                  min={0}
                  max={100}
                />
                <Input
                  label="Plazo"
                  value={state.years}
                  onChange={handleNumberChange(setters.setYears)}
                  suffix="años"
                  step={1}
                  min={1}
                  max={40}
                />
                <Select
                  label="Tipo de Hipoteca"
                  value={state.mortgageType}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setters.setMortgageType(e.target.value)}
                  options={mortgageTypeOptions}
                />
                <Input
                  label={interestRateLabel}
                  value={state.interestRate}
                  onChange={handleNumberChange(setters.setInterestRate)}
                  suffix="%"
                  step={0.1}
                  min={0}
                />
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-slate-100" />

            {/* Sección 2: Perfil financiero */}
            <div>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-5">Perfil Financiero</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Input
                  label="Ahorro Actual"
                  value={state.savings}
                  onChange={handleNumberChange(setters.setSavings)}
                  suffix="€"
                  step={1000}
                  min={0}
                  placeholder="0"
                />
                <Input
                  label="Ingresos Netos Mensuales"
                  value={state.monthlyIncome}
                  onChange={handleNumberChange(setters.setMonthlyIncome)}
                  suffix="€"
                  step={100}
                  min={0}
                  placeholder="0"
                />
                <Input
                  label="Ahorro Mensual"
                  value={state.monthlySavings}
                  onChange={handleNumberChange(setters.setMonthlySavings)}
                  suffix="€"
                  step={50}
                  min={0}
                  placeholder="0"
                />
              </div>
            </div>

            <p className="text-xs text-slate-500">Esta aplicación te ayuda a estimar tu hipoteca y analizar de forma orientativa tu situación financiera. Los datos que introduzcas no se recopilan ni se usan con fines comerciales; algunos valores se guardan en la URL solo para compartir o recuperar tu simulación.</p>

            {/* Botón calcular */}
            <button
              onClick={onCalculate}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-none transition-colors text-sm tracking-wide"
            >
              Calcular
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
