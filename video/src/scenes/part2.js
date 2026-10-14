// Part 2: naming things (clips 07-12).
import { art, title, mark } from '../kit.js';

const { ic, C } = art;
const m = (x) => `<span class="m">${x}</span>`;

// One row of the deck's "kitchen -> statistics" table.
function mapRow(S, { top, kitchen, kIcon, term, en, def, cls, atK, atT, atD, extra = '' }) {
  const row = S.add(`<div class="abs row" style="right:130px;left:130px;top:${top}px;gap:26px;align-items:stretch">
    <div class="card row" style="width:560px;padding:22px 30px;gap:20px">${kIcon}<div class="t2 b">${kitchen}</div></div>
    <div style="display:grid;place-items:center">${art.arrow({ w: 80 })}</div>
    <div class="card ${cls}" style="flex:1;padding:20px 34px;position:relative">
      <div class="h3 ${cls}" style="font-weight:800;white-space:nowrap;line-height:1.35">${term} <span class="t3 muted" style="font-weight:600">(${en})</span></div>
      <div class="t2 def">${def}</div>${extra}
    </div></div>`);
  const [k, a, card] = row.children;
  S.show(k, atK, 'fadeLeft', 0.5);
  S.show(a, atT - 0.25, 'fadeLeft', 0.4);
  S.show(card, atT, 'fadeLeft', 0.5);
  S.show(card.querySelector('.def'), atD, 'fade', 0.5);
  return row;
}

const potIcon = (w = 84) => art.potTop({ w });
const spoonIcon = (w = 84) => art.spoon({ w });

export default {
  '07': (S) => {
    const t = (r) => S.t(r);
    title(S, 'الحلة والمعلقة… هما المجتمع والعينة', { at: t(1.0), kicker: 'نسمي الحاجات بأساميها' });
    const heads = S.add(`<div class="abs row t3 b muted" style="right:150px;left:130px;top:240px;gap:0"><div style="width:586px">في المطبخ</div><div style="margin-right:80px">في الإحصاء</div></div>`);
    S.show(heads, t(1.4), 'fade', 0.5);
    mapRow(S, { top: 296, kitchen: 'الحلة كلها', kIcon: potIcon(), term: 'المجتمع', en: 'Population', def: 'كل العناصر اللي عايزين ندرسها', cls: 'blue', atK: t(4.4), atT: t(5.5), atD: t(7.1) });
    mapRow(S, { top: 496, kitchen: 'المعلقة اللي دوقناها', kIcon: spoonIcon(), term: 'العينة', en: 'Sample', def: 'جزء من المجتمع بنختاره عشان ندرسه', cls: 'gold', atK: t(14.3), atT: t(15.5), atD: t(17.2) });
    // A: elements need not be people
    const kinds = S.add(`<div class="abs row" style="right:130px;top:720px;gap:34px">
      <div class="t2 b">ومش لازم يكونوا ناس:</div>
      ${[[ic.users, 'ناس'], [ic.store, 'محلات'], [ic.home, 'بيوت'], [ic.gear, 'أي حاجة']].map(([f, s]) => `<div class="col" style="align-items:center;gap:8px">${art.chipIcon(f, { w: 110 })}<div class="t3 b">${s}</div></div>`).join('')}
    </div>`);
    const kc = [...kinds.children];
    S.show(kc[0], t(9.8), 'fadeUp', 0.5);
    [9.9, 11.6, 12.5, 13.3].forEach((r, i) => S.show(kc[i + 1], t(r), 'pop', 0.5));
    S.hide(kinds, t(20.0), 'fade', 0.35);
    // B: the company example
    const ex = S.add(`<div class="abs row" style="right:130px;left:130px;top:700px;gap:30px">
      <div class="card row" style="gap:24px;padding:22px 30px">${art.chipIcon(ic.building, { w: 120 })}<div class="t2 b">مثال: شركة فيها موظفين كتير…<br><span class="muted" style="font-weight:500">سألنا 50 منهم عن رضاهم عن الشغل</span></div></div>
      <div class="col" style="gap:16px"><div class="tag blue">كل موظفين الشركة = المجتمع</div><div class="tag gold">الـ 50 موظف = العينة</div></div>
    </div>`);
    const [exCard, exTags] = ex.children;
    S.show(exCard, t(20.3), 'fadeUp', 0.6);
    S.show(exTags.children[0], t(26.7), 'pop', 0.5);
    S.show(exTags.children[1], t(28.6), 'pop', 0.5);
    S.hide(ex, t(30.2), 'fade', 0.35);
    // C: colour rule for the rest of the video
    const legend = S.add(`<div class="abs row" style="left:0;right:0;top:740px;justify-content:center;gap:60px">
      <div class="t2 b">خدوا بالكم من الألوان:</div>
      <div class="tag blue" style="font-size:40px">الأزرق دايمًا للمجتمع</div>
      <div class="tag gold" style="font-size:40px">والدهبي للعينة</div></div>`);
    const lg = [...legend.children];
    S.show(lg[0], t(30.4), 'fadeUp', 0.5);
    S.show(lg[1], t(31.9), 'pop', 0.5);
    S.show(lg[2], t(33.0), 'pop', 0.5);
  },

  '08': (S) => {
    const t = (r) => S.t(r);
    const tA = title(S, 'المعلمة والإحصاءة', { at: t(0.9), kicker: 'طب والملوحة نفسها؟' });
    const heads = S.add(`<div class="abs row t3 b muted" style="right:150px;left:130px;top:240px;gap:0"><div style="width:586px">في المطبخ</div><div style="margin-right:80px">في الإحصاء</div></div>`);
    S.show(heads, t(1.0), 'fade', 0.5);
    const r1 = mapRow(S, { top: 296, kitchen: 'ملوحة الحلة كلها', kIcon: potIcon(), term: 'المعلمة', en: 'Parameter', def: 'أي رقم بنحسبه من المجتمع كله', cls: 'blue', atK: t(1.0), atT: t(3.8), atD: t(5.0),
      extra: '<div class="tag red st" style="position:absolute;left:28px;top:50%;translate:0 -50%">؟ مجهولة</div>' });
    S.show(r1.querySelector('.st'), t(9.6), 'pop', 0.5);
    const why1 = S.add(`<div class="abs t3 muted" style="right:796px;top:478px">موجودة… بس غالبًا مش عارفينها، لأننا مدقناش الحلة كلها</div>`);
    S.show(why1, t(11.5), 'fade', 0.5);
    const r2 = mapRow(S, { top: 566, kitchen: 'ملوحة المعلقة', kIcon: spoonIcon(), term: 'الإحصاءة', en: 'Statistic', def: 'أي رقم بنحسبه من العينة', cls: 'gold', atK: t(13.5), atT: t(15.3), atD: t(16.6),
      extra: '<div class="tag green st" style="position:absolute;left:28px;top:50%;translate:0 -50%">✓ معلومة</div>' });
    S.show(r2.querySelector('.st'), t(21.6), 'pop', 0.5);
    const why2 = S.add(`<div class="abs t3 muted" style="right:796px;top:748px">عارفينها… لأننا دقناها بنفسنا</div>`);
    S.show(why2, t(23.3), 'fade', 0.5);
    // the "meem with meem" trick
    const mAt = t(25.9);
    [tA, heads, r1, r2, why1, why2].forEach((el) => S.hide(el, mAt - 0.35, 'fade', 0.35));
    title(S, 'عشان متتلخبطوش: ميم مع ميم', { at: mAt, kicker: 'حيلة' });
    const trick = S.add(`<div class="abs col" style="left:0;right:0;top:330px;align-items:center;gap:40px">
      <div class="row" style="gap:40px"><div class="card blue tc h1" style="width:520px;padding:20px">ال<span style="color:var(--gold)">م</span>علمة</div>${art.arrow({ w: 110 })}<div class="card blue tc h1" style="width:520px;padding:20px">ال<span style="color:var(--gold)">م</span>جتمع</div></div>
      <div class="row" style="gap:40px"><div class="card gold tc h1" style="width:520px;padding:20px;color:var(--gold-ink)">الإحصاءة</div>${art.arrow({ w: 110 })}<div class="card gold tc h1" style="width:520px;padding:20px;color:var(--gold-ink)">العينة</div></div>
    </div>`);
    const [ra, rb] = trick.children;
    S.show(ra, t(30.7), 'fadeUp', 0.6);
    S.show(rb, t(33.7), 'fadeUp', 0.6);
  },

  '09': (S) => {
    const t = (r) => S.t(r);
    const tA = title(S, 'الرقم ده… معلمة ولا إحصاءة؟', { at: t(0.8), kicker: 'ركزوا في السؤال ده' });
    const card = (x, cls, txt, ans, why) => S.add(`<div class="abs card ${cls} tc" style="left:${x}px;top:280px;width:790px;height:440px;display:flex;flex-direction:column;align-items:center;gap:18px">
      <div class="h3 b" style="line-height:1.5">${txt}</div>
      <div style="height:110px;display:grid;place-items:center"><div class="q h1 muted" style="line-height:1">؟</div><div class="key ans" style="position:absolute">${ans}</div></div>
      <div class="t2 muted why">${why}</div></div>`);
    const R = card(1000, 'blue', 'متوسط درجات <span class="hl">كل</span> طلاب الدفعة', 'معلمة', 'لأنه اتحسب من الدفعة كلها… من المجتمع');
    const L = card(130, 'gold', 'متوسط درجات <span class="hl">10 طلاب</span> اخترناهم', 'إحصاءة', 'لأنه اتحسب من عينة');
    for (const [c, a0, q, ans, why] of [[R, 2.6, 5.7, 7.4, 8.8], [L, 11.7, 15.0, 17.7, 18.6]]) {
      S.show(c, t(a0), 'fadeUp', 0.6);
      mark(S, c.querySelector('.hl'), t(a0) + 0.6);
      S.show(c.querySelector('.q'), t(q), 'pop', 0.4);
      S.hide(c.querySelector('.q'), t(ans) - 0.1, 'fade', 0.2);
      S.show(c.querySelector('.ans'), t(ans), 'pop', 0.6);
      S.show(c.querySelector('.why'), t(why), 'fadeUp', 0.5);
    }
    const same = S.add(`<div class="abs tc t1 b" style="left:0;right:0;top:760px">هو هو نفس المتوسط… مرة <span class="blue">معلمة</span> ومرة <span class="gold">إحصاءة</span></div>`);
    S.show(same, t(20.8), 'fadeUp', 0.5);
    S.hide(same, t(24.2), 'fade', 0.3);
    const notName = S.add(`<div class="abs tc t1 b" style="left:0;right:0;top:760px">اللي بيحدد مش اسم الرقم… اللي بيحدد سؤال واحد بس:</div>`);
    S.show(notName, t(24.4), 'fadeUp', 0.5);
    const ask = S.add(`<div class="abs tc" style="left:0;right:0;top:860px"><div class="key" style="font-size:56px">الرقم ده اتحسب من مين؟</div></div>`);
    S.show(ask, t(27.6), 'pop', 0.6);
    // summary rule
    const sum = t(30.3);
    [R, L, notName, ask, tA].forEach((el) => S.hide(el, sum - 0.35, 'fade', 0.35));
    title(S, 'اتحسب من مين؟', { at: sum, kicker: 'القاعدة' });
    const rows = S.add(`<div class="abs col" style="left:0;right:0;top:330px;align-items:center;gap:34px">
      <div class="row" style="gap:36px"><div class="card blue tc h2" style="width:560px;padding:18px">من المجتمع</div>${art.arrow({ w: 100 })}<div class="card tc h2 blue" style="width:420px;padding:18px">معلمة</div></div>
      <div class="row" style="gap:36px"><div class="card gold tc h2" style="width:560px;padding:18px">من العينة</div>${art.arrow({ w: 100 })}<div class="card tc h2 gold" style="width:420px;padding:18px">إحصاءة</div></div>
      <div class="row t2 b" style="gap:14px;margin-top:20px">${ic.bulb({ w: 50 })}احفظوا السؤال ده… هيحللكم أسئلة كتير في الامتحان</div>
    </div>`);
    const rw = [...rows.children];
    S.show(rw[0], t(30.9), 'fadeUp', 0.6);
    S.show(rw[1], t(33.2), 'fadeUp', 0.6);
    S.show(rw[2], t(36.6), 'fadeUp', 0.6);
  },

  '10': (S) => {
    const t = (r) => S.t(r);
    title(S, 'المجتمع المحدود وغير المحدود', { at: 0.15, kicker: 'أقدر أعدّه ولا لأ؟' });
    const types = S.add(`<div class="abs row" style="right:130px;left:130px;top:270px;gap:30px;align-items:stretch">
      <div class="card" style="flex:1;padding:24px 34px"><div class="row" style="gap:16px"><span class="tag blue">Finite</span><span class="h3 b">مجتمع محدود</span></div><div class="t2 muted">أقدر أعدّه… حتى لو كبير: طلاب جامعة، مدرسين، آلات مصنع</div></div>
      <div class="card" style="flex:1;padding:24px 34px"><div class="row" style="gap:16px"><span class="tag gold">Infinite</span><span class="h3 b">مجتمع غير محدود</span></div><div class="t2 muted">مقدرش أعدّه: النجوم، السمك في المية، الخلايا</div></div>
    </div>`);
    S.stagger([...types.children], 0.3, 0.3, 'fadeUp', 0.6);
    const ex = S.add(`<div class="abs row t1 b" style="right:130px;top:500px;gap:16px">${ic.bulb({ w: 54 })}<span>مثال بيتسأل عليه كتير: <span class="gold">الأعداد العشرية بين 1 و 2</span></span></div>`);
    S.show(ex, t(0.3), 'fadeUp', 0.6);
    const line = S.add(`<div class="abs" style="left:260px;top:800px;width:1400px;height:120px">
      <div style="position:absolute;left:0;right:0;top:18px;height:6px;border-radius:6px;background:var(--navy)"></div>
      <i style="position:absolute;right:-12px;top:6px;width:30px;height:30px;border-radius:50%;background:var(--navy)"></i>
      <i style="position:absolute;left:-12px;top:6px;width:30px;height:30px;border-radius:50%;background:var(--navy)"></i>
      <div class="num" style="position:absolute;right:-16px;top:44px;font-size:56px;color:var(--navy)">1</div>
      <div class="num" style="position:absolute;left:-16px;top:44px;font-size:56px;color:var(--navy)">2</div>
    </div>`);
    S.show(line, t(1.8), 'fade', 0.6);
    const vals = ['1.1', '1.01', '1.001', '1.0001'];
    const xs = [1420, 1520, 1590, 1630];
    vals.forEach((v, i) => {
      const top = 700 - i * 60;
      const el = S.add(`<div class="abs tc" style="left:${xs[i] - 80}px;top:${top - 60}px;width:160px"><div class="tag gold num" style="font-size:${36 - i * 2}px;padding:4px 16px">${v}</div><div style="width:3px;height:${818 - top - 4}px;background:var(--gold);margin:0 auto"></div></div>`);
      S.show(el, t(4.9 + i * 0.9), 'drop', 0.5);
    });
    const inf = S.add(`<div class="abs row" style="left:260px;top:600px;gap:14px">${ic.infinity({ w: 70, color: C.goldInk })}<span class="t1 b">ومش هتخلص أبدًا… يبقى <span class="gold">غير محدود</span></span></div>`);
    S.show(inf, t(8.8), 'fadeUp', 0.6);
  },

  '11': (S) => {
    const t = (r) => S.t(r);
    title(S, 'الرموز: مين للمجتمع ومين للعينة؟', { at: t(0.7), kicker: 'كل رقم ليه رمزين' });
    const rows = [
      ['الحجم', m('N'), m('n'), 5.0, 12.9, 19.6],
      ['المتوسط الحسابي', m('μ'), m('<span class="bar">x</span>'), 21.2, 25.0, 27.9],
      ['التباين', m('σ<sup>2</sup>'), m('s<sup>2</sup>'), 29.9, 31.3, 34.0],
      ['الانحراف المعياري', m('σ'), m('s'), 35.0, 37.0, 38.3],
      ['النسبة', m('P'), m('<span class="hat">p</span>'), 39.0, 40.4, 42.2],
    ];
    const tbl = S.add(`<div class="abs" style="right:120px;top:236px">
      <table class="sym"><tr><th class="name">المقياس</th><th class="p">معلمة المجتمع</th><th class="s">إحصاءة العينة</th></tr>
      ${rows.map(([name, p, s2]) => `<tr><td class="name">${name}</td><td class="p">${p}</td><td class="s">${s2}</td></tr>`).join('')}
      </table></div>`);
    const ths = tbl.querySelectorAll('th');
    S.show(ths[0], t(1.0), 'fade', 0.5);
    S.show(ths[1], t(1.6), 'fadeDown', 0.5);
    S.show(ths[2], t(3.4), 'fadeDown', 0.5);
    const trs = [...tbl.querySelectorAll('tr')].slice(1);
    rows.forEach((r, i) => {
      const tds = trs[i].children;
      S.show(tds[0], t(r[3]), 'fadeLeft', 0.5);
      S.show(tds[1], t(r[4]), 'pop', 0.5);
      S.show(tds[2], t(r[5]), 'pop', 0.5);
    });
    const tip = S.add(`<div class="abs col" style="left:130px;width:470px;top:300px;gap:24px">
      <div class="row t2 b" style="gap:12px">${ic.bulb({ w: 50 })}بص على شكلهم بس:</div>
      <div class="card blue" style="padding:20px 26px"><div class="t2 b blue">المجتمع</div><div class="t2">حروف كابتل أو يوناني</div></div>
      <div class="card gold" style="padding:20px 26px"><div class="t2 b gold">العينة</div><div class="t2">حروف سمول</div></div></div>`);
    const tp = [...tip.children];
    S.show(tp[0], t(44.9), 'fadeUp', 0.5);
    S.show(tp[1], t(47.2), 'fadeLeft', 0.5);
    S.show(tp[2], t(49.6), 'fadeLeft', 0.5);
  },

  '12': (S) => {
    const t = (r) => S.t(r);
    const tA = title(S, 'المعاينة <span class="t2 muted" style="font-weight:600">(Sampling)</span>', { at: t(0.3), kicker: 'يبقى نقدر نقول' });
    const def = S.add(`<div class="abs t1" style="right:130px;left:130px;top:250px">الطريقة اللي بنختار بيها العينة… <span class="b">بشرط إنها تمثل المجتمع فعلًا.</span></div>`);
    S.show(def, t(0.5), 'fadeUp', 0.5);
    S.show(def.querySelector('.b'), t(4.0), 'fade', 0.5);
    const box = (right, iconHtml, head, items) => S.add(`<div class="abs card" style="right:${right}px;top:370px;width:810px;height:560px">
      <div class="row" style="gap:16px;margin-bottom:22px">${iconHtml}<div class="h3 b navy">${head}</div></div>
      ${items.map((it) => `<div class="row t2" style="gap:16px;margin-bottom:18px;align-items:flex-start"><span style="margin-top:20px;width:12px;height:12px;border-radius:50%;background:var(--navy);flex:none"></span><span>${it}</span></div>`).join('')}</div>`);
    const pros = box(130, ic.thumb({ w: 56 }), 'مزايا المعاينة', [
      'بتوفر الوقت والمجهود',
      'بتقلل التكلفة: فلوس وساعات شغل',
      'بتدينا نتايج دقيقة… لو اخترنا العينة صح',
    ]);
    const cons = box(980, ic.warn({ w: 56, color: C.muted }), 'مشاكل ممكن تحصل', [
      'قيم متطرفة مش ممثلة للمجتمع',
      '<span class="muted">لو خدنا العينة بطريقة مش عشوائية</span>',
      'خطأ المعاينة',
    ]);
    const pc = [...pros.children];
    const cc = [...cons.children];
    S.show(pros, t(6.7), 'fadeUp', 0.6);
    S.show(pc[1], t(7.6), 'fadeLeft', 0.5);
    S.show(pc[2], t(9.4), 'fadeLeft', 0.5);
    S.show(pc[3], t(11.4), 'fadeLeft', 0.5);
    S.show(cons, t(13.6), 'fadeUp', 0.6);
    S.show(cc[1], t(15.4), 'fadeLeft', 0.5);
    S.show(cc[2], t(17.9), 'fadeLeft', 0.5);
    S.show(cc[3], t(25.6), 'fadeLeft', 0.5);
    // sampling error
    const e0 = t(28.1);
    [tA, def, pros, cons].forEach((el) => S.hide(el, e0 - 0.35, 'fade', 0.35));
    title(S, 'يعني إيه خطأ المعاينة؟', { at: e0, kicker: 'عشان مش بنعمل حصر شامل' });
    const nc = S.add(`<div class="abs t1" style="right:130px;left:130px;top:250px">بناخد جزء بس… فساعات بيحصل فرق بين رقم المجتمع ورقم العينة</div>`);
    S.show(nc, t(30.9), 'fadeUp', 0.5);
    const axisTop = 640;
    const axis = S.add(`<div class="abs" style="left:260px;right:260px;top:${axisTop}px;height:6px;border-radius:6px;background:var(--line)"></div>`);
    S.show(axis, t(31.2), 'fade', 0.5);
    const pin = (x, cls, label, sym) => S.add(`<div class="abs tc" style="left:${x - 220}px;top:${axisTop - 250}px;width:440px">
      <div class="tag ${cls}" style="font-size:34px">${label}</div>
      <div class="h2 ${cls}" style="margin-top:2px;line-height:1.2">${m(sym)}</div>
      <div style="width:6px;height:${250 - 70 - 86 - 6}px;margin:0 auto;background:var(--${cls})"></div>
      <i style="display:block;width:26px;height:26px;border-radius:50%;margin:-6px auto 0;background:var(--${cls})"></i></div>`);
    S.show(pin(1180, 'blue', 'رقم المجتمع: المعلمة', 'μ'), t(33.5), 'drop', 0.6);
    S.show(pin(760, 'gold', 'رقم العينة: الإحصاءة', '<span class="bar">x</span>'), t(37.7), 'drop', 0.6);
    const gap = S.add(`<div class="abs" style="left:760px;width:420px;top:${axisTop + 30}px;height:60px;border:5px solid var(--navy);border-top:none;border-radius:0 0 18px 18px"></div>`);
    S.show(gap, t(38.4), 'wipe', 0.6);
    const gl = S.add(`<div class="abs tc" style="left:0;right:0;top:${axisTop + 120}px"><div class="key">الفرق ده اسمه: خطأ المعاينة</div></div>`);
    S.show(gl, t(39.2), 'pop', 0.6);
  },
};
