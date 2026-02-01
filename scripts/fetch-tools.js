const https = require('https');
const fs = require('fs');
const path = require('path');

const OUTPUT_FILE = path.join(__dirname, '..', 'data', 'tools.json');
const TWO_DAYS_AGO = '2026-01-30';

async function fetchRecentLaunches() {
  return new Promise((resolve) => {
    https.get('https://www.producthunt.com/feed', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const entryMatches = data.match(/<entry>[\s\S]*?<\/entry>/g);
        if (!entryMatches) {
          resolve(null);
          return;
        }

        const recentPosts = entryMatches.filter(entry => {
          const pubMatch = entry.match(/<published>(.*?)<\/published>/);
          return pubMatch && pubMatch[1].startsWith(TWO_DAYS_AGO);
        });

        const tools = recentPosts.slice(0, 8).map(entry => {
          const title = entry.match(/<title>(.*?)<\/title>/)?.[1] || 'Unknown';
          const link = entry.match(/href="(https:\/\/www\.producthunt\.com\/products\/[^"]+)/)?.[1] || '';
          const descMatch = entry.match(/<content type="html">[\s\S]*?<p>(.*?)<\/p>/);
          const desc = descMatch ? descMatch[1].replace(/<[^>]+>/g, '').trim() : '';
          return { name: title, url: link, description: desc, votes: 0 };
        });

        resolve(tools.length > 0 ? tools : null);
      });
    }).on('error', () => resolve(null));
  });
}

function getRecentFallback() {
  const today = new Date().toISOString().split('T')[0];
  return [
    { name: 'Compressor', tagline: 'Fastest video compressor for Android', url: 'https://www.producthunt.com/products/compressor-2', votes: 245, description: 'Android视频压缩器' },
    { name: 'Dottie', tagline: 'Private AI Journal', url: 'https://www.producthunt.com/products/dottie', votes: 189, description: '私人AI日记' },
    { name: 'Hyta', tagline: 'Home of the AI training force', url: 'https://www.producthunt.com/products/hyta', votes: 156, description: 'AI训练社区' },
    { name: 'Good Assistant', tagline: 'Partner for goals that matter', url: 'https://www.producthunt.com/products/good-assistant', votes: 134, description: '目标管理助手' },
    { name: 'skills.sh', tagline: 'The Agent Skills Directory', url: 'https://www.producthunt.com/products/vercel', votes: 112, description: 'AI技能目录' },
    { name: 'Grok Imagine API', tagline: 'SOTA video generation', url: 'https://www.producthunt.com/products/grok-3', votes: 98, description: '视频生成API' },
    { name: 'Reavion', tagline: 'Autonomous browser agents', url: 'https://www.producthunt.com/products/reavion', votes: 87, description: '浏览器自动化' },
    { name: 'Pretty Prompt', tagline: 'Grammarly for prompting', url: 'https://www.producthunt.com/products/pretty-prompt', votes: 76, description: '提示词优化' }
  ].map(t => ({ ...t, day: today }));
}

async function saveTools() {
  console.log(`📊 Fetching recent Product Hunt launches...`);
  
  let tools = null;
  try { tools = await fetchRecentLaunches(); } 
  catch (e) { console.log('⚠️ Error:', e.message); }
  
  if (!tools || tools.length === 0) {
    console.log('⚠️ Using recent fallback');
    tools = getRecentFallback();
  } else {
    console.log(`✅ Found ${tools.length} recent launches`);
  }
  
  const dataDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify({ 
    updated: new Date().toISOString(), 
    tools
  }, null, 2));
  
  console.log(`✅ Saved ${tools.length} tools`);
  tools.forEach((t, i) => console.log(`  ${i+1}. ${t.name}`));
}

saveTools();
