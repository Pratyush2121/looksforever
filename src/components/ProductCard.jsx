import React from 'react';
import { Star, Heart, Eye, MessageCircle, ShoppingBag, Check } from 'lucide-react';
import { handleBuyNow } from '../utils/whatsapp';
import { resolveImageUrl } from '../services/imageService';

export default function ProductCard({ 
  product, 
  onQuickView, 
  onAddToCart, 
  onToggleWishlist, 
  isWishlisted = false,
  isAddedToCart = false 
}) {
  const defaultVariant = product.variants ? product.variants.reduce((acc, v) => {
    acc[v.name] = v.options[0];
    return acc;
  }, {}) : {};

  const displayImage = resolveImageUrl(
    (Array.isArray(product.images) && product.images[0]) || product.image || '/brand/logo-cropped.png'
  );

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/90 hover:border-brand-300 shadow-subtle hover:shadow-premium transition-all duration-300 flex flex-col justify-between overflow-hidden relative h-full">
      
      {/* Top Image Container: Fixed 4/5 Aspect Ratio (Zero Layout Shift) */}
      <div 
        className="relative aspect-[4/5] w-full overflow-hidden bg-slate-100 cursor-pointer select-none" 
        onClick={() => onQuickView(product)}
      >
        <img
          src={displayImage}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/brand/logo-cropped.png';
          }}
        />

        {/* Badges (Top Left) */}
        <div className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 flex flex-col gap-1 z-10 max-w-[70%]">
          {product.badge && (
            <span className="text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full shadow-xs text-white bg-brand-600 truncate">
              {product.badge}
            </span>
          )}
          {product.discount && (
            <span className="bg-emerald-600 text-white text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
              {product.discount}
            </span>
          )}
        </div>

        {/* Wishlist Button (Top Right) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className={`absolute top-2 right-2 sm:top-2.5 sm:right-2.5 p-1.5 sm:p-2 rounded-full backdrop-blur-md transition z-10 ${
            isWishlisted 
              ? 'bg-rose-50 text-rose-600 shadow-md ring-1 ring-rose-200' 
              : 'bg-white/85 hover:bg-white text-slate-600 hover:text-rose-600 shadow-xs'
          }`}
        >
          <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>

        {/* Quick View Hover Button (Desktop only) */}
        <div className="hidden sm:flex absolute inset-x-0 bottom-2.5 px-3 justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="w-full bg-white/95 hover:bg-white text-slate-800 text-xs font-semibold py-1.5 px-3 rounded-xl shadow-md flex items-center justify-center gap-1.5 transition-transform transform translate-y-1 group-hover:translate-y-0"
          >
            <Eye className="w-3.5 h-3.5 text-brand-600" />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      {/* Body Details: Equal Height & Clamped Typography */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between space-y-2.5">
        <div className="space-y-1">
          {/* Rating */}
          <div className="flex items-center gap-1 text-[11px] text-amber-500">
            <Star className="w-3 h-3 fill-amber-400" />
            <span className="font-bold text-slate-800">{product.rating || '4.9'}</span>
            <span className="text-slate-400 font-normal">({product.reviewCount || 48})</span>
          </div>

          {/* Product Name (Clamped to exactly 2 lines) */}
          <h3 
            onClick={() => onQuickView(product)}
            className="font-bold text-slate-900 text-xs sm:text-sm hover:text-brand-600 transition cursor-pointer line-clamp-2 min-h-[2rem] sm:min-h-[2.5rem] leading-snug font-display"
            title={product.name}
          >
            {product.name}
          </h3>

          {/* Short description */}
          {product.shortDesc && (
            <p className="hidden sm:block text-[11px] text-slate-500 line-clamp-1 leading-relaxed">
              {product.shortDesc}
            </p>
          )}
        </div>

        {/* Price & WhatsApp CTA */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          {/* Price display */}
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="text-base sm:text-lg font-extrabold text-slate-900 font-display">
              ₹{Number(product.price).toLocaleString('en-IN')}
            </span>
            {product.originalPrice && (
              <span className="text-[10px] sm:text-xs text-slate-400 line-through">
                ₹{Number(product.originalPrice).toLocaleString('en-IN')}
              </span>
            )}
          </div>

          {/* WhatsApp Direct Action Button (Full width on mobile) */}
          <div className="space-y-1.5">
            <button
              onClick={() => handleBuyNow(product, 1, defaultVariant)}
              className="w-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold py-2 px-2 rounded-xl text-xs transition flex items-center justify-center gap-1.5 shadow-xs"
              title="Buy Now on WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Buy on WhatsApp</span>
            </button>

            {/* Quick Add to Bag secondary */}
            <button
              onClick={() => onAddToCart(product, 1, defaultVariant)}
              className={`w-full py-1 px-2 rounded-lg text-[10px] sm:text-[11px] font-semibold transition flex items-center justify-center gap-1 border ${
                isAddedToCart
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              {isAddedToCart ? (
                <>
                  <Check className="w-3 h-3 text-emerald-600" />
                  <span>In Bag</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3 h-3 text-slate-500" />
                  <span>Add to Bag</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
