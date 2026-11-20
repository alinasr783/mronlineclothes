/* =============================================================
   MAISON ROYALE — Storefront application
   Vanilla JS · hash router · cart · wishlist · WhatsApp checkout
   Light / dark themes · Arabic-first (Egypt)
   ============================================================= */
(function () {
  "use strict";

  const CFG = window.MR_CONFIG;
  const I18N = window.MR_I18N;
  const PRODUCTS = window.MR_PRODUCTS;
  const COLORS = window.MR_COLORS;
  const SIZES = window.MR_SIZES;
  const PH = window.MR_PHOTOS;

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const isDesktop = () => window.innerWidth >= 900;

  /* ---------------- Storage (safe) ---------------- */
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* ignore */ } }
  };

  const state = {
    lang: store.get("mr_lang", CFG.defaultLang || "ar"),
    cart: store.get("mr_cart", []).filter((it) => PRODUCTS.some((p) => p.id === it.id && p.colors.includes(it.color))),
    wish: store.get("mr_wish", []).filter((id) => PRODUCTS.some((p) => p.id === id)),
    promo: store.get("mr_promo", null)
  };
  if (!I18N[state.lang]) state.lang = "ar";

  /* ---------------- i18n ---------------- */
  function t(key, vars) {
    let s = (I18N[state.lang] && I18N[state.lang][key]) || I18N.en[key] || key;
    if (vars) Object.keys(vars).forEach((k) => { s = s.split("{" + k + "}").join(vars[k]); });
    return s;
  }
  const L = (obj) => (obj && (obj[state.lang] || obj.en)) || "";
  const money = (n) => `${Math.round(n).toLocaleString("en-US")} ${CFG.currency[state.lang] || CFG.currency.en}`;
  const colorName = (k) => (COLORS[k] ? COLORS[k][state.lang] || COLORS[k].en : k);
  const getP = (id) => PRODUCTS.find((p) => p.id === id);
  const govs = () => window.MR_GOVS[state.lang] || window.MR_GOVS.en;

  function applyStaticI18n() {
    const html = document.documentElement;
    html.lang = state.lang;
    html.dir = state.lang === "ar" ? "rtl" : "ltr";
    $$("[data-i18n]").forEach((el) => { el.textContent = t(el.dataset.i18n); });
    $$("[data-i18n-ph]").forEach((el) => { el.placeholder = t(el.dataset.i18nPh); });
    $("#themeBtn").setAttribute("aria-label", t("theme.toggle"));
    $("#waFloat").href = `https://wa.me/${CFG.whatsapp}?text=${encodeURIComponent(state.lang === "ar" ? "أهلاً Maison Royale 👋" : "Hello Maison Royale 👋")}`;
    renderAnnounce();
  }

  /* ---------------- Theme ---------------- */
  const getTheme = () => document.documentElement.getAttribute("data-theme") || "dark";
  function setTheme(th) {
    document.documentElement.setAttribute("data-theme", th);
    store.set("mr_theme", th);
    const meta = $('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", th === "light" ? "#f5f0e8" : "#0c0b0a");
  }
  function toggleTheme(e) {
    const next = getTheme() === "light" ? "dark" : "light";
    const btn = $("#themeBtn");
    btn.classList.remove("spin"); void btn.offsetWidth; btn.classList.add("spin");
    if (!document.startViewTransition || reduced) { setTheme(next); return; }
    const r = btn.getBoundingClientRect();
    const x = e && e.clientX ? e.clientX : r.left + r.width / 2;
    const y = e && e.clientY ? e.clientY : r.top + r.height / 2;
    const rad = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    const vt = document.startViewTransition(() => setTheme(next));
    vt.ready.then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${rad}px at ${x}px ${y}px)`] },
        { duration: 750, easing: "cubic-bezier(.76,0,.24,1)", pseudoElement: "::view-transition-new(root)" }
      );
    }).catch(() => {});
  }

  /* ---------------- Icons ---------------- */
  const ICON = {
    arrow: '<svg class="arrow" viewBox="0 0 24 24"><path d="M4 12h15M13 6l6 6-6 6"/></svg>',
    heart: '<svg viewBox="0 0 24 24"><path d="M12 20s-7.5-4.6-7.5-10.1C4.5 7 6.6 5 9 5c1.4 0 2.4.6 3 1.6C12.6 5.6 13.6 5 15 5c2.4 0 4.5 2 4.5 4.9C19.5 15.4 12 20 12 20z"/></svg>',
    go: '<svg viewBox="0 0 24 24"><path d="M6 18L18 6M8 6h10v10"/></svg>',
    truck: '<svg viewBox="0 0 24 24"><path d="M3 6h11v10H3zM14 9h4l3 3v4h-7"/><circle cx="7" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/></svg>',
    cash: '<svg viewBox="0 0 24 24"><rect x="3" y="6" width="18" height="12" rx="2"/><circle cx="12" cy="12" r="2.6"/></svg>',
    swap: '<svg viewBox="0 0 24 24"><path d="M4 8h14l-3-3M20 16H6l3 3"/></svg>',
    box: '<svg viewBox="0 0 24 24"><path d="M3.5 7.5L12 3l8.5 4.5v9L12 21l-8.5-4.5z"/><path d="M3.5 7.5L12 12l8.5-4.5M12 12v9"/><path d="M8 5.2l8.5 4.5"/></svg>',
    chat: '<svg viewBox="0 0 24 24"><path d="M4 5h16v11H9l-5 4z"/><path d="M8 9.5h8M8 12.5h5"/></svg>',
    wa: '<svg viewBox="0 0 24 24"><path d="M12 3.2a8.8 8.8 0 0 0-7.6 13.2L3.2 20.8l4.5-1.2A8.8 8.8 0 1 0 12 3.2zm4.5 12.3c-.2.6-1.1 1.1-1.6 1.1-.4.1-1 .1-3.1-.8-2.6-1.1-4.2-3.7-4.4-3.9-.1-.2-1-1.4-1-2.7s.7-1.9.9-2.2c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 1.9c.1.1.1.3 0 .5l-.3.5-.4.4c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.1 1 2.1 1.3 2.4 1.5.3.1.5.1.6-.1l.9-1.1c.2-.3.4-.2.6-.1l1.8.9c.3.1.4.2.5.3 0 .1 0 .7-.1 1.3z"/></svg>',
    ig: '<svg viewBox="0 0 24 24"><rect x="3.5" y="3.5" width="17" height="17" rx="5" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="12" cy="12" r="3.8" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="17.2" cy="6.8" r="1.1"/></svg>',
    tt: '<svg viewBox="0 0 24 24"><path d="M16.6 3c.4 2.3 1.8 3.8 4 4.1v3.1a7.6 7.6 0 0 1-4-1.2v6.3A5.9 5.9 0 1 1 10.7 9.4v3.2a2.8 2.8 0 1 0 2.8 2.8V3h3.1z"/></svg>',
    fb: '<svg viewBox="0 0 24 24"><path d="M13.6 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H7.9v3h2.6V21h3.1z"/></svg>'
  };
  const starHTML = '<i class="star"></i>';

  function socialsHTML() {
    const out = [];
    if (CFG.instagram) out.push(`<a class="social" href="${CFG.instagram}" target="_blank" rel="noopener" aria-label="Instagram">${ICON.ig}</a>`);
    if (CFG.tiktok) out.push(`<a class="social" href="${CFG.tiktok}" target="_blank" rel="noopener" aria-label="TikTok">${ICON.tt}</a>`);
    if (CFG.facebook) out.push(`<a class="social" href="${CFG.facebook}" target="_blank" rel="noopener" aria-label="Facebook">${ICON.fb}</a>`);
    if (CFG.whatsapp) out.push(`<a class="social" href="https://wa.me/${CFG.whatsapp}" target="_blank" rel="noopener" aria-label="WhatsApp">${ICON.wa}</a>`);
    return out.join("");
  }

  /* ---------------- Photos ---------------- */
  const isUnsplash = (id) => !/^(https?:|assets\/|\.\/|\/)/.test(id);
  const phURL = (id, w) => isUnsplash(id) ? `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=70` : id;
  function photoHTML(id, opts = {}) {
    const sizes = opts.sizes || "(min-width: 1200px) 25vw, (min-width: 900px) 33vw, 50vw";
    const srcset = isUnsplash(id) ? `srcset="${[400, 700, 1000, 1400].map((w) => phURL(id, w) + " " + w + "w").join(", ")}" sizes="${sizes}"` : "";
    return `<img class="ph" src="${phURL(id, opts.w || 800)}" ${srcset} alt="${opts.alt || ""}" ${opts.eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;
  }
  function gallery(p, ck) {
    if (p.images && p.images[ck] && p.images[ck].length) return p.images[ck];
    const base = PH[ck] || PH.noir;
    const i = PRODUCTS.indexOf(p);
    const off = i % base.length;
    const rot = base.slice(off).concat(base.slice(0, off));
    return rot.slice(0, 3).concat([PH.detail[i % PH.detail.length]]);
  }
  function visual(p, ck, idx = 0, opts = {}) {
    const c = ck || p.colors[0];
    const g = gallery(p, c);
    return photoHTML(g[Math.min(idx, g.length - 1)], Object.assign({ alt: `${L(p.name)} — ${colorName(c)}` }, opts));
  }
  // fade photos in once loaded
  document.addEventListener("load", (e) => { if (e.target.classList && e.target.classList.contains("ph")) e.target.classList.add("loaded"); }, true);
  document.addEventListener("error", (e) => { if (e.target.classList && e.target.classList.contains("ph")) e.target.classList.add("loaded", "err"); }, true);
  const markLoaded = () => $$("img.ph").forEach((i) => { if (i.complete && i.naturalWidth) i.classList.add("loaded"); });

  /* ---------------- Announce ---------------- */
  function renderAnnounce() {
    const msgs = [t("announce.2"), t("announce.4"), t("announce.3"), t("announce.1", { n: money(CFG.freeShippingOver) })];
    const one = msgs.map((m) => `<span>${m} ${starHTML}</span>`).join("");
    $("#announceTrack").innerHTML = one + one + one;
  }

  /* ---------------- Product card ---------------- */
  function cardHTML(p, i = 0) {
    const c = p.colors[0];
    const wished = state.wish.includes(p.id);
    let badge = "";
    if (p.badge) badge = `<span class="card__badge ${p.badge === "limited" ? "card__badge--limited" : ""}">${t("badge." + p.badge)}</span>`;
    else if (p.compareAt) badge = `<span class="card__badge">${t("badge.sale")}</span>`;
    const quick = SIZES.map((s) => `<button data-quick="${p.id}" data-size="${s}" ${p.soldOut.includes(s) ? "disabled" : ""}>${s}</button>`).join("");
    return `
    <article class="card" data-id="${p.id}" style="animation-delay:${Math.min(i, 8) * 70}ms">
      <div class="card__media" data-cursor="view">
        <a href="#/product/${p.id}" class="card__link" aria-label="${L(p.name)}"></a>
        ${badge}
        <div class="card__img card__img--front">${visual(p, c, 0)}</div>
        <div class="card__img card__img--back">${visual(p, c, 1)}</div>
        <button class="card__wish ${wished ? "on" : ""}" data-wish="${p.id}" aria-label="${t("nav.wishlist")}">${ICON.heart}</button>
        <div class="card__quick"><small>${t("quick")}</small>${quick}</div>
      </div>
      <a href="#/product/${p.id}" class="card__info">
        <div class="card__row"><span class="card__name">${L(p.name)}</span></div>
        <span class="card__tag">${L(p.tagline)}</span>
        <div class="card__row">
          <span class="price">${money(p.price)}${p.compareAt ? `<s>${money(p.compareAt)}</s>` : ""}</span>
          <span class="swatches">${p.colors.map((k) => `<i style="background:${COLORS[k].hex}" title="${colorName(k)}"></i>`).join("")}</span>
        </div>
      </a>
    </article>`;
  }

  /* ---------------- Split text helpers ---------------- */
  function splitChars(text, baseDelay = 0, step = 40) {
    if (state.lang === "ar") {
      return text.split(" ").map((w, i) => `<span class="char" style="transition-delay:${baseDelay + i * step * 3}ms">${w}</span>`).join(" ");
    }
    return Array.from(text).map((ch, i) => ch === " " ? " " : `<span class="char" style="transition-delay:${baseDelay + i * step}ms">${ch}</span>`).join("");
  }
  const line = (html, delay = 0) => `<span class="split-line"><span style="transition-delay:${delay}ms">${html}</span></span>`;

  /* =============================================================
     PAGES
     ============================================================= */

  const HERO_SLIDES = [
    { ph: PH.noir[1], p: "le-monogramme", c: "noir" },
    { ph: PH.ivory[1], p: "signature-everyday", c: "ivory" },
    { ph: PH.mocha[0], p: "couronne-oversized", c: "mocha" },
    { ph: PH.olive[0], p: "heritage", c: "olive" }
  ];

  /* ---------- Home ---------- */
  function pageHome() {
    const featured = PRODUCTS.slice(0, 4);
    const introWords = t("intro.text").split(" ").map((w) => `<span class="w">${w}</span>`).join(" ");
    const lookItems = [
      { p: "le-monogramme", c: "noir", ph: PH.noir[0], cap: "N°01" },
      { p: "etoile", c: "rouge", ph: PH.rouge[0], cap: "N°02" },
      { p: "signature-everyday", c: "ivory", ph: PH.ivory[3], cap: "N°03" },
      { p: "minuit", c: "minuit", ph: PH.minuit[1], cap: "N°04" },
      { p: "heritage", c: "olive", ph: PH.olive[0], cap: "N°05" },
      { p: "atelier-washed", c: "sand", ph: PH.sand[0], cap: "N°06" }
    ];
    const cat = (key, n, ph) => `
      <a href="#/shop/${key}" class="cat" data-reveal style="transition-delay:${n * 120}ms" data-cursor="view">
        <div class="cat__art">${photoHTML(ph, { sizes: "(min-width: 900px) 33vw, 80vw", alt: t("cat." + key) })}</div>
        <span class="go">${ICON.go}</span>
        <span class="cat__n">0${n + 1}</span>
        <h3>${t("cat." + key)}</h3>
        <p>${t("cat." + key + ".d")}</p>
      </a>`;
    const trust = [["truck", 1], ["box", 2], ["swap", 3], ["chat", 4]];

    return `
    <section class="hero" id="hero">
      <div class="hero__bg"></div>
      <canvas class="hero__canvas" id="heroCanvas"></canvas>
      <div class="hero__inner">
        <div class="hero__top">
          <span class="eyebrow">${t("hero.eyebrow")}</span>
        </div>
        <div class="hero__stage">
          <div class="hero__garment hero__photo" id="heroPhoto">
            <div class="hero__frame">
              ${HERO_SLIDES.map((s, i) => `<a href="#/product/${s.p}?c=${s.c}" class="hero__slide ${i === 0 ? "on" : ""}" data-cursor="view" tabindex="${i === 0 ? 0 : -1}">${photoHTML(s.ph, { eager: i === 0, sizes: "(min-width: 900px) 34vw, 70vw", w: 1000, alt: L(getP(s.p).name) })}</a>`).join("")}
              <span class="hero__cap" id="heroCap"><b>${L(getP(HERO_SLIDES[0].p).name)}</b> · ${colorName(HERO_SLIDES[0].c)}</span>
              <span class="hero__bars">${HERO_SLIDES.map((_, i) => `<i class="${i === 0 ? "on" : ""}"></i>`).join("")}</span>
            </div>
          </div>
          <h1 class="hero__title">
            <span class="display l1">${splitChars(t("hero.title1"), 300)}</span>
            <span class="display l2">${splitChars(t("hero.title2"), 600)}</span>
          </h1>
        </div>
        <div class="hero__badge" aria-hidden="true">
          <svg viewBox="0 0 100 100"><defs><path id="circ" d="M50,50 m-40,0 a40,40 0 1,1 80,0 a40,40 0 1,1 -80,0"/></defs>
            <text><textPath href="#circ" textLength="250" lengthAdjust="spacing">MAISON ROYALE ✦ EST. MMXXVI ✦ </textPath></text></svg>
          ${starHTML}
        </div>
        <div class="hero__bottom">
          <p class="hero__sub" data-reveal style="transition-delay:900ms">${t("hero.sub")}</p>
          <div class="hero__scroll"><i></i>${t("hero.scroll")}</div>
          <div class="hero__ctas" data-reveal style="transition-delay:1050ms">
            <a href="#/shop" class="btn" data-magnetic>${t("hero.cta")} ${ICON.arrow}</a>
            <a href="#/maison" class="btn btn--ghost" data-magnetic>${t("hero.cta2")}</a>
          </div>
        </div>
      </div>
    </section>

    <section class="trust">
      ${trust.map(([ic, n], i) => `<div class="trust__item" data-reveal style="transition-delay:${i * 90}ms">${ICON[ic]}<b>${t("trust." + n + ".t")}</b><span>${t("trust." + n + ".d")}</span></div>`).join("")}
    </section>

    ${marqueeHTML()}

    <section class="section intro">
      <div class="container">
        <span class="eyebrow" data-reveal>${t("intro.label")}</span>
        <p class="intro__text" id="introText">${introWords}</p>
        <div class="stats" data-reveal>
          <div class="stat"><b data-count="460">0</b><span>${t("stat.gsm")}</span></div>
          <div class="stat"><b data-count="11000" data-plus>0</b><span>${t("stat.stitch")}</span></div>
          <div class="stat"><b data-count="100">0</b><span>${t("stat.pieces")}</span></div>
        </div>
      </div>
    </section>

    <section class="section--tight">
      <div class="container">
        <div class="sec-head">
          <div>
            <span class="eyebrow" data-reveal>${t("featured.label")}</span>
            <h2 class="display h-lg">${line(t("featured.title"))}</h2>
          </div>
          <a href="#/shop" class="link-u" data-reveal>${t("featured.all")}</a>
        </div>
        <div class="grid">${featured.map(cardHTML).join("")}</div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="sec-head"><div><span class="eyebrow" data-reveal>${t("cat.label")}</span></div></div>
        <div class="cats">
          ${cat("essentials", 0, PH.ivory[0])}
          ${cat("signature", 1, PH.mocha[0])}
          ${cat("limited", 2, PH.noir[1])}
        </div>
      </div>
    </section>

    <section class="look" id="look">
      <div class="look__sticky">
        <div class="look__head">
          <span class="eyebrow" data-reveal>${t("look.label")}</span>
          <h2 class="display h-lg">${line(t("look.title"))}</h2>
        </div>
        <div class="look__track" id="lookTrack">
          ${lookItems.map((it) => {
            const p = getP(it.p);
            return `<a href="#/product/${p.id}?c=${it.c}" class="look__item" data-cursor="view">
              ${photoHTML(it.ph, { sizes: "(min-width: 900px) 30vw, 82vw", alt: L(p.name) })}
              <figcaption><span><b>${L(p.name)}</b>${colorName(it.c)}</span><span>${it.cap}</span></figcaption>
            </a>`;
          }).join("")}
        </div>
        <div class="look__progress"><span id="lookProgress"></span></div>
      </div>
    </section>

    <section class="section craft">
      <div class="container craft__wrap">
        <div>
          <span class="eyebrow" data-reveal>${t("craft.label")}</span>
          <h2 class="display h-lg">${line(t("craft.title"))}</h2>
          <div class="craft__grid">
            ${[1, 2, 3, 4].map((n) => `
              <div class="craft__item" data-reveal style="transition-delay:${n * 90}ms">
                <b>0${n}</b><h4>${t("craft." + n + ".t")}</h4><p>${t("craft." + n + ".d")}</p>
              </div>`).join("")}
          </div>
        </div>
        <div class="craft__visual" data-reveal="scale">
          <span class="ring"></span><span class="ring"></span><span class="ring"></span>
          <div class="orbit">${starHTML}</div>
          <div class="craft__photo">${photoHTML(PH.detail[0], { sizes: "(min-width: 900px) 30vw, 70vw", alt: "" })}</div>
          <img class="mk craft__mark" src="assets/img/mr-mark-dark.png" alt="">
        </div>
      </div>
    </section>
    <section class="quote-sec">
      <div class="container">
        ${starHTML}
        <p class="quote" data-reveal>${quoteHTML()}</p>
      </div>
    </section>

    ${marqueeHTML(true)}

    <section class="section news">
      <div class="container">
        <span class="eyebrow" data-reveal>Le Cercle</span>
        <h2 class="display h-md" style="margin-top:14px">${line(t("news.title"))}</h2>
        <p class="muted" data-reveal>${t("news.sub")}</p>
        <form class="news__form" id="newsForm" data-reveal>
          <input type="email" required placeholder="${t("news.ph")}" aria-label="${t("news.ph")}">
          <button type="submit">${t("news.btn")}</button>
        </form>
        <div class="news__ok" id="newsOk"></div>
      </div>
    </section>
    ${footerHTML()}`;
  }

  function quoteHTML() {
    const q = t("quote");
    const parts = q.split("—");
    if (parts.length === 2) return `${parts[0]}— <span class="hl">${parts[1].trim()}</span>`;
    return `<span class="hl">${q}</span>`;
  }

  function marqueeHTML(rev) {
    const chunk = `
      <span class="word">Maison</span>${starHTML}
      <span class="word o">Royale</span>${starHTML}
      <img class="mk" src="assets/img/mr-mark.png" alt="">${starHTML}
      <span class="word">${state.lang === "ar" ? "البس التاج" : "Wear the Crown"}</span>${starHTML}`;
    return `<div class="marquee ${rev ? "marquee--rev" : ""}" aria-hidden="true">
      <div class="marquee__track">${chunk}${chunk}</div>
      <div class="marquee__track">${chunk}${chunk}</div>
    </div>`;
  }

  function footerHTML() {
    return `
    <footer class="footer">
      <div class="container">
        <div class="footer__grid">
          <div class="footer__brand">
            <img class="mk" src="assets/img/mr-mark.png" alt="Maison Royale">
            <p>${t("footer.tag")}</p>
            <div class="footer__social">${socialsHTML()}</div>
          </div>
          <div>
            <h5>${t("footer.shop")}</h5>
            <ul>
              <li><a href="#/shop">${t("shop.all")}</a></li>
              <li><a href="#/shop/essentials">${t("cat.essentials")}</a></li>
              <li><a href="#/shop/signature">${t("cat.signature")}</a></li>
              <li><a href="#/shop/limited">${t("cat.limited")}</a></li>
            </ul>
          </div>
          <div>
            <h5>${t("footer.help")}</h5>
            <ul>
              <li><a href="#" data-open-size>${t("footer.size")}</a></li>
              <li><a href="https://wa.me/${CFG.whatsapp}" target="_blank" rel="noopener">${t("footer.shipping")}</a></li>
              <li><a href="https://wa.me/${CFG.whatsapp}" target="_blank" rel="noopener">${t("nav.contact")}</a></li>
            </ul>
          </div>
          <div>
            <h5>${t("footer.follow")}</h5>
            <ul>
              ${CFG.instagram ? `<li><a href="${CFG.instagram}" target="_blank" rel="noopener">Instagram</a></li>` : ""}
              ${CFG.tiktok ? `<li><a href="${CFG.tiktok}" target="_blank" rel="noopener">TikTok</a></li>` : ""}
              ${CFG.facebook ? `<li><a href="${CFG.facebook}" target="_blank" rel="noopener">Facebook</a></li>` : ""}
            </ul>
          </div>
        </div>
        <div class="footer__big" data-reveal><img class="mk" src="assets/img/wordmark.png" alt="Maison Royale"></div>
        <div class="footer__bottom">
          <span>© ${new Date().getFullYear()} Maison Royale. ${t("footer.rights")}</span>
          <span class="pay-icons"><span>${state.lang === "ar" ? "كاش" : "COD"}</span><span>InstaPay</span><span>Vodafone Cash</span></span>
          <span>${t("photo.credit")}</span>
        </div>
      </div>
    </footer>`;
  }

  /* ---------- Shop ---------- */
  const shopState = { cat: "all", sort: "featured" };
  function pageShop(cat) {
    shopState.cat = cat || "all";
    const cats = ["all", "essentials", "signature", "limited"];
    const title = shopState.cat === "all" ? t("shop.title") : t("cat." + shopState.cat);
    return `
      <section class="page-hero container">
        <span class="eyebrow" data-reveal>Maison Royale</span>
        <h1 class="display h-lg">${line(title)}</h1>
        <p class="muted" data-reveal id="shopCount"></p>
      </section>
      <div class="toolbar">
        <div class="container toolbar__inner">
          <div class="chips">
            ${cats.map((c) => `<button class="chip ${c === shopState.cat ? "is-active" : ""}" data-cat="${c}">${c === "all" ? t("shop.all") : t("cat." + c)}</button>`).join("")}
          </div>
          <label class="select-wrap" aria-label="${t("shop.sort")}">
            <select id="sortSel">
              ${["featured", "new", "low", "high"].map((s) => `<option value="${s}" ${s === shopState.sort ? "selected" : ""}>${t("sort." + s)}</option>`).join("")}
            </select>
          </label>
        </div>
      </div>
      <section class="container" style="padding-bottom:100px">
        <div class="grid" id="shopGrid"></div>
      </section>
      ${footerHTML()}`;
  }
  function renderShopGrid() {
    let list = PRODUCTS.filter((p) => shopState.cat === "all" || p.category === shopState.cat);
    if (shopState.sort === "low") list = list.slice().sort((a, b) => a.price - b.price);
    if (shopState.sort === "high") list = list.slice().sort((a, b) => b.price - a.price);
    if (shopState.sort === "new") list = list.slice().sort((a, b) => (b.badge === "new") - (a.badge === "new"));
    $("#shopGrid").innerHTML = list.length ? list.map(cardHTML).join("") : `<p class="muted">${t("shop.empty")}</p>`;
    $("#shopCount").textContent = t("shop.count", { n: list.length });
    markLoaded();
  }

  /* ---------- Product ---------- */
  let pdp = null;
  function slidesHTML(p, c) {
    return gallery(p, c).map((_, i) => `<div class="pdp__slide">${visual(p, c, i, { sizes: "(min-width: 900px) 50vw, 100vw", w: 1100, eager: i === 0 })}</div>`).join("");
  }
  function thumbsHTML(p, c) {
    return gallery(p, c).map((_, i) => `<button class="${i === 0 ? "is-active" : ""}" data-thumb="${i}" aria-label="${i + 1}">${visual(p, c, i, { sizes: "80px", w: 200 })}</button>`).join("");
  }
  function dotsHTML(p, c) {
    return gallery(p, c).map((_, i) => `<button class="${i === 0 ? "is-active" : ""}" data-dot="${i}" aria-label="${i + 1}"></button>`).join("");
  }
  function pageProduct(id, query) {
    const p = getP(id);
    if (!p) return pageNotFound();
    const c = query.c && p.colors.includes(query.c) ? query.c : p.colors[0];
    pdp = { p, color: c, size: null, qty: 1 };
    const save = p.compareAt ? Math.round((1 - p.price / p.compareAt) * 100) : 0;
    const related = PRODUCTS.filter((x) => x.id !== p.id).sort((a, b) => (b.category === p.category) - (a.category === p.category)).slice(0, 4);
    const wished = state.wish.includes(p.id);
    return `
      <section class="container" style="padding-top:clamp(0px,2vw,30px)">
        <div class="pdp">
          <div class="pdp__gallery">
            <div class="pdp__slides" id="slides">${slidesHTML(p, c)}</div>
            <div class="pdp__thumbs" id="thumbs">${thumbsHTML(p, c)}</div>
            <div class="pdp__dots" id="dots">${dotsHTML(p, c)}</div>
          </div>
          <div class="pdp__info">
            <nav class="crumbs"><a href="#/">${t("nav.home")}</a><span>/</span><a href="#/shop/${p.category}">${t("cat." + p.category)}</a></nav>
            ${p.badge ? `<span class="eyebrow">${t("badge." + p.badge)}</span>` : ""}
            <h1 class="pdp__title">${L(p.name)}</h1>
            <p class="pdp__tag">${L(p.tagline)}</p>
            <div class="pdp__price">${money(p.price)}${p.compareAt ? `<s>${money(p.compareAt)}</s><span class="save">-${save}%</span>` : ""}</div>
            <p class="bundle-note">${starHTML} ${t("cart.bundle", { n: CFG.bundle.minQty, p: CFG.bundle.percent })}</p>

            <div class="opt">
              <div class="opt__head"><span>${t("p.color")}: <b id="colorName">${colorName(c)}</b></span></div>
              <div class="colors">
                ${p.colors.map((k) => `<button class="color-btn ${k === c ? "is-active" : ""}" data-color="${k}" style="background:${COLORS[k].hex}" aria-label="${colorName(k)}"></button>`).join("")}
              </div>
            </div>

            <div class="opt">
              <div class="opt__head"><span>${t("p.size")}: <b id="sizeName">—</b></span><button data-open-size>${t("p.sizeguide")}</button></div>
              <div class="sizes" id="sizes">
                ${SIZES.map((s) => `<button class="size-btn" data-size="${s}" ${p.soldOut.includes(s) ? "disabled" : ""}>${s}</button>`).join("")}
              </div>
              <div class="size-hint" id="sizeHint"></div>
            </div>

            <div class="buy-row">
              <div class="qty"><button data-qty="-1" aria-label="-">−</button><span id="qtyVal">1</span><button data-qty="1" aria-label="+">+</button></div>
              <button class="btn" id="addBtn">${t("p.add")}</button>
              <button class="wish-toggle ${wished ? "on" : ""}" data-wish="${p.id}" aria-label="${t("nav.wishlist")}">${ICON.heart}</button>
            </div>
            <button class="btn btn--wa btn--block" id="waBtn">${ICON.wa} ${t("p.wa")}</button>
            ${p.stock ? `<div class="stock-note"><span class="pulse"></span>${t("p.left", { n: p.stock })}</div>` : ""}

            <div class="perks">
              <div>${ICON.box}${t("p.perk1")}</div>
              <div>${ICON.cash}${t("p.perk2")}</div>
              <div>${ICON.swap}${t("p.perk3")}</div>
            </div>

            <div class="acc">
              <div class="acc__item is-open"><button class="acc__btn">${t("p.details")}<i></i></button><div class="acc__panel"><div><p>${L(p.desc)}</p></div></div></div>
              <div class="acc__item"><button class="acc__btn">${t("p.fit")}<i></i></button><div class="acc__panel"><div><p>${t("p.fit.d")}</p></div></div></div>
              <div class="acc__item"><button class="acc__btn">${t("p.ship")}<i></i></button><div class="acc__panel"><div><p>${t("p.ship.d")}</p></div></div></div>
            </div>
          </div>
        </div>

        <div class="related">
          <div class="sec-head"><h2 class="display h-md">${line(t("p.related"))}</h2></div>
          <div class="grid">${related.map(cardHTML).join("")}</div>
        </div>
      </section>
      <div class="sticky-buy" id="stickyBuy">
        <div class="sticky-buy__info"><b>${L(p.name)}</b><span id="stickyMeta">${money(p.price)} · ${colorName(c)}</span></div>
        <button class="btn" id="stickyAdd">${t("p.add")}</button>
      </div>
      <div style="height:80px"></div>
      ${footerHTML()}`;
  }

  /* ---------- Totals / shipping ---------- */
  let coGov = -1;
  function shipFee(gi) {
    if (gi == null || gi < 0) return null;
    if ([0, 1, 3].includes(gi)) return CFG.shipping.cairoGiza;
    if (gi <= 13) return CFG.shipping.deltaCanal;
    return CFG.shipping.upperEgypt;
  }
  function totals(gi) {
    const sub = state.cart.reduce((s, it) => { const p = getP(it.id); return s + (p ? p.price * it.qty : 0); }, 0);
    const qty = state.cart.reduce((s, it) => s + it.qty, 0);
    const promoPct = state.promo && CFG.promoCodes[state.promo] ? CFG.promoCodes[state.promo] : 0;
    const bundlePct = CFG.bundle && qty >= CFG.bundle.minQty ? CFG.bundle.percent : 0;
    const pct = Math.max(promoPct, bundlePct);
    const label = pct === 0 ? "" : promoPct >= bundlePct ? state.promo : t("co.bundle");
    const discount = Math.round(sub * pct / 100);
    const free = sub >= CFG.freeShippingOver;
    const fee = sub === 0 ? 0 : free ? 0 : shipFee(gi);
    return { sub, qty, discount, pct, label, promoPct, bundlePct, shipping: fee, total: sub - discount + (fee || 0) };
  }

  function lineItemHTML(it, idx, compact) {
    const p = getP(it.id);
    if (!p) return "";
    return `<div class="line-item" data-idx="${idx}">
      <a href="#/product/${p.id}?c=${it.color}" class="line-item__img">${visual(p, it.color, 0, { sizes: "90px", w: 240 })}</a>
      <div>
        <div class="line-item__top"><span class="line-item__name">${L(p.name)}</span><span class="price">${money(p.price * it.qty)}</span></div>
        <div class="line-item__meta">${colorName(it.color)} · ${it.size}${compact ? ` · ×${it.qty}` : ""}</div>
        ${compact ? "" : `<div class="line-item__bottom">
          <div class="qty"><button data-line-qty="-1" data-idx="${idx}" aria-label="-">−</button><span>${it.qty}</span><button data-line-qty="1" data-idx="${idx}" aria-label="+">+</button></div>
          <button class="line-item__rm" data-rm="${idx}">${t("cart.remove")}</button>
        </div>`}
      </div>
    </div>`;
  }

  function summaryHTML() {
    const tt = totals(coGov);
    return `
      ${state.cart.map((it, i) => lineItemHTML(it, i, true)).join("")}
      <div class="promo"><input id="promoIn" placeholder="${t("co.promo")}" value="${state.promo || ""}" aria-label="${t("co.promo")}"><button type="button" id="promoBtn">${t("co.apply")}</button></div>
      <div class="promo-msg ${tt.promoPct ? "ok" : ""}" id="promoMsg">${tt.promoPct ? t("co.promo.ok", { n: tt.promoPct }) : ""}</div>
      <div class="rowline"><span>${t("cart.subtotal")}</span><span>${money(tt.sub)}</span></div>
      ${tt.discount ? `<div class="rowline disc"><span>${t("co.discount")} (${tt.label})</span><span>−${money(tt.discount)}</span></div>` : ""}
      <div class="rowline"><span>${t("cart.shipping")}</span><span>${tt.shipping === null ? `<small>${t("co.shipnote")}</small>` : tt.shipping ? money(tt.shipping) : t("cart.free")}</span></div>
      <div class="rowline total"><span>${t("cart.total")}</span><span>${money(tt.total)}</span></div>`;
  }

  /* ---------- Checkout ---------- */
  function pageCheckout() {
    if (!state.cart.length) {
      return `<section class="container"><div class="empty" style="min-height:60svh;align-content:center">
        <img class="mk" src="assets/img/mr-mark.png" alt=""><p>${t("cart.empty")}</p>
        <a href="#/shop" class="btn">${t("cart.empty.cta")} ${ICON.arrow}</a></div></section>`;
    }
    coGov = -1;
    const tt = totals(coGov);
    return `
      <section class="page-hero container"><span class="eyebrow">Maison Royale</span><h1 class="display h-md">${line(t("co.title"))}</h1></section>
      <section class="container co">
        <div>
          <button class="co__summary-toggle" id="sumToggle"><span>${t("co.summary")} ▾</span><b id="sumTotal">${money(tt.total)}</b></button>
          <div class="co__summary-wrap" id="sumWrap"><div><div class="co__summary" id="coSummary">${summaryHTML()}</div></div></div>
        </div>
        <form class="co__form" id="coForm" novalidate>
          <fieldset>
            <h4><em>1</em>${t("co.contact")}</h4>
            <div class="field"><input id="f_name" name="name" placeholder=" " autocomplete="name" required><label for="f_name">${t("co.name")} *</label></div>
            <div class="field-row">
              <div class="field"><input id="f_phone" name="phone" type="tel" inputmode="tel" dir="ltr" placeholder=" " autocomplete="tel" required><label for="f_phone">${t("co.phone")} *</label></div>
              <div class="field"><input id="f_email" name="email" type="email" dir="ltr" placeholder=" " autocomplete="email"><label for="f_email">${t("co.email")}</label></div>
            </div>
          </fieldset>
          <fieldset>
            <h4><em>2</em>${t("co.delivery")}</h4>
            <div class="field"><select id="f_city" name="city" required><option value="" disabled selected></option>${govs().map((g, i) => `<option value="${i}">${g}</option>`).join("")}</select><label for="f_city">${t("co.city")} *</label></div>
            <div class="field"><input id="f_addr" name="address" placeholder=" " autocomplete="street-address" required><label for="f_addr">${t("co.address")} *</label></div>
            <div class="field"><textarea id="f_notes" name="notes" placeholder=" "></textarea><label for="f_notes">${t("co.notes")}</label></div>
          </fieldset>
          <fieldset>
            <h4><em>3</em>${t("co.payment")}</h4>
            <label class="pay-opt"><input type="radio" name="pay" value="cod" checked><div><b>${t("co.cod")}</b><span>${t("co.cod.d")}</span></div></label>
            <label class="pay-opt"><input type="radio" name="pay" value="instapay"><div><b>${t("co.insta")}</b><span>${t("co.insta.d")}</span></div></label>
          </fieldset>
          <button class="btn btn--block" type="submit" data-magnetic>${t("co.place")} · <span id="placeTotal">${money(tt.total)}</span></button>
          <div class="form-err" id="formErr"></div>
          <p class="co__note">${ICON.wa}${t("co.note")}</p>
        </form>
      </section>`;
  }

  /* ---------- Success ---------- */
  function pageSuccess(orderId) {
    const orders = store.get("mr_orders", []);
    const o = orders.find((x) => x.id === orderId);
    return `
      <section class="container success">
        <div>
          <div class="success__seal"><svg viewBox="0 0 130 130"><circle cx="65" cy="65" r="60"/><path d="M42 66l15 15 31-32"/></svg></div>
          <span class="eyebrow">Maison Royale</span>
          <h1 class="display h-lg" style="margin-top:12px">${line(t("ok.title"))}</h1>
          <p>${t("ok.sub", { id: "<b>" + (orderId || "") + "</b>" })}</p>
          <div class="success__ctas">
            ${o ? `<a class="btn btn--wa" href="${o.wa}" target="_blank" rel="noopener">${ICON.wa} ${t("ok.again")}</a>` : ""}
            <a class="btn btn--ghost" href="#/shop">${t("ok.cont")}</a>
          </div>
        </div>
      </section>`;
  }

  /* ---------- Wishlist ---------- */
  function pageWishlist() {
    const list = PRODUCTS.filter((p) => state.wish.includes(p.id));
    return `
      <section class="page-hero container"><span class="eyebrow">Maison Royale</span><h1 class="display h-lg">${line(t("wish.title"))}</h1></section>
      <section class="container" style="padding-bottom:100px">
        ${list.length ? `<div class="grid">${list.map(cardHTML).join("")}</div>` :
          `<div class="empty"><img class="mk" src="assets/img/mr-mark.png" alt=""><p>${t("wish.empty")}</p><a href="#/shop" class="btn">${t("cart.empty.cta")} ${ICON.arrow}</a></div>`}
      </section>
      ${footerHTML()}`;
  }

  /* ---------- About ---------- */
  function pageAbout() {
    return `
      <section class="container about__hero">
        <img src="assets/img/logo-full.png" alt="Maison Royale" class="img-reveal mk">
        <span class="eyebrow" data-reveal>${t("about.label")}</span>
        <h1 class="display h-lg" style="margin-top:16px">${line(t("about.title"))}</h1>
      </section>
      <section class="container">
        <div class="about__photo img-reveal">${photoHTML(PH.rack, { sizes: "100vw", w: 1600, alt: "" })}</div>
      </section>
      <section class="container" style="padding:clamp(60px,8vw,120px) var(--gutter)">
        <div class="about__body">
          <p data-reveal>${t("about.p1")}</p>
          <p data-reveal>${t("about.p2")}</p>
          <p data-reveal>${t("about.p3")}</p>
        </div>
        <div class="about__sig" data-reveal><span></span>${starHTML}<span></span></div>
      </section>
      ${marqueeHTML()}
      <section class="section--tight"><div class="container">
        <div class="sec-head"><h2 class="display h-md">${line(t("featured.title"))}</h2><a href="#/shop" class="link-u">${t("featured.all")}</a></div>
        <div class="grid">${PRODUCTS.slice(4, 8).map(cardHTML).join("")}</div>
      </div></section>
      ${footerHTML()}`;
  }

  function pageNotFound() {
    return `<section class="container"><div class="empty" style="min-height:60svh;align-content:center">
      <img class="mk" src="assets/img/mr-mark.png" alt=""><p>404</p><a href="#/" class="btn">${t("nav.home")}</a></div></section>`;
  }

  /* =============================================================
     ROUTER
     ============================================================= */
  const view = $("#view");
  let firstRender = true;
  let currentRoute = null;
  let cleanups = [];

  function parseHash() {
    const raw = location.hash.replace(/^#/, "") || "/";
    const [path, qs] = raw.split("?");
    const parts = path.split("/").filter(Boolean);
    const query = {};
    if (qs) qs.split("&").forEach((kv) => { const [k, v] = kv.split("="); query[k] = decodeURIComponent(v || ""); });
    return { parts, query, path };
  }

  function render() {
    cleanups.forEach((fn) => fn());
    cleanups = [];
    const { parts, query } = parseHash();
    const r = parts[0] || "home";
    currentRoute = r;
    let html;
    switch (r) {
      case "home": html = pageHome(); break;
      case "shop": html = pageShop(parts[1]); break;
      case "product": html = pageProduct(parts[1], query); break;
      case "checkout": html = pageCheckout(); break;
      case "success": html = pageSuccess(parts[1]); break;
      case "wishlist": html = pageWishlist(); break;
      case "maison": html = pageAbout(); break;
      default: html = pageNotFound();
    }
    view.innerHTML = html;
    document.body.dataset.route = r;
    window.scrollTo(0, 0);

    if (r === "home") initHome();
    if (r === "shop") initShop();
    if (r === "product") initProduct();
    if (r === "checkout") initCheckout();
    if (r === "success") initSuccess();
    initCommon();
    updateNavActive(r);
    updateTitle(r, parts);
  }

  function updateTitle(r, parts) {
    const base = "Maison Royale";
    let tt = base + " — " + (state.lang === "ar" ? "هوديز فاخرة" : "Luxury Hoodies");
    if (r === "product") { const p = getP(parts[1]); if (p) tt = L(p.name) + " — " + base; }
    else if (r !== "home") { const h = $(".page-hero .display") || $(".display"); if (h) tt = h.textContent.trim() + " — " + base; }
    document.title = tt.trim();
  }

  function navigate() {
    if (firstRender) { firstRender = false; render(); return; }
    closeAll();
    const curtain = $("#curtain");
    if (reduced) { render(); return; }
    curtain.classList.remove("is-out");
    curtain.classList.add("is-in");
    setTimeout(() => {
      render();
      requestAnimationFrame(() => {
        curtain.classList.remove("is-in");
        curtain.classList.add("is-out");
        setTimeout(() => curtain.classList.remove("is-out"), 700);
      });
    }, 560);
  }

  function updateNavActive(r) {
    const map = { home: "home", shop: "shop", product: "shop", wishlist: "wishlist" };
    $$(".tabbar [data-tab]").forEach((el) => el.classList.toggle("is-active", el.dataset.tab === map[r]));
    moveTabGlow();
    $$(".header__nav a").forEach((a) => {
      const h = a.getAttribute("href");
      a.classList.toggle("is-active", location.hash === h || (r === "shop" && h === "#/shop" && !parseHash().parts[1]));
    });
    $("#header").classList.toggle("is-solid", r !== "home" || window.scrollY > 10);
  }

  function moveTabGlow() {
    const active = $(".tabbar .is-active");
    const glow = $("#tabGlow");
    if (!glow) return;
    if (!active) { glow.style.opacity = "0"; return; }
    glow.style.opacity = "1";
    glow.style.width = active.offsetWidth - 14 + "px";
    glow.style.left = "0";
    glow.style.transform = `translateX(${active.offsetLeft + 7}px)`;
  }

  /* =============================================================
     PAGE INITS
     ============================================================= */
  function initCommon() {
    markLoaded();
    initReveals();
    initCounters();
    initMagnetic();
  }

  let io;
  function initReveals() {
    if (io) io.disconnect();
    const targets = $$("[data-reveal], .split-line, .img-reveal, .hero__title");
    if (reduced || !("IntersectionObserver" in window)) { targets.forEach((el) => el.classList.add("is-in")); return; }
    io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    targets.forEach((el) => { if (!el.closest(".hero")) io.observe(el); });
  }

  function revealHero() {
    const hero = $("#hero");
    if (!hero) return;
    hero.classList.add("is-in");
    $$("[data-reveal], .hero__title", hero).forEach((el) => el.classList.add("is-in"));
  }

  function initCounters() {
    const els = $$("[data-count]");
    if (!els.length) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        obs.unobserve(e.target);
        const el = e.target, end = +el.dataset.count, plus = el.hasAttribute("data-plus");
        const dur = reduced ? 1 : 2000, t0 = performance.now();
        const step = (now) => {
          const k = Math.min(1, (now - t0) / dur);
          const v = Math.round(end * (1 - Math.pow(1 - k, 4)));
          el.textContent = (v >= 1000 ? v.toLocaleString("en-US") : v) + (plus && k === 1 ? "+" : "");
          if (k < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      });
    }, { threshold: 0.4 });
    els.forEach((el) => obs.observe(el));
    cleanups.push(() => obs.disconnect());
  }

  function initMagnetic() {
    if (!finePointer || reduced) return;
    $$("[data-magnetic]").forEach((el) => {
      const move = (e) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2, y = e.clientY - r.top - r.height / 2;
        el.style.transform = `translate(${x * 0.22}px, ${y * 0.32}px)`;
      };
      const leave = () => { el.style.transition = "transform .7s cubic-bezier(.22,1,.36,1)"; el.style.transform = ""; setTimeout(() => (el.style.transition = ""), 700); };
      el.addEventListener("mousemove", move);
      el.addEventListener("mouseleave", leave);
    });
  }

  /* ---------- Home ---------- */
  function initHome() {
    const hero = $("#hero");
    const photo = $("#heroPhoto");
    let tx = 0, ty = 0, cx = 0, cy = 0, raf;
    const onMove = (e) => {
      const r = hero.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
    };
    const onOrient = (e) => {
      if (e.gamma == null) return;
      tx = Math.max(-1, Math.min(1, e.gamma / 30));
      ty = Math.max(-1, Math.min(1, (e.beta - 45) / 30));
    };
    const title = $(".hero__title", hero);
    const loop = () => {
      cx += (tx - cx) * 0.06; cy += (ty - cy) * 0.06;
      const sy = window.scrollY;
      const vh = window.innerHeight;
      if (sy < vh * 1.2) {
        photo.style.transform = hero.classList.contains("is-in")
          ? `perspective(1000px) translate3d(${cx * 10}px, ${sy * -0.1}px, 0) rotateY(${cx * 7}deg) rotateX(${-cy * 5}deg) scale(${1 - Math.min(sy / vh, 1) * 0.08})`
          : "";
        title.style.transform = `translate3d(${cx * -16}px, ${sy * 0.25}px, 0)`;
        title.style.opacity = String(1 - Math.min(sy / (vh * 0.8), 1));
      }
      raf = requestAnimationFrame(loop);
    };
    if (!reduced) {
      hero.addEventListener("mousemove", onMove);
      window.addEventListener("deviceorientation", onOrient);
      photo.style.transition = "opacity 1.4s cubic-bezier(.22,1,.36,1)";
      raf = requestAnimationFrame(loop);
    }

    // slideshow
    const slides = $$(".hero__slide", hero), bars = $$(".hero__bars i", hero), cap = $("#heroCap");
    let si = 0;
    const show = (n) => {
      si = (n + slides.length) % slides.length;
      slides.forEach((s, i) => { s.classList.toggle("on", i === si); s.tabIndex = i === si ? 0 : -1; });
      bars.forEach((b, i) => { b.classList.remove("on"); if (i === si) { void b.offsetWidth; b.classList.add("on"); } });
      const s = HERO_SLIDES[si];
      cap.innerHTML = `<b>${L(getP(s.p).name)}</b> · ${colorName(s.c)}`;
    };
    const timer = setInterval(() => show(si + 1), 4800);

    const particles = startParticles($("#heroCanvas"), hero);

    const intro = $("#introText");
    const words = $$(".w", intro);
    const look = $("#look"), track = $("#lookTrack"), prog = $("#lookProgress");
    const onScroll = () => {
      const r = intro.getBoundingClientRect();
      const vh = window.innerHeight;
      const k = Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (r.height + vh * 0.35)));
      const n = Math.round(k * words.length);
      words.forEach((w, i) => w.classList.toggle("on", i < n));
      if (isDesktop()) {
        const lr = look.getBoundingClientRect();
        const total = look.offsetHeight - vh;
        const p = Math.min(1, Math.max(0, -lr.top / total));
        const dist = Math.max(0, track.scrollWidth - window.innerWidth);
        const dir = document.documentElement.dir === "rtl" ? 1 : -1;
        track.style.transform = `translate3d(${dir * dist * p}px,0,0)`;
        prog.style.transform = `scaleX(${p})`;
      } else {
        track.style.transform = "";
      }
    };
    const onTrack = () => {
      if (isDesktop()) return;
      const max = track.scrollWidth - track.clientWidth;
      prog.style.transform = `scaleX(${max ? Math.abs(track.scrollLeft) / max : 0})`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    track.addEventListener("scroll", onTrack, { passive: true });
    onScroll();
    if (reduced) words.forEach((w) => w.classList.add("on"));

    $("#newsForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const inp = $("input", e.target);
      const list = store.get("mr_news", []); list.push(inp.value); store.set("mr_news", list);
      inp.value = "";
      $("#newsOk").textContent = t("news.ok");
    });

    if (!document.body.classList.contains("is-loading")) setTimeout(revealHero, 80);

    cleanups.push(() => {
      cancelAnimationFrame(raf);
      clearInterval(timer);
      particles && particles.stop();
      hero.removeEventListener("mousemove", onMove);
      window.removeEventListener("deviceorientation", onOrient);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    });
  }

  /* ---------- Particles: drifting dust & stars (theme aware) ---------- */
  function startParticles(canvas, host) {
    if (!canvas || reduced) return null;
    const ctx = canvas.getContext("2d");
    let w, h, dpr, parts = [], raf, running = true, visible = true, frame = 0, ink = "236,231,222", gold = "205,185,145";
    const N = isDesktop() ? 80 : 40;
    const readColors = () => {
      const cs = getComputedStyle(document.documentElement);
      ink = cs.getPropertyValue("--ink-rgb").trim().split(/\s+/).join(",") || ink;
      gold = getTheme() === "light" ? "148,116,60" : "205,185,145";
    };
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const spawn = (init) => ({
      x: Math.random() * w, y: init ? Math.random() * h : h + 10,
      r: Math.random() * 1.4 + 0.3,
      vy: -(Math.random() * 0.35 + 0.08), vx: (Math.random() - 0.5) * 0.15,
      a: Math.random() * 0.6 + 0.2, tw: Math.random() * Math.PI * 2,
      star: Math.random() < 0.08, gold: Math.random() < 0.5
    });
    resize(); readColors();
    for (let i = 0; i < N; i++) parts.push(spawn(true));
    const drawStar = (x, y, r) => {
      ctx.beginPath();
      ctx.moveTo(x, y - r * 4); ctx.quadraticCurveTo(x, y, x + r * 4, y);
      ctx.quadraticCurveTo(x, y, x, y + r * 4); ctx.quadraticCurveTo(x, y, x - r * 4, y);
      ctx.quadraticCurveTo(x, y, x, y - r * 4); ctx.fill();
    };
    const tick = () => {
      if (!running) return;
      if (visible) {
        if (++frame % 30 === 0) readColors();
        ctx.clearRect(0, 0, w, h);
        for (const p of parts) {
          p.x += p.vx; p.y += p.vy; p.tw += 0.03;
          if (p.y < -10) Object.assign(p, spawn(false));
          const alpha = p.a * (0.55 + 0.45 * Math.sin(p.tw));
          ctx.fillStyle = `rgba(${p.gold ? gold : ink},${alpha})`;
          if (p.star) drawStar(p.x, p.y, p.r);
          else { ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill(); }
        }
      }
      raf = requestAnimationFrame(tick);
    };
    const obs = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
    obs.observe(host);
    window.addEventListener("resize", resize);
    raf = requestAnimationFrame(tick);
    return { stop() { running = false; cancelAnimationFrame(raf); obs.disconnect(); window.removeEventListener("resize", resize); } };
  }

  /* ---------- Shop ---------- */
  function initShop() {
    renderShopGrid();
    $$(".chip").forEach((ch) => ch.addEventListener("click", () => {
      const c = ch.dataset.cat;
      history.replaceState(null, "", c === "all" ? "#/shop" : "#/shop/" + c);
      shopState.cat = c;
      $$(".chip").forEach((x) => x.classList.toggle("is-active", x === ch));
      const h1 = $(".page-hero .split-line > span");
      if (h1) h1.textContent = c === "all" ? t("shop.title") : t("cat." + c);
      renderShopGrid();
      updateNavActive("shop");
    }));
    $("#sortSel").addEventListener("change", (e) => { shopState.sort = e.target.value; renderShopGrid(); });
  }

  /* ---------- Product ---------- */
  function initProduct() {
    if (!pdp) return;
    const { p } = pdp;
    const slides = $("#slides");

    const setActive = (i) => {
      $$("#dots button").forEach((b, j) => b.classList.toggle("is-active", i === j));
      $$("#thumbs button").forEach((b, j) => b.classList.toggle("is-active", i === j));
    };
    const goTo = (i) => {
      const s = slides.children[i];
      if (!s) return;
      slides.scrollTo({ left: s.offsetLeft - slides.offsetLeft, behavior: reduced ? "auto" : "smooth" });
      setActive(i);
    };
    slides.addEventListener("scroll", () => {
      setActive(Math.round(Math.abs(slides.scrollLeft) / slides.clientWidth));
    }, { passive: true });
    const bindNav = () => {
      $$("[data-dot]").forEach((b) => b.addEventListener("click", () => goTo(+b.dataset.dot)));
      $$("[data-thumb]").forEach((b) => b.addEventListener("click", () => goTo(+b.dataset.thumb)));
    };
    const bindZoom = () => {
      if (!finePointer) return;
      $$(".pdp__slide", slides).forEach((s) => {
        const img = s.querySelector("img");
        if (!img) return;
        s.addEventListener("mousemove", (e) => {
          const r = s.getBoundingClientRect();
          img.style.transformOrigin = `${(e.clientX - r.left) / r.width * 100}% ${(e.clientY - r.top) / r.height * 100}%`;
          img.style.transform = "scale(1.7)";
        });
        s.addEventListener("mouseleave", () => { img.style.transform = ""; });
      });
    };
    bindNav(); bindZoom();

    // colours → swap photo set
    $$("[data-color]").forEach((b) => b.addEventListener("click", () => {
      const k = b.dataset.color;
      if (k === pdp.color) return;
      pdp.color = k;
      $$("[data-color]").forEach((x) => x.classList.toggle("is-active", x === b));
      $("#colorName").textContent = colorName(k);
      $("#stickyMeta").textContent = `${money(p.price)} · ${colorName(k)}`;
      slides.innerHTML = slidesHTML(p, k);
      $("#thumbs").innerHTML = thumbsHTML(p, k);
      $("#dots").innerHTML = dotsHTML(p, k);
      slides.scrollLeft = 0;
      markLoaded();
      if (!reduced) slides.animate([{ opacity: 0, transform: "scale(.98)" }, { opacity: 1, transform: "none" }], { duration: 600, easing: "cubic-bezier(.22,1,.36,1)" });
      bindNav(); bindZoom();
      history.replaceState(null, "", `#/product/${p.id}?c=${k}`);
    }));

    $$("#sizes .size-btn").forEach((b) => b.addEventListener("click", () => {
      pdp.size = b.dataset.size;
      $$("#sizes .size-btn").forEach((x) => x.classList.toggle("is-active", x === b));
      $("#sizeName").textContent = pdp.size;
      $("#sizeHint").textContent = "";
    }));

    $$("[data-qty]").forEach((b) => b.addEventListener("click", () => {
      pdp.qty = Math.max(1, Math.min(10, pdp.qty + +b.dataset.qty));
      $("#qtyVal").textContent = pdp.qty;
    }));

    $$(".acc__btn").forEach((b) => b.addEventListener("click", () => b.parentElement.classList.toggle("is-open")));

    const needSize = (scroll) => {
      const sz = $("#sizes");
      sz.classList.remove("shake"); void sz.offsetWidth; sz.classList.add("shake");
      $("#sizeHint").textContent = t("p.pick");
      if (scroll) sz.scrollIntoView({ behavior: "smooth", block: "center" });
    };
    const add = (btn) => {
      if (!pdp.size) { needSize(btn.id === "stickyAdd"); return; }
      addToCart(p.id, pdp.color, pdp.size, pdp.qty, $(".pdp__slide", slides));
      const main = $("#addBtn");
      main.classList.add("is-done"); main.textContent = t("p.added");
      setTimeout(() => { main.classList.remove("is-done"); main.textContent = t("p.add"); }, 1800);
    };
    $("#addBtn").addEventListener("click", (e) => add(e.currentTarget));
    $("#stickyAdd").addEventListener("click", (e) => add(e.currentTarget));

    // Order this piece directly on WhatsApp
    $("#waBtn").addEventListener("click", () => {
      if (!pdp.size) { needSize(false); return; }
      const ar = state.lang === "ar";
      const msg = [
        ar ? "أهلاً Maison Royale 👋 عايز أطلب:" : "Hello Maison Royale 👋 I'd like to order:",
        `• ${pdp.qty}× ${L(p.name)} — ${colorName(pdp.color)} / ${pdp.size} — ${money(p.price * pdp.qty)}`,
        location.href.split("#")[0] + `#/product/${p.id}?c=${pdp.color}`
      ].join("\n");
      window.open(`https://wa.me/${CFG.whatsapp}?text=${encodeURIComponent(msg)}`, "_blank", "noopener");
    });

    const sticky = $("#stickyBuy");
    const obs = new IntersectionObserver(([e]) => {
      sticky.classList.toggle("is-on", !e.isIntersecting && e.boundingClientRect.top < 0);
    });
    obs.observe($("#addBtn"));
    cleanups.push(() => obs.disconnect());
  }

  /* ---------- Checkout ---------- */
  function initCheckout() {
    const form = $("#coForm");
    if (!form) return;
    $("#sumToggle").addEventListener("click", () => $("#sumWrap").classList.toggle("is-open"));

    const bindPromo = () => {
      $("#promoBtn").addEventListener("click", () => {
        const code = $("#promoIn").value.trim().toUpperCase();
        if (CFG.promoCodes[code]) {
          state.promo = code; store.set("mr_promo", code);
          refresh();
        } else {
          const m = $("#promoMsg"); m.className = "promo-msg bad"; m.textContent = t("co.promo.bad");
        }
      });
    };
    const refresh = () => {
      $("#coSummary").innerHTML = summaryHTML();
      const tt = totals(coGov);
      $("#sumTotal").textContent = money(tt.total);
      $("#placeTotal").textContent = money(tt.total);
      markLoaded();
      bindPromo();
    };
    bindPromo();
    form.elements.city.addEventListener("change", (e) => { coGov = +e.target.value; refresh(); });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const f = (n) => form.elements[n];
      let ok = true;
      ["name", "phone", "city", "address"].forEach((n) => {
        const el = f(n), wrapF = el.closest(".field");
        const bad = !String(el.value).trim();
        wrapF.classList.toggle("err", bad);
        if (bad) ok = false;
      });
      if (!ok) { $("#formErr").textContent = t("co.err"); return; }
      const digits = f("phone").value.replace(/[^\d]/g, "").replace(/^(0020|20)/, "0");
      if (!/^01[0125]\d{8}$/.test(digits) && digits.length < 10) {
        f("phone").closest(".field").classList.add("err");
        $("#formErr").textContent = t("co.err.phone");
        return;
      }
      $("#formErr").textContent = "";

      const tt = totals(coGov);
      const id = "MR-" + Date.now().toString().slice(-6);
      const pay = form.elements.pay.value === "cod" ? t("co.cod") : t("co.insta");
      const ar = state.lang === "ar";
      const lines = state.cart.map((it) => {
        const p = getP(it.id);
        return `• ${it.qty}× ${L(p.name)} — ${colorName(it.color)} / ${it.size} — ${money(p.price * it.qty)}`;
      });
      const msg = [
        `✦ MAISON ROYALE — ${ar ? "طلب جديد" : "New Order"} ${id}`,
        "",
        `${ar ? "الاسم" : "Name"}: ${f("name").value.trim()}`,
        `${ar ? "الموبايل" : "Phone"}: ${f("phone").value.trim()}`,
        f("email").value.trim() ? `Email: ${f("email").value.trim()}` : null,
        `${ar ? "المحافظة" : "Governorate"}: ${govs()[coGov]}`,
        `${ar ? "العنوان" : "Address"}: ${f("address").value.trim()}`,
        `${ar ? "الدفع" : "Payment"}: ${pay}`,
        "",
        ...lines,
        "",
        `${t("cart.subtotal")}: ${money(tt.sub)}`,
        tt.discount ? `${t("co.discount")} (${tt.label}): −${money(tt.discount)}` : null,
        `${t("cart.shipping")}: ${tt.shipping ? money(tt.shipping) : t("cart.free")}`,
        `${t("cart.total")}: ${money(tt.total)}`,
        f("notes").value.trim() ? `\n${ar ? "ملاحظات" : "Notes"}: ${f("notes").value.trim()}` : null
      ].filter((x) => x !== null).join("\n");
      const wa = `https://wa.me/${CFG.whatsapp}?text=${encodeURIComponent(msg)}`;

      const orders = store.get("mr_orders", []);
      orders.push({ id, date: new Date().toISOString(), items: state.cart, totals: tt, wa });
      store.set("mr_orders", orders);
      state.cart = []; state.promo = null;
      store.set("mr_promo", null);
      saveCart();

      window.open(wa, "_blank", "noopener");
      location.hash = "#/success/" + id;
    });
  }

  function initSuccess() {
    if (reduced) return;
    setTimeout(() => starBurst(window.innerWidth / 2, window.innerHeight * 0.3, 28), 1300);
  }

  function starBurst(x, y, n) {
    const wrap = document.createElement("div");
    wrap.className = "burst"; wrap.style.left = x + "px"; wrap.style.top = y + "px";
    document.body.appendChild(wrap);
    for (let i = 0; i < n; i++) {
      const s = document.createElement("i");
      s.className = "star";
      const a = (Math.PI * 2 * i) / n + Math.random() * 0.4;
      const d = 90 + Math.random() * 160;
      const sc = 0.4 + Math.random() * 1.1;
      s.style.color = Math.random() < 0.5 ? "var(--gold)" : "var(--ink)";
      wrap.appendChild(s);
      s.animate([
        { transform: "translate(-50%,-50%) scale(0) rotate(0)", opacity: 1 },
        { transform: `translate(${Math.cos(a) * d}px, ${Math.sin(a) * d}px) scale(${sc}) rotate(${180 + Math.random() * 180}deg)`, opacity: 1, offset: 0.7 },
        { transform: `translate(${Math.cos(a) * d * 1.15}px, ${Math.sin(a) * d * 1.15 + 40}px) scale(0) rotate(360deg)`, opacity: 0 }
      ], { duration: 1600 + Math.random() * 600, easing: "cubic-bezier(.22,1,.36,1)", fill: "forwards" });
    }
    setTimeout(() => wrap.remove(), 2600);
  }

  /* =============================================================
     CART
     ============================================================= */
  function saveCart() { store.set("mr_cart", state.cart); updateCounts(); renderDrawer(); }

  function addToCart(id, color, size, qty = 1, srcEl) {
    const ex = state.cart.find((x) => x.id === id && x.color === color && x.size === size);
    if (ex) ex.qty = Math.min(10, ex.qty + qty);
    else state.cart.push({ id, color, size, qty });
    flyToBag(id, color, srcEl, () => {
      saveCart();
      const bag = isDesktop() ? $("#bagBtn") : $("#tabBag");
      bag.classList.remove("bump"); void bag.offsetWidth; bag.classList.add("bump");
      toast(t("toast.added"), () => openDrawer());
    });
  }

  function flyToBag(id, color, srcEl, done) {
    const target = isDesktop() ? $("#bagBtn") : $("#tabBag");
    if (!srcEl || reduced || !target || !target.getBoundingClientRect().width) { done(); return; }
    const p = getP(id);
    const s = srcEl.getBoundingClientRect(), e = target.getBoundingClientRect();
    const fly = document.createElement("div");
    fly.className = "fly";
    fly.innerHTML = visual(p, color, 0, { sizes: "80px", w: 240 });
    const sx = s.left + s.width / 2 - 35, sy = s.top + s.height / 2 - 40;
    const ex = e.left + e.width / 2 - 35, ey = e.top + e.height / 2 - 40;
    fly.style.left = sx + "px"; fly.style.top = sy + "px";
    document.body.appendChild(fly);
    markLoaded();
    const mx = (ex - sx) * 0.5, my = Math.min(ey - sy, 0) - 140;
    const anim = fly.animate([
      { transform: "translate(0,0) scale(1.6) rotate(0)", opacity: 0, borderRadius: "12px" },
      { transform: "translate(0,-20px) scale(1.3) rotate(-6deg)", opacity: 1, offset: 0.12 },
      { transform: `translate(${mx}px, ${my}px) scale(.8) rotate(8deg)`, opacity: 1, offset: 0.55 },
      { transform: `translate(${ex - sx}px, ${ey - sy}px) scale(.12) rotate(0)`, opacity: 0.3, borderRadius: "50%" }
    ], { duration: 950, easing: "cubic-bezier(.55,0,.25,1)", fill: "forwards" });
    anim.onfinish = () => { fly.remove(); done(); };
  }

  function updateCounts() {
    const n = state.cart.reduce((s, it) => s + it.qty, 0);
    [["#bagCount", n], ["#tabCount", n]].forEach(([sel, v]) => { const el = $(sel); el.textContent = v; el.classList.toggle("has", v > 0); });
    $("#drawerCount").textContent = n;
    const w = state.wish.length, wc = $("#wishCount");
    wc.textContent = w; wc.classList.toggle("has", w > 0);
  }

  function renderDrawer() {
    const body = $("#drawerBody"), foot = $("#drawerFoot");
    const tt = totals(-1);
    const left = Math.max(0, CFG.freeShippingOver - tt.sub);
    const bundleTxt = tt.bundlePct ? t("cart.bundle.ok", { p: tt.bundlePct }) : t("cart.bundle", { n: CFG.bundle.minQty, p: CFG.bundle.percent });
    $("#freeText").innerHTML = `${left > 0 ? t("cart.freeleft", { n: money(left) }) : t("cart.freeok")}<br><span class="${tt.bundlePct ? "ok" : ""}">${bundleTxt}</span>`;
    $("#freeProgress").style.width = Math.min(100, (tt.sub / CFG.freeShippingOver) * 100) + "%";
    $("#freeBar").style.display = state.cart.length ? "" : "none";
    if (!state.cart.length) {
      body.innerHTML = `<div class="empty"><img class="mk" src="assets/img/mr-mark.png" alt=""><p>${t("cart.empty")}</p><a href="#/shop" class="btn" data-close>${t("cart.empty.cta")} ${ICON.arrow}</a></div>`;
      foot.innerHTML = "";
      return;
    }
    body.innerHTML = state.cart.map((it, i) => lineItemHTML(it, i)).join("");
    foot.innerHTML = `
      <div class="rowline"><span>${t("cart.subtotal")}</span><b>${money(tt.sub)}</b></div>
      ${tt.discount ? `<div class="rowline disc"><span>${t("co.discount")} (${tt.label})</span><span>−${money(tt.discount)}</span></div>` : ""}
      <p class="drawer__note">${t("cart.shipcalc")}</p>
      <a href="#/checkout" class="btn btn--block">${t("cart.checkout")} · ${money(tt.sub - tt.discount)} ${ICON.arrow}</a>`;
    markLoaded();
  }

  /* =============================================================
     OVERLAYS
     ============================================================= */
  const drawer = $("#drawer"), scrim = $("#scrim");
  function openDrawer() {
    renderDrawer();
    drawer.classList.add("is-open"); drawer.setAttribute("aria-hidden", "false");
    scrim.classList.add("is-on"); document.body.classList.add("lock", "drawer-open");
  }
  function closeDrawer() {
    drawer.classList.remove("is-open"); drawer.setAttribute("aria-hidden", "true");
    drawer.style.transform = "";
    scrim.classList.remove("is-on");
    document.body.classList.remove("drawer-open");
    if (!$("#search").classList.contains("is-open") && !document.body.classList.contains("menu-open")) document.body.classList.remove("lock");
  }
  function openSearch() {
    const s = $("#search");
    s.classList.add("is-open"); s.setAttribute("aria-hidden", "false");
    document.body.classList.add("lock");
    renderSearch("");
    setTimeout(() => $("#searchInput").focus(), 250);
  }
  function closeSearch() {
    const s = $("#search");
    s.classList.remove("is-open"); s.setAttribute("aria-hidden", "true");
    $("#searchInput").value = "";
    document.body.classList.remove("lock");
  }
  function toggleMenu(force) {
    const open = force !== undefined ? force : !document.body.classList.contains("menu-open");
    document.body.classList.toggle("menu-open", open);
    document.body.classList.toggle("lock", open);
    $("#menu").setAttribute("aria-hidden", String(!open));
  }
  function openSize() {
    const rows = [["S", 56, 68, 61], ["M", 59, 70, 62], ["L", 62, 72, 63], ["XL", 65, 74, 64], ["XXL", 68, 76, 65], ["3XL", 71, 78, 66]];
    $("#sizeBody").innerHTML = `<table class="size-table"><thead><tr><th></th><th>${t("size.chest")}</th><th>${t("size.length")}</th><th>${t("size.sleeve")}</th></tr></thead>
      <tbody>${rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join("")}</tr>`).join("")}</tbody></table><p>${t("size.note")}</p>`;
    $("#sizeSheet").classList.add("is-open");
  }
  function closeAll() {
    closeDrawer(); closeSearch(); toggleMenu(false);
    $("#sizeSheet").classList.remove("is-open");
  }

  function renderSearch(q) {
    const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[أإآ]/g, "ا").replace(/ة/g, "ه").replace(/ى/g, "ي");
    const nq = norm(q.trim());
    const tags = [...new Set(PRODUCTS.flatMap((p) => p.colors))].slice(0, 7);
    $("#searchTags").innerHTML = `<small>${t("search.popular")}</small>` +
      tags.map((k) => `<button class="chip" data-stag="${colorName(k)}">${colorName(k)}</button>`).join("") +
      ["essentials", "signature", "limited"].map((c) => `<button class="chip" data-stag="${t("cat." + c)}">${t("cat." + c)}</button>`).join("");
    const list = !nq ? PRODUCTS.slice(0, 4) : PRODUCTS.filter((p) => {
      const hay = norm([p.name.en, p.name.ar, p.tagline.en, p.tagline.ar, I18N.ar["cat." + p.category], I18N.en["cat." + p.category], "hoodie هودي", ...p.colors.flatMap((k) => [COLORS[k].en, COLORS[k].ar])].join(" "));
      return nq.split(/\s+/).every((w) => hay.includes(w));
    });
    $("#searchResults").innerHTML = list.length ? list.map(cardHTML).join("") : `<p class="none">${t("search.none")}</p>`;
    markLoaded();
  }

  /* ---------------- Toast ---------------- */
  let toastTimer;
  function toast(msg, onClick) {
    const el = $("#toast");
    el.innerHTML = `<span class="t-ic">${starHTML}</span><span>${msg}</span>`;
    el.onclick = onClick ? () => { el.classList.remove("is-on"); onClick(); } : null;
    el.style.cursor = onClick ? "pointer" : "";
    el.classList.add("is-on");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("is-on"), 2600);
  }

  /* ---------------- Wishlist ---------------- */
  function toggleWish(id, btn) {
    const i = state.wish.indexOf(id);
    if (i >= 0) state.wish.splice(i, 1); else state.wish.push(id);
    store.set("mr_wish", state.wish);
    const on = state.wish.includes(id);
    $$(`[data-wish="${id}"]`).forEach((b) => b.classList.toggle("on", on));
    updateCounts();
    toast(on ? t("toast.wish") : t("toast.unwish"));
    if (on && btn && !reduced) {
      const r = btn.getBoundingClientRect();
      starBurst(r.left + r.width / 2, r.top + r.height / 2, 10);
    }
    if (!on && currentRoute === "wishlist") setTimeout(render, 300);
  }

  /* =============================================================
     GLOBAL EVENTS
     ============================================================= */
  document.addEventListener("click", (e) => {
    const tgt = e.target;
    const w = tgt.closest("[data-wish]");
    if (w) { e.preventDefault(); e.stopPropagation(); toggleWish(w.dataset.wish, w); return; }
    const q = tgt.closest("[data-quick]");
    if (q) {
      e.preventDefault();
      const p = getP(q.dataset.quick);
      addToCart(p.id, p.colors[0], q.dataset.size, 1, q.closest(".card__media"));
      return;
    }
    if (tgt.closest("[data-close]")) { closeDrawer(); }
    if (tgt.closest("[data-close-search]")) { closeSearch(); return; }
    if (tgt.closest("[data-close-sheet]") || tgt === $("#sizeSheet")) { $("#sizeSheet").classList.remove("is-open"); return; }
    if (tgt.closest("[data-open-size]")) { e.preventDefault(); openSize(); return; }
    const stag = tgt.closest("[data-stag]");
    if (stag) { $("#searchInput").value = stag.dataset.stag; renderSearch(stag.dataset.stag); return; }
    const lq = tgt.closest("[data-line-qty]");
    if (lq) {
      const it = state.cart[+lq.dataset.idx];
      it.qty = Math.max(1, Math.min(10, it.qty + +lq.dataset.lineQty));
      saveCart(); return;
    }
    const rm = tgt.closest("[data-rm]");
    if (rm) {
      const li = rm.closest(".line-item");
      li.classList.add("removing");
      setTimeout(() => { state.cart.splice(+rm.dataset.rm, 1); saveCart(); }, 420);
      return;
    }
    const a = tgt.closest("a[href^='#']");
    if (a && a.getAttribute("href") === location.hash) closeAll();
    if (a && $("#search").contains(a)) closeSearch();
    if (a && drawer.contains(a)) closeDrawer();
  });

  $("#bagBtn").addEventListener("click", openDrawer);
  $("#tabBag").addEventListener("click", openDrawer);
  $("#searchBtn").addEventListener("click", openSearch);
  $("#tabSearch").addEventListener("click", openSearch);
  $("#menuBtn").addEventListener("click", () => toggleMenu());
  $("#themeBtn").addEventListener("click", toggleTheme);
  scrim.addEventListener("click", closeDrawer);
  $("#searchInput").addEventListener("input", (e) => renderSearch(e.target.value));
  $("#langBtn").addEventListener("click", () => {
    state.lang = state.lang === "en" ? "ar" : "en";
    store.set("mr_lang", state.lang);
    drawer.classList.add("no-anim");
    applyStaticI18n();
    void drawer.offsetWidth;
    setTimeout(() => drawer.classList.remove("no-anim"), 60);
    renderDrawer();
    render();
    setTimeout(revealHero, 60);
  });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeAll(); });
  window.addEventListener("hashchange", navigate);
  window.addEventListener("resize", moveTabGlow);
  // follow OS theme changes unless the visitor picked one
  if (window.matchMedia) {
    const mq = window.matchMedia("(prefers-color-scheme: light)");
    const onOS = (ev) => { if (!store.get("mr_theme", null)) document.documentElement.setAttribute("data-theme", ev.matches ? "light" : "dark"); };
    mq.addEventListener ? mq.addEventListener("change", onOS) : mq.addListener && mq.addListener(onOS);
  }

  // Drawer drag-to-close (mobile bottom sheet)
  (function dragSheet() {
    const grip = $("#drawerGrip"), head = $(".drawer__head", drawer);
    let startY = 0, dy = 0, dragging = false;
    const down = (e) => {
      if (isDesktop()) return;
      dragging = true; startY = e.clientY; dy = 0;
      drawer.classList.add("dragging");
      e.target.setPointerCapture && e.target.setPointerCapture(e.pointerId);
    };
    const move = (e) => {
      if (!dragging) return;
      dy = Math.max(0, e.clientY - startY);
      drawer.style.transform = `translateY(${dy}px)`;
    };
    const up = () => {
      if (!dragging) return;
      dragging = false; drawer.classList.remove("dragging");
      if (dy > 110) closeDrawer(); else drawer.style.transform = "";
    };
    [grip, head].forEach((el) => {
      el.addEventListener("pointerdown", (e) => { if (e.target.closest("button")) return; down(e); });
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerup", up);
      el.addEventListener("pointercancel", up);
    });
  })();

  // Header hide/show on scroll
  (function headerScroll() {
    const header = $("#header");
    let last = 0, ticking = false;
    window.addEventListener("scroll", () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        header.classList.toggle("is-solid", currentRoute !== "home" || y > 10);
        if (y > 160 && y > last + 4 && !document.body.classList.contains("menu-open")) header.classList.add("is-hidden");
        else if (y < last - 4 || y < 160) header.classList.remove("is-hidden");
        last = y; ticking = false;
      });
    }, { passive: true });
  })();

  // Custom cursor
  (function cursor() {
    if (!finePointer || reduced) return;
    document.body.classList.add("has-cursor");
    const c = $("#cursor"), d = $("#cursorDot"), label = $("#cursorLabel");
    let x = innerWidth / 2, y = innerHeight / 2, cx = x, cy = y;
    window.addEventListener("mousemove", (e) => { x = e.clientX; y = e.clientY; d.style.transform = `translate(${x}px, ${y}px)`; }, { passive: true });
    const loop = () => {
      cx += (x - cx) * 0.16; cy += (y - cy) * 0.16;
      c.style.transform = `translate(${cx}px, ${cy}px)`;
      requestAnimationFrame(loop);
    };
    loop();
    document.addEventListener("mouseover", (e) => {
      const v = e.target.closest("[data-cursor='view']");
      const h = e.target.closest("a, button, select, input, label, textarea");
      c.classList.toggle("is-view", !!v && !e.target.closest("button"));
      c.classList.toggle("is-hover", !!h && !(v && !e.target.closest("button")));
      label.textContent = t("view");
    });
    document.addEventListener("mouseleave", () => { c.classList.add("is-hidden"); d.classList.add("is-hidden"); });
    document.addEventListener("mouseenter", () => { c.classList.remove("is-hidden"); d.classList.remove("is-hidden"); });
  })();

  /* =============================================================
     BOOT
     ============================================================= */
  function boot() {
    const meta = $('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", getTheme() === "light" ? "#f5f0e8" : "#0c0b0a");
    $("#menuSocial").innerHTML = socialsHTML();
    applyStaticI18n();
    updateCounts();
    renderDrawer();
    navigate();

    const pre = $("#preloader"), count = $("#loadCount");
    let seen = false;
    try { seen = sessionStorage.getItem("mr_seen") === "1"; sessionStorage.setItem("mr_seen", "1"); } catch (e) { /* ignore */ }
    const minTime = reduced ? 200 : seen ? 1100 : 2400;
    const t0 = performance.now();
    let loaded = document.readyState === "complete";
    window.addEventListener("load", () => { loaded = true; });
    const tick = (now) => {
      const k = Math.min(1, (now - t0) / minTime);
      const shown = Math.floor((loaded ? k : Math.min(k, 0.9)) * 100);
      count.textContent = String(shown).padStart(3, "0");
      if (k >= 1 && (loaded || now - t0 > 5000)) {
        count.textContent = "100";
        pre.classList.add("is-done");
        document.body.classList.remove("is-loading");
        setTimeout(revealHero, 350);
        setTimeout(() => pre.classList.add("is-gone"), 1300);
        return;
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);

    if ("serviceWorker" in navigator && location.protocol === "https:") {
      navigator.serviceWorker.register("sw.js").catch(() => {});
    }
  }

  boot();
})();
