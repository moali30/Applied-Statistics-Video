// Section slides between the parts, like the deck's navy "1 / مراجعة سريعة"
// slides: a dot grid on the left, a big gold number and the part title.
import { art, PARTS } from '../kit.js';

const divider = (i) => ({
  bg: 'navy',
  duration: 3.2,
  build: (S) => {
    const p = PARTS[i];
    const grid = S.add(`<div class="abs" style="left:190px;top:250px">${art.deckDots({ gold: [[10, 21, 30, 44, 53, 58], [2, 13, 27, 36, 49, 61], [6, 17, 24, 40, 47, 59], [9, 22, 35, 42, 51, 62], [4, 19, 28, 38, 45, 57]][i % 5] })}</div>`);
    const golds = [...grid.querySelectorAll('.g')].filter((g) => !g.hasAttribute('opacity'));
    S.show(grid, 0.1, 'fade', 0.6);
    golds.forEach((g, k) => S.show(g, 0.4 + k * 0.12, 'pop', 0.4));
    const txt = S.add(`<div class="abs" style="right:130px;top:330px;text-align:right">
      <div class="num" style="font-size:190px;line-height:1;color:var(--gold)">${i + 1}</div>
      <div class="h1" style="margin-top:20px">${p.title}</div>
      <div class="t2 muted" style="margin-top:10px">${p.sub}</div></div>`);
    const [n, h, sub] = txt.children;
    S.show(n, 0.2, 'fadeDown', 0.6);
    S.show(h, 0.5, 'fadeUp', 0.6);
    S.show(sub, 0.8, 'fadeUp', 0.6);
  },
});

export default Object.fromEntries([1, 2, 3, 4, 5].map((i) => [`p${i + 1}`, divider(i)]));
