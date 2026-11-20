/* ==========================================================
   MAISON ROYALE — Illustrated garment renderer (SVG)
   Renders premium flat-lay hoodie illustrations in any colourway,
   so the store looks complete before real photography exists.
   ========================================================== */
(function () {
  let seq = 0;

  function luminance(hex) {
    const n = parseInt(hex.slice(1), 16);
    const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
    return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  }
  const isLight = (hex) => luminance(hex) > 0.55;

  const STAR = (cx, cy, r) => {
    const k = r * 0.22;
    return `M${cx},${cy - r} C${cx + k * 0.3},${cy - k} ${cx + k},${cy - k * 0.3} ${cx + r},${cy} C${cx + k},${cy + k * 0.3} ${cx + k * 0.3},${cy + k} ${cx},${cy + r} C${cx - k * 0.3},${cy + k} ${cx - k},${cy + k * 0.3} ${cx - r},${cy} C${cx - k},${cy - k * 0.3} ${cx - k * 0.3},${cy - k} ${cx},${cy - r} Z`;
  };

  function art(light) {
    return {
      mark: light ? "assets/img/mr-mark-dark.png" : "assets/img/mr-mark.png",
      word: light ? "assets/img/wordmark-dark.png" : "assets/img/wordmark.png",
      ink: light ? "#1b1a18" : "#ece7de"
    };
  }

  function ribLines(x1, x2, y1, y2, step, curve) {
    let d = "";
    for (let x = x1 + step; x < x2; x += step) {
      const off = curve ? Math.sin(((x - x1) / (x2 - x1)) * Math.PI) * curve : 0;
      d += `M${x},${y1 + off} L${x},${y2 + off} `;
    }
    return d;
  }

  /**
   * @param {object} o  { hex, style, print, view }
   */
  function render(o) {
    const id = "h" + (++seq);
    const hex = o.hex;
    const light = isLight(hex);
    const a = art(light);
    const style = o.style || "pullover";
    const print = o.print || "monogram";
    const view = o.view || "front";
    const cropped = style === "cropped";
    const zip = style === "zip";
    const hemY = cropped ? 352 : 410;
    const cord = light ? "#2a2826" : "#ddd6c8";
    const seam = light ? "rgba(0,0,0,.16)" : "rgba(0,0,0,.45)";
    const hi = light ? "rgba(255,255,255,.55)" : "rgba(255,255,255,.07)";

    // ----- shapes -----
    const sleeveL = `M96,120 C72,136 58,176 52,236 L40,370 L82,378 L96,262 L104,196 Z`;
    const sleeveR = `M304,120 C328,136 342,176 348,236 L360,370 L318,378 L304,262 L296,196 Z`;
    const cuffL = `M40,366 L82,374 L79,410 L35,402 Z`;
    const cuffR = `M360,366 L318,374 L321,410 L365,402 Z`;
    const torso = `M140,98 Q112,104 94,122 L102,196 L106,${hemY} Q200,${hemY + 8} 294,${hemY} L298,196 L306,122 Q288,104 260,98 Z`;
    const hem = cropped ? "" : `M106,404 Q200,412 294,404 L292,438 Q200,446 108,438 Z`;

    const hoodOuter = `M138,102 C126,58 152,22 200,20 C248,22 274,58 262,102 Z`;
    const hoodInner = `M156,106 C152,66 172,42 200,40 C228,42 248,66 244,106 C230,128 170,128 156,106 Z`;
    const lapelR = zip
      ? `M262,102 C258,130 236,150 202,162 L202,150 C226,142 242,126 244,106 Z`
      : `M262,102 C258,130 232,152 192,162 L188,150 C222,142 242,126 244,106 Z`;
    const lapelL = zip
      ? `M138,102 C142,130 164,150 198,162 L198,150 C174,142 158,126 156,106 Z`
      : `M138,102 C142,130 168,152 208,162 L212,150 C178,142 158,126 156,106 Z`;
    const hoodBack = `M146,98 C134,152 156,210 200,218 C244,210 266,152 254,98 Q200,90 146,98 Z`;

    let pocket = "";
    if (!cropped && view === "front") {
      pocket = zip
        ? `M118,300 L194,300 L194,394 L120,394 Q126,350 118,300 Z M282,300 L206,300 L206,394 L280,394 Q274,350 282,300 Z`
        : `M146,300 L254,300 Q266,346 280,394 Q200,400 120,394 Q134,346 146,300 Z`;
    }

    const fabricParts = view === "front"
      ? [sleeveL, sleeveR, cuffL, cuffR, torso, hem, hoodOuter]
      : [sleeveL, sleeveR, cuffL, cuffR, torso, hem];

    // ----- print -----
    let printSvg = "";
    if (view === "front") {
      if (print === "monogram") {
        printSvg = `<image href="${a.mark}" x="176" y="200" width="48" height="25" opacity=".9"/>`;
      } else if (print === "star") {
        printSvg = `<path d="${STAR(150, 206, 11)}" fill="${a.ink}" opacity=".95"/>`;
      } else if (print === "crest") {
        printSvg = `<g opacity=".92"><circle cx="152" cy="208" r="21" fill="none" stroke="${a.ink}" stroke-width="1.1" opacity=".75"/>
          <image href="${a.mark}" x="138" y="199" width="28" height="14.5"/>
          <path d="${STAR(152, 220, 3.2)}" fill="${a.ink}"/></g>`;
      } else if (print === "wordmark") {
        printSvg = `<image href="${a.mark}" x="138" y="198" width="30" height="15.5" opacity=".9"/>`;
      }
    } else {
      if (print === "wordmark") {
        printSvg = `<g opacity=".95"><image href="${a.mark}" x="146" y="238" width="108" height="56"/>
          <image href="${a.word}" x="118" y="306" width="164" height="13.7"/>
          <path d="M136,334 L190,334 M210,334 L264,334" stroke="${a.ink}" stroke-width="1"/>
          <path d="${STAR(200, 334, 5)}" fill="${a.ink}"/></g>`;
      } else {
        printSvg = `<path d="${STAR(200, 244, 6)}" fill="${a.ink}" opacity=".8"/>`;
      }
    }

    // ----- details -----
    const cuffRibs = view
      ? `<path d="M46,370 L42,404 M54,371 L50,405 M62,373 L58,406 M70,374 L67,408 M354,370 L358,404 M346,371 L350,405 M338,373 L342,406 M330,374 L333,408" stroke="${seam}" stroke-width="1"/>`
      : "";
    const hemRibs = cropped
      ? `<path d="M110,${hemY + 1} l2,7 M130,${hemY + 3} l-1,6 M152,${hemY + 4} l2,6 M176,${hemY + 5} l-1,7 M204,${hemY + 6} l1,6 M228,${hemY + 5} l-2,6 M252,${hemY + 4} l1,7 M274,${hemY + 3} l-1,6" stroke="${seam}" stroke-width="1.2"/>`
      : `<path d="${ribLines(108, 292, 408, 438, 7, 6)}" stroke="${seam}" stroke-width=".9"/>`;

    const seams = `
      <path d="M140,98 Q112,104 94,122 M260,98 Q288,104 306,122" stroke="${seam}" stroke-width="1.4" fill="none"/>
      <path d="M96,122 C100,150 102,175 104,196 M304,122 C300,150 298,175 296,196" stroke="${seam}" stroke-width="1.2" fill="none"/>
      <path d="M97,124 C101,150 103,175 105,196" stroke="${hi}" stroke-width="1" fill="none"/>`;

    let front = "";
    if (view === "front") {
      front = `
        <g class="fabric" fill="${hex}"><path d="${hoodInner}"/></g>
        <path d="${hoodInner}" fill="rgba(0,0,0,.42)"/>
        <path d="M168,112 C172,84 184,66 200,62 C216,66 228,84 232,112" fill="none" stroke="rgba(0,0,0,.25)" stroke-width="6"/>
        <g class="fabric" fill="${hex}"><path d="${lapelR}"/><path d="${lapelL}"/></g>
        <path d="${lapelR}" fill="url(#${id}s)"/><path d="${lapelL}" fill="url(#${id}s)"/>
        <path d="M156,106 C158,126 178,142 212,150 M244,106 C242,126 222,142 188,150" stroke="${seam}" stroke-width="1" fill="none"/>
        ${pocket ? `<g class="fabric" fill="${hex}"><path d="${pocket}"/></g><path d="${pocket}" fill="url(#${id}s)"/>
          <path d="${pocket}" fill="none" stroke="${seam}" stroke-width="1.2"/>
          <path d="${pocket}" fill="none" stroke="${hi}" stroke-width=".8" stroke-dasharray="3 3" transform="translate(0,3)"/>` : ""}
        ${zip ? `<path d="M200,156 L200,${cropped ? 352 : 438}" stroke="#8d8a85" stroke-width="3.2"/>
          <path d="M200,156 L200,${cropped ? 352 : 438}" stroke="#d6d3cd" stroke-width="1.2" stroke-dasharray="1.5 1.5"/>
          <rect x="196" y="170" width="8" height="18" rx="2.5" fill="#c9c6c0" stroke="#7d7a75" stroke-width=".8"/>
          <circle cx="200" cy="185" r="1.6" fill="#7d7a75"/>` : `
          <circle cx="184" cy="152" r="3" fill="${seam}"/><circle cx="216" cy="152" r="3" fill="${seam}"/>
          <path d="M184,152 C182,190 187,216 180,252" stroke="${cord}" stroke-width="3.4" fill="none" stroke-linecap="round"/>
          <path d="M216,152 C218,188 213,212 222,246" stroke="${cord}" stroke-width="3.4" fill="none" stroke-linecap="round"/>
          <path d="M180,250 L179,264 M222,244 L224,258" stroke="#bdbab4" stroke-width="4.4" stroke-linecap="round"/>`}
      `;
    } else {
      front = `
        <g class="fabric" fill="${hex}"><path d="${hoodBack}"/></g>
        <path d="${hoodBack}" fill="url(#${id}s)"/>
        <path d="${hoodBack}" fill="none" stroke="${seam}" stroke-width="1.3"/>
        <path d="M200,96 L200,216" stroke="${seam}" stroke-width="1.1"/>
        <path d="M146,98 C134,152 156,210 200,218" stroke="rgba(0,0,0,.18)" stroke-width="8" fill="none" transform="translate(4,6)"/>`;
    }

    const shapes = fabricParts.filter(Boolean).map((d) => `<path d="${d}"/>`).join("");

    return `<svg class="hoodie" viewBox="0 0 400 470" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">
      <defs>
        <linearGradient id="${id}s" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#fff" stop-opacity="${light ? 0.25 : 0.1}"/>
          <stop offset=".45" stop-color="#fff" stop-opacity="0"/>
          <stop offset="1" stop-color="#000" stop-opacity="${light ? 0.22 : 0.38}"/>
        </linearGradient>
        <linearGradient id="${id}c" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stop-color="#000" stop-opacity=".28"/>
          <stop offset=".22" stop-color="#000" stop-opacity="0"/>
          <stop offset=".78" stop-color="#000" stop-opacity="0"/>
          <stop offset="1" stop-color="#000" stop-opacity=".3"/>
        </linearGradient>
        <radialGradient id="${id}f" cx=".5" cy=".5" r=".5">
          <stop offset="0" stop-color="#000" stop-opacity=".55"/>
          <stop offset="1" stop-color="#000" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <ellipse cx="200" cy="452" rx="150" ry="12" fill="url(#${id}f)"/>
      <g class="fabric" fill="${hex}">${shapes}</g>
      <g fill="url(#${id}s)">${shapes}</g>
      <g fill="url(#${id}c)"><path d="${torso}"/></g>
      <path d="M94,122 L102,196 M306,122 L298,196" stroke="rgba(0,0,0,.25)" stroke-width="5" opacity=".5"/>
      ${seams}
      ${cuffRibs}
      ${hemRibs}
      <path d="M106,404 Q200,412 294,404" stroke="${seam}" stroke-width="1.2" fill="none" ${cropped ? 'opacity="0"' : ""}/>
      <path d="M40,366 L82,374 M360,366 L318,374" stroke="${seam}" stroke-width="1.2"/>
      ${front}
      <g class="print">${printSvg}</g>
    </svg>`;
  }

  window.MRHoodie = { render, isLight, STAR };
})();
