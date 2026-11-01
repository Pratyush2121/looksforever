import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Search, 
  Heart, 
  ShoppingBag, 
  Menu, 
  X, 
  MessageCircle, 
  Award, 
  Sparkles, 
  MapPin, 
  PhoneCall,
  ChevronDown,
  Calendar,
  Layers,
  FileText,
  UserCheck
} from 'lucide-react';
import { CATEGORIES } from '../config/siteConfig';
import { handleConsultation } from '../utils/whatsapp';

export default function Navbar({ 
  cartCount = 0, 
  wishlistCount = 0, 
  onOpenCart, 
  onOpenWishlist, 
  onOpenConsultation,
  onSearchClick
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [categoriesDropdownOpen, setCategoriesDropdownOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setServicesDropdownOpen(false);
    setCategoriesDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  const serviceItems = [
    { name: 'Men’s Hair Patches & Toupees', desc: 'Custom Swiss lace and ultra-thin poly skin patches', path: '/services#mens' },
    { name: 'Hair Bonding (24/7 Wear)', desc: 'Waterproof medical-grade fixing and continuous hold', path: '/services#bonding' },
    { name: 'Hair Clipping (Daily Removable)', desc: 'Micro-clip systems for home removal at night', path: '/services#clipping' },
    { name: 'Hair Weaving (Track-Based)', desc: 'No-shaving interlocked hair replacement', path: '/services#weaving' },
    { name: 'Women’s Crown Toppers & Wigs', desc: 'Silk parting additions and featherlight volume', path: '/services#womens' },
    { name: 'Studio Servicing & Patch Repair', desc: 'Deep cleaning, knot repair, tape rebonding', path: '/services#maintenance' }
  ];

  return (
    <header className={`sticky top-0 z-40 bg-white transition-all duration-300 ${
      isScrolled ? 'shadow-md py-2.5 border-b border-slate-100' : 'py-3.5 border-b border-slate-100'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-3 group shrink-0"
          >
            <div className="h-10 sm:h-12 flex items-center justify-center">
              <img 
                src="/brand/logo.png" 
                alt="Looks Forever Hair Aesthetic Clinic" 
                className="h-9 sm:h-11 w-auto max-w-[200px] sm:max-w-[250px] object-contain transition-transform group-hover:scale-[1.02]" 
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/brand/logo-cropped.png';
                }}
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-6 text-xs font-semibold text-slate-700 font-display">
            {/* Home */}
            <Link 
              to="/" 
              className={`transition py-1 relative group ${
                location.pathname === '/' ? 'text-brand-600 font-bold' : 'hover:text-brand-600'
              }`}
            >
              Home
              {location.pathname === '/' && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-600 rounded"></span>
              )}
            </Link>

            {/* Services Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setServicesDropdownOpen(true)}
              onMouseLeave={() => setServicesDropdownOpen(false)}
            >
              <Link 
                to="/services" 
                className={`flex items-center gap-1 transition py-1 ${
                  location.pathname === '/services' ? 'text-brand-600 font-bold' : 'hover:text-brand-600'
                }`}
              >
                <span>Fixing Methods</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-60" />
              </Link>

              {servicesDropdownOpen && (
                <div className="absolute top-full left-0 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 py-3 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 pb-2 mb-1 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Hair Fixing Methods
                  </div>
                  {serviceItems.map((item, idx) => (
                    <Link
                      key={idx}
                      to={item.path}
                      className="block px-4 py-2 hover:bg-brand-50 transition"
                    >
                      <div className="text-xs font-bold text-slate-800 hover:text-brand-600">{item.name}</div>
                      <div className="text-[11px] text-slate-500 leading-tight mt-0.5">{item.desc}</div>
                    </Link>
                  ))}
                  <div className="p-2 mt-1 border-t border-slate-100 bg-slate-50/70 text-center">
                    <Link to="/services" className="text-xs font-bold text-brand-600 hover:text-brand-700">
                      View All Treatments →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Products / Shop Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setCategoriesDropdownOpen(true)}
              onMouseLeave={() => setCategoriesDropdownOpen(false)}
            >
              <Link 
                to="/products" 
                className={`flex items-center gap-1 transition py-1 ${
                  location.pathname === '/products' || location.pathname.startsWith('/category/') ? 'text-brand-600 font-bold' : 'hover:text-brand-600'
                }`}
              >
                <span>Products Collection</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-60" />
              </Link>

              {categoriesDropdownOpen && (
                <div className="absolute top-full left-0 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 py-3 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 pb-2 mb-1 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Product Categories
                  </div>
                  {CATEGORIES.map((cat) => (
                    <Link
                      key={cat.id}
                      to={`/category/${cat.id}`}
                      className="w-full text-left px-4 py-2 text-xs hover:bg-brand-50 hover:text-brand-600 flex items-center justify-between text-slate-600 transition"
                    >
                      <span>{cat.name}</span>
                      <span className="text-[10px] bg-brand-100/60 text-brand-700 px-2 py-0.5 rounded-full font-medium">
                        {cat.count}
                      </span>
                    </Link>
                  ))}
                  <div className="p-2 mt-1 border-t border-slate-100 bg-slate-50/70 text-center">
                    <Link to="/products" className="text-xs font-bold text-brand-600 hover:text-brand-700">
                      Browse Full Catalog →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Transformations & Awards */}
            <Link 
              to="/gallery" 
              className={`flex items-center gap-1 transition py-1 ${
                location.pathname === '/gallery' ? 'text-brand-600 font-bold' : 'hover:text-brand-600'
              }`}
            >
              <Award className="w-3.5 h-3.5 text-amber-500" />
              <span>Before & After</span>
            </Link>

            {/* About Us */}
            <Link 
              to="/about" 
              className={`transition py-1 ${
                location.pathname === '/about' ? 'text-brand-600 font-bold' : 'hover:text-brand-600'
              }`}
            >
              About Studio
            </Link>

            {/* Blog & Guides */}
            <Link 
              to="/blogs" 
              className={`transition py-1 ${
                location.pathname === '/blogs' ? 'text-brand-600 font-bold' : 'hover:text-brand-600'
              }`}
            >
              Hair Guides
            </Link>

            {/* Contact */}
            <Link 
              to="/contact" 
              className={`flex items-center gap-1 transition py-1 ${
                location.pathname === '/contact' ? 'text-brand-600 font-bold' : 'hover:text-brand-600'
              }`}
            >
              <MapPin className="w-3.5 h-3.5 text-brand-500" />
              <span>Noida Studio</span>
            </Link>
          </nav>

          {/* Right Actions: Search, Wishlist, Cart, Book Consultation, WhatsApp */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Search */}
            <button 
              onClick={onSearchClick}
              aria-label="Search products"
              className="p-2 text-slate-600 hover:text-brand-600 hover:bg-brand-50 rounded-full transition"
              title="Search products and systems..."
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Wishlist */}
            <button 
              onClick={onOpenWishlist}
              aria-label="Wishlist"
              className="p-2 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-full transition relative"
              title="Saved items"
            >
              <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-scale">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Bag */}
            <button 
              onClick={onOpenCart}
              aria-label="Shopping Cart"
              className="p-2 text-slate-700 hover:text-brand-600 hover:bg-brand-50 rounded-full transition relative"
              title="Order bag & checkout"
            >
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-brand-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-scale">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Book Free Fitting */}
            <button 
              onClick={onOpenConsultation}
              className="hidden sm:inline-flex items-center gap-1.5 bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white font-bold px-3.5 py-2 rounded-xl text-xs transition shadow-sm font-display tracking-wide"
            >
              <Calendar className="w-3.5 h-3.5 text-accent-cyan" />
              <span>Book Free Fitting</span>
            </button>

            {/* Direct WhatsApp CTA */}
            <button 
              onClick={() => handleConsultation('General Consultation Inquiry')}
              className="hidden md:inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-3 py-1.5 rounded-xl text-xs transition shadow-xs hover:shadow"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 text-slate-700 hover:text-brand-600 rounded-lg hover:bg-slate-100 transition"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden fixed inset-0 top-[60px] z-50 bg-black/40 backdrop-blur-xs animate-in fade-in" onClick={() => setMobileMenuOpen(false)}>
          <div 
            className="w-4/5 max-w-sm h-full bg-white p-6 shadow-2xl flex flex-col justify-between overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-5">
              <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
                <img 
                  src="/brand/logo.png" 
                  alt="Looks Forever" 
                  className="h-8 w-auto object-contain" 
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/brand/logo-cropped.png';
                  }}
                />
                <button onClick={() => setMobileMenuOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links */}
              <div className="space-y-2 font-medium text-xs text-slate-700">
                <Link 
                  to="/" 
                  className={`block px-3 py-2.5 rounded-xl font-bold transition ${location.pathname === '/' ? 'bg-brand-50 text-brand-600' : 'hover:bg-slate-50'}`}
                >
                  Home (Clinic Overview)
                </Link>

                <Link 
                  to="/services" 
                  className={`block px-3 py-2.5 rounded-xl font-bold transition ${location.pathname === '/services' ? 'bg-brand-50 text-brand-600' : 'hover:bg-slate-50'}`}
                >
                  Six Ways to Put Hair Back (Fixing Methods)
                </Link>

                <Link 
                  to="/products" 
                  className={`block px-3 py-2.5 rounded-xl font-bold transition ${location.pathname === '/products' ? 'bg-brand-50 text-brand-600' : 'hover:bg-slate-50'}`}
                >
                  Hair Systems & Accessories Catalog
                </Link>

                {/* Categories Sublist */}
                <div className="pl-3 space-y-1 py-1 border-l-2 border-brand-100 ml-3">
                  {CATEGORIES.map(cat => (
                    <Link
                      key={cat.id}
                      to={`/category/${cat.id}`}
                      className="block px-2 py-1 text-[11px] text-slate-500 hover:text-brand-600"
                    >
                      • {cat.name} ({cat.count})
                    </Link>
                  ))}
                </div>

                <Link 
                  to="/gallery" 
                  className={`block px-3 py-2.5 rounded-xl font-bold transition flex items-center gap-1.5 ${location.pathname === '/gallery' ? 'bg-brand-50 text-brand-600' : 'hover:bg-slate-50 text-amber-700'}`}
                >
                  <Award className="w-4 h-4 text-amber-500" />
                  <span>Before & After Results</span>
                </Link>

                <Link 
                  to="/about" 
                  className={`block px-3 py-2.5 rounded-xl font-bold transition ${location.pathname === '/about' ? 'bg-brand-50 text-brand-600' : 'hover:bg-slate-50'}`}
                >
                  About Looks Forever Studio
                </Link>

                <Link 
                  to="/blogs" 
                  className={`block px-3 py-2.5 rounded-xl font-bold transition ${location.pathname === '/blogs' ? 'bg-brand-50 text-brand-600' : 'hover:bg-slate-50'}`}
                >
                  Hair Patch Maintenance Guides
                </Link>

                <Link 
                  to="/contact" 
                  className={`block px-3 py-2.5 rounded-xl font-bold transition flex items-center gap-1.5 ${location.pathname === '/contact' ? 'bg-brand-50 text-brand-600' : 'hover:bg-slate-50'}`}
                >
                  <MapPin className="w-4 h-4 text-brand-500" />
                  <span>Visit Wave Mall Noida Studio</span>
                </Link>
              </div>
            </div>

            {/* Mobile Drawer Bottom CTAs */}
            <div className="pt-6 border-t border-slate-100 space-y-2.5">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenConsultation();
                }}
                className="w-full bg-gradient-to-r from-brand-600 to-brand-700 text-white font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-xs text-xs"
              >
                <Calendar className="w-4 h-4 text-accent-cyan" />
                <span>Book Free Appointment</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleConsultation('Hair Assessment & Sizing Help');
                }}
                className="w-full bg-emerald-600 text-white font-medium py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-xs text-xs"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </header>
  );
}
