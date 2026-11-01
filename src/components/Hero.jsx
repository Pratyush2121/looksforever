import React from 'react';
import { 
  Sparkles, 
  MessageCircle, 
  ArrowRight, 
  ShieldCheck, 
  Star, 
  CheckCircle2, 
  Clock,
  Waves,
  Calendar,
  MapPin,
  ChevronRight,
  Flame,
  PhoneCall
} from 'lucide-react';
import { handleBuyNow, handleConsultation } from '../utils/whatsapp';
import { PRODUCTS } from '../config/siteConfig';
import { resolveImageUrl } from '../services/imageService';

export default function Hero({ 
  onExploreClick, 
  onQuickView, 
  onBookConsultation,
  heroData = null 
}) {
  const heroProduct = PRODUCTS[0];

  const badgeText = heroData?.badgeText || "Wave Mall Sector 18, Noida • In-Studio Fittings Open Today";
  const title = heroData?.title || "Get your hair back in one visit";
  const subtitle = heroData?.subtitle || "A dedicated hair replacement & styling studio in Wave Mall Noida — not a sales floor and not a surgical clinic. Walk in with thinning hair, walk out 90 minutes later with an undetectable, natural human hair system. Shower in it, swim in it, sleep in it.";
  const displayHeroImage = resolveImageUrl(heroData?.heroImage || heroProduct.image);

  return (
    <section id="home" className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-white pt-10 pb-16 lg:pt-16 lg:pb-24 border-b border-slate-200/70 selection:bg-brand-500 selection:text-white">
      
      {/* Ambient Luxury Background Lights & Subtle Pattern */}
      <div className="absolute inset-0 bg-dot-pattern opacity-40 pointer-events-none"></div>
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-brand-200/20 rounded-full blur-3xl pointer-events-none -mt-40"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Hero Column (7 cols) */}
          <div className="lg:col-span-7 space-y-7 text-center lg:text-left">
            
            {/* Live Studio Availability Pill */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/90 border border-slate-200 shadow-xs backdrop-blur-md text-slate-800 text-xs font-semibold">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <MapPin className="w-3.5 h-3.5 text-brand-600" />
              <span>{badgeText}</span>
            </div>

            {/* Editorial Title */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-slate-950 tracking-tight leading-[1.08] font-display">
              Get your hair back in{' '}
              <span className="relative whitespace-nowrap">
                <span className="bg-gradient-to-r from-brand-600 via-brand-500 to-blue-600 bg-clip-text text-transparent">
                  one visit
                </span>
                <svg 
                  className="absolute left-0 -bottom-2 w-full h-3 text-brand-300/60 -z-10" 
                  viewBox="0 0 100 20" 
                  preserveAspectRatio="none"
                >
                  <path d="M0,15 Q50,0 100,15" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
                </svg>
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              {subtitle}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-1">
              <button
                onClick={onBookConsultation}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white font-bold px-7 py-4 rounded-2xl text-sm shadow-md hover:shadow-xl hover:shadow-brand-600/25 transition-all transform hover:-translate-y-0.5 tracking-wide"
              >
                <Calendar className="w-4 h-4 text-brand-200" />
                <span>Book a Free Fitting</span>
              </button>

              <button
                onClick={() => {
                  const el = document.getElementById('price-calculator');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-800 font-bold px-6 py-4 rounded-2xl text-sm shadow-xs border border-slate-300 hover:border-slate-400 transition-all transform hover:-translate-y-0.5"
              >
                <span>Price Your System</span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => handleConsultation('Fitting Inquiry from Hero')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-4 rounded-2xl text-sm shadow-md hover:shadow-lg transition-all"
                title="Direct WhatsApp Consultation"
              >
                <MessageCircle className="w-4 h-4" />
                <span className="hidden sm:inline">WhatsApp</span>
              </button>
            </div>

            {/* 4-Item Minimalist Metric Bar */}
            <div className="pt-8 border-t border-slate-200/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 font-display">
                  <Clock className="w-3.5 h-3.5 text-brand-600" />
                  <span>90 Minutes</span>
                </div>
                <p className="text-[11px] text-slate-500">In-chair transformation</p>
              </div>

              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 font-display">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>0% Surgery</span>
                </div>
                <p className="text-[11px] text-slate-500">No incisions or scars</p>
              </div>

              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 font-display">
                  <Waves className="w-3.5 h-3.5 text-blue-600" />
                  <span>Waterproof</span>
                </div>
                <p className="text-[11px] text-slate-500">Shower & swim freely</p>
              </div>

              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 font-display">
                  <ShieldCheck className="w-3.5 h-3.5 text-brand-600" />
                  <span>Norwood 1–7</span>
                </div>
                <p className="text-[11px] text-slate-500">All stages covered</p>
              </div>
            </div>

          </div>

          {/* Right Hero Column: Luxury Showcase Card (5 cols) */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Subtle back ambient glow */}
              <div className="absolute inset-0 bg-gradient-to-tr from-brand-600/20 to-blue-400/20 rounded-[32px] blur-2xl transform scale-105"></div>

              {/* Luxury Card Box */}
              <div className="relative bg-white/95 rounded-[32px] p-5 sm:p-6 shadow-2xl border border-slate-200/90 backdrop-blur-xl space-y-5">
                
                {/* Image and Badges */}
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 group shadow-inner">
                  <img
                    src={displayHeroImage}
                    alt={heroProduct.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/brand/logo-cropped.png';
                    }}
                  />
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    <span className="bg-slate-950 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-md tracking-wide">
                      Studio Signature Fit
                    </span>
                    <span className="bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow">
                      {heroProduct.discount || '28% OFF'}
                    </span>
                  </div>

                  <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-md flex items-center gap-1.5 text-xs font-bold text-slate-900">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>4.9 / 5.0</span>
                    <span className="text-slate-400 font-normal">({heroProduct.reviewCount || 48}+ clients)</span>
                  </div>
                </div>

                {/* System Specs & Price */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-brand-600">
                      100% Virgin Remy Human Hair
                    </span>
                    <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Ready in Studio
                    </span>
                  </div>

                  <h3 className="font-extrabold text-slate-900 text-lg sm:text-xl hover:text-brand-600 transition line-clamp-1 font-display">
                    {heroProduct.name}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    Invisible French lace front with thin poly skin sides. Breathable, featherlight, and easiest to tape and clean.
                  </p>

                  <div className="flex items-baseline gap-2.5 pt-1">
                    <span className="text-2xl sm:text-3xl font-black text-slate-950 font-display">
                      ₹{heroProduct.price.toLocaleString('en-IN')}
                    </span>
                    {heroProduct.originalPrice && (
                      <span className="text-xs sm:text-sm text-slate-400 line-through">
                        ₹{heroProduct.originalPrice.toLocaleString('en-IN')}
                      </span>
                    )}
                    <span className="text-xs text-slate-500 font-medium">
                      (Includes custom sizing, haircut & fitting)
                    </span>
                  </div>
                </div>

                {/* Action Row */}
                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => onQuickView(heroProduct)}
                    className="w-full bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold py-3 px-3 rounded-xl text-xs transition border border-slate-200 text-center"
                  >
                    System Specs
                  </button>

                  <button
                    onClick={() => handleBuyNow(heroProduct, 1, { "Base Size": "8 x 6 inches", "Hair Color": "Natural Black #1B" })}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-3 rounded-xl text-xs transition flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Order on WhatsApp</span>
                  </button>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
