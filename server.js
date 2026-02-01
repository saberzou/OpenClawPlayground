#!/usr/bin/env node
/**
 * Briefing Server - Serves static files and updates tools daily
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const PORT = process.env.PORT || 3000;
const STATIC_DIR = path.join(__dirname);
const TOOLS_SCRIPT = path.join(__dirname, 'scripts', 'fetch-tools.js');

// MIME types
const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

// Serve static file
function serveFile(filePath, res) {
  const ext = path.extname(filePath);
  const contentType = MIME_TYPES[ext] || 'text/plain';
  
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
}

// Create HTTP server
const server = http.createServer((req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  let filePath;
  if (req.url === '/' || req.url === '/index.html') {
    filePath = path.join(STATIC_DIR, 'index.html');
  } else if (req.url.startsWith('/data/')) {
    filePath = path.join(STATIC_DIR, req.url);
  } else if (req.url.startsWith('/scripts/')) {
    filePath = path.join(STATIC_DIR, req.url);
  } else if (req.url.startsWith('/css/')) {
    filePath = path.join(STATIC_DIR, req.url);
  } else {
    filePath = path.join(STATIC_DIR, req.url.split('?')[0]);
  }
  
  // Security: prevent directory traversal
  if (!filePath.startsWith(STATIC_DIR)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }
  
  serveFile(filePath, res);
});

// Fetch tools (called by cron or manually)
async function updateTools() {
  return new Promise((resolve) => {
    exec(`node ${TOOLS_SCRIPT}`, (err, stdout, stderr) => {
      if (err) {
        console.error('Fetch failed:', err.message);
        resolve(false);
      } else {
        console.log('Tools updated:', stdout);
        resolve(true);
      }
    });
  });
}

// Handle /update-tools endpoint
server.on('request', (req, res) => {
  if (req.url === '/update-tools') {
    updateTools().then(success => {
      res.writeHead(success ? 200 : 500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success }));
    });
    return;
  }
});

server.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════════╗
║  Briefing Server                             ║
║  ───────────────────────                     ║
║  Local:    http://localhost:${PORT}             ║
║  Update:   http://localhost:${PORT}/update-tools ║
║  ───────────────────────                     ║
║  Run 'node server.js' to start               ║
║  Add cron for daily auto-update:              ║
║  0 7 * * * node ${TOOLS_SCRIPT}              ║
╚══════════════════════════════════════════════════╝
  `);
});

// Auto-update on startup
updateTools();
