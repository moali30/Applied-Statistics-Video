// Part 4: worked examples (clips 18-21), laid out like the deck's
// "مثال محلول" slides: the question on the right, the answer on the left.
import { art, title, countdown, mark } from '../kit.js';

const { ic, C } = art;
const m = (x) => `<span class="m">${x}</span>`;
const xbar = '<span class="bar">x</span>';

// Question card with the ten numbers.
function question(S, { text, nums, ask, at }) {
  const el = S.add(`<div class="abs card gold" style="right:130px;top:250px;width:800px;padding:28px 34px">
    <div class="t2 qt" style="line-height:1.7">${text}</div>
    <div class="nums" style="display:grid;grid-template-columns:repeat(5,1fr);gap:12px;margin:20px 0;direction:ltr">
      ${nums.map((n) => `<div class="tc num" style="background:#fff;border:2px solid var(--gold-line);border-radius:10px;font-size:38px;padding:6px 0">${n}</div>`).join('')}</div>
    <div class="t2 b ask">${ask}</div></div>`);
  S.show(el, at, 'fadeUp', 0.6);
  return { el, nums: [...el.querySelectorAll('.nums > div')], ask: el.querySelector('.ask') };
}

// The four answer rows on the left.
function answers(S, rows, top = 250) {
  const el = S.add(`<div class="abs col" style="left:130px;width:820px;top:${top}px;gap:16px">
    ${rows.map((r) => `<div class="card row" style="padding:16px 22px;gap:20px">
      <span class="tag ${r.cls}" style="min-width:150px;justify-content:center">${r.name}</span>
      <div class="col" style="gap:0;flex:1"><div class="h3 val" style="direction:ltr;text-align:right;line-height:1.3">${r.val}</div><div class="t3 muted desc">${r.desc}</div></div>
      ${r.status ? `<span class="tag ${r.status[0]} st">${r.status[1]}</span>` : ''}</div>`).join('')}</div>`);
  const cards = [...el.children];
  rows.forEach((r, i) => {
    const c = cards[i];
    S.show(c, r.at, 'fadeLeft', 0.5);
    S.show(c.querySelector('.desc'), r.atD ?? r.at + 0.3, 'fade', 0.4);
    S.show(c.querySelector('.val'), r.atV ?? r.at + 0.3, 'fadeUp', 0.5);
    if (r.status) S.show(c.querySelector('.st'), r.atS, 'pop', 0.5);
  });
  return el;
}

// Sum the numbers, then divide: x̄ = total / 10.
function calc(S, { total, n, result, unit, atSum, atTotal, atDiv, atRes, top = 800 }) {
  const el = S.add(`<div class="abs card blue" style="left:130px;width:820px;top:${top}px;padding:22px 30px">
    <div class="t3 b muted">المتوسط = مجموع الأرقام ÷ عددهم</div>
    <div class="h2 navy row" style="direction:ltr;justify-content:flex-end;gap:18px;line-height:1.3">
      ${m(xbar)} <span>=</span> <span class="num tot">0</span> <span class="dv">÷ ${n}</span> <span class="res">= <span class="gold">${result}</span> <span class="t2 b gold" style="direction:rtl">${unit}</span></span></div></div>`);
  S.show(el, atSum, 'fadeUp', 0.5);
  const tot = el.querySelector('.tot');
  S.count(tot, atSum + 0.3, Math.max(0.6, atTotal - atSum - 0.3), 0, total);
  S.show(el.querySelector('.dv'), atDiv, 'fade', 0.4);
  S.show(el.querySelector('.res'), atRes, 'pop', 0.5);
  return el;
}

export default {
  '18': (S) => {
    const t = (r) => S.t(r);
    title(S, 'متوسط زمن انتقال الطلاب', { at: 0.2, kicker: 'مثال محلول 1 · من أسئلة الفصل' });
    const nums = [30, 25, 40, 30, 25, 20, 35, 30, 25, 20];
    const q = question(S, {
      text: 'عايزين نعرف متوسط الوقت اللي بياخده طلاب كلية في المواصلات لحد الكلية. الكلية فيها <span class="hl b">1,000 طالب</span>، واخترنا <span class="hl b">10 طلاب</span> بس وسألناهم (بالدقايق):',
      nums,
      ask: 'المطلوب: حدد المجتمع، والعينة، والمعلمة، والإحصاءة.',
      at: t(2.9),
    });
    const hls = q.el.querySelectorAll('.hl');
    mark(S, hls[0], t(7.4));
    mark(S, hls[1], t(15.2));
    q.nums.forEach((n, i) => S.show(n, t(i < 5 ? 26.0 + i * 0.8 : 30.3 + (i - 5) * 0.55), 'pop', 0.35));
    S.show(q.ask, t(33.6), 'fadeUp', 0.5);
    const bus = S.add(`<div class="abs" style="left:300px;top:300px">${art.chipIcon(ic.bus, { w: 300 })}</div>`);
    S.show(bus, t(3.0), 'zoom', 0.6);
    S.hide(bus, t(33.3), 'fade', 0.3);
    const asks = S.add(`<div class="abs col" style="left:130px;width:820px;top:270px;gap:16px">
      ${[['المجتمع', 'blue'], ['العينة', 'gold'], ['المعلمة', 'blue'], ['الإحصاءة', 'gold']].map(([n, c]) => `<div class="card row" style="padding:16px 22px;gap:20px"><span class="tag ${c}" style="min-width:150px;justify-content:center">${n}</span><span class="h3 muted">؟</span></div>`).join('')}</div>`);
    [34.6, 36.4, 37.3, 38.2].forEach((r, i) => S.show(asks.children[i], t(r), 'fadeLeft', 0.4));
    countdown(S, { start: S.duration - 5.1, len: 4.6, x: 540, y: 880, label: 'جرّب لوحدك', size: 150 });
  },

  '19': (S) => {
    const t = (r) => S.t(r);
    title(S, 'متوسط زمن انتقال الطلاب', { at: 0.1, kicker: 'مثال محلول 1 · الحل' });
    const q = question(S, {
      text: 'الكلية فيها 1,000 طالب، واخترنا 10 طلاب وسألناهم عن وقت المواصلات (بالدقايق):',
      nums: [30, 25, 40, 30, 25, 20, 35, 30, 25, 20],
      ask: '',
      at: 0.2,
    });
    answers(S, [
      { name: 'المجتمع', cls: 'blue', val: `${m('N')} = 1,000`, desc: 'كل طلاب الكلية', at: t(0.7), atD: t(4.8), atV: t(8.5) },
      { name: 'العينة', cls: 'gold', val: `${m('n')} = 10`, desc: 'العشر طلاب اللي سألناهم', at: t(11.9), atD: t(12.6), atV: t(14.6) },
      { name: 'المعلمة', cls: 'blue', val: `${m('μ')} = ${m('ΣX')} / ${m('N')}`, desc: 'متوسط وقت الألف طالب كلهم', at: t(17.2), atD: t(18.2), atV: t(21.3), status: ['red', 'مجهولة'], atS: t(36.8) },
      { name: 'الإحصاءة', cls: 'gold', val: `${m(xbar)} = ${m('Σx')} / ${m('n')}`, desc: 'متوسط وقت العشر طلاب بس', at: t(38.7), atD: t(39.6), atV: t(42.6), status: ['green', 'معلومة'], atS: t(45.6) },
    ], 250);
    const why = S.add(`<div class="abs card red" style="left:130px;width:820px;top:666px;padding:16px 22px"><div class="t2">مجهولة… لأننا مسألناش الألف طالب، سألنا العشرة بس</div></div>`);
    S.show(why, t(24.3), 'fadeUp', 0.5);
    S.hide(why, t(38.3), 'fade', 0.3);
    // add the numbers up
    q.nums.forEach((n, i) => S.anim(n, t(63.1) + i * 0.18, 0.3, { scale: [1, 1.15] }, 'out'));
    q.nums.forEach((n, i) => S.anim(n, t(63.4) + i * 0.18, 0.3, { scale: [1.15, 1] }, 'out'));
    calc(S, { total: 280, n: 10, result: 28, unit: 'دقيقة', atSum: t(53.3), atTotal: t(66.3), atDiv: t(67.6), atRes: t(69.6) });
    const est = S.add(`<div class="abs card navy" style="right:130px;width:800px;top:700px;padding:22px 30px">
      <div class="t2 b" style="color:#fff">متوسط العينة <span class="m" style="color:var(--gold)">${xbar} = 28</span> دقيقة…</div>
      <div class="t2" style="color:#cfe0f2">بنستخدمه عشان <span class="b" style="color:#fff">نقدّر</span> متوسط الكلية كلها <span class="m">μ</span></div></div>`);
    S.show(est, t(77.0), 'fadeUp', 0.6);
    S.anim(est.children[1], 0, 0.01, { opacity: [0, 0] });
    S.show(est.children[1], t(83.1), 'fade', 0.5);
    const from = S.add(`<div class="abs row" style="right:130px;top:880px;gap:12px">${ic.bulb({ w: 44 })}<span class="t2 b">قدّرنا المجتمع… من خلال العينة</span></div>`);
    S.show(from, t(102.2), 'fadeUp', 0.5);
  },

  '20': (S) => {
    const t = (r) => S.t(r);
    title(S, 'متوسط المبيعات اليومية للمحلات', { at: t(0.8), kicker: 'مثال محلول 2 · عليك إنت' });
    const q = question(S, {
      text: 'مدينة فيها <span class="hl b">800 محل</span>، وعايزين نعرف متوسط المبيعات اليومية لكل المحلات. اخترنا <span class="hl b">10 محلات</span> بس، وكانت مبيعاتهم (بالوحدات):',
      nums: [20, 35, 20, 30, 25, 20, 15, 30, 25, 20],
      ask: 'المطلوب: حدد المجتمع والعينة والمعلمة والإحصاءة… واحسب متوسط العينة.',
      at: t(1.0),
    });
    const hls = q.el.querySelectorAll('.hl');
    mark(S, hls[0], t(3.3));
    mark(S, hls[1], t(14.6));
    q.nums.forEach((n, i) => S.show(n, t(i < 5 ? 18.7 + i * 0.75 : 23.0 + (i - 5) * 0.55), 'pop', 0.35));
    S.show(q.ask, t(26.3), 'fadeUp', 0.5);
    const shop = S.add(`<div class="abs" style="left:300px;top:300px">${art.chipIcon(ic.store, { w: 300 })}</div>`);
    S.show(shop, t(1.2), 'zoom', 0.6);
    const tryIt = S.add(`<div class="abs card blue tc" style="left:130px;width:820px;top:700px;padding:22px 30px"><div class="t2 b">وقّف الفيديو… وحل لوحدك</div><div class="t3 muted">وبعدين شغّله تاني وشوف إنت صح ولا لأ</div></div>`);
    S.show(tryIt, t(34.1), 'fadeUp', 0.5);
    const p = S.pause(0);
    countdown(S, { start: p.start, len: p.end - p.start, x: 540, y: 520, label: 'جرّب لوحدك', size: 170 });
    const solAt = t(50.5);
    [shop, tryIt].forEach((el) => S.hide(el, p.start - 0.3, 'fade', 0.3));
    answers(S, [
      { name: 'المجتمع', cls: 'blue', val: `${m('N')} = 800`, desc: 'كل محلات المدينة', at: solAt + 0.1, atD: t(51.5), atV: t(55.0) },
      { name: 'العينة', cls: 'gold', val: `${m('n')} = 10`, desc: 'العشر محلات اللي اخترناهم', at: t(58.3), atD: t(59.0), atV: t(59.8) },
      { name: 'المعلمة', cls: 'blue', val: `${m('μ')} = ${m('ΣX')} / ${m('N')}`, desc: 'متوسط مبيعات الـ 800 محل', at: t(62.4), atD: t(63.2), atV: t(64.4), status: ['red', 'مجهولة'], atS: t(68.0) },
      { name: 'الإحصاءة', cls: 'gold', val: `${m(xbar)} = ${m('Σx')} / ${m('n')}`, desc: 'متوسط مبيعات العشر محلات', at: t(69.5), atD: t(70.3), atV: t(71.2), status: ['green', 'معلومة'], atS: t(73.6) },
    ], 250);
    calc(S, { total: 240, n: 10, result: 24, unit: 'وحدة', atSum: t(78.3), atTotal: t(84.2), atDiv: t(85.5), atRes: t(86.6) });
    S.hide(q.el, t(90.4), 'fade', 0.35);
    const praise = S.add(`<div class="abs card green col" style="right:130px;width:800px;top:330px;padding:40px;gap:20px;align-items:center;text-align:center">${art.chipIcon(ic.thumb, { w: 160, bg: '#fff', color: C.green })}<div class="h3 b">طلعت معاك 24 وحدة؟</div><div class="t1">يبقى إنت كده شاطر… وفاهم</div></div>`);
    S.show(praise, t(90.8), 'fadeUp', 0.6);
  },

  '21': (S) => {
    const t = (r) => S.t(r);
    title(S, '16 سؤال اختيار من متعدد', { at: t(0.9), kicker: 'دلوقتي بقى… الجزء الحلو' });
    const sub = S.add(`<div class="abs t1" style="right:130px;top:250px">من أسئلة الفصل… زي اللي هتشوفوه في الامتحان بالظبط</div>`);
    S.show(sub, t(6.0), 'fadeUp', 0.5);
    const steps = ['هقرا السؤال والاختيارات', 'يظهرلك عداد… وقّف الفيديو', 'حل لوحدك', 'كمّل… وشوف الإجابة'];
    const row = S.add(`<div class="abs row" style="right:130px;left:130px;top:400px;justify-content:space-between;gap:16px">
      ${steps.map((s, i) => `<div class="card row" style="gap:16px;padding:20px 24px"><span class="badge">${i + 1}</span><span class="t2 b nowrap">${s}</span></div>${i < 3 ? `<div>${art.arrow({ w: 50 })}</div>` : ''}`).join('')}</div>`);
    const items = [...row.children];
    [9.8, 11.4, 12.9, 14.2].forEach((r, i) => {
      S.show(items[i * 2], t(r), 'fadeUp', 0.5);
      if (i) S.show(items[i * 2 - 1], t(r) - 0.2, 'fade', 0.3);
    });
    const two = S.add(`<div class="abs row" style="right:130px;left:130px;top:620px;gap:30px;align-items:stretch">
      <div class="t1 b" style="align-self:center">وافتكر حاجتين بس:</div>
      <div class="card blue" style="flex:1;padding:24px 30px"><div class="h3 b blue">اتحسب من مين؟</div><div class="t2">من المجتمع ولا من العينة؟</div></div>
      <div class="card gold" style="flex:1;padding:24px 30px"><div class="h3 b gold">كلمة السر</div><div class="t2">بتقولك أنهي طريقة في اختيار العينة</div></div></div>`);
    const tw = [...two.children];
    S.show(tw[0], t(14.8), 'fadeUp', 0.5);
    S.show(tw[1], t(16.9), 'fadeLeft', 0.5);
    S.show(tw[2], t(22.3), 'fadeLeft', 0.5);
  },
};
