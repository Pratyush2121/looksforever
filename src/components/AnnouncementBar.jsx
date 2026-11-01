import React, { useState, useEffect } from 'react';
import { Sparkles, MessageCircle, Phone, ChevronRight } from 'lucide-react';
import { SITE_CONFIG } from '../config/siteConfig';
import { handleConsultation } from '../utils/whatsapp';

export default function AnnouncementBar() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const announcements = SITE_CONFIG.announcements || [];

  useEffect(() => {
    if (announcements.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [announcements.length]);

  return (
    <div className="bg-brand-800 text-white text-xs sm:text-sm py-2 px-4 transition-colors border-b border-brand-700/60">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left: Hotline info */}
        <div className="hidden lg:flex items-center gap-2 text-brand-200">
          <Phone className="w-3.5 h-3.5 text-brand-300" />
          <span>Clinic Hotline: <strong className="text-white font-semibold">{SITE_CONFIG.contact.phoneDisplay}</strong></span>
        </div>

        {/* Center: Dynamic Announcement */}
        <div className="flex-1 text-center font-medium text-brand-100 flex items-center justify-center gap-2 overflow-hidden truncate">
          <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0 animate-pulse" />
          <span className="transition-opacity duration-300">
            {announcements[currentIndex]}
          </span>
        </div>

        {/* Right: Instant WhatsApp order link */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => handleConsultation('Quick Hair Assessment')}
            className="inline-flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white font-medium px-2.5 py-1 rounded-full text-xs transition shadow-sm hover:shadow"
            title="Chat with specialist on WhatsApp"
          >
            <MessageCircle className="w-3 h-3" />
            <span className="hidden sm:inline">WhatsApp Help</span>
            <span className="sm:hidden">WhatsApp</span>
            <ChevronRight className="w-3 h-3 opacity-70" />
          </button>
        </div>
      </div>
    </div>
  );
}
