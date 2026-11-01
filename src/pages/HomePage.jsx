import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import WhyChoose from '../components/WhyChoose';
import ProductCard from '../components/ProductCard';
import { 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  Calendar, 
  Phone, 
  MessageCircle, 
  ArrowRight, 
  Star, 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  Waves,
  Scissors,
  Check,
  X as CloseIcon,
  MapPin,
  Flame,
  Layers,
  ArrowUpRight,
  Smile,
  Zap,
  Tag
} from 'lucide-react';
import { handleConsultation } from '../utils/whatsapp';

export default function HomePage({
  products = [],
  homepageSettings = null,
  onQuickView,
  onAddToCart,
  onToggleWishlist,
  wishlistIds = [],
  cartItemIds = [],
  onOpenConsultation
}) {
  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  // Before & After Active Case
  const [activeBeforeAfter, setActiveBeforeAfter] = useState(0);

  // Interactive System Cost Estimator State
  const [calcArea, setCalcArea] = useState('crown'); // 'crown' | 'front_crown' | 'full_top'
  const [calcBase, setCalcBase] = useState('lace'); // 'synthetic' | 'human_mono' | 'lace' | 'skin' | 'bio'
  const [calcMethod, setCalcMethod] = useState('bonding'); // 'bonding' | 'clips' | 'weaving'

  // Calculator price logic based on real Delhi NCR / Noida studio standards
  const calculateEstimate = () => {
    let basePriceMin = 6000;
    let basePriceMax = 12000;
    let lifespan = '8 to 12 months';
    let baseName = 'Fine Swiss / French Lace';

    if (calcBase === 'synthetic') {
      basePriceMin = 3500;
      basePriceMax = 7000;
      lifespan = '4 to 6 months';
      baseName = 'Machine-Made Synthetic Net';
    } else if (calcBase === 'human_mono') {
      basePriceMin = 6000;
      basePriceMax = 12000;
      lifespan = '10 to 14 months';
      baseName = 'Standard Monofilament Human Hair';
    } else if (calcBase === 'lace') {
      basePriceMin = 10000;
      basePriceMax = 18000;
      lifespan = '6 to 10 months';
      baseName = 'Fine Swiss / French Lace (Invisible Front)';
    } else if (calcBase === 'skin') {
      basePriceMin = 12000;
      basePriceMax = 20000;
      lifespan = '8 to 12 months';
      baseName = 'Ultra-Thin Micro Poly Skin';
    } else if (calcBase === 'bio') {
      basePriceMin = 15000;
      basePriceMax = 28000;
      lifespan = '12 to 18 months';
      baseName = 'Custom Bio-Hybrid (Lace Front + Skin Perimeter)';
    }

    let areaMultiplier = 1.0;
    let areaLabel = 'Crown Vertex Only';
    if (calcArea === 'front_crown') {
      areaMultiplier = 1.25;
      areaLabel = 'Receding Frontal + Crown';
    } else if (calcArea === 'full_top') {
      areaMultiplier = 1.45;
      areaLabel = 'Full Top Coverage (Norwood 5-7)';
    }

    const finalMin = Math.round((basePriceMin * areaMultiplier) / 500) * 500;
    const finalMax = Math.round((basePriceMax * areaMultiplier) / 500) * 500;

    return {
      priceRange: `₹${finalMin.toLocaleString('en-IN')} – ₹${finalMax.toLocaleString('en-IN')}`,
      lifespan,
      baseName,
      areaLabel,
      methodLabel: calcMethod === 'bonding' ? 'Semi-Permanent Medical Bonding (3-4 weeks hold)' : calcMethod === 'clips' ? 'Clip-On Removable (Daily wear)' : 'Hair Weaving (Track-based)',
      fitTime: '90 Minutes'
    };
  };

  const currentEstimate = calculateEstimate();

  // 4 Featured Products for Homepage
  const featuredProducts = products.filter(p => p.featured || p.isBestseller).slice(0, 4).length > 0
    ? products.filter(p => p.featured || p.isBestseller).slice(0, 4)
    : products.slice(0, 4);

  const beforeAfterCases = [
    {
      title: 'Norwood Stage 5 Pattern Baldness',
      solution: 'Mirage Swiss Lace Hair System (Natural Black #1B)',
      client: 'Rahul S., 34, Software Architect (Indirapuram)',
      beforeDesc: 'Receding frontal hairline and prominent crown thinning for 4 years.',
      afterDesc: 'Undetectable hairline restored in 90 minutes. Can swim, workout, and comb backwards freely.',
      beforeImg: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600',
      afterImg: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=600'
    },
    {
      title: 'Crown Vertex Thinning & Diffuse Loss',
      solution: 'Ultra-Thin Micro Skin Toupee',
      client: 'Amit K., 42, Business Director (Noida Sector 62)',
      beforeDesc: 'Wide thinning crown, hesitant about invasive surgical transplants with patchy outcomes.',
      afterDesc: 'Full crown density blended with his natural side grey streaks. Sleep, shower, and bike-safe.',
      beforeImg: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=600',
      afterImg: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=600'
    }
  ];

  const sixWays = [
    {
      number: '01',
      title: 'Custom Hair Patch',
      badge: 'Most Popular',
      desc: 'Precision-crafted human hair unit covering frontal recession or crown baldness. Undetectable bleached knots on lace or micro-skin.',
      fitTime: '90 Mins',
      price: '₹6,000 to ₹16,000',
      lifespan: '8 to 12 Months',
      method: 'Bonding or Clips'
    },
    {
      number: '02',
      title: 'Non-Surgical Hair Replacement',
      badge: 'Full Top Coverage',
      desc: 'Complete scalp coverage for advanced hair loss where standard styling is no longer possible. Restores full natural density instantly.',
      fitTime: '2 Hours',
      price: '₹12,000 to ₹22,000',
      lifespan: '10 to 14 Months',
      method: 'Semi-Permanent Bond'
    },
    {
      number: '03',
      title: 'Hair Bonding (24/7 Wear)',
      badge: 'Continuous Wear',
      desc: 'Medical-grade dermatological bonding to the perimeter. Holds securely for 3 to 4 weeks 24/7. Sleep, shampoo, and gym like real hair.',
      fitTime: '60 Mins',
      price: '₹1,000 to ₹1,500 / service',
      lifespan: 'Routine 3-4 week cycle',
      method: 'Liquid Bond & Ultra Tape'
    },
    {
      number: '04',
      title: 'Hair Clipping (Daily Removable)',
      badge: 'Zero Maintenance',
      desc: 'Attached with micro-grip silicone clips. Put it on in 30 seconds before going out and take it off at night. Zero salon visits required.',
      fitTime: '45 Mins',
      price: '₹6,000 to ₹14,000',
      lifespan: '12 to 16 Months',
      method: 'Pressure Clips'
    },
    {
      number: '05',
      title: 'Hair Weaving (Track-Based)',
      badge: 'Zero Shaving',
      desc: 'The hair system is carefully interlocked into micro-tracks crafted from your existing natural hair. Ideal if you do not want scalp shaving.',
      fitTime: '90 Mins',
      price: '₹1,200 to ₹1,800 / service',
      lifespan: '4 to 6 weeks per reset',
      method: 'Track Weaving'
    },
    {
      number: '06',
      title: 'Women’s Silk Toppers & Wigs',
      badge: 'Featherlight Volume',
      desc: 'Silk-base parting additions and volumizers designed for female pattern hair thinning and widening parting lines. Zero shaving needed.',
      fitTime: '60 Mins',
      price: '₹8,000 to ₹24,000',
      lifespan: '12 to 18 Months',
      method: 'Clips or Silk Tape'
    }
  ];

  const pricingTable = [
    {
      type: 'Synthetic Hair Patch',
      price: '₹3,500 – ₹7,000',
      base: 'Machine-made net',
      lasts: '4 to 6 months',
      bestFor: 'A first trial, or an affordable spare unit while your main system is serviced.'
    },
    {
      type: 'Human Hair Patch (Mono)',
      tag: 'Most Chosen',
      price: '₹6,000 – ₹12,000',
      base: 'Mono filament mesh',
      lasts: '8 to 12 months',
      bestFor: 'The most popular choice. Looks and behaves like your own hair, takes heat styling.'
    },
    {
      type: 'Swiss / French Lace System',
      price: '₹10,000 – ₹18,000',
      base: 'Breathable Swiss lace',
      lasts: '6 to 10 months',
      bestFor: 'The most natural, undetectable front hairline. Porous mesh ideal for Indian summers.'
    },
    {
      type: 'Thin Skin / Poly Toupee',
      price: '₹12,000 – ₹20,000',
      base: 'Ultra-thin polyurethane',
      lasts: '8 to 12 months',
      bestFor: 'A seamless, scalp-like finish. Extremely easy to clean old tape and rebond at home.'
    },
    {
      type: 'Bio-Hybrid Hair System',
      price: '₹15,000 – ₹28,000',
      base: 'Hybrid lace + PU sides',
      lasts: '12 to 18 months',
      bestFor: 'Our premium tier. Combines an invisible lace front with durable poly skin perimeter.'
    }
  ];

  const faqs = [
    {
      q: 'Can anyone tell that I am wearing a hair patch or system?',
      a: 'No. We use fine French and Swiss lace bases where individual Remy human hairs are hand-tied with bleached knots. The hair appears to grow directly out of your scalp, making it undetectable even under direct sun or when running fingers through it.'
    },
    {
      q: 'Can I shower, swim, workout, and wear motorcycle helmets?',
      a: 'Yes, 100%. Once a system is bonded with medical-grade adhesives (such as Ultra Hold), the bond forms a waterproof seal. You can take hot showers, swim in pools, sweat heavily during gym workouts, and wear tight bike helmets without any risk of slipping.'
    },
    {
      q: 'How does this compare to a surgical hair transplant?',
      a: 'A transplant requires surgical cutting, takes 9 to 12 months for tentative growth, requires good donor hair, and cannot treat advanced baldness (Norwood 6 or 7). A hair system gives you full density in just 90 minutes, requires zero surgery, is completely reversible, and costs a fraction of surgery.'
    },
    {
      q: 'How often do I need servicing or rebonding?',
      a: 'If you choose continuous wear (hair bonding), you visit our studio once every 3 to 4 weeks. We gently remove the system with citrus solvent, exfoliate the scalp, wash and condition the hair unit, apply fresh medical tape, and rebond it. The service takes about 45 minutes.'
    },
    {
      q: 'Do you charge for the first consultation or scalp measurement?',
      a: 'No. The first visit is 100% free with zero obligation. You can walk in, have your scalp checked, touch and feel different lace and skin bases, and see a system placed on your head before spending a single rupee.'
    }
  ];

  return (
    <div className="space-y-0 selection:bg-brand-500 selection:text-white">
      
      {/* 1. Hero Section (Elevated Luxury Studio Presentation) */}
      <Hero
        heroData={homepageSettings?.hero}
        onExploreClick={() => {
          const el = document.getElementById('featured-systems');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onQuickView={onQuickView}
        onBookConsultation={onOpenConsultation}
      />

      {/* 2. What the First Visit Covers (Dark Luxury Transparency) */}
      <section className="py-14 sm:py-16 bg-slate-950 text-white border-b border-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-radial-studio opacity-15 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-2xl mb-10 space-y-1.5">
            <span className="text-xs font-bold text-brand-400 uppercase tracking-widest font-display">
              Zero Pressure • Complete Transparency
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white font-display">
              What the first visit covers
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-slate-900/70 rounded-3xl p-6 sm:p-7 border border-slate-800 backdrop-blur-md space-y-3.5 hover:border-slate-700 transition">
              <div className="w-11 h-11 rounded-2xl bg-brand-500/15 border border-brand-500/30 text-brand-300 flex items-center justify-center font-black text-sm font-display">
                01
              </div>
              <h3 className="font-bold text-white text-base font-display">Scalp & Loss Check</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                We measure the thinning area, check your remaining hair density, and examine scalp curvature.
              </p>
            </div>

            <div className="bg-slate-900/70 rounded-3xl p-6 sm:p-7 border border-slate-800 backdrop-blur-md space-y-3.5 hover:border-slate-700 transition">
              <div className="w-11 h-11 rounded-2xl bg-brand-500/15 border border-brand-500/30 text-brand-300 flex items-center justify-center font-black text-sm font-display">
                02
              </div>
              <h3 className="font-bold text-white text-base font-display">Colour & Texture Match</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                We match your natural hair tone (#1B, deep brown, grey percentage) and wave pattern for an invisible blend.
              </p>
            </div>

            <div className="bg-slate-900/70 rounded-3xl p-6 sm:p-7 border border-slate-800 backdrop-blur-md space-y-3.5 hover:border-slate-700 transition">
              <div className="w-11 h-11 rounded-2xl bg-brand-500/15 border border-brand-500/30 text-brand-300 flex items-center justify-center font-black text-sm font-display">
                03
              </div>
              <h3 className="font-bold text-white text-base font-display">Try a System On</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Place different systems against your hairline to feel the weight, breathability, and see the front look.
              </p>
            </div>

            <div className="bg-slate-900/70 rounded-3xl p-6 sm:p-7 border border-slate-800 backdrop-blur-md space-y-3.5 hover:border-slate-700 transition">
              <div className="w-11 h-11 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 flex items-center justify-center font-black text-sm font-display">
                04
              </div>
              <h3 className="font-bold text-white text-base font-display">Every Price Upfront</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                We quote you the exact cost before any work begins. No hidden charges, no high-pressure tactics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Results Today, Not in Eight Months (Hair System vs Hair Transplant) */}
      <section className="py-16 sm:py-24 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-2">
            <span className="text-xs font-bold text-brand-600 uppercase tracking-widest font-display">
              Instant Hair vs Surgery
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-950 tracking-tight font-display">
              Results today, not in eight months
            </h2>
            <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              A transplant redistributes the hair you still have and takes most of a year to show. A system adds the hair you no longer have, and it is finished before you leave the chair.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
            
            {/* Non-Surgical Hair System Card */}
            <div className="bg-gradient-to-br from-brand-50/50 via-white to-white rounded-3xl p-7 sm:p-9 border-2 border-brand-500 shadow-xl space-y-6 flex flex-col justify-between relative overflow-hidden">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-600 text-white text-xs font-bold uppercase tracking-wider font-display">
                  <Sparkles className="w-3.5 h-3.5 text-accent-cyan" />
                  <span>Looks Forever Hair System</span>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3.5">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-4 h-4 font-bold" />
                    </div>
                    <div>
                      <strong className="block text-slate-900 text-sm font-display">Full Hair in 90 Minutes</strong>
                      <p className="text-xs text-slate-500 leading-relaxed">Walk in with thinning hair, walk out the same afternoon with a full head of hair.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-4 h-4 font-bold" />
                    </div>
                    <div>
                      <strong className="block text-slate-900 text-sm font-display">Works at Any Norwood Stage</strong>
                      <p className="text-xs text-slate-500 leading-relaxed">Works even on advanced stage 6 or 7 baldness where surgery is clinically impossible.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-4 h-4 font-bold" />
                    </div>
                    <div>
                      <strong className="block text-slate-900 text-sm font-display">100% Reversible & Pain-Free</strong>
                      <p className="text-xs text-slate-500 leading-relaxed">Zero anaesthetic, zero incisions, zero scalp scars, zero downtime.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-4 h-4 font-bold" />
                    </div>
                    <div>
                      <strong className="block text-slate-900 text-sm font-display">Honest Upfront Cost</strong>
                      <p className="text-xs text-slate-500 leading-relaxed">Starts from ₹6,000 to ₹18,000 fitted — a fraction of the cost of surgery.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={onOpenConsultation}
                  className="w-full py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-brand-600/25"
                >
                  Book Your 90-Min Transformation
                </button>
              </div>
            </div>

            {/* Surgical Hair Transplant Card */}
            <div className="bg-slate-50/80 rounded-3xl p-7 sm:p-9 border border-slate-200/90 space-y-6 flex flex-col justify-between">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider font-display">
                  <span>Surgical Hair Transplant</span>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3.5">
                    <div className="w-6 h-6 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 mt-0.5">
                      <CloseIcon className="w-4 h-4 font-bold" />
                    </div>
                    <div>
                      <strong className="block text-slate-900 text-sm font-display">Takes 9 to 12 Months</strong>
                      <p className="text-xs text-slate-500 leading-relaxed">Requires waiting months through shedding shock loss just to see tentative growth.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-6 h-6 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 mt-0.5">
                      <CloseIcon className="w-4 h-4 font-bold" />
                    </div>
                    <div>
                      <strong className="block text-slate-900 text-sm font-display">Limited by Donor Area</strong>
                      <p className="text-xs text-slate-500 leading-relaxed">If your back and sides are weak or thinning, surgery cannot provide dense coverage.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-6 h-6 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 mt-0.5">
                      <CloseIcon className="w-4 h-4 font-bold" />
                    </div>
                    <div>
                      <strong className="block text-slate-900 text-sm font-display">Invasive Surgery & Scarring</strong>
                      <p className="text-xs text-slate-500 leading-relaxed">Involves needles, anaesthetic, scalp incisions, and permanent dot or strip scars.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-6 h-6 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 mt-0.5">
                      <CloseIcon className="w-4 h-4 font-bold" />
                    </div>
                    <div>
                      <strong className="block text-slate-900 text-sm font-display">Extremely Expensive</strong>
                      <p className="text-xs text-slate-500 leading-relaxed">Often costs ₹70,000 to ₹2,50,000+ with unpredictable or patchy results.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2 text-center">
                <span className="text-[11px] text-slate-400 font-medium">
                  We specialize 100% in non-surgical solutions that guarantee density today.
                </span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. Six Ways to Put Hair Back (The Studio Fixing Methods) */}
      <section className="py-16 sm:py-24 bg-surface-soft border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-2">
            <span className="text-xs font-bold text-brand-600 uppercase tracking-widest font-display">
              Real Studio Solutions
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-950 tracking-tight font-display">
              Six ways to put hair back
            </h2>
            <p className="text-slate-500 text-sm sm:text-base">
              Different patterns of hair loss require different answers. Here is what each option actually involves and what it costs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sixWays.map((way, idx) => (
              <div 
                key={idx}
                className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-slate-200/80 hover:border-brand-400 hover:shadow-hover transition-all space-y-5 flex flex-col justify-between"
              >
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-2.5 py-1 rounded-lg border border-brand-100 font-display">
                      {way.badge}
                    </span>
                    <span className="text-xs text-slate-400 font-bold font-display">{way.fitTime}</span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 font-display">
                    {way.title}
                  </h3>

                  <p className="text-xs text-slate-500 leading-relaxed">
                    {way.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs text-slate-400 font-medium">Price range:</span>
                    <span className="text-sm font-extrabold text-slate-900 font-display">{way.price}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Durability:</span>
                    <span className="font-semibold text-slate-700">{way.lifespan}</span>
                  </div>
                  <button
                    onClick={() => handleConsultation(`Inquiry for ${way.title}`)}
                    className="w-full py-2.5 px-3 rounded-xl bg-slate-50 hover:bg-brand-50 hover:text-brand-700 text-slate-700 font-bold text-xs transition flex items-center justify-center gap-1.5 border border-slate-200 hover:border-brand-300"
                  >
                    <span>Inquire this method</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 5. Interactive System Cost Estimator (Price Your Own System) */}
      <section id="price-calculator" className="py-16 sm:py-24 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-2">
            <span className="text-xs font-bold text-brand-600 uppercase tracking-widest font-display">
              Live Studio Estimator
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-950 tracking-tight font-display">
              Price your own system
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Choose the area you need covered and the base you prefer. The figures update live based on real Noida & Delhi NCR studio rates.
            </p>
          </div>

          <div className="max-w-4xl mx-auto bg-slate-50 rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-card">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Left Controls (7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* 1. Loss Area */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider font-display">
                    1. How much area are you covering?
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setCalcArea('crown')}
                      className={`p-3 rounded-xl text-left border text-xs font-bold transition ${
                        calcArea === 'crown'
                          ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-brand-300'
                      }`}
                    >
                      <div className="font-extrabold font-display">Crown Only</div>
                      <div className="text-[10px] opacity-80 mt-0.5">Top vertex patch</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setCalcArea('front_crown')}
                      className={`p-3 rounded-xl text-left border text-xs font-bold transition ${
                        calcArea === 'front_crown'
                          ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-brand-300'
                      }`}
                    >
                      <div className="font-extrabold font-display">Front & Crown</div>
                      <div className="text-[10px] opacity-80 mt-0.5">Hairline + crown</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setCalcArea('full_top')}
                      className={`p-3 rounded-xl text-left border text-xs font-bold transition ${
                        calcArea === 'full_top'
                          ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-brand-300'
                      }`}
                    >
                      <div className="font-extrabold font-display">Full Top</div>
                      <div className="text-[10px] opacity-80 mt-0.5">Norwood Stage 5-7</div>
                    </button>
                  </div>
                </div>

                {/* 2. Base Material */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider font-display">
                    2. Choose base material:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setCalcBase('lace')}
                      className={`p-3 rounded-xl text-left border text-xs transition ${
                        calcBase === 'lace'
                          ? 'bg-brand-600 text-white border-brand-600 shadow-sm font-bold'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-brand-300'
                      }`}
                    >
                      <div className="font-bold font-display">Swiss / French Lace</div>
                      <div className="text-[10px] opacity-80">Invisible front, highest airflow</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setCalcBase('skin')}
                      className={`p-3 rounded-xl text-left border text-xs transition ${
                        calcBase === 'skin'
                          ? 'bg-brand-600 text-white border-brand-600 shadow-sm font-bold'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-brand-300'
                      }`}
                    >
                      <div className="font-bold font-display">Ultra-Thin Micro Skin</div>
                      <div className="text-[10px] opacity-80">Scalp finish, easiest to clean</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setCalcBase('human_mono')}
                      className={`p-3 rounded-xl text-left border text-xs transition ${
                        calcBase === 'human_mono'
                          ? 'bg-brand-600 text-white border-brand-600 shadow-sm font-bold'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-brand-300'
                      }`}
                    >
                      <div className="font-bold font-display">Monofilament Mesh</div>
                      <div className="text-[10px] opacity-80">Maximum durability for daily wear</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setCalcBase('bio')}
                      className={`p-3 rounded-xl text-left border text-xs transition ${
                        calcBase === 'bio'
                          ? 'bg-brand-600 text-white border-brand-600 shadow-sm font-bold'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-brand-300'
                      }`}
                    >
                      <div className="font-bold font-display">Bio-Hybrid System</div>
                      <div className="text-[10px] opacity-80">Lace front + skin perimeter</div>
                    </button>
                  </div>
                </div>

                {/* 3. Attachment Method */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider font-display">
                    3. Fixing preference:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setCalcMethod('bonding')}
                      className={`p-2.5 rounded-xl text-center border text-xs font-bold transition font-display ${
                        calcMethod === 'bonding'
                          ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-brand-300'
                      }`}
                    >
                      Bonding (24/7)
                    </button>
                    <button
                      type="button"
                      onClick={() => setCalcMethod('clips')}
                      className={`p-2.5 rounded-xl text-center border text-xs font-bold transition font-display ${
                        calcMethod === 'clips'
                          ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-brand-300'
                      }`}
                    >
                      Daily Clips
                    </button>
                    <button
                      type="button"
                      onClick={() => setCalcMethod('weaving')}
                      className={`p-2.5 rounded-xl text-center border text-xs font-bold transition font-display ${
                        calcMethod === 'weaving'
                          ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-brand-300'
                      }`}
                    >
                      Track Weave
                    </button>
                  </div>
                </div>

              </div>

              {/* Right Live Estimate Display (5 cols) */}
              <div className="lg:col-span-5 bg-gradient-to-br from-slate-950 to-brand-950 rounded-3xl p-6 sm:p-8 text-white shadow-2xl space-y-6 border border-slate-800">
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 font-display">
                    Estimated Fitted Price Range
                  </span>
                  <div className="text-3xl sm:text-4xl font-black text-white font-display">
                    {currentEstimate.priceRange}
                  </div>
                  <span className="text-xs text-slate-400 block">
                    Includes custom base sizing, cut, styling & first fitting
                  </span>
                </div>

                <div className="pt-4 border-t border-slate-800 space-y-2.5 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Coverage:</span>
                    <span className="font-bold text-white">{currentEstimate.areaLabel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Base Type:</span>
                    <span className="font-bold text-white text-right max-w-[180px] truncate">{currentEstimate.baseName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">System Lifespan:</span>
                    <span className="font-bold text-emerald-400">{currentEstimate.lifespan}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Fitting Session:</span>
                    <span className="font-bold text-white">{currentEstimate.fitTime}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleConsultation(`Price Estimate Inquiry: Area: ${currentEstimate.areaLabel}, Base: ${currentEstimate.baseName}, Range: ${currentEstimate.priceRange}`)}
                  className="w-full py-4 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-700/30 transition"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Inquire This System on WhatsApp</span>
                </button>

                <p className="text-[10px] text-center text-slate-500">
                  ⚡ Final price is confirmed free during your in-studio fitting trial.
                </p>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 6. Shower in it. Swim in it. Sleep in it. (Lifestyle Freedom Proof) */}
      <section className="py-16 sm:py-24 bg-gradient-to-r from-brand-900 via-brand-800 to-slate-900 text-white border-b border-brand-900 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-300 font-display">
              Zero Lifestyle Compromises
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-display">
              Shower in it. Swim in it. Sleep in it.
            </h2>
            <p className="text-sm sm:text-base text-brand-200 max-w-2xl mx-auto leading-relaxed">
              A bonded hair system is not something you take off at night. The medical adhesive forms a flexible, waterproof membrane that withstands gym workouts, pool water, and hot Indian summers.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 sm:p-7 border border-white/15 space-y-3.5">
              <div className="w-11 h-11 rounded-2xl bg-white/20 text-white flex items-center justify-center">
                <Waves className="w-5 h-5 text-blue-300" />
              </div>
              <h3 className="font-bold text-white text-base font-display">Pool & Sea Swimming</h3>
              <p className="text-xs text-brand-100 leading-relaxed">
                Waterproof bond holds secure in chlorinated hotel pools and ocean saltwater. Shampoo normally afterwards.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 sm:p-7 border border-white/15 space-y-3.5">
              <div className="w-11 h-11 rounded-2xl bg-white/20 text-white flex items-center justify-center">
                <Flame className="w-5 h-5 text-amber-300" />
              </div>
              <h3 className="font-bold text-white text-base font-display">Gym & Heavy Sweating</h3>
              <p className="text-xs text-brand-100 leading-relaxed">
                Porous Swiss lace allows scalp sweat and heat to evaporate naturally with zero itching or trapped moisture.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 sm:p-7 border border-white/15 space-y-3.5">
              <div className="w-11 h-11 rounded-2xl bg-white/20 text-white flex items-center justify-center">
                <Smile className="w-5 h-5 text-emerald-300" />
              </div>
              <h3 className="font-bold text-white text-base font-display">Sleep Without Worry</h3>
              <p className="text-xs text-brand-100 leading-relaxed">
                Sleep comfortably in any position. Wake up with your hair intact, brush it, style it, and start your morning.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 sm:p-7 border border-white/15 space-y-3.5">
              <div className="w-11 h-11 rounded-2xl bg-white/20 text-white flex items-center justify-center">
                <Zap className="w-5 h-5 text-indigo-300" />
              </div>
              <h3 className="font-bold text-white text-base font-display">Two-Wheeler Helmets</h3>
              <p className="text-xs text-brand-100 leading-relaxed">
                Tight motorcycle helmet padding will not dislodge or loosen the perimeter tape bonding.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 7. How a Fitting Works (4 Steps From Walk-in to Hair) */}
      <section className="py-16 sm:py-24 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-2">
            <span className="text-xs font-bold text-brand-600 uppercase tracking-widest font-display">
              Simple & Transparent
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-950 tracking-tight font-display">
              How a fitting works
            </h2>
            <p className="text-slate-500 text-sm sm:text-base">
              Four simple steps from walking in with thinning hair to walking out with a full head of hair.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            <div className="space-y-3.5 bg-slate-50/70 p-6 rounded-3xl border border-slate-200/70">
              <div className="w-12 h-12 rounded-2xl bg-brand-50 border border-brand-200 text-brand-700 flex items-center justify-center font-black text-base shadow-xs font-display">
                01
              </div>
              <h3 className="font-bold text-slate-900 text-base font-display">You walk in</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                We sit down, check the scalp, measure the area of hair loss, and discuss what suits your daily routine and budget.
              </p>
            </div>

            <div className="space-y-3.5 bg-slate-50/70 p-6 rounded-3xl border border-slate-200/70">
              <div className="w-12 h-12 rounded-2xl bg-brand-50 border border-brand-200 text-brand-700 flex items-center justify-center font-black text-base shadow-xs font-display">
                02
              </div>
              <h3 className="font-bold text-slate-900 text-base font-display">We match it</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                We pick the exact density, color shade (#1B, natural black, salt-and-pepper), wave, and base material.
              </p>
            </div>

            <div className="space-y-3.5 bg-slate-50/70 p-6 rounded-3xl border border-slate-200/70">
              <div className="w-12 h-12 rounded-2xl bg-brand-50 border border-brand-200 text-brand-700 flex items-center justify-center font-black text-base shadow-xs font-display">
                03
              </div>
              <h3 className="font-bold text-slate-900 text-base font-display">Custom cut & style</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Our master stylist trims, blends, and layers the system seamlessly into your natural side and back hair.
              </p>
            </div>

            <div className="space-y-3.5 bg-emerald-50/60 p-6 rounded-3xl border border-emerald-200/80">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-800 flex items-center justify-center font-black text-base shadow-xs font-display">
                04
              </div>
              <h3 className="font-bold text-slate-900 text-base font-display">You leave with hair</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                In about 90 minutes, the process is complete. You walk out confident, ready to take on the world.
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <button
              onClick={onOpenConsultation}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-brand-600/25"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Your Free Walk-In Slot</span>
            </button>
          </div>

        </div>
      </section>

      {/* 8. Before & After Transformations (Norwood Scale Real Proof) */}
      <section className="py-16 sm:py-24 bg-surface-soft border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-bold text-brand-600 uppercase tracking-widest font-display">
              Real Client Cases
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-950 tracking-tight font-display">
              Before and after
            </h2>
            <p className="text-slate-500 text-sm sm:text-base">
              Real transformations fitted at our Wave Mall Sector 18 Noida studio.
            </p>

            <div className="flex justify-center gap-2 pt-4">
              {beforeAfterCases.map((c, i) => (
                <button
                  key={i}
                  onClick={() => setActiveBeforeAfter(i)}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold transition font-display ${
                    activeBeforeAfter === i
                      ? 'bg-brand-600 text-white shadow-md'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  Case 0{i + 1}: {c.title.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          <div className="max-w-4xl mx-auto bg-white rounded-3xl p-6 sm:p-9 shadow-card border border-slate-200/80">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              
              {/* Images Comparison */}
              <div className="grid grid-cols-2 gap-3.5">
                <div className="space-y-2">
                  <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-slate-100 relative border border-slate-200">
                    <img 
                      src={beforeAfterCases[activeBeforeAfter].beforeImg} 
                      alt="Before hair system"
                      className="w-full h-full object-cover" 
                    />
                    <span className="absolute top-2 left-2 bg-slate-950/85 text-white text-[10px] font-bold px-2 py-0.5 rounded-md font-display">
                      BEFORE
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 text-center font-medium">Prior to fitting</p>
                </div>

                <div className="space-y-2">
                  <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-slate-100 relative border-2 border-brand-500 shadow-md">
                    <img 
                      src={beforeAfterCases[activeBeforeAfter].afterImg} 
                      alt="After hair system"
                      className="w-full h-full object-cover" 
                    />
                    <span className="absolute top-2 left-2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md font-display">
                      AFTER 90 MINS
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-700 text-center font-bold">100% Remy Human Hair</p>
                </div>
              </div>

              {/* Case Details */}
              <div className="space-y-5">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-brand-600 uppercase tracking-wider font-display">
                    {beforeAfterCases[activeBeforeAfter].client}
                  </span>
                  <h3 className="text-2xl font-extrabold text-slate-900 font-display">
                    {beforeAfterCases[activeBeforeAfter].title}
                  </h3>
                  <p className="text-xs text-slate-500">
                    System Fitted: <strong className="text-slate-800">{beforeAfterCases[activeBeforeAfter].solution}</strong>
                  </p>
                </div>

                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 space-y-2.5 text-xs">
                  <div>
                    <strong className="text-slate-700 block text-[11px] uppercase font-display">Before Visit:</strong>
                    <p className="text-slate-500 leading-relaxed">{beforeAfterCases[activeBeforeAfter].beforeDesc}</p>
                  </div>
                  <div>
                    <strong className="text-emerald-700 block text-[11px] uppercase font-display">Result:</strong>
                    <p className="text-slate-700 font-medium leading-relaxed">{beforeAfterCases[activeBeforeAfter].afterDesc}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleConsultation(`Inquiry inspired by Case: ${beforeAfterCases[activeBeforeAfter].title}`)}
                  className="w-full py-3.5 rounded-xl bg-slate-950 hover:bg-brand-600 text-white font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-sm"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>Discuss Similar Solution on WhatsApp</span>
                </button>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 9. Featured Products Catalog Preview (2-col mobile, 4/5 cards) */}
      <section id="featured-systems" className="py-16 sm:py-24 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-xs font-bold text-brand-600 uppercase tracking-widest font-display">
                Our Hair Systems Catalog
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight mt-1 font-display">
                Featured Hair Patches & Accessories
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 max-w-xl mt-1">
                Swiss lace, micro skin toupees, tapes, and solvents available for in-studio fitting or express home dispatch across India.
              </p>
            </div>

            <Link
              to="/products"
              className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-800 transition font-display"
            >
              <span>Browse Full 27 Systems Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* 2-Column Mobile Product Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product._id || product.id}
                product={product}
                onQuickView={onQuickView}
                onAddToCart={onAddToCart}
                onToggleWishlist={onToggleWishlist}
                isWishlisted={wishlistIds.includes(product._id || product.id)}
                isInCart={cartItemIds.includes(product._id || product.id)}
              />
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              to="/products"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-slate-950 hover:bg-brand-600 text-white font-bold text-xs uppercase tracking-wider transition shadow-md"
            >
              <span>Explore All Hair Systems & Tapes</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </section>

      {/* 10. Why Choose Looks Forever Trust Section (Direct Phase 5 Component Integration) */}
      <WhyChoose items={homepageSettings?.whyChoose} />

      {/* 11. Every price, before you come in (Transparent Pricing Table) */}
      <section className="py-16 sm:py-24 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-2">
            <span className="text-xs font-bold text-brand-600 uppercase tracking-widest font-display">
              Straight Answers
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-950 tracking-tight font-display">
              Every price, before you come in
            </h2>
            <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto">
              Most studios in Delhi NCR will only quote you once you are sitting in the chair. Here is the honest range for our studio, so you know exactly what to expect.
            </p>
          </div>

          <div className="max-w-4xl mx-auto overflow-hidden bg-white rounded-3xl border border-slate-200 shadow-card">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[11px] font-display">
                    <th className="py-4 px-6">System Type</th>
                    <th className="py-4 px-6">Price, Fitted</th>
                    <th className="py-4 px-6">Base Material</th>
                    <th className="py-4 px-6">Lifespan</th>
                    <th className="py-4 px-6 hidden sm:table-cell">Best For</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {pricingTable.map((row, idx) => (
                    <tr key={idx} className="hover:bg-brand-50/50 transition">
                      <td className="py-4 px-6 font-bold text-slate-900 font-display">
                        {row.type}
                        {row.tag && (
                          <span className="ml-2 inline-block text-[10px] bg-brand-100 text-brand-700 px-2 py-0.5 rounded-full font-bold">
                            {row.tag}
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6 font-extrabold text-brand-700 whitespace-nowrap font-display">
                        {row.price}
                      </td>
                      <td className="py-4 px-6 text-slate-600">{row.base}</td>
                      <td className="py-4 px-6 text-emerald-700 font-semibold whitespace-nowrap">{row.lasts}</td>
                      <td className="py-4 px-6 text-slate-500 hidden sm:table-cell text-[11px] leading-relaxed max-w-xs">
                        {row.bestFor}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 text-center text-xs text-slate-500">
              Monthly routine rebonding & servicing service: <strong className="text-slate-900 font-bold font-display">₹1,000 to ₹1,500</strong>. Includes removal, scalp wash, conditioning, fresh tape, and reset.
            </div>
          </div>

        </div>
      </section>

      {/* 12. Frequently Asked Questions (FAQ) Accordion */}
      <section className="py-16 sm:py-24 bg-surface-soft border-b border-slate-200/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-brand-600 uppercase tracking-widest font-display">
              Got Questions?
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight font-display">
              Honest answers to common questions
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Everything you need to know about wearing a modern hair patch.
            </p>
          </div>

          <div className="space-y-3.5">
            {faqs.map((faq, idx) => (
              <div 
                key={idx}
                className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs transition"
              >
                <button
                  onClick={() => setOpenFaqIndex(openFaqIndex === idx ? -1 : idx)}
                  className="w-full py-4.5 px-6 text-left flex items-center justify-between gap-4 font-bold text-slate-900 text-xs sm:text-sm hover:text-brand-600 transition font-display"
                >
                  <span>{faq.q}</span>
                  {openFaqIndex === idx ? (
                    <ChevronUp className="w-4 h-4 text-brand-600 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>

                {openFaqIndex === idx && (
                  <div className="px-6 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3.5">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 13. Noida Wave Mall Studio Location & Callout Banner */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-slate-950 via-brand-950 to-slate-950 rounded-3xl p-8 sm:p-14 text-white shadow-2xl relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              <div className="lg:col-span-8 space-y-3.5">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 font-display">
                  Wave Mall Sector 18, Noida Studio
                </span>
                <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-display">
                  Ready to see yourself with a full head of hair?
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
                  Walk in or book ahead. We have 100+ ready systems in stock across all lace, skin, and mono bases. No pressure, no awkward sales pitch — just straight answers.
                </p>
                <div className="pt-2 flex flex-wrap gap-4 text-xs text-brand-200">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-emerald-400" />
                    <span>Opposite Haldiram's, Wave Mall Noida</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-emerald-400" />
                    <span>Open 7 Days • 10:30 AM to 8:30 PM</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4 flex flex-col gap-3.5">
                <button
                  onClick={onOpenConsultation}
                  className="w-full py-4 px-6 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-brand-600/30 transition text-center"
                >
                  Book Free In-Studio Fitting
                </button>
                <button
                  onClick={() => handleConsultation('Wave Mall Studio Visit Inquiry')}
                  className="w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-700/30 transition flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat on WhatsApp</span>
                </button>
              </div>

            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
