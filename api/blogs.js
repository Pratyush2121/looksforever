import { connectToDatabase, isDbConnected } from './lib/db.js';
import { Blog } from './lib/models.js';
import { requireAdmin } from './lib/auth.js';
import { validateSchema, BlogSchemaZod, generateSlug } from './lib/validate.js';
import { sanitizeHtml } from './lib/sanitize.js';

export default async function handler(req, res) {
  let dbAvailable = false;
  try {
    await connectToDatabase();
    dbAvailable = isDbConnected();
  } catch (err) {}

  const { method } = req;
  const { id, slug, all } = req.query;

  // GET: Public list or single blog
  if (method === 'GET') {
    if (slug) {
      if (dbAvailable) {
        const blog = await Blog.findOne({ slug: slug.toLowerCase(), active: true });
        if (!blog) return res.status(404).json({ error: 'Article not found' });
        return res.status(200).json(blog);
      }
      return res.status(404).json({ error: 'Article not found' });
    }

    if (dbAvailable) {
      const filter = all ? {} : { active: true };
      const blogs = await Blog.find(filter).sort({ publishedAt: -1 });
      return res.status(200).json(blogs);
    }
    return res.status(200).json([]);
  }

  // WRITE OPERATIONS: Admin only
  const admin = requireAdmin(req, res);
  if (!admin) return;

  if (method === 'POST') {
    const validation = validateSchema(BlogSchemaZod, req.body);
    if (!validation.success) {
      return res.status(400).json({ error: 'Validation failed', errors: validation.errors });
    }

    const blogData = validation.data;
    blogData.content = sanitizeHtml(blogData.content);
    blogData.slug = generateSlug(blogData.slug || blogData.title);

    if (dbAvailable) {
      const existing = await Blog.findOne({ slug: blogData.slug });
      if (existing) {
        blogData.slug = `${blogData.slug}-${Date.now().toString().slice(-4)}`;
      }
      const newBlog = await Blog.create(blogData);
      return res.status(201).json({ success: true, blog: newBlog });
    }
    return res.status(201).json({ success: true, blog: blogData });
  }

  if (method === 'PUT') {
    const targetId = id || req.body._id || req.body.id;
    if (!targetId) return res.status(400).json({ error: 'Blog ID is required' });

    const validation = validateSchema(BlogSchemaZod.partial(), req.body);
    if (!validation.success) {
      return res.status(400).json({ error: 'Validation failed', errors: validation.errors });
    }

    const updateData = validation.data;
    if (updateData.content) {
      updateData.content = sanitizeHtml(updateData.content);
    }
    if (updateData.slug) {
      updateData.slug = generateSlug(updateData.slug);
    }

    if (dbAvailable) {
      const updated = await Blog.findByIdAndUpdate(targetId, updateData, { new: true });
      if (!updated) return res.status(404).json({ error: 'Article not found' });
      return res.status(200).json({ success: true, blog: updated });
    }
    return res.status(200).json({ success: true, blog: req.body });
  }

  if (method === 'DELETE') {
    const targetId = id || req.query.id;
    if (!targetId) return res.status(400).json({ error: 'Blog ID is required' });

    if (dbAvailable) {
      const deleted = await Blog.findByIdAndDelete(targetId);
      if (!deleted) return res.status(404).json({ error: 'Article not found' });
      return res.status(200).json({ success: true, message: 'Article deleted', id: targetId });
    }
    return res.status(200).json({ success: true, message: 'Article deleted', id: targetId });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

