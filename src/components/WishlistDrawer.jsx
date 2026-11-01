import React from 'react';
import { X, Heart, Trash2, ShoppingBag, MessageCircle } from 'lucide-react';
import { handleBuyNow } from '../utils/whatsapp';

export default function WishlistDrawer({
  isOpen,
  onClose,
  wishlistItems = [],
  onRemoveFromWishlist,
  onAddToCart,
  onQuickView
}) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end animate-in fade-in"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            <h3 className="font-bold text-slate-900 text-lg">Saved Wishlist</h3>
            <span className="bg-rose-100 text-rose-700 text-xs font-bold px-2 py-0.5 rounded-full">
              {wishlistItems.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wishlist Items */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {wishlistItems.length > 0 ? (
            wishlistItems.map((product) => (
              <div 
                key={product.id}
                className="bg-slate-50/70 p-3.5 rounded-2xl border border-slate-200/80 flex gap-3.5"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  onClick={() => {
                    onClose();
                    onQuickView(product);
                  }}
                  className="w-18 h-18 rounded-xl object-cover border border-slate-200 shrink-0 cursor-pointer"
                />

                <div className="flex-1 space-y-1 overflow-hidden">
                  <h4 
                    onClick={() => {
                      onClose();
                      onQuickView(product);
                    }}
                    className="font-bold text-slate-900 text-xs sm:text-sm truncate cursor-pointer hover:text-brand-600"
                  >
                    {product.name}
                  </h4>

                  <div className="text-sm font-extrabold text-slate-900">
                    ₹{product.price.toLocaleString('en-IN')}
                    {product.originalPrice && (
                      <span className="text-[11px] text-slate-400 line-through ml-1.5">
                        ₹{product.originalPrice.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2">
                    <button
                      onClick={() => {
                        onAddToCart(product);
                        onRemoveFromWishlist(product.id);
                      }}
                      className="bg-brand-50 hover:bg-brand-100 text-brand-700 font-semibold px-2.5 py-1 rounded-lg text-xs flex items-center gap-1 border border-brand-200"
                    >
                      <ShoppingBag className="w-3 h-3" />
                      <span>Move to Bag</span>
                    </button>

                    <button
                      onClick={() => handleBuyNow(product)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-2.5 py-1 rounded-lg text-xs flex items-center gap-1"
                    >
                      <MessageCircle className="w-3 h-3" />
                      <span>Buy Now</span>
                    </button>

                    <button
                      onClick={() => onRemoveFromWishlist(product.id)}
                      className="text-slate-400 hover:text-rose-500 p-1 ml-auto"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>

              </div>
            ))
          ) : (
            <div className="text-center py-16 space-y-3">
              <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto">
                <Heart className="w-8 h-8" />
              </div>
              <h4 className="text-base font-bold text-slate-800">Your wishlist is empty</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Tap the heart icon on any hair patch or aesthetic product to save it for later.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-slate-100 bg-white">
          <button
            onClick={onClose}
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2.5 rounded-xl text-xs transition"
          >
            Continue Browsing
          </button>
        </div>

      </div>
    </div>
  );
}
