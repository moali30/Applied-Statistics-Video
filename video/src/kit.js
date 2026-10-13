// Building blocks shared by several scenes.
import * as art from './art.js';

export const PARTS = [
  { title: 'الفكرة', sub: 'الحلة والمعلقة… وليه بناخد عينة', clips: ['01', '02', '03', '04', '05', '06'] },
  { title: 'نسمي الحاجات بأساميها', sub: 'المجتمع والعينة، المعلمة والإحصاءة، والرموز', clips: ['p2', '07', '08', '09', '10', '11', '12'] },
  { title: 'إزاي نختار العينة؟', sub: 'أربع طرق… ولكل طريقة كلمة سر', clips: ['p3', '13', '14', '15', '16', '17'] },
  { title: 'نحل مع بعض', sub: 'مثالين من أسئلة الفصل', clips: ['p4', '18', '19', '20', '21'] },
  { title: 'أسئلة الاختيار من متعدد', sub: '16 سؤال زي الامتحان بالظبط', clips: ['p5', ...Array.from({ length: 16 }, (_, i) => String(22 + i))] },
  { title: 'الختام', sub: 'خلاصة السكشن والواجب', clips: ['p6', '38', '39'] },
];
export const ORDINAL = ['الأول', 'التاني', 'التالت', 'الرابع', 'الخامس', 'السادس'];
export const ORDER = PARTS.flatMap((p) => p.clips);

export function partOf(clip) {
  const i = PARTS.findIndex((p) => p.clips.includes(clip));
  return { index: i, ...PARTS[i] };
}

// Footer line, as on every slide of the deck.
export function chrome(S, clip, stage) {
  const part = partOf(clip);
  return S.add(`<div class="footer"><div>الإحصاء التطبيقي · سكشن 1 · المعاينة</div><div>الجزء ${ORDINAL[part.index]} · ${part.title}</div></div>`, {}, stage);
}

// Slide title at the top right with a small gold kicker above it.
export function title(S, text, { at = 0.2, kicker = '', top = 78 } = {}) {
  const el = S.add(`<div class="title-block" style="top:${top}px">${kicker ? `<div class="kicker">${kicker}</div>` : ''}<div class="title">${text}</div></div>`);
  if (kicker) S.show(el.children[0], at, 'fadeDown', 0.5);
  S.show(el.lastElementChild, at + (kicker ? 0.15 : 0), 'fadeUp', 0.6);
  return el;
}

// Circular "pause and think" countdown.
export function countdown(S, { start, len, x = 960, y = 540, label = 'وقّف وفكّر', size = 190 }) {
  const el = S.add(`<div class="countdown" style="left:${x - size / 2}px;top:${y - size / 2}px;width:${size}px;height:${size}px">${art.ring({ size })}<div class="n"></div><div class="lbl">${label}</div></div>`);
  const arc = el.querySelector('.arc');
  const n = el.querySelector('.n');
  S.show(el, start - 0.15, 'pop', 0.5);
  S.hide(el, start + len - 0.1, 'shrink', 0.4);
  S.every((t) => {
    const p = Math.min(1, Math.max(0, (t - start) / len));
    arc.style.strokeDashoffset = p.toFixed(3);
    const left = Math.max(1, Math.ceil(len - (t - start) - 1e-6));
    n.textContent = String(Math.min(Math.round(len), left));
    return n.textContent + arc.style.strokeDashoffset;
  });
  return el;
}

// The deck's "كلمة السر:" label with its gold chip.
export function password(S, text, at, style = '') {
  const el = S.add(`<div class="abs" style="${style}"><div class="password">${art.ic.key({ w: 44, color: '#8a5d00' })}كلمة السر: <b>${text}</b></div></div>`);
  S.show(el, at, 'pop', 0.6);
  return el;
}

// Fade in the soft gold marker behind a .hl span.
export function mark(S, el, at, dur = 0.5) {
  return S.anim(el, at, dur, { glow: [0, 1] });
}

// Light up dots of a dotGrid one after another.
export function lightDots(S, grid, idx, at, gap = 0.12) {
  idx.forEach((k, i) => {
    const g = grid.querySelector(`.g${k}`);
    g.removeAttribute('opacity');
    S.show(g, at + i * gap, 'pop', 0.35);
  });
}

export { art };
