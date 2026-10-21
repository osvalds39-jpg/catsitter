import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const base = path.join(root, 'dist');
const port = Number(process.env.PORT ?? 4173);

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
};

/* Lê o _headers do Cloudflare Pages e replica as regras localmente */
async function loadHeaderRules() {
  const rules = [];
  try {
    const raw = await fs.readFile(path.join(base, '_headers'), 'utf8');
    let pattern = null;
    let headers = [];

    const flush = () => {
      if (pattern) rules.push({ pattern, headers });
      pattern = null;
      headers = [];
    };

    for (const line of raw.split(/\r?\n/)) {
      if (!line.trim() || line.trim().startsWith('#')) continue;
      if (!/^\s/.test(line)) {
        flush();
        pattern = line.trim();
      } else {
        const idx = line.indexOf(':');
        if (idx > 0) headers.push([line.slice(0, idx).trim(), line.slice(idx + 1).trim()]);
      }
    }
    flush();
  } catch {
    /* sem _headers: segue sem regras */
  }
  return rules;
}

function matchPattern(pattern, pathname) {
  if (pattern === '/*') return true;
  if (pattern.endsWith('/*')) return pathname.startsWith(pattern.slice(0, -1));
  if (pattern.includes('*')) {
    const rx = new RegExp('^' + pattern.split('*').map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('.*') + '$');
    return rx.test(pathname);
  }
  return pathname === pattern;
}

const rules = await loadHeaderRules();

http
  .createServer(async (req, res) => {
    try {
      const url = new URL(req.url, `http://${req.headers.host}`);
      const pathname = decodeURIComponent(url.pathname);
      let file = path.join(base, pathname);
      if ((await fs.stat(file).catch(() => null))?.isDirectory()) file = path.join(file, 'index.html');

      const headers = { 'Content-Type': MIME[path.extname(file).toLowerCase()] ?? 'application/octet-stream' };

      for (const rule of rules) {
        if (matchPattern(rule.pattern, pathname)) {
          for (const [key, value] of rule.headers) headers[key] = value;
        }
      }

      const body = await fs.readFile(file);
      res.writeHead(200, headers);
      res.end(body);
    } catch {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404');
    }
  })
  .listen(port, () => console.log(`servindo dist/ em http://localhost:${port} (regras do _headers aplicadas)`));
