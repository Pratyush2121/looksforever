import React from 'react';
import { 
  Building2, 
  Award, 
  ShieldCheck, 
  CheckCircle2, 
  Users, 
  Heart, 
  Clock, 
  MapPin, 
  Phone, 
  Calendar, 
  MessageCircle,
  Sparkles,
  Scissors
} from 'lucide-react';
import { handleConsultation } from '../utils/whatsapp';

export default function AboutPage({ onOpenConsultation }) {
  const milestones = [
    { year: '2008', title: 'Studio Inception', desc: 'Started our dedicated hair replacement and patch styling studio in Delhi NCR.' },
    { year: '2014', title: 'Wave Mall Noida Flagship', desc: 'Opened our permanent private fitting studio at Wave Mall, Sector 18 Noida.' },
    { year: '2019', title: 'Swiss Lace Mastery', desc: 'Pioneered custom featherlight Swiss lace knotting and breathable bases tailored for Indian weather.' },
    { year: '2024', title: '12,000+ Clients Fitted', desc: 'Over twelve thousand men and women now wear Looks Forever hair systems with total confidence.' }
  ];

  const standards = [
    {
      title: '100% Virgin Remy Human Hair',
      desc: 'We never compromise with cheap synthetic hair. Every system is hand-tied with healthy, real human hair that takes heat styling and moves naturally.'
    },
    {
      title: 'Private 1-on-1 Styling Booths',
      desc: 'We respect every client’s privacy. All consultations, base templating, haircuts, and servicing happen in private, comfortable styling booths.'
    },
    {
      title: 'Skin-Safe Certified Adhesives',
      desc: 'Every tape, liquid bond, and solvent used in our studio (Walker Ultra Hold, C-22, Ghost Bond) is hypoallergenic and dermatologically tested.'
    },
    {
      title: 'Master Hairline Barbers',
      desc: 'Our stylists are experienced in hairline graduation, feathering, and contour cutting so your hair system blends invisibly with your side hair.'
    }
  ];

  return (
    <div className="min-h-screen bg-surface-soft space-y-12 pb-16 selection:bg-brand-500 selection:text-white">
      
      {/* Hero Header */}
      <section className="bg-gradient-to-r from-brand-900 via-brand-800 to-slate-900 text-white py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-brand-200 text-xs font-semibold uppercase tracking-wider">
            <Building2 className="w-3.5 h-3.5 text-accent-cyan" />
            <span>Since 2008 • Wave Mall Sector 18 Noida</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight max-w-3xl">
            A hair studio in Wave Mall Noida, not a sales floor
          </h1>

          <p className="text-sm sm:text-base text-brand-200 max-w-2xl leading-relaxed">
            We are an in-house styling studio dedicated to non-surgical hair replacement. We don't do aggressive sales pitches, and we don't perform surgery. Just honest hair systems that let you live your normal life.
          </p>
        </div>
      </section>

      {/* Main Philosophy Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-bold text-brand-600 uppercase tracking-widest">
                Our Philosophy
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Natural hair without the surgical baggage
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              When we opened our studio in 2008, hair replacement was surrounded by secrecy, awkwardness, and aggressive sales floors trying to lock customers into lifelong contracts.
            </p>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              We changed that. At Looks Forever, you are treated like a regular salon client. We sit down over a chai, check the loss pattern, and show you real hair systems. If it suits your lifestyle and budget, we cut and style it today. If you want to think about it, you leave with our full respect and zero pressure.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 space-y-1 shadow-xs">
                <strong className="text-brand-600 text-2xl font-black block">15+</strong>
                <span className="text-xs font-bold text-slate-800">Years Studio Heritage</span>
                <p className="text-[11px] text-slate-500">Wave Mall Sector 18 Noida</p>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 space-y-1 shadow-xs">
                <strong className="text-emerald-600 text-2xl font-black block">12,000+</strong>
                <span className="text-xs font-bold text-slate-800">Happy Clients Fitted</span>
                <p className="text-[11px] text-slate-500">Across Delhi NCR & India</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative rounded-3xl overflow-hidden shadow-card border border-slate-200">
              <img 
                src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=800" 
                alt="Hair stylist at work" 
                className="w-full h-80 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent flex items-end p-6">
                <div className="text-white space-y-1">
                  <strong className="block text-sm font-bold">Dedicated Styling Barbers</strong>
                  <p className="text-xs text-slate-300">Skilled in feathering, blending, and hairline contouring.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 4 Standards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold text-brand-600 uppercase tracking-widest">
            The Looks Forever Standard
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Four things we never compromise on
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {standards.map((std, idx) => (
            <div key={idx} className="bg-white rounded-3xl p-6 shadow-card border border-slate-200/80 space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center font-black text-sm border border-brand-100">
                0{idx + 1}
              </div>
              <h3 className="font-bold text-slate-900 text-sm">
                {std.title}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {std.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 text-white space-y-8">
          <div className="text-center space-y-1">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-300">
              Our Journey
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold">
              Over 15 Years of Crafting Natural Hair
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {milestones.map((m, idx) => (
              <div key={idx} className="border-l-2 border-brand-500 pl-4 space-y-1">
                <span className="text-2xl font-black text-amber-400 block">{m.year}</span>
                <strong className="text-sm font-bold text-white block">{m.title}</strong>
                <p className="text-xs text-slate-300 leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Studio Action Bar */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <h3 className="text-xl font-bold text-slate-900">
          Visit Our Studio at Wave Mall Noida
        </h3>
        <p className="text-xs text-slate-500 max-w-lg mx-auto">
          We are located at Wave Mall, Sector 18 Noida (Gate 2 Metro). Walk in for a free scalp match or book ahead.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
          <button
            onClick={onOpenConsultation}
            className="px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs uppercase tracking-wider transition shadow-sm"
          >
            Book Free Fitting Session
          </button>
          <button
            onClick={() => handleConsultation('Wave Mall Studio Visit - About Page')}
            className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider transition shadow-sm flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat on WhatsApp</span>
          </button>
        </div>
      </div>

    </div>
  );
}
