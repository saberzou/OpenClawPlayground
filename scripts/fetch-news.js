#!/usr/bin/env node
/**
 * RSS/Atom News Fetcher
 * Fetches news from RSS and Atom feeds without API keys
 */

const fs = require('fs');
const https = require('https');
const http = require('http');

const OUTPUT_FILE = '/Users/saberzou/.openclaw/workspace/report-center/data/news.json';
const SOURCES_FILE = '/Users/saberzou/.openclaw/workspace/report-center/data/sources.json';

// Default sources
const defaultSources = {
  design: [
    'https://abduzeedo.com/rss',
    'https://www.smashingmagazine.com/feed',
    'https://www.creativebloq.com/rss'
  ],
  tech: [
    'https://www.theverge.com/rss/index.xml',  // Atom
    'https://techcrunch.com/feed'  // RSS
  ],
  photography: [
    'https://iso.500px.com/feed'
  ],
  ai: [
    'https://www.artificialintelligence-news.com/feed'
  ]
};

function httpGet(url, followRedirects = true) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      // Handle redirects
      if (followRedirects && (res.statusCode === 301 || res.statusCode === 302)) {
        const redirectUrl = res.headers.location;
        console.log(`   → Redirect to ${new URL(redirectUrl).hostname}`);
        return httpGet(redirectUrl, false).then(resolve).catch(reject);
      }
      
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
  if (!content) return '';
  let text = content.toString();
  text = text.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1');
  text = text.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  return text;
}

function extractTag(content, tagName) {
  // Handle CDATA
  const cdataRegex = new RegExp(`<!\\[CDATA\\[[\\s\\S]*?<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>[\\s\\S]*?\\]\\]>`, 'i');
  let match = cdataRegex.exec(content);
  if (match) return cleanCDATAText(match[1]);
  
  // Regular extraction
  const regex = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`, 'i');
  match = regex.exec(content);
  if (match) return cleanCDATAText(match[1]);
  
  return '';
}

function parseRSS(xmlData, sourceName) {
  const articles = [];
  const itemRegex = /<item[\s\S]*?<\/item>/gi;
  let match;
  
  while ((match = itemRegex.exec(xmlData)) !== null) {
    const title = extractTag(match[0], 'title');
    const link = extractTag(match[0], 'link');
    const description = extractTag(match[0], 'description');
    const pubDate = extractTag(match[0], 'pubDate') || extractTag(match[0], 'dc:date');
    
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

function parseAtom(xmlData, sourceName) {
  const articles = [];
  const entryRegex = /<entry[\s\S]*?<\/entry>/gi;
  let match;
  
  while ((match = entryRegex.exec(xmlData)) !== null) {
    const entry = match[0];
    
    const title = extractTag(entry, 'title');
    // Atom links can have attributes
    const linkMatch = entry.match(/<link[^>]+href=["']([^"']+)["'][^>]*>/i) || 
                      entry.match(/<link[^>]+href=([^>\s]+)[\s>]/i);
    const link = linkMatch ? (linkMatch[1].replace(/["']/g, '') || extractTag(entry, 'link')) : '';
    const summary = extractTag(entry, 'summary') || extractTag(entry, 'content');
    const published = extractTag(entry, 'published') || extractTag(entry, 'updated') || extractTag(entry, 'pubDate');
    
    if (title && link) {
      articles.push({
        title,
        link,
        description: summary || 'Click to read more',
        pubDate: published || new Date().toISOString(),
        source: sourceName
      });
    }
  }
  return articles;
}

function detectFormat(xmlData) {
  if (xmlData.includes('<feed') && xmlData.includes('<entry')) return 'atom';
  if (xmlData.includes('<rss') || xmlData.includes('<channel>')) return 'rss';
  return 'unknown';
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
  
  console.log('📥 Fetching news from RSS/Atom feeds...');
  
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
        
        const format = detectFormat(xmlData);
        let articles = [];
        
        if (format === 'atom') {
          articles = parseAtom(xmlData, hostname);
          console.log(`   ✓ Atom: ${articles.length} articles`);
        } else if (format === 'rss') {
          articles = parseRSS(xmlData, hostname);
          console.log(`   ✓ RSS: ${articles.length} articles`);
        } else {
          // Try both
          articles = parseAtom(xmlData, hostname);
          if (articles.length === 0) articles = parseRSS(xmlData, hostname);
          console.log(`   ✓ ${articles.length} articles`);
        }
        
        articles.forEach(article => {
          if (!seenLinks.has(article.link)) {
            seenLinks.add(article.link);
            allNews.push({ ...article, category });
          }
        });
        
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
    articles: allNews  // Save all articles
  };
  
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
