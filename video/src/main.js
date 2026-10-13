import { Scene } from './engine.js';
import { chrome } from './kit.js';
import { SCENES } from './scenes/index.js';

const params = new URLSearchParams(location.search);
const clip = params.get('clip') || '01';

const load = (url) => fetch(url).then((r) => (r.ok ? r.json() : {})).catch(() => ({}));
const [manifest, edits] = await Promise.all([load('build/audio/manifest.json'), load('edits.json')]);

const def = SCENES[clip];
if (!def) throw new Error(`no scene for clip ${clip}`);
const info = {
  duration: def.duration || 10,
  trim_start: 0,
  shifts: [],
  ...(manifest[clip] || {}),
  pauses: (edits[clip] && edits[clip].pauses) || [],
};

const stage = document.getElementById('stage');
stage.className = def.bg === 'navy' ? 'dark' : def.bg === 'gold' ? 'goldbg' : '';
stage.innerHTML = `<div class="bg ${def.bg || ''}"></div><div id="content"></div>`;
const content = document.getElementById('content');
const S = new Scene(content, info);
if (!def.noChrome) chrome(S, clip, stage);
(def.build || def)(S);

// Every clip fades in from, and out to, the shared background.
S.anim(content, 0, 0.3, { opacity: [0, 1] }, 'linear');
S.anim(content, S.duration - 0.35, 0.35, { opacity: [1, 0] }, 'linear');

await document.fonts.ready;
await Promise.all([...document.images].map((img) => img.decode().catch(() => {})));

window.__duration = S.duration;
window.__seek = (t) => S.seek(t);
window.__ready = true;

if (params.has('t')) S.seek(parseFloat(params.get('t')));
else if (params.has('play')) {
  const audio = new Audio(`build/audio/${clip}.wav`);
  audio.play().catch(() => {});
  const t0 = performance.now();
  const tick = () => {
    S.seek(audio.currentTime || (performance.now() - t0) / 1000);
    requestAnimationFrame(tick);
  };
  tick();
} else S.seek(0);
