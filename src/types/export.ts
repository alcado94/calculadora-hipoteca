import type { MortgageState, MortgageDerived } from "./mortgage";
import type { AmortizationRow } from "./charts";

/** Todos los datos necesarios para generar el fichero Excel */
export interface ExportData {
  state: MortgageState;
  derived: MortgageDerived;
  amortizationData: AmortizationRow[];
}

/**
 * Callback de progreso invocado durante la generacion del Excel.
 * progress: numero entre 0 y 100 que representa el porcentaje completado.
 *
 * Puntos de reporte:
 *   0  → inicio
 *   15 → hoja 1 (Resumen y Parametros) completada
 *   50 → hoja 2 (Amortizacion) completada
 *   70 → hoja 3 (Analisis de Viabilidad) completada
 *   90 → hoja 4 (Comprar vs Alquilar) completada
 *  100 → blob generado y listo para descarga
 */
export type ExportProgressCallback = (progress: number) => void;
