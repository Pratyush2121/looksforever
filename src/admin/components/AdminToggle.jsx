import React from 'react';

export default function AdminToggle({
  label,
  name,
  checked,
  onChange,
  disabled = false,
  helperText,
  className = ''
}) {
  return (
    <div className={`flex items-start justify-between gap-4 ${className}`}>
      <div>
        <label htmlFor={name} className="text-xs font-semibold text-slate-800 cursor-pointer select-none">
          {label}
        </label>
        {helperText && (
          <p className="text-xs text-slate-500 mt-0.5">{helperText}</p>
        )}
      </div>

      <button
        type="button"
        id={name}
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed
          ${checked ? 'bg-brand-600' : 'bg-slate-200'}
        `}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out
            ${checked ? 'translate-x-5' : 'translate-x-0'}
          `}
        />
      </button>
    </div>
  );
}

