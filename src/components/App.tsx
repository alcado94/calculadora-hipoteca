import React, { useState, useEffect, useRef, Suspense } from "react";
import { Calculator, Pencil, ChevronDown, ChevronUp, Settings } from "lucide-react";
import { cn } from "../utils";
import { LazyAmortizationChart as AmortizationChart } from "./charts";
import { SummaryCards } from "./SummaryCards";
import { AmortizationTable } from "./AmortizationTable";
import { ViabilityAnalysis } from "./ViabilityAnalysis";
import { RentVsBuyAnalysis } from "./RentVsBuyAnalysis";
import { useMortgageCalculator } from "../hooks/useMortgageCalculator";
import { PropertyForm } from "./forms/PropertyForm";
import { FinancialProfileForm } from "./forms/FinancialProfileForm";
import { TaxesForm } from "./forms/TaxesForm";
import { InitialForm } from "./InitialForm";
import { ThemeProvider } from "./ThemeProvider";
import { Footer } from "./Footer";

const URL_PARAM_KEYS = {
  budgetName: "bn",
  propertyValue: "pv",
  ltv: "ltv",
  savings: "sv",
  monthlySavings: "ms",
  years: "y",
  mortgageType: "mt",
  interestRate: "ir",
  inflationRate: "inf",
  monthlyIncome: "mi",
  equivalentRent: "er",
  propertyType: "pt",
  itpRate: "itp",
  ivaRate: "iva",
  ajdRate: "ajd",
  ibiAndCommunity: "ibi",
} as const;

const MORTGAGE_TYPES = new Set(["fixed", "variable"]);
const PROPERTY_TYPES = new Set(["second-hand", "new"]);

// SSR-safe browser helpers
const isBrowser = typeof window !== "undefined";
const getLocationSearch = () => (isBrowser ? window.location.search : "");
const getLocationPathname = () => (isBrowser ? window.location.pathname : "/");
const replaceState = (url: string) => {
  if (isBrowser) window.history.replaceState({}, "", url);
};

function isValidNonNegativeNumber(value: string) {
  if (value === "") return true;
  const parsed = Number(value);
  return !Number.isNaN(parsed) && parsed >= 0;
}

function hasKnownShareParams(params: URLSearchParams) {
  return Object.values(URL_PARAM_KEYS).some((key) => params.has(key));
}

export default function App() {
  const { state, setters, handleNumberChange, derived, charts } = useMortgageCalculator();
  const [activeTab, setActiveTab] = useState<"table" | "viability" | "rent-vs-buy">("table");
  const [viewMode, setViewMode] = useState<"form" | "results">("form");
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [configTab, setConfigTab] = useState<"property" | "financial" | "taxes">("property");
  const isHydratingFromUrl = useRef(false);
  const hasMounted = useRef(false);

  const updateUrlFromState = () => {
    const params = new URLSearchParams();

    params.set(URL_PARAM_KEYS.budgetName, String(state.budgetName ?? ""));
    params.set(URL_PARAM_KEYS.propertyValue, String(state.propertyValue ?? ""));
    params.set(URL_PARAM_KEYS.ltv, String(state.ltv ?? ""));
    params.set(URL_PARAM_KEYS.savings, String(state.savings ?? ""));
    params.set(URL_PARAM_KEYS.monthlySavings, String(state.monthlySavings ?? ""));
    params.set(URL_PARAM_KEYS.years, String(state.years ?? ""));
    params.set(URL_PARAM_KEYS.mortgageType, String(state.mortgageType ?? ""));
    params.set(URL_PARAM_KEYS.interestRate, String(state.interestRate ?? ""));
    params.set(URL_PARAM_KEYS.inflationRate, String(state.inflationRate ?? ""));
    params.set(URL_PARAM_KEYS.monthlyIncome, String(state.monthlyIncome ?? ""));
    params.set(URL_PARAM_KEYS.equivalentRent, String(state.equivalentRent ?? ""));
    params.set(URL_PARAM_KEYS.propertyType, String(state.propertyType ?? ""));
    params.set(URL_PARAM_KEYS.itpRate, String(state.itpRate ?? ""));
    params.set(URL_PARAM_KEYS.ivaRate, String(state.ivaRate ?? ""));
    params.set(URL_PARAM_KEYS.ajdRate, String(state.ajdRate ?? ""));
    params.set(URL_PARAM_KEYS.ibiAndCommunity, String(state.ibiAndCommunity ?? ""));

    const queryString = params.toString();
    const nextUrl = queryString ? `${getLocationPathname()}?${queryString}` : getLocationPathname();
    replaceState(nextUrl);
  };

  const clearUrlParams = () => {
    replaceState(getLocationPathname());
  };

  const hydrateStateFromUrl = () => {
    const params = new URLSearchParams(getLocationSearch());
    const hasShareParams = hasKnownShareParams(params);

    if (!hasShareParams) {
      setViewMode("form");
      return;
    }

    isHydratingFromUrl.current = true;

    const setValidNumberParam = (
      key: keyof typeof URL_PARAM_KEYS,
      setter: (value: string | number) => void
    ) => {
      const paramKey = URL_PARAM_KEYS[key];
      if (!params.has(paramKey)) return;

      const value = params.get(paramKey) ?? "";
      if (isValidNonNegativeNumber(value)) {
        setter(value);
      }
    };

    if (params.has(URL_PARAM_KEYS.budgetName)) {
      setters.setBudgetName(params.get(URL_PARAM_KEYS.budgetName) ?? "");
    }

    setValidNumberParam("propertyValue", setters.setPropertyValue);
    setValidNumberParam("ltv", setters.setLtv);
    setValidNumberParam("savings", setters.setSavings);
    setValidNumberParam("monthlySavings", setters.setMonthlySavings);
    setValidNumberParam("years", setters.setYears);
    setValidNumberParam("interestRate", setters.setInterestRate);
    setValidNumberParam("inflationRate", setters.setInflationRate);
    setValidNumberParam("monthlyIncome", setters.setMonthlyIncome);
    setValidNumberParam("equivalentRent", setters.setEquivalentRent);
    setValidNumberParam("itpRate", setters.setItpRate);
    setValidNumberParam("ivaRate", setters.setIvaRate);
    setValidNumberParam("ajdRate", setters.setAjdRate);
    setValidNumberParam("ibiAndCommunity", setters.setIbiAndCommunity);

    if (params.has(URL_PARAM_KEYS.mortgageType)) {
      const mortgageType = params.get(URL_PARAM_KEYS.mortgageType) ?? "";
      if (MORTGAGE_TYPES.has(mortgageType)) {
        setters.setMortgageType(mortgageType);
      }
    }

    if (params.has(URL_PARAM_KEYS.propertyType)) {
      const propertyType = params.get(URL_PARAM_KEYS.propertyType) ?? "";
      if (PROPERTY_TYPES.has(propertyType)) {
        setters.setPropertyType(propertyType);
      }
    }

    setViewMode("results");
    isHydratingFromUrl.current = false;
  };

  useEffect(() => {
    // Notify index.astro to hide the SSR shell now that React has mounted
    if (isBrowser && typeof (window as any).__appMounted === "function") {
      (window as any).__appMounted();
    }

    hydrateStateFromUrl();
    hasMounted.current = true;

    const onPopState = () => {
      hydrateStateFromUrl();
    };

    if (isBrowser) window.addEventListener("popstate", onPopState);
    return () => {
      if (isBrowser) window.removeEventListener("popstate", onPopState);
    };
  }, []);

  useEffect(() => {
    if (!hasMounted.current || viewMode !== "results" || isHydratingFromUrl.current) {
      return;
    }

    updateUrlFromState();
  }, [
    viewMode,
    state.budgetName,
    state.propertyValue,
    state.ltv,
    state.savings,
    state.monthlySavings,
    state.years,
    state.mortgageType,
    state.interestRate,
    state.inflationRate,
    state.monthlyIncome,
    state.equivalentRent,
    state.propertyType,
    state.itpRate,
    state.ivaRate,
    state.ajdRate,
    state.ibiAndCommunity,
  ]);

  const goHome = () => {
    setViewMode("form");
    clearUrlParams();
  };

  const goToResults = () => {
    setViewMode("results");
    updateUrlFromState();
  };

  return (
    <ThemeProvider>
      {viewMode !== "results" ? (
        <InitialForm
          state={state}
          setters={setters}
          handleNumberChange={handleNumberChange}
          onCalculate={goToResults}
        />
      ) : (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-50 flex flex-col">
          {/* Header */}
          <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10">
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
              <button
                onClick={goHome}
                className="flex items-center gap-3 group cursor-pointer"
                aria-label="Volver al inicio"
              >
                <div className="bg-indigo-600 dark:bg-indigo-500 p-2 rounded-none group-hover:bg-indigo-700 dark:group-hover:bg-indigo-600 transition-colors">
                  <Calculator className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-semibold tracking-tight hidden sm:block group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  Simulador de hipoteca
                </h1>
              </button>

              <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-none border border-slate-200 dark:border-slate-600 focus-within:border-indigo-500 dark:focus-within:border-indigo-400 focus-within:ring-1 focus-within:ring-indigo-500 dark:focus-within:ring-indigo-400 transition-all">
                <Pencil className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                <input
                  type="text"
                  value={state.budgetName}
                  onChange={(e) => setters.setBudgetName(e.target.value)}
                  placeholder="Nombre del presupuesto..."
                  className="bg-transparent border-none outline-none text-sm font-medium text-slate-700 dark:text-slate-200 w-48 sm:w-64 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
              </div>
            </div>
          </header>

          <main className="max-w-[1600px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-1">
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
                      {/* Tabs */}
                      <div className="flex border-b border-slate-200 dark:border-slate-700">
                        {(
                          [
                            { id: "property", label: "Datos del inmueble" },
                            { id: "financial", label: "Perfil financiero" },
                            { id: "taxes", label: "Impuestos y gastos" },
                          ] as const
                        ).map((tab) => (
                          <button
                            key={tab.id}
                            onClick={() => setConfigTab(tab.id)}
                            className={cn(
                              "flex-1 px-2 py-2.5 text-xs leading-tight text-center whitespace-normal font-medium transition-colors border-b-2",
                              configTab === tab.id
                                ? "border-indigo-500 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400"
                                : "border-transparent text-slate-500 dark:text-slate-400"
                            )}
                          >
                            {tab.label}
                          </button>
                        ))}
                      </div>

                      {/* Contenido del tab activo */}
                      <div className="p-3">
                        {configTab === "property" && (
                          <PropertyForm
                            state={state}
                            setters={setters}
                            handleNumberChange={handleNumberChange}
                            flatOnMobile
                          />
                        )}
                        {configTab === "financial" && (
                          <FinancialProfileForm
                            state={state}
                            setters={setters}
                            handleNumberChange={handleNumberChange}
                            flatOnMobile
                          />
                        )}
                        {configTab === "taxes" && (
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
                <div className="border-b border-slate-200 dark:border-slate-700 mb-6">
                  <nav className="-mb-px flex space-x-8 overflow-x-auto" aria-label="Tabs">
                    <button
                      onClick={() => setActiveTab("table")}
                      className={cn(
                        "whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors",
                        activeTab === "table"
                          ? "border-indigo-500 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400"
                          : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600"
                      )}
                    >
                      Detalle de Amortización
                    </button>
                    <button
                      onClick={() => setActiveTab("viability")}
                      className={cn(
                        "whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors",
                        activeTab === "viability"
                          ? "border-indigo-500 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400"
                          : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600"
                      )}
                    >
                      Análisis de Viabilidad
                    </button>
                    <button
                      onClick={() => setActiveTab("rent-vs-buy")}
                      className={cn(
                        "whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors",
                        activeTab === "rent-vs-buy"
                          ? "border-indigo-500 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400"
                          : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600"
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
                      case "table":
                        return (
                          <div className="grid grid-cols-1 gap-6">
                            <Suspense
                              fallback={
                                <div className="h-[300px] bg-slate-100 dark:bg-slate-800 animate-pulse rounded" />
                              }
                            >
                              <AmortizationChart data={charts.amortizationData} />
                            </Suspense>
                            <AmortizationTable data={charts.amortizationData} />
                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed px-1">
                              Los resultados de amortización son orientativos y pueden variar según
                              la evaluación y condiciones finales de cada entidad financiera. Esta
                              herramienta ofrece una estimación del coste en función de los datos
                              introducidos, sin constituir una oferta vinculante ni una aprobación
                              del préstamo.
                            </p>
                          </div>
                        );
                      case "viability":
                        return (
                          <ViabilityAnalysis
                            monthlyIncome={derived.numMonthlyIncome}
                            maxLoanAmount={derived.maxLoanAmount}
                            currentLoanAmount={derived.loanAmount}
                            savings={derived.numSavings}
                          />
                        );
                      case "rent-vs-buy":
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

          <Footer />
        </div>
      )}
    </ThemeProvider>
  );
}
