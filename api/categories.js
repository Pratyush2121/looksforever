import { connectToDatabase, isDbConnected } from '../lib/db.js';
import { Category } from '../lib/models.js';
import { requireAdmin } from '../lib/auth.js';
import { validateSchema, CategorySchemaZod, generateSlug } from '../lib/validate.js';
import { CATEGORIES } from '../src/config/siteConfig.js';

export default async function handler(req, res) {
  let dbAvailable = false;
  try {
    await connectToDatabase();
    dbAvailable = isDbConnected();
  } catch (err) {}

  const { method } = req;
  const { id, slug, all } = req.query;

  // GET: Public categories list
  if (method === 'GET') {
    if (dbAvailable) {
      const filter = all ? {} : { active: true };
      const categories = await Category.find(filter).sort({ displayOrder: 1, createdAt: 1 });
      return res.status(200).json(categories);
    } else {
      return res.status(200).json(CATEGORIES);
    }
  }

  // WRITE OPERATIONS: Admin only
  const admin = requireAdmin(req, res);
  if (!admin) return;

  if (method === 'POST') {
    const validation = validateSchema(CategorySchemaZod, req.body);
    if (!validation.success) {
      return res.status(400).json({ error: 'Validation failed', errors: validation.errors });
    }
    const catData = validation.data;
    catData.slug = generateSlug(catData.slug || catData.name);

    if (dbAvailable) {
      const existing = await Category.findOne({ slug: catData.slug });
      if (existing) {
        catData.slug = `${catData.slug}-${Date.now().toString().slice(-4)}`;
      }
      const newCat = await Category.create(catData);
      return res.status(201).json({ success: true, category: newCat });
    }
    return res.status(201).json({ success: true, category: catData });
  }

  if (method === 'PUT') {
    const targetId = id || req.body._id || req.body.id;
    if (!targetId) return res.status(400).json({ error: 'Category ID is required' });

    const validation = validateSchema(CategorySchemaZod.partial(), req.body);
    if (!validation.success) {
      return res.status(400).json({ error: 'Validation failed', errors: validation.errors });
    }

    if (dbAvailable) {
      const updated = await Category.findByIdAndUpdate(targetId, validation.data, { new: true });
      if (!updated) return res.status(404).json({ error: 'Category not found' });
      return res.status(200).json({ success: true, category: updated });
    }
    return res.status(200).json({ success: true, category: req.body });
  }

  if (method === 'DELETE') {
    const targetId = id || req.query.id;
    if (!targetId) return res.status(400).json({ error: 'Category ID is required' });

    if (dbAvailable) {
      const deleted = await Category.findByIdAndDelete(targetId);
      if (!deleted) return res.status(404).json({ error: 'Category not found' });
      return res.status(200).json({ success: true, message: 'Category deleted', id: targetId });
    }
    return res.status(200).json({ success: true, message: 'Category deleted', id: targetId });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

