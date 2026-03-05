import React from "react";
import { Home } from "lucide-react";
import { Card, ListInput, ListSelect } from "../ui";
import type { MortgageState, MortgageSetters, HandleNumberChange } from "../../types/mortgage";
import { MORTGAGE_TYPE_OPTIONS } from "../../constants/ui";

interface PropertyFormProps {
  state: MortgageState;
  setters: MortgageSetters;
  handleNumberChange: HandleNumberChange;
  flatOnMobile?: boolean;
}

export function PropertyForm({
  state,
  setters,
  handleNumberChange,
  flatOnMobile = false,
}: PropertyFormProps) {
  return (
    <Card className="space-y-6" flatOnMobile={flatOnMobile}>
      {!flatOnMobile && (
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
          <Home className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Datos del Inmueble
          </h2>
        </div>
      )}

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
          onChange={(e) => setters.setMortgageType(e.target.value)}
          options={MORTGAGE_TYPE_OPTIONS}
        />

        <ListInput
          label={
            state.mortgageType === "fixed"
              ? "Tipo de Interés Fijo"
              : "Tipo de Interés Variable (Euribor + Dif.)"
          }
          value={state.interestRate}
          onChange={handleNumberChange(setters.setInterestRate)}
          suffix="%"
          step={0.1}
        />

        <ListInput
          label="Inflación Anual Est."
          helpText="La estimacion por defecto corresponde a la inflacion anual del ultimo año en Espana."
          value={state.inflationRate}
          onChange={handleNumberChange(setters.setInflationRate)}
          suffix="%"
          step={0.1}
        />
      </div>
    </Card>
  );
}
