import React from 'react';
import { Home } from 'lucide-react';
import { Card, ListInput, ListSelect } from '../ui';

interface PropertyFormProps {
  state: any;
  setters: any;
  handleNumberChange: any;
  flatOnMobile?: boolean;
}

export function PropertyForm({ state, setters, handleNumberChange, flatOnMobile = false }: PropertyFormProps) {
  return (
    <Card className="space-y-6" flatOnMobile={flatOnMobile}>
      <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
        <Home className="w-5 h-5 text-indigo-600" />
        <h2 className="text-lg font-semibold">Datos del Inmueble</h2>
      </div>
      
      <div className="flex flex-col">
        <ListInput 
          label="Precio del Inmueble" 
          value={state.propertyValue} 
          onChange={handleNumberChange(setters.setPropertyValue)} 
          suffix="€"
          step={1000}
        />

        <ListInput 
          label="% Financiación" 
          value={state.ltv} 
          onChange={handleNumberChange(setters.setLtv)} 
          suffix="%"
          max={100}
          step={1}
        />

        <ListInput 
          label="Plazo en años" 
          value={state.years} 
          onChange={handleNumberChange(setters.setYears)} 
          suffix=" "
          max={40}
        />

        <ListSelect 
          label="Tipo de Hipoteca" 
          value={state.mortgageType} 
          onChange={(e: any) => setters.setMortgageType(e.target.value)}
          options={[
            { value: 'fixed', label: 'Fija' },
            { value: 'variable', label: 'Variable' },
          ]}
        />

        <ListInput 
          label={state.mortgageType === 'fixed' ? "Tipo de Interés Fijo" : "Tipo de Interés Variable (Euribor + Dif.)"} 
          value={state.interestRate} 
          onChange={handleNumberChange(setters.setInterestRate)} 
          suffix="%"
          step={0.1}
        />

        <ListInput 
          label="Inflación Anual Est." 
          value={state.inflationRate} 
          onChange={handleNumberChange(setters.setInflationRate)} 
          suffix="%"
          step={0.1}
        />
      </div>
    </Card>
  );
}
