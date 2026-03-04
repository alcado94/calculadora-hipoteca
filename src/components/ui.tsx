import React from 'react';
import { cn } from '../utils';

export function Input({ label, value, onChange, type = "number", min = 0, max, step, suffix, prefix, disabled, placeholder }: any) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-slate-700">{label}</label>
      <div className="relative flex items-center">
        {prefix && <span className="absolute left-3 text-slate-500">{prefix}</span>}
        <input
          type={type}
          value={value}
          onChange={onChange}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          placeholder={placeholder}
          onKeyDown={(e) => {
            if (type === 'number' && ['e', 'E', '+', '-'].includes(e.key)) {
              e.preventDefault();
            }
          }}
          className={cn(
            "w-full rounded-none border border-slate-300 bg-white px-3 py-3 sm:py-2 text-base sm:text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500",
            prefix && 'pl-8',
            suffix && 'pr-8',
            disabled && 'bg-slate-100 text-slate-500 cursor-not-allowed'
          )}
        />
        {suffix && <span className="absolute right-3 text-slate-500">{suffix}</span>}
      </div>
    </div>
  );
}

export function Select({ label, value, onChange, options }: any) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-slate-700">{label}</label>
      <select
        value={value}
        onChange={onChange}
        className="w-full rounded-none border border-slate-300 bg-white px-3 py-3 sm:py-2 text-base sm:text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
      >
        {options.map((opt: any) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function ListInput({ label, value, onChange, type = "number", min = 0, max, step, suffix, disabled }: any) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-2.5 gap-1.5 sm:gap-0">
      <span className="text-sm text-slate-600">{label}</span>
      <div className="flex items-center gap-1.5">
        <input
          type={type}
          value={value}
          onChange={onChange}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          onKeyDown={(e) => {
            if (type === 'number' && ['e', 'E', '+', '-'].includes(e.key)) {
              e.preventDefault();
            }
          }}
          className={cn(
            "w-full sm:w-28 text-right rounded-none border border-slate-200 bg-white px-3 sm:px-2 py-2.5 sm:py-1 text-base sm:text-sm font-medium text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500",
            disabled && "bg-slate-100 text-slate-500 cursor-not-allowed border-transparent shadow-none"
          )}
        />
        {suffix && <span className="text-sm text-slate-500 w-4">{suffix}</span>}
      </div>
    </div>
  );
}

export function ListSelect({ label, value, onChange, options }: any) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-2.5 gap-1.5 sm:gap-0">
      <span className="text-sm text-slate-600">{label}</span>
      <div className="flex items-center gap-1.5">
        <select
          value={value}
          onChange={onChange}
          className="w-full sm:w-48 text-right rounded-none border border-slate-200 bg-white px-3 sm:px-2 py-2.5 sm:py-1 text-base sm:text-sm font-medium text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          {options.map((opt: any) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <span className="w-4"></span> {/* Spacer to align with inputs that have suffixes */}
      </div>
    </div>
  );
}

export function Card({ children, className = "", flatOnMobile = false }: any) {
  return (
    <div
      className={cn(
        flatOnMobile
          ? "rounded-none border-0 bg-white p-0 shadow-none sm:border sm:border-slate-200 sm:p-5 sm:shadow-sm"
          : "rounded-none border border-slate-200 bg-white p-5 shadow-sm",
        className
      )}
    >
      {children}
    </div>
  );
}
