#!/usr/bin/env node
/**
 * Startup API runner — called by `npm run dev` via concurrently.
 * Detects the actual Next.js port, then triggers current-affairs + quiz
 * generation for today. Retries until the server is ready.
 */

const http  = require('http');
const https = require('https');
const fs    = require('fs');
const path  = require('path');

// ── Read CRON_SECRET from .env.local if not in environment ──────────────────
function readEnvLocal() {
  try {
    const envFile = path.join(__dirname, '..', '.env.local');
    const lines   = fs.readFileSync(envFile, 'utf-8').split('\n');
    for (const line of lines) {
      const m = line.match(/^CRON_SECRET\s*=\s*(.+)$/);
      if (m) return m[1].trim().replace(/^['"]|['"]$/g, '');
    }
  } catch { /* file not found is fine */ }
  return null;
}

const CRON_SECRET = process.env.CRON_SECRET
  || readEnvLocal()
  || 'e28224740808590b7506a930488bec551ca5b56b2b66224af0a89669474bd8da';

// ── Helpers ──────────────────────────────────────────────────────────────────
const C = {
  reset:  '\x1b[0m',
  bold:   '\x1b[1m',
  green:  '\x1b[32m',
  blue:   '\x1b[34m',
  yellow: '\x1b[33m',
  red:    '\x1b[31m',
  cyan:   '\x1b[36m',
};
const log = (color, ...a) => console.log(`${color}[APIs]${C.reset}`, ...a);
const sleep = ms => new Promise(r => setTimeout(r, ms));

// ── Check if a port is listening ─────────────────────────────────────────────
function isPortUp(port) {
  return new Promise(resolve => {
    const req = http.get(`http://localhost:${port}/api/auth/login`, { timeout: 2000 }, res => {
      req.destroy();
      resolve(true);
    });
    req.on('error', () => resolve(false));
    req.on('timeout', () => { req.destroy(); resolve(false); });
  });
}

// ── Detect actual Next.js port ────────────────────────────────────────────────
async function detectPort(maxWaitMs = 60_000) {
  const start = Date.now();
  log(C.yellow, 'Waiting for Next.js server to start…');
  while (Date.now() - start < maxWaitMs) {
    for (const port of [3000, 3001, 3002]) {
      if (await isPortUp(port)) {
        log(C.green, `✓ Server detected on port ${port}`);
        return port;
      }
    }
    await sleep(2000);
  }
  throw new Error('Server did not start within 60 s');
}

// ── Call one API endpoint (with retry) ────────────────────────────────────────
async function callAPI(port, urlPath, label, retries = 2) {
  const sep  = urlPath.includes('?') ? '&' : '?';
  const full = `http://localhost:${port}${urlPath}${sep}secret=${CRON_SECRET}`;
  log(C.cyan, `→ ${label}`);

  for (let attempt = 1; attempt <= retries; attempt++) {
    const ok = await new Promise(resolve => {
      const req = http.get(full, {
        headers: { 'x-cron-secret': CRON_SECRET },
        timeout: 120_000,
      }, res => {
        let body = '';
        res.on('data', c => { body += c; });
        res.on('end', () => {
          if (res.statusCode === 200 || res.statusCode === 201) {
            try {
              const j = JSON.parse(body);
              if (j.ok === false) {
                log(C.yellow, `  ⚠️  ${label} — ${j.reason || j.error || 'api returned ok:false'}`);
              } else {
                log(C.green, `  ✅ ${label} — ${body.slice(0, 120)}`);
              }
            } catch {
              log(C.green, `  ✅ ${label} (${res.statusCode})`);
            }
            resolve(true);
          } else {
            log(C.yellow, `  ⚠️  ${label} — HTTP ${res.statusCode}`);
            resolve(false);
          }
        });
      });
      req.on('error', err => {
        log(C.red, `  ❌ ${label} — ${err.message}`);
        resolve(false);
      });
      req.on('timeout', () => { req.destroy(); resolve(false); });
    });

    if (ok) return;
    if (attempt < retries) {
      log(C.yellow, `  Retrying in 5 s… (${attempt}/${retries})`);
      await sleep(5000);
    }
  }
}

// ── Check if today's data already exists ─────────────────────────────────────
function todayStr() { return new Date().toISOString().slice(0, 10); }

function quizExistsForToday() {
  try {
    const data = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'quizzes.json'), 'utf-8'));
    const today = todayStr();
    return data.some(q => q.date === today && Array.isArray(q.items) && q.items.length >= 20);
  } catch { return false; }
}

function currentAffairsExistsForToday() {
  try {
    const data = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'posts.json'), 'utf-8'));
    const today = todayStr();
    return data.some(p => p.date === today && Array.isArray(p.articles) && p.articles.length > 0);
  } catch { return false; }
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  log(C.bold, '🚀 DailyTutors API Runner started');
  log(C.blue,  `   CRON_SECRET: ${CRON_SECRET.slice(0, 12)}…`);

  let port;
  try {
    port = await detectPort();
  } catch (e) {
    log(C.red, '❌ ' + e.message);
    process.exit(1);
  }

  console.log('');
  log(C.bold, '📋 Initial setup:');

  // Current Affairs — always refresh on startup
  log(C.blue, '  Current Affairs:');
  if (currentAffairsExistsForToday()) {
    log(C.green, '  ✓ Already fetched for today — refreshing anyway');
  }
  await callAPI(port, '/api/current-affairs/refresh', 'Current Affairs Refresh');
  await sleep(2000);
  await callAPI(port, '/api/cron/daily-affairs',      'Daily Affairs Generation');
  await sleep(2000);

  // Quiz — only generate if missing for today
  log(C.blue, '  Daily Quiz:');
  if (quizExistsForToday()) {
    log(C.green, '  ✓ Quiz already generated for today — skipping');
  } else {
    await callAPI(port, '/api/cron/daily-quiz?count=20', 'Daily Quiz Generation (20 Qs)');
  }

  console.log('');
  log(C.bold, '✨ Startup complete!\n');

  // ── Periodic re-runs ────────────────────────────────────────────────────────
  log(C.blue, '📅 Periodic schedule:');
  log(C.cyan, '   Current Affairs  — every 2 h');
  log(C.cyan, '   Daily Affairs    — every 6 h');
  log(C.cyan, '   Daily Quiz       — every 12 h (skips if already generated)\n');

  setInterval(() => {
    callAPI(port, '/api/current-affairs/refresh', 'Scheduled: Current Affairs Refresh');
  }, 2 * 60 * 60 * 1000);

  setInterval(() => {
    callAPI(port, '/api/cron/daily-affairs', 'Scheduled: Daily Affairs');
  }, 6 * 60 * 60 * 1000);

  setInterval(async () => {
    if (quizExistsForToday()) {
      log(C.cyan, '[Scheduled] Quiz already exists for today — skipping');
    } else {
      await callAPI(port, '/api/cron/daily-quiz?count=20', 'Scheduled: Daily Quiz');
    }
  }, 12 * 60 * 60 * 1000);
}

main().catch(err => {
  log(C.red, '❌ Fatal:', err.message);
  process.exit(1);
});
