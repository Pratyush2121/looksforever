import React, { useState } from 'react';
import { AdminAuthProvider, useAdminAuth } from './context/AdminAuthContext';
import { ToastProvider } from './context/ToastContext';
import AdminLayout from './AdminLayout';
import LoginView from './views/LoginView';
import DashboardView from './views/DashboardView';
import ProductsView from './views/ProductsView';
import CategoriesView from './views/CategoriesView';
import HomepageView from './views/HomepageView';
import OffersView from './views/OffersView';
import BlogsView from './views/BlogsView';
import AboutView from './views/AboutView';
import ContactView from './views/ContactView';
import HeaderFooterView from './views/HeaderFooterView';
import SeoView from './views/SeoView';
import SettingsView from './views/SettingsView';
import AnalyticsView from './views/AnalyticsView';
import { Loader2 } from 'lucide-react';

function AdminContent() {
  const { isAuthenticated, isLoading } = useAdminAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white">
        <Loader2 className="w-8 h-8 animate-spin text-brand-500 mb-3" />
        <p className="text-xs font-semibold text-slate-300">Checking session credentials...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginView />;
  }

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView onNavigate={(tab) => setActiveTab(tab)} />;
      case 'products':
        return <ProductsView />;
      case 'categories':
        return <CategoriesView />;
      case 'homepage':
        return <HomepageView />;
      case 'offers':
        return <OffersView />;
      case 'blogs':
        return <BlogsView />;
      case 'about':
        return <AboutView />;
      case 'contact':
        return <ContactView />;
      case 'header_footer':
        return <HeaderFooterView />;
      case 'seo':
        return <SeoView />;
      case 'settings':
        return <SettingsView />;
      case 'analytics':
        return <AnalyticsView />;
      default:
        return <DashboardView onNavigate={(tab) => setActiveTab(tab)} />;
    }
  };

  return (
    <AdminLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderActiveView()}
    </AdminLayout>
  );
}

export default function AdminApp() {
  return (
    <AdminAuthProvider>
      <ToastProvider>
        <AdminContent />
      </ToastProvider>
    </AdminAuthProvider>
  );
}

