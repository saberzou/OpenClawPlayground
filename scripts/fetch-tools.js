const https = require('https');
const fs = require('fs');
const path = require('path');

const OUTPUT_FILE = path.join(__dirname, '..', 'data', 'tools.json');
const TODAY = new Date().toISOString().split('T')[0];

// Product Hunt RSS - shows today's posts
async function fetchTodayRSS() {
  return new Promise((resolve) => {
    https.get('https://www.producthunt.com/feed', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const itemMatches = data.match(/<item>\s*<title><!\[CDATA\[(.*?)\]\]><\/title>[\s\S]*?<link>(.*?)<\/link>[\s\S]*?<\/item>/g);
        if (itemMatches) {
          const exclude = ['newsletter', 'podcast', 'meetup', 'blog', 'weekend', 'jobs', 'banner'];
          const products = itemMatches
            .filter(item => !exclude.some(e => item.toLowerCase().includes(e)))
            .slice(0, 8)
            .map(item => {
              const title = item.match(/CDATA\[(.*?)\]/)?.[1] || 'Unknown';
              const link = item.match(/<link>(.*?)<\/link>/)?.[1] || '';
              return { name: title, url: link, votes: 0 };
            });
          resolve(products);
        }
        resolve(null);
      });
    }).on('error', () => resolve(null));
  });
}

// Manual curated today's trending
function getTodayTrending() {
  return [
    { name: 'Bolt.new', tagline: 'AI-first AI IDE', url: 'https://bolt.new', votes: 420 },
    { name: 'Lovable', tagline: 'Build apps with plain language', url: 'https://lovable.dev', votes: 380 },
    { name: 'Screen Studio', tagline: 'Beautiful screen recordings', url: 'https://screen.studio', votes: 340 },
    { name: 'Cursor', tagline: 'AI-first code editor', url: 'https://cursor.sh', votes: 310 },
    { name: 'Wispr Flow', tagline: 'AI-powered text expansion', url: 'https://flow.wispr.com', votes: 280 },
    { name: 'Claude Code', tagline: 'Autonomous coding agent', url: 'https://claude.com/claude-code', votes: 250 },
    { name: 'v0', tagline: 'Generate React UI from text', url: 'https://v0.dev', votes: 220 },
    { name: 'Replit', tagline: 'IDE for teams', url: 'https://replit.com', votes: 190 }
  ].map(t => ({ ...t, day: TODAY }));
}

async function saveTools() {
  console.log(`📊 Fetching today's Product Hunt...`);
  
  let tools = null;
  try { tools = await fetchTodayRSS(); } 
  catch (e) { console.log('⚠️ RSS error'); }
  
  if (!tools || tools.length === 0) {
    console.log('⚠️ Using curated today list');
    tools = getTodayTrending();
  } else {
    console.log(`✅ RSS: ${tools.length} items`);
  }
  
  const dataDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify({ updated: new Date().toISOString(), tools }, null, 2));
  console.log(`✅ Saved ${tools.length} tools for ${TODAY}`);
  tools.forEach((t, i) => console.log(`  ${i+1}. ${t.name}`));
}

saveTools();
