import React from 'react';
import { AlertCircle, ChevronDown } from 'lucide-react';

export default function AdminSelect({
  label,
  name,
  value,
  onChange,
  options = [],
  required = false,
  error,
  helperText,
  disabled = false,
  placeholder = 'Select an option',
  className = '',
  selectClassName = ''
}) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label htmlFor={name} className="block text-xs font-semibold text-slate-700 tracking-wide">
          {label}
          {required && <span className="text-rose-500 ml-1 font-bold">*</span>}
        </label>
      )}

      <div className="relative rounded-lg shadow-2xs">
        <select
          id={name}
          name={name}
          value={value ?? ''}
          onChange={onChange}
          required={required}
          disabled={disabled}
          className={`block w-full appearance-none text-sm rounded-lg border py-2.5 pl-3.5 pr-10 transition-all duration-150
            ${error
              ? 'border-rose-400 text-rose-900 focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 bg-rose-50/20'
              : 'border-slate-300 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500'
            }
            disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed
            ${selectClassName}
          `}
        >
          {placeholder && <option value="" disabled>{placeholder}</option>}
          {options.map((opt) => {
            const val = typeof opt === 'object' ? opt.value : opt;
            const lbl = typeof opt === 'object' ? opt.label : opt;
            return (
              <option key={val} value={val}>
                {lbl}
              </option>
            );
          })}
        </select>

        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>

      {error ? (
        <p className="flex items-center gap-1 text-xs text-rose-600 font-medium mt-1 animate-in fade-in">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </p>
      ) : helperText ? (
        <p className="text-xs text-slate-500 mt-1">{helperText}</p>
      ) : null}
    </div>
  );
}

