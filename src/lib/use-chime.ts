'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { buildChimeDataUri } from '@/lib/chime-wav';

const STORAGE_KEY = 'kh_notification_sound';

export type SoundStatus = 'unknown' | 'ready' | 'blocked' | 'muted';

/**
 * Plays a chime when a notification arrives.
 *
 * `play()` resolves to true only when audio actually reached the speakers, so
 * the UI can tell the user when the browser has blocked it.
 */
export function useChime() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [enabled, setEnabled] = useState(true);
  const [status, setStatus] = useState<SoundStatus>('unknown');

  useEffect(() => {
    const muted = window.localStorage.getItem(STORAGE_KEY) === 'off';
    setEnabled(!muted);
    if (muted) setStatus('muted');
  }, []);

  const element = useCallback(() => {
    if (!audioRef.current) {
      const audio = new Audio(buildChimeDataUri());
      audio.volume = 0.6;
      audio.preload = 'auto';
      audioRef.current = audio;
    }
    return audioRef.current;
  }, []);

  /** Web Audio fallback for browsers that refuse the data-URI element. */
  const playViaWebAudio = useCallback(() => {
    try {
      const Ctor =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (!Ctor) return false;

      const context = new Ctor();
      void context.resume();

      [
        { frequency: 880, at: 0 },
        { frequency: 1174.7, at: 0.18 },
      ].forEach(({ frequency, at }) => {
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        oscillator.type = 'sine';
        oscillator.frequency.value = frequency;
        const start = context.currentTime + at;
        gain.gain.setValueAtTime(0.0001, start);
        gain.gain.exponentialRampToValueAtTime(0.25, start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.45);
        oscillator.connect(gain).connect(context.destination);
        oscillator.start(start);
        oscillator.stop(start + 0.5);
      });

      setTimeout(() => void context.close(), 1200);
      return true;
    } catch {
      return false;
    }
  }, []);

  const play = useCallback(async (): Promise<boolean> => {
    if (!enabled) {
      setStatus('muted');
      return false;
    }

    try {
      const audio = element();
      audio.currentTime = 0;
      await audio.play();
      setStatus('ready');
      return true;
    } catch {
      // Autoplay blocked or the element failed — try Web Audio.
      const ok = playViaWebAudio();
      setStatus(ok ? 'ready' : 'blocked');
      return ok;
    }
  }, [element, enabled, playViaWebAudio]);

  // Warm the element up on the first interaction so later chimes are allowed.
  useEffect(() => {
    if (!enabled) return;

    function unlock() {
      const audio = element();
      const previousVolume = audio.volume;
      audio.volume = 0;
      audio
        .play()
        .then(() => {
          audio.pause();
          audio.currentTime = 0;
          audio.volume = previousVolume;
          setStatus('ready');
        })
        .catch(() => {
          audio.volume = previousVolume;
        });
    }

    window.addEventListener('pointerdown', unlock, { once: true });
    window.addEventListener('keydown', unlock, { once: true });
    return () => {
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
    };
  }, [element, enabled]);

  const toggle = useCallback(() => {
    setEnabled((current) => {
      const next = !current;
      window.localStorage.setItem(STORAGE_KEY, next ? 'on' : 'off');
      setStatus(next ? 'unknown' : 'muted');
      return next;
    });
  }, []);

  return { play, enabled, toggle, status };
}
