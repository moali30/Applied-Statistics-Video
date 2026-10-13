// Part 5: the 16 multiple-choice questions (clips 22-37), laid out like the
// deck's exercise slides. Option times, the pause and the answer follow each
// recording; the pause is stretched to 5 s in edits.json for the countdown.
import { art, mark, countdown } from '../kit.js';

const { ic, C } = art;
const L = ['أ', 'ب', 'ج', 'د'];

const QUESTIONS = [
  {
    clip: '22', topic: 'المجتمع والعينة',
    q: 'مستشفى فيها 2,000 موظف، والباحث اختار منهم 150 موظف عشان يعمل عليهم دراسة. الـ 150 دول بيمثلوا إيه؟',
    hl: ['اختار منهم 150'], opts: ['المجتمع', 'العينة', 'المعلمة', 'الحصر الشامل'], correct: 1,
    tq: 0.63, to: [10.8, 12.2, 13.9, 14.8], ta: 20.8,
    notes: [[30.9, 'الـ 2,000 موظف هما المجتمع (الحلة)… والـ 150 اللي اخترناهم هما العينة (المعلقة).']],
  },
  {
    clip: '23', topic: 'المجتمع والعينة',
    q: 'أنهي واحد من دول بيمثل <b>مجتمع</b>… مش عينة؟',
    hl: [], opts: ['40 موظف تم اختيارهم من شركة', '50 طالب تم اختيارهم من جامعة', 'جميع العملاء المسجلين في شركة، وعددهم 600 عميل', '20 آلة تم اختيارها من مصنع'], correct: 2,
    optHl: [[2, 'جميع']],
    tq: 0.82, to: [5.25, 9.98, 12.63, 18.68], ta: 25.0,
    notes: [[27.8, 'بص على كلمة «جميع»… يعني كلهم، محدش اختار منهم حد.'], [34.9, 'أما «تم اختيارهم»… يبقى عينة.']],
  },
  {
    clip: '24', topic: 'المجتمع المحدود وغير المحدود',
    q: 'المجتمع اللي نقدر نعد وحداته اسمه إيه؟',
    hl: ['نقدر نعد'], opts: ['مجتمع غير محدود', 'مجتمع محدود'], correct: 1,
    tq: 1.76, to: [5.7, 6.9], ta: 10.6,
    notes: [[11.6, 'طالما تقدر تعدّه… يبقى محدود.']],
  },
  {
    clip: '25', topic: 'المجتمع المحدود وغير المحدود',
    q: 'أنهي واحد من دول مجتمع <b>غير محدود</b>؟',
    hl: [], opts: ['المدرسين في مدرسة', 'الآلات في مصنع', 'الطلاب في جامعة', 'الأعداد العشرية بين 1 و 2'], correct: 3,
    tq: 1.12, to: [6.3, 10.4, 12.4, 15.1], ta: 23.0,
    notes: [[28.6, 'المدرسين والآلات والطلاب… كلهم نقدر نعدهم، حتى لو كتير.'], [50.0, 'الأعداد العشرية: 1.1، 1.01، 1.001… ومبتخلصش، فهي غير محدود.']],
    dim: [[32.8, 0], [38.0, 1], [44.1, 2]],
  },
  {
    clip: '26', topic: 'المعلمة والإحصاءة',
    q: 'باحث حسب التباين من بيانات <b>كل فرد</b> في المجتمع. التباين ده يبقى إيه؟',
    hl: [], opts: ['إحصاءة', 'عينة', 'معلمة', 'طريقة معاينة'], correct: 2,
    tq: 1.1, to: [16.56, 17.37, 18.27, 19.37], ta: 25.3,
    notes: [[26.6, 'اسأل السؤال بتاعنا: اتحسب من مين؟ من المجتمع.'], [37.7, 'ميم مع ميم: المعلمة من المجتمع… يعني تباين المجتمع <span class="m">σ<sup>2</sup></span>.']],
  },
  {
    clip: '27', topic: 'المعلمة والإحصاءة',
    q: 'اتحسب متوسط دخل 200 موظف، تم اختيارهم من شركة. المتوسط ده يبقى إيه؟',
    hl: ['تم اختيارهم'], opts: ['معلمة', 'إحصاءة', 'مجتمع', 'حصر شامل'], correct: 1,
    tq: 1.11, to: [14.37, 15.42, 16.38, 17.16], ta: 22.9,
    notes: [[26.2, 'متحسبش على كل الموظفين… الـ 200 «تم اختيارهم» يعني عينة.'], [38.5, 'وأي حاجة محسوبة من العينة اسمها إحصاءة.']],
  },
  {
    clip: '28', topic: 'المعلمة والإحصاءة',
    q: 'أنهي عبارة صح؟',
    hl: [], opts: ['المعلمة بتتحسب من العينة', 'الإحصاءة بتتحسب من المجتمع', 'المعلمة بتتحسب من المجتمع', 'الإحصاءة والمعلمة دايمًا متساويين'], correct: 2,
    tq: 0.99, to: [4.4, 7.75, 10.6, 13.67], ta: 26.0,
    notes: [[23.45, 'ميم مع ميم: المعلمة من المجتمع.'], [33.5, 'ومش لازم الإحصاءة تساوي المعلمة… ممكن تقرب منها بس.']],
  },
  {
    clip: '29', topic: 'مزايا المعاينة',
    q: 'استخدام العينة ممكن يقلل إيه؟',
    hl: [], opts: ['حجم المجتمع', 'عدد المتغيرات', 'التكلفة وساعات العمل', 'الحاجة للتحليل الإحصائي'], correct: 2,
    tq: 1.1, to: [5.71, 7.5, 9.55, 11.64], ta: 15.6,
    notes: [[19.7, 'دي من مزايا المعاينة اللي قلناها.']],
  },
  {
    clip: '30', topic: 'طرق اختيار العينة',
    q: 'الباحث عايز يختار أفراد من المجتمع، بحيث كل فرد يكون ليه نفس الفرصة إنه يتختار. يستخدم أنهي طريقة؟',
    hl: ['نفس الفرصة'], opts: ['المعاينة المنتظمة', 'المعاينة الطبقية', 'المعاينة العشوائية البسيطة', 'المعاينة العنقودية'], correct: 2,
    tq: 0.68, to: [9.6, 11.3, 13.7, 15.0], ta: 43.9,
    notes: [[17.2, 'مفيش مساحة جغرافية كبيرة… يبقى مش عنقودية.'], [24.8, 'ومفيش طبقات… يبقى مش طبقية.'], [34.2, 'طالما كل واحد ليه «نفس الفرصة»… دي كلمة السر.']],
    dim: [[17.6, 3], [25.2, 1], [28.7, 0]],
    keyAt: 36.5,
  },
  {
    clip: '31', topic: 'طرق اختيار العينة',
    q: 'باحث معاه كشف فيه 1,000 اسم. اختار أول اسم عشوائي، وبعدين أخد كل اسم رقم 25 بعده. الطريقة دي اسمها إيه؟',
    hl: ['كل اسم رقم 25'], opts: ['الطبقية', 'المنتظمة', 'العشوائية البسيطة', 'العنقودية'], correct: 1,
    tq: 0.99, to: [12.4, 13.7, 15.3, 16.1], ta: 21.9,
    notes: [[27.2, 'بداية عشوائية… وبعدها خطوة ثابتة: 25.']],
  },
  {
    clip: '32', topic: 'المعاينة المنتظمة',
    q: 'في المعاينة المنتظمة، حرف <span class="m">K</span> بيحدد إيه؟',
    hl: [], opts: ['حجم المجتمع', 'المسافة بين الوحدات المختارة', 'متوسط المجتمع', 'عدد المتغيرات'], correct: 1,
    tq: 0.88, to: [4.9, 6.47, 9.37, 10.4], ta: 17.2,
    notes: [[21.6, '<span class="m">K</span> = طول الخطوة بين كل اسم واللي بعده'], [25.95, 'وبنجيبه من: <span class="m">K</span> = <span class="m">N</span> ÷ <span class="m">n</span>']],
  },
  {
    clip: '33', topic: 'المعاينة الطبقية',
    q: 'باحث قسّم المجتمع لطبقات حسب المرحلة الدراسية، وبعدين اختار عينة عشوائية من كل طبقة. استخدم أنهي طريقة؟',
    hl: ['من كل طبقة'], opts: ['العشوائية البسيطة', 'العنقودية', 'المنتظمة', 'الطبقية'], correct: 3,
    tq: 0.78, to: [12.39, 13.99, 15.14, 16.33], ta: 27.6,
    notes: [[30.5, 'قسّم المجتمع لطبقات… وأخد من كل الطبقات.']],
  },
  {
    clip: '34', topic: 'المعاينة الطبقية',
    q: 'جامعة فيها 60% من طلابها في المرحلة الجامعية و 40% دراسات عليا. الباحث قسّم الطلاب للمجموعتين دول، واختار طلاب بشكل عشوائي من كل مجموعة. استخدم أنهي طريقة؟',
    hl: ['من كل مجموعة'], opts: ['العنقودية', 'المنتظمة', 'الطبقية', 'الحصر الشامل'], correct: 2,
    tq: 1.69, to: [31.23, 32.7, 33.8, 34.96], ta: 39.8,
    notes: [[42.3, 'مخدش مجموعة لوحدها… خد جزء من كل مجموعة.'], [50.1, 'لو كان خد مجموعة كاملة وساب التانية… كانت تبقى عنقودية.']],
  },
  {
    clip: '35', topic: 'المعاينة الطبقية',
    q: 'في المعاينة الطبقية، المجتمع بيتقسم لمجموعات اسمها إيه؟',
    hl: [], opts: ['عناقيد', 'عينات', 'طبقات', 'معلمات'], correct: 2,
    tq: 0.65, to: [7.82, 8.7, 9.6, 10.88], ta: 16.0,
    notes: [[17.4, 'المعاينة الطبقية… يبقى طبقات.']],
  },
  {
    clip: '36', topic: 'المعاينة العنقودية',
    q: 'باحث اختار شوية مدارس بشكل عشوائي، وبعدين أخد <b>جميع</b> الطلبة اللي في المدارس دي. دي طريقة إيه؟',
    hl: [], opts: ['العنقودية', 'الطبقية', 'المنتظمة', 'العشوائية البسيطة'], correct: 0,
    tq: 0.65, to: [9.74, 10.91, 12.07, 13.2], ta: 45.0,
    notes: [[18.4, 'لاحظوا: اختار شوية مدارس… وأخد كل الطلاب اللي فيهم.'], [48.3, 'كل مدرسة عنقود… ومخدش كل العناقيد، خد جزء منهم بكل اللي فيهم.']],
  },
  {
    clip: '37', topic: 'المعاينة العنقودية',
    q: 'مجتمع متوزع على مناطق جغرافية كبيرة. الباحث اختار عشوائي كام منطقة، ودرس <b>جميع</b> الوحدات اللي فيهم. العينة دي اسمها إيه؟',
    hl: ['مناطق جغرافية كبيرة'], opts: ['عشوائية بسيطة', 'عشوائية عنقودية', 'عشوائية طبقية', 'عشوائية منتظمة'], correct: 1,
    tq: 0.47, to: [12.86, 14.24, 15.4, 16.87], ta: 25.0,
    notes: [[29.3, '«مناطق جغرافية كبيرة» و«جميع الوحدات»… دي كلها علامات العنقودية.']],
  },
];

function withHl(text, words) {
  let out = text;
  for (const w of words) out = out.replace(w, `<span class="hl">${w}</span>`);
  return out;
}

function mcq(S, d, n) {
  const t = (r) => S.t(r);
  const head = S.add(`<div class="abs row" style="right:130px;left:130px;top:70px;justify-content:space-between">
    <div class="kicker">تمارين · اختر الإجابة الصحيحة</div><div class="t3 muted b">${d.topic}</div></div>`);
  S.show(head, 0.1, 'fade', 0.4);
  const two = d.opts.length === 2;
  const box = S.add(`<div class="abs col" style="right:130px;left:130px;top:140px;gap:34px">
    <div class="mcq-q" style="position:static"><span class="badge">${n}</span><div class="text">${withHl(d.q, d.hl)}</div></div>
    <div class="opts" style="position:static;--n:${two ? 2 : 4};${two ? 'width:1100px' : ''}">
      ${d.opts.map((o, i) => `<div class="opt">${i === d.correct ? '<div class="good"></div>' : ''}<span class="letter">${L[i]})</span><span class="otext">${o}</span>${i === d.correct ? `<span class="ok">${ic.check({ w: 44 })}</span>` : ''}</div>`).join('')}
    </div>
    <div class="area" style="position:relative;min-height:300px">
      <div class="answer" style="position:static">
        <div class="line">الإجابة: ${L[d.correct]}) ${d.opts[d.correct]}</div>
        ${d.notes.map(([, txt]) => `<div class="note row" style="gap:16px">${ic.bulb({ w: 40 })}<span>${txt}</span></div>`).join('')}
      </div></div>
  </div>`);
  const [qRow, opts, area] = box.children;
  S.show(qRow, t(d.tq), 'fadeUp', 0.6);
  const cards = [...opts.children];
  cards.forEach((c, i) => S.show(c, t(d.to[i]), 'fadeUp', 0.45));
  (d.optHl || []).forEach(([i, w]) => {
    const span = cards[i].querySelector('.otext');
    span.innerHTML = withHl(span.innerHTML, [w]);
  });
  // countdown while the recording is silent
  const p = S.pause(0);
  const cd = countdown(S, { start: p.start, len: p.end - p.start, x: 0, y: 0, label: 'وقّف وفكّر', size: 170 });
  area.appendChild(cd);
  cd.style.left = 'calc(50% - 85px)';
  cd.style.top = '10px';
  // eliminate wrong options as the speaker rules them out
  (d.dim || []).forEach(([r, i]) => S.anim(cards[i], t(r), 0.5, { opacity: [1, 0.35] }));
  // reveal
  const good = cards[d.correct];
  const at = t(d.ta);
  S.show(good.querySelector('.good'), at, 'fade', 0.4);
  S.show(good.querySelector('.ok'), at + 0.1, 'pop', 0.4);
  cards.forEach((c, i) => {
    if (i !== d.correct && !(d.dim || []).some(([, j]) => j === i)) S.anim(c, at + 0.1, 0.5, { opacity: [1, 0.4] });
  });
  const ans = area.querySelector('.answer');
  const [line, ...notes] = ans.children;
  S.show(line, at + 0.2, 'fadeUp', 0.5);
  notes.forEach((nEl, i) => S.show(nEl, t(d.notes[i][0]), 'fadeUp', 0.5));
  // the password / key words in the question light up
  [...qRow.querySelectorAll('.hl'), ...opts.querySelectorAll('.hl')].forEach((h) => mark(S, h, d.keyAt ? t(d.keyAt) : at + 0.4));
}

export default Object.fromEntries(QUESTIONS.map((d, i) => [d.clip, { bg: 'sand', build: (S) => mcq(S, d, i + 1) }]));
