import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import AnnouncementBar from './components/AnnouncementBar';
import OfferSlot from './components/OfferSlot';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProductDetailsModal from './components/ProductDetailsModal';
import CartDrawer from './components/CartDrawer';
import WishlistDrawer from './components/WishlistDrawer';
import ConsultationModal from './components/ConsultationModal';

// Dedicated Radiance-Style Multi-Pages
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import CategoryPage from './pages/CategoryPage';
import ServicesPage from './pages/ServicesPage';
import GalleryPage from './pages/GalleryPage';
import AboutPage from './pages/AboutPage';
import BlogsPage from './pages/BlogsPage';
import ContactPage from './pages/ContactPage';

import { PRODUCTS, CATEGORIES } from './config/siteConfig';
import { handleConsultation, setCachedWhatsAppNumber } from './utils/whatsapp';
import { MessageCircle, ArrowUp } from 'lucide-react';

export default function PublicStorefront() {
  const navigate = useNavigate();
  const location = useLocation();

  // Products and Categories dynamically loaded from MongoDB backend (with fallback to siteConfig)
  const [products, setProducts] = useState(PRODUCTS);
  const [categories, setCategories] = useState(CATEGORIES);
  const [isProductsLoading, setIsProductsLoading] = useState(true);

  // Dynamic Site Settings from MongoDB
  const [homepageSettings, setHomepageSettings] = useState(null);
  const [generalSettings, setGeneralSettings] = useState(null);
  const [headerFooterSettings, setHeaderFooterSettings] = useState(null);

  // Cart state persisted in localStorage
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('looks_forever_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Wishlist state persisted in localStorage
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('looks_forever_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // UI state
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [wishlistDrawerOpen, setWishlistDrawerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Consultation Modal State
  const [consultationModalOpen, setConsultationModalOpen] = useState(false);
  const [consultationSelectedProduct, setConsultationSelectedProduct] = useState(null);

  // 1. Fetch live products from backend REST API
  const loadLiveProducts = useCallback(async () => {
    setIsProductsLoading(true);
    try {
      const response = await fetch('/api/products?limit=100');
      if (response.ok) {
        const data = await response.json();
        const liveProducts = Array.isArray(data) ? data : (data.products || []);
        if (liveProducts.length > 0) {
          setProducts(liveProducts);
        }
      }
    } catch (err) {
      console.warn('Backend not currently reachable via /api/products, using static fallback:', err);
    } finally {
      setIsProductsLoading(false);
    }
  }, []);

  // 2. Fetch live settings & categories
  const loadDynamicSettings = useCallback(async () => {
    // Categories
    try {
      const catRes = await fetch('/api/categories');
      if (catRes.ok) {
        const catData = await catRes.json();
        if (Array.isArray(catData) && catData.length > 0) {
          setCategories(catData);
        }
      }
    } catch {}

    // Homepage settings
    try {
      const homeRes = await fetch('/api/settings?type=homepage');
      if (homeRes.ok) {
        const homeData = await homeRes.json();
        setHomepageSettings(homeData);
      }
    } catch {}

    // General settings (WhatsApp Number, Site Name)
    try {
      const genRes = await fetch('/api/settings?type=general');
      if (genRes.ok) {
        const genData = await genRes.json();
        setGeneralSettings(genData);
        if (genData.general?.whatsappNumber) {
          setCachedWhatsAppNumber(genData.general.whatsappNumber);
        }
      }
    } catch {}

    // Header & Footer settings
    try {
      const hfRes = await fetch('/api/settings?type=header_footer');
      if (hfRes.ok) {
        const hfData = await hfRes.json();
        setHeaderFooterSettings(hfData);
      }
    } catch {}

    // Log Page View Analytics Event
    try {
      fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'page_view',
          path: window.location.pathname
        })
      });
    } catch {}
  }, []);

  useEffect(() => {
    loadLiveProducts();
    loadDynamicSettings();
  }, [loadLiveProducts, loadDynamicSettings]);

  // Track page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    try {
      fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'page_view',
          path: location.pathname
        })
      });
    } catch {}
  }, [location.pathname]);

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('looks_forever_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  // Sync wishlist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('looks_forever_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error(e);
    }
  }, [wishlist]);

  // Scroll listener for back-to-top
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Cart Actions
  const handleAddToCart = (product, quantity = 1, variant = {}) => {
    setCart((prev) => {
      const prodId = product._id || product.id;
      const existingIndex = prev.findIndex(
        (item) => (item.product._id || item.product.id) === prodId && JSON.stringify(item.variant) === JSON.stringify(variant)
      );
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex].quantity += quantity;
        return next;
      } else {
        return [...prev, { product, quantity, variant }];
      }
    });
    showToast(`Added "${product.name.slice(0, 24)}..." to your bag!`);
  };

  const handleUpdateCartQuantity = (index, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveCartItem(index);
      return;
    }
    setCart((prev) => {
      const next = [...prev];
      next[index].quantity = newQuantity;
      return next;
    });
  };

  const handleRemoveCartItem = (index) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
    showToast("Item removed from bag");
  };

  const handleClearCart = () => {
    setCart([]);
    showToast("Bag cleared");
  };

  // Wishlist Actions
  const handleToggleWishlist = (product) => {
    const prodId = product._id || product.id;
    setWishlist((prev) => {
      const exists = prev.some((p) => (p._id || p.id) === prodId);
      if (exists) {
        showToast(`Removed from wishlist`);
        return prev.filter((p) => (p._id || p.id) !== prodId);
      } else {
        showToast(`Saved to wishlist!`);
        return [...prev, product];
      }
    });
  };

  const handleRemoveFromWishlist = (productId) => {
    setWishlist((prev) => prev.filter((p) => (p._id || p.id) !== productId));
  };

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-white text-surface-dark selection:bg-brand-500 selection:text-white">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 right-6 z-50 bg-slate-900/95 text-white px-4 py-2.5 rounded-2xl shadow-2xl text-xs font-semibold backdrop-blur-md border border-slate-700 animate-in fade-in slide-in-from-bottom-2 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Promotional Top Slot */}
      <OfferSlot slot="top_bar" />

      {/* Top Announcement Bar */}
      <AnnouncementBar />

      {/* Sticky Header Navigation */}
      <Navbar
        cartCount={totalCartCount}
        wishlistCount={wishlist.length}
        onOpenCart={() => setCartDrawerOpen(true)}
        onOpenWishlist={() => setWishlistDrawerOpen(true)}
        onOpenConsultation={() => {
          setConsultationSelectedProduct(null);
          setConsultationModalOpen(true);
        }}
        onSearchClick={() => {
          navigate('/products');
        }}
      />

      {/* Multi-Page Routes */}
      <main className="flex-1">
        <Routes>
          {/* Deep Insight Comprehensive Home Page */}
          <Route
            path="/"
            element={
              <HomePage
                products={products}
                homepageSettings={homepageSettings}
                onQuickView={(prod) => setQuickViewProduct(prod)}
                onAddToCart={handleAddToCart}
                onToggleWishlist={handleToggleWishlist}
                wishlistIds={wishlist.map(p => p._id || p.id)}
                cartItemIds={cart.map(item => item.product._id || item.product.id)}
                onOpenConsultation={(prod) => {
                  setConsultationSelectedProduct(prod || null);
                  setConsultationModalOpen(true);
                }}
              />
            }
          />

          {/* Dedicated Products Shop Catalog Page */}
          <Route
            path="/products"
            element={
              <ProductsPage
                products={products}
                onQuickView={(prod) => setQuickViewProduct(prod)}
                onAddToCart={handleAddToCart}
                onToggleWishlist={handleToggleWishlist}
                wishlistIds={wishlist.map(p => p._id || p.id)}
                cartItemIds={cart.map(item => item.product._id || item.product.id)}
                isLoading={isProductsLoading}
              />
            }
          />

          {/* Dedicated Category Page */}
          <Route
            path="/category/:slug"
            element={
              <CategoryPage
                products={products}
                onQuickView={(prod) => setQuickViewProduct(prod)}
                onAddToCart={handleAddToCart}
                onToggleWishlist={handleToggleWishlist}
                wishlistIds={wishlist.map(p => p._id || p.id)}
                cartItemIds={cart.map(item => item.product._id || item.product.id)}
                isLoading={isProductsLoading}
              />
            }
          />

          {/* Dedicated Clinical Treatments & Services Page */}
          <Route
            path="/services"
            element={
              <ServicesPage
                onOpenConsultation={(serviceTitle) => {
                  setConsultationSelectedProduct(serviceTitle ? { name: serviceTitle } : null);
                  setConsultationModalOpen(true);
                }}
              />
            }
          />

          {/* Dedicated Celebrity Transformations & Awards Gallery */}
          <Route
            path="/gallery"
            element={
              <GalleryPage
                onOpenConsultation={() => {
                  setConsultationSelectedProduct(null);
                  setConsultationModalOpen(true);
                }}
              />
            }
          />

          {/* Awards alias redirect to Gallery */}
          <Route
            path="/awards"
            element={
              <GalleryPage
                onOpenConsultation={() => {
                  setConsultationSelectedProduct(null);
                  setConsultationModalOpen(true);
                }}
              />
            }
          />

          {/* Dedicated Clinic Heritage & About Page */}
          <Route
            path="/about"
            element={
              <AboutPage
                onOpenConsultation={() => {
                  setConsultationSelectedProduct(null);
                  setConsultationModalOpen(true);
                }}
              />
            }
          />

          {/* Dedicated Blogs & Guides Hub Page */}
          <Route path="/blogs" element={<BlogsPage />} />

          {/* Dedicated Wave Mall Sector 18 Noida Clinic & Booking Page */}
          <Route path="/contact" element={<ContactPage />} />

          {/* Fallback route back to Home */}
          <Route
            path="*"
            element={
              <HomePage
                products={products}
                homepageSettings={homepageSettings}
                onQuickView={(prod) => setQuickViewProduct(prod)}
                onAddToCart={handleAddToCart}
                onToggleWishlist={handleToggleWishlist}
                wishlistIds={wishlist.map(p => p._id || p.id)}
                cartItemIds={cart.map(item => item.product._id || item.product.id)}
                onOpenConsultation={(prod) => {
                  setConsultationSelectedProduct(prod || null);
                  setConsultationModalOpen(true);
                }}
              />
            }
          />
        </Routes>
      </main>

      {/* Footer */}
      <Footer />

      {/* Dedicated Product Details & Quick View Modal */}
      {quickViewProduct && (
        <ProductDetailsModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
          onAddToCart={handleAddToCart}
          onToggleWishlist={handleToggleWishlist}
          isWishlisted={wishlist.some(p => (p._id || p.id) === (quickViewProduct._id || quickViewProduct.id))}
          allProducts={products}
          onSelectRelated={(p) => setQuickViewProduct(p)}
          onBookConsultation={(prod) => {
            setConsultationSelectedProduct(prod);
            setConsultationModalOpen(true);
          }}
        />
      )}

      {/* Free Clinic Consultation Modal (Feeds CRM Leads DB via /api/contact) */}
      <ConsultationModal
        isOpen={consultationModalOpen}
        onClose={() => {
          setConsultationModalOpen(false);
          setConsultationSelectedProduct(null);
        }}
        preselectedProduct={consultationSelectedProduct}
        onSuccessLead={(lead) => {
          showToast(`Inquiry #${lead._id || lead.id || 'new'} logged in CRM! We will call you soon.`);
        }}
      />

      {/* Order Bag / Cart Drawer with WhatsApp checkout */}
      <CartDrawer
        isOpen={cartDrawerOpen}
        onClose={() => setCartDrawerOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
      />

      {/* Saved Wishlist Drawer */}
      <WishlistDrawer
        isOpen={wishlistDrawerOpen}
        onClose={() => setWishlistDrawerOpen(false)}
        wishlistItems={wishlist}
        onRemoveFromWishlist={handleRemoveFromWishlist}
        onAddToCart={handleAddToCart}
        onQuickView={(p) => setQuickViewProduct(p)}
      />

      {/* Floating Instant WhatsApp Button & Scroll to Top */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2.5">
        {showScrollTop && (
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Scroll to top"
            className="w-10 h-10 rounded-full bg-white shadow-premium border border-slate-200 text-slate-600 hover:text-brand-600 hover:bg-slate-50 flex items-center justify-center transition"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        )}

        <button
          onClick={() => handleConsultation('Hair Patch Assistance & Ordering')}
          className="group flex items-center gap-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold p-3.5 sm:px-4 sm:py-3.5 rounded-full shadow-2xl shadow-emerald-700/30 hover:scale-105 transition-all"
          title="Direct WhatsApp Consultation & Orders"
        >
          <MessageCircle className="w-6 h-6 shrink-0" />
          <span className="hidden sm:inline text-xs font-semibold tracking-wide pr-1">
            Order on WhatsApp
          </span>
        </button>
      </div>

    </div>
  );
}
