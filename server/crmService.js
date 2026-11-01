import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LEADS_FILE = path.join(__dirname, 'data', 'leads.json');

// Ensure data directory exists
if (!fs.existsSync(path.join(__dirname, 'data'))) {
  fs.mkdirSync(path.join(__dirname, 'data'), { recursive: true });
}

// Read leads safely
export function getLeads() {
  try {
    if (!fs.existsSync(LEADS_FILE)) {
      fs.writeFileSync(LEADS_FILE, JSON.stringify([], null, 2));
      return [];
    }
    const data = fs.readFileSync(LEADS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading CRM leads:', error);
    return [];
  }
}

// Save leads safely
export function saveLeads(leads) {
  try {
    fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error saving CRM leads:', error);
    return false;
  }
}

// Create a new lead from website user action
export function createLead(leadData) {
  const leads = getLeads();

  const id = `LF-LEAD-${Date.now().toString().slice(-6)}`;
  const now = new Date().toISOString();

  const newLead = {
    id,
    name: leadData.name?.trim() || 'Anonymous Visitor',
    phone: leadData.phone?.trim() || 'Not Provided',
    email: leadData.email?.trim() || '',
    city: leadData.city?.trim() || 'Delhi NCR',
    service: leadData.service?.trim() || 'General Hair Restoration Consultation',
    requirement: leadData.requirement?.trim() || leadData.message?.trim() || 'Interested in non-surgical hair replacement system.',
    preferredTime: leadData.preferredTime || 'Anytime during working hours (10:30 AM - 8:30 PM)',
    status: 'NEW', // NEW, CONTACTED, IN_CONSULTATION, CONVERTED, LOST
    priority: leadData.priority || 'HIGH',
    source: leadData.source || 'Website Lead Capture',
    createdAt: now,
    updatedAt: now,
    notes: [
      {
        date: now,
        author: 'System Lead Tracker',
        text: `Captured via ${leadData.source || 'Website Form'}. Ready for CRM pipeline.`
      }
    ],
    crmSyncStatus: 'PENDING', // PENDING, SYNCED, FAILED
    crmExternalId: null
  };

  leads.unshift(newLead);
  saveLeads(leads);
  return newLead;
}

// Update lead status, notes, or priority
export function updateLead(id, updates) {
  const leads = getLeads();
  const index = leads.findIndex(l => String(l.id) === String(id));
  if (index === -1) return null;

  const current = leads[index];
  const updated = {
    ...current,
    ...updates,
    id: current.id,
    updatedAt: new Date().toISOString()
  };

  leads[index] = updated;
  saveLeads(leads);
  return updated;
}

// Add note to lead
export function addNoteToLead(id, noteText, author = 'Admin') {
  const leads = getLeads();
  const lead = leads.find(l => String(l.id) === String(id));
  if (!lead) return null;

  if (!Array.isArray(lead.notes)) lead.notes = [];
  lead.notes.push({
    date: new Date().toISOString(),
    author,
    text: noteText
  });
  lead.updatedAt = new Date().toISOString();

  saveLeads(leads);
  return lead;
}

// Delete a lead
export function deleteLead(id) {
  const leads = getLeads();
  const filtered = leads.filter(l => String(l.id) !== String(id));
  if (filtered.length === leads.length) return false;
  saveLeads(filtered);
  return true;
}

// Export CRM leads to CSV format
export function exportToCsv() {
  const leads = getLeads();
  const headers = ['Lead ID', 'Name', 'Phone', 'Email', 'City/Location', 'Interested Service', 'Status', 'Priority', 'Source', 'Created Date', 'Notes Count'];
  
  const rows = leads.map(l => [
    `"${l.id}"`,
    `"${(l.name || '').replace(/"/g, '""')}"`,
    `"${(l.phone || '').replace(/"/g, '""')}"`,
    `"${(l.email || '').replace(/"/g, '""')}"`,
    `"${(l.city || '').replace(/"/g, '""')}"`,
    `"${(l.service || '').replace(/"/g, '""')}"`,
    `"${l.status}"`,
    `"${l.priority}"`,
    `"${l.source}"`,
    `"${new Date(l.createdAt).toLocaleString('en-IN')}"`,
    `"${(l.notes || []).length}"`
  ]);

  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
}

// Mark leads as synced with external CRM
export function markSyncedWithCrm(leadIds) {
  const leads = getLeads();
  let count = 0;
  leads.forEach(l => {
    if (leadIds.includes(l.id)) {
      l.crmSyncStatus = 'SYNCED';
      l.crmSyncedAt = new Date().toISOString();
      count++;
    }
  });
  saveLeads(leads);
  return count;
}

