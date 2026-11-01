import React, { useState, useEffect } from 'react';
import { 
  X, 
  Star, 
  Heart, 
  ShoppingBag, 
  MessageCircle, 
  Check, 
  ShieldCheck, 
  Truck, 
  Sparkles, 
  HelpCircle,
  Eye,
  Calendar
} from 'lucide-react';
import { handleBuyNow, generateSingleOrderMessage, formatVariantString } from '../utils/whatsapp';

export default function ProductDetailsModal({ 
  product, 
  onClose, 
  onAddToCart, 
  onToggleWishlist, 
  isWishlisted = false,
  allProducts = [],
  onSelectRelated,
  onBookConsultation
}) {
  if (!product) return null;

  // Selected image gallery index
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const gallery = product.gallery && product.gallery.length > 0 ? product.gallery : [product.image];

  // Quantity state
  const [quantity, setQuantity] = useState(1);

  // Selected variants state
  const [selectedVariants, setSelectedVariants] = useState(() => {
    if (!product.variants) return {};
    const initial = {};
    product.variants.forEach((v) => {
      initial[v.name] = v.options[0];
    });
    return initial;
  });

  const [customerNote, setCustomerNote] = useState('');
  const [showLivePreview, setShowLivePreview] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  // Reset image and state when product changes
  useEffect(() => {
    setSelectedImageIndex(0);
    setQuantity(1);
    setIsAdded(false);
    if (product.variants) {
      const initial = {};
      product.variants.forEach((v) => {
        initial[v.name] = v.options[0];
      });
      setSelectedVariants(initial);
    }
  }, [product.id]);

  // Prevent background scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const handleVariantChange = (variantName, option) => {
    setSelectedVariants(prev => ({
      ...prev,
      [variantName]: option
    }));
  };

  const handleCartClick = () => {
    onAddToCart(product, quantity, selectedVariants);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  // Related products from the same category
  const relatedProducts = allProducts
    .filter(p => p.id !== product.id && p.category === product.category)
    .slice(0, 3);

  // Live preview message
  const liveMessage = generateSingleOrderMessage(product, quantity, selectedVariants, customerNote);

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-100 my-auto flex flex-col relative animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 bg-slate-100 hover:bg-slate-200 text-slate-700 p-2 rounded-full transition shadow-sm"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 p-6 sm:p-8">
          
          {/* Left Column: Image Gallery */}
          <div className="md:col-span-6 space-y-4">
            
            {/* Main Featured Image */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
              <img
                src={gallery[selectedImageIndex] || product.image}
                alt={product.name}
                className="w-full h-full object-cover transition-all duration-300"
              />
              {product.badge && (
                <span className="absolute top-3 left-3 bg-brand-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                  {product.badge}
                </span>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {gallery.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {gallery.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden shrink-0 border-2 transition ${
                      selectedImageIndex === idx ? 'border-brand-600 ring-2 ring-brand-400/30' : 'border-slate-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Trust highlights */}
            <div className="bg-brand-50/60 rounded-2xl p-4 border border-brand-100/80 space-y-2 text-xs text-slate-600">
              <div className="flex items-center gap-2 font-semibold text-brand-900">
                <ShieldCheck className="w-4 h-4 text-brand-600" />
                <span>Looks Forever Quality Guarantee</span>
              </div>
              <ul className="space-y-1 pl-6 list-disc text-slate-600 text-[11px]">
                <li>100% Genuine Natural Human Hair</li>
                <li>Free Video Consultation for size & shade matching</li>
                <li>Discrete plain box packaging for 100% privacy</li>
              </ul>
            </div>

          </div>

          {/* Right Column: Product Details & Buying Actions */}
          <div className="md:col-span-6 space-y-5">
            
            <div>
              {/* Rating & Category */}
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-semibold text-brand-600 uppercase tracking-wider">
                  {product.category.replace('-', ' ')}
                </span>
                <div className="flex items-center gap-1 text-amber-500 font-bold">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span>{product.rating}</span>
                  <span className="text-slate-400 font-normal">({product.reviewCount} customer reviews)</span>
                </div>
              </div>

              {/* Title */}
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-snug">
                {product.name}
              </h2>
            </div>

            {/* Price section */}
            <div className="flex items-baseline gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
              <span className="text-3xl font-extrabold text-slate-900">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.originalPrice && (
                <span className="text-base text-slate-400 line-through">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
              {product.discount && (
                <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-full">
                  {product.discount}
                </span>
              )}
            </div>

            {/* Full Description */}
            <p className="text-sm text-slate-600 leading-relaxed">
              {product.description}
            </p>

            {/* Interactive Variants Selector */}
            {product.variants && product.variants.map((variant) => (
              <div key={variant.name} className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700">{variant.name}:</span>
                  <span className="text-brand-600 font-semibold">{selectedVariants[variant.name]}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {variant.options.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => handleVariantChange(variant.name, opt)}
                      className={`text-xs px-3.5 py-2 rounded-xl font-medium border transition ${
                        selectedVariants[variant.name] === opt
                          ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-brand-400 hover:bg-brand-50/50'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 pt-2">
              <span className="text-xs font-bold text-slate-700">Quantity:</span>
              <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-200 font-bold transition text-sm"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="px-4 py-1.5 text-sm font-bold text-slate-900 bg-white">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-200 font-bold transition text-sm"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>

            {/* Specifications Table */}
            {product.specifications && (
              <div className="pt-2">
                <div className="text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">
                  Product Specifications:
                </div>
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-xs space-y-1.5">
                  {Object.entries(product.specifications).map(([key, val]) => (
                    <div key={key} className="flex justify-between py-1 border-b border-slate-200/60 last:border-b-0">
                      <span className="text-slate-500 font-medium">{key}</span>
                      <span className="text-slate-900 font-semibold">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Live WhatsApp Message Preview Toggle */}
            <div className="pt-1">
              <button
                onClick={() => setShowLivePreview(!showLivePreview)}
                className="text-xs text-brand-600 hover:text-brand-800 font-medium flex items-center gap-1"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{showLivePreview ? 'Hide WhatsApp Message Preview' : 'Preview WhatsApp Order Message'}</span>
              </button>

              {showLivePreview && (
                <div className="mt-2 p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] font-mono text-emerald-950 whitespace-pre-wrap">
                  {liveMessage}
                </div>
              )}
            </div>

            {/* Buying Action Buttons */}
            <div className="space-y-3 pt-3 border-t border-slate-200">
              
              {/* PRIMARY CTA: BUY NOW ON WHATSAPP */}
              <button
                onClick={() => handleBuyNow(product, quantity, selectedVariants, customerNote)}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-6 rounded-2xl text-sm sm:text-base transition-all flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-600/20 transform hover:-translate-y-0.5"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Buy Now on WhatsApp</span>
              </button>

              {/* Consultation / In-Clinic Trial CTA */}
              {onBookConsultation && (
                <button
                  onClick={() => onBookConsultation(product)}
                  className="w-full bg-gradient-to-r from-brand-700 to-primary-blue hover:from-brand-800 hover:to-brand-700 text-white font-semibold py-2.5 px-4 rounded-xl text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-sm border border-brand-500/30"
                >
                  <Calendar className="w-4 h-4 text-accent-cyan" />
                  <span>Book Free In-Clinic Consultation for this System</span>
                </button>
              )}

              {/* Secondary CTA: Add to Bag + Wishlist */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleCartClick}
                  className={`w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center justify-center gap-2 border ${
                    isAdded
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                      : 'bg-brand-50 hover:bg-brand-100 text-brand-700 border-brand-200'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Bag</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Bag</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => onToggleWishlist(product)}
                  className={`w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center justify-center gap-2 border ${
                    isWishlisted
                      ? 'bg-rose-50 text-rose-600 border-rose-200'
                      : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
                  <span>{isWishlisted ? 'Wishlisted' : 'Save Item'}</span>
                </button>
              </div>

            </div>

          </div>

        </div>

        {/* Bottom Related Products */}
        {relatedProducts.length > 0 && (
          <div className="border-t border-slate-100 bg-slate-50/70 p-6 sm:p-8">
            <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">
              Frequently Purchased Together
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              {relatedProducts.map((rel) => (
                <div
                  key={rel._id || rel.id}
                  onClick={() => onSelectRelated(rel)}
                  className="bg-white p-2.5 sm:p-3 rounded-xl border border-slate-200 hover:border-brand-300 cursor-pointer transition flex flex-col sm:flex-row items-center gap-2 sm:gap-3 shadow-2xs hover:shadow-subtle"
                >
                  <img src={rel.image} alt={rel.name} className="w-full sm:w-14 aspect-[4/5] sm:aspect-square rounded-lg object-cover shrink-0" />
                  <div className="overflow-hidden w-full text-center sm:text-left">
                    <div className="text-[11px] sm:text-xs font-bold text-slate-800 line-clamp-1">{rel.name}</div>
                    <div className="text-xs font-extrabold text-brand-700 mt-0.5">₹{Number(rel.price).toLocaleString('en-IN')}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
