import React, { useState, useEffect, useRef, Suspense } from "react";
import { Calculator } from "lucide-react";
import { LazyAmortizationChart as AmortizationChart } from "./components/charts";
import { MortgageQuotaCard } from "./components/summary/MortgageQuotaCard";
import { RequiredSavingsCard } from "./components/summary/RequiredSavingsCard";
import { MortgageAmountCard } from "./components/summary/MortgageAmountCard";
import { AmortizationTable } from "./components/analysis/AmortizationTable";
import { ViabilityAnalysis } from "./components/analysis/ViabilityAnalysis";
import { RentVsBuyAnalysis } from "./components/analysis/RentVsBuyAnalysis";
import { useMortgageCalculator } from "./hooks/useMortgageCalculator";
import { InitialForm } from "./components/layout/InitialForm";
import { ThemeProvider } from "./components/ui/ThemeProvider";
import { Tabs } from "./components/ui";
import { Footer } from "./components/layout/Footer";
import { MortgageConfigPanel } from "./components/layout/MortgageConfigPanel";
import { ExportButton } from "./components/layout/ExportButton";
import { URL_PARAM_KEYS, MORTGAGE_TYPES, PROPERTY_TYPES } from "./constants/url";

// SSR-safe browser helpers
const isBrowser = typeof window !== "undefined";
const getLocationSearch = () => (isBrowser ? window.location.search : "");
const getLocationPathname = () => (isBrowser ? window.location.pathname : "/");
const replaceState = (url: string) => {
  if (isBrowser) window.history.replaceState({}, "", url);
};

// Extend Window type for SSG shell callback
declare global {
  interface Window {
    __appMounted?: () => void;
  }
}

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
  const [viewMode, setViewMode] = useState<"form" | "results">("form");
  const isHydratingFromUrl = useRef(false);
  const hasMounted = useRef(false);

  const updateUrlFromState = () => {
    const params = new URLSearchParams();

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
    if (isBrowser && typeof window.__appMounted === "function") {
      window.__appMounted();
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
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
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
            </div>
          </header>

          <main className="max-w-[1600px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-1">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
              <MortgageConfigPanel
                state={state}
                setters={setters}
                handleNumberChange={handleNumberChange}
                derived={derived}
              />

              {/* Right Column: Results & Charts */}
              <div className="lg:col-span-8 xl:col-span-9 space-y-6">
                <div className="grid grid-cols-1 auto-rows-fr md:grid-cols-3 gap-4 [&>*]:h-full">
                  <MortgageQuotaCard
                    monthlyMortgage={derived.monthlyPayment}
                    monthlyIbiAndCommunity={derived.monthlyIbiAndCommunity}
                    years={derived.numYears}
                    affordabilityRatio={derived.affordabilityRatio}
                    monthlyIncome={derived.numMonthlyIncome}
                  />

                  <RequiredSavingsCard
                    totalInitialCash={derived.totalInitialCash}
                    downPayment={derived.downPayment}
                    totalExpenses={derived.totalExpenses}
                    missingSavings={derived.missingSavings}
                    savings={derived.numSavings}
                    monthlySavings={derived.numMonthlySavings}
                    monthsToSave={derived.monthsToSave}
                    yearsToSave={derived.yearsToSave}
                    isSavingsRealistic={derived.isSavingsRealistic}
                    freeIncome={derived.freeIncome}
                    equivalentRent={derived.numEquivalentRent}
                    monthlyIncome={derived.numMonthlyIncome}
                  />

                  <MortgageAmountCard
                    loanAmount={derived.loanAmount}
                    ltv={derived.numLtv}
                    totalInterestPaid={derived.totalInterestPaid}
                    totalCostOfProperty={derived.totalCostOfProperty}
                    downPayment={derived.downPayment}
                    totalExpenses={derived.totalExpenses}
                    monthlyIbiAndCommunity={derived.monthlyIbiAndCommunity}
                    years={derived.numYears}
                  />
                </div>

                {/* Boton de exportacion a Excel */}
                <div className="flex justify-end mb-0">
                  <ExportButton
                    state={state}
                    derived={derived}
                    amortizationData={charts.amortizationData}
                  />
                </div>

                <Tabs defaultValue="table">
                  <Tabs.List className="border-b border-slate-200 dark:border-slate-700 mb-6">
                    <Tabs.Trigger value="table">Detalle de Amortización</Tabs.Trigger>
                    <Tabs.Trigger value="viability">Análisis de Viabilidad</Tabs.Trigger>
                    <Tabs.Trigger value="rent-vs-buy">Comprar vs Alquilar</Tabs.Trigger>
                  </Tabs.List>

                  <Tabs.Content value="table">
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
                        Los resultados de amortización son orientativos y pueden variar según la
                        evaluación y condiciones finales de cada entidad financiera. Esta
                        herramienta ofrece una estimación del coste en función de los datos
                        introducidos, sin constituir una oferta vinculante ni una aprobación del
                        préstamo.
                      </p>
                    </div>
                  </Tabs.Content>

                  <Tabs.Content value="viability">
                    <ViabilityAnalysis
                      monthlyIncome={derived.numMonthlyIncome}
                      maxLoanAmount={derived.maxLoanAmount}
                      currentLoanAmount={derived.loanAmount}
                      savings={derived.numSavings}
                    />
                  </Tabs.Content>

                  <Tabs.Content value="rent-vs-buy">
                    <RentVsBuyAnalysis
                      propertyValue={derived.numPropertyValue}
                      monthlyRent={state.equivalentRent}
                    />
                  </Tabs.Content>
                </Tabs>
              </div>
            </div>
          </main>

          <Footer />
        </div>
      )}
    </ThemeProvider>
  );
}
