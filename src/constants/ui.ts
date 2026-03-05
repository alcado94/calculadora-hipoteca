import type { SelectOption } from "../types/ui";

/** Opciones para el selector de tipo de hipoteca */
export const MORTGAGE_TYPE_OPTIONS: SelectOption[] = [
  { value: "fixed", label: "Fija" },
  { value: "variable", label: "Variable" },
];

/** Opciones para el selector de tipo de inmueble */
export const PROPERTY_TYPE_OPTIONS: SelectOption[] = [
  { value: "second-hand", label: "Segunda Mano (ITP)" },
  { value: "new", label: "Obra Nueva (IVA + AJD)" },
];

/** Número de filas por página en la tabla de amortización */
export const AMORTIZATION_TABLE_PAGE_SIZE = 10;
