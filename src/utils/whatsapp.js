import { SITE_CONFIG } from '../config/siteConfig';

// In-memory cache for dynamic database WhatsApp settings
let cachedWhatsAppNumber = null;

export function setCachedWhatsAppNumber(num) {
  if (num && typeof num === 'string') {
    cachedWhatsAppNumber = num.replace(/\D/g, '');
  }
}

/**
 * Clean phone number to strictly digits with country code
 * e.g. "919873433300"
 */
export function getSanitizedWhatsAppNumber() {
  if (cachedWhatsAppNumber) {
    return cachedWhatsAppNumber;
  }
  const raw = SITE_CONFIG.whatsappNumber || "919873433300";
  return raw.replace(/[^0-9]/g, '');
}

/**
 * Format variants into a readable string
 * e.g. "Base Size: 8 x 6 inches, Hair Color: Natural Black #1B"
 */
export function formatVariantString(variantObj) {
  if (!variantObj || typeof variantObj !== 'object') return 'Standard';
  const entries = Object.entries(variantObj);
  if (entries.length === 0) return 'Standard';
  return entries.map(([key, val]) => `${key}: ${val}`).join(' | ');
}

/**
 * Generates the WhatsApp order message matching exact specification:
 * 
 * Hello Looks Forever! I would like to order the following product:
 * 
 * Product: [Product Name]
 * SKU: [SKU if present]
 * Price: ₹[Price]
 * Quantity: [Quantity]
 * Variant: [Selected Variant, if applicable]
 * Product Link: [Product URL]
 * 
 * Please confirm availability and the next steps for ordering.
 */
export function generateSingleOrderMessage(product, quantity = 1, variant = {}, customNotes = '') {
  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://looksforever.org';
  const productUrl = `${currentOrigin}/#product-${product.slug || product._id || product.id}`;
  const formattedVariants = formatVariantString(variant);
  const formattedPrice = Number(product.price).toLocaleString('en-IN');

  let message = `Hello Looks Forever! I would like to order the following product:\n\n`;
  message += `Product: ${product.name}\n`;
  if (product.sku) {
    message += `SKU: ${product.sku}\n`;
  }
  message += `Price: ₹${formattedPrice}\n`;
  message += `Quantity: ${quantity}\n`;
  message += `Variant: ${formattedVariants}\n`;
  message += `Product Link: ${productUrl}\n\n`;
  
  if (customNotes && customNotes.trim().length > 0) {
    message += `Customer Note: ${customNotes.trim()}\n\n`;
  }

  message += `Please confirm availability and the next steps for ordering.`;
  return message;
}

/**
 * Generates a consolidated WhatsApp order message for multiple cart items
 */
export function generateCartOrderMessage(items, customNotes = '') {
  let message = `Hello Looks Forever! I would like to order the following items from your store:\n\n`;
  
  let grandTotal = 0;
  items.forEach((item, index) => {
    const itemTotal = item.product.price * item.quantity;
    grandTotal += itemTotal;
    const formattedVariants = formatVariantString(item.variant);
    
    message += `${index + 1}. ${item.product.name}\n`;
    if (item.product.sku) {
      message += `   SKU: ${item.product.sku}\n`;
    }
    message += `   Qty: ${item.quantity} | Unit Price: ₹${Number(item.product.price).toLocaleString('en-IN')}\n`;
    message += `   Variant: ${formattedVariants}\n`;
    message += `   Subtotal: ₹${Number(itemTotal).toLocaleString('en-IN')}\n\n`;
  });

  message += `--------------------------------\n`;
  message += `Total Estimated Value: ₹${Number(grandTotal).toLocaleString('en-IN')}\n`;
  message += `Store Link: ${typeof window !== 'undefined' ? window.location.origin : 'https://looksforever.org'}\n\n`;

  if (customNotes && customNotes.trim().length > 0) {
    message += `Customer Request / Note: ${customNotes.trim()}\n\n`;
  }

  message += `Please confirm product availability, shipping timeline, and payment/delivery instructions.`;
  return message;
}

/**
 * Generates consultation message
 */
export function generateConsultationMessage(subject = 'General Hair System Consultation') {
  return `Hello Looks Forever! I would like to book a free confidential hair replacement & aesthetic consultation.

Topic: ${subject}
Preferred Mode: WhatsApp Chat / Wave Mall Noida Clinic Visit

Please share available consultation slots and details. Thank you!`;
}

/**
 * Fires background analytics event to /api/track (non-blocking)
 */
async function trackEvent(type, productId = null, offerId = null) {
  try {
    if (typeof fetch !== 'undefined') {
      await fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          productId,
          offerId,
          path: typeof window !== 'undefined' ? window.location.pathname : '/'
        })
      });
    }
  } catch (err) {
    // Non-blocking
  }
}

/**
 * Reusable handleBuyNow function for product cards, product details modal, and mobile layouts.
 * Directly opens WhatsApp with the properly URL-encoded message and records analytics.
 */
export function handleBuyNow(product, quantity = 1, variant = {}, customNotes = '') {
  if (!product) return;

  const phone = getSanitizedWhatsAppNumber();
  const message = generateSingleOrderMessage(product, quantity, variant, customNotes);
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${phone}?text=${encodedMessage}`;

  // Log Buy Now click event in database analytics
  const prodId = product._id || product.id;
  trackEvent('buy_now_click', prodId);

  // Open official WhatsApp link
  if (typeof window !== 'undefined') {
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  }

  return whatsappUrl;
}

/**
 * Handle checkout for multiple cart items
 */
export function handleCartCheckout(cartItems, customNotes = '') {
  if (!cartItems || cartItems.length === 0) return;

  const phone = getSanitizedWhatsAppNumber();
  const message = generateCartOrderMessage(cartItems, customNotes);
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${phone}?text=${encodedMessage}`;

  // Track event
  trackEvent('buy_now_click', 'cart_checkout');

  if (typeof window !== 'undefined') {
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  }

  return whatsappUrl;
}

/**
 * Handle direct consultation click
 */
export function handleConsultation(topic = 'Hair Restoration & Aesthetic Solutions') {
  const phone = getSanitizedWhatsAppNumber();
  const message = generateConsultationMessage(topic);
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${phone}?text=${encodedMessage}`;

  // Track event
  trackEvent('buy_now_click', 'consultation_inquiry');

  if (typeof window !== 'undefined') {
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  }

  return whatsappUrl;
}
