#!/usr/bin/env node
/**
 * RSS-based News Fetcher
 * Fetches news from multiple RSS feeds without API keys
 */

const fs = require('fs');
const https = require('https');

const OUTPUT_FILE = '/Users/saberzou/.openclaw/workspace/report-center/data/news.json';
const SOURCES_FILE = '/Users/saberzou/.openclaw/workspace/report-center/data/sources.json';

// Default sources if file doesn't exist
const defaultSources = {
  design: [
    'https://www.smashingmagazine.com/feed'
  ],
  tech: [
    'https://www.theverge.com/rss/index.xml',
    'https://techcrunch.com/feed'
  ],
  photography: [
    'https://iso.500px.com/feed'
  ]
};

function httpGet(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    });
    req.on('error', reject);
    req.setTimeout(15000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

function cleanCDATAText(content) {
  // Remove CDATA wrapper if present
  return content.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1');
}

function extractBetween(content, startTag, endTag) {
  const regex = new RegExp(`${startTag}([\\s\\S]*?)${endTag}`, 'gi');
  const match = regex.exec(content);
  if (match) {
    let text = match[1];
    text = cleanCDATAText(text);
    text = text.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    return text;
  }
  return '';
}

function parseRSS(xmlData, sourceName) {
  const articles = [];
  
  // Remove XML declaration and comments
  let cleanData = xmlData.replace(/<\?xml[^>]*\?>/gi, '').replace(/<!--[\s\S]*?-->/gi, '');
  
  // Split by items - more robust pattern
  const itemRegex = /<item[\s\S]*?<\/item>/gi;
  let match;
  
  while ((match = itemRegex.exec(cleanData)) !== null) {
    const itemContent = match[0];
    
    const title = extractBetween(itemContent, '<title>', '</title>');
    const link = extractBetween(itemContent, '<link>', '</link>');
    const description = extractBetween(itemContent, '<description>', '</description>');
    const pubDate = extractBetween(itemContent, '<pubDate>', '</pubDate>');
    
    if (title && link) {
      articles.push({
        title,
        link,
        description: description || 'Click to read more',
        pubDate: pubDate || new Date().toISOString(),
        source: sourceName
      });
    }
  }
  
  return articles;
}

async function fetchAllNews() {
  let sources = defaultSources;
  
  try {
    if (fs.existsSync(SOURCES_FILE)) {
      const customSources = JSON.parse(fs.readFileSync(SOURCES_FILE, 'utf8'));
      sources = { ...defaultSources, ...customSources };
    }
  } catch (e) {
    console.log('Using default sources');
  }
  
  const allNews = [];
  const seenLinks = new Set();
  
  console.log('📥 Fetching news from RSS feeds...');
  
  for (const [category, urls] of Object.entries(sources)) {
    console.log(`\n📰 ${category}:`);
    
    for (const url of urls) {
      try {
        const hostname = new URL(url).hostname.replace('www.', '');
        console.log(`   Fetching ${hostname}...`);
        
        const xmlData = await httpGet(url);
        
        if (!xmlData || xmlData.trim().length < 100) {
          console.log(`   ✗ Empty response`);
          continue;
        }
        
        const articles = parseRSS(xmlData, hostname);
        
        // Filter duplicates and add category
        articles.forEach(article => {
          if (!seenLinks.has(article.link)) {
            seenLinks.add(article.link);
            allNews.push({ ...article, category });
          }
        });
        
        console.log(`   ✓ ${articles.length} articles`);
      } catch (e) {
        console.log(`   ✗ Failed: ${e.message}`);
      }
    }
  }
  
  // Sort by date (newest first)
  allNews.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
  
  const result = {
    timestamp: new Date().toISOString(),
    count: allNews.length,
    articles: allNews.slice(0, 20) // Top 20
  };
  
  // Save to file
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(result, null, 2));
  console.log(`\n✅ Saved ${result.articles.length} articles to ${OUTPUT_FILE}`);
  
  return result;
}

async function main() {
  try {
    const result = await fetchAllNews();
    console.log(`\n📊 Total unique articles: ${result.count}`);
    console.log(`🕐 Last updated: ${result.timestamp}`);
  } catch (e) {
    console.error('❌ Error:', e.message);
    process.exit(1);
  }
}

main();
