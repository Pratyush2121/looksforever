import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Package,
  Users,
  Settings,
  Plus,
  Trash2,
  Edit3,
  RotateCcw,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  MessageCircle,
  Download,
  AlertTriangle,
  X,
  TrendingUp,
  DollarSign,
  ShieldAlert,
  Save,
  RefreshCw,
  SlidersHorizontal,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { CATEGORIES } from '../config/siteConfig';

export default function AdminPanel({ isOpen, onClose, onProductsChanged }) {
  const [activeTab, setActiveTab] = useState('products'); // 'dashboard', 'products', 'leads', 'settings'
  const [products, setProducts] = useState([]);
  const [leads, setLeads] = useState([]);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [backendOnline, setBackendOnline] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);

  // Filters & Search
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('all');
  const [leadSearch, setLeadSearch] = useState('');
  const [leadStatusFilter, setLeadStatusFilter] = useState('ALL');

  // Product Modals
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState(getEmptyProductForm());
  const [isDeletingId, setIsDeletingId] = useState(null);

  // Lead Note Modal
  const [activeLeadForNote, setActiveLeadForNote] = useState(null);
  const [noteInput, setNoteInput] = useState('');

  // Webhook settings
  const [crmWebhookUrl, setCrmWebhookUrl] = useState('https://crm.example.com/api/v1/looksforever/leads');
  const [isSyncingCrm, setIsSyncingCrm] = useState(false);

  function getEmptyProductForm() {
    return {
      name: '',
      category: 'hair-patches',
      price: '',
      originalPrice: '',
      discount: '25% OFF',
      badge: 'Popular',
      image: '',
      shortDesc: '',
      description: '',
      specifications: {
        "Base Type": "Undetectable Lace Mesh",
        "Hair Type": "100% Virgin Indian Remy Hair",
        "Hair Density": "120% Medium Natural"
      }
    };
  }

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Fetch all data from backend
  const fetchData = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch products
      const prodRes = await fetch('/api/products');
      if (prodRes.ok) {
        const prodData = await prodRes.json();
        setProducts(prodData);
        setBackendOnline(true);
      } else {
        setBackendOnline(false);
      }

      // 2. Fetch CRM leads
      const leadRes = await fetch('/api/leads');
      if (leadRes.ok) {
        const leadData = await leadRes.json();
        setLeads(leadData);
      }

      // 3. Fetch stats
      const statsRes = await fetch('/api/stats');
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }
    } catch (err) {
      console.warn('Backend server may be offline:', err);
      setBackendOnline(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // ==========================================
  // PRODUCT ACTIONS
  // ==========================================

  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProductForm(getEmptyProductForm());
    setIsAddProductOpen(true);
  };

  const handleOpenEditProduct = (prod) => {
    setEditingProduct(prod);
    setProductForm({
      name: prod.name,
      category: prod.category || 'hair-patches',
      price: prod.price,
      originalPrice: prod.originalPrice || Math.round(prod.price * 1.3),
      discount: prod.discount || '20% OFF',
      badge: prod.badge || '',
      image: prod.image || '',
      shortDesc: prod.shortDesc || '',
      description: prod.description || '',
      specifications: prod.specifications || {}
    });
    setIsAddProductOpen(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!productForm.name || !productForm.price) {
      alert('Please fill product name and price.');
      return;
    }

    const payload = {
      ...productForm,
      price: Number(productForm.price),
      originalPrice: Number(productForm.originalPrice) || Math.round(Number(productForm.price) * 1.3),
      gallery: productForm.image ? [productForm.image] : []
    };

    try {
      if (editingProduct) {
        // PUT update
        const res = await fetch(`/api/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          showToast(`Product "${productForm.name.slice(0, 20)}..." updated successfully!`);
        }
      } else {
        // POST create
        const res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          showToast(`New product "${productForm.name.slice(0, 20)}..." added!`);
        }
      }
      setIsAddProductOpen(false);
      fetchData();
      if (onProductsChanged) onProductsChanged();
    } catch (err) {
      alert('Failed to save product: ' + err.message);
    }
  };

  const handleDeleteProduct = async (id, name) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${name}"?`)) return;

    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast(`Product "${name.slice(0, 20)}..." deleted.`);
        fetchData();
        if (onProductsChanged) onProductsChanged();
      } else {
        alert('Could not delete product.');
      }
    } catch (err) {
      alert('Error deleting: ' + err.message);
    }
  };

  const handleResetToScraped = async () => {
    if (!window.confirm('Reset catalog back to the 22 authentic scraped Looks Forever products? Any custom products will be restored to seed.')) return;

    try {
      const res = await fetch('/api/products/reset', { method: 'POST' });
      if (res.ok) {
        showToast('Catalog restored to authentic Looks Forever seed products!');
        fetchData();
        if (onProductsChanged) onProductsChanged();
      }
    } catch (err) {
      alert('Reset failed: ' + err.message);
    }
  };

  // ==========================================
  // CRM LEADS ACTIONS
  // ==========================================

  const handleUpdateLeadStatus = async (leadId, newStatus) => {
    try {
      const res = await fetch(`/api/leads/${leadId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        showToast(`Lead status updated to ${newStatus}`);
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddLeadNote = async (e) => {
    e.preventDefault();
    if (!noteInput.trim() || !activeLeadForNote) return;

    try {
      const res = await fetch(`/api/leads/${activeLeadForNote.id}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note: noteInput, author: 'Admin Specialist' })
      });
      if (res.ok) {
        showToast('CRM note recorded!');
        setNoteInput('');
        setActiveLeadForNote(null);
        fetchData();
      }
    } catch (err) {
      alert('Error saving note: ' + err.message);
    }
  };

  const handleDeleteLead = async (leadId) => {
    if (!window.confirm('Delete this CRM lead entry?')) return;
    try {
      const res = await fetch(`/api/leads/${leadId}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('Lead removed from CRM database.');
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleExportCsv = () => {
    window.open('/api/crm/export', '_blank');
  };

  const handleSyncCrm = async () => {
    setIsSyncingCrm(true);
    try {
      const res = await fetch('/api/crm/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ webhookUrl: crmWebhookUrl })
      });
      const data = await res.json();
      if (res.ok) {
        showToast(`CRM Sync Complete! Synchronized ${data.syncedCount || leads.length} leads.`);
        fetchData();
      }
    } catch (err) {
      showToast('CRM Sync simulated locally.');
    } finally {
      setIsSyncingCrm(false);
    }
  };

  // Filter products
  const filteredProducts = products.filter(p => {
    const matchesCat = productCategoryFilter === 'all' || p.category === productCategoryFilter;
    const matchesSearch = !productSearch || 
      p.name.toLowerCase().includes(productSearch.toLowerCase()) || 
      (p.shortDesc && p.shortDesc.toLowerCase().includes(productSearch.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  // Filter leads
  const filteredLeads = leads.filter(l => {
    const matchesStatus = leadStatusFilter === 'ALL' || l.status === leadStatusFilter;
    const matchesSearch = !leadSearch || 
      l.name.toLowerCase().includes(leadSearch.toLowerCase()) || 
      l.phone.toLowerCase().includes(leadSearch.toLowerCase()) ||
      (l.city && l.city.toLowerCase().includes(leadSearch.toLowerCase())) ||
      (l.service && l.service.toLowerCase().includes(leadSearch.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-900 text-slate-100 overflow-hidden animate-in fade-in">
      
      {/* Toast Feedback */}
      {toastMsg && (
        <div className="fixed top-5 right-6 z-[60] bg-brand-600 text-white px-5 py-3 rounded-2xl shadow-2xl text-xs font-bold border border-brand-400 flex items-center gap-2.5 animate-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-accent-cyan" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Top Navigation Bar */}
      <header className="h-16 px-6 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between shrink-0 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 bg-white px-2 py-1 rounded-xl shadow-md border border-slate-700 flex items-center justify-center">
              <img 
                src="/brand/logo.png" 
                alt="Looks Forever Hair Aesthetic Clinic" 
                className="h-7 w-auto object-contain" 
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm tracking-wide text-white">Looks Forever Admin Suite</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-500/20 text-brand-300 border border-brand-500/30">
                  PRO v2.0
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Products Management & CRM Lead Pipeline</p>
            </div>
          </div>

          {/* Live Status indicator */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-[11px]">
            <span className={`w-2 h-2 rounded-full ${backendOnline ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            <span className="text-slate-300">
              {backendOnline ? 'Backend API Live (Port 5000)' : 'Connecting / Local Mode'}
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-2xl border border-slate-800">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
              activeTab === 'dashboard' ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Dashboard</span>
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
              activeTab === 'products' ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Products</span>
            <span className="px-1.5 py-0.2 rounded-md bg-white/20 text-[10px]">
              {products.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('leads')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
              activeTab === 'leads' ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>CRM Leads</span>
            <span className="px-1.5 py-0.2 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px]">
              {leads.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              activeTab === 'settings' ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span className="hidden md:inline">CRM Settings</span>
          </button>
        </div>

        {/* Close Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={fetchData}
            title="Refresh Data"
            className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-500/20 hover:text-rose-400 text-slate-300 text-xs font-semibold transition border border-slate-700"
          >
            <X className="w-4 h-4" />
            <span>Exit Admin</span>
          </button>
        </div>
      </header>

      {/* Main View Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">

        {/* TAB 1: DASHBOARD OVERVIEW */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 max-w-7xl mx-auto">
            
            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-3xl bg-slate-800/80 border border-slate-700/80 shadow-lg">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">Catalog Products</span>
                  <Package className="w-5 h-5 text-brand-400" />
                </div>
                <div className="text-3xl font-extrabold text-white">{products.length}</div>
                <p className="text-xs text-slate-400 mt-1">22 scraped directly from looksforever.org</p>
              </div>

              <div className="p-5 rounded-3xl bg-slate-800/80 border border-slate-700/80 shadow-lg">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">CRM Total Leads</span>
                  <Users className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="text-3xl font-extrabold text-white">{leads.length}</div>
                <p className="text-xs text-emerald-400 mt-1">
                  {leads.filter(l => l.status === 'NEW').length} New Inquiries requiring follow-up
                </p>
              </div>

              <div className="p-5 rounded-3xl bg-slate-800/80 border border-slate-700/80 shadow-lg">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">Conversion Pipeline</span>
                  <TrendingUp className="w-5 h-5 text-purple-400" />
                </div>
                <div className="text-3xl font-extrabold text-white">
                  {stats?.conversionRate || '33.3%'}
                </div>
                <p className="text-xs text-purple-300 mt-1">
                  {leads.filter(l => l.status === 'CONVERTED').length} Converted / Closed Consultations
                </p>
              </div>

              <div className="p-5 rounded-3xl bg-slate-800/80 border border-slate-700/80 shadow-lg">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">Inventory Value</span>
                  <DollarSign className="w-5 h-5 text-amber-400" />
                </div>
                <div className="text-3xl font-extrabold text-white">
                  ₹{stats?.totalInventoryValue ? (stats.totalInventoryValue).toLocaleString('en-IN') : '3,45,000'}
                </div>
                <p className="text-xs text-amber-300 mt-1">Across 5 specialized aesthetic categories</p>
              </div>
            </div>

            {/* Quick Actions Bar */}
            <div className="p-5 rounded-3xl bg-gradient-to-r from-brand-900/60 to-slate-800 border border-brand-700/40 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-accent-cyan" />
                  Quick Store Control
                </h4>
                <p className="text-xs text-slate-300">Fast access to add hair systems, export CRM leads, or re-sync catalog.</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={handleOpenAddProduct}
                  className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-brand-600/20"
                >
                  <Plus className="w-4 h-4" />
                  Add New Product
                </button>
                <button
                  onClick={() => setActiveTab('leads')}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/20"
                >
                  <Users className="w-4 h-4" />
                  View CRM Leads ({leads.length})
                </button>
                <button
                  onClick={handleExportCsv}
                  className="px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold text-xs flex items-center gap-2 border border-slate-600"
                >
                  <Download className="w-4 h-4" />
                  Download Leads CSV
                </button>
              </div>
            </div>

            {/* Recent Leads Preview */}
            <div className="p-6 rounded-3xl bg-slate-800/80 border border-slate-700/80 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-bold text-white">Recent Customer Inquiries & CRM Leads</h4>
                  <p className="text-xs text-slate-400">Visitors who registered for consultations or products on the website</p>
                </div>
                <button
                  onClick={() => setActiveTab('leads')}
                  className="text-xs text-brand-400 hover:text-brand-300 font-semibold flex items-center gap-1"
                >
                  View All Leads <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="text-slate-400 uppercase tracking-wider border-b border-slate-700 pb-2">
                    <tr>
                      <th className="py-2.5 px-3">Lead ID</th>
                      <th className="py-2.5 px-3">Customer</th>
                      <th className="py-2.5 px-3">Phone</th>
                      <th className="py-2.5 px-3">Service Interested</th>
                      <th className="py-2.5 px-3">Date</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/60">
                    {leads.slice(0, 5).map(lead => (
                      <tr key={lead.id} className="hover:bg-slate-700/30 transition">
                        <td className="py-3 px-3 font-mono font-bold text-brand-400">{lead.id}</td>
                        <td className="py-3 px-3">
                          <div className="font-semibold text-white">{lead.name}</div>
                          <div className="text-[11px] text-slate-400">{lead.city}</div>
                        </td>
                        <td className="py-3 px-3 font-mono text-slate-300">{lead.phone}</td>
                        <td className="py-3 px-3 text-slate-300 max-w-[200px] truncate">{lead.service}</td>
                        <td className="py-3 px-3 text-slate-400">
                          {new Date(lead.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </td>
                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            lead.status === 'NEW' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                            lead.status === 'CONTACTED' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                            lead.status === 'IN_CONSULTATION' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                            lead.status === 'CONVERTED' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                            'bg-slate-600/30 text-slate-400'
                          }`}>
                            {lead.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right space-x-1.5">
                          <a
                            href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 inline-block rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
                            title="Chat on WhatsApp"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </a>
                          <a
                            href={`tel:${lead.phone}`}
                            className="p-1.5 inline-block rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
                            title="Call Lead"
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: PRODUCTS MANAGER (ADD, EDIT, DELETE, MANAGE) */}
        {activeTab === 'products' && (
          <div className="space-y-6 max-w-7xl mx-auto">
            
            {/* Control Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-slate-800/80 p-4 rounded-3xl border border-slate-700/80">
              
              {/* Search input */}
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search products by title or description..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-2xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition"
                />
              </div>

              {/* Category Filter */}
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-400" />
                <select
                  value={productCategoryFilter}
                  onChange={(e) => setProductCategoryFilter(e.target.value)}
                  className="px-3 py-2 rounded-2xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-brand-500 transition"
                >
                  <option value="all">All Categories ({products.length})</option>
                  {CATEGORIES.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5">
                <button
                  onClick={handleResetToScraped}
                  title="Reset to 22 authentic scraped items from Looks Forever URL"
                  className="px-3.5 py-2 rounded-2xl bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition border border-slate-600"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Re-sync Looks Forever Catalog</span>
                </button>
                <button
                  onClick={handleOpenAddProduct}
                  className="px-4 py-2 rounded-2xl bg-gradient-to-r from-brand-600 to-accent-cyan hover:from-brand-500 hover:to-accent-cyan text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-brand-500/20 transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Product</span>
                </button>
              </div>
            </div>

            {/* Products Table */}
            <div className="rounded-3xl bg-slate-800/80 border border-slate-700/80 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/60 text-slate-400 uppercase tracking-wider border-b border-slate-700 font-bold">
                    <tr>
                      <th className="py-3 px-4">Image</th>
                      <th className="py-3 px-4">Product Name & Category</th>
                      <th className="py-3 px-4">Price</th>
                      <th className="py-3 px-4">Original Price</th>
                      <th className="py-3 px-4">Badge</th>
                      <th className="py-3 px-4">Specifications</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/60">
                    {filteredProducts.map((prod) => (
                      <tr key={prod.id} className="hover:bg-slate-700/30 transition group">
                        
                        {/* Thumbnail */}
                        <td className="py-3 px-4">
                          <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-700 overflow-hidden shrink-0">
                            <img
                              src={prod.image}
                              alt={prod.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition"
                              onError={(e) => {
                                e.target.src = 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=400';
                              }}
                            />
                          </div>
                        </td>

                        {/* Name & ID */}
                        <td className="py-3 px-4 max-w-xs">
                          <div className="font-bold text-white text-sm line-clamp-1 group-hover:text-brand-300 transition">
                            {prod.name}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="font-mono text-[10px] text-slate-400">{prod.id}</span>
                            <span className="px-2 py-0.2 rounded-md bg-slate-700 text-slate-300 text-[10px]">
                              {prod.category}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                            {prod.shortDesc || prod.description}
                          </p>
                        </td>

                        {/* Price */}
                        <td className="py-3 px-4 font-bold text-brand-300 text-sm">
                          ₹{(Number(prod.price) || 0).toLocaleString('en-IN')}
                        </td>

                        {/* Original Price */}
                        <td className="py-3 px-4 text-slate-400 line-through">
                          {prod.originalPrice ? `₹${(Number(prod.originalPrice)).toLocaleString('en-IN')}` : '-'}
                        </td>

                        {/* Badge */}
                        <td className="py-3 px-4">
                          {prod.badge ? (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-brand-500/20 text-brand-300 border border-brand-500/30">
                              {prod.badge}
                            </span>
                          ) : (
                            <span className="text-slate-500">-</span>
                          )}
                        </td>

                        {/* Specs count */}
                        <td className="py-3 px-4 text-slate-400">
                          <span className="px-2 py-0.5 rounded-lg bg-slate-700/60 text-slate-300 font-mono text-[11px]">
                            {Object.keys(prod.specifications || {}).length} specs
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                          <button
                            onClick={() => handleOpenEditProduct(prod)}
                            className="p-2 rounded-xl bg-slate-700 hover:bg-brand-600 text-slate-200 hover:text-white transition shadow-sm"
                            title="Edit Product"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(prod.id, prod.name)}
                            className="p-2 rounded-xl bg-slate-700 hover:bg-rose-600 text-slate-200 hover:text-white transition shadow-sm"
                            title="Delete Product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>

                      </tr>
                    ))}
                    {filteredProducts.length === 0 && (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-slate-400">
                          No products found matching "{productSearch}".
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: CRM LEADS & CUSTOMER DB */}
        {activeTab === 'leads' && (
          <div className="space-y-6 max-w-7xl mx-auto">
            
            {/* CRM Header & Action banner */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-800 via-slate-800/90 to-brand-950/80 border border-slate-700/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-white">Central CRM Lead Database</h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                    Live Lead Capture Active
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1 max-w-2xl">
                  Every visitor who fills a consultation form, requests quotes, or initiates order intent from the website is automatically saved here and formatted for direct CRM sync (Zoho, HubSpot, Salesforce, etc.).
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                <button
                  onClick={handleExportCsv}
                  className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition"
                >
                  <Download className="w-4 h-4" />
                  <span>Export CSV for CRM</span>
                </button>
                <button
                  onClick={handleSyncCrm}
                  disabled={isSyncingCrm}
                  className="px-4 py-2.5 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-brand-600/20 transition disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${isSyncingCrm ? 'animate-spin' : ''}`} />
                  <span>Sync Pending Leads</span>
                </button>
              </div>
            </div>

            {/* Leads Search & Filter bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-slate-800/80 p-4 rounded-3xl border border-slate-700/80">
              
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search leads by name, phone, city, or service..."
                  value={leadSearch}
                  onChange={(e) => setLeadSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-2xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-semibold">Filter Status:</span>
                <select
                  value={leadStatusFilter}
                  onChange={(e) => setLeadStatusFilter(e.target.value)}
                  className="px-3 py-2 rounded-2xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-brand-500 transition"
                >
                  <option value="ALL">All Statuses ({leads.length})</option>
                  <option value="NEW">New Inquiries</option>
                  <option value="CONTACTED">Contacted</option>
                  <option value="IN_CONSULTATION">In Consultation</option>
                  <option value="CONVERTED">Converted / Sold</option>
                  <option value="LOST">Closed / Lost</option>
                </select>
              </div>
            </div>

            {/* Leads List / Cards */}
            <div className="space-y-3">
              {filteredLeads.map((lead) => (
                <div
                  key={lead.id}
                  className="p-5 rounded-3xl bg-slate-800/80 border border-slate-700/80 hover:border-slate-600 transition shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  {/* Lead Info */}
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="font-mono font-bold text-xs text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded-lg border border-brand-500/20">
                        {lead.id}
                      </span>
                      <h4 className="text-base font-bold text-white">{lead.name}</h4>
                      
                      {/* Priority Badge */}
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        lead.priority === 'HIGH' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-slate-700 text-slate-300'
                      }`}>
                        {lead.priority || 'NORMAL'}
                      </span>

                      {/* CRM sync status */}
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        lead.crmSyncStatus === 'SYNCED' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        {lead.crmSyncStatus === 'SYNCED' ? '✓ CRM Synced' : 'Ready for CRM'}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
                      <span className="flex items-center gap-1.5 text-white font-mono font-semibold">
                        <Phone className="w-3.5 h-3.5 text-brand-400" />
                        {lead.phone}
                      </span>
                      {lead.email && (
                        <span className="flex items-center gap-1.5 text-slate-400">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          {lead.email}
                        </span>
                      )}
                      <span className="flex items-center gap-1.5 text-slate-400">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {lead.city}
                      </span>
                      <span className="flex items-center gap-1.5 text-slate-400">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {new Date(lead.createdAt).toLocaleString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>

                    <div className="pt-1">
                      <span className="text-xs font-semibold text-accent-cyan">Service: </span>
                      <span className="text-xs text-slate-200">{lead.service}</span>
                    </div>

                    {lead.requirement && (
                      <p className="text-xs text-slate-400 bg-slate-900/60 p-2.5 rounded-xl border border-slate-700/60">
                        "{lead.requirement}"
                      </p>
                    )}

                    {/* Notes preview */}
                    {lead.notes && lead.notes.length > 0 && (
                      <div className="text-[11px] text-slate-400 flex items-center gap-2 pt-1">
                        <span className="font-semibold text-slate-300">Latest Note:</span>
                        <span>{lead.notes[lead.notes.length - 1].text}</span>
                        <span className="text-slate-500 font-mono">({lead.notes.length} total)</span>
                      </div>
                    )}
                  </div>

                  {/* Actions & Status Dropdown */}
                  <div className="flex flex-wrap md:flex-col items-end gap-2.5 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-700">
                    
                    {/* Status Select */}
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-400">Status:</span>
                      <select
                        value={lead.status}
                        onChange={(e) => handleUpdateLeadStatus(lead.id, e.target.value)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-xl border outline-none cursor-pointer transition ${
                          lead.status === 'NEW' ? 'bg-blue-600/30 text-blue-300 border-blue-500/50' :
                          lead.status === 'CONTACTED' ? 'bg-amber-600/30 text-amber-300 border-amber-500/50' :
                          lead.status === 'IN_CONSULTATION' ? 'bg-purple-600/30 text-purple-300 border-purple-500/50' :
                          lead.status === 'CONVERTED' ? 'bg-emerald-600/30 text-emerald-300 border-emerald-500/50' :
                          'bg-slate-700 text-slate-300 border-slate-600'
                        }`}
                      >
                        <option value="NEW">NEW LEAD</option>
                        <option value="CONTACTED">CONTACTED</option>
                        <option value="IN_CONSULTATION">IN CONSULTATION</option>
                        <option value="CONVERTED">CONVERTED (CUSTOMER)</option>
                        <option value="LOST">CLOSED / LOST</option>
                      </select>
                    </div>

                    {/* Quick Contact Buttons */}
                    <div className="flex items-center gap-2">
                      <a
                        href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                          `Hello ${lead.name}, greetings from Looks Forever Hair & Aesthetic Clinic Wave Mall Noida. We received your consultation inquiry for ${lead.service}. How can we assist you today?`
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-md transition"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                      </a>

                      <a
                        href={`tel:${lead.phone}`}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md transition"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Call</span>
                      </a>

                      <button
                        onClick={() => {
                          setActiveLeadForNote(lead);
                          setNoteInput('');
                        }}
                        className="px-2.5 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold transition"
                        title="Add Internal CRM Note"
                      >
                        + Note
                      </button>

                      <button
                        onClick={() => handleDeleteLead(lead.id)}
                        className="p-1.5 rounded-xl bg-slate-700 hover:bg-rose-600 text-slate-300 hover:text-white transition"
                        title="Delete Lead"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                  </div>
                </div>
              ))}

              {filteredLeads.length === 0 && (
                <div className="py-16 text-center rounded-3xl bg-slate-800/60 border border-slate-700/60 space-y-2">
                  <Users className="w-10 h-10 text-slate-500 mx-auto" />
                  <p className="text-sm font-semibold text-slate-300">No leads found in this view.</p>
                  <p className="text-xs text-slate-500">Website visitors who submit consultation requests will appear here automatically.</p>
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 4: CRM INTEGRATION SETTINGS */}
        {activeTab === 'settings' && (
          <div className="space-y-6 max-w-4xl mx-auto">
            <div className="p-6 rounded-3xl bg-slate-800/80 border border-slate-700/80 space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Settings className="w-5 h-5 text-brand-400" />
                CRM Database & Future External Integration
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Configure how Looks Forever website leads sync into your future CRM software (HubSpot, Zoho CRM, Salesforce, LeadSquared, or Custom CRM API).
              </p>

              <div className="space-y-4 pt-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    External CRM Webhook / Ingestion API URL
                  </label>
                  <input
                    type="url"
                    value={crmWebhookUrl}
                    onChange={(e) => setCrmWebhookUrl(e.target.value)}
                    placeholder="https://your-crm-endpoint.com/webhook/looksforever"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-brand-500 transition font-mono"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Whenever a lead is marked for CRM sync, payload will be dispatched with fields: `id, name, phone, email, city, service, requirement, status, createdAt`.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={handleSyncCrm}
                    disabled={isSyncingCrm}
                    className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-brand-600/20 disabled:opacity-50"
                  >
                    <RefreshCw className={`w-4 h-4 ${isSyncingCrm ? 'animate-spin' : ''}`} />
                    Test & Trigger Webhook Sync Now
                  </button>
                  <button
                    onClick={handleExportCsv}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/20"
                  >
                    <Download className="w-4 h-4" />
                    Download CSV Backup
                  </button>
                </div>
              </div>

              {/* Data Storage Specs */}
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-700/60 mt-6 space-y-2 text-xs text-slate-300">
                <div className="font-bold text-white text-xs uppercase tracking-wider mb-1">
                  Active Database Storage Paths:
                </div>
                <div className="font-mono text-[11px] text-slate-400">
                  • Products Data Store: <span className="text-emerald-400">server/data/products.json</span>
                </div>
                <div className="font-mono text-[11px] text-slate-400">
                  • CRM Leads Store: <span className="text-emerald-400">server/data/leads.json</span>
                </div>
                <div className="font-mono text-[11px] text-slate-400">
                  • Backup Seed (Looks Forever URL Scrape): <span className="text-emerald-400">server/data/seed_products.json</span>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ==========================================
          MODAL: ADD / EDIT PRODUCT
      ========================================== */}
      {isAddProductOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-slate-900 rounded-3xl shadow-2xl border border-slate-700 max-h-[92vh] flex flex-col overflow-hidden">
            
            {/* Header */}
            <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-brand-400" />
                <h3 className="font-bold text-base text-white">
                  {editingProduct ? `Edit Product: ${editingProduct.name}` : 'Add New Hair System / Product'}
                </h3>
              </div>
              <button
                onClick={() => setIsAddProductOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSaveProduct} className="p-6 overflow-y-auto space-y-4">
              
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Product Name / Title <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  placeholder="e.g. Fine Hollywood HD Lace Hair Patch"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Category <span className="text-rose-400">*</span>
                  </label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-brand-500"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Price (₹) <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    placeholder="10999"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-brand-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Original Price (₹)
                  </label>
                  <input
                    type="number"
                    value={productForm.originalPrice}
                    onChange={(e) => setProductForm({ ...productForm, originalPrice: e.target.value })}
                    placeholder="14999"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-brand-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Discount Tag / Badge
                  </label>
                  <input
                    type="text"
                    value={productForm.discount}
                    onChange={(e) => setProductForm({ ...productForm, discount: e.target.value })}
                    placeholder="25% OFF"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Promotional Badge
                  </label>
                  <input
                    type="text"
                    value={productForm.badge}
                    onChange={(e) => setProductForm({ ...productForm, badge: e.target.value })}
                    placeholder="Bestseller / Top Rated"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Product Image URL (1000x1000 / High Res)
                </label>
                <input
                  type="url"
                  value={productForm.image}
                  onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                  placeholder="https://5.imimg.com/data5/.../image.png"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-brand-500 font-mono"
                />
                {productForm.image && (
                  <div className="mt-2 w-16 h-16 rounded-xl bg-slate-800 border border-slate-700 overflow-hidden">
                    <img src={productForm.image} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Short Description (Highlights)
                </label>
                <input
                  type="text"
                  value={productForm.shortDesc}
                  onChange={(e) => setProductForm({ ...productForm, shortDesc: e.target.value })}
                  placeholder="100% Indian Remy Human Hair Patch with invisible base."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Full Detailed Description
                </label>
                <textarea
                  rows={4}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  placeholder="Detailed craftsmanship, base information, and care instructions..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-brand-500 resize-none"
                />
              </div>

              {/* Action buttons */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddProductOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-lg shadow-brand-600/20 flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL: ADD INTERNAL CRM NOTE
      ========================================== */}
      {activeLeadForNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md bg-slate-900 rounded-3xl shadow-2xl border border-slate-700 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-white text-sm">
                Add CRM Note for {activeLeadForNote.name}
              </h4>
              <button
                onClick={() => setActiveLeadForNote(null)}
                className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddLeadNote} className="space-y-3">
              <textarea
                rows={3}
                required
                value={noteInput}
                onChange={(e) => setNoteInput(e.target.value)}
                placeholder="e.g. Spoke with customer. Wants 8x6 French lace in dark brown. Scheduled clinic visit Friday."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-brand-500 resize-none"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveLeadForNote(null)}
                  className="px-3 py-1.5 rounded-xl text-slate-400 hover:text-white text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-md"
                >
                  Save Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

