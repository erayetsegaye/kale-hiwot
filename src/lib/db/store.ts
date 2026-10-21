import { mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { tmpdir } from 'node:os';
import type { Database } from './types';
import { buildSeed } from './seed';

/**
 * The local database.
 *
 * A single JSON document on disk, written atomically. It is deliberately the
 * ONLY place application data lives: every dashboard reads it and every write
 * goes through it, so Admin / Teacher / Parent genuinely share one source of
 * truth. Swapping to Supabase later means replacing this module's callers in
 * `lib/data/queries.ts`, not touching any page.
 */

const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
const FILE = isServerless
  ? join(tmpdir(), 'kale-hiwot-db.json')
  : join(process.cwd(), '.data', 'ministry-db.json');

let cache: Database | null = null;
let cacheStamp = 0;

/** Re-read from disk at most this often (ms) — dev runs several workers. */
const CACHE_MS = 250;

function load(): Database {
  try {
    const raw = readFileSync(FILE, 'utf8');
    const parsed = JSON.parse(raw) as Database;
    // A seed version bump re-seeds, so schema changes don't leave stale shapes.
    if (parsed.version === buildSeed().version) return parsed;
  } catch {
    // No database yet — fall through and seed one.
  }

  const seeded = buildSeed();
  persist(seeded);
  return seeded;
}

function persist(db: Database) {
  cache = db;
  cacheStamp = Date.now();

  try {
    mkdirSync(dirname(FILE), { recursive: true });
    // Write to a temp file then rename: a crash can never leave a half file.
    const temp = `${FILE}.tmp`;
    writeFileSync(temp, JSON.stringify(db, null, 2), 'utf8');
    renameSync(temp, FILE);
  } catch (error) {
    // In restricted or read-only environments, retain in memory
    console.warn('Failed to persist database to disk, keeping in memory cache:', error);
  }
}

/** Read the whole database (cached briefly). */
export function readDb(): Database {
  if (cache && Date.now() - cacheStamp < CACHE_MS) return cache;
  cache = load();
  cacheStamp = Date.now();
  return cache;
}

/**
 * Apply a change and save it.
 *
 * Always re-reads first so concurrent requests cannot overwrite each other
 * with a stale snapshot.
 */
export function writeDb<T>(mutate: (db: Database) => T): T {
  cache = null; // force a fresh read
  const db = load();
  const result = mutate(db);
  persist(db);
  return result;
}

/** Throw the database away and re-seed — used by tests and the reset action. */
export function resetDb(): Database {
  const seeded = buildSeed();
  persist(seeded);
  return seeded;
}

export function newId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}
