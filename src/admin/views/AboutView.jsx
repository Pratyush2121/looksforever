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
  Building2, 
  Award, 
  Plus, 
  Trash2, 
  RefreshCw, 
  CheckCircle2, 
  Sparkles 
} from 'lucide-react';

export default function AboutView() {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  // About Page State
  const [clinicStory, setClinicStory] = useState({
    headline: 'Redefining Hair Aesthetics & Non-Surgical Hair Replacement in Delhi NCR',
    story: 'Established at Wave Mall Sector 18 Noida, Looks Forever Hair Aesthetic Clinic has transformed thousands of lives with undetectable natural hair systems, custom medical-grade lace patches, and expert non-surgical procedures.',
    mission: 'To restore supreme confidence and youthful vitality with personalized hair aesthetics, state-of-the-art hair systems, and transparent, compassionate patient care.'
  });

  const [stats, setStats] = useState([
    { label: 'Years of Excellence', value: '15+' },
    { label: 'Happy Smiles Restored', value: '12,500+' },
    { label: 'Hair Systems Tailored', value: '18,000+' },
    { label: 'National Honors & Awards', value: '25+' }
  ]);

  const [awards, setAwards] = useState([
    { title: 'National Healthcare Excellence Award', presenter: 'Presented by Renowned Bollywood Icon', year: '2023', image: '/brand/awards/award-1.jpg' },
    { title: 'Best Hair Aesthetic Clinic in NCR', presenter: 'Aesthetic Medicine Summit', year: '2022', image: '/brand/awards/award-2.jpg' },
    { title: 'Excellence in Non-Surgical Hair Systems', presenter: 'India Clinical Honors', year: '2021', image: '/brand/awards/award-3.jpg' }
  ]);

  const loadAboutSettings = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/settings?type=about');
      if (res.ok) {
        const data = await res.json();
        if (data.clinicStory) setClinicStory(data.clinicStory);
        if (data.stats && Array.isArray(data.stats)) setStats(data.stats);
        if (data.awards && Array.isArray(data.awards)) setAwards(data.awards);
      }
    } catch {
      toast.error('Failed to load about page settings.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAboutSettings();
  }, []);

  const handleStatChange = (index, field, value) => {
    setStats(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
    setIsDirty(true);
  };

  const handleAwardChange = (index, field, value) => {
    setAwards(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
    setIsDirty(true);
  };

  const handleAddAward = () => {
    setAwards(prev => [
      ...prev,
      { title: 'Celebrity Honor', presenter: 'Guest of Honor', year: '2024', image: '' }
    ]);
    setIsDirty(true);
  };

  const handleRemoveAward = (index) => {
    setAwards(prev => prev.filter((_, i) => i !== index));
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
          type: 'about',
          clinicStory,
          stats,
          awards
        })
      });

      if (res.ok) {
        toast.success('About page settings updated successfully!');
        setIsDirty(false);
      } else {
        toast.error('Failed to update about settings.');
      }
    } catch {
      toast.error('Network error saving about settings.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="About Clinic & Celebrity Awards"
        description="Edit the Looks Forever clinic heritage story, key statistics, and celebrity award recognitions."
        action={
          <AdminButton
            variant="outline"
            size="md"
            icon={RefreshCw}
            onClick={loadAboutSettings}
            disabled={isLoading}
          >
            Refresh
          </AdminButton>
        }
      />

      {isLoading ? (
        <div className="p-12 text-center text-slate-400">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-brand-600" />
          <p className="text-xs">Loading about page content...</p>
        </div>
      ) : (
        <div className="space-y-6">
          
          {/* Clinic Heritage Story */}
          <AdminCard title="Clinic Story & Mission" description="The story behind Looks Forever Hair Aesthetic Clinic">
            <div className="space-y-4">
              <AdminInput
                label="Headline"
                value={clinicStory.headline}
                onChange={(e) => {
                  setClinicStory(p => ({ ...p, headline: e.target.value }));
                  setIsDirty(true);
                }}
                placeholder="Redefining Hair Aesthetics in Delhi NCR"
              />

              <AdminTextarea
                label="Detailed Heritage Story"
                rows={4}
                value={clinicStory.story}
                onChange={(e) => {
                  setClinicStory(p => ({ ...p, story: e.target.value }));
                  setIsDirty(true);
                }}
                placeholder="Clinic founding history, experience and patient philosophy..."
              />

              <AdminTextarea
                label="Mission Statement"
                rows={2}
                value={clinicStory.mission}
                onChange={(e) => {
                  setClinicStory(p => ({ ...p, mission: e.target.value }));
                  setIsDirty(true);
                }}
                placeholder="Core mission and values..."
              />
            </div>
          </AdminCard>

          {/* Key Achievements & Statistics */}
          <AdminCard title="Clinic Statistics & Milestones" description="Key metrics displayed in trust widgets and about sections">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((s, idx) => (
                <div key={idx} className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl space-y-2">
                  <AdminInput
                    label="Stat Value"
                    value={s.value}
                    onChange={(e) => handleStatChange(idx, 'value', e.target.value)}
                    placeholder="15+"
                  />
                  <AdminInput
                    label="Stat Label"
                    value={s.label}
                    onChange={(e) => handleStatChange(idx, 'label', e.target.value)}
                    placeholder="Years Experience"
                  />
                </div>
              ))}
            </div>
          </AdminCard>

          {/* Celebrity Awards Gallery */}
          <AdminCard 
            title="Celebrity Awards & National Honors" 
            description="Awards received from celebrities and medical industry summits"
            action={
              <AdminButton
                size="sm"
                variant="outline"
                icon={Plus}
                onClick={handleAddAward}
              >
                Add Honor
              </AdminButton>
            }
          >
            <div className="space-y-4">
              {awards.map((award, idx) => (
                <div key={idx} className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-amber-500" />
                      Award #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveAward(idx)}
                      className="text-slate-400 hover:text-rose-600 p-1 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <AdminInput
                        label="Award Title"
                        value={award.title}
                        onChange={(e) => handleAwardChange(idx, 'title', e.target.value)}
                        placeholder="e.g. National Healthcare Excellence Award"
                      />
                    </div>
                    <div>
                      <AdminInput
                        label="Year"
                        value={award.year}
                        onChange={(e) => handleAwardChange(idx, 'year', e.target.value)}
                        placeholder="2023"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <AdminInput
                        label="Presenter / Organization"
                        value={award.presenter}
                        onChange={(e) => handleAwardChange(idx, 'presenter', e.target.value)}
                        placeholder="Presented by Bollywood Icon at Grand Summit"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <ImageInput
                        label="Ceremony Photograph"
                        multiple={false}
                        images={award.image}
                        onChange={(img) => handleAwardChange(idx, 'image', img)}
                        helperText="Upload or link to award photo"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </AdminCard>

          <StickyActionBar
            onSave={handleSave}
            onCancel={loadAboutSettings}
            isSaving={isSaving}
            isDirty={isDirty}
            saveText="Save About Page Settings"
          />

        </div>
      )}
    </div>
  );
}

