import React, { useState, useEffect } from 'react';
import AdminPageHeader from '../components/AdminPageHeader';
import AdminCard from '../components/AdminCard';
import AdminButton from '../components/AdminButton';
import AdminInput from '../components/AdminInput';
import AdminTextarea from '../components/AdminTextarea';
import AdminToggle from '../components/AdminToggle';
import ImageInput from '../components/ImageInput';
import StickyActionBar from '../components/StickyActionBar';
import { useToast } from '../context/ToastContext';
import { 
  PanelTop, 
  Plus, 
  Trash2, 
  RefreshCw, 
  ExternalLink 
} from 'lucide-react';

export default function HeaderFooterView() {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  // Header State
  const [header, setHeader] = useState({
    logo: '/brand/logo.png',
    announcementText: '✨ FREE Scalp Assessment & Demo Fitting at Wave Mall Noida Clinic • Call +91 98734 33300',
    announcementActive: true,
    navigation: [
      { label: 'Home', href: '#home' },
      { label: 'Shop Collection', href: '#products' },
      { label: 'Categories', href: '#categories' },
      { label: 'Celebrity Awards', href: '#awards' },
      { label: 'Why Choose Us', href: '#why-us' },
      { label: 'Clinic', href: '#clinic' }
    ]
  });

  // Footer State
  const [footer, setFooter] = useState({
    logo: '/brand/logo.png',
    brandDescription: 'Looks Forever Hair Aesthetic Clinic is North India’s premier destination for 100% natural non-surgical hair replacement, custom hair systems, and bespoke styling.',
    copyright: '© 2026 Looks Forever Hair Aesthetic Clinic. All rights reserved.',
    address: 'Shop No. 248, 2nd Floor, Wave Mall, Sector 18, Noida, UP 201301',
    phone: '+91 98734 33300',
    email: 'info@looksforever.org',
    socials: {
      instagram: 'https://instagram.com/looksforever',
      facebook: 'https://facebook.com/looksforever',
      youtube: 'https://youtube.com/@looksforever',
      whatsapp: 'https://wa.me/919873433300'
    }
  });

  const loadSettings = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/settings?type=header_footer');
      if (res.ok) {
        const data = await res.json();
        if (data.header) setHeader(data.header);
        if (data.footer) setFooter(data.footer);
      }
    } catch {
      toast.error('Failed to load navigation settings.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleNavChange = (index, field, value) => {
    setHeader(prev => {
      const nextNav = [...prev.navigation];
      nextNav[index] = { ...nextNav[index], [field]: value };
      return { ...prev, navigation: nextNav };
    });
    setIsDirty(true);
  };

  const handleAddNavItem = () => {
    setHeader(prev => ({
      ...prev,
      navigation: [...prev.navigation, { label: 'New Link', href: '#' }]
    }));
    setIsDirty(true);
  };

  const handleRemoveNavItem = (index) => {
    setHeader(prev => ({
      ...prev,
      navigation: prev.navigation.filter((_, i) => i !== index)
    }));
    setIsDirty(true);
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'header_footer',
          header,
          footer
        })
      });

      if (res.ok) {
        toast.success('Header & Footer settings updated successfully!');
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
        title="Header & Footer Layout Settings"
        description="Manage the store header logo, announcement bar text, menu links, and footer brand copy."
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
          <p className="text-xs">Loading header and footer settings...</p>
        </div>
      ) : (
        <div className="space-y-6">
          
          {/* Header & Logo */}
          <AdminCard title="Header Logo & Top Announcement" description="Client branding and header announcement ticker">
            <div className="space-y-4">
              <ImageInput
                label="Header Logo Image"
                multiple={false}
                images={header.logo}
                onChange={(img) => {
                  setHeader(p => ({ ...p, logo: img }));
                  setIsDirty(true);
                }}
                helperText="Seeded default is /brand/logo.png. Change if a new logo variant is desired."
              />

              <div className="pt-3 border-t border-slate-100 space-y-3">
                <AdminToggle
                  label="Enable Top Announcement Bar"
                  checked={header.announcementActive}
                  onChange={(val) => {
                    setHeader(p => ({ ...p, announcementActive: val }));
                    setIsDirty(true);
                  }}
                />

                <AdminInput
                  label="Announcement Bar Text"
                  value={header.announcementText}
                  onChange={(e) => {
                    setHeader(p => ({ ...p, announcementText: e.target.value }));
                    setIsDirty(true);
                  }}
                  placeholder="✨ Free Consultation..."
                />
              </div>
            </div>
          </AdminCard>

          {/* Navigation Links */}
          <AdminCard 
            title="Desktop Navigation Menu Items" 
            description="Manage header menu items and anchor targets"
            action={
              <AdminButton
                size="sm"
                variant="outline"
                icon={Plus}
                onClick={handleAddNavItem}
              >
                Add Menu Item
              </AdminButton>
            }
          >
            <div className="space-y-3">
              {header.navigation?.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200/80 rounded-xl">
                  <div className="flex-1">
                    <AdminInput
                      label="Menu Label"
                      value={item.label}
                      onChange={(e) => handleNavChange(idx, 'label', e.target.value)}
                      placeholder="e.g. Shop Collection"
                    />
                  </div>
                  <div className="flex-1">
                    <AdminInput
                      label="Target Link (ID or URL)"
                      value={item.href}
                      onChange={(e) => handleNavChange(idx, 'href', e.target.value)}
                      placeholder="#products"
                    />
                  </div>
                  <div className="pt-5">
                    <button
                      type="button"
                      onClick={() => handleRemoveNavItem(idx)}
                      className="p-2 text-slate-400 hover:text-rose-600 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </AdminCard>

          {/* Footer Details */}
          <AdminCard title="Footer Branding & Social Coordinates" description="Copyright, clinic address, and social channel links">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <AdminTextarea
                  label="Footer Brand Statement"
                  rows={2}
                  value={footer.brandDescription}
                  onChange={(e) => {
                    setFooter(p => ({ ...p, brandDescription: e.target.value }));
                    setIsDirty(true);
                  }}
                />
              </div>

              <div className="sm:col-span-2">
                <AdminInput
                  label="Copyright Notice"
                  value={footer.copyright}
                  onChange={(e) => {
                    setFooter(p => ({ ...p, copyright: e.target.value }));
                    setIsDirty(true);
                  }}
                />
              </div>

              <div>
                <AdminInput
                  label="Instagram URL"
                  value={footer.socials?.instagram}
                  onChange={(e) => {
                    setFooter(p => ({ ...p, socials: { ...p.socials, instagram: e.target.value } }));
                    setIsDirty(true);
                  }}
                  placeholder="https://instagram.com/..."
                />
              </div>

              <div>
                <AdminInput
                  label="Facebook URL"
                  value={footer.socials?.facebook}
                  onChange={(e) => {
                    setFooter(p => ({ ...p, socials: { ...p.socials, facebook: e.target.value } }));
                    setIsDirty(true);
                  }}
                  placeholder="https://facebook.com/..."
                />
              </div>

              <div>
                <AdminInput
                  label="YouTube Channel URL"
                  value={footer.socials?.youtube}
                  onChange={(e) => {
                    setFooter(p => ({ ...p, socials: { ...p.socials, youtube: e.target.value } }));
                    setIsDirty(true);
                  }}
                  placeholder="https://youtube.com/@..."
                />
              </div>

              <div>
                <AdminInput
                  label="WhatsApp Direct Link"
                  value={footer.socials?.whatsapp}
                  onChange={(e) => {
                    setFooter(p => ({ ...p, socials: { ...p.socials, whatsapp: e.target.value } }));
                    setIsDirty(true);
                  }}
                  placeholder="https://wa.me/919873433300"
                />
              </div>
            </div>
          </AdminCard>

          <StickyActionBar
            onSave={handleSave}
            onCancel={loadSettings}
            isSaving={isSaving}
            isDirty={isDirty}
            saveText="Save Navigation Settings"
          />

        </div>
      )}
    </div>
  );
}

