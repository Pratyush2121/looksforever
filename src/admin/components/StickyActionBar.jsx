import React from 'react';
import AdminButton from './AdminButton';
import { AlertCircle, Save } from 'lucide-react';

export default function StickyActionBar({
  onSave,
  onCancel,
  isSaving = false,
  isDirty = false,
  saveText = 'Save Changes',
  cancelText = 'Cancel',
  disabled = false,
  className = ''
}) {
  return (
    <div className={`sticky bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 py-3.5 sm:px-6 shadow-lg -mx-4 sm:-mx-6 lg:-mx-8 mt-8 flex flex-col sm:flex-row items-center justify-between gap-3 ${className}`}>
      <div className="flex items-center gap-2 text-xs">
        {isDirty ? (
          <span className="flex items-center gap-1.5 text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-md font-medium">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>You have unsaved changes</span>
          </span>
        ) : (
          <span className="text-slate-400">All changes saved to database</span>
        )}
      </div>

      <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
        {onCancel && (
          <AdminButton
            type="button"
            variant="outline"
            size="md"
            onClick={onCancel}
            disabled={isSaving}
          >
            {cancelText}
          </AdminButton>
        )}
        <AdminButton
          type="button"
          variant="primary"
          size="md"
          icon={Save}
          isLoading={isSaving}
          disabled={disabled || isSaving || !isDirty}
          onClick={onSave}
        >
          {saveText}
        </AdminButton>
      </div>
    </div>
  );
}

