// Deterministic animation engine: every frame is a pure function of time, so
// the renderer can seek to any frame and screenshot it.

const EASE = {
  linear: (p) => p,
  out: (p) => 1 - Math.pow(1 - p, 3),
  in: (p) => p * p * p,
  inOut: (p) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2),
  back: (p) => {
    const c = 1.7;
    return 1 + (c + 1) * Math.pow(p - 1, 3) + c * Math.pow(p - 1, 2);
  },
  elastic: (p) =>
    p === 0 || p === 1 ? p : Math.pow(2, -10 * p) * Math.sin((p * 10 - 0.75) * ((2 * Math.PI) / 3)) + 1,
};

const DEFAULTS = { opacity: 1, x: 0, y: 0, scale: 1, sx: 1, sy: 1, rot: 0, blur: 0, dash: 1, clip: 1, clipL: 1, glow: 0 };

const PRESETS = {
  fade: { opacity: [0, 1] },
  fadeUp: { opacity: [0, 1], y: [40, 0] },
  fadeDown: { opacity: [0, 1], y: [-40, 0] },
  fadeLeft: { opacity: [0, 1], x: [60, 0] },
  fadeRight: { opacity: [0, 1], x: [-60, 0] },
  pop: { opacity: [0, 1], scale: [0.4, 1], ease: 'back' },
  zoom: { opacity: [0, 1], scale: [1.25, 1] },
  drop: { opacity: [0, 1], y: [-160, 0], ease: 'back' },
  rise: { opacity: [0, 1], y: [160, 0], ease: 'back' },
  draw: { dash: [0, 1], ease: 'inOut' },
  wipe: { clip: [0, 1], ease: 'inOut' },
  wipeL: { clipL: [0, 1], ease: 'inOut' },
  blur: { opacity: [0, 1], blur: [16, 0] },
};

const HIDE = {
  fade: { opacity: [1, 0] },
  fadeUp: { opacity: [1, 0], y: [0, -40] },
  fadeDown: { opacity: [1, 0], y: [0, 40] },
  shrink: { opacity: [1, 0], scale: [1, 0.6], ease: 'in' },
  blur: { opacity: [1, 0], blur: [0, 16] },
};

export class Scene {
  constructor(root, info) {
    this.root = root;
    this.info = info;
    this.duration = info.duration;
    this.tracks = new Map();
    this.updaters = [];
  }

  // Map a time in the raw recording to the edited audio's timeline.
  t(raw) {
    let out = raw - (this.info.trim_start || 0);
    for (const [at, delta] of this.info.shifts || []) {
      if (delta >= 0) {
        if (raw > at) out += delta;
      } else if (raw >= at - delta / 2) {
        out += delta;
      } else if (raw > at + delta / 2) {
        out -= raw - (at + delta / 2); // inside the removed part of a pause
      }
    }
    return Math.max(0, out);
  }

  // A pause from edits.json, mapped: {start, end} in output time.
  pause(i) {
    const p = this.info.pauses[i];
    const start = this.t(p.start);
    return { start, end: start + p.len };
  }

  add(html, style = {}, parent = this.root) {
    const tpl = document.createElement('template');
    tpl.innerHTML = html.trim();
    const el = tpl.content.firstElementChild;
    Object.assign(el.style, typeof style === 'string' ? {} : style);
    if (typeof style === 'string') el.setAttribute('style', style);
    parent.appendChild(el);
    return el;
  }

  q(el, sel) {
    return el.querySelector(sel);
  }

  anim(el, at, dur, props, ease = 'out') {
    if (!el) throw new Error('anim: missing element');
    if (!this.tracks.has(el)) {
      this.tracks.set(el, {});
      const tag = el.tagName.toLowerCase();
      if (tag === 'path' || tag === 'line' || tag === 'polyline' || tag === 'circle' || tag === 'rect' || tag === 'ellipse') {
        if (!el.getAttribute('pathLength')) el.setAttribute('pathLength', '1');
      }
    }
    const track = this.tracks.get(el);
    const e = props.ease || ease;
    for (const [k, v] of Object.entries(props)) {
      if (k === 'ease') continue;
      (track[k] ||= []).push({ at, dur, from: v[0], to: v[1], ease: EASE[e] || EASE.out });
      track[k].sort((a, b) => a.at - b.at);
    }
    return el;
  }

  show(el, at, kind = 'fadeUp', dur = 0.6) {
    const p = typeof kind === 'string' ? PRESETS[kind] : kind;
    return this.anim(el, at, dur, p);
  }

  hide(el, at, kind = 'fade', dur = 0.4) {
    const p = typeof kind === 'string' ? HIDE[kind] : kind;
    return this.anim(el, at, dur, p);
  }

  // Show several elements one after another.
  stagger(els, at, gap, kind = 'fadeUp', dur = 0.6) {
    els.forEach((el, i) => this.show(el, at + i * gap, kind, dur));
  }

  every(fn) {
    this.updaters.push(fn);
  }

  // Count a number up inside an element.
  count(el, at, dur, from, to, fmt = (v) => Math.round(v).toLocaleString('en-US')) {
    this.every((t) => {
      const p = Math.min(1, Math.max(0, (t - at) / dur));
      el.textContent = fmt(from + (to - from) * EASE.out(p));
      return el.textContent;
    });
  }

  value(list, t) {
    let cur = null;
    for (const tw of list) {
      if (t < tw.at) break;
      cur = tw;
    }
    if (!cur) return list[0].from;
    const p = cur.dur <= 0 ? 1 : Math.min(1, (t - cur.at) / cur.dur);
    return cur.from + (cur.to - cur.from) * cur.ease(p);
  }

  // Apply the state at time t; returns a signature that only changes when
  // the frame changes, so the renderer can skip identical frames.
  seek(t) {
    const sig = [];
    for (const [el, track] of this.tracks) {
      const v = { ...DEFAULTS };
      for (const k of Object.keys(track)) v[k] = this.value(track[k], t);
      const style = el.style;
      style.opacity = v.opacity.toFixed(4);
      const tr = [];
      if (v.x || v.y) tr.push(`translate(${v.x.toFixed(2)}px, ${v.y.toFixed(2)}px)`);
      if (v.scale !== 1) tr.push(`scale(${v.scale.toFixed(4)})`);
      if (v.sx !== 1 || v.sy !== 1) tr.push(`scale(${v.sx.toFixed(4)}, ${v.sy.toFixed(4)})`);
      if (v.rot) tr.push(`rotate(${v.rot.toFixed(2)}deg)`);
      if (track.x || track.y || track.scale || track.rot || track.sx || track.sy) style.transform = tr.join(' ');
      if (track.blur) style.filter = v.blur > 0.05 ? `blur(${v.blur.toFixed(2)}px)` : 'none';
      if (track.dash) {
        style.strokeDasharray = '1';
        style.strokeDashoffset = (1 - v.dash).toFixed(4);
      }
      if (track.clip) style.clipPath = `inset(-20% -20% -20% ${((1 - v.clip) * 100).toFixed(2)}%)`;
      if (track.clipL) style.clipPath = `inset(-20% ${((1 - v.clipL) * 100).toFixed(2)}% -20% -20%)`;
      if (track.glow) style.setProperty('--glow', v.glow.toFixed(3));
      style.visibility = v.opacity < 0.002 ? 'hidden' : 'visible';
      sig.push(style.opacity, style.transform, style.filter, style.strokeDashoffset, style.clipPath, track.glow ? v.glow.toFixed(3) : '');
    }
    for (const fn of this.updaters) {
      const r = fn(t);
      sig.push(r === undefined ? t : r);
    }
    return sig.join('|');
  }
}

export { EASE };
