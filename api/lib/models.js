import mongoose from 'mongoose';

const { Schema } = mongoose;

// ==========================================
// 1. PRODUCT MODEL
// ==========================================
const ProductSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
    category: { type: String, required: true, index: true, lowercase: true },
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, default: 0 },
    discount: { type: String, default: '' },
    rating: { type: Number, default: 4.9, min: 1, max: 5 },
    reviewCount: { type: Number, default: 0 },
    isBestseller: { type: Boolean, default: false },
    isNewItem: { type: Boolean, default: false },
    badge: { type: String, default: '' },
    shortDesc: { type: String, default: '' },
    description: { type: String, default: '' },
    image: { type: String, required: true },
    gallery: { type: [String], default: [] },
    specifications: { type: Schema.Types.Mixed, default: {} },
    variants: { type: [Schema.Types.Mixed], default: [] },
    active: { type: Boolean, default: true, index: true },
    displayOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

ProductSchema.index({ category: 1, active: 1 });
ProductSchema.index({ createdAt: -1 });

// ==========================================
// 2. CATEGORY MODEL
// ==========================================
const CategorySchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
    shortName: { type: String, default: '' },
    description: { type: String, default: '' },
    icon: { type: String, default: 'Sparkles' },
    badge: { type: String, default: '' },
    image: { type: String, default: '' },
    active: { type: Boolean, default: true, index: true },
    displayOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// ==========================================
// 3. MULTI-PAGE OFFERS MODEL
// ==========================================
const OfferSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, default: '' },
    badgeText: { type: String, default: '' },
    image: { type: String, default: '' },
    buttonText: { type: String, default: 'Claim Offer' },
    buttonLink: { type: String, default: '' },
    styleVariant: {
      type: String,
      enum: ['strip', 'split', 'highlight'],
      default: 'strip',
    },
    startDate: { type: Date, default: null },
    endDate: { type: Date, default: null },
    active: { type: Boolean, default: true, index: true },
    displayOrder: { type: Number, default: 0 },
    placements: {
      type: [String],
      default: ['home-after-hero'],
      index: true,
    },
  },
  { timestamps: true }
);

// ==========================================
// 4. BLOG POST MODEL
// ==========================================
const BlogSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
    excerpt: { type: String, default: '' },
    content: { type: String, required: true }, // Sanitized HTML
    coverImage: { type: String, default: '' },
    author: { type: String, default: 'Looks Forever Medical Team' },
    readTime: { type: String, default: '4 min read' },
    tags: { type: [String], default: [] },
    active: { type: Boolean, default: true, index: true },
    publishedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// ==========================================
// 5. SETTINGS MODEL (Header, Footer, Homepage, etc.)
// ==========================================
const SettingSchema = new Schema(
  {
    section: {
      type: String,
      required: true,
      unique: true,
      index: true,
      enum: ['header', 'footer', 'homepage', 'about', 'contact', 'whatsapp', 'seo'],
    },
    data: { type: Schema.Types.Mixed, required: true },
  },
  { timestamps: true }
);

// ==========================================
// 6. CONTACT SUBMISSIONS / CRM LEADS MODEL
// ==========================================
const ContactSubmissionSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, default: '', trim: true },
    city: { type: String, default: 'Delhi NCR' },
    service: { type: String, default: 'Hair Patch Consultation' },
    requirement: { type: String, default: '' },
    preferredTime: { type: String, default: 'Anytime' },
    source: { type: String, default: 'Website Contact Form' },
    priority: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'], default: 'HIGH' },
    status: {
      type: String,
      enum: ['NEW', 'CONTACTED', 'IN_CONSULTATION', 'CONVERTED', 'LOST'],
      default: 'NEW',
      index: true,
    },
    notes: [
      {
        date: { type: Date, default: Date.now },
        author: { type: String, default: 'System' },
        text: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

ContactSubmissionSchema.index({ createdAt: -1 });

// ==========================================
// 7. ANALYTICS EVENTS MODEL (Lightweight & Privacy-Safe)
// ==========================================
const AnalyticsEventSchema = new Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ['page_view', 'buy_now_click', 'offer_click', 'contact_submit'],
      index: true,
    },
    productId: { type: String, default: null, index: true },
    offerId: { type: String, default: null, index: true },
    path: { type: String, default: '/' },
    referrer: { type: String, default: '' },
    userAgent: { type: String, default: '' },
    ipHash: { type: String, default: '' }, // Obfuscated hash, no raw IP or PII
    timestamp: { type: Date, default: Date.now, index: true },
  },
  { timestamps: false }
);

AnalyticsEventSchema.index({ type: 1, timestamp: -1 });
AnalyticsEventSchema.index({ productId: 1, type: 1, timestamp: -1 });

// ==========================================
// 8. ADMIN USER MODEL
// ==========================================
const AdminSchema = new Schema(
  {
    username: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
    email: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['SUPER_ADMIN', 'ADMIN', 'EDITOR'], default: 'SUPER_ADMIN' },
    lastLoginAt: { type: Date, default: null },
    failedAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date, default: null },
  },
  { timestamps: true }
);

// Prevent Mongoose model overwrite in serverless hot reloads
export const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);
export const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);
export const Offer = mongoose.models.Offer || mongoose.model('Offer', OfferSchema);
export const Blog = mongoose.models.Blog || mongoose.model('Blog', BlogSchema);
export const Setting = mongoose.models.Setting || mongoose.model('Setting', SettingSchema);
export const ContactSubmission = mongoose.models.ContactSubmission || mongoose.model('ContactSubmission', ContactSubmissionSchema);
export const AnalyticsEvent = mongoose.models.AnalyticsEvent || mongoose.model('AnalyticsEvent', AnalyticsEventSchema);
export const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema);

