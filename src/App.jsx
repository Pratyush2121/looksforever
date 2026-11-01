import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PublicStorefront from './PublicStorefront';
import { Loader2 } from 'lucide-react';

// Code-split admin bundle: normal visitors will NOT download the admin chunk
const AdminApp = lazy(() => import('./admin/AdminApp'));

function AdminLoadingFallback() {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white selection:bg-brand-500 selection:text-white">
      <div className="p-3 bg-slate-800 rounded-2xl border border-slate-700 shadow-xl mb-4">
        <Loader2 className="w-8 h-8 animate-spin text-brand-400" />
      </div>
      <p className="text-xs font-semibold tracking-wide text-slate-300">
        Loading Looks Forever Admin Suite...
      </p>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Hidden Admin Suite: Reachable only via direct URL /admin */}
        <Route
          path="/admin/*"
          element={
            <Suspense fallback={<AdminLoadingFallback />}>
              <AdminApp />
            </Suspense>
          }
        />

        {/* Public Storefront */}
        <Route path="/*" element={<PublicStorefront />} />
      </Routes>
    </BrowserRouter>
  );
}
