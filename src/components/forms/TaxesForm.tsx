import React from 'react';
import { Settings2 } from 'lucide-react';
import { Card, ListInput, ListSelect } from '../ui';
import { formatCurrency } from '../../utils';

interface TaxesFormProps {
  state: any;
  setters: any;
  handleNumberChange: any;
  derived: any;
  flatOnMobile?: boolean;
}

export function TaxesForm({ state, setters, handleNumberChange, derived, flatOnMobile = false }: TaxesFormProps) {
  return (
    <Card className="space-y-4" flatOnMobile={flatOnMobile}>
      {!flatOnMobile && (
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
          <Settings2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Impuestos y Gastos</h2>
        </div>
      )}

      <div className="flex flex-col">
        <ListSelect 
          label="Tipo de Inmueble" 
          value={state.propertyType} 
          onChange={(e: any) => setters.setPropertyType(e.target.value)}
          options={[
            { value: 'second-hand', label: 'Segunda Mano (ITP)' },
            { value: 'new', label: 'Obra Nueva (IVA + AJD)' },
          ]}
        />
        {state.propertyType === 'second-hand' ? (
          <ListInput 
            label="ITP (Impuesto Transmisiones)" 
            value={state.itpRate} 
            onChange={handleNumberChange(setters.setItpRate)} 
            suffix="%" 
            step={0.1} 
          />
        ) : (
          <>
            <ListInput 
              label="IVA" 
              value={state.ivaRate} 
              onChange={handleNumberChange(setters.setIvaRate)} 
              suffix="%" 
              step={0.1} 
            />
            <ListInput 
              label="AJD" 
              value={state.ajdRate} 
              onChange={handleNumberChange(setters.setAjdRate)} 
              suffix="%" 
              step={0.1} 
            />
          </>
        )}
        <ListInput 
          label="Notaría (Estimado)" 
          value={derived.numNotaryFee} 
          onChange={() => {}} 
          suffix="€" 
          disabled
        />
        <ListInput 
          label="Registro (Estimado)" 
          value={derived.numRegistryFee} 
          onChange={() => {}} 
          suffix="€" 
          disabled
        />
        <ListInput 
          label="Gestoría (Estimado)" 
          value={derived.numGestoriaFee} 
          onChange={() => {}} 
          suffix="€" 
          disabled
        />
        <ListInput 
          label="Tasación (Estimado)" 
          value={derived.numTasacionFee} 
          onChange={() => {}} 
          suffix="€" 
          disabled
        />
        <ListInput 
          label="IBI y Comunidad (Anual)" 
          value={state.ibiAndCommunity} 
          onChange={handleNumberChange(setters.setIbiAndCommunity)} 
          suffix="€" 
          step={100} 
        />
      </div>
      
      <div className="bg-indigo-50 dark:bg-indigo-950/30 p-3 rounded-none flex justify-between items-center text-sm border border-indigo-100 dark:border-indigo-800 mt-2">
        <span className="text-indigo-900 dark:text-indigo-300 font-medium">Total Gastos Iniciales:</span>
        <span className="font-bold text-indigo-700 dark:text-indigo-400">{formatCurrency(derived.totalExpenses)}</span>
      </div>
      <div className="bg-emerald-50 dark:bg-emerald-950/30 p-3 rounded-none flex justify-between items-center text-sm border border-emerald-100 dark:border-emerald-800 mt-2">
        <span className="text-emerald-900 dark:text-emerald-300 font-medium">Gastos Recurrentes (Mes):</span>
        <span className="font-bold text-emerald-700 dark:text-emerald-400">{formatCurrency(derived.monthlyIbiAndCommunity)}</span>
      </div>
    </Card>
  );
}
