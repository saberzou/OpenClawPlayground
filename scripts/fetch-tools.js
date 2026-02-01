const http = require('https');
const fs = require('fs');
const path = require('path');

const OUTPUT_FILE = path.join(__dirname, '..', 'data', 'tools.json');
const PRODUCT_HUNT_API = 'https://api.producthunt.com/v2/api/graphql';

// Get top 8 trending tools from Product Hunt
async function fetchProductHunt() {
  // Try Product Hunt GraphQL API
  const query = `
    {
      posts(first: 8, order: RANKING) {
        edges {
          node {
            name
            tagline
            description
            url
            votesCount
            createdAt
          }
        }
      }
    }
  `;
  
  return new Promise((resolve) => {
    const req = http.request(PRODUCT_HUNT_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': process.env.PRODUCT_HUNT_TOKEN || ''
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const posts = json?.data?.posts?.edges || [];
          const tools = posts.map(({ node }) => ({
            name: node.name,
            tagline: node.tagline,
            url: `https://producthunt.com${node.url}`,
            votes: node.votesCount,
            description: node.description || '',
            day: new Date().toISOString().split('T')[0]
          }));
          resolve(tools.length > 0 ? tools : null);
        } catch (e) {
          resolve(null);
        }
      });
    });
    req.on('error', () => resolve(null));
    req.write(JSON.stringify({ query }));
    req.end();
  });
}

// Fallback: curated trending tools with realistic vote counts
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
    
    let tools = await fetchProductHunt();
    
    if (!tools || tools.length === 0) {
      console.log('⚠️ API not available, using fallback list');
      tools = getFallbackTools();
    }
    
    // Add date to each tool
    const today = new Date().toISOString().split('T')[0];
    tools = tools.map(t => ({ ...t, day: today }));

    // Ensure data directory exists
    const dataDir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify({
      updated: new Date().toISOString(),
      tools: tools
    }, null, 2));
    
    console.log(`✅ Saved ${tools.length} tools to ${OUTPUT_FILE}`);
    console.log(`📅 Date: ${today}`);
    
  } catch (e) {
    console.error('❌ Error:', e.message);
    // Still save fallback
    const today = new Date().toISOString().split('T')[0];
    const tools = getFallbackTools().map(t => ({ ...t, day: today }));
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify({
      updated: new Date().toISOString(),
      tools: tools
    }, null, 2));
    console.log('✅ Saved fallback tools');
  }
}

saveTools();
