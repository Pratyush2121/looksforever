import { connectToDatabase, isDbConnected } from '../lib/db.js';
import { Product } from '../lib/models.js';
import { requireAdmin } from '../lib/auth.js';
import { validateSchema, ProductSchemaZod, generateSlug } from '../lib/validate.js';
import fs from 'fs';
import path from 'path';

// Local fallback store helper if MongoDB is not yet configured
function getLocalProducts() {
  try {
    const p = path.join(process.cwd(), 'server', 'data', 'products.json');
    if (fs.existsSync(p)) {
      return JSON.parse(fs.readFileSync(p, 'utf8'));
    }
  } catch (e) {}
  return [];
}

export default async function handler(req, res) {
  let dbAvailable = false;
  try {
    await connectToDatabase();
    dbAvailable = isDbConnected();
  } catch (err) {
    console.warn('[Products API] Working with fallback store:', err.message);
  }

  const { method } = req;
  const { id, slug, category, search, page = 1, limit = 50, all } = req.query;

  // ==========================================
  // GET: Public list or single product
  // ==========================================
  if (method === 'GET') {
    // 1. Single product lookup
    if (id || slug) {
      if (dbAvailable) {
        const query = id ? { _id: id } : { slug: slug.toLowerCase() };
        const product = await Product.findOne(query);
        if (!product) return res.status(404).json({ error: 'Product not found' });
        return res.status(200).json(product);
      } else {
        const local = getLocalProducts();
        const product = local.find(p => (id && p.id === id) || (slug && p.slug === slug));
        if (!product) return res.status(404).json({ error: 'Product not found' });
        return res.status(200).json(product);
      }
    }

    // 2. Filtered list
    if (dbAvailable) {
      const filter = {};
      // Normal visitors only see active products unless all=true requested with admin auth
      if (!all) {
        filter.active = true;
      }
      if (category && category !== 'all') {
        filter.category = category.toLowerCase();
      }
      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: 'i' } },
          { shortDesc: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
        ];
      }

      const skip = (Math.max(1, Number(page)) - 1) * Number(limit);
      const total = await Product.countDocuments(filter);
      const products = await Product.find(filter)
        .sort({ displayOrder: 1, createdAt: -1 })
        .skip(skip)
        .limit(Number(limit));

      return res.status(200).json(products);
    } else {
      // Local fallback
      let list = getLocalProducts();
      if (category && category !== 'all') {
        list = list.filter(p => p.category === category);
      }
      if (search) {
        const q = search.toLowerCase();
        list = list.filter(p => p.name.toLowerCase().includes(q) || (p.shortDesc && p.shortDesc.toLowerCase().includes(q)));
      }
      return res.status(200).json(list);
    }
  }

  // ==========================================
  // WRITE OPERATIONS: ADMIN AUTH REQUIRED
  // ==========================================
  const admin = requireAdmin(req, res);
  if (!admin) return; // 401 sent

  // POST: Create product
  if (method === 'POST') {
    // Check for bulk action
    if (req.query.action === 'bulk') {
      const { ids, action: bulkAction } = req.body;
      if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ error: 'Please provide product IDs for bulk action' });
      }

      if (dbAvailable) {
        if (bulkAction === 'activate') {
          await Product.updateMany({ _id: { $in: ids } }, { $set: { active: true } });
        } else if (bulkAction === 'deactivate') {
          await Product.updateMany({ _id: { $in: ids } }, { $set: { active: false } });
        } else if (bulkAction === 'delete') {
          await Product.deleteMany({ _id: { $in: ids } });
        }
        return res.status(200).json({ success: true, message: `Bulk ${bulkAction} complete` });
      }
    }

    const validation = validateSchema(ProductSchemaZod, req.body);
    if (!validation.success) {
      return res.status(400).json({ error: 'Validation failed', errors: validation.errors });
    }

    const productData = validation.data;
    // Auto-generate slug if missing
    if (!productData.slug) {
      productData.slug = generateSlug(productData.name);
    } else {
      productData.slug = generateSlug(productData.slug);
    }

    if (dbAvailable) {
      // Ensure slug uniqueness
      let slugExists = await Product.findOne({ slug: productData.slug });
      if (slugExists) {
        productData.slug = `${productData.slug}-${Date.now().toString().slice(-4)}`;
      }

      const newProduct = await Product.create(productData);
      return res.status(201).json({ success: true, product: newProduct });
    } else {
      // Save locally
      const local = getLocalProducts();
      const newProd = { id: `lf-patch-${Date.now().toString().slice(-4)}`, ...productData };
      local.unshift(newProd);
      fs.writeFileSync(path.join(process.cwd(), 'server', 'data', 'products.json'), JSON.stringify(local, null, 2));
      return res.status(201).json({ success: true, product: newProd });
    }
  }

  // PUT: Update product
  if (method === 'PUT') {
    const targetId = id || req.body._id || req.body.id;
    if (!targetId) {
      return res.status(400).json({ error: 'Product ID is required for update' });
    }

    const validation = validateSchema(ProductSchemaZod.partial(), req.body);
    if (!validation.success) {
      return res.status(400).json({ error: 'Validation failed', errors: validation.errors });
    }

    const updateData = validation.data;
    if (updateData.slug) {
      updateData.slug = generateSlug(updateData.slug);
    }

    if (dbAvailable) {
      const updated = await Product.findByIdAndUpdate(targetId, updateData, { new: true });
      if (!updated) return res.status(404).json({ error: 'Product not found' });
      return res.status(200).json({ success: true, product: updated });
    } else {
      const local = getLocalProducts();
      const idx = local.findIndex(p => p.id === targetId || p._id === targetId);
      if (idx === -1) return res.status(404).json({ error: 'Product not found' });
      local[idx] = { ...local[idx], ...updateData };
      fs.writeFileSync(path.join(process.cwd(), 'server', 'data', 'products.json'), JSON.stringify(local, null, 2));
      return res.status(200).json({ success: true, product: local[idx] });
    }
  }

  // DELETE: Delete product
  if (method === 'DELETE') {
    const targetId = id || req.query.id;
    if (!targetId) {
      return res.status(400).json({ error: 'Product ID is required for deletion' });
    }

    if (dbAvailable) {
      const deleted = await Product.findByIdAndDelete(targetId);
      if (!deleted) return res.status(404).json({ error: 'Product not found' });
      return res.status(200).json({ success: true, message: 'Product deleted successfully', id: targetId });
    } else {
      let local = getLocalProducts();
      local = local.filter(p => p.id !== targetId && p._id !== targetId);
      fs.writeFileSync(path.join(process.cwd(), 'server', 'data', 'products.json'), JSON.stringify(local, null, 2));
      return res.status(200).json({ success: true, message: 'Product deleted', id: targetId });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

