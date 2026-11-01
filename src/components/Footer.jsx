import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  MessageCircle, 
  ShieldCheck, 
  Award, 
  ChevronRight, 
  X,
  ExternalLink
} from 'lucide-react';
import { SITE_CONFIG, CATEGORIES } from '../config/siteConfig';
import { handleConsultation } from '../utils/whatsapp';

export default function Footer() {
  const [activePolicy, setActivePolicy] = useState(null);

  const policyContent = {
    privacy: {
      title: "Privacy & Confidentiality Policy",
      content: `At Looks Forever Hair Aesthetic Clinic, client privacy and medical confidentiality are paramount.
      
1. Information Collection: We only collect personal details (name, contact phone number, consultation preference) required to coordinate your non-surgical hair replacement consultation and order fulfillment.
2. Photographic Confidentiality: Any photos of scalp thinning or pattern baldness shared with our trichology team are treated under strict confidentiality and never shared with third parties.
3. Discreet Plain-Box Packaging: All hair systems, customized patches, maintenance tapes, and solvent kits are dispatched in discreet, unmarked plain packaging across India.`
    },
    terms: {
      title: "Terms and Conditions",
      content: `Welcome to Looks Forever Hair Aesthetic Clinic. By browsing our website and ordering via our WhatsApp or in-clinic channels, you agree to the following terms:

1. Non-Surgical Systems: Our hair patches, toupees, and wigs are 100% non-surgical prosthetics applied via dermatologically certified medical tapes, clips, or skin-safe adhesives.
2. In-Clinic Customization: Base cut-to-size styling and hairline graduation performed at our Wave Mall Sector 18 Noida clinic require direct scalp templating.
3. Real-Time Confirmation: Specifications, hair density (100%-130%), and base dimensions are verified prior to system dispatch.`
    },
    refund: {
      title: "Return and Hygiene Policy",
      content: `Due to strict health and hygiene standards applicable to cranial prosthetics and human hair systems:

1. Unaltered Hair Systems: Packaged patches, wigs, rolls of Ultra Hold tape, and unopened solvent bottles may be exchanged within 7 days of delivery if untampered, uncut, and in original sealed packaging.
2. Custom Styled Systems: Once a hair patch has been cut to size, styled, or adhered to the scalp, returns cannot be accepted for health and hygiene regulations.
3. Transit Damage: If packaging is damaged in courier transit, notify us on WhatsApp within 24 hours of receipt with unboxing photos for an immediate replacement.`
    }
  };

  return (
    <footer className="bg-brand-950 text-white pt-16 pb-8 border-t border-brand-900 selection:bg-brand-500 selection:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-brand-900/80">
          
          {/* Col 1: Brand Info & Logo */}
          <div className="lg:col-span-4 space-y-4">
            <Link to="/" className="inline-block">
              <div className="bg-white px-3.5 py-2 rounded-2xl shadow-md border border-white/20 inline-flex items-center">
                <img 
                  src="/brand/logo.png" 
                  alt="Looks Forever Hair Aesthetic Clinic" 
                  className="h-9 sm:h-10 w-auto max-w-[220px] object-contain" 
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/brand/logo-cropped.png';
                  }}
                />
              </div>
            </Link>

            <p className="text-xs sm:text-sm text-brand-200/80 leading-relaxed max-w-sm">
              India's premier non-surgical hair replacement studio and hair systems provider. Over 15 years of natural hairline craft, honest pricing, and dedicated care at Wave Mall Sector 18 Noida.
            </p>

            <div className="pt-2">
              <button
                onClick={() => handleConsultation('Inquiry from Footer')}
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-4 py-2.5 rounded-xl text-xs transition shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </button>
            </div>
          </div>

          {/* Col 2: Navigation Pages */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-sm font-bold text-white tracking-wider uppercase font-display">
              Explore Pages
            </h4>
            <ul className="space-y-2 text-xs text-brand-200">
              <li>
                <Link to="/" className="hover:text-white transition flex items-center gap-1">
                  <ChevronRight className="w-3 h-3 opacity-60" /> Home Overview
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-white transition flex items-center gap-1">
                  <ChevronRight className="w-3 h-3 opacity-60" /> Six Fixing Methods
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-white transition flex items-center gap-1">
                  <ChevronRight className="w-3 h-3 opacity-60" /> Products Catalog
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-white transition flex items-center gap-1">
                  <ChevronRight className="w-3 h-3 opacity-60" /> Before & After
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition flex items-center gap-1">
                  <ChevronRight className="w-3 h-3 opacity-60" /> About Our Studio
                </Link>
              </li>
              <li>
                <Link to="/blogs" className="hover:text-white transition flex items-center gap-1">
                  <ChevronRight className="w-3 h-3 opacity-60" /> Hair Guides
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition flex items-center gap-1">
                  <ChevronRight className="w-3 h-3 opacity-60" /> Wave Mall Noida Studio
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Categories */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-bold text-white tracking-wider uppercase font-display">
              Specialist Systems
            </h4>
            <ul className="space-y-2 text-xs text-brand-200">
              {CATEGORIES.map((cat) => (
                <li key={cat.id}>
                  <Link
                    to={`/category/${cat.id}`}
                    className="hover:text-white transition flex items-center gap-1"
                  >
                    <ChevronRight className="w-3 h-3 opacity-60" /> {cat.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/services" className="hover:text-white transition flex items-center gap-1 text-emerald-400 font-medium pt-1">
                  <ChevronRight className="w-3 h-3 opacity-60" /> View All Six Fixing Methods →
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact Information */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-bold text-white tracking-wider uppercase font-display">
              Wave Mall Noida Studio
            </h4>
            
            <div className="space-y-2.5 text-xs text-brand-200">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                <span>{SITE_CONFIG.contact.address}</span>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-brand-400 shrink-0" />
                <span>{SITE_CONFIG.contact.phoneDisplay}</span>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-brand-400 shrink-0" />
                <span>{SITE_CONFIG.contact.email}</span>
              </div>

              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-brand-400 shrink-0" />
                <span>{SITE_CONFIG.contact.hours}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Policies & Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-brand-300/80">
          <div>
            © {new Date().getFullYear()} Looks Forever Hair Aesthetic Clinic. All rights reserved.
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setActivePolicy('privacy')}
              className="hover:text-white transition underline"
            >
              Privacy Policy
            </button>
            <span>•</span>
            <button 
              onClick={() => setActivePolicy('terms')}
              className="hover:text-white transition underline"
            >
              Terms & Conditions
            </button>
            <span>•</span>
            <button 
              onClick={() => setActivePolicy('refund')}
              className="hover:text-white transition underline"
            >
              Hygiene & Return Policy
            </button>
          </div>
        </div>

      </div>

      {/* Policy Modal */}
      {activePolicy && (
        <div 
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setActivePolicy(null)}
        >
          <div 
            className="bg-white text-slate-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative animate-in zoom-in-95 max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                {policyContent[activePolicy].title}
              </h3>
              <button 
                onClick={() => setActivePolicy(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 text-xs sm:text-sm text-slate-600 space-y-3 whitespace-pre-line leading-relaxed">
              {policyContent[activePolicy].content}
            </div>

            <div className="pt-4 border-t border-slate-100 text-right">
              <button
                onClick={() => setActivePolicy(null)}
                className="bg-brand-600 hover:bg-brand-700 text-white font-semibold px-4 py-2 rounded-xl text-xs"
              >
                Understood & Close
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
