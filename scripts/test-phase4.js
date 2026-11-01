import fs from 'fs';
import path from 'path';

console.log('--- STARTING PHASE 4 AUTOMATED VERIFICATION ---');

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`[PASS] ${message}`);
    passed++;
  } else {
    console.error(`[FAIL] ${message}`);
    failed++;
  }
}

// 1. Verify all 12 Admin Views exist
const expectedViews = [
  'DashboardView.jsx',
  'ProductsView.jsx',
  'CategoriesView.jsx',
  'HomepageView.jsx',
  'OffersView.jsx',
  'BlogsView.jsx',
  'AboutView.jsx',
  'ContactView.jsx',
  'HeaderFooterView.jsx',
  'SeoView.jsx',
  'SettingsView.jsx',
  'AnalyticsView.jsx',
  'LoginView.jsx'
];

expectedViews.forEach(v => {
  const p = path.join('./src/admin/views', v);
  assert(fs.existsSync(p), `Admin View exists: ${v}`);
});

// 2. Verify all Design System components
const expectedComponents = [
  'AdminButton.jsx',
  'AdminCard.jsx',
  'AdminBadge.jsx',
  'AdminInput.jsx',
  'AdminSelect.jsx',
  'AdminTextarea.jsx',
  'AdminToggle.jsx',
  'ConfirmDialog.jsx',
  'AdminPagination.jsx',
  'AdminPageHeader.jsx',
  'StickyActionBar.jsx',
  'ImageInput.jsx',
  'RichTextEditor.jsx'
];

expectedComponents.forEach(c => {
  const p = path.join('./src/admin/components', c);
  assert(fs.existsSync(p), `Design System component exists: ${c}`);
});

// 3. Verify Image Service
const imgServicePath = './src/services/imageService.js';
assert(fs.existsSync(imgServicePath), 'Image Service exists at src/services/imageService.js');
const imgServiceContent = fs.readFileSync(imgServicePath, 'utf8');
assert(imgServiceContent.includes('isValidImageUrl') && imgServiceContent.includes('resolveImageUrl'), 'Image Service exports validation and resolver methods');

// 4. Verify Admin Panel is HIDDEN from Public Storefront
const navbarContent = fs.readFileSync('./src/components/Navbar.jsx', 'utf8');
const navbarAdminButtons = navbarContent.includes('Admin Panel') || navbarContent.includes('/admin');
assert(!navbarAdminButtons, 'Public Navbar has NO admin button or link');

const footerContent = fs.readFileSync('./src/components/Footer.jsx', 'utf8');
const footerAdminButtons = footerContent.includes('/admin');
assert(!footerAdminButtons, 'Public Footer has NO admin button or link');

const robotsContent = fs.readFileSync('./public/robots.txt', 'utf8');
assert(!robotsContent.includes('admin'), 'robots.txt has NO mention of /admin (Security through obscurity rule maintained)');

const sitemapContent = fs.readFileSync('./api/sitemap.js', 'utf8');
assert(!sitemapContent.includes('/admin'), 'Dynamic Sitemap excludes /admin');

// 5. Verify Lazy Loading & Code Splitting in dist/
const distAssets = fs.existsSync('./dist/assets') ? fs.readdirSync('./dist/assets') : [];
const adminChunk = distAssets.find(f => f.startsWith('AdminApp-') && f.endsWith('.js'));
assert(Boolean(adminChunk), `Admin bundle is strictly code-split: ${adminChunk || 'None'}`);

const indexChunk = distAssets.find(f => f.startsWith('index-') && f.endsWith('.js'));
assert(Boolean(indexChunk), `Public index chunk is separated: ${indexChunk || 'None'}`);

// 6. Verify Admin Layout injects noindex meta
const layoutContent = fs.readFileSync('./src/admin/AdminLayout.jsx', 'utf8');
assert(layoutContent.includes('noindex, nofollow'), 'Admin Layout actively sets noindex, nofollow meta tag');

console.log(`\n========================================`);
console.log(`PHASE 4 TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
console.log(`========================================\n`);

if (failed > 0) {
  process.exit(1);
}

