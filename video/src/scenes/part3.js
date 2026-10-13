// Part 3: how to pick the sample (clips 13-17). The population of 1,000
// students is drawn as dots; the picked ones turn gold, as in the deck.
import { art, title, password, mark, lightDots } from '../kit.js';

const { ic, C } = art;

function rng(seed) {
  let s = seed;
  return () => ((s = (s * 9301 + 49297) % 233280) / 233280);
}

function pick(n, k, seed) {
  const r = rng(seed);
  const out = new Set();
  while (out.size < k) out.add(Math.floor(r() * n));
  return [...out];
}

export default {
  '13': (S) => {
    const t = (r) => S.t(r);
    const tA = title(S, 'طرق اختيار العينة العشوائية', { at: t(1.4), kicker: 'إزاي نختار العينة؟' });
    const names = [
      ['العشوائية البسيطة', 'Simple Random'],
      ['المنتظمة', 'Systematic'],
      ['الطبقية', 'Stratified'],
      ['العنقودية', 'Cluster'],
    ];
    const grid = S.add(`<div class="abs" style="right:130px;left:130px;top:270px;display:grid;grid-template-columns:1fr 1fr;gap:26px">
      ${names.map(([a, e], i) => `<div class="card row" style="gap:22px;padding:26px 34px"><span class="badge">${i + 1}</span>
        <div><div class="h3 b navy nm">${i === 0 ? a : '؟'}</div><div class="t3 muted">${i === 0 ? e : ''}</div></div>
        <div class="password" style="margin-right:auto;font-size:28px">${art.ic.key({ w: 36, color: C.goldInk })}<b style="font-size:28px">؟</b></div></div>`).join('')}
    </div>`);
    const cards = [...grid.children];
    // grid order is RTL: 1 2 / 3 4
    cards.forEach((c, i) => S.show(c, t(8.6) + i * 0.25, 'fadeUp', 0.5));
    cards.forEach((c) => S.show(c.querySelector('.password'), t(11.6), 'pop', 0.4));
    const nm0 = cards[0].querySelector('.nm');
    S.anim(nm0, 0, 0.01, { opacity: [0, 0] });
    S.show(nm0, t(22.9), 'pop', 0.5);
    S.anim(cards[0].querySelector('.muted'), 0, 0.01, { opacity: [0, 0] });
    S.show(cards[0].querySelector('.muted'), t(23.2), 'fade', 0.4);
    // the running example
    const ex = S.add(`<div class="abs row" style="right:130px;top:700px;gap:22px">${art.chipIcon(ic.school, { w: 100 })}
      <div class="t1 b">مثال: كلية فيها <span class="blue">1,000 طالب</span>… وعايزين نختار <span class="gold">40</span></div></div>`);
    S.show(ex, t(15.7), 'fadeUp', 0.6);
    // simple random sampling
    const bAt = t(24.0);
    [tA, grid, ex].forEach((el) => S.hide(el, bAt - 0.35, 'fade', 0.35));
    title(S, '1. العشوائية البسيطة', { at: bAt, kicker: 'الطريقة الأولى · Simple Random' });
    const pop = S.add(`<div class="abs card" style="left:130px;top:250px;padding:26px">
      <div class="t3 b muted" style="margin-bottom:12px">الكلية: 1,000 طالب</div>${art.dotGrid({ cols: 40, rows: 25, gap: 17, r: 5.2, base: C.blueLine })}</div>`);
    S.show(pop, bAt + 0.3, 'fadeUp', 0.6);
    const steps = S.add(`<div class="abs col" style="right:130px;width:760px;top:270px;gap:26px">
      <div class="row t2 b" style="gap:18px">${art.chipIcon(ic.paper, { w: 84 })}نكتب أسامي الألف طالب في ورق</div>
      <div class="row t2 b" style="gap:18px">${art.chipIcon(ic.bag, { w: 84 })}نحط الورق في كيس… ونسحب 40 ورقة</div>
      <div class="row t2" style="gap:18px">${art.chipIcon(ic.hash, { w: 84, bg: C.goldSoft, color: C.goldInk })}أو جداول الأعداد العشوائية… أو الكمبيوتر</div>
    </div>`);
    const st = [...steps.children];
    S.show(st[0], t(25.0), 'fadeLeft', 0.5);
    S.show(st[1], t(27.1), 'fadeLeft', 0.5);
    S.show(st[2], t(32.9), 'fadeLeft', 0.5);
    lightDots(S, pop, pick(1000, 40, 11), t(29.8), 0.06);
    const eq = S.add(`<div class="abs card blue" style="right:130px;width:760px;top:640px;padding:22px 30px"><div class="t2 b">المهم: كل طالب ليه <span class="hl">نفس الفرصة</span> إنه يطلع في العينة</div></div>`);
    S.show(eq, t(37.9), 'fadeUp', 0.6);
    mark(S, eq.querySelector('.hl'), t(39.6));
    password(S, 'فرصة متساوية', t(41.6), 'right:130px;top:830px');
  },

  '14': (S) => {
    const t = (r) => S.t(r);
    title(S, '2. المنتظمة', { at: t(1.3), kicker: 'الطريقة التانية · Systematic' });
    // the list 1..1000 drawn as rows of 25: every row is one step
    const rows = 16;
    const gridBox = S.add(`<div class="abs card" style="left:130px;top:250px;padding:24px 26px">
      <div class="row t3 b muted" style="justify-content:space-between;margin-bottom:10px"><span>كشف الأسامي: من 1 لـ 1000</span><span>كل صف = 25 اسم</span></div>
      <div style="position:relative">${art.dotGrid({ cols: 25, rows, gap: 30, r: 8, base: C.blueLine })}
        <div class="first" style="position:absolute;left:-8px;right:-8px;top:-8px;height:34px;border:3px dashed ${C.gold};border-radius:10px"></div>
        ${[7, 32, 57, 82].map((v, i) => `<div class="lbl num" style="position:absolute;left:752px;top:${i * 30 - 2}px;font-size:22px;color:${C.goldInk}">${v}</div>`).join('')}
      </div>
      <div class="tc t2 muted" style="margin-top:4px">⋮</div></div>`);
    S.show(gridBox, t(4.2), 'fadeUp', 0.6);
    // dot 7 of each row is column index 18 from the left (RTL count: 25 - 7)
    const col = 25 - 7;
    const first = gridBox.querySelector('.first');
    S.show(first, t(18.2), 'fade', 0.4);
    S.hide(first, t(36.6), 'fade', 0.4);
    const lbls = gridBox.querySelectorAll('.lbl');
    lightDots(S, gridBox, [col], t(28.3));
    S.show(lbls[0], t(28.4), 'fade', 0.3);
    lightDots(S, gridBox, [25 + col], t(37.3));
    S.show(lbls[1], t(37.4), 'fade', 0.3);
    lightDots(S, gridBox, [50 + col], t(40.6));
    S.show(lbls[2], t(40.7), 'fade', 0.3);
    S.show(lbls[3], t(43.9), 'fade', 0.3);
    lightDots(S, gridBox, Array.from({ length: rows - 3 }, (_, r) => (r + 3) * 25 + col), t(43.9), 0.12);
    const calc = S.add(`<div class="abs card col" style="right:130px;width:720px;top:270px;gap:10px;padding:26px 34px">
      <div class="t2 b">عايز 40 طالب من الألف:</div>
      <div class="h2 navy" style="direction:ltr;text-align:right"><span class="m">K</span> = 1000 ÷ 40 = <span class="gold">25</span></div>
      <div class="t2 muted">K = طول الخطوة</div></div>`);
    const cc = [...calc.children];
    S.show(calc, t(7.3), 'fadeUp', 0.6);
    S.anim(cc[1], 0, 0.01, { opacity: [0, 0] });
    S.show(cc[1], t(9.6), 'fadeUp', 0.5);
    S.show(cc[2], t(14.4), 'fade', 0.5);
    const start = S.add(`<div class="abs card gold" style="right:130px;width:720px;top:560px;padding:22px 30px"><div class="t2 b">أول اسم بالقرعة… من أول 25 اسم</div><div class="t2">نفترض طلع رقم <span class="num gold" style="font-size:44px">7</span></div></div>`);
    S.show(start, t(18.2), 'fadeUp', 0.6);
    S.anim(start.children[1], 0, 0.01, { opacity: [0, 0] });
    S.show(start.children[1], t(28.2), 'fade', 0.5);
    const seq = S.add(`<div class="abs" style="right:130px;width:720px;top:560px"><div class="card" style="padding:22px 30px"><div class="t2 b">بعدها نمشي بالخطوة (+25):</div>
      <div class="h3 num" style="direction:ltr;text-align:right;color:var(--gold-ink)">7 → 32 → 57 → 82 → …</div></div></div>`);
    S.hide(start, t(36.5), 'fade', 0.3);
    S.show(seq, t(36.8), 'fadeUp', 0.5);
    const rule = S.add(`<div class="abs card blue" style="right:130px;width:720px;top:810px;padding:18px 30px"><div class="t2 b">البداية بس عشوائية… والمسافات ثابتة ومتساوية</div></div>`);
    S.show(rule, t(47.1), 'fadeUp', 0.6);
    S.hide(rule, t(51.3), 'fade', 0.3);
    const law = S.add(`<div class="abs row" style="right:130px;top:820px;gap:30px">
      <div class="card blue h3 navy" style="padding:10px 30px;direction:ltr"><span class="m">K</span> = <span class="m">N</span> ÷ <span class="m">n</span></div>
      <div class="password">كلمة السر: <b>كل رقم K</b></div></div>`);
    S.show(law.children[0], t(51.6), 'pop', 0.6);
    S.show(law.children[1], t(54.0), 'pop', 0.5);
  },

  '15': (S) => {
    const t = (r) => S.t(r);
    title(S, '3. الطبقية', { at: t(0.6), kicker: 'الطريقة التالتة · Stratified' });
    const years = ['أولى', 'تانية', 'تالتة', 'رابعة'];
    const tints = ['#9cb7d4', '#6f93bb', '#46709f', '#1c4a78'];
    const cols = 30;
    const band = (i) => `<div class="band row" style="gap:18px;margin-bottom:14px"><div class="t2 b" style="width:110px">${years[i]}</div>
      <div class="bx" style="padding:10px 14px;border-radius:12px;border:2px solid transparent">${art.dotGrid({ cols, rows: 3, gap: 22, r: 7, base: tints[i] })}</div></div>`;
    const pop = S.add(`<div class="abs card" style="left:130px;top:250px;padding:24px 28px">${[0, 1, 2, 3].map(band).join('')}</div>`);
    S.show(pop, t(3.8), 'fadeUp', 0.6);
    const bands = [...pop.querySelectorAll('.band')];
    bands.forEach((b, i) => S.show(b.firstElementChild, t(4.1) + i * 0.45, 'fade', 0.4));
    const note = (top, html, cls = '') => S.add(`<div class="abs card ${cls}" style="right:130px;width:600px;top:${top}px;padding:22px 30px"><div class="t2 b">${html}</div></div>`);
    const diff = note(280, 'الطلبة مختلفين عن بعض… اللي في أولى غير اللي في رابعة خالص');
    S.show(diff, t(7.0), 'fadeUp', 0.5);
    // a plain random draw that happens to land mostly in first year
    const g0 = bands[0].querySelector('.dotgrid');
    const bad = [3, 8, 14, 19, 25, 33, 38, 41, 47, 52, 58, 61, 66, 72, 77, 85];
    lightDots(S, g0, bad, t(11.6), 0.08);
    const warn = note(480, 'قرعة عادية… ممكن معظم العينة تطلع من سنة أولى!', 'red');
    S.show(warn, t(12.6), 'fadeUp', 0.5);
    const nope = S.add(`<div class="abs row" style="right:130px;top:680px;gap:14px">${art.cross({ w: 64 })}<span class="t2 b red">كده العينة مش هتمثل الكلية</span></div>`);
    S.show(nope, t(15.7), 'fadeUp', 0.5);
    const fixAt = t(18.9);
    bad.forEach((k) => S.hide(g0.querySelector(`.g${k}`), fixAt - 0.3, 'fade', 0.3));
    [diff, warn, nope].forEach((el) => S.hide(el, fixAt - 0.3, 'fade', 0.3));
    // strata: each year boxed on its own, then a few from each
    bands.forEach((b, i) => {
      const bx = b.querySelector('.bx');
      S.anim(bx, fixAt + i * 0.2, 0.5, { glow: [0, 1] });
      bx.style.borderColor = 'rgba(28,74,120,calc(var(--glow,0)))';
    });
    const strata = note(280, 'نقسم الطلبة لمجموعات… كل سنة لوحدها<br><span class="key" style="font-size:36px;padding:4px 26px;margin-top:10px">المجموعات دي اسمها طبقات</span>', 'blue');
    S.show(strata, t(19.2), 'fadeUp', 0.5);
    S.anim(strata.querySelector('.key'), 0, 0.01, { opacity: [0, 0] });
    S.show(strata.querySelector('.key'), t(23.6), 'pop', 0.5);
    bands.forEach((b, i) => lightDots(S, b.querySelector('.dotgrid'), pick(90, 10, 31 + i), t(25.8) + i * 0.6, 0.05));
    const ok = S.add(`<div class="abs row" style="right:130px;top:560px;gap:14px">${art.check({ w: 64 })}<span class="t2 b green">شوية من كل طبقة… كل سنة ليها مكان</span></div>`);
    S.show(ok, t(29.6), 'fadeUp', 0.5);
    const when = note(680, 'بنستخدمها لما المجتمع يكون <span class="hl">مش متجانس</span>: فيه فئات مختلفة عن بعض');
    S.show(when, t(32.6), 'fadeUp', 0.5);
    mark(S, when.querySelector('.hl'), t(33.6));
    password(S, 'من كل طبقة', t(36.2), 'right:130px;top:880px');
  },

  '16': (S) => {
    const t = (r) => S.t(r);
    const tA = title(S, '4. العنقودية', { at: t(0.6), kicker: 'الطريقة الرابعة والأخيرة · Cluster' });
    const map = S.add(`<div class="abs" style="left:110px;top:240px;width:1000px;height:720px">
      <svg viewBox="0 0 1000 720" style="position:absolute;inset:0;overflow:visible"><path d="M140 80 Q330 10 520 60 Q700 20 860 110 Q980 220 930 380 Q990 560 820 640 Q620 720 430 660 Q230 710 120 590 Q20 450 70 300 Q40 170 140 80 Z" fill="${C.blueSoft}" stroke="${C.blueLine}" stroke-width="5" stroke-dasharray="16 12"/></svg>
    </div>`);
    S.show(map, t(3.4), 'fade', 0.6);
    const spots = [[190, 170], [400, 120], [620, 140], [800, 220], [250, 340], [470, 300], [700, 380], [140, 480], [380, 500], [600, 560], [820, 470], [300, 640]];
    const chosen = [1, 6, 8];
    const clusters = spots.map(([x, y], i) => {
      const el = S.add(`<div class="abs" style="left:${110 + x - 70}px;top:${240 + y - 56}px;width:140px;text-align:center">
        <div style="display:inline-block;padding:8px 10px;border-radius:14px;background:#fff;border:2px solid var(--line)" class="cl">${ic.school({ w: 34, color: C.blue })}${art.dotGrid({ cols: 4, rows: 2, gap: 22, r: 7, base: C.blueLine })}</div></div>`);
      S.show(el, t(6.2) + i * 0.12, 'pop', 0.4);
      return el;
    });
    const side = (top, html, cls = '') => S.add(`<div class="abs card ${cls}" style="right:130px;width:640px;top:${top}px;padding:22px 30px"><div class="t2 b">${html}</div></div>`);
    const s1 = side(260, 'طلاب الثانوي في مصر كلها… والمدارس متوزعة في كل حتة');
    S.show(s1, t(3.4), 'fadeUp', 0.5);
    const s2 = side(430, 'هتلف على مدرسة مدرسة؟ <span class="red">مستحيل!</span>');
    S.show(s2, t(11.3), 'fadeUp', 0.5);
    const s3 = side(600, 'كل مدرسة مجموعة… اسمها <span class="key" style="font-size:36px;padding:2px 24px">عنقود</span>', 'blue');
    S.show(s3, t(15.6), 'fadeUp', 0.5);
    S.anim(s3.querySelector('.key'), 0, 0.01, { opacity: [0, 0] });
    S.show(s3.querySelector('.key'), t(18.6), 'pop', 0.5);
    chosen.forEach((i, k) => {
      const cl = clusters[i].querySelector('.cl');
      S.anim(cl, t(19.6) + k * 0.5, 0.4, { scale: [1, 1.18] }, 'back');
      cl.style.borderColor = C.gold;
      lightDots(S, clusters[i], Array.from({ length: 8 }, (_, j) => j), t(21.9) + k * 0.3, 0.04);
    });
    clusters.forEach((el, i) => { if (!chosen.includes(i)) S.anim(el, t(21.6), 0.5, { opacity: [1, 0.35] }); });
    const s4 = side(770, 'بالقرعة كام مدرسة… وندرس <span class="hl">كل</span> الطلبة اللي فيها', 'gold');
    S.show(s4, t(19.8), 'fadeUp', 0.5);
    mark(S, s4.querySelector('.hl'), t(22.0));
    const geo = S.add(`<div class="abs row" style="left:130px;top:880px;gap:14px">${ic.map({ w: 56, color: C.blue })}<span class="t2 b">بنستخدمها لما المجتمع متوزع على مساحة جغرافية كبيرة</span></div>`);
    S.show(geo, t(27.4), 'fadeUp', 0.5);
    // the comparison students mix up
    const cAt = t(30.75);
    [tA, map, s1, s2, s3, s4, geo, ...clusters].forEach((el) => S.hide(el, cAt - 0.35, 'fade', 0.35));
    title(S, 'الطبقية ولا العنقودية؟', { at: cAt, kicker: 'أكتر حتة الطلبة بتتلخبط فيها' });
    const card = (right, cls, head, sub, body) => S.add(`<div class="abs card ${cls}" style="right:${right}px;top:270px;width:790px;height:560px;padding:28px 34px">
      <div class="h3 b ${cls}">${head}</div><div class="t2" style="margin:6px 0 20px">${sub}</div>${body}</div>`);
    const stratBody = [0, 1, 2].map((i) => `<div class="row" style="gap:14px;margin-bottom:12px"><span class="t3 b" style="width:96px">طبقة ${i + 1}</span>${art.dotGrid({ cols: 12, rows: 2, gap: 26, r: 8, base: C.blueLine, gold: [[2, 9, 15], [5, 13, 20], [1, 10, 18]][i] })}</div>`).join('');
    const clusBody = `<div style="display:grid;grid-template-columns:repeat(3,max-content);gap:18px">${[0, 1, 2, 3, 4, 5].map((i) => `<div style="padding:10px;border-radius:12px;border:2px solid ${[1, 4].includes(i) ? C.gold : C.line}">${art.dotGrid({ cols: 4, rows: 2, gap: 24, r: 8, base: C.blueLine, gold: [1, 4].includes(i) ? [0, 1, 2, 3, 4, 5, 6, 7] : [] })}</div>`).join('')}</div>`;
    const a = card(130, 'blue', 'الطبقية', 'بناخد <b>شوية من كل</b> مجموعة', stratBody);
    const b = card(1000, 'gold', 'العنقودية', 'بناخد <b>كام مجموعة كاملة</b> بكل اللي فيها', clusBody);
    S.show(a, t(34.95), 'fadeUp', 0.6);
    S.show(b, t(38.6), 'fadeUp', 0.6);
    password(S, 'العنقود كله', t(42.4), 'left:130px;top:880px');
  },

  '17': {
    bg: 'gold',
    build: (S) => {
      const t = (r) => S.t(r);
      const head = S.add(`<div class="abs row" style="right:130px;top:110px;gap:14px">${ic.warn({ w: 48, color: C.navy })}<span class="t2 b navy">خلي بالك</span></div>`);
      S.show(head, t(0.35), 'fadeDown', 0.5);
      const body = S.add(`<div class="abs col" style="right:130px;left:130px;top:220px;gap:30px">
        <div class="h2 navy">المعلمة تُحسب من المجتمع… <span class="u1">وغالبًا بتكون مجهولة.</span></div>
        <div class="h2 navy">الإحصاءة تُحسب من العينة… <span class="u2">ونستخدمها لتقدير المعلمة.</span></div>
        <div class="t1" style="color:var(--navy)">ودي الحكاية كلها: ناخد عينة… ونحكم على المجتمع كله.</div>
      </div>`);
      const [l1, l2, l3] = body.children;
      S.show(l1, t(0.9), 'fadeUp', 0.6);
      S.show(l1.querySelector('.u1'), t(3.7), 'fade', 0.5);
      S.show(l2, t(7.0), 'fadeUp', 0.6);
      S.show(l2.querySelector('.u2'), t(9.5), 'fade', 0.5);
      S.show(l3, t(15.7), 'fadeUp', 0.6);
      const trapAt = t(21.4);
      S.anim(body, trapAt - 0.4, 0.5, { opacity: [1, 0.25] });
      const trap = S.add(`<div class="abs card" style="right:130px;left:130px;top:640px;padding:26px 36px;background:#fffefb;border-color:var(--navy)">
        <div class="row" style="gap:20px"><span class="tag red">الفخ</span><span class="t1 b navy">لقيت كلمة «متوسط» في السؤال… تقول معلمة على طول؟</span>${art.cross({ w: 64 })}</div>
        <div class="row" style="gap:20px;margin-top:18px"><span class="tag navy">الصح</span><span class="t1 b navy">ارجع للسؤال: المتوسط ده اتحسب من مين؟</span></div>
        <div class="row" style="gap:30px;margin-top:16px;margin-right:120px"><span class="tag blue">من المجتمع ← معلمة</span><span class="tag gold">من العينة ← إحصاءة</span></div></div>`);
      const rows = [...trap.children];
      const crossEl = rows[0].lastElementChild;
      S.show(trap, trapAt, 'fadeUp', 0.6);
      S.show(crossEl, t(25.9), 'pop', 0.5);
      S.show(rows[1], t(28.4), 'fadeUp', 0.5);
      S.show(rows[2].children[0], t(31.8), 'pop', 0.5);
      S.show(rows[2].children[1], t(34.9), 'pop', 0.5);
    },
  },
};
