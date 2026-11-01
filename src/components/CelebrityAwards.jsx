import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Award, Star, ExternalLink, ShieldCheck, X, Sparkles, ChevronRight } from 'lucide-react';
import { CELEBRITY_AWARDS } from '../config/siteConfig';

export default function CelebrityAwards({ awards = null }) {
  const [selectedAward, setSelectedAward] = useState(null);
  const awardList = awards && awards.length > 0 ? awards : CELEBRITY_AWARDS;

  return (
    <section id="awards" className="py-16 sm:py-24 bg-gradient-to-b from-white via-brand-50/40 to-white relative overflow-hidden border-b border-slate-200/80">
      
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-brand-100/30 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 border border-amber-200 text-amber-900 text-xs font-bold uppercase tracking-wider font-display">
            <Award className="w-4 h-4 text-amber-600" />
            Celebrity Endorsements & National Accolades
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-950 tracking-tight font-display">
            Recognized by India's Top Celebrities & Icons
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Looks Forever has been honored on prestigious national and international stages by India's most celebrated Bollywood icons for pioneering excellence in hair system craft and non-surgical hairline restoration.
          </p>
        </div>

        {/* Awards Grid - Real 6 Awards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {awardList.map((award) => (
            <div
              key={award.id}
              onClick={() => setSelectedAward(award)}
              className="group bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-card hover:shadow-hover hover:border-brand-400 transition-all duration-300 transform hover:-translate-y-1 flex flex-col cursor-pointer"
            >
              {/* Award Image Container */}
              <div className="relative aspect-4/3 overflow-hidden bg-slate-950">
                <img
                  src={award.image}
                  alt={award.alt || award.title}
                  className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                
                {/* Year / Stage Tag */}
                <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full border border-white/20 font-display">
                  {award.year}
                </div>

                {/* Quick inspect overlay button */}
                <div className="absolute inset-0 bg-brand-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="bg-white text-slate-900 text-xs font-bold px-3.5 py-2 rounded-full shadow-lg flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform font-display">
                    <ExternalLink className="w-3.5 h-3.5 text-brand-600" />
                    View Award Details
                  </span>
                </div>
              </div>

              {/* Award Description */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-1.5 flex items-center gap-1 font-display">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    {award.category}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-600 transition font-display">
                    {award.title}
                  </h3>
                  <p className="text-xs font-bold text-brand-700 mt-1 font-display">
                    {award.presentedBy}
                  </p>
                  <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                    {award.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-brand-600 font-bold font-display">
                  <span>Verified National Honor</span>
                  <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Bottom Banner */}
        <div className="mt-14 bg-gradient-to-r from-brand-900 via-brand-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-card flex flex-col md:flex-row items-center justify-between gap-6 border border-brand-700/50">
          <div className="space-y-1 text-center md:text-left">
            <h4 className="text-lg sm:text-xl font-bold flex items-center justify-center md:justify-start gap-2 font-display">
              <Sparkles className="w-5 h-5 text-amber-400" />
              15+ Years of Hair Replacement Craftsmanship
            </h4>
            <p className="text-xs sm:text-sm text-brand-200">
              Trusted by 12,000+ professionals, business leaders, and celebrities across Delhi NCR & India.
            </p>
          </div>
          <Link
            to="/products"
            className="shrink-0 bg-white hover:bg-brand-50 text-brand-800 font-bold px-6 py-3 rounded-xl text-xs uppercase tracking-wider transition shadow-sm font-display"
          >
            Shop Award-Winning Systems
          </Link>
        </div>

      </div>

      {/* Award Full View Modal */}
      {selectedAward && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setSelectedAward(null)}
        >
          <div 
            className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-100 animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-16/10 bg-slate-950">
              <img
                src={selectedAward.image}
                alt={selectedAward.alt || selectedAward.title}
                className="w-full h-full object-contain"
              />
              <button
                onClick={() => setSelectedAward(null)}
                className="absolute top-4 right-4 bg-black/60 hover:bg-black/90 text-white p-2.5 rounded-full transition"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-600 uppercase tracking-wider font-display">
                <Award className="w-4 h-4 text-amber-500" />
                <span>{selectedAward.year} • {selectedAward.category}</span>
              </div>

              <h3 className="text-2xl font-extrabold text-slate-900 font-display">
                {selectedAward.title}
              </h3>

              <div className="bg-brand-50 border border-brand-200 rounded-xl p-3.5 text-xs sm:text-sm font-bold text-brand-900 font-display">
                {selectedAward.presentedBy}
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {selectedAward.description}
              </p>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1.5 text-emerald-600 font-bold">
                  <ShieldCheck className="w-4 h-4" /> Genuine Looks Forever Award Photo
                </span>
                <button
                  onClick={() => setSelectedAward(null)}
                  className="bg-brand-600 hover:bg-brand-700 text-white px-5 py-2.5 rounded-xl font-bold transition text-xs font-display"
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
