/** Valores por defecto del formulario de la calculadora hipotecaria */
export const MORTGAGE_DEFAULTS = {
  budgetName: "Mi Presupuesto",
  propertyValue: "230000",
  ltv: "80",
  savings: "",
  monthlySavings: "",
  years: "30",
  mortgageType: "fixed",
  interestRate: "2.7",
  inflationRate: "2.9",
  monthlyIncome: "",
  equivalentRent: "",
  propertyType: "second-hand",
  itpRate: "8.0",
  ivaRate: "10.0",
  ajdRate: "1.5",
  ibiAndCommunity: "1200",
};

// ─── Gastos de compraventa — estimaciones estándar España ───────────────────

/** Porcentaje sobre el valor del inmueble para notaría (~0.3%) */
export const NOTARY_FEE_RATE = 0.003;
/** Base fija de honorarios de notaría (€) */
export const NOTARY_FEE_BASE = 300;

/** Porcentaje sobre el valor del inmueble para registro (~0.15%) */
export const REGISTRY_FEE_RATE = 0.0015;
/** Base fija de honorarios de registro (€) */
export const REGISTRY_FEE_BASE = 150;

/** Honorarios fijos de gestoría (€) */
export const GESTORIA_FEE = 400;

/** Porcentaje sobre el valor del inmueble para tasación (~0.1%) */
export const TASACION_FEE_RATE = 0.001;
/** Importe mínimo de tasación (€) */
export const TASACION_FEE_MIN = 300;

// ─── Viabilidad financiera ───────────────────────────────────────────────────

/**
 * Ratio máximo de esfuerzo hipotecario recomendado.
 * La cuota mensual no debería superar el 30% de los ingresos netos.
 */
export const MAX_EFFORT_RATIO = 0.3;
