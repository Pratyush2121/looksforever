import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  FolderTree, 
  Home, 
  Tag, 
  FileText, 
  Building2, 
  Inbox, 
  PanelTop, 
  Globe, 
  Settings, 
  BarChart3, 
  LogOut, 
  Menu, 
  X, 
  ExternalLink,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { useAdminAuth } from './context/AdminAuthContext';

export default function AdminLayout({
  activeTab,
  onTabChange,
  children
}) {
  const { admin, logout } = useAdminAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Enforce noindex for all admin pages
  useEffect(() => {
    let meta = document.querySelector('meta[name="robots"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'robots';
      document.head.appendChild(meta);
    }
    const previous = meta.content;
    meta.content = 'noindex, nofollow';

    return () => {
      meta.content = previous || 'index, follow';
    };
  }, []);

  const navGroups = [
    {
      label: null,
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }
      ]
    },
    {
      label: 'Catalog',
      items: [
        { id: 'products', label: 'Products', icon: Package },
        { id: 'categories', label: 'Categories', icon: FolderTree }
      ]
    },
    {
      label: 'Content',
      items: [
        { id: 'homepage', label: 'Homepage & Hero', icon: Home },
        { id: 'offers', label: 'Offers & Promos', icon: Tag },
        { id: 'blogs', label: 'Blogs & Guides', icon: FileText },
        { id: 'about', label: 'About & Clinic Story', icon: Building2 },
        { id: 'contact', label: 'Contact & Leads CRM', icon: Inbox }
      ]
    },
    {
      label: 'Site & Global',
      items: [
        { id: 'header_footer', label: 'Header & Footer', icon: PanelTop },
        { id: 'seo', label: 'SEO & Meta Tags', icon: Globe },
        { id: 'settings', label: 'General Settings', icon: Settings }
      ]
    },
    {
      label: 'Insights',
      items: [
        { id: 'analytics', label: 'Analytics & Events', icon: BarChart3 }
      ]
    }
  ];

  const handleNavSelect = (id) => {
    onTabChange(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col lg:flex-row font-sans selection:bg-brand-500 selection:text-white">
      
      {/* Mobile Top Navigation Bar */}
      <header className="lg:hidden sticky top-0 z-40 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <img 
              src="/brand/logo.png" 
              alt="Looks Forever" 
              className="h-7 w-auto object-contain"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/brand/logo-cropped.png';
              }}
            />
            <span className="text-xs font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-1.5 py-0.5 rounded border border-brand-200/60">
              Admin
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-slate-500 hover:text-brand-600 flex items-center gap-1 font-medium px-2 py-1 rounded"
          >
            <span>View Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </header>

      {/* Desktop Fixed Left Sidebar */}
      <aside className="hidden lg:flex w-64 bg-slate-900 text-slate-300 flex-col shrink-0 min-h-screen border-r border-slate-800">
        
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-9 px-2 bg-white rounded-lg flex items-center justify-center">
              <img 
                src="/brand/logo.png" 
                alt="Looks Forever" 
                className="h-7 w-auto object-contain"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/brand/logo-cropped.png';
                }}
              />
            </div>
            <div>
              <div className="text-xs font-bold text-white tracking-wide uppercase">Admin Suite</div>
              <div className="text-[11px] text-slate-400">Hair Aesthetic Clinic</div>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
          {navGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1">
              {group.label && (
                <div className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  {group.label}
                </div>
              )}
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleNavSelect(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-brand-600 text-white font-semibold shadow-xs'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>
                    {isActive && <ChevronRight className="w-3.5 h-3.5 text-brand-200" />}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Footer Profile & Logout */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/40">
          <div className="flex items-center justify-between px-2 py-2 rounded-lg">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-brand-700 text-white font-bold text-xs flex items-center justify-center shrink-0">
                {admin?.username?.charAt(0).toUpperCase() || 'A'}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-white truncate">{admin?.name || admin?.username || 'Administrator'}</div>
                <div className="text-[10px] text-slate-400 truncate flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400 inline shrink-0" />
                  <span>{admin?.role || 'admin'}</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={logout}
              title="Sign out"
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-2 pt-2 border-t border-slate-800/80 px-2 flex items-center justify-between text-[11px] text-slate-500">
            <a 
              href="/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-slate-300 flex items-center gap-1 transition"
            >
              <span>Live Website</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span>v2.0 Dynamic</span>
          </div>
        </div>
      </aside>

      {/* Mobile Drawer (Slide in) */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity" 
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="relative w-72 max-w-xs bg-slate-900 text-slate-300 flex flex-col h-full shadow-2xl z-10">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 px-2 bg-white rounded flex items-center justify-center">
                  <img src="/brand/logo.png" alt="Looks Forever" className="h-6 w-auto object-contain" />
                </div>
                <span className="text-xs font-bold text-white uppercase">Admin</span>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
              {navGroups.map((group, gIdx) => (
                <div key={gIdx} className="space-y-1">
                  {group.label && (
                    <div className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                      {group.label}
                    </div>
                  )}
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleNavSelect(item.id)}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium ${
                          isActive
                            ? 'bg-brand-600 text-white font-semibold'
                            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className="w-4 h-4" />
                          <span>{item.label}</span>
                        </div>
                        {isActive && <ChevronRight className="w-3.5 h-3.5 text-brand-200" />}
                      </button>
                    );
                  })}
                </div>
              ))}
            </nav>

            <div className="p-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400">{admin?.username}</span>
              <button
                type="button"
                onClick={logout}
                className="text-xs text-rose-400 hover:text-rose-300 font-medium flex items-center gap-1"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {children}
        </div>
      </main>

    </div>
  );
}

