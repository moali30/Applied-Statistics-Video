// Render the section video: every clip's scene is captured frame by frame in
// headless Chromium and encoded with ffmpeg, then the clips are joined and the
// cleaned audio is laid under them.
//
//   node render.mjs                 render every clip, then build the full video
//   node render.mjs 07 08           render only these clips (no full video)
//   node render.mjs --join          only join already-rendered clips
//   node render.mjs --workers 3 --fps 30
import { chromium } from 'playwright';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { ORDER, PARTS } from './src/kit.js';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const BUILD = path.join(ROOT, 'build');
const SEG = path.join(BUILD, 'segments');
const OUT = path.join(ROOT, '..', 'output');

const argv = process.argv.slice(2);
const opt = (name, def) => {
  const i = argv.indexOf(name);
  if (i < 0) return def;
  const v = argv[i + 1];
  argv.splice(i, 2);
  return v;
};
const FPS = Number(opt('--fps', 30));
const WORKERS = Number(opt('--workers', 3));
const joinOnly = argv.includes('--join');
const stills = opt('--stills', null); // e.g. --stills 1,4.5,9 : save PNGs instead of video
const clips = argv.filter((a) => !a.startsWith('--'));
const todo = joinOnly ? [] : clips.length ? clips.map((c) => (/^\d$/.test(c) ? '0' + c : c)) : ORDER;

const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.woff2': 'font/woff2', '.wav': 'audio/wav', '.png': 'image/png', '.svg': 'image/svg+xml' };

function serve() {
  const server = http.createServer((req, res) => {
    const p = path.join(ROOT, decodeURIComponent(new URL(req.url, 'http://x').pathname));
    if (!p.startsWith(ROOT) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) {
      res.writeHead(404).end();
      return;
    }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(p)] || 'application/octet-stream' });
    fs.createReadStream(p).pipe(res);
  });
  return new Promise((resolve) => server.listen(0, '127.0.0.1', () => resolve(server)));
}

function run(cmd, args, opts = {}) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args, { stdio: ['ignore', 'inherit', 'inherit'], ...opts });
    p.on('exit', (code) => (code === 0 ? resolve() : reject(new Error(`${cmd} exited ${code}`))));
  });
}

async function renderClip(page, cdp, base, clip) {
  await page.goto(`${base}/index.html?clip=${clip}`);
  await page.waitForFunction(() => window.__ready === true, null, { timeout: 60000 });
  const duration = await page.evaluate(() => window.__duration);
  if (stills) {
    const dir = path.join(BUILD, 'stills');
    fs.mkdirSync(dir, { recursive: true });
    const times = stills === 'auto' ? Array.from({ length: 8 }, (_, i) => +((i + 0.5) * duration / 8).toFixed(2)) : stills.split(',').map(Number);
    for (const t of times) {
      await page.evaluate((x) => window.__seek(x), t);
      await page.screenshot({ path: path.join(dir, `${clip}_${t.toFixed(2)}.png`) });
    }
    console.log(`${clip}: stills at ${times.join(', ')} (duration ${duration.toFixed(2)})`);
    return;
  }
  const frames = Math.round(duration * FPS);
  const out = path.join(SEG, `${clip}.mp4`);
  const ff = spawn('ffmpeg', ['-v', 'error', '-y', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '20', '-tune', 'animation', '-pix_fmt', 'yuv420p',
    '-r', String(FPS), '-g', String(FPS * 4), out + '.tmp.mp4'], { stdio: ['pipe', 'inherit', 'inherit'] });
  const done = new Promise((resolve, reject) => ff.on('exit', (c) => (c === 0 ? resolve() : reject(new Error('ffmpeg ' + c)))));
  let prevSig = null;
  let prevBuf = null;
  let shots = 0;
  const t0 = Date.now();
  for (let f = 0; f < frames; f++) {
    const sig = await page.evaluate((t) => window.__seek(t), f / FPS);
    if (sig !== prevSig) {
      const { data } = await cdp.send('Page.captureScreenshot', { format: 'jpeg', quality: 93, optimizeForSpeed: true });
      prevBuf = Buffer.from(data, 'base64');
      prevSig = sig;
      shots++;
    }
    if (!ff.stdin.write(prevBuf)) await new Promise((r) => ff.stdin.once('drain', r));
  }
  ff.stdin.end();
  await done;
  fs.renameSync(out + '.tmp.mp4', out);
  const secs = (Date.now() - t0) / 1000;
  console.log(`${clip}: ${frames} frames (${shots} captured) in ${secs.toFixed(0)}s`);
  return { clip, frames };
}

async function renderAll() {
  fs.mkdirSync(SEG, { recursive: true });
  const server = await serve();
  const base = `http://127.0.0.1:${server.address().port}`;
  const browser = await chromium.launch({ args: ['--font-render-hinting=none', '--force-color-profile=srgb'] });
  const queue = [...todo];
  const errors = [];
  await Promise.all(Array.from({ length: Math.min(WORKERS, queue.length) }, async () => {
    const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
    const cdp = await page.context().newCDPSession(page);
    while (queue.length) {
      const clip = queue.shift();
      try {
        await renderClip(page, cdp, base, clip);
      } catch (e) {
        errors.push(`${clip}: ${e.message}`);
      }
    }
  }));
  await browser.close();
  server.close();
  if (errors.length) {
    console.error('errors:\n' + errors.join('\n'));
    process.exitCode = 1;
  }
}

function probeFrames(file) {
  return new Promise((resolve, reject) => {
    const p = spawn('ffprobe', ['-v', 'error', '-count_packets', '-select_streams', 'v:0', '-show_entries', 'stream=nb_read_packets', '-of', 'csv=p=0', file]);
    let s = '';
    p.stdout.on('data', (d) => (s += d));
    p.on('exit', (c) => (c === 0 ? resolve(parseInt(s, 10)) : reject(new Error('ffprobe ' + file))));
  });
}

// Join clips into one video per part and one full video, with the audio.
async function join() {
  fs.mkdirSync(OUT, { recursive: true });
  const groups = [
    ...PARTS.map((p, i) => ({ name: `section-01-part-${i + 1}`, clips: p.clips })),
    { name: 'section-01-full', clips: ORDER },
  ];
  for (const g of groups) {
    const list = path.join(BUILD, `${g.name}.txt`);
    fs.writeFileSync(list, g.clips.map((c) => `file '${path.join(SEG, c + '.mp4')}'`).join('\n') + '\n');
    const inputs = [];
    const filters = [];
    let i = 1;
    for (const c of g.clips) {
      const secs = (await probeFrames(path.join(SEG, c + '.mp4'))) / FPS;
      const wav = path.join(BUILD, 'audio', `${c}.wav`);
      if (fs.existsSync(wav)) inputs.push('-i', wav);
      else inputs.push('-f', 'lavfi', '-t', String(secs), '-i', 'anullsrc=r=48000:cl=mono');
      filters.push(`[${i}:a]aresample=48000,apad,atrim=0:${secs.toFixed(6)}[a${i}]`);
      i++;
    }
    const n = g.clips.length;
    const fc = filters.join(';') + ';' + Array.from({ length: n }, (_, k) => `[a${k + 1}]`).join('') + `concat=n=${n}:v=0:a=1[a]`;
    await run('ffmpeg', ['-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', list, ...inputs,
      '-filter_complex', fc, '-map', '0:v', '-map', '[a]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '160k', '-ac', '1',
      '-movflags', '+faststart', path.join(OUT, `${g.name}.mp4`)]);
    console.log(`wrote output/${g.name}.mp4`);
  }
}

if (todo.length) await renderAll();
if (!stills && (joinOnly || !clips.length)) await join();
