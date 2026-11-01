import React from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  MessageCircle, 
  ArrowRight,
  Heart,
  Award,
  Zap,
  Scissors,
  Layers,
  Waves
} from 'lucide-react';
import { handleConsultation } from '../utils/whatsapp';

export default function ServicesPage({ onOpenConsultation }) {
  const fixingMethods = [
    {
      id: 'mens',
      category: 'Men’s Hair Replacement',
      title: 'Custom Hair Patches & Toupees',
      description: 'The premier solution for receding hairlines and crown pattern baldness. Crafted with 100% Virgin Remy human hair on ultra-thin Swiss lace or micro-skin bases. Bleached knots provide an undetectable front hairline that mimics natural follicle growth.',
      idealFor: 'Norwood Scale Stage 2 to Stage 7 baldness, receding temples, diffuse crown loss.',
      time: '90 Minutes',
      durability: '8 to 12 Months',
      price: '₹6,000 – ₹18,000',
      features: ['Undetectable front hairline', 'Waterproof & sweat resistant', 'Shampoo and comb normally', 'Swimming & bike helmet safe'],
      image: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 'bonding',
      category: '24/7 Continuous Wear',
      title: 'Hair Bonding (Liquid Bond & Ultra Tape)',
      description: 'Medical-grade bonding procedure that locks your hair system firmly to the scalp perimeter for 3 to 4 weeks continuous wear. You sleep, shower, exercise, and go about daily life without ever having to take the system off.',
      idealFor: 'Clients seeking 24/7 continuous wear with monthly routine studio servicing.',
      time: '60 Minutes',
      durability: '3 to 4 Weeks per bonding session',
      price: '₹1,000 – ₹1,500 / session',
      features: ['Skin-safe dermatological adhesives', 'Resistant to heavy sweat and humidity', 'Shampoo normally 2x a week', 'Zero risk of slippage'],
      image: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 'clipping',
      category: 'Removable Daily Wear',
      title: 'Hair Clipping (Clip-On Systems)',
      description: 'The hair patch is fitted with silicone-coated micro pressure clips that secure directly into your existing side and back hair. Put it on in 30 seconds before heading out and remove it before going to sleep.',
      idealFor: 'Clients who prefer taking the system off at night. Zero monthly maintenance appointments needed.',
      time: '45 Minutes',
      durability: '12 to 16 Months',
      price: '₹6,000 – ₹14,000',
      features: ['Zero scalp shaving required', 'Take on & off at home freely', 'Gentle silicone grip clips', 'Lowest long-term maintenance'],
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 'weaving',
      category: 'Non-Shaving Fixing',
      title: 'Hair Weaving (Track-Based Interlocking)',
      description: 'The hair system is carefully interlocked into subtle micro-braids or tracks made from your existing natural hair. Ideal for clients who have good side and back hair and prefer not to shave their scalp.',
      idealFor: 'Clients who do not want any scalp shaving or liquid adhesives.',
      time: '90 Minutes',
      durability: '4 to 6 Weeks per reset',
      price: '₹1,200 – ₹1,800 / reset',
      features: ['Zero shaving needed', 'No chemical liquid glues', 'Strong mechanical hold', 'Easy monthly re-tightening'],
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 'womens',
      category: 'Women’s Hair Solutions',
      title: 'Crown Silk Toppers & Volumizers',
      description: 'Discreet, featherlight hair additions designed for female pattern hair thinning and widening parting lines. Integrates smoothly with your natural hair using micro-clips or silk tape without needing to shave any existing hair.',
      idealFor: 'Parting line widening, hormonal crown thinning, volume loss.',
      time: '60 Minutes',
      durability: '10 to 14 Months',
      price: '₹8,000 – ₹24,000',
      features: ['Featherlight breathable silk top', 'No shaving required', 'Matches natural hair color & curl', 'Instant volume and bounce'],
      image: 'https://images.unsplash.com/photo-1560869713-7d0a29430803?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 'maintenance',
      category: 'Studio Care',
      title: 'Studio Servicing, Rebonding & Patch Repair',
      description: 'Comprehensive studio maintenance service for any hair system: gentle solvent release, deep shampoo, deep conditioning, knot tightening, hair refilling, and precision re-bonding.',
      idealFor: 'Routine monthly care for all hair patch wearers (even if purchased elsewhere).',
      time: '45 to 60 Minutes',
      durability: 'Monthly service',
      price: '₹1,000 – ₹1,500',
      features: ['Gentle citrus solvent release', 'Deep hair conditioning', 'Tape replacement with Ultra Hold', 'Hair cut & re-blend'],
      image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=800'
    }
  ];

  return (
    <div className="min-h-screen bg-surface-soft pb-16 selection:bg-brand-500 selection:text-white">
      
      {/* Header Banner */}
      <section className="bg-gradient-to-r from-brand-900 via-brand-800 to-slate-900 text-white py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-brand-200 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Studio Hair Fixing Methods</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Six Ways to Put Hair Back
          </h1>

          <p className="text-sm sm:text-base text-brand-200 max-w-2xl leading-relaxed">
            From daily clip-on patches to 24/7 waterproof medical bonding and track weaving. Explore each method, how long it holds, and what it costs.
          </p>
        </div>
      </section>

      {/* Fixing Methods List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {fixingMethods.map((method) => (
            <div 
              key={method.id} 
              id={method.id}
              className="bg-white rounded-3xl overflow-hidden shadow-card border border-slate-200/80 flex flex-col justify-between hover:border-brand-300 transition"
            >
              <div>
                <div className="aspect-[16/9] w-full overflow-hidden bg-slate-100 relative">
                  <img 
                    src={method.image} 
                    alt={method.title} 
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 bg-brand-900/90 text-white text-[11px] font-bold px-3 py-1 rounded-full backdrop-blur-md border border-white/20">
                    {method.category}
                  </div>
                </div>

                <div className="p-6 sm:p-8 space-y-4">
                  <div className="space-y-1">
                    <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                      {method.title}
                    </h2>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {method.description}
                    </p>
                  </div>

                  {/* Quick specs */}
                  <div className="grid grid-cols-3 gap-2 bg-slate-50 rounded-2xl p-3 border border-slate-100 text-xs text-center">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Fitting</span>
                      <strong className="text-slate-900 font-extrabold">{method.time}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Hold / Life</span>
                      <strong className="text-emerald-700 font-extrabold">{method.durability.split(' ')[0]} {method.durability.split(' ')[1]}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Rate</span>
                      <strong className="text-brand-700 font-extrabold">{method.price.split(' ')[0]}</strong>
                    </div>
                  </div>

                  {/* Bullet points */}
                  <div className="space-y-1.5 pt-1">
                    {method.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="p-6 sm:p-8 pt-0">
                <button
                  onClick={() => onOpenConsultation(method.title)}
                  className="w-full py-3 rounded-xl bg-slate-900 hover:bg-brand-600 text-white font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-sm"
                >
                  <Calendar className="w-4 h-4 text-brand-300" />
                  <span>Book Free Fitting for This Method</span>
                </button>
              </div>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
