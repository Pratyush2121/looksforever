import React, { useState, useEffect } from 'react';
import AdminPageHeader from '../components/AdminPageHeader';
import AdminCard from '../components/AdminCard';
import AdminButton from '../components/AdminButton';
import AdminInput from '../components/AdminInput';
import AdminTextarea from '../components/AdminTextarea';
import StickyActionBar from '../components/StickyActionBar';
import { useToast } from '../context/ToastContext';
import { 
  Settings, 
  RefreshCw, 
  MessageCircle, 
  DollarSign, 
  ShieldCheck, 
  Phone 
} from 'lucide-react';

export default function SettingsView() {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  // Settings State
  const [general, setGeneral] = useState({
    siteName: 'Looks Forever Hair Aesthetic Clinic',
    tagline: 'Non-Surgical Hair Replacement & Premium Hair Patches',
    whatsappNumber: '919873433300', // International format without + or spaces
    supportPhone: '+91 98734 33300',
    supportEmail: 'info@looksforever.org',
    currencySymbol: '₹',
    currencyCode: 'INR',
    orderMessagePrefix: 'Hello Looks Forever! I would like to order/inquire about:',
    consultationNotice: 'Appointments are reserved on a first-come basis at Wave Mall Sector 18 Noida.'
  });

  const loadSettings = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/settings?type=general');
      if (res.ok) {
        const data = await res.json();
        if (data.general) setGeneral(data.general);
      }
    } catch {
      toast.error('Failed to load settings.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleChange = (field, value) => {
    setGeneral(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    try {
      // Validate whatsapp number: digits only, international without +
      const cleanWa = general.whatsappNumber.replace(/\D/g, '');
      const payload = {
        ...general,
        whatsappNumber: cleanWa
      };

      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'general',
          general: payload
        })
      });

      if (res.ok) {
        toast.success('General settings saved successfully!');
        setGeneral(payload);
        setIsDirty(false);
      } else {
        toast.error('Failed to save settings.');
      }
    } catch {
      toast.error('Network error saving settings.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="General Store & WhatsApp Settings"
        description="Configure primary business phone, international WhatsApp ordering recipient, and currency options."
        action={
          <AdminButton
            variant="outline"
            size="md"
            icon={RefreshCw}
            onClick={loadSettings}
            disabled={isLoading}
          >
            Refresh
          </AdminButton>
        }
      />

      {isLoading ? (
        <div className="p-12 text-center text-slate-400">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-brand-600" />
          <p className="text-xs">Loading general settings...</p>
        </div>
      ) : (
        <div className="space-y-6">
          
          {/* WhatsApp Integration Card (Golden Rule #5) */}
          <AdminCard title="WhatsApp Ordering Destination" description="The official number that receives instant pre-filled customer Buy Now orders">
            <div className="space-y-4">
              <div className="p-3.5 bg-emerald-50 border border-emerald-200/80 rounded-xl flex items-start gap-3">
                <MessageCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xs text-emerald-900 leading-relaxed">
                  <strong>Free wa.me Link Integration:</strong> Customers clicking "Buy on WhatsApp" will automatically open WhatsApp with the product name, SKU, price, and current link pre-filled to this exact phone number.
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <AdminInput
                    label="WhatsApp Number (International format without + or spaces)"
                    required
                    value={general.whatsappNumber}
                    onChange={(e) => handleChange('whatsappNumber', e.target.value)}
                    placeholder="919873433300"
                    helperText="Example: 919873433300 for India (+91)"
                  />
                </div>

                <div>
                  <AdminInput
                    label="Display Support Phone (With formatting)"
                    value={general.supportPhone}
                    onChange={(e) => handleChange('supportPhone', e.target.value)}
                    placeholder="+91 98734 33300"
                    helperText="Shown in header and contact widgets"
                  />
                </div>

                <div className="sm:col-span-2">
                  <AdminInput
                    label="Pre-filled Message Introduction"
                    value={general.orderMessagePrefix}
                    onChange={(e) => handleChange('orderMessagePrefix', e.target.value)}
                    placeholder="Hello Looks Forever! I would like to order/inquire about:"
                  />
                </div>
              </div>
            </div>
          </AdminCard>

          {/* Business & Currency */}
          <AdminCard title="Business Identity & Currency" description="Store name, email address, and pricing currency">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <AdminInput
                  label="Official Business / Clinic Name"
                  value={general.siteName}
                  onChange={(e) => handleChange('siteName', e.target.value)}
                />
              </div>

              <div>
                <AdminInput
                  label="Business Tagline"
                  value={general.tagline}
                  onChange={(e) => handleChange('tagline', e.target.value)}
                />
              </div>

              <div>
                <AdminInput
                  label="Support & Billing Email"
                  type="email"
                  value={general.supportEmail}
                  onChange={(e) => handleChange('supportEmail', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <AdminInput
                  label="Currency Symbol"
                  value={general.currencySymbol}
                  onChange={(e) => handleChange('currencySymbol', e.target.value)}
                  placeholder="₹"
                />
                <AdminInput
                  label="Currency Code"
                  value={general.currencyCode}
                  onChange={(e) => handleChange('currencyCode', e.target.value)}
                  placeholder="INR"
                />
              </div>

              <div className="sm:col-span-2">
                <AdminTextarea
                  label="Booking Notice / Policy Note"
                  rows={2}
                  value={general.consultationNotice}
                  onChange={(e) => handleChange('consultationNotice', e.target.value)}
                />
              </div>
            </div>
          </AdminCard>

          <StickyActionBar
            onSave={handleSave}
            onCancel={loadSettings}
            isSaving={isSaving}
            isDirty={isDirty}
            saveText="Save General Settings"
          />

        </div>
      )}
    </div>
  );
}

