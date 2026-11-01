import React, { useState } from 'react';
import ProductGrid from '../components/ProductGrid';
import { Sparkles, ShieldCheck, Tag, ArrowRight } from 'lucide-react';

export default function ProductsPage({
  products = [],
  onQuickView,
  onAddToCart,
  onToggleWishlist,
  wishlistIds = [],
  cartItemIds = [],
  isLoading = false
}) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-surface-soft">
      
      {/* Products Page Header Banner */}
      <section className="bg-gradient-to-r from-brand-900 via-brand-800 to-slate-900 text-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-brand-200 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>100% Virgin Remy Human Hair Systems</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Hair Systems, Patches & Accessories
          </h1>

          <p className="text-xs sm:text-base text-brand-200 max-w-2xl leading-relaxed">
            Browse our clinical collection of fine Hollywood HD lace patches, ultra-thin micro skin toupees, cranial wigs, and medical-grade bonding tapes with direct WhatsApp ordering.
          </p>
        </div>
      </section>

      {/* Product Catalog Grid (Includes 2-col mobile, 4/5 cards, search & filter) */}
      <ProductGrid
        products={products}
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        onQuickView={onQuickView}
        onAddToCart={onAddToCart}
        onToggleWishlist={onToggleWishlist}
        wishlistIds={wishlistIds}
        cartItemIds={cartItemIds}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isLoading={isLoading}
      />

    </div>
  );
}

