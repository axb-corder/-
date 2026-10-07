// 30초 영상 렌더링: node render.js [출력파일] [--fps 30] [--stills 0,8,14.4,...]
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { startServer } from './serve.js';

const require = createRequire(import.meta.url);
let chromium;
try {
  ({ chromium } = require('playwright'));
} catch {
  ({ chromium } = require(process.env.PLAYWRIGHT_PATH || '/opt/node-tools/node_modules/playwright'));
}

const args = process.argv.slice(2);
const opt = (name, def) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : def;
};
const out = args.find((a, i) => !a.startsWith('--') && !(args[i - 1] || '').startsWith('--')) || 'suncheon-flyover.mp4';
const FPS = Number(opt('--fps', 30));
const stills = opt('--stills', null);
const PORT = 5199;

const server = await startServer(PORT);
const browser = await chromium.launch({
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'],
});
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
page.on('pageerror', (e) => console.error('page error:', e.message));
await page.goto(`http://localhost:${PORT}/?render`);
await page.waitForFunction(() => window.READY === true, null, { timeout: 120000 });
const stageClip = { x: 0, y: 0, width: 1920, height: 1080 };

async function frame(t) {
  await page.evaluate((tt) => window.renderAt(tt), t);
  return page.screenshot({ type: 'png', clip: stageClip });
}

if (stills) {
  for (const s of stills.split(',').map(Number)) {
    const name = `${out.replace(/\.mp4$/, '')}_t${String(s).replace('.', '_')}.png`;
    await import('node:fs').then((fs) => frame(s).then((b) => fs.writeFileSync(name, b)));
    console.log('저장', name);
  }
} else {
  const total = Math.round((await page.evaluate(() => window.DURATION)) * FPS);
  const ff = spawn('ffmpeg', [
    '-y', '-loglevel', 'error',
    '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-pix_fmt', 'yuv420p',
    '-movflags', '+faststart', out,
  ], { stdio: ['pipe', 'inherit', 'inherit'] });
  const started = Date.now();
  for (let i = 0; i < total; i++) {
    const buf = await frame(i / FPS);
    if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once('drain', r));
    if (i % 30 === 0) {
      const sec = (Date.now() - started) / 1000;
      console.log(`프레임 ${i}/${total}  (${sec.toFixed(0)}초 경과)`);
    }
  }
  ff.stdin.end();
  await new Promise((r) => ff.on('close', r));
  console.log('완성:', out);
}

await browser.close();
server.close();
