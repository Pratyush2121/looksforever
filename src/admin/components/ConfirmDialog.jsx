import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import AdminButton from './AdminButton';

export default function ConfirmDialog({
  isOpen,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed? This action cannot be undone.',
  confirmText = 'Delete',
  cancelText = 'Cancel',
  confirmVariant = 'danger',
  isLoading = false,
  onConfirm,
  onCancel
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150"
        role="alertdialog"
        aria-modal="true"
      >
        <div className="p-5 sm:p-6">
          <div className="flex items-start gap-4">
            <div className={`p-2.5 rounded-full shrink-0 ${confirmVariant === 'danger' ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'}`}>
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="text-base font-semibold text-slate-900">{title}</h3>
              <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">{message}</p>
            </div>
            <button
              type="button"
              onClick={onCancel}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="bg-slate-50 px-5 py-3.5 sm:px-6 flex items-center justify-end gap-3 border-t border-slate-100">
          <AdminButton
            type="button"
            variant="outline"
            size="md"
            onClick={onCancel}
            disabled={isLoading}
          >
            {cancelText}
          </AdminButton>
          <AdminButton
            type="button"
            variant={confirmVariant}
            size="md"
            isLoading={isLoading}
            onClick={onConfirm}
          >
            {confirmText}
          </AdminButton>
        </div>
      </div>
    </div>
  );
}

