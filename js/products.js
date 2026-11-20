/* ==========================================================
   MAISON ROYALE — Product catalogue
   Each product:
     id, name {en,ar}, tagline {en,ar}, desc {en,ar}, price, compareAt (optional)
     colors: keys from MR_COLORS
     badge: "new" | "limited" | "best" | null
     category: "essentials" | "signature" | "limited"
     images (optional): { colorKey: ["url-front", "url-2", "url-3"] }
       → your own product photos. When set they replace the stock photos.
   ========================================================== */
window.MR_COLORS = {
  noir:     { hex: "#151413", en: "Noir",         ar: "أسود" },
  ivory:    { hex: "#ece8df", en: "Ivory",        ar: "أوف وايت" },
  sand:     { hex: "#cdbb9c", en: "Sand",         ar: "بيج" },
  stone:    { hex: "#9c9184", en: "Stone",        ar: "رمادي حجري" },
  grey:     { hex: "#a3a4a2", en: "Heather Grey", ar: "رمادي ميلانج" },
  charcoal: { hex: "#3a3836", en: "Charcoal",     ar: "فحمي" },
  mocha:    { hex: "#6b4f3a", en: "Mocha",        ar: "بني موكا" },
  olive:    { hex: "#4f5a3c", en: "Olive",        ar: "زيتي" },
  minuit:   { hex: "#1f2a44", en: "Navy",         ar: "كحلي" },
  rouge:    { hex: "#9a1f24", en: "Rouge",        ar: "أحمر" }
};

/* Stock photography (Unsplash licence — free for commercial use).
   Replace with your own photos any time via product.images. */
window.MR_PHOTOS = {
  noir:     ["1677538537484-324385aff147", "1579572331145-5e53b299c64e", "1757495404191-e94ed7e70046", "1513789181297-6f2ec112c0bc"],
  ivory:    ["1620799140188-3b2a02fd9a77", "1688111421205-a0a85415b224", "1632682582909-2b3a2581eef7", "1601063476271-a159c71ab0b3", "1526476148966-98bd039463ea", "1738486260590-23c954cf29b8"],
  sand:     ["1647771746277-eac927afab2c", "1691132615844-b013a05b51e7", "1564557287817-3785e38ec1f5"],
  stone:    ["1611817757591-c3f345024273", "1632073143817-8cd5b2165e20", "1564557287817-3785e38ec1f5"],
  grey:     ["1556821840-3a63f95609a7", "1611817757591-c3f345024273", "1632073143817-8cd5b2165e20"],
  charcoal: ["1647797819874-f51a8a8fc5c0", "1618769122190-df76dfa92d94", "1513789181297-6f2ec112c0bc"],
  mocha:    ["1578768079052-aa76e52ff62e", "1508216310976-c518daae0cdc"],
  olive:    ["1565978771542-0db9ab9ad3de", "1454793781512-0fafb38dce83", "1649914580264-d537ea4fbc52"],
  minuit:   ["1739384994765-d44f7af12029", "1647361257391-5285b0a88a30", "1576693239181-317efff553bb"],
  rouge:    ["1602365659636-26070b7fc7ca", "1571297760255-6b5b9743ccbf"],
  detail:   ["1581655353466-d5ad6765dd37", "1636923611438-8fd1e53ed06c"],
  rack:     "1699275303942-47957eea44b1"
};

window.MR_SIZES = ["S", "M", "L", "XL", "XXL", "3XL"];

window.MR_PRODUCTS = [
  {
    id: "le-monogramme",
    name: { en: "Le Monogramme", ar: "لو مونوجرام" },
    tagline: { en: "Heavyweight hoodie · tonal MR embroidery", ar: "هودي تقيل · تطريز MR بنفس اللون" },
    desc: {
      en: "Our signature silhouette in 460gsm brushed-back cotton fleece. The MR monogram is embroidered tone-on-tone at the chest — visible only up close.",
      ar: "القصّة الأساسية بتاعتنا من قطن فليس ٤٦٠ جرام مبطّن من جوا. مونوجرام MR متطرّز بنفس لون القماش على الصدر — شيك ومن غير دوشة."
    },
    price: 1450, compareAt: null,
    colors: ["noir", "ivory", "stone"],
    badge: "best", category: "essentials", soldOut: []
  },
  {
    id: "couronne-oversized",
    name: { en: "Couronne Oversized", ar: "كورون أوفرسايز" },
    tagline: { en: "Dropped shoulders · boxy fit", ar: "كتف نازل · قصّة واسعة" },
    desc: {
      en: "A relaxed, boxy fit with dropped shoulders and an extended rib hem. MAISON ROYALE embroidered across the back.",
      ar: "قصّة أوفرسايز بكتف نازل وأستك طويل من تحت. اسم MAISON ROYALE متطرّز على الضهر."
    },
    price: 1650, compareAt: 1850,
    colors: ["charcoal", "noir", "mocha"],
    badge: "new", category: "signature", soldOut: []
  },
  {
    id: "etoile",
    name: { en: "Étoile", ar: "إيتوال" },
    tagline: { en: "Statement colour · star embroidery", ar: "لون جريء · تطريز النجمة" },
    desc: {
      en: "For the days you want to be seen. A bold colourway with our four-point star embroidered at the chest.",
      ar: "للأيام اللي عايز تتشاف فيها. لون جريء ونجمة البراند الرباعية متطرّزة على الصدر."
    },
    price: 1550, compareAt: null,
    colors: ["rouge", "noir", "ivory"],
    badge: "new", category: "signature", soldOut: ["S"]
  },
  {
    id: "atelier-washed",
    name: { en: "Atelier Washed", ar: "أتيليه مغسول" },
    tagline: { en: "Garment-dyed · vintage wash", ar: "مصبوغ بعد الخياطة · غسلة فينتدج" },
    desc: {
      en: "Garment-dyed and enzyme-washed for a soft, lived-in hand and subtle tonal variation.",
      ar: "مصبوغ بعد الخياطة ومغسول غسلة إنزيم عشان ملمس ناعم جداً وإحساس فينتدج."
    },
    price: 1550, compareAt: null,
    colors: ["sand", "charcoal", "olive"],
    badge: null, category: "essentials", soldOut: []
  },
  {
    id: "minuit",
    name: { en: "Minuit", ar: "مينوي" },
    tagline: { en: "Deep navy · contrast drawcords", ar: "كحلي غامق · أربطة بلون مختلف" },
    desc: {
      en: "Named for the hour the city belongs to you. Deep navy with an ivory monogram and contrast drawcords.",
      ar: "اسمه على الساعة اللي البلد بتبقى فيها بتاعتك. كحلي غامق بمونوجرام أوف وايت وأربطة بلون مختلف."
    },
    price: 1450, compareAt: null,
    colors: ["minuit", "noir"],
    badge: null, category: "essentials", soldOut: []
  },
  {
    id: "heritage",
    name: { en: "Héritage", ar: "إيريتاج" },
    tagline: { en: "Crest embroidery · double-layer hood", ar: "تطريز الشعار · كابيشون طبقتين" },
    desc: {
      en: "A double-layer hood that holds its shape, a crest embroidered at the chest and ribbed side panels for movement.",
      ar: "كابيشون طبقتين بيحافظ على شكله، شعار متطرّز على الصدر، وجناب مضلّعة تريّحك في الحركة."
    },
    price: 1650, compareAt: null,
    colors: ["olive", "stone", "noir"],
    badge: null, category: "signature", soldOut: []
  },
  {
    id: "signature-everyday",
    name: { en: "Signature Everyday", ar: "سيجنتشر إيفري داي" },
    tagline: { en: "Mid-weight 380gsm · all-season", ar: "وزن متوسط ٣٨٠ جرام · لكل المواسم" },
    desc: {
      en: "A lighter 380gsm fleece for Egypt's in-between weather — warm enough for winter nights, light enough for spring.",
      ar: "فليس أخف ٣٨٠ جرام مناسب لجو مصر — يدفّي في ليالي الشتا وخفيف كفاية للربيع."
    },
    price: 1350, compareAt: 1500,
    colors: ["ivory", "grey", "sand"],
    badge: null, category: "essentials", soldOut: []
  },
  {
    id: "prestige-edition",
    name: { en: "Prestige — Édition Limitée", ar: "بريستيج — إصدار محدود" },
    tagline: { en: "Numbered · 100 pieces only · silver thread", ar: "مترقّم · ١٠٠ قطعة بس · خيط فضي" },
    desc: {
      en: "Our most exclusive piece. 520gsm loopback fleece, monogram and wordmark embroidered in metallic silver thread, numbered inner label. Only 100 will ever be made.",
      ar: "أكتر قطعة حصرية عندنا. فليس ٥٢٠ جرام، المونوجرام والاسم متطرّزين بخيط فضي، وليبل داخلي مترقّم. ١٠٠ قطعة بس ومش هتتكرر."
    },
    price: 2250, compareAt: null,
    colors: ["noir"],
    badge: "limited", category: "limited", soldOut: [], stock: 17
  }
];
