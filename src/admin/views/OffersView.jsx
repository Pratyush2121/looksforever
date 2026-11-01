import React, { useState, useEffect } from 'react';
import AdminPageHeader from '../components/AdminPageHeader';
import AdminCard from '../components/AdminCard';
import AdminButton from '../components/AdminButton';
import AdminBadge from '../components/AdminBadge';
import AdminInput from '../components/AdminInput';
import AdminSelect from '../components/AdminSelect';
import AdminTextarea from '../components/AdminTextarea';
import AdminToggle from '../components/AdminToggle';
import ConfirmDialog from '../components/ConfirmDialog';
import { useToast } from '../context/ToastContext';
import { 
  Tag, 
  Plus, 
  Edit3, 
  Trash2, 
  RefreshCw, 
  X, 
  ExternalLink, 
  Eye,
  CheckCircle2,
  Copy
} from 'lucide-react';

const INITIAL_OFFER_STATE = {
  title: '',
  description: '',
  code: '',
  discountPercent: '',
  slot: 'top_bar',
  styleVariant: 'highlight',
  badgeText: '',
  ctaText: 'Claim Offer',
  ctaUrl: '',
  active: true,
  startDate: '',
  endDate: ''
};

export default function OffersView() {
  const toast = useToast();
  const [offers, setOffers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);
  const [formData, setFormData] = useState(INITIAL_OFFER_STATE);
  const [formErrors, setFormErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  // Delete State
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, offer: null });
  const [isDeleting, setIsDeleting] = useState(false);

  const loadOffers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/offers');
      if (res.ok) {
        const data = await res.json();
        setOffers(Array.isArray(data) ? data : []);
      }
    } catch {
      toast.error('Failed to load offers.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOffers();
  }, []);

  const handleOpenAdd = () => {
    setEditingOffer(null);
    setFormData(INITIAL_OFFER_STATE);
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEdit = (offer) => {
    setEditingOffer(offer);
    setFormData({
      title: offer.title || '',
      description: offer.description || '',
      code: offer.code || '',
      discountPercent: offer.discountPercent ?? '',
      slot: offer.slot || 'top_bar',
      styleVariant: offer.styleVariant || 'highlight',
      badgeText: offer.badgeText || '',
      ctaText: offer.ctaText || 'Claim Offer',
      ctaUrl: offer.ctaUrl || '',
      active: offer.active !== false,
      startDate: offer.startDate ? offer.startDate.substring(0, 10) : '',
      endDate: offer.endDate ? offer.endDate.substring(0, 10) : ''
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleToggleActive = async (offer) => {
    try {
      const updatedActive = !offer.active;
      const res = await fetch('/api/offers', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: offer._id,
          active: updatedActive
        })
      });
      if (res.ok) {
        setOffers(prev => prev.map(o => o._id === offer._id ? { ...o, active: updatedActive } : o));
        toast.success(`Offer ${updatedActive ? 'activated' : 'deactivated'}.`);
      }
    } catch {
      toast.error('Failed to toggle offer status.');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setFormErrors({});

    try {
      const isUpdate = Boolean(editingOffer);
      const payload = {
        ...(isUpdate ? { id: editingOffer._id } : {}),
        title: formData.title.trim(),
        description: formData.description?.trim(),
        code: formData.code?.trim().toUpperCase(),
        discountPercent: formData.discountPercent ? parseFloat(formData.discountPercent) : undefined,
        slot: formData.slot,
        styleVariant: formData.styleVariant,
        badgeText: formData.badgeText?.trim(),
        ctaText: formData.ctaText?.trim(),
        ctaUrl: formData.ctaUrl?.trim(),
        active: formData.active,
        startDate: formData.startDate ? new Date(formData.startDate).toISOString() : undefined,
        endDate: formData.endDate ? new Date(formData.endDate).toISOString() : undefined
      };

      const res = await fetch('/api/offers', {
        method: isUpdate ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(isUpdate ? 'Offer updated successfully.' : 'Offer created successfully.');
        setIsModalOpen(false);
        loadOffers();
      } else {
        if (data.details) {
          const mapped = {};
          data.details.forEach(i => mapped[i.path?.[0] || 'general'] = i.message);
          setFormErrors(mapped);
          toast.error(data.error || 'Please check highlighted fields.');
        } else {
          toast.error(data.error || 'Failed to save offer.');
        }
      }
    } catch {
      toast.error('Network error saving offer.');
    } finally {
      setIsSaving(false);
    }
  };

  const executeDelete = async () => {
    if (!deleteConfirm.offer) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/offers?id=${deleteConfirm.offer._id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        toast.success(`Offer "${deleteConfirm.offer.title}" deleted.`);
        loadOffers();
      } else {
        toast.error('Failed to delete offer.');
      }
    } catch {
      toast.error('Network error during deletion.');
    } finally {
      setIsDeleting(false);
      setDeleteConfirm({ isOpen: false, offer: null });
    }
  };

  // Preview styling helper
  const getPreviewStyles = (variant) => {
    switch (variant) {
      case 'dark':
        return 'bg-slate-900 text-white border-slate-800';
      case 'gold':
        return 'bg-gradient-to-r from-amber-500 to-amber-600 text-white border-amber-400';
      case 'subtle':
        return 'bg-slate-100 text-slate-800 border-slate-200';
      case 'highlight':
      default:
        return 'bg-brand-600 text-white border-brand-500';
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Promotions & Offer Slots"
        description="Targeted promotional banners across header bar, cart drawer, and product pages."
        action={
          <div className="flex items-center gap-2">
            <AdminButton
              variant="outline"
              size="md"
              icon={RefreshCw}
              onClick={loadOffers}
              disabled={isLoading}
            >
              Refresh
            </AdminButton>
            <AdminButton
              variant="primary"
              size="md"
              icon={Plus}
              onClick={handleOpenAdd}
            >
              Create Offer
            </AdminButton>
          </div>
        }
      />

      <AdminCard noPadding>
        {isLoading ? (
          <div className="p-12 text-center text-slate-400">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-brand-600" />
            <p className="text-xs">Loading offers...</p>
          </div>
        ) : offers.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {offers.map((offer) => (
              <div 
                key={offer._id} 
                className="p-4 sm:p-5 hover:bg-slate-50/80 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-semibold text-slate-900 text-sm">{offer.title}</h4>
                    <AdminBadge variant="default" size="xs">
                      Slot: {offer.slot}
                    </AdminBadge>
                    <AdminBadge variant="purple" size="xs">
                      {offer.styleVariant}
                    </AdminBadge>
                    <button
                      type="button"
                      onClick={() => handleToggleActive(offer)}
                    >
                      <AdminBadge variant={offer.active ? 'success' : 'default'} size="xs" dot>
                        {offer.active ? 'Active' : 'Paused'}
                      </AdminBadge>
                    </button>
                  </div>

                  {offer.description && (
                    <p className="text-xs text-slate-500">{offer.description}</p>
                  )}

                  <div className="flex items-center gap-3 text-xs text-slate-500 pt-1">
                    {offer.code && (
                      <span className="font-mono bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-semibold border border-slate-200 text-[11px]">
                        CODE: {offer.code}
                      </span>
                    )}
                    {offer.discountPercent && (
                      <span className="text-emerald-600 font-semibold text-[11px]">
                        {offer.discountPercent}% OFF
                      </span>
                    )}
                    {offer.ctaText && (
                      <span className="text-slate-400 text-[11px]">
                        CTA: "{offer.ctaText}"
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <AdminButton
                    size="sm"
                    variant="outline"
                    icon={Edit3}
                    onClick={() => handleOpenEdit(offer)}
                  >
                    Edit
                  </AdminButton>
                  <button
                    type="button"
                    onClick={() => setDeleteConfirm({ isOpen: true, offer })}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                    title="Delete offer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center space-y-3">
            <Tag className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-xs text-slate-500">No promotional offers created yet.</p>
            <AdminButton size="sm" icon={Plus} onClick={handleOpenAdd}>
              Create First Offer
            </AdminButton>
          </div>
        )}
      </AdminCard>

      {/* Offer Editor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in overflow-y-auto">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in zoom-in-95">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                {editingOffer ? 'Edit Promotion Offer' : 'Create Promotion Offer'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-5 sm:p-6 space-y-5">
              
              {/* Live Preview Card */}
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-brand-600" />
                  Live Slot Preview ({formData.styleVariant} style)
                </span>
                <div className={`p-4 rounded-xl border shadow-xs flex items-center justify-between gap-4 transition-all ${getPreviewStyles(formData.styleVariant)}`}>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      {formData.badgeText && (
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full">
                          {formData.badgeText}
                        </span>
                      )}
                      <span className="font-bold text-sm truncate">{formData.title || 'Special Clinic Offer'}</span>
                    </div>
                    <p className="text-xs opacity-90 mt-0.5 truncate">{formData.description || 'Description of the promotional benefit or discount.'}</p>
                  </div>
                  {formData.code && (
                    <span className="shrink-0 text-xs font-mono font-bold bg-white text-slate-900 px-2.5 py-1 rounded shadow-2xs">
                      {formData.code}
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <AdminInput
                    label="Offer Title"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData(p => ({ ...p, title: e.target.value }))}
                    placeholder="e.g. ₹3,000 Off on Mirage Hair Patches"
                    error={formErrors.title}
                  />
                </div>

                <div className="sm:col-span-2">
                  <AdminTextarea
                    label="Short Description"
                    rows={2}
                    value={formData.description}
                    onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))}
                    placeholder="Includes free scalp assessment and styling kit"
                    error={formErrors.description}
                  />
                </div>

                <div>
                  <AdminSelect
                    label="Display Slot"
                    required
                    value={formData.slot}
                    onChange={(e) => setFormData(p => ({ ...p, slot: e.target.value }))}
                    options={[
                      { value: 'top_bar', label: 'Top Announcement Bar' },
                      { value: 'popup_modal', label: 'Popup Modal' },
                      { value: 'cart_drawer', label: 'Order Bag / Cart Drawer' },
                      { value: 'product_page', label: 'Product Details Page' },
                      { value: 'sidebar', label: 'Sidebar / Floating' }
                    ]}
                  />
                </div>

                <div>
                  <AdminSelect
                    label="Style Variant"
                    required
                    value={formData.styleVariant}
                    onChange={(e) => setFormData(p => ({ ...p, styleVariant: e.target.value }))}
                    options={[
                      { value: 'highlight', label: 'Royal Blue (Brand Accent)' },
                      { value: 'gold', label: 'Gold Gradient (Premium)' },
                      { value: 'dark', label: 'Midnight Slate (Dark)' },
                      { value: 'subtle', label: 'Subtle Slate (Light)' }
                    ]}
                  />
                </div>

                <div>
                  <AdminInput
                    label="Coupon / Promo Code"
                    value={formData.code}
                    onChange={(e) => setFormData(p => ({ ...p, code: e.target.value.toUpperCase() }))}
                    placeholder="LOOKS3000"
                    helperText="Optional discount code"
                  />
                </div>

                <div>
                  <AdminInput
                    label="Discount % (Optional)"
                    type="number"
                    value={formData.discountPercent}
                    onChange={(e) => setFormData(p => ({ ...p, discountPercent: e.target.value }))}
                    placeholder="15"
                  />
                </div>

                <div>
                  <AdminInput
                    label="Badge Text"
                    value={formData.badgeText}
                    onChange={(e) => setFormData(p => ({ ...p, badgeText: e.target.value }))}
                    placeholder="FESTIVE SPECIAL"
                  />
                </div>

                <div>
                  <AdminInput
                    label="CTA Button Text"
                    value={formData.ctaText}
                    onChange={(e) => setFormData(p => ({ ...p, ctaText: e.target.value }))}
                    placeholder="Claim on WhatsApp"
                  />
                </div>

                <div className="sm:col-span-2">
                  <AdminInput
                    label="CTA Link URL (Optional)"
                    value={formData.ctaUrl}
                    onChange={(e) => setFormData(p => ({ ...p, ctaUrl: e.target.value }))}
                    placeholder="https://wa.me/919873433300?text=ClaimOffer"
                    helperText="Leave empty to open consultation modal"
                  />
                </div>

                <div className="sm:col-span-2 pt-2 border-t border-slate-100">
                  <AdminToggle
                    label="Offer is Active"
                    checked={formData.active}
                    onChange={(val) => setFormData(p => ({ ...p, active: val }))}
                    helperText="Turn off to temporarily hide without deleting"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <AdminButton
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </AdminButton>
                <AdminButton
                  type="submit"
                  variant="primary"
                  isLoading={isSaving}
                >
                  {editingOffer ? 'Update Offer' : 'Save Offer'}
                </AdminButton>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        title="Delete Offer"
        message={`Are you sure you want to delete "${deleteConfirm.offer?.title}"?`}
        confirmText="Delete Offer"
        confirmVariant="danger"
        isLoading={isDeleting}
        onConfirm={executeDelete}
        onCancel={() => setDeleteConfirm({ isOpen: false, offer: null })}
      />
    </div>
  );
}

