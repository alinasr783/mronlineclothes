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

  // Shipping fees by zone (EGP)
  shipping: {
    cairoGiza: 60,     // القاهرة / الجيزة / القليوبية
    deltaCanal: 75,    // الإسكندرية، الدلتا، مدن القناة
    upperEgypt: 95     // الصعيد والمحافظات الحدودية
  },
  freeShippingOver: 2500,   // free shipping threshold (subtotal)

  // Bundle offer: buy N pieces or more → percent off
  bundle: { minQty: 2, percent: 10 },

  // Promo codes: code → percent off
  promoCodes: { ROYALE10: 10, WELCOME: 15 },

  defaultLang: "ar"         // "ar" or "en"
};
