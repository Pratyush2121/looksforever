import { connectToDatabase, isDbConnected } from '../lib/db.js';
import { Setting } from '../lib/models.js';
import { requireAdmin } from '../lib/auth.js';
import { SITE_CONFIG, CELEBRITY_AWARDS } from '../src/config/siteConfig.js';

// Default initial section seeds
function getDefaultSetting(section) {
  switch (section) {
    case 'header':
      return {
        logo: '/brand/logo.png',
        logoHeader: '/brand/logo-header.png',
        logoSmall: '/brand/logo-small.png',
        brandName: 'Looks Forever',
        announcements: SITE_CONFIG.announcements,
        ctaText: 'WhatsApp Order',
      };
    case 'footer':
      return {
        logo: '/brand/logo.png',
        bio: "India's premier non-surgical hair replacement clinic and supplier. Winner of multiple national excellence awards for natural hairline craft and patient-first aesthetic care.",
        address: SITE_CONFIG.contact.address,
        landmark: SITE_CONFIG.contact.landmark,
        email: SITE_CONFIG.contact.email,
        phone: SITE_CONFIG.contact.phoneDisplay,
        hours: SITE_CONFIG.contact.hours,
        copyright: `© ${new Date().getFullYear()} Looks Forever Hair Aesthetic Clinic. All rights reserved.`,
      };
    case 'homepage':
      return {
        hero: {
          badge: 'National & International Award-Winning Clinic',
          title: "India's Award-Winning Non-Surgical Hair Replacement",
          subtitle: 'Natural, undetectable virgin Remy human hair systems, custom French lace patches, and medical wigs tailored for Indian climate and lifestyles.',
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
      };
    case 'whatsapp':
      return {
        number: '919811863767', // International format without + or spaces
        helpText: SITE_CONFIG.whatsappHelpText,
      };
    case 'seo':
      return {
        title: 'Looks Forever Hair Aesthetic Clinic | Hair Systems, Patches & Wigs',
        description: "India's award-winning non-surgical hair replacement clinic in Wave Mall, Sector 18 Noida. 100% natural Remy human hair patches, wigs & transparent hairline systems.",
        ogImage: '/brand/og-image.jpg',
        canonical: 'https://looksforever.org',
      };
    case 'about':
      return {
        clinicName: 'Looks Forever Hair Aesthetic Clinic',
        established: '2008',
        leadDoctor: 'Senior Aesthetic Specialists & Trichology Craftsmen',
        experienceYears: '15+ Years',
        happyClients: '12,000+',
        awardsCount: '6+ National & International Honors',
      };
    case 'contact':
      return {
        address: SITE_CONFIG.contact.address,
        landmark: SITE_CONFIG.contact.landmark,
        email: SITE_CONFIG.contact.email,
        phone: SITE_CONFIG.contact.phoneDisplay,
        hours: SITE_CONFIG.contact.hours,
        googleMapsEmbed: 'https://maps.google.com/maps?q=Wave+Mall+Sector+18+Noida&t=&z=15&ie=UTF8&iwloc=&output=embed',
      };
    default:
      return {};
  }
}

export default async function handler(req, res) {
  let dbAvailable = false;
  try {
    await connectToDatabase();
    dbAvailable = isDbConnected();
  } catch (err) {}

  const { method } = req;
  const { section } = req.query;

  // GET: Public settings (or all sections if section omitted)
  if (method === 'GET') {
    if (section) {
      if (dbAvailable) {
        const doc = await Setting.findOne({ section });
        if (doc) return res.status(200).json(doc.data);
      }
      return res.status(200).json(getDefaultSetting(section));
    }

    // Return combined settings dictionary
    const sections = ['header', 'footer', 'homepage', 'whatsapp', 'seo', 'about', 'contact'];
    const result = {};

    if (dbAvailable) {
      const docs = await Setting.find({});
      docs.forEach(d => {
        result[d.section] = d.data;
      });
    }

    sections.forEach(s => {
      if (!result[s]) {
        result[s] = getDefaultSetting(s);
      }
    });

    return res.status(200).json(result);
  }

  // PUT: Update settings (Admin only)
  if (method === 'PUT') {
    const admin = requireAdmin(req, res);
    if (!admin) return;

    if (!section) {
      return res.status(400).json({ error: 'Section parameter is required (e.g. ?section=whatsapp)' });
    }

    const payload = req.body;
    if (!payload || typeof payload !== 'object') {
      return res.status(400).json({ error: 'Settings payload must be an object' });
    }

    if (dbAvailable) {
      const updated = await Setting.findOneAndUpdate(
        { section },
        { section, data: payload },
        { upsert: true, new: true }
      );
      return res.status(200).json({ success: true, section, data: updated.data });
    }

    return res.status(200).json({ success: true, section, data: payload });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

