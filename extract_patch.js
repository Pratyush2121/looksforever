import fs from 'fs';

const html = fs.readFileSync('gents-hair-patch.html', 'utf8');

// Find all product sections
// Notice: each product starts with <h2 class="...videoclass...">
const productRegex = /<h2 class="[^"]*videoclass[^"]*">\s*([\s\S]*?)<\/h2>([\s\S]*?)(?=<h2 class="[^"]*videoclass[^"]*"|$)/g;

const products = [];
let match;
let counter = 1;

while ((match = productRegex.exec(html)) !== null) {
  const title = match[1].replace(/<[^>]+>/g, '').trim();
  const body = match[2];

  // Skip "Product Videos" or non-products
  if (title.toLowerCase().includes('product video') || title.toLowerCase().includes('explore more')) {
    continue;
  }

  // Price
  const priceMatch = body.match(/Rs&nbsp;([0-9,]+)/i) || body.match(/(?:Rs\.?|₹)\s*([0-9,]+)/i);
  const rawPrice = priceMatch ? parseInt(priceMatch[1].replace(/,/g, ''), 10) : 10999;

  // Image
  const imgMatch = body.match(/data-bimg="([^"]+)"/) || 
                   body.match(/dataimg="([^"]+)"/) || 
                   body.match(/data-multiimg="([^",]+)/) ||
                   body.match(/src="(https:\/\/5\.imimg\.com\/[^"]+)"/);
  const image = imgMatch ? imgMatch[1] : '';

  // Gallery
  const multiMatch = body.match(/data-multiimg="([^"]+)"/);
  let gallery = [];
  if (multiMatch) {
    gallery = multiMatch[1].split(',').filter(url => !url.includes('youtube') && !url.includes('ytimg'));
  }
  if (!gallery.length && image) gallery = [image];

  // Specifications
  const specs = {};
  const trMatches = body.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi);
  for (const tr of trMatches) {
    const tds = [...tr[1].matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)].map(td => td[1].replace(/<[^>]+>/g, '').trim());
    if (tds.length >= 2 && tds[0] && tds[1]) {
      // Avoid table header or noise
      if (!tds[0].toLowerCase().includes('approx') && !tds[0].toLowerCase().includes('price')) {
        specs[tds[0]] = tds[1];
      }
    }
  }

  // Description paragraphs
  const descParagraphs = [];
  const pMatches = body.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi);
  for (const p of pMatches) {
    const text = p[1].replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').trim();
    if (text && !text.toLowerCase().includes('product details') && text.length > 5) {
      descParagraphs.push(text);
    }
  }

  const description = descParagraphs.length > 0 ? descParagraphs.join('\n\n') : 'Premium quality virgin human hair patch handcrafted with an undetectable hairline base.';
  const shortDesc = descParagraphs[0] || '100% Indian Remy Human Hair Patch with invisible base.';

  products.push({
    id: `lf-patch-${counter < 10 ? '0' + counter : counter}`,
    name: title,
    category: "hair-patches",
    price: rawPrice || 11999,
    originalPrice: Math.round((rawPrice || 11999) * 1.3),
    discount: "25% OFF",
    rating: Number((4.7 + (counter % 3) * 0.1).toFixed(1)),
    reviewCount: 45 + (counter * 7),
    isBestseller: counter <= 4,
    isNew: counter % 3 === 0,
    badge: counter === 1 ? "Top Rated" : counter === 2 ? "Bestseller" : "Authentic Looks Forever",
    shortDesc: shortDesc.substring(0, 150),
    description,
    image,
    gallery,
    specifications: Object.keys(specs).length > 0 ? specs : {
      "Base Type": "Fine Swiss / French Micro Mesh",
      "Hair Type": "100% Virgin Natural Human Hair",
      "Hair Density": "120% Medium Natural",
      "Application": "Hair Bonding / Taping / Clipping",
      "Lifespan": "8 - 12 Months"
    },
    variants: [
      { name: "Base Size", options: ["7 x 5 inches", "8 x 6 inches", "9 x 7 inches", "10 x 8 inches"] },
      { name: "Hair Color", options: ["Natural Black #1B", "Off Black #1", "Dark Brown #2"] },
      { name: "Hair Length", options: ["6 Inches (Standard)", "8 Inches (+ ₹1,200)"] }
    ]
  });
  counter++;
}

console.log(`Parsed ${products.length} products from gents-hair-patch.html`);
console.log(JSON.stringify(products.slice(0, 3), null, 2));

fs.writeFileSync('scraped_products.json', JSON.stringify(products, null, 2));
