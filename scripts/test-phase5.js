import fs from 'fs';
import path from 'path';

console.log('--- STARTING PHASE 5 AUTOMATED VERIFICATION ---');

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

// 1. Verify 2-Column Mobile Product Grid (Requirement #7)
const productGridContent = fs.readFileSync('./src/components/ProductGrid.jsx', 'utf8');
assert(productGridContent.includes('grid-cols-2') && productGridContent.includes('lg:grid-cols-3') && productGridContent.includes('xl:grid-cols-4'), 'Product grid uses 2 columns on mobile, 3 columns from 1024px, 4 columns from 1280px');
assert(productGridContent.includes('gap-3') && productGridContent.includes('sm:gap-6'), 'Grid enforces 12px gap on mobile (gap-3) and 24px gap on desktop (sm:gap-6)');
assert(productGridContent.includes('ProductSkeleton'), 'Grid provides matching skeleton loaders during data fetch');

// 2. Verify Product Card Design & Layout
const productCardContent = fs.readFileSync('./src/components/ProductCard.jsx', 'utf8');
assert(productCardContent.includes('aspect-[4/5]'), 'Product card enforces fixed 4/5 aspect ratio for images (zero layout shift)');
assert(productCardContent.includes('line-clamp-2'), 'Product card title clamps to 2 lines');
assert(productCardContent.includes('Buy on WhatsApp') || productCardContent.includes('Buy Now on WhatsApp'), 'Product card includes prominent Buy on WhatsApp button');
assert(productCardContent.includes('resolveImageUrl'), 'Product card image handling resolves through imageService');

// 3. Verify WhyChoose Component & Integration
const whyChoosePath = './src/components/WhyChoose.jsx';
assert(fs.existsSync(whyChoosePath), 'WhyChoose.jsx component exists');
const whyChooseContent = fs.readFileSync(whyChoosePath, 'utf8');
assert(whyChooseContent.includes('DEFAULT_BENEFITS') && whyChooseContent.includes('Why Choose Looks Forever'), 'WhyChoose component has defaults and clinical benefit points');

const storefrontContent = fs.readFileSync('./src/PublicStorefront.jsx', 'utf8');
const homePageContent = fs.existsSync('./src/pages/HomePage.jsx') ? fs.readFileSync('./src/pages/HomePage.jsx', 'utf8') : '';
assert(storefrontContent.includes('WhyChoose') || homePageContent.includes('<WhyChoose'), 'PublicStorefront or HomePage integrates WhyChoose component directly');

// 4. Verify OfferSlot Component & Analytics
const offerSlotPath = './src/components/OfferSlot.jsx';
assert(fs.existsSync(offerSlotPath), 'OfferSlot.jsx component exists');
const offerSlotContent = fs.readFileSync(offerSlotPath, 'utf8');
assert(offerSlotContent.includes('/api/offers?slot=') && offerSlotContent.includes('/api/track'), 'OfferSlot fetches slot data and fires analytics event');
assert(storefrontContent.includes('<OfferSlot slot="top_bar"'), 'PublicStorefront mounts OfferSlot at top_bar');

// 5. Verify Dynamic WhatsApp Ordering & Analytics Tracking (Requirement #9)
const waUtilContent = fs.readFileSync('./src/utils/whatsapp.js', 'utf8');
assert(waUtilContent.includes('getSanitizedWhatsAppNumber') && waUtilContent.includes('setCachedWhatsAppNumber'), 'WhatsApp utility supports dynamic database phone configuration');
assert(waUtilContent.includes('buy_now_click'), 'handleBuyNow fires background analytics event "buy_now_click" to /api/track');
assert(waUtilContent.includes('https://wa.me/'), 'WhatsApp utility generates standard free wa.me links');
assert(waUtilContent.includes('SKU:'), 'WhatsApp order message includes product SKU when present');

// 6. Verify Documentation
assert(fs.existsSync('./docs/WHY_CHOOSE_GUIDE.md'), 'docs/WHY_CHOOSE_GUIDE.md documentation file exists');

// 7. Verify Dynamic Settings Fetching in Storefront
assert(storefrontContent.includes('/api/settings?type=homepage'), 'Storefront fetches live homepage settings from MongoDB');
assert(storefrontContent.includes('/api/settings?type=general'), 'Storefront fetches live general settings from MongoDB');
assert(storefrontContent.includes('setCachedWhatsAppNumber'), 'Storefront updates WhatsApp number from database settings');

console.log(`\n========================================`);
console.log(`PHASE 5 TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
console.log(`========================================\n`);

if (failed > 0) {
  process.exit(1);
}

