import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ProductGrid from '../components/ProductGrid';
import { CATEGORIES } from '../config/siteConfig';
import { Sparkles, ArrowLeft, FolderTree } from 'lucide-react';

export default function CategoryPage({
  products = [],
  onQuickView,
  onAddToCart,
  onToggleWishlist,
  wishlistIds = [],
  cartItemIds = [],
  isLoading = false
}) {
  const { slug } = useParams();
  const [searchQuery, setSearchQuery] = useState('');

  const currentCategory = CATEGORIES.find(c => c.id === slug) || {
    id: slug,
    name: slug ? slug.replace(/-/g, ' ').toUpperCase() : 'Category',
    description: 'Explore tailored hair systems and accessories in this collection.',
    image: '/brand/logo.png'
  };

  const categoryProducts = products.filter(p => p.category === slug || (slug === 'all'));

  return (
    <div className="min-h-screen bg-surface-soft">
      
      {/* Category Hero Header */}
      <section className="bg-gradient-to-r from-brand-900 via-brand-800 to-slate-900 text-white py-12 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          
          <Link to="/products" className="inline-flex items-center gap-1.5 text-xs text-brand-300 hover:text-white transition">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Collections</span>
          </Link>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-1">
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-brand-300 bg-white/10 px-2.5 py-1 rounded-full">
                Category Collection
              </span>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                {currentCategory.name}
              </h1>
              <p className="text-xs sm:text-sm text-brand-200 max-w-xl">
                {currentCategory.description}
              </p>
            </div>

            <div className="text-xs text-brand-200 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl self-start md:self-auto font-medium">
              Showing {categoryProducts.length} Systems Available
            </div>
          </div>

        </div>
      </section>

      {/* Product Grid Filtered to Category */}
      <ProductGrid
        products={categoryProducts}
        activeCategory={slug}
        onSelectCategory={() => {}}
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

