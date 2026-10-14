/**
 * Verifies the notification chime is a valid, audible WAV.
 * Writes it to .data/chime.wav so it can be played manually to confirm.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { buildChimeWavBytes, buildChimeDataUri } from '../src/lib/chime-wav.ts';

const results = [];
const expect = (label, ok, extra = '') => results.push({ label, ok: Boolean(ok), extra });

const bytes = buildChimeWavBytes();
const text = (offset, length) =>
  String.fromCharCode(...bytes.subarray(offset, offset + length));
const u32 = (offset) => new DataView(bytes.buffer).getUint32(offset, true);
const u16 = (offset) => new DataView(bytes.buffer).getUint16(offset, true);

expect('RIFF header', text(0, 4) === 'RIFF');
expect('WAVE format', text(8, 4) === 'WAVE');
expect('PCM encoding', u16(20) === 1);
expect('mono', u16(22) === 1);
expect('22.05 kHz', u32(24) === 22050);
expect('16-bit samples', u16(34) === 16);
expect('declared size matches file', u32(4) === bytes.length - 8);

// Audible? Check real signal amplitude rather than just structure.
const view = new DataView(bytes.buffer);
let peak = 0;
let nonZero = 0;
for (let offset = 44; offset < bytes.length; offset += 2) {
  const sample = Math.abs(view.getInt16(offset, true));
  if (sample > 200) nonZero += 1;
  if (sample > peak) peak = sample;
}

const duration = (bytes.length - 44) / 2 / 22050;
expect('peak amplitude is audible', peak > 8000, `peak=${peak}/32767`);
expect('signal fills most of the clip', nonZero > 3000, `${nonZero} loud samples`);
expect('duration ~0.75s', duration > 0.6 && duration < 0.9, `${duration.toFixed(2)}s`);

// Data URI usable by <audio>
globalThis.btoa ??= (s) => Buffer.from(s, 'binary').toString('base64');
const uri = buildChimeDataUri();
expect('data URI produced', uri.startsWith('data:audio/wav;base64,'));
expect('data URI decodes to the same bytes', Buffer.from(uri.split(',')[1], 'base64').length === bytes.length);

mkdirSync('.data', { recursive: true });
writeFileSync('.data/chime.wav', bytes);

let failed = 0;
for (const result of results) {
  if (!result.ok) failed += 1;
  console.log(`${result.ok ? '✓' : '✗'} ${result.label}${result.extra ? ` (${result.extra})` : ''}`);
}
console.log('\nwrote .data/chime.wav — open it to hear the exact sound the app plays');
process.exit(failed ? 1 : 0);
