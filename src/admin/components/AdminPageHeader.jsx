import React from 'react';

/**
 * Standard Admin Page Header
 * Enforces: Title, one-line description, and primary action on the right (stacked under on mobile).
 */
export default function AdminPageHeader({
  title,
  description,
  action,
  breadcrumbs,
  className = ''
}) {
  return (
    <div className={`pb-4 sm:pb-6 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${className}`}>
      <div className="space-y-1">
        {breadcrumbs && (
          <div className="text-xs text-slate-500 font-medium mb-1">
            {breadcrumbs}
          </div>
        )}
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          {title}
        </h1>
        {description && (
          <p className="text-xs sm:text-sm text-slate-500 max-w-3xl leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {action && (
        <div className="shrink-0 flex items-center gap-2.5">
          {action}
        </div>
      )}
    </div>
  );
}

