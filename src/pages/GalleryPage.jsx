import React, { useState } from 'react';
import CelebrityAwards from '../components/CelebrityAwards';
import { 
  Award, 
  Sparkles, 
  ShieldCheck, 
  Eye, 
  MessageCircle, 
  Calendar,
  CheckCircle2
} from 'lucide-react';
import { handleConsultation } from '../utils/whatsapp';

export default function GalleryPage({ onOpenConsultation }) {
  const [activeFilter, setActiveFilter] = useState('all');

  const transformationCases = [
    {
      id: 1,
      tag: 'mens',
      tagLabel: 'Norwood Stage 5 Baldness',
      system: 'Mirage Swiss Lace (Natural #1B)',
      duration: '90 Minutes In-Studio Fitting',
      clientAge: '34 Years Old, IT Executive',
      before: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600',
      after: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=600',
      quote: 'I felt hesitant for 2 years before visiting Wave Mall studio. The invisible lace hairline restored my self-assurance completely.'
    },
    {
      id: 2,
      tag: 'crown',
      tagLabel: 'Crown Vertex Loss',
      system: 'Ultra-Thin Micro Poly Toupee',
      duration: '60 Minutes Bonding',
      clientAge: '41 Years Old, Entrepreneur',
      before: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=600',
      after: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=600',
      quote: 'Waterproof hold is 100% genuine. I ride a Royal Enfield and go to the gym daily with zero worries.'
    },
    {
      id: 3,
      tag: 'mens',
      tagLabel: 'Receding Hairline & Frontal Temples',
      system: 'Fine Hollywood HD French Lace',
      duration: '75 Minutes Precision Knotting',
      clientAge: '28 Years Old, Marketing Lead',
      before: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600',
      after: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=600',
      quote: 'Completely natural front view. Friends couldn’t even guess that it was a non-surgical system.'
    },
    {
      id: 4,
      tag: 'womens',
      tagLabel: 'Female Parting Thinning',
      system: 'Silk Base Crown Volumizer',
      duration: '45 Minutes Clip-In Integration',
      clientAge: '37 Years Old, Academician',
      before: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=600',
      after: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600',
      quote: 'No shaving needed. It clips seamlessly on my crown and gives my hair the volume I had in my early twenties.'
    }
  ];

  const filteredCases = activeFilter === 'all' 
    ? transformationCases 
    : transformationCases.filter(c => c.tag === activeFilter);

  return (
    <div className="min-h-screen bg-surface-soft space-y-12 pb-16 selection:bg-brand-500 selection:text-white">
      
      {/* Header Banner */}
      <section className="bg-gradient-to-r from-brand-900 via-brand-800 to-slate-900 text-white py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-amber-300 text-xs font-semibold uppercase tracking-wider">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>National Honors & Clinical Transformations</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight max-w-3xl">
            Real Patient Transformations & Celebrity Awards
          </h1>

          <p className="text-xs sm:text-base text-brand-200 max-w-2xl leading-relaxed">
            See the transformative craft of Looks Forever Hair Aesthetic Clinic. Browse verified in-clinic before/after results and our national awards presented by renowned cinema and aesthetic medical icons.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={onOpenConsultation}
              className="bg-brand-500 hover:bg-brand-400 text-white font-bold px-5 py-3 rounded-xl text-xs sm:text-sm transition shadow-md flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Transformation Trial</span>
            </button>
            <button
              onClick={() => handleConsultation('Transformation Case Study Inquiry')}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-3 rounded-xl text-xs sm:text-sm transition shadow-md flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Send Your Scalp Photo on WhatsApp</span>
            </button>
          </div>
        </div>
      </section>

      {/* Celebrity Awards Section */}
      <CelebrityAwards />

      {/* Before & After Cases Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold text-brand-600 uppercase tracking-widest">
              Verified In-Clinic Cases
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Before & After Case Studies
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-semibold">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3.5 py-1.5 rounded-xl transition ${activeFilter === 'all' ? 'bg-brand-600 text-white shadow-xs' : 'bg-white text-slate-600 border border-slate-200'}`}
            >
              All Cases
            </button>
            <button
              onClick={() => setActiveFilter('mens')}
              className={`px-3.5 py-1.5 rounded-xl transition ${activeFilter === 'mens' ? 'bg-brand-600 text-white shadow-xs' : 'bg-white text-slate-600 border border-slate-200'}`}
            >
              Frontal Receding Hairline
            </button>
            <button
              onClick={() => setActiveFilter('crown')}
              className={`px-3.5 py-1.5 rounded-xl transition ${activeFilter === 'crown' ? 'bg-brand-600 text-white shadow-xs' : 'bg-white text-slate-600 border border-slate-200'}`}
            >
              Crown Vertex Loss
            </button>
            <button
              onClick={() => setActiveFilter('womens')}
              className={`px-3.5 py-1.5 rounded-xl transition ${activeFilter === 'womens' ? 'bg-brand-600 text-white shadow-xs' : 'bg-white text-slate-600 border border-slate-200'}`}
            >
              Women’s Hair Thinning
            </button>
          </div>
        </div>

        {/* Transformation Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredCases.map((cs) => (
            <div 
              key={cs.id}
              className="bg-white rounded-3xl border border-slate-200/90 shadow-subtle overflow-hidden p-5 sm:p-6 space-y-4 hover:border-brand-300 transition"
            >
              {/* Image Comparison */}
              <div className="grid grid-cols-2 gap-3">
                <div className="aspect-4/3 rounded-2xl overflow-hidden bg-slate-200 relative">
                  <img src={cs.before} alt="Before" className="w-full h-full object-cover" />
                  <span className="absolute top-2.5 left-2.5 bg-slate-900/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-xs">
                    BEFORE
                  </span>
                </div>
                <div className="aspect-4/3 rounded-2xl overflow-hidden bg-slate-200 relative ring-2 ring-brand-500/20">
                  <img src={cs.after} alt="After" className="w-full h-full object-cover" />
                  <span className="absolute top-2.5 left-2.5 bg-brand-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                    AFTER
                  </span>
                </div>
              </div>

              {/* Case Details */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-2 py-0.5 rounded">
                    {cs.tagLabel}
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">
                    {cs.duration}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-base">
                  {cs.system}
                </h3>

                <blockquote className="text-xs text-slate-600 italic bg-slate-50 p-3 rounded-xl border border-slate-100">
                  "{cs.quote}"
                </blockquote>

                <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1">
                  <span>Patient: {cs.clientAge}</span>
                  <span className="text-emerald-600 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Wave Mall Noida Fitting
                  </span>
                </div>
              </div>

            </div>
          ))}
        </div>

      </section>

    </div>
  );
}

