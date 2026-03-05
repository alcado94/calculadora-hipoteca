import React, { useState } from "react";
import { Settings, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "../../utils";
import { PropertyForm } from "../forms/PropertyForm";
import { FinancialProfileForm } from "../forms/FinancialProfileForm";
import { TaxesForm } from "../forms/TaxesForm";
import type {
  MortgageState,
  MortgageSetters,
  HandleNumberChange,
  MortgageDerived,
} from "../../types/mortgage";

type ConfigTab = "property" | "financial" | "taxes";

interface ConfigSection {
  id: ConfigTab;
  label: string;
  render: (flatOnMobile?: boolean) => React.ReactNode;
}

interface MortgageConfigPanelProps {
  state: MortgageState;
  setters: MortgageSetters;
  handleNumberChange: HandleNumberChange;
  derived: MortgageDerived;
}

export function MortgageConfigPanel({
  state,
  setters,
  handleNumberChange,
  derived,
}: MortgageConfigPanelProps) {
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [configTab, setConfigTab] = useState<ConfigTab>("property");

  const sections: ConfigSection[] = [
    {
      id: "property",
      label: "Datos del inmueble",
      render: (flatOnMobile = false) => (
        <PropertyForm
          state={state}
          setters={setters}
          handleNumberChange={handleNumberChange}
          flatOnMobile={flatOnMobile}
        />
      ),
    },
    {
      id: "financial",
      label: "Perfil financiero",
      render: (flatOnMobile = false) => (
        <FinancialProfileForm
          state={state}
          setters={setters}
          handleNumberChange={handleNumberChange}
          flatOnMobile={flatOnMobile}
        />
      ),
    },
    {
      id: "taxes",
      label: "Impuestos y gastos",
      render: (flatOnMobile = false) => (
        <TaxesForm
          state={state}
          setters={setters}
          handleNumberChange={handleNumberChange}
          derived={derived}
          flatOnMobile={flatOnMobile}
        />
      ),
    },
  ];

  const activeSection = sections.find((section) => section.id === configTab);

  return (
    <div className="lg:col-span-4 xl:col-span-3">
      <div className="hidden lg:block space-y-6">
        {sections.map((section) => (
          <React.Fragment key={section.id}>{section.render()}</React.Fragment>
        ))}
      </div>

      <div className="lg:hidden border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm">
        <button
          onClick={() => setIsConfigOpen(!isConfigOpen)}
          className="w-full flex items-center justify-between px-4 py-3.5 text-left"
          aria-expanded={isConfigOpen}
        >
          <div className="flex items-center gap-2.5">
            <Settings className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              Datos de la hipoteca
            </span>
          </div>
          {isConfigOpen ? (
            <ChevronUp className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          )}
        </button>

        {isConfigOpen && (
          <div className="border-t border-slate-200 dark:border-slate-700">
            <div className="flex border-b border-slate-200 dark:border-slate-700">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setConfigTab(section.id)}
                  className={cn(
                    "flex-1 px-2 py-2.5 text-xs leading-tight text-center whitespace-normal font-medium transition-colors border-b-2",
                    configTab === section.id
                      ? "border-indigo-500 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400"
                      : "border-transparent text-slate-500 dark:text-slate-400"
                  )}
                >
                  {section.label}
                </button>
              ))}
            </div>

            <div className="p-3">{activeSection?.render(true)}</div>
          </div>
        )}
      </div>
    </div>
  );
}
