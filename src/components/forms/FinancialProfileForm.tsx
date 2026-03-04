import React from 'react';
import { Wallet } from 'lucide-react';
import { Card, ListInput } from '../ui';

interface FinancialProfileFormProps {
  state: any;
  setters: any;
  handleNumberChange: any;
  flatOnMobile?: boolean;
}

export function FinancialProfileForm({ state, setters, handleNumberChange, flatOnMobile = false }: FinancialProfileFormProps) {
  return (
    <Card className="space-y-6" flatOnMobile={flatOnMobile}>
      {!flatOnMobile && (
        <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
          <Wallet className="w-5 h-5 text-emerald-600" />
          <h2 className="text-lg font-semibold">Perfil Financiero</h2>
        </div>
      )}
      
      <div className="flex flex-col">
        <ListInput 
          label="Ahorro Actual" 
          value={state.savings} 
          onChange={handleNumberChange(setters.setSavings)} 
          suffix="€"
          step={1000}
        />

        <ListInput 
          label="Ingresos Netos Mensuales"  
          value={state.monthlyIncome} 
          onChange={handleNumberChange(setters.setMonthlyIncome)} 
          suffix="€"
          step={100}
        />

        <ListInput 
          label="Alquiler Actual/Estimado" 
          value={state.equivalentRent} 
          onChange={handleNumberChange(setters.setEquivalentRent)} 
          suffix="€"
          step={50}
        />

        <ListInput 
          label="Ahorro Mensual" 
          value={state.monthlySavings} 
          onChange={handleNumberChange(setters.setMonthlySavings)} 
          suffix="€"
          step={50}
        />
      </div>
    </Card>
  );
}
