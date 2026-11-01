import { connectToDatabase, isDbConnected } from '../lib/db.js';
import { Offer } from '../lib/models.js';
import { requireAdmin } from '../lib/auth.js';
import { validateSchema, OfferSchemaZod } from '../lib/validate.js';

export default async function handler(req, res) {
  let dbAvailable = false;
  try {
    await connectToDatabase();
    dbAvailable = isDbConnected();
  } catch (err) {}

  const { method } = req;
  const { slot, id, all } = req.query;

  // GET: Public or admin list
  if (method === 'GET') {
    if (dbAvailable) {
      if (slot) {
        // Public slot request: must be active and within start/end dates
        const now = new Date();
        const filter = {
          active: true,
          placements: slot,
          $and: [
            { $or: [{ startDate: null }, { startDate: { $lte: now } }] },
            { $or: [{ endDate: null }, { endDate: { $gte: now } }] },
          ],
        };
        const offers = await Offer.find(filter).sort({ displayOrder: 1, createdAt: -1 });
        return res.status(200).json(offers);
      }

      // Admin or general list
      const filter = all ? {} : { active: true };
      const offers = await Offer.find(filter).sort({ displayOrder: 1, createdAt: -1 });
      return res.status(200).json(offers);
    } else {
      // Default initial offer if DB not yet connected
      const defaultOffer = {
        _id: 'default-offer-1',
        title: 'Festival Hair Transformation Offer',
        subtitle: 'Get 25% OFF on custom French Lace & Ultra-Thin Skin hair systems with free clinic styling.',
        badgeText: '25% OFF',
        image: 'https://5.imimg.com/data5/SELLER/Default/2025/5/512170588/RV/XD/RU/8438256/fine-superior-500x500.png',
        buttonText: 'Book Free Trial on WhatsApp',
        buttonLink: 'https://wa.me/919811863767?text=Hi%20Looks%20Forever,%20I%20want%20to%20avail%20the%2025%25%20off%20Hair%20Patch%20Offer',
        styleVariant: 'split',
        active: true,
        placements: ['home-after-hero', 'home-after-why-choose', 'home-after-products', 'products-after-row-2'],
      };
      if (slot && !defaultOffer.placements.includes(slot)) {
        return res.status(200).json([]);
      }
      return res.status(200).json([defaultOffer]);
    }
  }

  // WRITE OPERATIONS: Admin only
  const admin = requireAdmin(req, res);
  if (!admin) return;

  if (method === 'POST') {
    const validation = validateSchema(OfferSchemaZod, req.body);
    if (!validation.success) {
      return res.status(400).json({ error: 'Validation failed', errors: validation.errors });
    }

    if (dbAvailable) {
      const newOffer = await Offer.create(validation.data);
      return res.status(201).json({ success: true, offer: newOffer });
    }
    return res.status(201).json({ success: true, offer: validation.data });
  }

  if (method === 'PUT') {
    const targetId = id || req.body._id || req.body.id;
    if (!targetId) return res.status(400).json({ error: 'Offer ID is required' });

    const validation = validateSchema(OfferSchemaZod.partial(), req.body);
    if (!validation.success) {
      return res.status(400).json({ error: 'Validation failed', errors: validation.errors });
    }

    if (dbAvailable) {
      const updated = await Offer.findByIdAndUpdate(targetId, validation.data, { new: true });
      if (!updated) return res.status(404).json({ error: 'Offer not found' });
      return res.status(200).json({ success: true, offer: updated });
    }
    return res.status(200).json({ success: true, offer: req.body });
  }

  if (method === 'DELETE') {
    const targetId = id || req.query.id;
    if (!targetId) return res.status(400).json({ error: 'Offer ID is required' });

    if (dbAvailable) {
      const deleted = await Offer.findByIdAndDelete(targetId);
      if (!deleted) return res.status(404).json({ error: 'Offer not found' });
      return res.status(200).json({ success: true, message: 'Offer deleted', id: targetId });
    }
    return res.status(200).json({ success: true, message: 'Offer deleted', id: targetId });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

