/* ==========================================================
   MAISON ROYALE — Product catalogue
   Each product:
     id, name {en,ar}, tagline {en,ar}, price, compareAt (optional),
     style: "pullover" | "zip" | "cropped"
     print: "monogram" | "wordmark" | "star" | "crest"   (chest / back artwork)
     colors: [{ key, name{en,ar}, hex }]
     badge: "new" | "limited" | "best" | null
     category: "essentials" | "signature" | "limited"
     images (optional): array of real photo URLs — when provided,
       they replace the illustrated garment automatically.
   ========================================================== */
window.MR_COLORS = {
  noir:     { hex: "#151413", en: "Noir",      ar: "أسود ملكي" },
  ivory:    { hex: "#e9e3d6", en: "Ivory",     ar: "عاجي" },
  stone:    { hex: "#a59d90", en: "Stone",     ar: "رمادي حجري" },
  charcoal: { hex: "#3a3836", en: "Charcoal",  ar: "فحمي" },
  bordeaux: { hex: "#5a1d24", en: "Bordeaux",  ar: "نبيتي" },
  minuit:   { hex: "#1c2333", en: "Minuit",    ar: "كحلي ليلي" },
  olive:    { hex: "#4b4c36", en: "Olive",     ar: "زيتي" },
  sand:     { hex: "#c8b79b", en: "Sand",      ar: "رملي" },
  mocha:    { hex: "#5b4636", en: "Mocha",     ar: "موكا" }
};

window.MR_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

window.MR_PRODUCTS = [
  {
    id: "le-monogramme",
    name: { en: "Le Monogramme", ar: "لو مونوجرام" },
    tagline: { en: "Heavyweight hoodie · tonal MR embroidery", ar: "هودي تقيل · تطريز MR بنفس اللون" },
    desc: {
      en: "Our signature silhouette, cut from 460gsm brushed-back cotton fleece. The MR monogram is embroidered tone-on-tone at the chest — visible only up close, the way true luxury should be.",
      ar: "القصّة المميزة بتاعتنا من قطن فليس ٤٦٠ جرام مبطّن من جوا. مونوجرام MR متطرّز بنفس لون القماش على الصدر — بيبان بس من قريب، زي ما الفخامة الحقيقية لازم تكون."
    },
    price: 1850, compareAt: null,
    style: "pullover", print: "monogram",
    colors: ["noir", "ivory", "stone"],
    badge: "best", category: "essentials", soldOut: []
  },
  {
    id: "couronne-oversized",
    name: { en: "Couronne Oversized", ar: "كورون أوفرسايز" },
    tagline: { en: "Dropped shoulders · embroidered back wordmark", ar: "كتف نازل · اسم البراند متطرّز على الضهر" },
    desc: {
      en: "A relaxed, boxy fit with dropped shoulders and an extended rib hem. MAISON ROYALE is embroidered across the back in raised ivory thread.",
      ar: "قصّة واسعة بكتف نازل وأستك طويل من تحت. اسم MAISON ROYALE متطرّز على الضهر بخيط عاجي بارز."
    },
    price: 2100, compareAt: 2400,
    style: "pullover", print: "wordmark",
    colors: ["noir", "charcoal", "mocha"],
    badge: "new", category: "signature", soldOut: []
  },
  {
    id: "etoile-zip",
    name: { en: "Étoile Zip-Through", ar: "إيتوال بسوستة" },
    tagline: { en: "Full zip · silver-tone hardware · star detail", ar: "سوستة كاملة · إكسسوارات فضي · تفصيلة النجمة" },
    desc: {
      en: "A full zip-through hoodie with brushed silver-tone hardware and our four-point star embroidered at the chest. Layer it over everything.",
      ar: "هودي بسوستة كاملة بإكسسوارات فضي مطفي ونجمة البراند الرباعية متطرّزة على الصدر. البسه فوق أي حاجة."
    },
    price: 2250, compareAt: null,
    style: "zip", print: "star",
    colors: ["bordeaux", "noir", "ivory"],
    badge: "new", category: "signature", soldOut: ["XS"]
  },
  {
    id: "atelier-washed",
    name: { en: "Atelier Washed", ar: "أتيليه مغسول" },
    tagline: { en: "Garment-dyed · vintage wash · lived-in feel", ar: "مصبوغ بعد الخياطة · غسلة فينتدج" },
    desc: {
      en: "Garment-dyed and enzyme-washed for a soft, lived-in hand and subtle tonal variation. No two pieces are exactly alike.",
      ar: "مصبوغ بعد الخياطة ومغسول غسلة إنزيم عشان ملمس ناعم وإحساس فينتدج. مفيش قطعتين شبه بعض بالظبط."
    },
    price: 1950, compareAt: null,
    style: "pullover", print: "crest",
    colors: ["charcoal", "sand", "olive"],
    badge: null, category: "essentials", soldOut: []
  },
  {
    id: "minuit",
    name: { en: "Minuit", ar: "مينوي" },
    tagline: { en: "Midnight navy · embroidered monogram", ar: "كحلي منتصف الليل · مونوجرام متطرّز" },
    desc: {
      en: "Named for the hour the city belongs to you. Deep midnight navy with an ivory MR monogram and contrast drawcords.",
      ar: "اسمه على الساعة اللي المدينة بتبقى فيها ملكك. كحلي غامق بمونوجرام MR عاجي وأربطة بلون مختلف."
    },
    price: 1850, compareAt: null,
    style: "pullover", print: "monogram",
    colors: ["minuit", "noir"],
    badge: null, category: "essentials", soldOut: []
  },
  {
    id: "heritage",
    name: { en: "Héritage", ar: "إيريتاج" },
    tagline: { en: "Crest embroidery · double-layer hood", ar: "تطريز الشعار · كابيشون طبقتين" },
    desc: {
      en: "A double-layer hood that holds its shape, a crest embroidered at the chest, and a ribbed side panel for movement. Built to be handed down.",
      ar: "كابيشون طبقتين بيحافظ على شكله، شعار متطرّز على الصدر، وجناب مضلّعة للحركة. معمول عشان يعيش معاك سنين."
    },
    price: 2050, compareAt: null,
    style: "pullover", print: "crest",
    colors: ["olive", "stone", "noir"],
    badge: null, category: "signature", soldOut: []
  },
  {
    id: "signature-cropped",
    name: { en: "Signature Cropped", ar: "سيجنتشر كروب" },
    tagline: { en: "Boxy cropped fit · raw-edge hem", ar: "قصّة قصيرة واسعة · طرف خام" },
    desc: {
      en: "A boxy, cropped hoodie with a raw-cut hem and a wide hood. The monogram is embroidered small at the centre chest.",
      ar: "هودي قصير وواسع بطرف خام وكابيشون عريض. المونوجرام متطرّز صغير في نص الصدر."
    },
    price: 1750, compareAt: 1950,
    style: "cropped", print: "monogram",
    colors: ["ivory", "noir", "sand"],
    badge: null, category: "essentials", soldOut: []
  },
  {
    id: "prestige-edition",
    name: { en: "Prestige — Édition Limitée", ar: "بريستيج — إصدار محدود" },
    tagline: { en: "Numbered · 100 pieces only · silver thread", ar: "مترقّم · ١٠٠ قطعة بس · خيط فضي" },
    desc: {
      en: "Our most exclusive piece. 520gsm loopback fleece, monogram and wordmark embroidered in metallic silver thread, numbered inner label. Only 100 will ever be made.",
      ar: "أكتر قطعة حصرية عندنا. فليس ٥٢٠ جرام، المونوجرام والاسم متطرّزين بخيط فضي معدني، وليبل داخلي مترقّم. هيتعمل منه ١٠٠ قطعة بس، ومش هيتكرر."
    },
    price: 2850, compareAt: null,
    style: "pullover", print: "wordmark",
    colors: ["noir"],
    badge: "limited", category: "limited", soldOut: [], stock: 17
  }
];
