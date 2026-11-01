import React from 'react';

export default function AdminBadge({
  children,
  variant = 'default',
  size = 'sm',
  dot = false,
  className = ''
}) {
  const variants = {
    default: 'bg-slate-100 text-slate-700 border-slate-200',
    primary: 'bg-brand-50 text-brand-700 border-brand-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    danger: 'bg-rose-50 text-rose-700 border-rose-200',
    info: 'bg-sky-50 text-sky-700 border-sky-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200'
  };

  const dots = {
    default: 'bg-slate-400',
    primary: 'bg-brand-500',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger: 'bg-rose-500',
    info: 'bg-sky-500',
    purple: 'bg-purple-500'
  };

  const sizes = {
    xs: 'text-[11px] px-1.5 py-0.5',
    sm: 'text-xs px-2.5 py-0.5',
    md: 'text-xs px-3 py-1 font-medium'
  };

  return (
    <span className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${variants[variant] || variants.default} ${sizes[size] || sizes.sm} ${className}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dots[variant] || dots.default}`}></span>}
      {children}
    </span>
  );
}

