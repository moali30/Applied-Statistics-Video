// Part 1: the idea (clips 01-06). Times passed to S.t() are seconds in the
// raw recording audio/raw/NN.m4a.
import { art, title, lightDots } from '../kit.js';

const { ic, C } = art;

// "small piece -> judge the whole" row used in 03 and 04.
function pieceToWhole(S, { top, at1, atA, at2, small = 'حتة صغيرة', big = 'حكم على الكل', size = 46 }) {
  const el = S.add(`<div class="abs row" style="left:0;right:0;top:${top}px;justify-content:center;gap:28px">
    <div class="tag gold" style="font-size:${size}px">${small}</div>${art.arrow({ w: 86 })}<div class="tag blue" style="font-size:${size}px">${big}</div></div>`);
  const [a, b, c] = el.children;
  S.show(a, at1, 'pop', 0.5);
  S.show(b, atA, 'fadeLeft', 0.4);
  S.show(c, at2, 'pop', 0.5);
  return el;
}

export default {
  '01': {
    noChrome: true,
    build: (S) => {
      const t = (r) => S.t(r);
      const logo = S.add(`<img class="abs" src="assets/img/hue-logo.png" style="left:130px;top:80px;width:300px">`);
      const seal = S.add(`<img class="abs" src="assets/img/faculty-seal.png" style="right:130px;top:64px;width:170px">`);
      S.show(logo, 0.2, 'fade', 0.8);
      S.show(seal, 0.4, 'fade', 0.8);
      const head = S.add(`<div class="abs tc" style="left:0;right:0;top:180px">
        <div class="kicker" style="font-size:30px">SAT301 · الإحصاء التطبيقي</div>
        <div class="h0" style="margin-top:4px">المعاينة</div>
        <div class="tag navy" style="font-size:40px;padding:8px 46px">سكشن 1</div>
      </div>`);
      const [k, h, pill] = head.children;
      S.show(k, 0.6, 'fadeDown', 0.6);
      S.show(h, t(3.7), 'fadeUp', 0.8);
      S.show(pill, t(4.4), 'pop', 0.5);
      // navy band with the dot line and today's plan, as on the deck's cover
      const band = S.add(`<div class="abs dark" style="left:0;right:0;top:640px;bottom:0;background:var(--navy)">
        <div style="position:absolute;left:130px;right:130px;top:34px">${art.dotGrid({ cols: 34, rows: 1, gap: 49, r: 6, base: '#1c4a78', gold: [3, 10, 17, 24, 30] })}</div>
      </div>`);
      S.show(band, t(10.0), { y: [440, 0], ease: 'inOut' }, 0.8);
      const steps = ['نفهم الفكرة', 'نراجع المحاضرة', 'نحل مثالين', '16 سؤال اختيار من متعدد'];
      const road = S.add(`<div class="abs dark row" style="left:130px;right:130px;top:760px;justify-content:space-between;gap:18px">
        ${steps.map((s, i) => `<div class="row" style="gap:18px"><span class="badge">${i + 1}</span><span class="t2 b nowrap">${s}</span></div>${i < 3 ? `<div>${art.arrow({ w: 60, color: '#4f78a3' })}</div>` : ''}`).join('')}
      </div>`);
      const items = [...road.children];
      [10.6, 11.9, 13.3, 14.3].forEach((r, i) => {
        S.show(items[i * 2], t(r), 'fadeUp', 0.5);
        if (i) S.show(items[i * 2 - 1], t(r) - 0.2, 'fade', 0.3);
      });
      const pen = S.add(`<div class="abs dark row" style="left:0;right:0;top:900px;justify-content:center;gap:16px">${ic.pencil({ w: 46, color: C.gold })}<span class="t2 b gold">هاتوا ورقة وقلم… ويلا بينا</span></div>`);
      S.show(pen, t(17.2), 'fadeUp', 0.6);
    },
  },

  '02': {
    bg: 'navy',
    build: (S) => {
      const t = (r) => S.t(r);
      title(S, 'إزاي تعرف إن حلة الشوربة ملحها مظبوط؟', { at: t(1.1), kicker: 'قبل ما نبدأ… سؤال من المطبخ' });
      const pot = S.add(`<div class="abs" style="left:170px;top:300px">${art.potTop({ w: 470 })}</div>`);
      S.show(pot, t(2.6), 'zoom', 0.8);
      const lines = S.add(`<div class="abs col" style="right:130px;width:1000px;top:390px;gap:34px">
        <div class="t1">مامتك عاملة حلة شوربة كبيرة، وعايزة تتأكد من الملح.</div>
        <div class="t1">هل هتشرب الحلة كلها عشان تعرف؟ <span class="gold b">أكيد لأ.</span></div>
      </div>`);
      const [l1, l2] = lines.children;
      S.show(l1, t(3.0), 'fadeUp', 0.6);
      S.show(l2, t(6.0), 'fadeUp', 0.6);
      const no = l2.querySelector('.gold');
      S.anim(no, 0, 0.01, { opacity: [0, 0] });
      S.show(no, t(8.85), 'pop', 0.5);
    },
  },

  '03': (S) => {
    const t = (r) => S.t(r);
    const t1 = title(S, 'طب هي بتعمل إيه؟', { at: t(0.5), kicker: 'الحلة والمعلقة' });
    const pot = S.add(`<div class="abs" style="left:1120px;top:300px">${art.potTop({ w: 500 })}</div>`);
    S.show(pot, 0.3, 'fade', 0.6);
    const potLbl = S.add(`<div class="abs tc" style="left:1120px;width:500px;top:830px"><div class="tag blue">الحلة كلها</div></div>`);
    S.show(potLbl, 0.6, 'fadeUp', 0.5);
    // the spoon stirs over the pot, then comes out with a few dots in it
    const wrap = S.add(`<div class="abs" style="left:1280px;top:400px">${art.spoon({ w: 240, empty: true })}</div>`);
    const sp = wrap.firstElementChild;
    const sd = sp.querySelector('.sd');
    S.show(wrap, t(1.85), 'fade', 0.3);
    const s0 = t(1.95);
    const s1 = t(3.1);
    S.every((tt) => {
      if (tt < s0 || tt > s1) {
        sp.style.translate = '0 0';
        return 'still';
      }
      const a = ((tt - s0) / (s1 - s0)) * Math.PI * 4;
      sp.style.translate = `${(Math.cos(a) * 80 - 80).toFixed(1)}px ${(Math.sin(a) * 60).toFixed(1)}px`;
      return a.toFixed(3);
    });
    S.anim(wrap, s1, 1.0, { x: [0, -760], y: [0, 20] }, 'inOut');
    sd.removeAttribute('opacity');
    S.show(sd, s1 + 0.6, 'fade', 0.5);
    const spLbl = S.add(`<div class="abs tc" style="left:360px;width:500px;top:830px"><div class="tag gold">معلقة واحدة</div></div>`);
    S.show(spLbl, t(3.4), 'fadeUp', 0.5);
    const ok1 = S.add(`<div class="abs" style="left:700px;top:330px">${art.check({ w: 100 })}</div>`);
    S.show(ok1, t(4.9), 'pop', 0.5);
    const ok2 = S.add(`<div class="abs" style="left:1540px;top:300px">${art.check({ w: 110 })}</div>`);
    S.show(ok2, t(6.9), 'pop', 0.5);
    S.hide(t1, t(7.9), 'fade', 0.3);
    title(S, 'مدقتش الحلة كلها!', { at: t(8.1), kicker: 'لاحظ اللي حصل' });
    S.hide(potLbl, t(10.5), 'fade', 0.3);
    S.hide(spLbl, t(10.5), 'fade', 0.3);
    pieceToWhole(S, { top: 850, at1: t(10.9), atA: t(12.3), at2: t(12.5) });
    const name = S.add(`<div class="abs" style="left:130px;top:236px"><div class="key" style="font-size:50px">وده اللي اسمه: المعاينة</div></div>`);
    S.show(name, t(14.6), 'pop', 0.6);
  },

  '04': (S) => {
    const t = (r) => S.t(r);
    title(S, 'وإنت بتعمل كده طول الوقت', { at: t(0.2), kicker: 'نفس الفكرة في حياتك' });
    const items = [
      { icon: ic.grapes({ w: 120, color: C.blue }), what: 'عند الفكهاني', small: 'حباية عنب', big: 'الكيلو كله', at: 2.0, s: 3.6, b: 5.0 },
      { icon: ic.flask({ w: 120, color: C.blue }), what: 'في المعمل', small: 'أنبوبة دم', big: 'دمك كله', at: 6.2, s: 7.6, b: 9.8 },
      { icon: ic.paper({ w: 120, color: C.blue }), what: 'في الامتحان', small: 'كام سؤال', big: 'المنهج كله', at: 12.0, s: 14.6, b: 17.6 },
    ];
    items.forEach((it, i) => {
      const x = 1270 - i * 545;
      const c = S.add(`<div class="abs card tc" style="left:${x}px;top:260px;width:520px;height:560px;display:flex;flex-direction:column;align-items:center;gap:20px;padding:36px 30px">
        <div style="width:190px;height:190px;border-radius:50%;background:var(--blue-soft);display:grid;place-items:center">${it.icon}</div>
        <div class="t2 b muted">${it.what}</div>
        <div class="tag gold" style="font-size:38px">${it.small}</div>
        <div style="rotate:-90deg">${art.arrow({ w: 56 })}</div>
        <div class="tag blue" style="font-size:38px">${it.big}</div></div>`);
      const [, , sm, ar, bg] = c.children;
      S.show(c, t(it.at), 'fadeUp', 0.6);
      S.show(sm, t(it.s), 'pop', 0.5);
      S.show(ar, t(it.s) + 0.4, 'fade', 0.4);
      S.show(bg, t(it.b), 'pop', 0.5);
    });
    const rule = S.add(`<div class="abs tc t1 b" style="left:0;right:0;top:860px">كلهم نفس الفكرة بالظبط</div>`);
    S.show(rule, t(19.4), 'fadeUp', 0.5);
    S.hide(rule, t(22.9), 'fade', 0.3);
    pieceToWhole(S, { top: 860, at1: t(23.1), atA: t(24.7), at2: t(24.9), small: 'جزء صغير' });
  },

  '05': (S) => {
    const t = (r) => S.t(r);
    const t1 = title(S, 'طب ليه مندرسش الكل؟', { at: t(0.9), kicker: 'ما ندرس الكل وخلاص؟' });
    // A: studying everyone is called a census
    const cen = S.add(`<div class="abs tc" style="left:0;right:0;top:290px">
      <div class="t1 muted b">دراسة الكل اسمها</div>
      <div class="key" style="font-size:66px;margin-top:14px">الحصر الشامل</div>
      <div class="t1" style="margin-top:22px">يعني نفحص كل حاجة… <span class="gold b">واحدة واحدة</span></div></div>`);
    S.show(cen.children[0], t(3.9), 'fadeUp', 0.5);
    S.show(cen.children[1], t(4.6), 'pop', 0.6);
    S.show(cen.children[2], t(6.4), 'fadeUp', 0.5);
    const grid = S.add(`<div class="abs" style="left:50%;top:720px;translate:-50% 0">${art.dotGrid({ cols: 20, rows: 3, gap: 50, r: 11, base: C.blueLine })}</div>`);
    S.show(grid, t(6.4), 'fadeUp', 0.5);
    grid.querySelectorAll('.g').forEach((g) => g.setAttribute('fill', C.green));
    lightDots(S, grid, Array.from({ length: 60 }, (_, i) => i), t(7.0), 0.05);
    const aOut = t(10.5);
    S.hide(cen, aOut - 0.4, 'fade', 0.4);
    S.hide(grid, aOut - 0.4, 'fade', 0.4);
    // B: the scale: studying everyone is heavy
    const sc = S.add(`<div class="abs" style="left:510px;top:250px">${art.scale({ w: 900 })}</div>`);
    S.show(sc, aOut, 'fadeUp', 0.6);
    const beam = sc.querySelector('.beam');
    const panR = sc.querySelector('.panR');
    const panL = sc.querySelector('.panL');
    beam.style.transformOrigin = '450px 119px';
    const tiltAt = t(14.2);
    S.every((tt) => {
      const p = Math.min(1, Math.max(0, (tt - tiltAt) / 1.4));
      const d = 70 * (1 - Math.pow(1 - p, 3));
      beam.style.transform = `rotate(${(-Math.atan2(2 * d, 520) * 180 / Math.PI).toFixed(2)}deg)`;
      panR.style.transform = `translateY(${d.toFixed(1)}px)`;
      panL.style.transform = `translateY(${(-d).toFixed(1)}px)`;
      return d.toFixed(1);
    });
    const all = S.add(`<div class="abs tc" style="left:540px;top:660px;width:320px"><div class="tag blue">ندرس الكل</div></div>`);
    const smp = S.add(`<div class="abs tc" style="left:1060px;top:660px;width:320px"><div class="tag gold">ناخد عينة</div></div>`);
    S.show(all, aOut + 0.4, 'pop', 0.5);
    S.show(smp, aOut + 0.7, 'pop', 0.5);
    S.anim(all, tiltAt, 1.4, { y: [0, 70] }, 'out');
    S.anim(smp, tiltAt, 1.4, { y: [0, -70] }, 'out');
    const world = S.add(`<div class="abs tc t1" style="left:0;right:0;top:850px">كل طلاب الجامعة… أو كل الناس في مصر!</div>`);
    S.show(world, t(11.3), 'fadeUp', 0.5);
    S.hide(world, t(16.8), 'fade', 0.3);
    const loads = S.add(`<div class="abs row" style="left:600px;top:470px;gap:10px">${ic.clock({ w: 64, color: C.navy })}${ic.effort({ w: 64, color: C.navy })}${ic.cash({ w: 64, color: C.navy })}</div>`);
    [13.9, 14.9, 15.6].forEach((r, i) => S.show(loads.children[i], t(r), 'drop', 0.6));
    S.anim(loads, tiltAt, 1.4, { y: [0, 70] }, 'out');
    const light = S.add(`<div class="abs" style="left:1165px;top:430px">${art.spoon({ w: 110 })}</div>`);
    S.show(light, aOut + 0.9, 'drop', 0.6);
    S.anim(light, tiltAt, 1.4, { y: [0, -70] }, 'out');
    const imp = S.add(`<div class="abs tc t1 b" style="left:0;right:0;top:850px">وساعات يبقى <span class="red">مستحيل!</span></div>`);
    S.show(imp, t(17.1), 'fadeUp', 0.5);
    // C: the match factory
    const cAt = t(18.95);
    [sc, all, smp, loads, light, imp].forEach((el) => S.hide(el, cAt - 0.4, 'fade', 0.4));
    S.hide(t1, cAt - 0.4, 'fade', 0.3);
    const tC = title(S, 'مصنع كبريت عايز يتأكد إن الكبريت بيولّع', { at: cAt, kicker: 'تخيل' });
    const box = S.add(`<div class="abs" style="left:1240px;top:520px">${art.matchbox({ w: 360 })}</div>`);
    S.show(box, cAt + 0.2, 'fadeUp', 0.6);
    const sticks = [];
    for (let i = 0; i < 8; i++) {
      const m = S.add(`<div class="abs" style="left:${300 + i * 100}px;top:420px">${art.match({ w: 56 })}</div>`);
      sticks.push(m);
      const at = t(21.0) + i * 0.22;
      S.show(m, cAt + 0.4 + i * 0.08, 'fadeUp', 0.4);
      S.show(m.querySelector('.flame'), at, 'pop', 0.3);
      S.hide(m.querySelector('.flame'), at + 1.0, 'fade', 0.3);
      m.querySelector('.burnt').removeAttribute('opacity');
      S.show(m.querySelector('.burnt'), at + 1.0, 'fade', 0.3);
    }
    const none = S.add(`<div class="abs tc t1 b" style="left:240px;top:780px;width:900px">لو جرّب كل عود… <span class="red">مش هيفضل عود يبيعه!</span></div>`);
    S.show(none, t(22.8), 'fadeUp', 0.6);
    // D: so we take a sample
    const dAt = t(24.45);
    [box, none, tC, ...sticks].forEach((el) => S.hide(el, dAt - 0.4, 'fade', 0.4));
    title(S, 'عشان كده بناخد عينة', { at: dAt, kicker: 'الخلاصة' });
    const res = S.add(`<div class="abs row" style="left:130px;right:130px;top:330px;justify-content:center;gap:40px">
      ${[[ic.clock, 'بتوفر الوقت'], [ic.effort, 'والمجهود'], [ic.cash, 'والفلوس']].map(([f, s]) => `<div class="card tc" style="width:400px;display:flex;flex-direction:column;align-items:center;gap:18px">
        ${art.chipIcon(f, { w: 150 })}<div class="t1 b nowrap">${s}</div></div>`).join('')}
    </div>`);
    S.show(res.children[0], t(25.5), 'pop', 0.5);
    S.show(res.children[1], t(26.45), 'pop', 0.5);
    S.show(res.children[2], t(27.0), 'pop', 0.5);
    const acc = S.add(`<div class="abs tc" style="left:0;right:0;top:760px"><div class="tag green" style="font-size:44px">ولو اخترناها صح… بتدينا نتايج دقيقة</div></div>`);
    S.show(acc, t(28.0), 'fadeUp', 0.6);
  },

  '06': (S) => {
    const t = (r) => S.t(r);
    const tA = title(S, 'بس فيه شرط مهم جدًا… قلّب الحلة', { at: t(0.3), kicker: 'فاكرين التقليب؟' });
    // A: unstirred pot, salt at the bottom
    const pot = S.add(`<div class="abs" style="left:1130px;top:330px">${art.potSide({ w: 520 })}</div>`);
    S.show(pot, t(2.8), 'fadeUp', 0.7);
    const salt = S.add(`<div class="abs tc" style="left:1130px;width:520px;top:830px"><div class="tag white">الملح كله نازل تحت</div></div>`);
    S.show(salt, t(6.1), 'fadeUp', 0.5);
    const wrap = S.add(`<div class="abs" style="left:1250px;top:250px">${art.spoon({ w: 200, dots: 0 })}</div>`);
    S.show(wrap, t(4.7), 'fadeDown', 0.5);
    S.anim(wrap, t(5.3), 0.4, { y: [0, 60] }, 'inOut');
    S.anim(wrap, t(6.3), 0.9, { x: [0, -640], y: [60, 160] }, 'inOut');
    const bland = S.add(`<div class="abs tc" style="left:470px;width:420px;top:600px"><div class="tag gold">المعلقة مسيخة</div></div>`);
    S.show(bland, t(7.7), 'pop', 0.5);
    const wrong = S.add(`<div class="abs card red tc" style="left:330px;top:720px;width:700px;padding:24px 30px"><div class="t2">الحكم: «الحلة محتاجة ملح»</div><div class="t1 b red">وهي أصلًا مالحة!</div></div>`);
    S.show(wrong, t(8.9), 'fadeUp', 0.6);
    S.show(wrong.children[1], t(10.7), 'pop', 0.5);
    const x1 = S.add(`<div class="abs" style="left:250px;top:690px">${art.cross({ w: 96 })}</div>`);
    S.show(x1, t(10.9), 'pop', 0.5);
    // B: the library survey
    const bAt = t(12.25);
    [pot, salt, wrap, bland, wrong, x1, tA].forEach((el) => S.hide(el, bAt - 0.35, 'fade', 0.35));
    const tB = title(S, 'نفس الكلام بالظبط في الإحصاء', { at: bAt, kicker: 'مثال' });
    const q = S.add(`<div class="abs card blue" style="right:130px;top:290px;width:740px"><div class="t3 b muted">عايز تعرف:</div><div class="t1 b">الطلبة بيذاكروا كام ساعة في اليوم؟</div></div>`);
    S.show(q, t(13.9), 'fadeUp', 0.6);
    const lib = S.add(`<div class="abs" style="left:170px;top:280px;width:620px">
      <div>${art.shelf({ w: 520 })}</div>
      <div class="row" style="gap:18px;margin:26px 0 0 40px">${[0, 1, 2, 3].map(() => art.person({ w: 70, color: C.blue })).join('')}</div>
      <div class="tag white" style="margin-top:26px">سألنا اللي في المكتبة بس</div></div>`);
    S.show(lib, t(14.2), 'fadeUp', 0.7);
    S.show(lib.lastElementChild, t(16.5), 'pop', 0.5);
    const res = S.add(`<div class="abs card gold" style="right:130px;top:520px;width:740px"><div class="t3 b muted">النتيجة:</div><div class="t1 b">«الطلبة كلهم بيذاكروا كتير جدًا!»</div></div>`);
    S.show(res, t(18.5), 'fadeUp', 0.6);
    const notTrue = S.add(`<div class="abs row" style="right:130px;top:760px;width:740px;gap:18px">${art.cross({ w: 70 })}<div class="t2 b red">مش الحقيقة… سألنا أكتر ناس بتذاكر</div></div>`);
    S.show(notTrue, t(20.4), 'fadeUp', 0.6);
    // C: the sample must represent; choose at random
    const cAt = t(23.3);
    [q, lib, res, notTrue, tB].forEach((el) => S.hide(el, cAt - 0.35, 'fade', 0.35));
    title(S, 'العينة لازم تمثّل الكل', { at: cAt, kicker: 'الشرط' });
    const big = S.add(`<div class="abs" style="left:1150px;top:270px">${art.potTop({ w: 440 })}</div>`);
    S.show(big, cAt + 0.2, 'zoom', 0.7);
    const bigL = S.add(`<div class="abs tc" style="left:1150px;width:440px;top:730px"><div class="tag blue">الكل</div></div>`);
    S.show(bigL, cAt + 0.4, 'fadeUp', 0.5);
    const small = S.add(`<div class="abs" style="left:520px;top:330px">${art.spoon({ w: 260, dots: 7 })}</div>`);
    S.show(small, t(25.2), 'zoom', 0.7);
    const smallL = S.add(`<div class="abs tc" style="left:420px;width:460px;top:730px"><div class="tag gold">صورة مصغرة منه</div></div>`);
    S.show(smallL, t(25.4), 'fadeUp', 0.5);
    const how = S.add(`<div class="abs row" style="left:0;right:0;top:860px;justify-content:center;gap:26px">
      <div class="t1 b">إزاي؟</div><div class="key">اختيار عشوائي</div><div class="t1 b">= التقليب بتاعنا</div></div>`);
    S.show(how.children[0], t(26.5), 'fadeUp', 0.5);
    S.show(how.children[1], t(27.7), 'pop', 0.6);
    S.show(how.children[2], t(29.4), 'fadeUp', 0.5);
  },
};
