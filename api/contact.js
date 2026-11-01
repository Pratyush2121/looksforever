import { connectToDatabase, isDbConnected } from './lib/db.js';
import { ContactSubmission } from './lib/models.js';
import { requireAdmin } from './lib/auth.js';
import { validateSchema, ContactSchemaZod } from './lib/validate.js';
import fs from 'fs';
import path from 'path';

function getLocalLeads() {
  try {
    const p = path.join(process.cwd(), 'server', 'data', 'leads.json');
    if (fs.existsSync(p)) return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch (e) {}
  return [];
}

export default async function handler(req, res) {
  let dbAvailable = false;
  try {
    await connectToDatabase();
    dbAvailable = isDbConnected();
  } catch (err) {}

  const { method } = req;
  const { id, status, search, export: exportFormat } = req.query;

  // ==========================================
  // POST: Public Consultation & Lead Capture
  // ==========================================
  if (method === 'POST') {
    const validation = validateSchema(ContactSchemaZod, req.body);
    if (!validation.success) {
      return res.status(400).json({ error: 'Validation failed', errors: validation.errors });
    }

    const leadData = validation.data;
    const now = new Date();

    if (dbAvailable) {
      const submission = await ContactSubmission.create({
        ...leadData,
        notes: [
          {
            date: now,
            author: 'System Intake',
            text: `Inquiry submitted via ${leadData.source || 'Website'}.`,
          },
        ],
      });

      return res.status(201).json({
        success: true,
        message: 'Consultation registered successfully.',
        leadId: submission._id,
        lead: submission,
      });
    } else {
      // Local fallback
      const local = getLocalLeads();
      const newLead = {
        id: `LF-LEAD-${Date.now().toString().slice(-6)}`,
        ...leadData,
        status: 'NEW',
        createdAt: now.toISOString(),
        notes: [{ date: now.toISOString(), author: 'System', text: 'Captured locally.' }],
      };
      local.unshift(newLead);
      fs.writeFileSync(path.join(process.cwd(), 'server', 'data', 'leads.json'), JSON.stringify(local, null, 2));

      return res.status(201).json({
        success: true,
        message: 'Consultation registered locally.',
        leadId: newLead.id,
        lead: newLead,
      });
    }
  }

  // ==========================================
  // ADMIN ONLY: INBOX, STATUS UPDATE, CSV EXPORT
  // ==========================================
  const admin = requireAdmin(req, res);
  if (!admin) return;

  // GET: Leads list or CSV export
  if (method === 'GET') {
    if (exportFormat === 'csv') {
      let leads = [];
      if (dbAvailable) {
        leads = await ContactSubmission.find({}).sort({ createdAt: -1 });
      } else {
        leads = getLocalLeads();
      }

      const headers = ['ID', 'Name', 'Phone', 'Email', 'City', 'Service', 'Requirement', 'Status', 'Priority', 'Date'];
      const rows = leads.map(l => [
        `"${l._id || l.id}"`,
        `"${(l.name || '').replace(/"/g, '""')}"`,
        `"${(l.phone || '').replace(/"/g, '""')}"`,
        `"${(l.email || '').replace(/"/g, '""')}"`,
        `"${(l.city || '').replace(/"/g, '""')}"`,
        `"${(l.service || '').replace(/"/g, '""')}"`,
        `"${(l.requirement || '').replace(/"/g, '""')}"`,
        `"${l.status}"`,
        `"${l.priority}"`,
        `"${new Date(l.createdAt).toLocaleString('en-IN')}"`,
      ]);

      const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="looks-forever-leads-${Date.now()}.csv"`);
      return res.status(200).send(csvContent);
    }

    if (dbAvailable) {
      const filter = {};
      if (status && status !== 'ALL') filter.status = status;
      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: 'i' } },
          { phone: { $regex: search, $options: 'i' } },
          { city: { $regex: search, $options: 'i' } },
          { service: { $regex: search, $options: 'i' } },
        ];
      }
      const leads = await ContactSubmission.find(filter).sort({ createdAt: -1 });
      return res.status(200).json(leads);
    } else {
      let leads = getLocalLeads();
      if (status && status !== 'ALL') leads = leads.filter(l => l.status === status);
      if (search) {
        const q = search.toLowerCase();
        leads = leads.filter(l => l.name.toLowerCase().includes(q) || l.phone.includes(q) || (l.city && l.city.toLowerCase().includes(q)));
      }
      return res.status(200).json(leads);
    }
  }

  // PUT: Update lead status or add internal note
  if (method === 'PUT') {
    const targetId = id || req.body._id || req.body.id;
    if (!targetId) return res.status(400).json({ error: 'Lead ID is required' });

    const { status: newStatus, note, author } = req.body;

    if (dbAvailable) {
      const lead = await ContactSubmission.findById(targetId);
      if (!lead) return res.status(404).json({ error: 'Lead not found' });

      if (newStatus) lead.status = newStatus;
      if (note) {
        lead.notes.push({
          date: new Date(),
          author: author || admin.username || 'Admin',
          text: note,
        });
      }
      await lead.save();
      return res.status(200).json({ success: true, lead });
    } else {
      const local = getLocalLeads();
      const idx = local.findIndex(l => l.id === targetId || l._id === targetId);
      if (idx === -1) return res.status(404).json({ error: 'Lead not found' });
      if (newStatus) local[idx].status = newStatus;
      if (note) {
        if (!Array.isArray(local[idx].notes)) local[idx].notes = [];
        local[idx].notes.push({ date: new Date().toISOString(), author: author || 'Admin', text: note });
      }
      fs.writeFileSync(path.join(process.cwd(), 'server', 'data', 'leads.json'), JSON.stringify(local, null, 2));
      return res.status(200).json({ success: true, lead: local[idx] });
    }
  }

  // DELETE: Delete lead
  if (method === 'DELETE') {
    const targetId = id || req.query.id;
    if (!targetId) return res.status(400).json({ error: 'Lead ID is required' });

    if (dbAvailable) {
      await ContactSubmission.findByIdAndDelete(targetId);
      return res.status(200).json({ success: true, message: 'Lead deleted', id: targetId });
    } else {
      let local = getLocalLeads();
      local = local.filter(l => l.id !== targetId && l._id !== targetId);
      fs.writeFileSync(path.join(process.cwd(), 'server', 'data', 'leads.json'), JSON.stringify(local, null, 2));
      return res.status(200).json({ success: true, message: 'Lead deleted', id: targetId });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

