// Flat illustrations and outline icons in the deck's style: navy, blue,
// gold and cream, no gradients. Parts that scenes animate carry class names.

export const C = {
  navy: '#00294c', blue: '#1c4a78', blueSoft: '#e6edf5', blueLine: '#c3d1e1',
  gold: '#e8a807', goldInk: '#8a5d00', goldSoft: '#fcf1d3', cream: '#faf8f3',
  muted: '#556070', line: '#d8dde4', green: '#0e7a55', greenSoft: '#dcf1e7',
  red: '#b3261e', redSoft: '#f7e4e2', potFill: '#123e6c', potDot: '#4f78a3',
};

const svg = (vb, body, cls = '', style = '') =>
  `<svg class="${cls}" viewBox="${vb}" xmlns="http://www.w3.org/2000/svg" style="overflow:visible;display:block;${style}">${body}</svg>`;

// Outline icon on a 24-unit grid, like the deck's icons.
const icon = (body, { w = 64, color = C.blue, sw = 1.8, cls = 'icon' } = {}) =>
  svg('0 0 24 24', `<g fill="none" stroke="${color}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">${body}</g>`, cls, `width:${w}px;height:${w}px`);

// ---------- the deck's pot and spoon ----------

// Pot seen from above: a navy circle full of dots (every dot is one element).
export function potTop({ w = 420, ring = C.blueLine } = {}) {
  const dots = [];
  for (let y = 30; y <= 370; y += 26) {
    for (let x = 30; x <= 370; x += 26) {
      const dx = x - 200;
      const dy = y - 200;
      if (dx * dx + dy * dy < 172 * 172) dots.push(`<circle cx="${x}" cy="${y}" r="4.6"/>`);
    }
  }
  return svg('0 0 400 400', `
    <circle cx="200" cy="200" r="194" fill="${C.potFill}" stroke="${ring}" stroke-width="6"/>
    <g class="dots" fill="${C.potDot}">${dots.join('')}</g>
  `, 'pot', `width:${w}px`);
}

// Spoon with a few gold dots (the sample), handle pointing down-right.
export function spoon({ w = 260, dots = 5, empty = false } = {}) {
  const pts = [[78, 62], [104, 72], [70, 92], [96, 100], [88, 80], [116, 92], [62, 74]].slice(0, dots);
  return svg('0 0 260 260', `
    <path d="M128 130 L228 230" stroke="${C.gold}" stroke-width="16" stroke-linecap="round"/>
    <ellipse cx="88" cy="84" rx="72" ry="54" transform="rotate(40 88 84)" fill="${C.goldSoft}" stroke="${C.gold}" stroke-width="7"/>
    <g class="sd" fill="${C.gold}" ${empty ? 'opacity="0"' : ''}>${pts.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="8.5"/>`).join('')}</g>
  `, 'spoon', `width:${w}px`);
}

// Pot from the side, cut open, for "the salt sank to the bottom".
export function potSide({ w = 520 } = {}) {
  let s = 7;
  const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  const salt = Array.from({ length: 70 }, () => `<circle cx="${(70 + rnd() * 380).toFixed(0)}" cy="${(388 + rnd() * 44).toFixed(0)}" r="7"/>`).join('');
  return svg('0 0 520 470', `
    <rect x="0" y="52" width="40" height="22" rx="8" fill="${C.blue}"/>
    <rect x="480" y="52" width="40" height="22" rx="8" fill="${C.blue}"/>
    <path d="M40 40 L480 40 L466 420 Q462 456 426 456 L94 456 Q58 456 54 420 Z" fill="${C.goldSoft}" stroke="${C.navy}" stroke-width="8"/>
    <path d="M44 96 L476 96" stroke="${C.gold}" stroke-width="5" stroke-dasharray="14 10"/>
    <g class="salt" fill="${C.navy}">${salt}</g>
  `, 'potside', `width:${w}px`);
}

// Grid of dots; dot i has a gold twin `.g{i}` that scenes can switch on.
export function dotGrid({ cols, rows, gap = 46, r = 9, base = C.potDot, gold = [], ringed = [], w = null } = {}) {
  const W = (cols - 1) * gap + 2 * r + 8;
  const H = (rows - 1) * gap + 2 * r + 8;
  let out = '';
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      const k = j * cols + i;
      const x = r + 4 + i * gap;
      const y = r + 4 + j * gap;
      out += `<circle class="b${k}" cx="${x}" cy="${y}" r="${r}" fill="${base}"/>`;
      out += `<circle class="g g${k}" cx="${x}" cy="${y}" r="${r * 1.12}" fill="${C.gold}" ${gold.includes(k) ? '' : 'opacity="0"'} style="transform-box:fill-box;transform-origin:center"/>`;
      if (ringed.includes(k)) out += `<circle cx="${x}" cy="${y}" r="${r + 7}" fill="none" stroke="${C.gold}" stroke-width="3"/>`;
    }
  }
  return svg(`0 0 ${W} ${H}`, out, 'dotgrid', `width:${w || W}px`);
}

// ---------- outline icons ----------
export const ic = {
  clock: (o) => icon('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>', o),
  cash: (o) => icon('<rect x="2.5" y="6" width="19" height="12" rx="2"/><circle cx="12" cy="12" r="2.6"/><path d="M6 9.5v.01M18 14.5v.01"/>', o),
  effort: (o) => icon('<path d="M6.5 7v10M17.5 7v10M3.5 9.5v5M20.5 9.5v5M6.5 12h11"/>', o),
  check: (o) => icon('<path d="M5 12.5l4.5 4.5L19 7.5"/>', { color: C.green, ...o }),
  x: (o) => icon('<path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/>', { color: C.red, ...o }),
  warn: (o) => icon('<path d="M12 4L21.5 20H2.5Z"/><path d="M12 10v4.5M12 17.4v.01"/>', o),
  bulb: (o) => icon('<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.6 10.8c.6.5 1 1.2 1 2V16h5.2v-.2c0-.8.4-1.5 1-2A6 6 0 0 0 12 3z"/>', { color: C.goldInk, ...o }),
  key: (o) => icon('<circle cx="8" cy="12" r="4"/><path d="M12 12h9M18 12v3M21 12v2"/>', o),
  thumb: (o) => icon('<path d="M7 11v9H4v-9z"/><path d="M7 11l4-7c1.5 0 2.5 1 2.2 2.6L12.6 10H19a2 2 0 0 1 2 2.3l-1.2 6A2 2 0 0 1 17.8 20H7"/>', o),
  users: (o) => icon('<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6"/><circle cx="17" cy="9" r="2.6"/><path d="M17 14c2.6 0 4.5 1.8 4.5 4.5"/>', o),
  user: (o) => icon('<circle cx="12" cy="8" r="4"/><path d="M4.5 21c0-4.2 3.4-7 7.5-7s7.5 2.8 7.5 7"/>', o),
  store: (o) => icon('<path d="M3 9.5l1.5-5h15l1.5 5"/><path d="M3 9.5c0 1.5 1.3 2.5 3 2.5s3-1 3-2.5c0 1.5 1.3 2.5 3 2.5s3-1 3-2.5c0 1.5 1.3 2.5 3 2.5s3-1 3-2.5"/><path d="M5 12v8.5h14V12M10 20.5v-5h4v5"/>', o),
  home: (o) => icon('<path d="M3.5 11L12 4l8.5 7"/><path d="M6 9.5v11h12v-11M10 20.5v-6h4v6"/>', o),
  gear: (o) => icon('<circle cx="12" cy="12" r="3.2"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1"/>', o),
  building: (o) => icon('<rect x="5" y="3" width="14" height="18" rx="1"/><path d="M9 7h1.5M13.5 7H15M9 11h1.5M13.5 11H15M9 15h1.5M13.5 15H15M10.5 21v-2.5h3V21"/>', o),
  school: (o) => icon('<path d="M3 10.5L12 6l9 4.5"/><path d="M5 10v10.5h14V10"/><path d="M10 20.5v-5h4v5M12 6V2.5l3 1.2-3 1.2"/>', o),
  hospital: (o) => icon('<rect x="4" y="5" width="16" height="16" rx="1.5"/><path d="M12 9v6M9 12h6"/>', o),
  book: (o) => icon('<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5"/>', o),
  paper: (o) => icon('<path d="M6 2.5h9l4 4v15H6z"/><path d="M15 2.5v4h4M9 11h7M9 14.5h7M9 18h4"/>', o),
  search: (o) => icon('<circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L21 21"/>', o),
  list: (o) => icon('<path d="M9 6h11M9 12h11M9 18h11"/><path d="M4.5 6h.01M4.5 12h.01M4.5 18h.01"/>', o),
  layers: (o) => icon('<path d="M12 3l9 4.5-9 4.5-9-4.5z"/><path d="M3 12l9 4.5 9-4.5M3 16.5L12 21l9-4.5"/>', o),
  map: (o) => icon('<path d="M3 6.5l6-3 6 3 6-3v14l-6 3-6-3-6 3z"/><path d="M9 3.5v14M15 6.5v14"/>', o),
  pin: (o) => icon('<path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/>', o),
  star: (o) => icon('<path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.8l-5.2 2.8 1-5.8-4.3-4.1 5.9-.8z"/>', o),
  fish: (o) => icon('<path d="M2.5 12c3-4.5 9-6 14-2l4-3v10l-4-3c-5 4-11 2.5-14-2z"/><path d="M7.5 11v.01"/>', o),
  cell: (o) => icon('<circle cx="12" cy="12" r="8.5"/><circle cx="13.5" cy="10.5" r="2.8"/>', o),
  drop: (o) => icon('<path d="M12 3s6.5 7 6.5 11.5a6.5 6.5 0 0 1-13 0C5.5 10 12 3 12 3z"/>', o),
  bus: (o) => icon('<rect x="4" y="3.5" width="16" height="14" rx="2.5"/><path d="M4 10.5h16M7.5 20.5v-3M16.5 20.5v-3M7.5 14h.01M16.5 14h.01"/>', o),
  bag: (o) => icon('<path d="M8 7c0-2.2 1.8-4 4-4s4 1.8 4 4"/><path d="M5.5 7h13l-1 13.5h-11z"/>', o),
  flask: (o) => icon('<path d="M9.5 3h5M10.5 3v6.5L5.5 19a1.6 1.6 0 0 0 1.4 2.5h10.2a1.6 1.6 0 0 0 1.4-2.5l-5-9.5V3"/><path d="M8 15h8"/>', o),
  grapes: (o) => icon('<circle cx="12" cy="8.5" r="2.4"/><circle cx="8.5" cy="10.5" r="2.4"/><circle cx="15.5" cy="10.5" r="2.4"/><circle cx="10.2" cy="14" r="2.4"/><circle cx="13.8" cy="14" r="2.4"/><circle cx="12" cy="17.6" r="2.4"/><path d="M12 6c0-2 1-3.2 3-3.5"/>', o),
  infinity: (o) => icon('<path d="M12 12c-2-2.7-3.5-4-5.5-4a4 4 0 0 0 0 8c2 0 3.5-1.3 5.5-4zm0 0c2 2.7 3.5 4 5.5 4a4 4 0 0 0 0-8c-2 0-3.5 1.3-5.5 4z"/>', o),
  hash: (o) => icon('<path d="M5 9h14M5 15h14M10 4l-2 16M16 4l-2 16"/>', o),
  pencil: (o) => icon('<path d="M4 20l1-4.5L16 4.5l3.5 3.5L8.5 19z"/><path d="M14 7l3.5 3.5"/>', o),
  arrowL: (o) => icon('<path d="M20 12H5M11 6l-6 6 6 6"/>', o),
};

// The deck's thick grey arrow (pointing left = "becomes" in RTL).
export function arrow({ w = 90, color = C.muted } = {}) {
  return svg('0 0 160 72', `<path d="M0 36 L60 0 L60 22 L160 22 L160 50 L60 50 L60 72 Z" fill="${color}"/>`, 'arr', `width:${w}px`);
}

// Icon inside a soft circle.
export function chipIcon(fn, { w = 120, bg = C.blueSoft, color = C.blue } = {}) {
  return `<div style="width:${w}px;height:${w}px;border-radius:50%;background:${bg};display:grid;place-items:center">${fn({ w: w * 0.56, color })}</div>`;
}

export function check({ w = 96 } = {}) {
  return chipIcon(ic.check, { w, bg: C.greenSoft, color: C.green });
}
export function cross({ w = 96 } = {}) {
  return chipIcon(ic.x, { w, bg: C.redSoft, color: C.red });
}

// ---------- scene objects ----------

export function scale({ w = 900 } = {}) {
  return svg('0 0 900 560', `
    <rect x="390" y="510" width="120" height="20" rx="10" fill="${C.navy}"/>
    <path d="M438 510 L450 130 L462 510 Z" fill="${C.navy}"/>
    <g class="beam"><rect x="120" y="110" width="660" height="18" rx="9" fill="${C.blue}"/></g>
    <circle cx="450" cy="119" r="20" fill="${C.gold}"/>
    <g class="panR">
      <path d="M190 128 L120 330 M190 128 L260 330" stroke="${C.muted}" stroke-width="4"/>
      <path d="M90 330 L290 330 Q280 380 190 380 Q100 380 90 330 Z" fill="${C.blueSoft}" stroke="${C.blue}" stroke-width="5"/>
    </g>
    <g class="panL">
      <path d="M710 128 L640 330 M710 128 L780 330" stroke="${C.muted}" stroke-width="4"/>
      <path d="M610 330 L810 330 Q800 380 710 380 Q620 380 610 330 Z" fill="${C.goldSoft}" stroke="${C.gold}" stroke-width="5"/>
    </g>
  `, 'scale', `width:${w}px`);
}

export function matchbox({ w = 300 } = {}) {
  return svg('0 0 300 200', `
    <rect x="10" y="60" width="280" height="130" rx="12" fill="${C.cream}" stroke="${C.navy}" stroke-width="6"/>
    <rect x="10" y="60" width="280" height="28" rx="10" fill="${C.navy}"/>
    <text x="150" y="152" text-anchor="middle" font-family="Body" font-weight="800" font-size="40" fill="${C.navy}">كبريت</text>
  `, 'matchbox', `width:${w}px`);
}

export function match({ w = 54 } = {}) {
  return svg('0 0 60 260', `
    <g class="flame">
      <path d="M30 0 C55 30 52 62 30 74 C8 62 5 30 30 0 Z" fill="${C.gold}"/>
      <path d="M30 30 C40 44 39 60 30 66 C21 60 20 44 30 30 Z" fill="${C.goldSoft}"/>
    </g>
    <rect x="24" y="78" width="12" height="178" rx="5" fill="#d9c6a1"/>
    <ellipse cx="30" cy="80" rx="12" ry="16" fill="${C.red}"/>
    <g class="burnt" opacity="0"><rect x="23" y="62" width="14" height="44" rx="6" fill="#3a3a3a"/></g>
  `, 'match', `width:${w}px`);
}

// Simple flat person; gold = picked into the sample.
export function person({ w = 56, color = C.blue } = {}) {
  return svg('0 0 64 92', `<circle cx="32" cy="20" r="16" fill="${color}"/><path d="M4 92 L4 66 Q4 42 32 42 Q60 42 60 66 L60 92 Z" fill="${color}"/>`, 'person', `width:${w}px`);
}

export function shelf({ w = 520 } = {}) {
  const cols = [C.blue, C.gold, C.navy, C.blueLine, C.goldInk];
  const row = (y) => Array.from({ length: 11 }, (_, i) => {
    const h = 72 + ((i * 37) % 26);
    return `<rect x="${32 + i * 42}" y="${y - h}" width="34" height="${h}" rx="4" fill="${cols[(i + y) % cols.length]}"/>`;
  }).join('');
  return svg('0 0 520 330', `
    <rect x="10" y="10" width="500" height="310" rx="12" fill="none" stroke="${C.navy}" stroke-width="8"/>
    ${row(150)}${row(296)}
    <rect x="14" y="150" width="492" height="10" fill="${C.navy}"/>
  `, 'shelf', `width:${w}px`);
}

export function slip({ w = 140, text = '' } = {}) {
  return svg('0 0 150 90', `
    <rect x="4" y="4" width="142" height="82" rx="10" fill="#fff" stroke="${C.line}" stroke-width="4"/>
    ${text ? `<text x="75" y="58" text-anchor="middle" font-family="Body" font-weight="700" font-size="30" fill="${C.navy}">${text}</text>` :
      `<rect x="24" y="30" width="102" height="9" rx="4" fill="${C.blueLine}"/><rect x="24" y="52" width="70" height="9" rx="4" fill="${C.line}"/>`}
  `, 'slip', `width:${w}px`);
}

export function ring({ size = 200, color = C.gold } = {}) {
  const r = size / 2 - 12;
  return `<svg viewBox="0 0 ${size} ${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="${C.line}" stroke-width="14"/><circle class="arc" cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="${color}" stroke-width="14" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="0"/></svg>`;
}

// Dot-grid decoration from the deck's section slides.
export function deckDots({ cols = 8, rows = 8, gap = 52, gold = [10, 21, 30, 44, 53, 58] } = {}) {
  return dotGrid({ cols, rows, gap, r: 9, base: '#1c4a78', gold });
}
