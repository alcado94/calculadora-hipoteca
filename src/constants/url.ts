/** Mapeo de claves de estado a parámetros cortos de URL para compartir simulaciones */
export const URL_PARAM_KEYS = {
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

/** Valores válidos para el tipo de hipoteca */
export const MORTGAGE_TYPES = new Set(["fixed", "variable"]);

/** Valores válidos para el tipo de inmueble */
export const PROPERTY_TYPES = new Set(["second-hand", "new"]);
