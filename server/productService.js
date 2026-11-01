import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PRODUCTS_FILE = path.join(__dirname, 'data', 'products.json');
const SEED_FILE = path.join(__dirname, 'data', 'seed_products.json');

// Ensure directory exists
if (!fs.existsSync(path.join(__dirname, 'data'))) {
  fs.mkdirSync(path.join(__dirname, 'data'), { recursive: true });
}

// Read products safely
export function getProducts() {
  try {
    if (!fs.existsSync(PRODUCTS_FILE)) {
      if (fs.existsSync(SEED_FILE)) {
        const seedData = fs.readFileSync(SEED_FILE, 'utf8');
        fs.writeFileSync(PRODUCTS_FILE, seedData);
        return JSON.parse(seedData);
      }
      return [];
    }
    const data = fs.readFileSync(PRODUCTS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading products:', error);
    return [];
  }
}

// Save products
export function saveProducts(products) {
  try {
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error saving products:', error);
    return false;
  }
}

// Get single product
export function getProductById(id) {
  const products = getProducts();
  return products.find(p => String(p.id) === String(id));
}

// Add new product
export function addProduct(productData) {
  const products = getProducts();
  
  // Generate friendly unique ID if not provided
  const id = productData.id || `lf-custom-${Date.now().toString().slice(-6)}`;
  
  const newProduct = {
    id,
    name: productData.name || 'Untitled Hair System',
    category: productData.category || 'hair-patches',
    price: Number(productData.price) || 9999,
    originalPrice: Number(productData.originalPrice) || Math.round((Number(productData.price) || 9999) * 1.3),
    discount: productData.discount || '25% OFF',
    rating: Number(productData.rating) || 4.9,
    reviewCount: Number(productData.reviewCount) || 12,
    isBestseller: Boolean(productData.isBestseller),
    isNew: productData.isNew !== undefined ? Boolean(productData.isNew) : true,
    badge: productData.badge || 'New System',
    shortDesc: productData.shortDesc || '',
    description: productData.description || '',
    image: productData.image || 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=800&auto=format&fit=crop&q=80',
    gallery: Array.isArray(productData.gallery) && productData.gallery.length > 0
      ? productData.gallery
      : [productData.image || 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=800&auto=format&fit=crop&q=80'],
    specifications: productData.specifications || {
      "Base Type": "Undetectable Lace Mesh",
      "Hair Type": "100% Virgin Indian Remy Hair",
      "Hair Density": "120% Natural"
    },
    variants: Array.isArray(productData.variants) && productData.variants.length > 0
      ? productData.variants
      : [
          { name: "Base Size", options: ["7 x 5 inches", "8 x 6 inches", "9 x 7 inches"] },
          { name: "Hair Color", options: ["Natural Black #1B", "Dark Brown #2"] }
        ],
    createdAt: new Date().toISOString()
  };

  // Prepend so new items appear first
  products.unshift(newProduct);
  saveProducts(products);
  return newProduct;
}

// Update existing product
export function updateProduct(id, updates) {
  const products = getProducts();
  const index = products.findIndex(p => String(p.id) === String(id));
  if (index === -1) return null;

  const current = products[index];
  const updated = {
    ...current,
    ...updates,
    id: current.id, // preserve ID
    price: updates.price !== undefined ? Number(updates.price) : current.price,
    originalPrice: updates.originalPrice !== undefined ? Number(updates.originalPrice) : current.originalPrice,
    updatedAt: new Date().toISOString()
  };

  products[index] = updated;
  saveProducts(products);
  return updated;
}

// Delete product
export function deleteProduct(id) {
  const products = getProducts();
  const filtered = products.filter(p => String(p.id) !== String(id));
  if (filtered.length === products.length) return false;
  saveProducts(filtered);
  return true;
}

// Reset to scraped data
export function resetToSeed() {
  if (fs.existsSync(SEED_FILE)) {
    const seedData = fs.readFileSync(SEED_FILE, 'utf8');
    fs.writeFileSync(PRODUCTS_FILE, seedData);
    return JSON.parse(seedData);
  }
  return getProducts();
}

