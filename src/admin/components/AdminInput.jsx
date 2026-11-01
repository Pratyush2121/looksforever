import React from 'react';
import { AlertCircle } from 'lucide-react';

export default function AdminInput({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  error,
  helperText,
  disabled = false,
  prefix,
  suffix,
  className = '',
  inputClassName = '',
  min,
  max,
  step,
  autoComplete
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
        {prefix && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 text-sm">
            {prefix}
          </div>
        )}

        <input
          id={name}
          name={name}
          type={type}
          value={value ?? ''}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          min={min}
          max={max}
          step={step}
          autoComplete={autoComplete}
          className={`block w-full text-sm rounded-lg border transition-all duration-150
            ${prefix ? 'pl-9' : 'pl-3.5'}
            ${suffix ? 'pr-9' : 'pr-3.5'}
            py-2.5
            ${error
              ? 'border-rose-400 text-rose-900 placeholder-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 bg-rose-50/20'
              : 'border-slate-300 text-slate-900 placeholder-slate-400 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500'
            }
            disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed
            ${inputClassName}
          `}
        />

        {suffix && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400 text-sm">
            {suffix}
          </div>
        )}
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

