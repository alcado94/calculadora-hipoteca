import React, { useState } from "react";
import { Download, Loader2, FileSpreadsheet } from "lucide-react";
import type { MortgageState, MortgageDerived } from "../../types/mortgage";
import type { AmortizationRow } from "../../types/charts";

interface ExportButtonProps {
  state: MortgageState;
  derived: MortgageDerived;
  amortizationData: AmortizationRow[];
}

export function ExportButton({ state, derived, amortizationData }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [hasError, setHasError] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    setProgress(0);
    setHasError(false);

    try {
      // Dynamic imports — ExcelJS (~1MB) y file-saver se cargan solo cuando el usuario
      // pulsa el boton, manteniendo el bundle inicial sin cambios de tamano
      const [{ generateMortgageExcel }, { saveAs }] = await Promise.all([
        import("../../utils/exportExcel"),
        import("file-saver"),
      ]);

      const blob = await generateMortgageExcel({ state, derived, amortizationData }, (p) =>
        setProgress(p)
      );

      // Nombre del fichero descriptivo: hipoteca_230000_80%_30a.xlsx
      const filename = `hipoteca_${Math.round(derived.numPropertyValue)}_${derived.numLtv}pct_${derived.numYears}a.xlsx`;
      saveAs(blob, filename);
    } catch (error) {
      console.error("Error al generar el fichero Excel:", error);
      setHasError(true);
    } finally {
      setIsExporting(false);
      // Mantener el progress a 100 brevemente antes de resetear
      setTimeout(() => setProgress(0), 600);
    }
  };

  return (
    <div className="flex flex-col items-end gap-1.5">
      <button
        onClick={handleExport}
        disabled={isExporting}
        className={[
          "relative overflow-hidden flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors duration-200",
          "rounded-none border",
          isExporting
            ? "bg-slate-700 border-slate-700 text-white cursor-not-allowed"
            : "bg-slate-700 border-slate-700 text-white hover:bg-slate-800 hover:border-slate-800 cursor-pointer",
        ].join(" ")}
        aria-busy={isExporting}
        aria-label={
          isExporting
            ? `Descargando hoja de calculo, ${progress}%`
            : "Descargar hoja de calculo Excel"
        }
      >
        {isExporting && (
          <span
            className="absolute inset-y-0 left-0 bg-slate-500/35 transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        )}

        <span className="relative z-10 flex items-center gap-1.5">
          {isExporting ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
          ) : (
            <FileSpreadsheet className="w-3.5 h-3.5 shrink-0" />
          )}
          <span>{isExporting ? "Descargando..." : "Descargar Excel"}</span>
          {!isExporting && <Download className="w-3 h-3 shrink-0 opacity-70" />}
        </span>
      </button>

      {/* Mensaje de error */}
      {hasError && !isExporting && (
        <p className="text-xs text-red-500 dark:text-red-400">
          Error al generar el fichero. Intentalo de nuevo.
        </p>
      )}
    </div>
  );
}
