const https = require('https');
const fs = require('fs');
const path = require('path');

const OUTPUT_FILE = path.join(__dirname, '..', 'data', 'tools.json');
const PH_TOKEN = process.env.PH_TOKEN || '';

const TODAY = new Date().toISOString().split('T')[0];

// Get today's posts only
async function fetchTodayPosts() {
  if (!PH_TOKEN) {
    console.log('⚠️ No PH_TOKEN');
    return null;
  }

  const query = `query { posts(first: 20, order: RANKING) { edges { node { name tagline url votesCount createdAt } } } }`;

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
          // Filter to today's posts only
          const todayPosts = posts.filter(({ node }) => 
            node.createdAt && node.createdAt.startsWith(TODAY)
          );
          resolve(todayPosts.length > 0 ? todayPosts : posts.slice(0, 8));
        } catch (e) { resolve(null); }
      });
    });
    req.on('error', () => resolve(null));
    req.write(JSON.stringify({ query }));
    req.end();
  });
}

// Fallback: today's popular (simulated)
function getTodayFallback() {
  return [
    { name: 'Cursor', tagline: 'AI-first code editor', url: 'https://cursor.sh', votes: 1250 },
    { name: 'Bolt.new', tagline: 'AI-first AI IDE', url: 'https://bolt.new', votes: 980 },
    { name: 'Lovable', tagline: 'Build apps with plain language', url: 'https://lovable.dev', votes: 876 },
    { name: 'Screen Studio', tagline: 'Beautiful screen recordings', url: 'https://screen.studio', votes: 743 },
    { name: 'Wispr Flow', tagline: 'AI-powered text expansion', url: 'https://flow.wispr.com', votes: 621 },
    { name: 'Claude Code', tagline: 'Autonomous coding agent', url: 'https://claude.com/claude-code', votes: 589 },
    { name: 'v0', tagline: 'Generate React UI from text', url: 'https://v0.dev', votes: 534 },
    { name: 'Replit', tagline: 'IDE for teams', url: 'https://replit.com', votes: 498 }
  ].map(t => ({ ...t, day: TODAY }));
}

async function saveTools() {
  console.log(`📊 Fetching today's Product Hunt...`);
  
  let posts = null;
  try { posts = await fetchTodayPosts(); } 
  catch (e) { console.log('⚠️', e.message); }
  
  let tools = [];
  if (posts && posts.length > 0) {
    tools = posts.slice(0, 8).map(({ node }) => ({
      name: node.name,
      tagline: node.tagline || '',
      url: `https://producthunt.com${node.url}`,
      votes: node.votesCount || 0,
      day: TODAY
    }));
    console.log(`✅ Today: ${tools.length} tools`);
  }
  
  if (tools.length === 0) {
    console.log('⚠️ Using today fallback');
    tools = getTodayFallback();
  }
  
  const dataDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify({ updated: new Date().toISOString(), tools }, null, 2));
  console.log(`✅ Saved ${tools.length} tools`);
  tools.forEach((t, i) => console.log(`  ${i+1}. ${t.name} (▲${t.votes})`));
}

saveTools();
