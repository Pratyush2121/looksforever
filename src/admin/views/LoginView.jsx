import React, { useState } from 'react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { useToast } from '../context/ToastContext';
import AdminButton from '../components/AdminButton';
import AdminInput from '../components/AdminInput';
import { Lock, User, ShieldCheck, ArrowRight, AlertCircle } from 'lucide-react';

export default function LoginView() {
  const { login } = useAdminAuth();
  const toast = useToast();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!username.trim() || !password) {
      setError('Please provide both username and password.');
      return;
    }

    setIsLoading(true);
    try {
      await login(username.trim(), password);
      toast.success('Authenticated successfully. Welcome back!');
    } catch (err) {
      setError(err.message || 'Invalid username or password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center items-center p-4 selection:bg-brand-500 selection:text-white">
      
      {/* Container */}
      <div className="w-full max-w-md">
        
        {/* Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          
          {/* Brand Logo Header */}
          <div className="text-center space-y-3">
            <div className="inline-flex p-3 bg-slate-50 border border-slate-100 rounded-xl max-w-[240px]">
              <img
                src="/brand/logo.png"
                alt="Looks Forever Hair Aesthetic Clinic"
                className="h-10 w-auto object-contain mx-auto"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/brand/logo-cropped.png';
                }}
              />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">Admin Portal</h1>
              <p className="text-xs text-slate-500 mt-1">
                Enter your credentials to manage clinic operations
              </p>
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-start gap-2.5 text-xs text-rose-700 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
              <div className="flex-1 font-medium">{error}</div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <AdminInput
              label="Username or Email"
              name="username"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              prefix={<User className="w-4 h-4 text-slate-400" />}
              autoComplete="username"
            />

            <AdminInput
              label="Password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              prefix={<Lock className="w-4 h-4 text-slate-400" />}
              autoComplete="current-password"
            />

            <AdminButton
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              className="w-full mt-2"
              icon={ArrowRight}
            >
              Sign In to Dashboard
            </AdminButton>
          </form>

          {/* Footnote on security */}
          <div className="pt-4 border-t border-slate-100 text-center">
            <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Session protected with HTTP-only cookies and bcrypt hash</span>
            </p>
          </div>

        </div>

        {/* Back to public link */}
        <div className="text-center mt-4">
          <a
            href="/"
            className="text-xs text-slate-500 hover:text-slate-800 transition"
          >
            ← Return to Looks Forever Storefront
          </a>
        </div>

      </div>

    </div>
  );
}

