import React, { useState, useEffect } from 'react';
import AdminPageHeader from '../components/AdminPageHeader';
import AdminCard from '../components/AdminCard';
import AdminButton from '../components/AdminButton';
import AdminInput from '../components/AdminInput';
import AdminTextarea from '../components/AdminTextarea';
import ImageInput from '../components/ImageInput';
import StickyActionBar from '../components/StickyActionBar';
import { useToast } from '../context/ToastContext';
import { 
  Globe, 
  RefreshCw, 
  Eye, 
  Search 
} from 'lucide-react';

export default function SeoView() {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  // Global SEO Settings
  const [globalSeo, setGlobalSeo] = useState({
    defaultTitle: 'Looks Forever Hair Aesthetic Clinic | Hair Patch & Non-Surgical Hair Replacement Noida',
    defaultDescription: 'Looks Forever Hair Aesthetic Clinic at Wave Mall Sector 18 Noida offers 100% natural Remy human hair patches, Swiss lace hair systems, and non-surgical hair replacement.',
    canonicalBase: 'https://looksforever.org',
    ogImage: '/brand/og-image.jpg',
    keywords: 'hair patch noida, gents hair patch wave mall, non-surgical hair replacement, hair wigs delhi ncr, remy human hair system, looks forever clinic'
  });

  // Per-page SEO overrides
  const [pagesSeo, setPagesSeo] = useState({
    home: {
      title: 'Looks Forever - Best Hair Patch & Aesthetic Clinic Noida',
      description: 'Transform your look with natural undetectable hair systems at Looks Forever Hair Clinic Wave Mall Noida.'
    },
    products: {
      title: 'Shop Hair Systems, Patches & Accessories | Looks Forever',
      description: 'Explore full lace hair patches, monofilament human hair wigs, and medical tapes at factory-direct pricing.'
    },
    about: {
      title: 'About Looks Forever Hair Aesthetic Clinic | 15+ Years Trust',
      description: 'Award-winning hair aesthetic specialists based in Wave Mall Sector 18 Noida with over 12,500 happy clients.'
    },
    contact: {
      title: 'Book Free Consultation | Looks Forever Wave Mall Noida',
      description: 'Visit our flagship clinic at Wave Mall Sector 18 Noida or call +91 98734 33300 for free scalp analysis.'
    }
  });

  const loadSettings = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/settings?type=seo');
      if (res.ok) {
        const data = await res.json();
        if (data.global) setGlobalSeo(data.global);
        if (data.pages) setPagesSeo(data.pages);
      }
    } catch {
      toast.error('Failed to load SEO settings.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleGlobalChange = (field, value) => {
    setGlobalSeo(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  const handlePageChange = (pageKey, field, value) => {
    setPagesSeo(prev => ({
      ...prev,
      [pageKey]: {
        ...prev[pageKey],
        [field]: value
      }
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
          type: 'seo',
          global: globalSeo,
          pages: pagesSeo
        })
      });

      if (res.ok) {
        toast.success('SEO metadata saved successfully!');
        setIsDirty(false);
      } else {
        toast.error('Failed to save SEO settings.');
      }
    } catch {
      toast.error('Network error saving SEO.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Search Engine Optimization & Social Sharing"
        description="Configure meta titles, descriptions, and OpenGraph social preview images for Google and WhatsApp links."
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
          <p className="text-xs">Loading SEO metadata...</p>
        </div>
      ) : (
        <div className="space-y-6">
          
          {/* Google SERP Preview Card */}
          <AdminCard title="Google Search Result Preview" description="Live simulation of how Looks Forever appears on Google">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1 font-sans">
              <div className="text-xs text-slate-500 flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-brand-600 text-white flex items-center justify-center text-[10px] font-bold">L</span>
                <span className="truncate">{globalSeo.canonicalBase || 'https://looksforever.org'}</span>
              </div>
              <h4 className="text-base font-medium text-blue-800 hover:underline cursor-pointer truncate">
                {globalSeo.defaultTitle || 'Looks Forever Hair Aesthetic Clinic'}
              </h4>
              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                {globalSeo.defaultDescription || 'Looks Forever Hair Aesthetic Clinic at Wave Mall Sector 18 Noida.'}
              </p>
            </div>
          </AdminCard>

          {/* Global Defaults */}
          <AdminCard title="Site-Wide Meta Defaults" description="Applied across all storefront pages unless overridden">
            <div className="space-y-4">
              <AdminInput
                label="Default Meta Title"
                value={globalSeo.defaultTitle}
                onChange={(e) => handleGlobalChange('defaultTitle', e.target.value)}
                helperText={`${globalSeo.defaultTitle?.length || 0}/60 recommended characters`}
              />

              <AdminTextarea
                label="Default Meta Description"
                rows={3}
                value={globalSeo.defaultDescription}
                onChange={(e) => handleGlobalChange('defaultDescription', e.target.value)}
                helperText={`${globalSeo.defaultDescription?.length || 0}/160 recommended characters`}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <AdminInput
                    label="Canonical Base URL"
                    value={globalSeo.canonicalBase}
                    onChange={(e) => handleGlobalChange('canonicalBase', e.target.value)}
                    placeholder="https://looksforever.org"
                  />
                </div>

                <div>
                  <AdminInput
                    label="Focus Keywords (comma separated)"
                    value={globalSeo.keywords}
                    onChange={(e) => handleGlobalChange('keywords', e.target.value)}
                  />
                </div>
              </div>

              <ImageInput
                label="Default OpenGraph (OG) Social Share Image"
                multiple={false}
                images={globalSeo.ogImage}
                onChange={(img) => handleGlobalChange('ogImage', img)}
                helperText="Seeded default is /brand/og-image.jpg (1200x630)"
              />
            </div>
          </AdminCard>

          {/* Per Page Overrides */}
          <AdminCard title="Per-Page Meta Overrides" description="Targeted SEO titles and snippets for key landing sections">
            <div className="space-y-6">
              {Object.keys(pagesSeo).map((pageKey) => (
                <div key={pageKey} className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl space-y-3">
                  <div className="font-semibold text-xs text-slate-800 uppercase tracking-wider">
                    Page: /{pageKey === 'home' ? '' : pageKey}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <AdminInput
                        label="Page Title"
                        value={pagesSeo[pageKey]?.title}
                        onChange={(e) => handlePageChange(pageKey, 'title', e.target.value)}
                      />
                    </div>
                    <div>
                      <AdminInput
                        label="Page Description"
                        value={pagesSeo[pageKey]?.description}
                        onChange={(e) => handlePageChange(pageKey, 'description', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </AdminCard>

          <StickyActionBar
            onSave={handleSave}
            onCancel={loadSettings}
            isSaving={isSaving}
            isDirty={isDirty}
            saveText="Save SEO Settings"
          />

        </div>
      )}
    </div>
  );
}

