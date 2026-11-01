import React from 'react';
import { MapPin, Navigation, Clock, Phone, MessageCircle, ExternalLink, ShieldCheck } from 'lucide-react';
import { SITE_CONFIG } from '../config/siteConfig';
import { handleConsultation } from '../utils/whatsapp';

export default function ClinicLocationSection() {
  const googleMapsUrl = "https://www.google.com/maps/search/?api=1&query=Looks+Forever+Wave+Mall+Sector+18+Noida";

  return (
    <section id="clinic" className="py-16 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-slate-900 text-white rounded-3xl overflow-hidden shadow-2xl grid grid-cols-1 lg:grid-cols-12">
          
          {/* Left: Clinic Details */}
          <div className="lg:col-span-7 p-8 sm:p-12 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 text-xs font-semibold tracking-wider uppercase border border-brand-500/30">
                <MapPin className="w-3.5 h-3.5" />
                Physical Flagship Clinic
              </div>

              <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Visit Our Noida Sector 18 Clinic
              </h3>

              <p className="text-slate-300 text-sm leading-relaxed">
                Experience private consultation rooms, on-spot custom hair patch styling, attachment maintenance, and personalized scalp analysis by appointment.
              </p>

              <div className="space-y-3 pt-2 text-xs sm:text-sm text-slate-300">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-brand-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-semibold">{SITE_CONFIG.contact.address}</strong>
                    <span className="text-slate-400 text-xs">Landmark: {SITE_CONFIG.contact.landmark}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-brand-400 shrink-0" />
                  <span>{SITE_CONFIG.contact.hours}</span>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-brand-400 shrink-0" />
                  <span>Helpline: <strong className="text-white font-semibold">{SITE_CONFIG.contact.phoneDisplay}</strong></span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row gap-3">
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-brand-600 hover:bg-brand-500 text-white font-semibold py-3 px-5 rounded-xl text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-md"
              >
                <Navigation className="w-4 h-4" />
                <span>Open Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-60" />
              </a>

              <button
                onClick={() => handleConsultation('Clinic Visit & Appointment Booking')}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 px-5 rounded-xl text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-md"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Book Clinic Appointment</span>
              </button>
            </div>

          </div>

          {/* Right: Map / Clinic Card visual */}
          <div className="lg:col-span-5 bg-gradient-to-br from-brand-950 via-slate-900 to-brand-900 p-8 flex flex-col justify-center items-center text-center relative border-t lg:border-t-0 lg:border-l border-slate-800">
            <div className="w-20 h-20 rounded-2xl bg-brand-600/30 border border-brand-500/40 flex items-center justify-center text-brand-300 mb-4 shadow-glow">
              <MapPin className="w-10 h-10 text-brand-400 animate-bounce" />
            </div>

            <h4 className="text-xl font-bold text-white mb-1">
              Sector 18 Metro Station
            </h4>
            <p className="text-xs text-slate-400 mb-6 max-w-xs">
              Located conveniently within 200 metres from Noida Sector 18 Metro Station (Blue Line) at Wave Mall / Center Stage Mall.
            </p>

            <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700/80 text-left w-full space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-300">
                <span>Parking:</span>
                <span className="text-white font-semibold">Available at Wave Mall</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>Fitting Time:</span>
                <span className="text-white font-semibold">~45 - 60 Mins</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>Consultation:</span>
                <span className="text-emerald-400 font-semibold">Free by prior slot</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
