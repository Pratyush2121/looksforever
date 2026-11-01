import React, { useState, useEffect } from 'react';
import AdminPageHeader from '../components/AdminPageHeader';
import AdminCard from '../components/AdminCard';
import AdminButton from '../components/AdminButton';
import AdminBadge from '../components/AdminBadge';
import { 
  Package, 
  Users, 
  MessageCircle, 
  TrendingUp, 
  Eye, 
  Plus, 
  ArrowUpRight, 
  Clock, 
  Phone,
  CheckCircle2,
  RefreshCw,
  ExternalLink
} from 'lucide-react';

export default function DashboardView({ onNavigate }) {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalLeads: 0,
    newLeads: 0,
    totalViews: 0,
    totalBuyNowClicks: 0
  });
  const [recentLeads, setRecentLeads] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const [prodRes, contactRes, trackRes] = await Promise.all([
        fetch('/api/products?limit=100'),
        fetch('/api/contact'),
        fetch('/api/track?days=30')
      ]);

      const prodData = prodRes.ok ? await prodRes.json() : { products: [] };
      const contactData = contactRes.ok ? await contactRes.json() : { submissions: [] };
      const trackData = trackRes.ok ? await trackRes.json() : { overview: {}, topProducts: [] };

      const products = Array.isArray(prodData) ? prodData : (prodData.products || []);
      const submissions = contactData.submissions || [];

      setStats({
        totalProducts: prodData.total || products.length,
        totalLeads: submissions.length,
        newLeads: submissions.filter(s => s.status === 'new').length,
        totalViews: trackData.overview?.page_view || 0,
        totalBuyNowClicks: trackData.overview?.buy_now_click || 0
      });

      setRecentLeads(submissions.slice(0, 5));
      setTopProducts(trackData.topProducts || []);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const statCards = [
    {
      label: 'Total Products',
      value: stats.totalProducts,
      helper: 'Active in catalog',
      icon: Package,
      actionTab: 'products'
    },
    {
      label: 'Consultation Inquiries',
      value: stats.totalLeads,
      helper: `${stats.newLeads} pending review`,
      icon: Users,
      badge: stats.newLeads > 0 ? `${stats.newLeads} New` : null,
      badgeVariant: 'warning',
      actionTab: 'contact'
    },
    {
      label: 'WhatsApp Buy Now',
      value: stats.totalBuyNowClicks,
      helper: 'Last 30 days clicks',
      icon: MessageCircle,
      actionTab: 'analytics'
    },
    {
      label: 'Total Page Views',
      value: stats.totalViews,
      helper: 'Storefront traffic (30d)',
      icon: Eye,
      actionTab: 'analytics'
    }
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Operations Dashboard"
        description="Real-time catalog overview, incoming patient leads, and storefront activity."
        action={
          <div className="flex items-center gap-2">
            <AdminButton
              variant="outline"
              size="md"
              icon={RefreshCw}
              onClick={fetchDashboardData}
              disabled={isLoading}
            >
              Refresh
            </AdminButton>
            <AdminButton
              variant="primary"
              size="md"
              icon={Plus}
              onClick={() => onNavigate('products')}
            >
              Add Product
            </AdminButton>
          </div>
        }
      />

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              onClick={() => card.actionTab && onNavigate(card.actionTab)}
              className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs hover:border-slate-300 transition cursor-pointer flex flex-col justify-between"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    {card.label}
                  </span>
                  <div className="text-2xl font-bold text-slate-900 mt-1">
                    {isLoading ? '...' : card.value}
                  </div>
                </div>
                <div className="p-2.5 bg-slate-100 rounded-lg text-slate-700">
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>{card.helper}</span>
                {card.badge && (
                  <AdminBadge variant={card.badgeVariant || 'primary'}>
                    {card.badge}
                  </AdminBadge>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 2-Column Content: Recent Leads & Top Catalog Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Inquiries */}
        <AdminCard
          title="Recent Patient Leads"
          description="Inquiries submitted via consultation modal or contact form"
          action={
            <button
              onClick={() => onNavigate('contact')}
              className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          }
          noPadding
        >
          {recentLeads.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {recentLeads.map((lead) => (
                <div key={lead._id} className="p-4 hover:bg-slate-50/80 transition flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900 text-sm truncate">{lead.name}</span>
                      <AdminBadge 
                        variant={
                          lead.status === 'new' ? 'warning' :
                          lead.status === 'converted' ? 'success' :
                          lead.status === 'contacted' ? 'info' : 'default'
                        }
                      >
                        {lead.status}
                      </AdminBadge>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        <span>{lead.phone}</span>
                      </span>
                      {lead.service && (
                        <span className="text-slate-400 truncate max-w-[150px]">
                          • {lead.service}
                        </span>
                      )}
                    </div>
                  </div>

                  <a
                    href={`https://wa.me/${lead.phone.replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(lead.name)},%20this%20is%20Looks%20Forever%20Hair%20Aesthetic%20Clinic.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                    title="Direct WhatsApp Patient"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 text-xs">
              No patient leads recorded yet.
            </div>
          )}
        </AdminCard>

        {/* Quick Links & Clinic System Info */}
        <AdminCard
          title="System & Storefront Health"
          description="Deployment and configuration status"
        >
          <div className="space-y-4">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/60 flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-slate-800">Single Vercel Project Architecture</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Vite frontend + Serverless /api handlers</div>
              </div>
              <AdminBadge variant="success" dot>Operational</AdminBadge>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/60 flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-slate-800">Database Connection Pool</div>
                <div className="text-[11px] text-slate-500 mt-0.5">MongoDB Atlas cached across invocations</div>
              </div>
              <AdminBadge variant="success" dot>Connected</AdminBadge>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/60 flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-slate-800">Direct WhatsApp Checkout</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Instant wa.me link with pre-filled order data</div>
              </div>
              <AdminBadge variant="primary">Active</AdminBadge>
            </div>

            <div className="pt-2">
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition"
              >
                <span>Preview Public Storefront</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </AdminCard>

      </div>
    </div>
  );
}

