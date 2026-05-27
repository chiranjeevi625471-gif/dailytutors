#!/usr/bin/env node

/**
 * API Runner Script
 * Automatically triggers Daily Affairs and Daily Quiz APIs
 * Runs when `npm run dev` is executed
 */

const http = require('http');

const CRON_SECRET = process.env.CRON_SECRET || 'e28224740808590b7506a930488bec551ca5b56b2b66224af0a89669474bd8da';
const BASE_URL = 'http://localhost:3000';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

function log(color, ...args) {
  console.log(`${color}[APIs]${colors.reset}`, ...args);
}

function callAPI(path, description) {
  return new Promise((resolve) => {
    const url = `${BASE_URL}${path}${path.includes('?') ? '&' : '?'}secret=${CRON_SECRET}`;
    
    log(colors.cyan, `Calling: ${description}...`);
    
    http.get(url, { headers: { 'x-cron-secret': CRON_SECRET } }, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode === 200 || res.statusCode === 201) {
          log(colors.green, `✅ ${description} (${res.statusCode})`);
        } else {
          log(colors.yellow, `⚠️  ${description} (${res.statusCode})`);
        }
        resolve();
      });
    }).on('error', (err) => {
      log(colors.red, `❌ ${description} - Server not ready yet. Will retry...`);
      resolve();
    });
  });
}

async function initializeAPIs() {
  log(colors.bright, '🚀 API Runner Started');
  log(colors.blue, `CRON_SECRET: ${CRON_SECRET.substring(0, 16)}...`);
  log(colors.yellow, 'Waiting 5 seconds for server to start...\n');
  
  // Wait for server to start
  await new Promise(r => setTimeout(r, 5000));
  
  // Run initial sync
  log(colors.bright, '\n📋 Running initial API setup...\n');
  await callAPI('/api/current-affairs/refresh', 'Current Affairs Refresh');
  await new Promise(r => setTimeout(r, 2000));
  
  await callAPI('/api/cron/daily-affairs', 'Daily Affairs Generation');
  await new Promise(r => setTimeout(r, 2000));
  
  await callAPI('/api/cron/daily-quiz?count=20', 'Daily Quiz Generation (20 questions)');
  
  log(colors.bright, '\n✨ API initialization complete!\n');
  
  // Schedule periodic runs
  log(colors.blue, '📅 Scheduling periodic API calls:');
  log(colors.cyan, '   • Current Affairs: Every 2 hours');
  log(colors.cyan, '   • Daily Affairs: Every 6 hours');
  log(colors.cyan, '   • Daily Quiz: Every 12 hours\n');
  
  // Current Affairs - every 2 hours
  setInterval(() => {
    log(colors.yellow, '[Scheduled] Running Current Affairs Refresh...');
    callAPI('/api/current-affairs/refresh', 'Scheduled: Current Affairs');
  }, 2 * 60 * 60 * 1000);
  
  // Daily Affairs - every 6 hours
  setInterval(() => {
    log(colors.yellow, '[Scheduled] Running Daily Affairs Generation...');
    callAPI('/api/cron/daily-affairs', 'Scheduled: Daily Affairs');
  }, 6 * 60 * 60 * 1000);
  
  // Daily Quiz - every 12 hours
  setInterval(() => {
    log(colors.yellow, '[Scheduled] Running Daily Quiz Generation...');
    callAPI('/api/cron/daily-quiz?count=20', 'Scheduled: Daily Quiz');
  }, 12 * 60 * 60 * 1000);
}

initializeAPIs();
