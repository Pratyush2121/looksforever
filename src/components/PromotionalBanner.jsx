import React from 'react';
import { MessageCircle, ShieldCheck, Sparkles, PhoneCall, CheckCircle } from 'lucide-react';
import { handleConsultation } from '../utils/whatsapp';

export default function PromotionalBanner({ bannerData = null }) {
  if (bannerData && bannerData.enabled === false) {
    return null;
  }

  const tag = bannerData?.tag || "Personalized Fitting Assistance";
  const title = bannerData?.title || "Not sure about your base size, curvature, or hair density?";
  const subtitle = bannerData?.subtitle || "Send a quick photo of your scalp or thinning area on WhatsApp. Our certified trichology technicians will recommend the exact patch size, hairline design, and bonding routine tailored for you.";
  const ctaText = bannerData?.ctaText || "Chat on WhatsApp Now";
  const ctaLink = bannerData?.ctaLink;

  const handleClick = () => {
    if (ctaLink) {
      window.open(ctaLink, '_blank', 'noopener,noreferrer');
    } else {
      handleConsultation('Scalp Photo Analysis & Sizing Recommendation');
    }
  };

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="relative rounded-3xl overflow-hidden brand-gradient text-white p-6 sm:p-12 shadow-premium">
          
          {/* Subtle graphic background overlays */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-400/20 rounded-full blur-xl pointer-events-none -ml-10 -mb-10"></div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-brand-100 text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>{tag}</span>
              </div>

              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
                {title}
              </h3>

              <p className="text-brand-100 text-xs sm:text-base max-w-2xl leading-relaxed">
                {subtitle}
              </p>

              <div className="pt-2 flex flex-wrap gap-4 text-xs font-medium text-brand-200">
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-400" /> 100% Confidential Consultation
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-400" /> Free Shade Matching
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-400" /> No Obligation to Purchase
                </span>
              </div>
            </div>

            {/* Right Action */}
            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col items-center lg:items-end justify-center gap-3">
              <button
                onClick={handleClick}
                className="w-full sm:w-auto lg:w-full bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white font-bold py-3.5 px-6 rounded-2xl text-xs sm:text-sm transition shadow-lg flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
              >
                <MessageCircle className="w-5 h-5 shrink-0" />
                <span>{ctaText}</span>
              </button>

              <div className="text-xs text-brand-200 text-center lg:text-right">
                Average reply time: <strong className="text-white">Under 15 minutes</strong>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
