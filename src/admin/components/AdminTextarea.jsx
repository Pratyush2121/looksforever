import React from 'react';
import { AlertCircle } from 'lucide-react';

export default function AdminTextarea({
  label,
  name,
  value,
  onChange,
  placeholder,
  required = false,
  error,
  helperText,
  disabled = false,
  rows = 3,
  className = '',
  textareaClassName = ''
}) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label htmlFor={name} className="block text-xs font-semibold text-slate-700 tracking-wide">
          {label}
          {required && <span className="text-rose-500 ml-1 font-bold">*</span>}
        </label>
      )}

      <textarea
        id={name}
        name={name}
        value={value ?? ''}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        rows={rows}
        className={`block w-full text-sm rounded-lg border px-3.5 py-2.5 transition-all duration-150
          ${error
            ? 'border-rose-400 text-rose-900 placeholder-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 bg-rose-50/20'
            : 'border-slate-300 text-slate-900 placeholder-slate-400 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500'
          }
          disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed
          ${textareaClassName}
        `}
      />

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

