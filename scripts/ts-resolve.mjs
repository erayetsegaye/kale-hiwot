/**
 * Test-only module resolver.
 *
 * Lets the verification scripts import application modules directly, the way
 * Next does: `@/…` maps to `src/…`, and extensionless relative imports get a
 * `.ts`/`.tsx` extension. Keeps the app code free of test-driven compromises.
 */
import { register } from 'node:module';
import { pathToFileURL } from 'node:url';
import { dirname, resolve as resolvePath } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const srcRoot = resolvePath(here, '..', 'src');

// Static imports inside the hook: a dynamic import here would re-enter the
// resolver and blow the stack.
const hookSource = `
import { existsSync } from 'node:fs';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const srcRoot = ${JSON.stringify(srcRoot)};
const EXTENSIONS = ['.ts', '.tsx', '/index.ts', '/index.tsx'];

function firstExisting(base) {
  for (const ext of ['', ...EXTENSIONS]) {
    if (ext === '' ) continue;
    if (existsSync(base + ext)) return base + ext;
  }
  return null;
}

export function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith('@/')) {
    const hit = firstExisting(join(srcRoot, specifier.slice(2)));
    if (hit) return { url: pathToFileURL(hit).href, shortCircuit: true };
  }

  if (specifier.startsWith('.') && context.parentURL && context.parentURL.startsWith('file:')) {
    const hit = firstExisting(join(dirname(fileURLToPath(context.parentURL)), specifier));
    if (hit) return { url: pathToFileURL(hit).href, shortCircuit: true };
  }

  return nextResolve(specifier, context);
}
`;

register(`data:text/javascript,${encodeURIComponent(hookSource)}`, pathToFileURL('./'));
