import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { Product, Category, Setting, Offer, Blog, Admin } from '../api/lib/models.js';
import { hashPassword } from '../api/lib/auth.js';
import { generateSlug } from '../api/lib/validate.js';
import { CATEGORIES, CELEBRITY_AWARDS, SITE_CONFIG } from '../src/config/siteConfig.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('\n❌ Error: MONGODB_URI is not defined in your environment (.env).');
  console.error('Please add MONGODB_URI=mongodb+srv://... to .env and run this script again.\n');
  process.exit(1);
}

async function seed() {
  console.log('🔄 Connecting to MongoDB Atlas...');
  await mongoose.connect(MONGODB_URI, { bufferCommands: false });
  console.log('✅ Connected to MongoDB Atlas.');

  // 1. Seed Categories
  console.log('\n--- 1. Seeding Categories ---');
  for (let i = 0; i < CATEGORIES.length; i++) {
    const cat = CATEGORIES[i];
    const slug = cat.id || generateSlug(cat.name);
    await Category.findOneAndUpdate(
      { slug },
      {
        name: cat.name,
        slug,
        shortName: cat.shortName || cat.name,
        description: cat.description || '',
        icon: cat.icon || 'Sparkles',
        badge: cat.badge || '',
        image: cat.image || '',
        active: true,
        displayOrder: i + 1,
      },
      { upsert: true, new: true }
    );
  }
  console.log(`✅ Seeded ${CATEGORIES.length} categories.`);

  // 2. Seed Products
  console.log('\n--- 2. Seeding Products ---');
  let productsData = [];
  const localProductsFile = path.join(process.cwd(), 'server', 'data', 'products.json');
  if (fs.existsSync(localProductsFile)) {
    productsData = JSON.parse(fs.readFileSync(localProductsFile, 'utf8'));
  }

  for (let i = 0; i < productsData.length; i++) {
    const p = productsData[i];
    const slug = generateSlug(p.name);
    await Product.findOneAndUpdate(
      { slug },
      {
        name: p.name,
        slug,
        category: p.category || 'hair-patches',
        price: Number(p.price) || 9999,
        originalPrice: Number(p.originalPrice) || Math.round((Number(p.price) || 9999) * 1.3),
        discount: p.discount || '25% OFF',
        rating: Number(p.rating) || 4.9,
        reviewCount: Number(p.reviewCount) || 50,
        isBestseller: Boolean(p.isBestseller),
        isNewItem: Boolean(p.isNew),
        badge: p.badge || (i < 3 ? 'Bestseller' : ''),
        shortDesc: p.shortDesc || '',
        description: p.description || '',
        image: p.image || '/brand/logo.png',
        gallery: p.gallery && p.gallery.length > 0 ? p.gallery : [p.image],
        specifications: p.specifications || {},
        variants: p.variants || [],
        active: true,
        displayOrder: i + 1,
      },
      { upsert: true, new: true }
    );
  }
  console.log(`✅ Seeded ${productsData.length} products.`);

  // 3. Seed Settings
  console.log('\n--- 3. Seeding Settings Sections ---');
  const settingsToSeed = [
    {
      section: 'header',
      data: {
        logo: '/brand/logo.png',
        logoHeader: '/brand/logo-header.png',
        logoSmall: '/brand/logo-small.png',
        brandName: 'Looks Forever',
        announcements: SITE_CONFIG.announcements,
        ctaText: 'WhatsApp Order',
      },
    },
    {
      section: 'footer',
      data: {
        logo: '/brand/logo.png',
        bio: "India's premier non-surgical hair replacement clinic and supplier. Winner of multiple national excellence awards for natural hairline craft and patient-first aesthetic care.",
        address: SITE_CONFIG.contact.address,
        landmark: SITE_CONFIG.contact.landmark,
        email: SITE_CONFIG.contact.email,
        phone: SITE_CONFIG.contact.phoneDisplay,
        hours: SITE_CONFIG.contact.hours,
        copyright: `© ${new Date().getFullYear()} Looks Forever Hair Aesthetic Clinic. All rights reserved.`,
      },
    },
    {
      section: 'homepage',
      data: {
        hero: {
          badge: 'National & International Award-Winning Clinic',
          title: "India's Award-Winning Non-Surgical Hair Replacement",
          subtitle: 'Natural, undetectable virgin Remy human hair systems, custom French lace patches, and medical wigs tailored for Indian climate and active lifestyles.',
          ctaPrimary: 'Shop Collection',
          ctaWhatsApp: 'Order on WhatsApp',
        },
        whyChoose: {
          eyebrow: 'Why Looks Forever',
          title: 'Why choose our hair solutions?',
          subtitle: 'Natural, comfortable and easy to live with.',
          beforeImage: '/assets/award-ravi-dubey.png',
          afterImage: '/assets/award-shilpa-shetty.png',
          items: [
            { title: 'Instant Volume', text: 'Fuller, thicker hair from day one with undetectable front hairline.' },
            { title: 'Natural Finish', text: '100% natural virgin Remy human hair blends seamlessly with your scalp.' },
            { title: 'Low Maintenance', text: 'Breathable base engineered for Indian weather, gym, and swimming.' },
            { title: 'Pocket Friendly', text: 'Transparent clinic-grade pricing starting at ₹2,999 with long durability.' },
            { title: 'Easy to Remove & Refix', text: 'Comfortable to take off whenever you want with medical-grade solvents.' },
          ],
          chips: ['Comfortable Fit', 'Long Lasting (8-12 Months)', 'Boosts Confidence', 'Pan-India Express Delivery'],
        },
        awards: CELEBRITY_AWARDS,
      },
    },
    {
      section: 'whatsapp',
      data: {
        number: '919811863767',
        helpText: SITE_CONFIG.whatsappHelpText,
      },
    },
    {
      section: 'seo',
      data: {
        title: 'Looks Forever Hair Aesthetic Clinic | Hair Systems, Patches & Wigs',
        description: "India's award-winning non-surgical hair replacement clinic in Wave Mall, Sector 18 Noida. 100% natural Remy human hair patches, wigs & transparent hairline systems.",
        ogImage: '/brand/og-image.jpg',
        canonical: 'https://looksforever.org',
      },
    },
    {
      section: 'about',
      data: {
        clinicName: 'Looks Forever Hair Aesthetic Clinic',
        established: '2008',
        leadDoctor: 'Senior Aesthetic Specialists & Trichology Craftsmen',
        experienceYears: '15+ Years',
        happyClients: '12,000+',
        awardsCount: '6+ National & International Honors',
      },
    },
    {
      section: 'contact',
      data: {
        address: SITE_CONFIG.contact.address,
        landmark: SITE_CONFIG.contact.landmark,
        email: SITE_CONFIG.contact.email,
        phone: SITE_CONFIG.contact.phoneDisplay,
        hours: SITE_CONFIG.contact.hours,
        googleMapsEmbed: 'https://maps.google.com/maps?q=Wave+Mall+Sector+18+Noida&t=&z=15&ie=UTF8&iwloc=&output=embed',
      },
    },
  ];

  for (const s of settingsToSeed) {
    await Setting.findOneAndUpdate(
      { section: s.section },
      { section: s.section, data: s.data },
      { upsert: true, new: true }
    );
  }
  console.log(`✅ Seeded ${settingsToSeed.length} settings sections.`);

  // 4. Seed Multi-Page Offers
  console.log('\n--- 4. Seeding Offers ---');
  const sampleOffers = [
    {
      title: 'Festival Hair Transformation Special',
      subtitle: 'Flat 25% OFF on custom French Lace & Ultra-Thin Skin hair systems with free clinic styling & wash kit.',
      badgeText: '25% OFF',
      image: 'https://5.imimg.com/data5/SELLER/Default/2025/5/512170588/RV/XD/RU/8438256/fine-superior-500x500.png',
      buttonText: 'Claim on WhatsApp',
      buttonLink: 'https://wa.me/919811863767?text=Hi%20Looks%20Forever,%20I%20want%20to%20avail%20the%2025%25%20off%20Hair%20Patch%20Offer',
      styleVariant: 'split',
      active: true,
      displayOrder: 1,
      placements: ['home-after-hero', 'home-after-why-choose', 'products-after-row-2'],
    },
    {
      title: 'Free In-Clinic Scalp & Sizing Consultation',
      subtitle: 'Meet our senior trichologists at Wave Mall Sector 18 Noida for a free private density assessment.',
      badgeText: 'Free Clinic Visit',
      image: '/brand/og-image.jpg',
      buttonText: 'Book Slot Now',
      buttonLink: 'https://wa.me/919811863767?text=Hi%20Looks%20Forever,%20I%20want%20to%20book%20a%20Free%20In-Clinic%20Consultation',
      styleVariant: 'strip',
      active: true,
      displayOrder: 2,
      placements: ['home-after-products', 'home-before-footer', 'products-bottom'],
    },
  ];

  for (const o of sampleOffers) {
    await Offer.findOneAndUpdate(
      { title: o.title },
      o,
      { upsert: true, new: true }
    );
  }
  console.log(`✅ Seeded ${sampleOffers.length} multi-page promotional offers.`);

  // 5. Seed Initial Educational Blogs
  console.log('\n--- 5. Seeding Blogs ---');
  const sampleBlogs = [
    {
      title: 'How to Choose the Right Hair Patch Base: French Lace vs Poly Skin',
      slug: 'how-to-choose-hair-patch-base-french-lace-vs-poly-skin',
      excerpt: 'A comprehensive medical guide comparing breathability, hairline undetectability, and longevity between French lace and micro-skin bases in Indian climates.',
      coverImage: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=800&auto=format&fit=crop&q=80',
      author: 'Senior Specialist, Looks Forever',
      readTime: '5 min read',
      tags: ['Hair Systems', 'French Lace', 'Maintenance'],
      active: true,
      content: `<p>Choosing the correct hair system base is the single most critical decision for natural aesthetics and daily comfort...</p><h3>1. French Lace Center</h3><p>French lace is renowned for exceptional breathability, making it ideal for active individuals and warm climates...</p><h3>2. Ultra-Thin Skin (0.03mm Poly)</h3><p>Poly skin systems use knotless V-looping where every strand appears to emerge directly from the scalp pores...</p>`,
    },
    {
      title: 'Complete Hair System Maintenance: Taping, Cleaning & Solvents',
      slug: 'complete-hair-system-maintenance-taping-cleaning-solvents',
      excerpt: 'Step-by-step clinic instructions on safe adhesive removal, shampooing Remy human hair, and achieving a 4-week secure bond hold.',
      coverImage: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80',
      author: 'Aesthetic Team, Looks Forever',
      readTime: '6 min read',
      tags: ['Maintenance', 'Adhesives', 'Hair Care'],
      active: true,
      content: `<p>Proper maintenance ensures your hair patch retains its original density and silkiness for 8 to 12 months...</p><h3>Safe Removal with C-22 Solvent</h3><p>Never pull or yank delicate lace mesh. Spray citrus solvent liberally and allow 2-3 minutes for the adhesive bond to release naturally...</p>`,
    },
  ];

  for (const b of sampleBlogs) {
    await Blog.findOneAndUpdate(
      { slug: b.slug },
      b,
      { upsert: true, new: true }
    );
  }
  console.log(`✅ Seeded ${sampleBlogs.length} articles.`);

  console.log('\n🎉 Database seed completed successfully! Site looks 100% identical on Day 1.\n');
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seeding error:', err);
  process.exit(1);
});

