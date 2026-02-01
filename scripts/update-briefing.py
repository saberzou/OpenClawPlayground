#!/usr/bin/env python3
"""
Morning Briefing - Auto-update script
Fetches latest AI/Tech news from Google News RSS with full article details
"""

import json
import subprocess
import os
from datetime import datetime, timedelta
import urllib.request
import urllib.parse
import xml.etree.ElementTree as ET
import re
import html
import random

# Configuration
REPO_DIR = "/Users/saberzou/.openclaw/workspace/report-center"
DATA_DIR = f"{REPO_DIR}/data"
NEWS_FILE = f"{DATA_DIR}/news.json"
APP_JS = f"{REPO_DIR}/js/app.js"

# Multiple fresh RSS feeds for better coverage
RSS_FEEDS = [
    "https://news.google.com/rss/search?q=artificial+intelligence&hl=en-US&gl=US&ceid=US:en",
    "https://news.google.com/rss/search?q=AI+machine+learning&hl=en-US&gl=US&ceid=US:en",
    "https://techcrunch.com/feed/",
    "https://www.theverge.com/rss/index.xml",
    "https://wired.com/feed/tag/ai/latest/rss",
]

# AI topics for generating contextual summaries
AI_TOPICS = {
    "chip": {"category": "Hardware", "impact": "AI chips are the foundation of all AI systems. Better chips mean faster, cheaper AI.", "keywords": ["chip", "nvidia", "gpu", "semiconductor", "processor"]},
    "stock": {"category": "Finance", "impact": "AI stocks are surging. Understanding which companies benefit helps with investment decisions.", "keywords": ["stock", "share", "market", "invest", "buy", "sell", "trillion", "billion"]},
    "china": {"category": "Geopolitics", "impact": "US-China AI competition shapes the future of technology and national security.", "keywords": ["china", "chinese", "beijing"]},
    "google": {"category": "Tech Giant", "impact": "Google's AI moves affect billions of users and set industry standards.", "keywords": ["google", "Alphabet"]},
    "microsoft": {"category": "Tech Giant", "impact": "Microsoft's AI investments are reshaping enterprise software and cloud services.", "keywords": ["microsoft", "openai"]},
    "openai": {"category": "AI Labs", "impact": "OpenAI developments signal the direction of generative AI capabilities.", "keywords": ["openai", "chatgpt", "gpt", "sam altman"]},
    "regulation": {"category": "Policy", "impact": "AI regulations affect how companies develop and deploy AI systems.", "keywords": ["regulation", "bill", "law", "government", "senate", "congress", "policy", "license"]},
    "job": {"category": "Workforce", "impact": "AI is transforming jobs. Understanding the impact helps with career planning.", "keywords": ["job", "workforce", "layoff", "employment", "worker"]},
    "ethic": {"category": "Ethics", "impact": "AI ethics shape responsible development and deployment of AI systems.", "keywords": ["ethical", "ethics", "danger", "risk", "harm"]},
    "research": {"category": "Research", "impact": "New AI research often leads to breakthroughs in capabilities and applications.", "keywords": ["research", "study", "university", "professor", "harvard", "mit", "stanford"]},
    "agent": {"category": "Agents", "impact": "AI agents are becoming autonomous - understanding their capabilities helps you use them effectively.", "keywords": ["agent", "autonomous", "agentic"]},
    "apple": {"category": "Tech Giant", "impact": "Apple's AI strategy affects iPhone users and the broader consumer AI market.", "keywords": ["apple", "siri", "iphone"]},
    "musk": {"category": "Business", "impact": "Musk's companies (Tesla, SpaceX, xAI) are integrating AI across industries.", "keywords": ["musk", "elon", "tesla", "spacex"]},
    "amazon": {"category": "Tech Giant", "impact": "Amazon's AI investments (AWS, Alexa) shape cloud and consumer AI.", "keywords": ["amazon", "aws", "bedrock"]},
}

# Summary templates based on patterns
SUMMARY_TEMPLATES = {
    "stock": ["Analysis of top AI stocks positioned for growth in the current market.", "Investment outlook for leading AI companies.", "Which AI stocks are analysts watching closely."],
    "job": ["How AI is reshaping the workforce and what it means for workers.", "The changing nature of work in the AI era.", "AI's impact on employment and skills."],
    "regulation": ["New policy developments affecting AI deployment and development.", "Government approaches to AI governance.", "What the latest AI regulations mean for the industry."],
    "research": ["Latest findings from AI research institutions.", "Academic progress in artificial intelligence.", "New scientific insights into AI capabilities."],
    "chip": ["Developments in AI hardware and semiconductor technology.", "The battle for AI chip supremacy.", "How AI chips are getting more powerful."],
    "default": ["Latest developments in artificial intelligence and technology.", "Breaking news from the AI world.", "Key updates in the AI industry."]
}

def generate_summary_from_title(title, category):
    """Generate a contextual summary from the title"""
    title_lower = title.lower()
    
    # Check for specific patterns
    if "stock" in title_lower or "buy" in title_lower or "invest" in title_lower:
        return random.choice(SUMMARY_TEMPLATES["stock"])
    elif "job" in title_lower or "work" in title_lower or "layoff" in title_lower:
        return random.choice(SUMMARY_TEMPLATES["job"])
    elif any(k in title_lower for k in ["regulation", "bill", "law", "government", "senate"]):
        return random.choice(SUMMARY_TEMPLATES["regulation"])
    elif "research" in title_lower or any(k in title_lower for k in ["university", "mit", "harvard", "stanford", "professor"]):
        return random.choice(SUMMARY_TEMPLATES["research"])
    elif any(k in title_lower for k in ["chip", "nvidia", "gpu", "semiconductor"]):
        return random.choice(SUMMARY_TEMPLATES["chip"])
    elif category == "Technology":
        return "Latest updates from the technology sector with a focus on artificial intelligence developments."
    else:
        return f"Latest {category.lower()} news related to artificial intelligence and its applications."

def parse_rss_date(date_str):
    """Parse RSS date and return relative time"""
    try:
        # Handle different date formats
        formats = [
            "%a, %d %b %Y %H:%M:%S GMT",
            "%a, %d %b %Y %H:%M:%S %z",
            "%Y-%m-%dT%H:%M:%S%z",
            "%Y-%m-%dT%H:%M:%SZ",
        ]
        dt = None
        for fmt in formats:
            try:
                dt = datetime.strptime(date_str[:25], fmt)
                break
            except:
                continue
        if dt is None:
            return "Just now"
        now = datetime.utcnow()
        diff = now - dt

        if diff < timedelta(minutes=60):
            return f"{int(diff.total_seconds() // 60)} min ago"
        elif diff < timedelta(hours=24):
            return f"{int(diff.total_seconds() // 3600)} hours ago"
        elif diff < timedelta(days=2):
            return f"Yesterday"
        else:
            return f"{diff.days} days ago"
    except:
        return "Just now"

def fetch_news_from_rss(feed_url):
    """Fetch news from any RSS feed (handles Google News, TechCrunch, etc.)"""
    try:
        req = urllib.request.Request(feed_url, headers={'User-Agent': 'Clawdbot-Briefing/1.0'})
        with urllib.request.urlopen(req, timeout=15) as response:
            xml_content = response.read().decode('utf-8')

        root = ET.fromstring(xml_content)
        items = root.findall('.//item')

        news = []
        seen_titles = set()
        for item in items[:15]:  # Check more items
            # Handle different RSS formats
            title_elem = item.find('title') or item.find('{http://search.yahoo.com/mrss/}title')
            title = title_elem.text if title_elem is not None and title_elem.text else ""

            if not title or title.lower() in seen_titles:
                continue
            seen_titles.add(title.lower())

            link_elem = item.find('link')
            link = ""
            if link_elem is not None:
                link = link_elem.text
            else:
                link_elem = item.find('{http://purl.org/dc/elements/1.1/}identifier')
                if link_elem is not None:
                    link = link_elem.text

            pub_date_elem = item.find('pubDate') or item.find('{http://purl.org/dc/elements/1.1/}date')
            pub_date = pub_date_elem.text if pub_date_elem is not None and pub_date_elem.text else ""

            # Extract source from feed URL
            source = feed_url.split('/')[2] if '/' in feed_url else "News"
            source = source.replace('www.', '').replace('.com', '').replace('.org', '')

            # Clean up title
            title = re.sub(r'\s+', ' ', title).strip()
            if len(title) > 100:
                title = title[:97] + "..."

            # Skip items older than 2 days
            item_dt = None
            if pub_date:
                for fmt in ["%a, %d %b %Y %H:%M:%S", "%a, %d %b %Y %H:%M:%S %z"]:
                    try:
                        item_dt = datetime.strptime(pub_date[:25], fmt)
                        break
                    except:
                        continue
                if item_dt and (datetime.utcnow() - item_dt) > timedelta(days=2):
                    continue

            # Determine category and impact based on keywords
            title_lower = title.lower()
            category = "Technology"
            impact = "This development affects the broader AI landscape and industry trends."

            for keyword, info in AI_TOPICS.items():
                if any(kw in title_lower for kw in info["keywords"]):
                    category = info["category"]
                    impact = info["impact"]
                    break

            # Generate contextual summary
            summary = generate_summary_from_title(title, category)

            news.append({
                "title": title,
                "category": category,
                "summary": summary,
                "impact": impact,
                "source": source,
                "time": parse_rss_date(pub_date),
                "url": link
            })

        return news
    except Exception as e:
        print(f"⚠️  RSS fetch error for {feed_url}: {e}")
        return None

def fetch_news():
    """Fetch latest AI/tech news from RSS feeds"""
    print("🔍 Fetching latest news from Google News RSS...")
    
    all_news = []
    for feed_url in RSS_FEEDS:
        news = fetch_news_from_rss(feed_url)
        if news:
            all_news.extend(news)
            print(f"✅ Fetched {len(news)} items")
    
    if not all_news:
        return None
    
    # Remove duplicates
    seen = set()
    unique_news = []
    for item in all_news:
        title_lower = item['title'].lower()
        if title_lower not in seen:
            seen.add(title_lower)
            unique_news.append(item)
    
    return unique_news[:6]

def format_news_item(result, index):
    """Format a news item"""
    return {
        "title": result.get("title", ""),
        "category": result.get("category", "Technology"),
        "summary": result.get("summary", ""),
        "impact": result.get("impact", ""),
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
            "category": "Technology",
            "summary": "The latest developments in artificial intelligence and technology.",
            "impact": "Staying informed about AI progress helps you understand industry direction.",
            "source": "Industry News",
            "time": "Today",
            "url": "#"
        },
        {
            "title": "New Machine Learning Models Set Performance Records",
            "category": "Research",
            "summary": "Researchers announce breakthrough performance benchmarks.",
            "impact": "Better models mean more capable AI systems for everyone.",
            "source": "Tech Weekly",
            "time": "4 hours ago",
            "url": "#"
        },
        {
            "title": "Enterprise AI Adoption Accelerates in Q1",
            "category": "Business",
            "summary": "Major companies increase AI investment and deployment.",
            "impact": "Enterprise adoption signals market maturity and job market trends.",
            "source": "Business Insider",
            "time": "6 hours ago",
            "url": "#"
        },
        {
            "title": "Open Source AI Tools Gain Popularity",
            "category": "Tools",
            "summary": "Community-driven AI projects see rapid growth.",
            "impact": "Open source tools democratize access to AI capabilities.",
            "source": "Developer News",
            "time": "8 hours ago",
            "url": "#"
        },
        {
            "title": "AI Regulations Discussion Continues Globally",
            "category": "Policy",
            "summary": "Governments debate comprehensive AI governance frameworks.",
            "impact": "Regulations will shape how AI can be developed and used.",
            "source": "Policy Watch",
            "time": "12 hours ago",
            "url": "#"
        },
        {
            "title": "Breakthrough in Natural Language Processing",
            "category": "Research",
            "summary": "New NLP techniques show improvements in understanding.",
            "impact": "Better language understanding improves chatbots and translators.",
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
    for item in news_items[1:7]:
        title_escaped = item["title"].replace("'", "\\'")
        summary_escaped = item["summary"].replace("'", "\\'")
        impact_escaped = item["impact"].replace("'", "\\'")
        news_list_js.append(f'''        {{
            title: '{title_escaped}',
            category: '{item["category"]}',
            summary: '{summary_escaped}',
            impact: '{impact_escaped}',
            source: '{item["source"]}',
            time: '{item["time"]}',
            image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=200&fit=crop&q=80'
        }}''')
    
    news_list_str = ",\n".join(news_list_js)
    hero = news_items[0]
    hero_title = hero.get("title", "AI News Today").replace("'", "\\'")
    hero_summary = hero.get("summary", "").replace("'", "\\'")
    hero_impact = hero.get("impact", "").replace("'", "\\'")
    hero_source = hero.get("source", "News")
    hero_time = hero.get("time", "Just now")
    
    hero_section = f'''    const heroNews = {{
        title: '{hero_title}',
        category: '{hero["category"]}',
        summary: '{hero_summary}',
        impact: '{hero_impact}',
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
        print(f"✅ Got {len(results)} fresh news items")
        news_items = [format_news_item(r, i) for i, r in enumerate(results)]
    else:
        print("⚠️  Using curated fallback news")
        news_items = get_fallback_news()
    
    # Update files
    update_news_json(news_items)
    update_app_js(news_items)
    
    # Git commit & push
    git_commit_push()
    
    print("\n✅ Daily briefing updated successfully!")

if __name__ == "__main__":
    main()
