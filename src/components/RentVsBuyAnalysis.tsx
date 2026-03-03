import React from 'react';
import { Card } from './ui';
import { formatCurrency } from '../utils';
import { Info, TrendingUp, AlertCircle } from 'lucide-react';

interface RentVsBuyAnalysisProps {
  propertyValue: number;
  monthlyRent: string | number;
}

export function RentVsBuyAnalysis({ propertyValue, monthlyRent }: RentVsBuyAnalysisProps) {
  const numMonthlyRent = Number(monthlyRent) || 0;
  const annualRent = numMonthlyRent * 12;
  const grossYield = propertyValue > 0 ? (annualRent / propertyValue) * 100 : 0;

  let yieldCategory = '';
  let yieldColor = '';
  let yieldBg = '';
  let yieldBorderColor = '';
  let yieldDescription = '';

  if (grossYield < 3) {
    yieldCategory = 'Caro';
    yieldColor = 'text-rose-600';
    yieldBg = 'bg-rose-50 border-rose-200';
    yieldBorderColor = 'border-l-rose-500';
    yieldDescription = 'La rentabilidad es muy baja. Financieramente suele ser mejor alquilar e invertir tus ahorros en otros activos.';
  } else if (grossYield < 5) {
    yieldCategory = 'Normal';
    yieldColor = 'text-orange-600';
    yieldBg = 'bg-orange-50 border-orange-200';
    yieldBorderColor = 'border-l-orange-500';
    yieldDescription = 'Rentabilidad estándar en el mercado actual. La decisión de compra dependerá más de factores personales que puramente financieros.';
  } else if (grossYield < 7) {
    yieldCategory = 'Interesante';
    yieldColor = 'text-emerald-600';
    yieldBg = 'bg-emerald-50 border-emerald-200';
    yieldBorderColor = 'border-l-emerald-500';
    yieldDescription = 'Buena rentabilidad. La compra empieza a ser una opción financieramente muy atractiva frente al alquiler.';
  } else {
    yieldCategory = 'Muy interesante';
    yieldColor = 'text-indigo-600';
    yieldBg = 'bg-indigo-50 border-indigo-200';
    yieldBorderColor = 'border-l-indigo-500';
    yieldDescription = 'Excelente rentabilidad implícita. Comprar esta propiedad es financieramente mucho más ventajoso que alquilarla.';
  }

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-100 rounded-none p-4 flex gap-3 text-blue-800">
        <Info className="w-5 h-5 shrink-0 mt-0.5" />
        <div className="text-sm">
          <strong>Consejo:</strong> Para que este análisis sea preciso, el alquiler introducido en los datos de la hipoteca debe corresponder a una <strong>propiedad equivalente</strong> (mismas características, metros cuadrados, zona y estado de conservación).
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className={`lg:col-span-2 flex flex-col justify-center border-l-4 ${yieldBorderColor}`}>
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            <div className="text-center md:text-left shrink-0">
              <div className="text-slate-500 font-medium mb-1">Rentabilidad Bruta (Yield)</div>
              <div className={`text-6xl font-bold tracking-tight mb-2 ${yieldColor}`}>
                {grossYield.toFixed(1)}%
              </div>
              <div className={`inline-block px-3 py-1 rounded-none text-sm font-semibold border ${yieldBg} ${yieldColor}`}>
                {yieldCategory}
              </div>
            </div>
            
            <div className="flex-1 pt-2 md:pt-0 md:border-l md:border-slate-100 md:pl-8">
              <h3 className="font-semibold text-slate-800 mb-2 flex items-center gap-2">
                <AlertCircle className={`w-5 h-5 ${yieldColor}`} />
                Interpretación
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                {yieldDescription}
              </p>
              {grossYield < 3 && (
                <p className="text-slate-700 text-sm leading-relaxed mt-2 font-medium">
                  📌 Si la yield es muy baja, financieramente suele ser mejor alquilar.
                </p>
              )}
            </div>
          </div>
        </Card>

        <Card className="flex flex-col justify-center bg-slate-50/50">
          <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2 text-sm">
            <TrendingUp className="w-4 h-4 text-slate-400" />
            Desglose del Cálculo
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <span className="text-slate-500">Alquiler Anual</span>
              <span className="font-semibold text-slate-700">{formatCurrency(annualRent)}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <span className="text-slate-500">Precio Inmueble</span>
              <span className="font-semibold text-slate-700">{formatCurrency(propertyValue)}</span>
            </div>
            <div className="pt-1 text-xs text-slate-500 font-mono text-center">
              ({formatCurrency(annualRent)} / {formatCurrency(propertyValue)}) × 100
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <h3 className="font-semibold text-slate-800 mb-4">Escala de Referencia</h3>
        <div className="relative pt-8 pb-2">
          {/* Barra de colores */}
          <div className="h-3 w-full rounded-none flex overflow-hidden">
            <div className="bg-rose-300 h-full" style={{ width: '30%' }}></div>
            <div className="bg-orange-300 h-full" style={{ width: '20%' }}></div>
            <div className="bg-emerald-300 h-full" style={{ width: '20%' }}></div>
            <div className="bg-indigo-300 h-full" style={{ width: '30%' }}></div>
          </div>
          
          {/* Marcas */}
          <div className="absolute top-2 left-[30%] -translate-x-1/2 text-xs font-semibold text-slate-500">3%</div>
          <div className="absolute top-2 left-[50%] -translate-x-1/2 text-xs font-semibold text-slate-500">5%</div>
          <div className="absolute top-2 left-[70%] -translate-x-1/2 text-xs font-semibold text-slate-500">7%</div>

          {/* Etiquetas */}
          <div className="flex justify-between mt-3 text-xs text-slate-500 font-medium px-2">
            <div className="w-[30%] text-center">Caro</div>
            <div className="w-[20%] text-center">Normal</div>
            <div className="w-[20%] text-center">Interesante</div>
            <div className="w-[30%] text-center">Muy interesante</div>
          </div>

          {/* Indicador actual */}
          <div 
            className="absolute top-7 w-4 h-4 bg-white border-2 border-slate-800 rounded-none shadow-md -translate-x-1/2 transition-all duration-500"
            style={{ left: `${Math.min(Math.max(grossYield * 10, 0), 100)}%` }}
          ></div>
        </div>
      </Card>
    </div>
  );
}
