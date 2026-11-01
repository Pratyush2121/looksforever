import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, MessageCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { handleCartCheckout, formatVariantString } from '../utils/whatsapp';

export default function CartDrawer({ 
  isOpen, 
  onClose, 
  cartItems = [], 
  onUpdateQuantity, 
  onRemoveItem,
  onClearCart 
}) {
  const [customNotes, setCustomNotes] = useState('');

  if (!isOpen) return null;

  const totalAmount = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

  const handleCheckout = () => {
    handleCartCheckout(cartItems, customNotes);
  };

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
            <ShoppingBag className="w-5 h-5 text-brand-600" />
            <h3 className="font-bold text-slate-900 text-lg">Your Order Bag</h3>
            <span className="bg-brand-100 text-brand-700 text-xs font-bold px-2 py-0.5 rounded-full">
              {cartItems.reduce((acc, i) => acc + i.quantity, 0)}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cartItems.length > 0 ? (
            cartItems.map((item, index) => (
              <div 
                key={`${item.product.id}-${index}`}
                className="bg-slate-50/70 p-3.5 rounded-2xl border border-slate-200/80 flex gap-3.5 relative"
              >
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-18 h-18 rounded-xl object-cover border border-slate-200 shrink-0"
                />

                <div className="flex-1 space-y-1 overflow-hidden">
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm truncate">
                    {item.product.name}
                  </h4>

                  <div className="text-[11px] text-brand-700 font-medium truncate">
                    {formatVariantString(item.variant)}
                  </div>

                  <div className="text-sm font-extrabold text-slate-900">
                    ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                    {item.quantity > 1 && (
                      <span className="text-[11px] text-slate-400 font-normal ml-1">
                        (₹{item.product.price.toLocaleString('en-IN')} each)
                      </span>
                    )}
                  </div>

                  {/* Quantity controls */}
                  <div className="flex items-center gap-2 pt-1">
                    <div className="flex items-center border border-slate-200 rounded-lg bg-white overflow-hidden text-xs">
                      <button
                        onClick={() => onUpdateQuantity(index, item.quantity - 1)}
                        className="px-2 py-0.5 text-slate-600 hover:bg-slate-100 font-bold"
                      >
                        -
                      </button>
                      <span className="px-2.5 py-0.5 font-bold text-slate-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(index, item.quantity + 1)}
                        className="px-2 py-0.5 text-slate-600 hover:bg-slate-100 font-bold"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => onRemoveItem(index)}
                      className="text-slate-400 hover:text-rose-500 p-1 text-xs"
                      title="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            ))
          ) : (
            <div className="text-center py-16 space-y-3">
              <div className="w-16 h-16 bg-brand-50 text-brand-500 rounded-full flex items-center justify-center mx-auto">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h4 className="text-base font-bold text-slate-800">Your bag is empty</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Browse our hair patches, wigs, bonding tapes, and care kits to add items to your WhatsApp order.
              </p>
              <button
                onClick={onClose}
                className="mt-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition"
              >
                Start Shopping
              </button>
            </div>
          )}
        </div>

        {/* Footer & Checkout */}
        {cartItems.length > 0 && (
          <div className="p-5 border-t border-slate-100 space-y-3 bg-white">
            
            {/* Custom Notes */}
            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                Special Request / Hair System Specifications:
              </label>
              <input
                type="text"
                value={customNotes}
                onChange={(e) => setCustomNotes(e.target.value)}
                placeholder="e.g. Please call before dispatch / Need 8x6 patch"
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
            </div>

            {/* Total */}
            <div className="flex items-baseline justify-between pt-1">
              <span className="text-sm font-semibold text-slate-600">Total Estimated:</span>
              <span className="text-2xl font-extrabold text-slate-900">
                ₹{totalAmount.toLocaleString('en-IN')}
              </span>
            </div>

            {/* WhatsApp Order Checkout */}
            <button
              onClick={handleCheckout}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-4 rounded-xl text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Checkout All on WhatsApp</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
              <span className="flex items-center gap-1 text-emerald-600">
                <ShieldCheck className="w-3.5 h-3.5" /> No advance fee needed
              </span>
              <button onClick={onClearCart} className="hover:text-rose-500 transition">
                Clear Cart
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
