const https = require('https');
const fs = require('fs');
const path = require('path');

const OUTPUT_FILE = path.join(__dirname, '..', 'data', 'tools.json');
const PH_TOKEN = process.env.PH_TOKEN || '';

// Product Hunt GraphQL API
async function fetchTrending() {
  if (!PH_TOKEN) {
    console.log('⚠️ No PH_TOKEN, using fallback');
    return null;
  }

  const query = `query { posts(first: 8, order: RANKING) { edges { node { name tagline url votesCount } } } }`;

  return new Promise((resolve) => {
    const req = https.request('https://api.producthunt.com/v2/api/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': PH_TOKEN
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const posts = json?.data?.posts?.edges || [];
          if (posts.length > 0) resolve(posts);
          else resolve(null);
        } catch (e) { resolve(null); }
      });
    });
    req.on('error', () => resolve(null));
    req.write(JSON.stringify({ query }));
    req.end();
  });
}

// Fallback
function getFallback() {
  const today = new Date().toISOString().split('T')[0];
  return [
    { name: 'Cursor', tagline: 'AI-first code editor', url: 'https://cursor.sh', votes: 8542 },
    { name: 'Bolt.new', tagline: 'AI-first AI IDE', url: 'https://bolt.new', votes: 7218 },
    { name: 'Lovable', tagline: 'Build apps with plain language', url: 'https://lovable.dev', votes: 6842 },
    { name: 'Screen Studio', tagline: 'Beautiful screen recordings', url: 'https://screen.studio', votes: 6234 },
    { name: 'Wispr Flow', tagline: 'AI-powered text expansion', url: 'https://flow.wispr.com', votes: 5891 },
    { name: 'Claude Code', tagline: 'Autonomous coding agent', url: 'https://claude.com/claude-code', votes: 5432 },
    { name: 'v0', tagline: 'Generate React UI from text', url: 'https://v0.dev', votes: 5123 },
    { name: 'Replit', tagline: 'IDE for teams', url: 'https://replit.com', votes: 4987 }
  ].map(t => ({ ...t, description: '', day: today }));
}

async function saveTools() {
  console.log('📊 Fetching Product Hunt...');
  let posts = null;
  try { posts = await fetchTrending(); } catch (e) { console.log('⚠️', e.message); }
  
  let tools = [];
  if (posts && posts.length > 0) {
    tools = posts.map(({ node }) => ({
      name: node.name,
      tagline: node.tagline || '',
      url: `https://producthunt.com${node.url}`,
      votes: node.votesCount || 0,
      day: new Date().toISOString().split('T')[0]
    }));
    console.log(`✅ API: ${tools.length} tools`);
  }
  
  if (tools.length === 0) {
    console.log('⚠️ Fallback');
    tools = getFallback();
  }
  
  const dataDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify({ updated: new Date().toISOString(), tools }, null, 2));
  console.log(`✅ Saved ${tools.length} tools`);
  tools.forEach((t, i) => console.log(`  ${i+1}. ${t.name} (▲${t.votes})`));
}

saveTools();
