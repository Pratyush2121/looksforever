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
  Home, 
  Save, 
  RefreshCw, 
  Plus, 
  Trash2, 
  Sparkles, 
  ShieldCheck, 
  Award,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export default function HomepageView() {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  // Settings State
  const [hero, setHero] = useState({
    badgeText: 'India’s #1 Non-Surgical Hair Replacement Clinic',
    title: 'Transform Your Confidence with 100% Natural Hair Systems',
    subtitle: 'Custom-designed human hair patches, seamless undetectable wigs, and aesthetic hair solutions crafted for modern lifestyle.',
    primaryButtonText: 'Explore Hair Systems',
    primaryButtonLink: '#products',
    secondaryButtonText: 'Book Free Consultation',
    heroImage: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&q=80&w=1200'
  });

  const [whyChoose, setWhyChoose] = useState([
    {
      title: '100% Natural Remy Human Hair',
      description: 'Every hair patch is woven with premium, virgin human hair that mirrors natural growth, density, and natural flow.'
    },
    {
      title: 'Ultra-Thin Breathable Swiss Lace',
      description: 'Invisible front hairlines crafted on featherlight French & Swiss lace bases for maximum scalp comfort in all weather.'
    },
    {
      title: 'Waterproof & Sweat-Resistant Hold',
      description: 'Swim, shower, workout, and helmet-ride without anxiety. Secured with medical-grade dermatologically certified adhesives.'
    },
    {
      title: 'Custom In-Clinic Styling & Fitting',
      description: 'Award-winning styling experts tailor texture, cut, and blend directly to your existing hair at our Wave Mall Noida clinic.'
    }
  ]);

  const [promoBanner, setPromoBanner] = useState({
    enabled: true,
    tag: 'Limited Festive Offer',
    title: 'Get ₹3,000 Off on Premium Mirage & French Lace Hair Patches',
    subtitle: 'Includes complementary in-clinic customization, scalp mapping, and first maintenance kit.',
    ctaText: 'Claim Festive Offer on WhatsApp',
    ctaLink: 'https://wa.me/919873433300?text=I%20want%20to%20claim%20the%20Festive%20Offer%20on%20Hair%20Patches'
  });

  const loadSettings = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/settings?type=homepage');
      if (res.ok) {
        const data = await res.json();
        if (data.hero) setHero(data.hero);
        if (data.whyChoose && Array.isArray(data.whyChoose)) setWhyChoose(data.whyChoose);
        if (data.promoBanner) setPromoBanner(data.promoBanner);
      }
    } catch {
      toast.error('Failed to load homepage settings.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleHeroChange = (field, value) => {
    setHero(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  const handleWhyChooseChange = (index, field, value) => {
    setWhyChoose(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
    setIsDirty(true);
  };

  const handleAddWhyChooseItem = () => {
    setWhyChoose(prev => [
      ...prev,
      { title: 'New Benefit', description: 'Describe why clients choose Looks Forever.' }
    ]);
    setIsDirty(true);
  };

  const handleRemoveWhyChooseItem = (index) => {
    setWhyChoose(prev => prev.filter((_, i) => i !== index));
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
          type: 'homepage',
          hero,
          whyChoose,
          promoBanner
        })
      });

      if (res.ok) {
        toast.success('Homepage settings saved successfully!');
        setIsDirty(false);
      } else {
        toast.error('Failed to save homepage settings.');
      }
    } catch {
      toast.error('Network error saving homepage settings.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Homepage Content & Layout"
        description="Configure hero messages, banners, and the 'Why Choose Looks Forever' trust section."
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
          <p className="text-xs">Loading homepage configuration...</p>
        </div>
      ) : (
        <div className="space-y-6">
          
          {/* Hero Section Card */}
          <AdminCard title="Hero Section (Above the Fold)" description="Primary headline and call to action shown to every new visitor">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <AdminInput
                  label="Trust Badge Text (Top pill)"
                  value={hero.badgeText}
                  onChange={(e) => handleHeroChange('badgeText', e.target.value)}
                  placeholder="e.g. India's #1 Non-Surgical Hair Replacement Clinic"
                />
              </div>

              <div className="sm:col-span-2">
                <AdminInput
                  label="Hero Headline"
                  value={hero.title}
                  onChange={(e) => handleHeroChange('title', e.target.value)}
                  placeholder="Transform Your Confidence with 100% Natural Hair Systems"
                />
              </div>

              <div className="sm:col-span-2">
                <AdminTextarea
                  label="Hero Subheadline"
                  rows={2}
                  value={hero.subtitle}
                  onChange={(e) => handleHeroChange('subtitle', e.target.value)}
                  placeholder="Supporting message under main headline..."
                />
              </div>

              <div>
                <AdminInput
                  label="Primary Button Text"
                  value={hero.primaryButtonText}
                  onChange={(e) => handleHeroChange('primaryButtonText', e.target.value)}
                  placeholder="Explore Hair Systems"
                />
              </div>

              <div>
                <AdminInput
                  label="Secondary Button Text"
                  value={hero.secondaryButtonText}
                  onChange={(e) => handleHeroChange('secondaryButtonText', e.target.value)}
                  placeholder="Book Free Consultation"
                />
              </div>

              <div className="sm:col-span-2">
                <ImageInput
                  label="Hero Background / Showcase Image"
                  multiple={false}
                  images={hero.heroImage}
                  onChange={(img) => handleHeroChange('heroImage', img)}
                  helperText="Primary high-resolution clinic or model visual"
                />
              </div>
            </div>
          </AdminCard>

          {/* Why Choose Us Trust Section */}
          <AdminCard 
            title="'Why Choose Looks Forever' Value Propositions" 
            description="Manage trust points displayed in the clinic credibility section"
            action={
              <AdminButton
                size="sm"
                variant="outline"
                icon={Plus}
                onClick={handleAddWhyChooseItem}
              >
                Add Point
              </AdminButton>
            }
          >
            <div className="space-y-4">
              {whyChoose.map((item, idx) => (
                <div key={idx} className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-brand-600" />
                      Benefit #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveWhyChooseItem(idx)}
                      className="text-slate-400 hover:text-rose-600 p-1 rounded transition"
                      title="Remove point"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="sm:col-span-2">
                      <AdminInput
                        label="Headline"
                        value={item.title}
                        onChange={(e) => handleWhyChooseChange(idx, 'title', e.target.value)}
                        placeholder="e.g. 100% Natural Remy Human Hair"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <AdminTextarea
                        label="Description"
                        rows={2}
                        value={item.description}
                        onChange={(e) => handleWhyChooseChange(idx, 'description', e.target.value)}
                        placeholder="Explain this benefit..."
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </AdminCard>

          {/* Promotional Banner */}
          <AdminCard title="Mid-Page Promotional Banner" description="Special discounts and festive offers displayed across the homepage">
            <div className="space-y-4">
              <AdminToggle
                label="Enable Promotional Banner on Homepage"
                checked={promoBanner.enabled}
                onChange={(val) => {
                  setPromoBanner(p => ({ ...p, enabled: val }));
                  setIsDirty(true);
                }}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <AdminInput
                    label="Banner Tag / Pill"
                    value={promoBanner.tag}
                    onChange={(e) => {
                      setPromoBanner(p => ({ ...p, tag: e.target.value }));
                      setIsDirty(true);
                    }}
                    placeholder="e.g. Limited Festive Offer"
                  />
                </div>
                <div>
                  <AdminInput
                    label="CTA Button Text"
                    value={promoBanner.ctaText}
                    onChange={(e) => {
                      setPromoBanner(p => ({ ...p, ctaText: e.target.value }));
                      setIsDirty(true);
                    }}
                    placeholder="Claim on WhatsApp"
                  />
                </div>
                <div className="sm:col-span-2">
                  <AdminInput
                    label="Offer Title"
                    value={promoBanner.title}
                    onChange={(e) => {
                      setPromoBanner(p => ({ ...p, title: e.target.value }));
                      setIsDirty(true);
                    }}
                    placeholder="e.g. Get ₹3,000 Off on Premium Mirage Patches"
                  />
                </div>
                <div className="sm:col-span-2">
                  <AdminTextarea
                    label="Offer Subtitle"
                    rows={2}
                    value={promoBanner.subtitle}
                    onChange={(e) => {
                      setPromoBanner(p => ({ ...p, subtitle: e.target.value }));
                      setIsDirty(true);
                    }}
                    placeholder="Details about inclusion..."
                  />
                </div>
              </div>
            </div>
          </AdminCard>

          {/* Sticky Action Footer */}
          <StickyActionBar
            onSave={handleSave}
            onCancel={loadSettings}
            isSaving={isSaving}
            isDirty={isDirty}
            saveText="Save Homepage Settings"
          />

        </div>
      )}
    </div>
  );
}

