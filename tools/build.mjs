import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');

const ROOT_FILES = [
  'index.html',
  '_headers',
  '_redirects',
  'robots.txt',
  'sitemap.xml',
  'manifest.webmanifest',
  'favicon.svg',
];

const DIRS = ['assets', 'data'];

const SKIP = new Set(['_credits.json', 'CREDITOS.md', '.DS_Store']);

async function copyDir(src, dest) {
  await fs.mkdir(dest, { recursive: true });
  for (const entry of await fs.readdir(src, { withFileTypes: true })) {
    if (SKIP.has(entry.name)) continue;
    const from = path.join(src, entry.name);
    const to = path.join(dest, entry.name);
    if (entry.isDirectory()) await copyDir(from, to);
    else await fs.copyFile(from, to);
  }
}

async function exists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

await fs.rm(dist, { recursive: true, force: true });
await fs.mkdir(dist, { recursive: true });

for (const file of ROOT_FILES) {
  const from = path.join(root, file);
  if (!(await exists(from))) {
    console.warn(`  ! ignorado (não existe): ${file}`);
    continue;
  }
  await fs.copyFile(from, path.join(dist, file));
}

for (const dir of DIRS) {
  const from = path.join(root, dir);
  if (!(await exists(from))) {
    console.warn(`  ! ignorado (não existe): ${dir}/`);
    continue;
  }
  await copyDir(from, path.join(dist, dir));
}

let files = 0;
let bytes = 0;
async function walk(dir) {
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(p);
    else {
      files++;
      bytes += (await fs.stat(p)).size;
    }
  }
}
await walk(dist);

console.log(`build ok -> dist/  (${files} arquivos, ${(bytes / 1024).toFixed(0)} KB)`);
console.log('abrir com: npm run dev  (http://localhost:4173)');
