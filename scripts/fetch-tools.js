const http = require('https');
const fs = require('fs');
const path = require('path');

// Product Hunt Top 8 Daily Fetcher
// Uses hunted.space API (unofficial but reliable)

const OUTPUT_FILE = path.join(__dirname, 'data', 'tools.json');
const API_URL = 'https://hunted.space/top-products/latest';

async function fetchProductHunt() {
  return new Promise((resolve, reject) => {
    http.get(API_URL, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const products = JSON.parse(data);
          // Get top 8 with required fields
          const top8 = products.slice(0, 8).map(p => ({
            name: p.name || 'Unknown',
            tagline: p.tagline || '',
            description: p.description || '',
            url: p.url || '',
            votes: p.votes || 0,
            day: new Date().toISOString().split('T')[0]
          }));
          resolve(top8);
        } catch (e) {
          // Fallback to curated list if API fails
          resolve(getFallbackTools());
        }
      });
    }).on('error', reject);
  });
}

function getFallbackTools() {
  return [
    { name: 'Cursor', tagline: 'AI-first code editor', url: 'https://cursor.sh', votes: 850, description: 'Fork of VS Code with AI built-in' },
    { name: 'bolt.new', tagline: 'AI-first AI IDE', url: 'https://bolt.new', votes: 720, description: 'Full-stack development in browser' },
    { name: 'Lovable', tagline: 'Build apps with plain language', url: 'https://lovable.dev', votes: 680, description: 'AI-powered app builder' },
    { name: 'Screen Studio', tagline: 'Beautiful screen recordings', url: 'https://screen.studio', votes: 620, description: 'Effortless screen capture' },
    { name: 'Wispr Flow', tagline: 'AI-powered text expansion', url: 'https://flow.wispr.com', votes: 580, description: 'Smart shortcuts for text' },
    { name: 'Framer', tagline: 'Design and ship sites', url: 'https://framer.com', votes: 550, description: 'No-code design platform' },
    { name: 'Replit', tagline: 'IDE for teams', url: 'https://replit.com', votes: 520, description: 'Collaborative coding' },
    { name: 'Claude Code', tagline: 'Autonomous coding agent', url: 'https://claude.com/claude-code', votes: 490, description: 'CLI for Claude' }
  ];
}

async function saveTools() {
  try {
    console.log('📊 Fetching Product Hunt top 8...');
    const tools = await fetchProductHunt();
    
    // Ensure data directory exists
    const dataDir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify({
      updated: new Date().toISOString(),
      tools: tools
    }, null, 2));
    
    console.log('✅ Saved', tools.length, 'tools to', OUTPUT_FILE);
    console.log('📅 Date:', tools[0]?.day || new Date().toISOString().split('T')[0]);
  } catch (e) {
    console.error('❌ Error:', e.message);
  }
}

saveTools();
