import React from 'react';

/**
 * Standard Admin Card Container
 * Used to group form fields, tables, or dashboard widgets with consistent 8px spacing scale.
 */
export default function AdminCard({
  title,
  description,
  action,
  children,
  className = '',
  contentClassName = '',
  noPadding = false
}) {
  return (
    <div className={`bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden ${className}`}>
      {(title || description || action) && (
        <div className="px-5 py-4 sm:px-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            {title && <h3 className="text-sm sm:text-base font-semibold text-slate-900 tracking-tight">{title}</h3>}
            {description && <p className="text-xs sm:text-sm text-slate-500 mt-0.5">{description}</p>}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      <div className={noPadding ? contentClassName : `p-5 sm:p-6 ${contentClassName}`}>
        {children}
      </div>
    </div>
  );
}

