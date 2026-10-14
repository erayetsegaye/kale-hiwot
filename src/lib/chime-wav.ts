/**
 * Builds the notification chime as a real WAV file (data URI), generated in
 * the browser so there is no audio asset to ship.
 *
 * Kept free of React and of `window` so it can be unit-tested directly.
 */

let cached: string | null = null;

/** Two soft notes — A5 then D6 — a gentle "ding-dong", not an alarm. */
const NOTES = [
  { frequency: 880, start: 0, length: 0.45 },
  { frequency: 1174.7, start: 0.18, length: 0.55 },
];

const SAMPLE_RATE = 22050;
const SECONDS = 0.75;

export function buildChimeWavBytes(): Uint8Array {
  const total = Math.floor(SAMPLE_RATE * SECONDS);
  const samples = new Int16Array(total);

  for (let i = 0; i < total; i += 1) {
    const t = i / SAMPLE_RATE;
    let value = 0;

    for (const note of NOTES) {
      const local = t - note.start;
      if (local < 0 || local > note.length) continue;
      const attack = Math.min(1, local / 0.008); // quick fade-in, no click
      const decay = Math.exp(-local * 6);
      value += Math.sin(2 * Math.PI * note.frequency * local) * attack * decay * 0.4;
    }

    samples[i] = Math.max(-1, Math.min(1, value)) * 0x7fff;
  }

  const bytesPerSample = 2;
  const buffer = new ArrayBuffer(44 + samples.length * bytesPerSample);
  const view = new DataView(buffer);

  const ascii = (offset: number, text: string) => {
    for (let i = 0; i < text.length; i += 1) {
      view.setUint8(offset + i, text.charCodeAt(i));
    }
  };

  ascii(0, 'RIFF');
  view.setUint32(4, 36 + samples.length * bytesPerSample, true);
  ascii(8, 'WAVE');
  ascii(12, 'fmt ');
  view.setUint32(16, 16, true); // PCM header size
  view.setUint16(20, 1, true); // format: PCM
  view.setUint16(22, 1, true); // channels: mono
  view.setUint32(24, SAMPLE_RATE, true);
  view.setUint32(28, SAMPLE_RATE * bytesPerSample, true); // byte rate
  view.setUint16(32, bytesPerSample, true); // block align
  view.setUint16(34, 16, true); // bits per sample
  ascii(36, 'data');
  view.setUint32(40, samples.length * bytesPerSample, true);

  for (let i = 0; i < samples.length; i += 1) {
    view.setInt16(44 + i * bytesPerSample, samples[i], true);
  }

  return new Uint8Array(buffer);
}

export function buildChimeDataUri(): string {
  if (cached) return cached;

  const bytes = buildChimeWavBytes();
  let binary = '';
  for (let i = 0; i < bytes.length; i += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  }

  cached = `data:audio/wav;base64,${btoa(binary)}`;
  return cached;
}
