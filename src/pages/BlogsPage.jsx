import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Calendar, 
  User, 
  ArrowRight, 
  Search, 
  Sparkles, 
  Clock, 
  X,
  MessageCircle
} from 'lucide-react';
import { resolveImageUrl } from '../services/imageService';
import { handleConsultation } from '../utils/whatsapp';

const DEFAULT_BLOGS = [
  {
    _id: '1',
    slug: 'how-to-wash-and-maintain-swiss-lace-hair-patch',
    title: 'How to Wash & Maintain Your Swiss Lace Hair Patch in Summer',
    author: 'Dr. Looks Forever Team',
    category: 'Hair Care & Maintenance',
    createdAt: new Date().toISOString(),
    excerpt: 'Essential tips on sulphate-free shampooing, lukewarm water rinsing, knot conditioning, and adhesive longevity during hot, humid Indian weather.',
    featuredImage: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80&w=800',
    content: `<h3>1. Use Lukewarm or Cool Water Only</h3><p>Never rinse your lace hair patch with hot water. High temperatures soften the polyurethane perimeter and weaken delicate hand-tied bleached knots. Use gentle, running lukewarm or cool water.</p><h3>2. Choose Sulphate-Free Shampoos</h3><p>Standard commercial shampoos contain harsh sodium lauryl sulphates (SLS) that strip moisture from 100% human hair. Always use moisture-replenishing salon shampoos formulated for human hair prosthetics.</p><h3>3. Gently Smooth, Never Rub Vigorous Circles</h3><p>Lather shampoo in your hands and stroke downwards through the hair strands from base to tip. Never scrub or twist the patch vigorously in circles to avoid tangling.</p><h3>4. Condition the Ends, Avoid the Lace Knots</h3><p>Apply deep conditioner only to the mid-lengths and tips. Applying heavy conditioner directly onto the Swiss lace base can lubricate knots and cause premature shedding.</p>`
  },
  {
    _id: '2',
    slug: 'difference-between-french-lace-and-thin-skin-hair-patch',
    title: 'French Lace vs Ultra-Thin Poly Skin: Which Hair Patch Should You Choose?',
    author: 'Senior Trichology Stylist',
    category: 'System Comparison',
    createdAt: new Date().toISOString(),
    excerpt: 'A comprehensive technical comparison between breathable French lace and micro-skin bases in terms of breathability, durability, ease of cleaning, and natural look.',
    featuredImage: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&q=80&w=800',
    content: `<h3>Breathability Comparison</h3><p>If you live in Delhi NCR, workout regularly, or ride a motorcycle with a helmet, French and Swiss lace offer superior airflow. The porous mesh lets your scalp breathe and perspiration evaporate naturally.</p><h3>Ease of Cleaning & Tape Removal</h3><p>Poly skin systems (such as Mirage and Polyfuse) are significantly easier to clean. When removing old Ultra Hold tape with C-22 solvent, the smooth polyurethane surface wipes clean in seconds without catching in lace mesh.</p><h3>The Verdict</h3><p>For most men in North India, a <strong>hybrid system</strong> featuring an invisible French lace front with thin poly skin sides and back provides the ultimate combination of an undetectable hairline and effortless maintenance.</p>`
  },
  {
    _id: '3',
    slug: 'can-you-swim-and-workout-with-hair-patch',
    title: 'Can You Swim, Gym & Ride Two-Wheelers with a Hair System?',
    author: 'Looks Forever Clinical Team',
    category: 'Lifestyle & Sports',
    createdAt: new Date().toISOString(),
    excerpt: 'Debunking myths about non-surgical hair systems. How medical-grade waterproof adhesives withstand chlorinated water, sea salt, sweat, and tight helmet padding.',
    featuredImage: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=800',
    content: `<h3>The Science of Medical Bonding</h3><p>Modern hair system adhesives (such as Ultra Hold, Ghost Bond, and Walker Tape) are polymer-based medical bonding agents. Once cured (usually 24 hours after application), they form a flexible, waterproof membrane between your scalp and the system.</p><h3>Swimming Guidelines</h3><p>You can freely swim in private pools, hotels, and the ocean. We recommend applying a leave-in conditioner before entering chlorine water to shield the hair cuticle from chemical drying.</p><h3>Helmet Comfort</h3><p>Always wear a breathable cotton balaclava or helmet liner underneath your motorcycle helmet to prevent friction against the perimeter edges.</p>`
  }
];

export default function BlogsPage() {
  const [blogs, setBlogs] = useState(DEFAULT_BLOGS);
  const [search, setSearch] = useState('');
  const [selectedBlog, setSelectedBlog] = useState(null);

  useEffect(() => {
    fetch('/api/blogs')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        const list = Array.isArray(data) ? data : (data?.blogs || []);
        if (list.length > 0) {
          setBlogs(list);
        }
      })
      .catch(() => {});
  }, []);

  const filteredBlogs = blogs.filter(b => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return b.title?.toLowerCase().includes(q) || b.excerpt?.toLowerCase().includes(q) || b.category?.toLowerCase().includes(q);
  });

  return (
    <div className="min-h-screen bg-surface-soft space-y-12 pb-16 selection:bg-brand-500 selection:text-white">
      
      {/* Header Banner */}
      <section className="bg-gradient-to-r from-brand-900 via-brand-800 to-slate-900 text-white py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-brand-200 text-xs font-semibold uppercase tracking-wider">
            <FileText className="w-3.5 h-3.5 text-accent-cyan" />
            <span>Clinical Knowledge & Patient Care Hub</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight max-w-3xl">
            Hair Care Guides & Maintenance Tips
          </h1>

          <p className="text-xs sm:text-base text-brand-200 max-w-2xl leading-relaxed">
            Expert clinical advice from the Looks Forever team on non-surgical hair replacement, lace washing, adhesive selection, and daily scalp care.
          </p>

          <div className="pt-2 max-w-md">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search articles on washing, tape, lace, swimming..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs sm:text-sm bg-white/10 backdrop-blur-md text-white placeholder-slate-300 border border-white/20 focus:outline-none focus:ring-2 focus:ring-brand-400"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filteredBlogs.map((b) => (
            <article 
              key={b._id || b.slug}
              className="bg-white rounded-3xl border border-slate-200/90 shadow-subtle overflow-hidden flex flex-col justify-between hover:border-brand-300 hover:shadow-premium transition-all duration-300 group"
            >
              <div className="space-y-4">
                <div className="aspect-16/9 overflow-hidden bg-slate-100 relative">
                  <img
                    src={resolveImageUrl(b.featuredImage)}
                    alt={b.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute top-3 left-3 bg-brand-900/80 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                    {b.category || 'Hair Care'}
                  </span>
                </div>

                <div className="p-6 pt-2 space-y-2.5">
                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1 font-medium text-slate-600">
                      <User className="w-3 h-3 text-brand-600" />
                      {b.author || 'Looks Forever'}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(b.createdAt || Date.now()).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>

                  <h2 
                    onClick={() => setSelectedBlog(b)}
                    className="font-bold text-slate-900 text-base group-hover:text-brand-600 transition cursor-pointer line-clamp-2 leading-snug"
                  >
                    {b.title}
                  </h2>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {b.excerpt}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0">
                <button
                  onClick={() => setSelectedBlog(b)}
                  className="w-full bg-slate-50 hover:bg-brand-50 text-slate-700 hover:text-brand-600 font-bold py-2.5 rounded-xl text-xs transition border border-slate-200 flex items-center justify-center gap-1.5"
                >
                  <span>Read Full Guide</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Article Reading Modal */}
      {selectedBlog && (
        <div 
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setSelectedBlog(null)}
        >
          <div 
            className="bg-white text-slate-900 rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl relative animate-in zoom-in-95 max-h-[90vh] overflow-y-auto space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-brand-600 uppercase tracking-wider bg-brand-50 px-2 py-0.5 rounded">
                  {selectedBlog.category}
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
                  {selectedBlog.title}
                </h2>
                <div className="text-xs text-slate-400">
                  By {selectedBlog.author} • {new Date(selectedBlog.createdAt || Date.now()).toLocaleDateString()}
                </div>
              </div>

              <button 
                onClick={() => setSelectedBlog(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {selectedBlog.featuredImage && (
              <div className="aspect-16/9 rounded-2xl overflow-hidden bg-slate-100">
                <img
                  src={resolveImageUrl(selectedBlog.featuredImage)}
                  alt={selectedBlog.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div 
              className="prose prose-sm max-w-none prose-slate text-xs sm:text-sm leading-relaxed"
              dangerouslySetInnerHTML={{ __html: selectedBlog.content || selectedBlog.excerpt }}
            />

            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                onClick={() => handleConsultation(`Query from blog: ${selectedBlog.title}`)}
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Ask Specialist on WhatsApp</span>
              </button>

              <button
                onClick={() => setSelectedBlog(null)}
                className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 px-4 rounded-xl text-xs"
              >
                Close Article
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

