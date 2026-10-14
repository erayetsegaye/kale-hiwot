/**
 * Logo asset pipeline.
 *
 * Source of truth: `public/brand/logo-original.jpg` (an untouched copy of the
 * church logo that was already in the project — `11.jfif` at the repo root).
 * The original file is NEVER modified.
 *
 * This script derives two theme-friendly assets from it:
 *
 *  1. `logo-transparent.png` — the logo with its flat white background knocked
 *     out (original colours preserved). Used wherever the full-colour mark is
 *     wanted on a coloured surface.
 *
 *  2. `logo-mask.png` — an alpha-only silhouette of the mark. The <Logo>
 *     component paints it with `mask-image` + a CSS variable, so the brand
 *     colour can be changed at any time from the design tokens without ever
 *     touching the logo file.
 *
 * Run with:  npm run logo:generate
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import jpeg from 'jpeg-js';
import { PNG } from 'pngjs';

const here = dirname(fileURLToPath(import.meta.url));
const brandDir = resolve(here, '..', 'public', 'brand');

const raw = jpeg.decode(readFileSync(resolve(brandDir, 'logo-original.jpg')), {
  useTArray: true,
});

const { width, height, data } = raw;

/** 0 = fully transparent (white paper), 1 = fully opaque (ink). */
function inkAt(i) {
  const min = Math.min(data[i], data[i + 1], data[i + 2]);
  // Small tolerance so JPEG noise around the artwork stays clean.
  const a = 1 - min / 248;
  return a <= 0.02 ? 0 : Math.min(1, a);
}

const transparent = new PNG({ width, height });
const mask = new PNG({ width, height });

for (let i = 0; i < data.length; i += 4) {
  const a = inkAt(i);
  const alpha = Math.round(a * 255);

  // Un-premultiply against the white background so colours stay true.
  for (let c = 0; c < 3; c += 1) {
    const value = a === 0 ? 255 : (data[i + c] - 255 * (1 - a)) / a;
    transparent.data[i + c] = Math.max(0, Math.min(255, Math.round(value)));
  }
  transparent.data[i + 3] = alpha;

  // Mask: colour is irrelevant, only the alpha channel is read by CSS.
  mask.data[i] = 0;
  mask.data[i + 1] = 0;
  mask.data[i + 2] = 0;
  mask.data[i + 3] = alpha;
}

writeFileSync(resolve(brandDir, 'logo-transparent.png'), PNG.sync.write(transparent));
writeFileSync(resolve(brandDir, 'logo-mask.png'), PNG.sync.write(mask));

// --- Console preview so the result can be sanity-checked without an image viewer.
const cols = 56;
const rows = Math.round((cols * height) / width / 2);
const ramp = ' .:-=+*#%@';
let preview = '';
for (let y = 0; y < rows; y += 1) {
  for (let x = 0; x < cols; x += 1) {
    const sx = Math.floor((x / cols) * width);
    const sy = Math.floor((y / rows) * height);
    const i = (sy * width + sx) * 4;
    preview += ramp[Math.min(ramp.length - 1, Math.floor(inkAt(i) * ramp.length))];
  }
  preview += '\n';
}

console.log(`source: ${width}x${height}`);
console.log(preview);
console.log('wrote public/brand/logo-transparent.png and public/brand/logo-mask.png');
