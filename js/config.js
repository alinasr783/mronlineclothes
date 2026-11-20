/* ==========================================================
   MAISON ROYALE — Store configuration
   Edit these values to customise the store.
   ========================================================== */
window.MR_CONFIG = {
  brand: "Maison Royale",

  // WhatsApp number that receives orders (international format, digits only).
  // Example for Egypt: 2010XXXXXXXX  ← CHANGE THIS
  whatsapp: "201000000000",

  // Social links (leave "" to hide)
  instagram: "https://instagram.com/",
  tiktok: "https://tiktok.com/",
  facebook: "https://facebook.com/",

  currency: { en: "EGP", ar: "ج.م" },

  // Shipping
  shippingFee: 85,          // flat shipping fee
  freeShippingOver: 3500,   // free shipping threshold (subtotal)

  // Promo codes: code → percent off
  promoCodes: { ROYALE10: 10, WELCOME: 15 },

  defaultLang: "en"         // "en" or "ar"
};
