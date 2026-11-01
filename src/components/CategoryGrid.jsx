import React from 'react';
import { Sparkles, Heart, ShieldCheck, Droplets, Sun, ArrowUpRight } from 'lucide-react';
import { CATEGORIES } from '../config/siteConfig';

const iconMap = {
  Sparkles: Sparkles,
  Heart: Heart,
  ShieldCheck: ShieldCheck,
  Droplets: Droplets,
  Sun: Sun,
};

export default function CategoryGrid({ onSelectCategory, activeCategory }) {
  return (
    <section id="categories" className="py-14 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-bold text-brand-600 uppercase tracking-widest">
              Explore Our Specialist Range
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Shop by Category
            </h2>
          </div>
          <p className="text-sm text-slate-500 max-w-md">
            From hand-tied French lace patches to medical-grade adhesives, discover products tailored for comfort, durability, and a 100% natural hairline.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {CATEGORIES.map((cat) => {
            const IconComponent = iconMap[cat.icon] || Sparkles;
            const isSelected = activeCategory === cat.id;

            return (
              <div
                key={cat.id}
                onClick={() => {
                  onSelectCategory(cat.id);
                  const el = document.getElementById('products');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col justify-between p-5 border ${
                  isSelected 
                    ? 'border-brand-600 bg-brand-50/50 shadow-hover ring-2 ring-brand-500/20' 
                    : 'border-slate-200/90 bg-white hover:border-brand-300 shadow-subtle hover:shadow-premium'
                }`}
              >
                {/* Background image preview with subtle overlay */}
                <div className="relative aspect-4/3 rounded-xl overflow-hidden mb-4 bg-slate-100">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent"></div>
                  
                  {/* Badge */}
                  <span className="absolute top-2.5 left-2.5 bg-brand-900/80 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {cat.badge}
                  </span>

                  <span className="absolute bottom-2.5 left-2.5 text-white text-xs font-semibold">
                    {cat.count} Products
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center justify-between">
                    <div className="w-8 h-8 rounded-lg bg-brand-100 flex items-center justify-center text-brand-600">
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-brand-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm group-hover:text-brand-600 transition pt-1">
                    {cat.name}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2">
                    {cat.description}
                  </p>
                </div>

                {/* Filter indicator */}
                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold">
                  <span className={isSelected ? 'text-brand-700' : 'text-slate-500 group-hover:text-brand-600'}>
                    {isSelected ? 'Active Filter ✓' : 'View Products'}
                  </span>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
