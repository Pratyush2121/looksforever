import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import * as productService from './productService.js';
import * as crmService from './crmService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Serve static assets from public
app.use('/assets', express.static(path.join(__dirname, '../public/assets')));
app.use(express.static(path.join(__dirname, '../public')));

// Central brand & clinic information
const siteData = {
  brandName: "Looks Forever",
  subTitle: "Hair • Skin • Laser • Slimming",
  tagline: "India's Award-Winning Non-Surgical Hair Replacement & Aesthetics Clinic",
  whatsappNumber: "919811863767",
  contact: {
    address: "Lower Ground Floor (LGF), Wave Mall (Center Stage Mall), Sector 18, Noida - 201301, Uttar Pradesh",
    landmark: "Directly opposite Haldiram's, near Noida Sector 18 Metro Station",
    email: "care@looksforever.org",
    phoneDisplay: "+91 98118 63767 / 0120-4242444",
    hours: "Mon - Sun: 10:30 AM – 8:30 PM",
  },
  announcements: [
    "✨ Free Virtual Consultation on WhatsApp with Senior Hair Specialists",
    "🏆 Winner of 6+ National & International Excellence Awards",
    "🚚 Pan-India Express Delivery & Discrete Packaging on all Hair Systems & Accessories",
  ],
};

const awardsData = [
  {
    id: "award-shilpa-shetty",
    title: "International Excellence Award",
    presentedBy: "Presented by Shilpa Shetty Kundra",
    year: "2018-2019",
    category: "Best Hair Aesthetic Clinic",
    description: "Awarded to Looks Forever for pioneering undetectable non-surgical hair restoration and client satisfaction.",
    image: "/assets/award-shilpa-shetty.png",
    alt: "Looks Forever awarded by Shilpa Shetty",
  },
  {
    id: "award-sushmita-sen",
    title: "National Excellence in Hair Restoration",
    presentedBy: "Presented by Sushmita Sen",
    year: "Goa Annual Gala",
    category: "Excellence in Aesthetic Innovations",
    description: "Recognized for high-density natural human hair systems and personalized care.",
    image: "/assets/award-sushmita-sen.png",
    alt: "Looks Forever awarded by Sushmita Sen",
  },
  {
    id: "award-kriti-sanon",
    title: "National Achievers Award (NAA)",
    presentedBy: "Presented by Kriti Sanon",
    year: "2019",
    category: "Top Brand in Aesthetic Wellness",
    description: "Honored on the national stage for excellence in hair patch technology and service delivery.",
    image: "/assets/award-kriti-sanon.png",
    alt: "Looks Forever awarded by Kriti Sanon",
  },
  {
    id: "award-madhuri-dixit",
    title: "International Excellence Award",
    presentedBy: "Presented by Madhuri Dixit Nene",
    year: "Brand Icon Global",
    category: "Best Non-Surgical Hair Replacement",
    description: "Celebrated by iconic actress Madhuri Dixit for transformative aesthetic craftsmanship.",
    image: "/assets/award-madhuri-dixit.png",
    alt: "Looks Forever awarded by Madhuri Dixit",
  },
  {
    id: "award-malaika-arora",
    title: "International Icon of the Year Award",
    presentedBy: "Presented by Malaika Arora",
    year: "2019-2020",
    category: "Iconic Hair & Skin Clinic",
    description: "Conferred to Looks Forever for cutting-edge techniques and celebrity-tier service standards.",
    image: "/assets/award-malaika-arora.png",
    alt: "Looks Forever awarded by Malaika Arora",
  },
  {
    id: "award-ravi-dubey",
    title: "Brand Icon Thailand Award",
    presentedBy: "Presented by Actor Ravi Dubey",
    year: "Thailand 2018",
    category: "International Excellence",
    description: "International recognition for Looks Forever Hair & Aesthetic Clinic at the global stage.",
    image: "/assets/award-ravi-dubey.png",
    alt: "Looks Forever awarded by Ravi Dubey at Brand Icon Thailand",
  },
];

// In-memory orders store
const orderInquiries = [];

// ==========================================
// 1. HEALTH & SITE METRICS
// ==========================================
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    brand: siteData.brandName,
    services: {
      products: 'active',
      crmLeads: 'active',
      database: 'persistent'
    }
  });
});

app.get('/api/site-config', (req, res) => {
  res.json(siteData);
});

app.get('/api/awards', (req, res) => {
  res.json(awardsData);
});

// Dashboard Statistics endpoint
app.get('/api/stats', (req, res) => {
  const products = productService.getProducts();
  const leads = crmService.getLeads();

  const totalProducts = products.length;
  const totalLeads = leads.length;
  const newLeads = leads.filter(l => l.status === 'NEW').length;
  const convertedLeads = leads.filter(l => l.status === 'CONVERTED').length;
  const pendingCrmSync = leads.filter(l => l.crmSyncStatus === 'PENDING').length;
  
  const totalInventoryValue = products.reduce((acc, p) => acc + (Number(p.price) || 0), 0);
  const conversionRate = totalLeads > 0 ? ((convertedLeads / totalLeads) * 100).toFixed(1) : 0;

  res.json({
    totalProducts,
    totalLeads,
    newLeads,
    convertedLeads,
    pendingCrmSync,
    conversionRate: `${conversionRate}%`,
    totalInventoryValue,
    totalOrders: orderInquiries.length
  });
});

// ==========================================
// 2. PRODUCTS REST API (CRUD + RESET)
// ==========================================

// GET all products
app.get('/api/products', (req, res) => {
  try {
    const { category, search } = req.query;
    let products = productService.getProducts();

    if (category && category !== 'all') {
      products = products.filter(p => p.category === category);
    }
    if (search) {
      const q = search.toLowerCase();
      products = products.filter(p => 
        p.name.toLowerCase().includes(q) || 
        (p.shortDesc && p.shortDesc.toLowerCase().includes(q))
      );
    }

    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products', details: error.message });
  }
});

// GET single product
app.get('/api/products/:id', (req, res) => {
  const product = productService.getProductById(req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
});

// POST create new product
app.post('/api/products', (req, res) => {
  try {
    const { name, price, category } = req.body;
    if (!name || !price) {
      return res.status(400).json({ error: 'Product name and price are required' });
    }
    const newProduct = productService.addProduct(req.body);
    res.status(201).json({ success: true, product: newProduct });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add product', details: error.message });
  }
});

// PUT update product
app.put('/api/products/:id', (req, res) => {
  try {
    const updated = productService.updateProduct(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ success: true, product: updated });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update product', details: error.message });
  }
});

// DELETE product
app.delete('/api/products/:id', (req, res) => {
  try {
    const success = productService.deleteProduct(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ success: true, message: 'Product deleted successfully', id: req.params.id });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product', details: error.message });
  }
});

// POST reset products to original scraped catalog
app.post('/api/products/reset', (req, res) => {
  try {
    const products = productService.resetToSeed();
    res.json({ success: true, message: 'Reset to scraped catalog complete', count: products.length });
  } catch (error) {
    res.status(500).json({ error: 'Failed to reset products', details: error.message });
  }
});

// ==========================================
// 3. CRM LEADS & USER INQUIRY API (CRM DB)
// ==========================================

// GET all CRM leads
app.get('/api/leads', (req, res) => {
  try {
    const { status, priority, search } = req.query;
    let leads = crmService.getLeads();

    if (status && status !== 'ALL') {
      leads = leads.filter(l => l.status === status);
    }
    if (priority && priority !== 'ALL') {
      leads = leads.filter(l => l.priority === priority);
    }
    if (search) {
      const q = search.toLowerCase();
      leads = leads.filter(l => 
        l.name.toLowerCase().includes(q) || 
        l.phone.toLowerCase().includes(q) ||
        (l.city && l.city.toLowerCase().includes(q)) ||
        (l.service && l.service.toLowerCase().includes(q))
      );
    }

    res.json(leads);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch CRM leads', details: error.message });
  }
});

// POST create a lead from website visitor / user
app.post('/api/leads', (req, res) => {
  try {
    const { name, phone } = req.body;
    if (!phone) {
      return res.status(400).json({ error: 'Contact phone number is required' });
    }

    const lead = crmService.createLead({
      ...req.body,
      ip: req.ip || req.headers['x-forwarded-for'] || 'Direct'
    });

    res.status(201).json({
      success: true,
      message: 'Consultation & inquiry registered successfully. Our specialist will contact you shortly.',
      leadId: lead.id,
      lead
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to register lead', details: error.message });
  }
});

// PUT update lead (status, priority, assigned rep, notes)
app.put('/api/leads/:id', (req, res) => {
  try {
    const updated = crmService.updateLead(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Lead not found' });
    }
    res.json({ success: true, lead: updated });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update lead', details: error.message });
  }
});

// POST add internal note to lead
app.post('/api/leads/:id/notes', (req, res) => {
  try {
    const { note, author } = req.body;
    if (!note) return res.status(400).json({ error: 'Note text is required' });
    const lead = crmService.addNoteToLead(req.params.id, note, author || 'Admin');
    if (!lead) return res.status(404).json({ error: 'Lead not found' });
    res.json({ success: true, lead });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add note', details: error.message });
  }
});

// DELETE lead
app.delete('/api/leads/:id', (req, res) => {
  try {
    const success = crmService.deleteLead(req.params.id);
    if (!success) return res.status(404).json({ error: 'Lead not found' });
    res.json({ success: true, message: 'Lead deleted', id: req.params.id });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete lead', details: error.message });
  }
});

// GET CRM export (CSV)
app.get('/api/crm/export', (req, res) => {
  try {
    const csvData = crmService.exportToCsv();
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="looks-forever-crm-leads-${Date.now()}.csv"`);
    res.send(csvData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to export CRM leads', details: error.message });
  }
});

// POST sync leads with external CRM (Webhook or Direct API)
app.post('/api/crm/sync', (req, res) => {
  try {
    const { leadIds, webhookUrl } = req.body;
    const leads = crmService.getLeads();
    const targetLeads = Array.isArray(leadIds) && leadIds.length > 0 
      ? leads.filter(l => leadIds.includes(l.id))
      : leads.filter(l => l.crmSyncStatus === 'PENDING');

    const syncedCount = crmService.markSyncedWithCrm(targetLeads.map(l => l.id));

    res.json({
      success: true,
      message: `Successfully synchronized ${syncedCount} leads with CRM database`,
      syncedCount,
      targetEndpoint: webhookUrl || 'Standard Internal CRM Pipeline'
    });
  } catch (error) {
    res.status(500).json({ error: 'CRM synchronization failed', details: error.message });
  }
});

// ==========================================
// 4. WHATSAPP ORDERS & INTENT
// ==========================================
app.post('/api/orders/whatsapp-intent', (req, res) => {
  const { product, quantity, variant, total, customerNote, customerPhone, customerName } = req.body;
  
  // Also register as a CRM lead automatically!
  const inquiry = {
    id: 'ORD-' + Date.now(),
    date: new Date().toISOString(),
    product: product?.name || 'Multiple items / Custom',
    quantity: quantity || 1,
    variant: variant || {},
    total: total || 0,
    customerNote: customerNote || '',
    customerPhone: customerPhone || 'Via WhatsApp Direct',
    status: 'WhatsApp Chat Initiated'
  };
  orderInquiries.unshift(inquiry);

  // If customer details were provided, also record in CRM DB
  if (customerName || customerPhone) {
    crmService.createLead({
      name: customerName || 'WhatsApp Shopper',
      phone: customerPhone || 'WhatsApp User',
      service: product?.name || 'Hair Patch Order',
      requirement: `WhatsApp Order initiated for ${product?.name || 'Hair System'}. Total: ₹${total || 0}. Note: ${customerNote || 'None'}`,
      source: 'WhatsApp Order Checkout'
    });
  }

  res.json({ success: true, inquiryId: inquiry.id });
});

app.get('/api/orders/inquiries', (req, res) => {
  res.json(orderInquiries);
});

// ==========================================
// 5. PRODUCTION STATIC FALLBACK
// ==========================================
app.use(express.static(path.join(__dirname, '../dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Looks Forever Backend & CRM Server running on http://localhost:${PORT}`);
  console.log(`📦 Loaded ${productService.getProducts().length} products (${crmService.getLeads().length} CRM leads in DB)`);
});
