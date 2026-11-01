import React, { useState, useEffect } from 'react';
import AdminPageHeader from '../components/AdminPageHeader';
import AdminCard from '../components/AdminCard';
import AdminButton from '../components/AdminButton';
import AdminBadge from '../components/AdminBadge';
import { useToast } from '../context/ToastContext';
import { 
  BarChart3, 
  TrendingUp, 
  Eye, 
  MessageCircle, 
  Calendar, 
  RefreshCw, 
  ArrowUpRight, 
  Package,
  Sparkles,
  MousePointerClick
} from 'lucide-react';

export default function AnalyticsView() {
  const toast = useToast();
  const [days, setDays] = useState('30');
  const [data, setData] = useState({
    overview: {},
    topProducts: [],
    daily: []
  });
  const [isLoading, setIsLoading] = useState(true);

  const loadAnalytics = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/track?days=${days}`);
      if (res.ok) {
        const result = await res.json();
        setData(result);
      }
    } catch {
      toast.error('Failed to load analytics.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, [days]);

  const overview = data.overview || {};
  const totalViews = overview.page_view || 0;
  const buyNowClicks = overview.buy_now_click || 0;
  const offerClicks = overview.offer_click || 0;
  const leadSubmissions = overview.lead_submission || 0;

  // Simple metric cards
  const metrics = [
    { label: 'Store Page Views', value: totalViews, icon: Eye, change: 'Traffic' },
    { label: 'WhatsApp "Buy Now" Clicks', value: buyNowClicks, icon: MessageCircle, change: 'Conversion' },
    { label: 'Consultation Inquiries', value: leadSubmissions, icon: TrendingUp, change: 'Leads' },
    { label: 'Promo Offer Clicks', value: offerClicks, icon: MousePointerClick, change: 'Campaign' }
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Storefront Analytics & Conversion Metrics"
        description="Track product interest, daily traffic trends, and direct WhatsApp Buy Now order actions."
        action={
          <div className="flex items-center gap-3">
            <select
              value={days}
              onChange={(e) => setDays(e.target.value)}
              className="py-2 pl-3 pr-8 text-xs font-semibold border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            >
              <option value="7">Last 7 Days</option>
              <option value="30">Last 30 Days</option>
              <option value="90">Last 90 Days</option>
            </select>

            <AdminButton
              variant="outline"
              size="md"
              icon={RefreshCw}
              onClick={loadAnalytics}
              disabled={isLoading}
            >
              Refresh
            </AdminButton>
          </div>
        }
      />

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, idx) => {
          const Icon = m.icon;
          return (
            <div key={idx} className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{m.label}</span>
                  <div className="text-2xl font-bold text-slate-900 mt-1">
                    {isLoading ? '...' : m.value.toLocaleString()}
                  </div>
                </div>
                <div className="p-2.5 bg-slate-100 rounded-lg text-slate-700">
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span>{m.change} metric</span>
                <AdminBadge variant="primary" size="xs">Live DB</AdminBadge>
              </div>
            </div>
          );
        })}
      </div>

      {/* Top Products Table */}
      <AdminCard 
        title="Top Products by WhatsApp Buy Now Inquiries" 
        description="Products generating the highest purchase intent on WhatsApp"
        noPadding
      >
        {isLoading ? (
          <div className="p-12 text-center text-slate-400">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-brand-600" />
            <p className="text-xs">Loading product conversion metrics...</p>
          </div>
        ) : data.topProducts?.length > 0 ? (
          <div className="divide-y divide-slate-100">
            <div className="grid grid-cols-12 px-5 py-3 bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              <div className="col-span-8">Product Name</div>
              <div className="col-span-4 text-right">Buy Now Clicks</div>
            </div>
            {data.topProducts.map((p, idx) => (
              <div key={idx} className="grid grid-cols-12 px-5 py-3.5 items-center hover:bg-slate-50/70 transition text-xs">
                <div className="col-span-8 font-semibold text-slate-900 flex items-center gap-2 truncate">
                  <span className="text-slate-400 w-5 font-mono">#{idx + 1}</span>
                  <span className="truncate">{p.name || p.productId || 'Unknown Product'}</span>
                </div>
                <div className="col-span-4 text-right font-bold text-brand-600">
                  {p.count} click{p.count === 1 ? '' : 's'}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center space-y-2">
            <Package className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-xs text-slate-500">No Buy Now events logged during this time window.</p>
          </div>
        )}
      </AdminCard>

      {/* Daily Activity Breakdown */}
      <AdminCard 
        title="Activity Log (Daily Summary)" 
        description="Daily counts of visits and user engagements"
        noPadding
      >
        {isLoading ? (
          <div className="p-12 text-center text-slate-400">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-brand-600" />
          </div>
        ) : data.daily?.length > 0 ? (
          <div className="divide-y divide-slate-100">
            <div className="grid grid-cols-12 px-5 py-3 bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              <div className="col-span-4">Date</div>
              <div className="col-span-4">Event Type</div>
              <div className="col-span-4 text-right">Event Count</div>
            </div>
            {data.daily.slice(0, 15).map((row, idx) => (
              <div key={idx} className="grid grid-cols-12 px-5 py-3 items-center hover:bg-slate-50/70 transition text-xs">
                <div className="col-span-4 text-slate-600 font-mono text-[11px]">
                  {row._id?.date || 'N/A'}
                </div>
                <div className="col-span-4">
                  <AdminBadge variant="default" size="xs">
                    {row._id?.event || 'event'}
                  </AdminBadge>
                </div>
                <div className="col-span-4 text-right font-semibold text-slate-900">
                  {row.count}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center text-slate-400 text-xs">
            No daily activity logs recorded yet.
          </div>
        )}
      </AdminCard>

    </div>
  );
}

