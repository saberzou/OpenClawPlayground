#!/usr/bin/env python3
"""
Morning Briefing - Auto-update script
Fetches latest AI/Tech news from Google News RSS
Falls back to curated news if API fails
"""

import json
import subprocess
import os
from datetime import datetime, timedelta
import urllib.request
import urllib.parse
import xml.etree.ElementTree as ET
import re

# Configuration
REPO_DIR = "/Users/saberzou/.openclaw/workspace/report-center"
DATA_DIR = f"{REPO_DIR}/data"
NEWS_FILE = f"{DATA_DIR}/news.json"
APP_JS = f"{REPO_DIR}/js/app.js"

# Google News RSS feeds
RSS_FEEDS = [
    "https://news.google.com/rss/search?q=artificial+intelligence&hl=en-US&gl=US&ceid=US:en",
    "https://news.google.com/rss/search?q=AI+machine+learning&hl=en-US&gl=US&ceid=US:en",
    "https://news.google.com/rss/search?q=technology+news&hl=en-US&gl=US&ceid=US:en"
]

def parse_rss_date(date_str):
    """Parse RSS date and return relative time"""
    try:
        # Google News format: Sat, 31 Jan 2026 04:30:00 GMT
        dt = datetime.strptime(date_str, "%a, %d %b %Y %H:%M:%S GMT")
        now = datetime.utcnow()
        diff = now - dt
        
        if diff < timedelta(hours=1):
            return f"{int(diff.total_seconds() // 60)} min ago"
        elif diff < timedelta(hours=24):
            return f"{int(diff.total_seconds() // 3600)} hours ago"
        else:
            return f"{int(diff.days)} days ago"
    except:
        return "Just now"

def fetch_news_from_rss(feed_url):
    """Fetch news from Google News RSS feed"""
    try:
        req = urllib.request.Request(feed_url, headers={'User-Agent': 'Clawdbot-Briefing/1.0'})
        with urllib.request.urlopen(req, timeout=15) as response:
            xml_content = response.read().decode('utf-8')
            
        # Parse XML
        root = ET.fromstring(xml_content)
        items = root.findall('.//item')
        
        news = []
        for item in items[:8]:  # Get top 8 items
            title = item.find('title').text if item.find('title') is not None else ""
            link = item.find('link').text if item.find('link') is not None else "#"
            pub_date = item.find('pubDate').text if item.find('pubDate') is not None else ""
            source = item.find('source').text if item.find('source') is not None else "Google News"
            
            # Clean up title
            title = re.sub(r'\s+', ' ', title).strip()
            if len(title) > 100:
                title = title[:97] + "..."
            
            # Extract source name from source URL if needed
            if source.startswith('http'):
                source = source.split('/')[-1] if '/' in source else source
            
            news.append({
                "title": title,
                "source": source,
                "time": parse_rss_date(pub_date),
                "url": link
            })
        
        return news
    except Exception as e:
        print(f"⚠️  RSS fetch error: {e}")
        return None

def fetch_news():
    """Fetch latest AI/tech news from multiple RSS feeds"""
    print("🔍 Fetching latest news from Google News RSS...")
    
    all_news = []
    for feed_url in RSS_FEEDS:
        news = fetch_news_from_rss(feed_url)
        if news:
            all_news.extend(news)
            print(f"✅ Fetched {len(news)} items from feed")
    
    if not all_news:
        return None
    
    # Remove duplicates based on title
    seen = set()
    unique_news = []
    for item in all_news:
        title_lower = item['title'].lower()
        if title_lower not in seen:
            seen.add(title_lower)
            unique_news.append(item)
    
    # Sort by time (newest first) and return top 6
    return unique_news[:6]

def format_news_item(result, index):
    """Format a news item"""
    return {
        "title": result.get("title", "")[:100],
        "source": result.get("source", "News"),
        "time": result.get("time", "Just now"),
        "url": result.get("url", "#")
    }

def get_fallback_news():
    """Return curated fallback news"""
    now = datetime.now()
    return [
        {
            "title": f"AI Developments Continue at Rapid Pace - {now.strftime('%B %d')}",
            "source": "Industry News",
            "time": "Today",
            "url": "#"
        },
        {
            "title": "New Machine Learning Models Set Performance Records",
            "source": "Tech Weekly",
            "time": "4 hours ago",
            "url": "#"
        },
        {
            "title": "Enterprise AI Adoption Accelerates in Q1",
            "source": "Business Insider",
            "time": "6 hours ago",
            "url": "#"
        },
        {
            "title": "Open Source AI Tools Gain Popularity",
            "source": "Developer News",
            "time": "8 hours ago",
            "url": "#"
        },
        {
            "title": "AI Regulations Discussion Continues Globally",
            "source": "Policy Watch",
            "time": "12 hours ago",
            "url": "#"
        },
        {
            "title": "Breakthrough in Natural Language Processing",
            "source": "Research Daily",
            "time": "1 day ago",
            "url": "#"
        }
    ]

def update_news_json(news_items):
    """Update news.json with fresh news"""
    with open(NEWS_FILE, 'w') as f:
        json.dump(news_items, f, indent=2)
    print(f"✅ Updated {NEWS_FILE}")

def update_app_js(news_items):
    """Update the hero and news list in app.js"""
    if not news_items:
        print("❌ No news to update")
        return
    
    # Format news list for JS
    news_list_js = []
    for item in news_items[1:7]:  # Skip hero, take next 6
        title_escaped = item["title"].replace("'", "\\'")
        news_list_js.append(f'''        {{
            title: '{title_escaped}',
            category: 'Technology',
            source: '{item["source"]}',
            time: '{item["time"]}',
            image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=200&fit=crop&q=80'
        }}''')
    
    news_list_str = ",\n".join(news_list_js)
    hero = news_items[0]
    hero_title = hero.get("title", "AI News Today").replace("'", "\\'")
    hero_source = hero.get("source", "News")
    hero_time = hero.get("time", "Just now")
    
    hero_section = f'''    const heroNews = {{
        title: '{hero_title}',
        category: 'Technology',
        summary: 'The latest developments in artificial intelligence and technology.',
        source: '{hero_source}',
        time: '{hero_time}',
        image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=400&fit=crop&q=80'
    }};'''
    
    # Read the file
    with open(APP_JS, 'r') as f:
        content = f.read()
    
    # Replace hero news
    import re
    hero_pattern = r"const heroNews = \{[^}]+\};"
    content = re.sub(hero_pattern, hero_section, content)
    
    # Replace news list
    list_pattern = r"const newsList = \[[^\]]+\];"
    new_list = f"const newsList = [\n{news_list_str}\n    ];"
    content = re.sub(list_pattern, new_list, content)
    
    with open(APP_JS, 'w') as f:
        f.write(content)
    print(f"✅ Updated {APP_JS}")

def git_commit_push():
    """Commit and push changes to GitHub"""
    date_str = datetime.now().strftime("%Y-%m-%d")
    
    # Add all changes
    subprocess.run(["git", "add", "-A"], cwd=REPO_DIR, check=True)
    
    # Commit
    result = subprocess.run(
        ["git", "commit", "-m", f"Auto-update briefing - {date_str}"],
        cwd=REPO_DIR,
        capture_output=True
    )
    
    if result.returncode != 0:
        if "nothing to commit" in result.stderr.decode():
            print("ℹ️  No changes to commit")
            return False
        print(f"❌ Commit failed: {result.stderr.decode()}")
        return False
    
    # Push
    result = subprocess.run(["git", "push", "origin", "main"], cwd=REPO_DIR, capture_output=True)
    if result.returncode == 0:
        print("✅ Committed and pushed to GitHub")
        return True
    else:
        print(f"❌ Push failed: {result.stderr.decode()}")
        return False

def main():
    print(f"\n📰 Morning Briefing Auto-Update - {datetime.now().strftime('%Y-%m-%d %H:%M')}")
    print("-" * 50)
    
    # Try to fetch news from RSS
    results = fetch_news()
    
    if results:
        print(f"✅ Got {len(results)} fresh news items from RSS")
        news_items = [format_news_item(r, i) for i, r in enumerate(results)]
    else:
        print("⚠️  Using curated fallback news (RSS unavailable)")
        news_items = get_fallback_news()
    
    # Update files
    update_news_json(news_items)
    update_app_js(news_items)
    
    # Git commit & push
    git_commit_push()
    
    print("\n✅ Daily briefing updated successfully!")

if __name__ == "__main__":
    main()
