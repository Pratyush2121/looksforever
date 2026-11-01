import React, { useState, useMemo } from 'react';
import { Search, X, SlidersHorizontal, ArrowUpDown, Filter, Sparkles } from 'lucide-react';
import ProductCard from './ProductCard';
import { CATEGORIES } from '../config/siteConfig';

function ProductSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-subtle flex flex-col justify-between overflow-hidden animate-pulse h-full">
      <div className="aspect-[4/5] bg-slate-200 w-full"></div>
      <div className="p-3 sm:p-4 space-y-3">
        <div className="h-3 bg-slate-200 rounded w-1/3"></div>
        <div className="space-y-1.5">
          <div className="h-4 bg-slate-200 rounded w-full"></div>
          <div className="h-4 bg-slate-200 rounded w-4/5"></div>
        </div>
        <div className="pt-2 border-t border-slate-100 space-y-2">
          <div className="h-5 bg-slate-200 rounded w-1/2"></div>
          <div className="h-8 bg-slate-200 rounded-xl w-full"></div>
        </div>
      </div>
    </div>
  );
}

export default function ProductGrid({ 
  products = [], 
  activeCategory, 
  onSelectCategory, 
  onQuickView, 
  onAddToCart, 
  onToggleWishlist, 
  wishlistIds = [],
  cartItemIds = [],
  searchQuery,
  setSearchQuery,
  isLoading = false
}) {
  const [sortBy, setSortBy] = useState('featured');

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products
      .filter((prod) => {
        // Category filter
        if (activeCategory !== 'all' && prod.category !== activeCategory) {
          return false;
        }
        // Search query
        if (searchQuery && searchQuery.trim().length > 0) {
          const q = searchQuery.toLowerCase();
          const matchName = prod.name?.toLowerCase().includes(q);
          const matchDesc = (prod.shortDesc || prod.description || '')?.toLowerCase().includes(q);
          const matchCat = prod.category?.toLowerCase().includes(q);
          const matchSku = prod.sku?.toLowerCase().includes(q);
          if (!matchName && !matchDesc && !matchCat && !matchSku) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'rating') return (b.rating || 4.9) - (a.rating || 4.9);
        if (sortBy === 'newest') return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
        return 0; // default featured
      });
  }, [products, activeCategory, searchQuery, sortBy]);

  const activeCategoryObj = CATEGORIES.find(c => c.id === activeCategory);

  return (
    <section id="products" className="py-12 sm:py-16 bg-surface-soft border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10 space-y-2">
          <span className="text-xs font-bold text-brand-600 uppercase tracking-widest">
            Handcrafted Aesthetics & Medical Grade Solvents
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Our Complete Product Collection
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm">
            Select your preferred hair systems, maintenance tapes, and scalp care essentials with direct WhatsApp ordering.
          </p>
        </div>

        {/* Filters and Search Bar Container */}
        <div className="bg-white p-3.5 sm:p-5 rounded-2xl shadow-subtle border border-slate-200/80 mb-6 sm:mb-8 space-y-3.5">
          
          {/* Top row: Search input + Sort dropdown */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search hair patches, wigs, Ultra Hold tape, glue..."
                className="w-full pl-10 pr-9 py-2 sm:py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-slate-50/50"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                <ArrowUpDown className="w-3.5 h-3.5" /> Sort:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 sm:px-3 sm:py-2 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              >
                <option value="featured">Featured / Best Sellers</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Customer Rating</option>
                <option value="newest">Newest Arrivals</option>
              </select>
            </div>

          </div>

          {/* Bottom row: Category filter pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar text-xs font-medium">
            <button
              onClick={() => onSelectCategory('all')}
              className={`px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl shrink-0 transition ${
                activeCategory === 'all'
                  ? 'bg-brand-600 text-white font-semibold shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              All Products ({products.length})
            </button>

            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl shrink-0 transition ${
                  activeCategory === cat.id
                    ? 'bg-brand-600 text-white font-semibold shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                {cat.shortName} ({cat.count})
              </button>
            ))}
          </div>

          {/* Active Filter Chips / Reset */}
          {(activeCategory !== 'all' || searchQuery) && (
            <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span>Active Filters:</span>
                {activeCategory !== 'all' && (
                  <span className="inline-flex items-center gap-1 bg-brand-50 text-brand-700 px-2 py-0.5 rounded-full font-medium text-[11px]">
                    {activeCategoryObj?.name || activeCategory}
                    <button onClick={() => onSelectCategory('all')} className="hover:text-brand-900">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {searchQuery && (
                  <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-medium text-[11px]">
                    "{searchQuery}"
                    <button onClick={() => setSearchQuery('')} className="hover:text-slate-900">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>

              <button
                onClick={() => {
                  onSelectCategory('all');
                  setSearchQuery('');
                  setSortBy('featured');
                }}
                className="text-brand-600 hover:text-brand-800 font-semibold underline text-xs"
              >
                Clear all filters
              </button>
            </div>
          )}

        </div>

        {/* Results Counter */}
        <div className="mb-4 sm:mb-6 flex items-center justify-between text-xs text-slate-500">
          <span>Showing <strong>{isLoading ? '...' : filteredProducts.length}</strong> products</span>
          <span className="text-emerald-600 font-medium flex items-center gap-1 text-[11px] sm:text-xs">
            <Sparkles className="w-3.5 h-3.5" /> Instant WhatsApp Order Active
          </span>
        </div>

        {/* Products Grid: Responsive 2-cols mobile (12px gap), 3-cols 1024px, 4-cols 1280px (24px gap) */}
        {isLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product._id || product.id}
                product={product}
                onQuickView={onQuickView}
                onAddToCart={onAddToCart}
                onToggleWishlist={onToggleWishlist}
                isWishlisted={wishlistIds.includes(product.id || product._id)}
                isAddedToCart={cartItemIds.includes(product.id || product._id)}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white rounded-3xl p-8 sm:p-12 text-center max-w-lg mx-auto shadow-subtle border border-slate-200">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-brand-50 text-brand-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-7 h-7 sm:w-8 sm:h-8" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">No products found</h3>
            <p className="text-xs text-slate-500 mt-1 mb-6">
              We couldn't find any products matching your current filters. Try searching for "patch", "tape", or resetting your filters.
            </p>
            <button
              onClick={() => {
                onSelectCategory('all');
                setSearchQuery('');
              }}
              className="bg-brand-600 hover:bg-brand-700 text-white font-medium px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl text-xs transition"
            >
              Reset Filters
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
