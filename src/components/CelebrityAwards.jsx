import React, { useState } from 'react';
import { Award, Star, ExternalLink, ShieldCheck, X, Sparkles, ChevronRight } from 'lucide-react';
import { CELEBRITY_AWARDS } from '../config/siteConfig';

export default function CelebrityAwards() {
  const [selectedAward, setSelectedAward] = useState(null);

  return (
    <section id="awards" className="py-16 bg-gradient-to-b from-white via-brand-50/40 to-white relative overflow-hidden border-b border-slate-100">
      
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-brand-100/30 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider">
            <Award className="w-3.5 h-3.5 text-amber-600" />
            Celebrity Endorsements & National Accolades
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Recognized by India's Top Celebrities & Icons
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Looks Forever has been honored on prestigious national and international stages by India's most celebrated Bollywood icons for pioneering excellence in hair restoration and aesthetic care.
          </p>
        </div>

        {/* Awards Grid - Using all 6 folder images */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {CELEBRITY_AWARDS.map((award) => (
            <div
              key={award.id}
              onClick={() => setSelectedAward(award)}
              className="group bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-subtle hover:shadow-hover transition-all duration-300 transform hover:-translate-y-1 flex flex-col cursor-pointer"
            >
              {/* Award Image Container */}
              <div className="relative aspect-4/3 overflow-hidden bg-slate-900">
                <img
                  src={award.image}
                  alt={award.alt}
                  className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                
                {/* Year / Stage Tag */}
                <div className="absolute top-3 left-3 bg-brand-900/80 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-full border border-white/20">
                  {award.year}
                </div>

                {/* Quick inspect overlay button */}
                <div className="absolute inset-0 bg-brand-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="bg-white text-slate-900 text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                    <ExternalLink className="w-3.5 h-3.5 text-brand-600" />
                    View Award Details
                  </span>
                </div>
              </div>

              {/* Award Description */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                    {award.category}
                  </div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-brand-600 transition">
                    {award.title}
                  </h3>
                  <p className="text-xs font-semibold text-brand-700 mt-1">
                    {award.presentedBy}
                  </p>
                  <p className="text-xs text-slate-500 mt-2 line-clamp-2">
                    {award.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-brand-600 font-medium">
                  <span>Verified Accolade</span>
                  <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Bottom Banner */}
        <div className="mt-12 bg-brand-800 text-white rounded-2xl p-6 sm:p-8 shadow-premium flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h4 className="text-lg sm:text-xl font-bold flex items-center justify-center md:justify-start gap-2">
              <Sparkles className="w-5 h-5 text-amber-300" />
              15+ Years of Clinical Aesthetic Trust
            </h4>
            <p className="text-sm text-brand-200">
              Trusted by professionals, business leaders, and celebrities across Delhi NCR & India.
            </p>
          </div>
          <a
            href="#products"
            className="shrink-0 bg-white hover:bg-brand-50 text-brand-800 font-semibold px-6 py-2.5 rounded-xl text-sm transition shadow-sm"
          >
            Shop Award-Winning Systems
          </a>
        </div>

      </div>

      {/* Award Full View Modal */}
      {selectedAward && (
        <div 
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setSelectedAward(null)}
        >
          <div 
            className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-100 animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-16/10 bg-slate-900">
              <img
                src={selectedAward.image}
                alt={selectedAward.alt}
                className="w-full h-full object-contain"
              />
              <button
                onClick={() => setSelectedAward(null)}
                className="absolute top-4 right-4 bg-black/60 hover:bg-black/90 text-white p-2 rounded-full transition"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-600 uppercase tracking-wider">
                <Award className="w-4 h-4 text-amber-500" />
                <span>{selectedAward.year} • {selectedAward.category}</span>
              </div>

              <h3 className="text-2xl font-extrabold text-slate-900">
                {selectedAward.title}
              </h3>

              <div className="bg-brand-50 border border-brand-200 rounded-xl p-3 text-sm font-semibold text-brand-900">
                {selectedAward.presentedBy}
              </div>

              <p className="text-sm text-slate-600 leading-relaxed">
                {selectedAward.description}
              </p>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1.5 text-emerald-600 font-medium">
                  <ShieldCheck className="w-4 h-4" /> Genuine Looks Forever Award Photo
                </span>
                <button
                  onClick={() => setSelectedAward(null)}
                  className="bg-brand-600 hover:bg-brand-700 text-white px-5 py-2 rounded-xl font-medium transition text-xs"
                >
                  Close
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </section>
  );
}
