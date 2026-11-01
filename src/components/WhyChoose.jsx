import React from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  Award, 
  UserCheck, 
  HeartHandshake, 
  MessageCircle,
  Clock,
  CheckCircle2
} from 'lucide-react';

const DEFAULT_BENEFITS = [
  {
    iconName: 'Sparkles',
    title: '100% Natural Remy Human Hair',
    description: 'Every hair patch is woven with premium, virgin human hair that mirrors natural growth, density, and natural flow.'
  },
  {
    iconName: 'ShieldCheck',
    title: 'Ultra-Thin Breathable Swiss Lace',
    description: 'Invisible front hairlines crafted on featherlight French & Swiss lace bases for maximum scalp comfort in all weather.'
  },
  {
    iconName: 'CheckCircle2',
    title: 'Waterproof & Sweat-Resistant Hold',
    description: 'Swim, shower, workout, and helmet-ride without anxiety. Secured with medical-grade dermatologically certified adhesives.'
  },
  {
    iconName: 'Award',
    title: 'Custom In-Clinic Styling & Fitting',
    description: 'Award-winning styling experts tailor texture, cut, and blend directly to your existing hair at our Wave Mall Noida clinic.'
  }
];

const ICON_MAP = {
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Award,
  UserCheck,
  HeartHandshake,
  MessageCircle,
  Clock
};

export default function WhyChoose({ 
  items = DEFAULT_BENEFITS, 
  title = "Why Choose Looks Forever", 
  subtitle = "Dedicated to helping you regain your confidence with high-quality non-surgical hair solutions and personalized care." 
}) {
  const displayItems = items && items.length > 0 ? items : DEFAULT_BENEFITS;

  return (
    <section id="why-us" className="py-12 sm:py-16 bg-surface-soft border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12 space-y-2">
          <span className="text-xs font-bold text-brand-600 uppercase tracking-widest font-display">
            Aesthetic Trust & Reliability
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-display">
            {title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            {subtitle}
          </p>
        </div>

        {/* 4 Cards Grid: 1 col on mobile, 2 on tablet, 4 on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {displayItems.map((item, index) => {
            const IconComponent = ICON_MAP[item.iconName] || ShieldCheck;
            return (
              <div 
                key={index}
                className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-subtle hover:shadow-premium transition-all duration-300 transform hover:-translate-y-1 space-y-3"
              >
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center border border-brand-100">
                  <IconComponent className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug font-display">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

