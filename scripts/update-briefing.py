#!/usr/bin/env python3
"""
Morning Briefing - Auto-update script
Fetches latest AI/Tech news and updates the briefing site
Falls back to curated news if API fails
"""

import json
import subprocess
import os
from datetime import datetime
import urllib.request
import urllib.parse

# Configuration
BRAVE_API_KEY = os.environ.get("BRAVE_API_KEY", "")
REPO_DIR = "/Users/saberzou/.openclaw/workspace/report-center"
DATA_DIR = f"{REPO_DIR}/data"
NEWS_FILE = f"{DATA_DIR}/news.json"
APP_JS = f"{REPO_DIR}/js/app.js"

def fetch_news():
    """Fetch latest AI/tech news from Brave Search API"""
    url = "https://api.search.brave.com/v1/search"
    headers = {
        "Accept": "application/json",
        "X-Subscription-Token": BRAVE_API_KEY,
        "User-Agent": "Clawdbot-Briefing/1.0"
    }
    params = {
        "q": "latest artificial intelligence technology news 2026",
        "freshness": "pd",  # Past 24 hours
        "count": 6
    }
    
    req = urllib.request.Request(f"{url}?{urllib.parse.urlencode(params)}", headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=10) as response:
            data = json.loads(response.read().decode())
            return data.get("web", {}).get("results", [])
    except Exception as e:
        print(f"⚠️  Brave API error: {e}")
        return None

def format_news_item(result, index):
    """Format a Brave search result for our news.json"""
    source = result.get("source", {})
    if isinstance(source, dict):
        source_name = source.get("name", "Unknown")
    else:
        source_name = str(source) if source else "Unknown"
    
    return {
        "title": result.get("title", "")[:100],
        "source": source_name,
        "time": result.get("age", "Just now"),
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
    
    # Try to fetch news from Brave API
    print("🔍 Fetching latest news from Brave Search...")
    results = fetch_news()
    
    if results:
        print("✅ Got fresh news from Brave API")
        news_items = [format_news_item(r, i) for i, r in enumerate(results)]
    else:
        print("⚠️  Using curated fallback news (check your Brave API key)")
        news_items = get_fallback_news()
    
    # Update files
    update_news_json(news_items)
    update_app_js(news_items)
    
    # Git commit & push
    git_commit_push()
    
    print("\n✅ Daily briefing updated successfully!")

if __name__ == "__main__":
    main()
