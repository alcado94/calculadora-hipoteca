import React, { useState } from "react";
import { Card } from "./ui";
import { formatCurrency } from "../utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface AmortizationTableProps {
  data: any[];
}

export function AmortizationTable({ data }: AmortizationTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = data.slice(startIndex, startIndex + itemsPerPage);

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <Card className="overflow-hidden p-0">
      <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Detalle de Amortización
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-600 dark:text-slate-400">
          <thead className="text-xs text-slate-500 dark:text-slate-400 uppercase bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th className="px-5 py-3 font-medium">Año</th>
              <th className="px-5 py-3 font-medium text-right">Capital Pendiente</th>
              <th className="px-5 py-3 font-medium text-right">Capital Amortizado</th>
              <th className="px-5 py-3 font-medium text-right">Intereses Acumulados</th>
              <th className="px-5 py-3 font-medium text-right">Cuota Real</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((row) => (
              <tr
                key={row.year}
                className="border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors"
              >
                <td className="px-5 py-3 font-medium text-slate-900 dark:text-slate-100">
                  {row.year}
                </td>
                <td className="px-5 py-3 text-right">{formatCurrency(row.balance)}</td>
                <td className="px-5 py-3 text-right">{formatCurrency(row.principalPaid)}</td>
                <td className="px-5 py-3 text-right">{formatCurrency(row.totalInterest)}</td>
                <td className="px-5 py-3 text-right text-slate-500 dark:text-slate-400">
                  {formatCurrency(row.realMonthlyPayment)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
          <div className="text-sm text-slate-500 dark:text-slate-400">
            Mostrando{" "}
            <span className="font-medium text-slate-900 dark:text-slate-100">{startIndex + 1}</span>{" "}
            a{" "}
            <span className="font-medium text-slate-900 dark:text-slate-100">
              {Math.min(startIndex + itemsPerPage, data.length)}
            </span>{" "}
            de <span className="font-medium text-slate-900 dark:text-slate-100">{data.length}</span>{" "}
            años
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="p-1 rounded-none border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="text-sm font-medium text-slate-700 dark:text-slate-200 px-2">
              Página {currentPage} de {totalPages}
            </div>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="p-1 rounded-none border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </Card>
  );
}
