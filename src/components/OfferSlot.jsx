import React, { useState, useEffect } from 'react';
import { Tag, Sparkles, X, Copy, Check, ArrowRight, ExternalLink } from 'lucide-react';

export default function OfferSlot({ 
  slot = 'top_bar', 
  className = '',
  onClose,
  initialOffer = null
}) {
  const [offer, setOffer] = useState(initialOffer);
  const [copied, setCopied] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (initialOffer) {
      setOffer(initialOffer);
      return;
    }

    let isMounted = true;
    fetch(`/api/offers?slot=${slot}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (!isMounted) return;
        if (data && data._id && data.active !== false) {
          setOffer(data);
        } else {
          setOffer(null);
        }
      })
      .catch(() => {});

    return () => { isMounted = false; };
  }, [slot, initialOffer]);

  if (!offer || dismissed) return null;

  const handleCopyCode = (e) => {
    e.stopPropagation();
    if (offer.code) {
      navigator.clipboard?.writeText(offer.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleTrackClick = () => {
    try {
      fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'offer_click',
          offerId: offer._id,
          path: window.location.pathname
        })
      });
    } catch {}
  };

  const getVariantStyles = (variant) => {
    switch (variant) {
      case 'gold':
        return 'bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-white shadow-xs';
      case 'dark':
        return 'bg-slate-900 text-white border-slate-800 shadow-xs';
      case 'subtle':
        return 'bg-slate-100 text-slate-800 border-slate-200';
      case 'highlight':
      default:
        return 'bg-brand-600 text-white shadow-xs';
    }
  };

  return (
    <div className={`transition-all duration-200 ${getVariantStyles(offer.styleVariant)} ${className}`}>
      <div className="max-w-7xl mx-auto px-4 py-2 sm:py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
        
        {/* Left: Badge + Title + Description */}
        <div className="flex items-center gap-2 flex-wrap min-w-0">
          {offer.badgeText && (
            <span className="font-extrabold text-[10px] uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full shrink-0">
              {offer.badgeText}
            </span>
          )}
          <span className="font-bold tracking-tight">{offer.title}</span>
          {offer.description && (
            <span className="hidden md:inline opacity-90 truncate max-w-md">
              • {offer.description}
            </span>
          )}
        </div>

        {/* Right: Code Pill + CTA + Dismiss */}
        <div className="flex items-center gap-2 shrink-0">
          {offer.code && (
            <button
              onClick={handleCopyCode}
              title="Copy Coupon Code"
              className="bg-white/15 hover:bg-white/25 active:bg-white/30 text-white px-2 py-0.5 rounded-md font-mono text-[11px] font-bold flex items-center gap-1 transition"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-300" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copied' : offer.code}</span>
            </button>
          )}

          {offer.ctaUrl ? (
            <a
              href={offer.ctaUrl}
              onClick={handleTrackClick}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-slate-900 hover:bg-slate-100 font-bold px-2.5 py-1 rounded-md text-[11px] inline-flex items-center gap-1 transition"
            >
              <span>{offer.ctaText || 'Claim Offer'}</span>
              <ArrowRight className="w-3 h-3" />
            </a>
          ) : null}

          <button
            onClick={() => {
              setDismissed(true);
              if (onClose) onClose();
            }}
            className="p-1 hover:bg-white/20 rounded transition text-white/80 hover:text-white"
            aria-label="Dismiss offer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
}

