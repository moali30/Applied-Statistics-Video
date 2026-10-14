// Part 6: wrap-up (clips 38-39), like the deck's closing navy slide.
import { art, title } from '../kit.js';

const { C } = art;
const m = (x) => `<span class="m">${x}</span>`;

export default {
  '38': {
    bg: 'navy',
    build: (S) => {
      const t = (r) => S.t(r);
      title(S, '3 حاجات تخرج بيها النهارده', { at: t(0.55), kicker: 'خلاصة السكشن' });
      const card = (n, head, body) => `<div class="card" style="flex:1;min-height:600px;padding:34px 36px;display:flex;flex-direction:column;gap:22px">
        <div class="row" style="gap:16px;align-items:flex-start"><span class="badge">${n}</span><span class="h3 b">${head}</span></div>${body}</div>`;
      const row = S.add(`<div class="abs row" style="right:130px;left:130px;top:280px;gap:30px;align-items:stretch">
        ${card(1, 'الحلة والمعلقة', `<div class="t2">المجتمع هو الكل… والعينة جزء صغير بناخده منه.</div>
          <div class="t2 r1b"><span class="gold b">بس نقلّب الأول:</span> نختار عشوائي عشان العينة تمثّل المجتمع.</div>`)}
        ${card(2, 'ميم مع ميم', `<div class="t2 nowrap"><span class="b">معلمة</span> ← مجتمع</div><div class="t2 nowrap" style="margin-top:-14px"><span class="b gold">إحصاءة</span> ← عينة</div>
          <div class="t2 r2b">اتلخبطت؟ اسأل نفسك: <span class="gold b">اتحسب من مين؟</span></div>
          <div class="h3 r2c" style="direction:ltr;text-align:right;color:#cfe0f2">${m('N μ σ P')} &nbsp; <span style="color:${C.gold}">${m('n <span class="bar">x</span> s <span class="hat">p</span>')}</span></div>`)}
        ${card(3, 'طرق الاختيار', `<div class="col" style="gap:8px">
          ${[['فرصة متساوية', 'بسيطة'], ['كل رقم K', 'منتظمة'], ['من كل طبقة', 'طبقية'], ['العنقود كله', 'عنقودية']].map(([k, w]) => `<div class="row t2 kw" style="gap:12px"><span class="tag gold" style="font-size:28px;padding:2px 16px">${k}</span><span>← ${w}</span></div>`).join('')}</div>`)}
      </div>`);
      const cards = [...row.children];
      S.show(cards[0], t(6.6), 'fadeUp', 0.6);
      S.show(cards[0].querySelector('.r1b'), t(10.2), 'fade', 0.5);
      S.show(cards[1], t(16.5), 'fadeUp', 0.6);
      S.show(cards[1].querySelector('.r2b'), t(21.3), 'fade', 0.5);
      S.show(cards[1].querySelector('.r2c'), t(24.0), 'fade', 0.5);
      S.show(cards[2], t(32.8), 'fadeUp', 0.6);
      [...cards[2].querySelectorAll('.kw')].forEach((k, i) => S.show(k, t(40.6) + i * 0.95, 'fadeLeft', 0.4));
    },
  },

  '39': {
    bg: 'navy',
    build: (S) => {
      const t = (r) => S.t(r);
      const grid = S.add(`<div class="abs" style="left:190px;top:250px">${art.deckDots({ gold: [3, 12, 26, 33, 45, 54, 60] })}</div>`);
      S.show(grid, 0.1, 'fade', 0.6);
      [...grid.querySelectorAll('.g')].filter((g) => !g.hasAttribute('opacity')).forEach((g, k) => S.show(g, 0.4 + k * 0.15, 'pop', 0.4));
      const txt = S.add(`<div class="abs" style="right:130px;top:300px;text-align:right">
        <div class="t1">أي حاجة مش واضحة… اسألوني في السكشن</div>
        <div class="num" style="font-size:150px;line-height:1.3;color:var(--gold);font-weight:800">شكرًا لكم</div>
        <div class="t1 muted">وأشوفكم السكشن الجاي إن شاء الله</div></div>`);
      const [a, b, c] = txt.children;
      S.show(a, t(0.5), 'fadeUp', 0.6);
      S.show(b, t(2.7), 'zoom', 0.7);
      S.show(c, t(3.6), 'fadeUp', 0.6);
    },
  },
};
