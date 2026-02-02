# Briefing Site Upgrade Plan

*Proposed: Feb 2, 2026*

---

## Executive Summary

Current site is clean and functional. This plan enhances it with **personalization**, **offline support**, **better integrations**, and **smarter automation** while maintaining the Apple-inspired aesthetic.

---

## Phase 1: Core Infrastructure (Week 1)

### 1.1 Unified Data Layer
```
/report-center/
├── data/
│   ├── briefing.json      # Main daily briefing (NEW FORMAT)
│   ├── news.json          # Aggregated news (RSS feeds)
│   ├── tools.json         # Product Hunt top 8
│   ├── notes.json         # Quick notes (migrated from localStorage)
│   ├── preferences.json   # User settings (NEW)
│   └── cache/             # Local cache for offline
├── scripts/
│   ├── fetch-news.js      # RSS aggregator (MIT Tech Review, etc.)
│   ├── fetch-briefing.js  # Main briefing generator (NEW)
│   ├── sync-notion.js     # Two-way Notion sync (NEW)
│   └── generate-dashboard.js # Static HTML generator (NEW)
└── index.html             # Dashboard UI
```

**Why:** Centralized data layer enables offline mode, caching, and multi-device sync.

### 1.2 RSS-based News Fetching
```javascript
// sources.json
{
  "design": [
    "https://abduzeedo.com/rss",
    "https://www.smashingmagazine.com/feed",
    "https://designmodo.com/feed"
  ],
  "tech": [
    "https://www.theverge.com/rss/index.xml",
    "https://techcrunch.com/feed"
  ],
  "photography": [
    "https://iso.500px.com/feed"
  ]
}
```

**Benefits:**
- Free (no API keys needed)
- Reliable (no rate limits)
- Predictable format

---

## Phase 2: Design Enhancements (Week 2)

### 2.1 Tab Restructure

| Current | Proposed | Purpose |
|---------|----------|---------|
| news | **Briefing** | All-in-one morning digest |
| notes | **Design** | Design inspiration gallery |
| movies | **Projects** | Work in progress tracker |
| tools | **Tools** | Keep as-is + favorites |

### 2.2 New Features

**A. Quick Actions Bar (sticky header)**
```
┌─────────────────────────────────────────────────────┐
│  [Search...]  [Add Note]  [Sync]  [Settings ⚙️]    │
├─────────────────────────────────────────────────────┤
│  Briefing  |  Design  |  Projects  |  Tools  | AI  │
└─────────────────────────────────────────────────────┘
```

**B. Personalized Greeting**
```
"Good morning, Saber. You have 3 unread items."
```

**C. Smart Filtering**
- Filter news by: Design, Tech, Photography, AI
- Filter tools by: Most voted, New this week, Your favorites

**D. Dark Mode Toggle**
- Follow system preference
- LocalStorage persistence

### 2.3 Enhanced Card Design

**Before:**
```
┌─────────────────────┐
│ Category            │
│ Title               │
│ Why it matters      │
└─────────────────────┘
```

**After:**
```
┌─────────────────────────────┐
│ 🌟 Source           2h ago  │
│ Title                     │
│ Summary (2 lines)         │
│ [Read More →]  [Save ★]   │
└─────────────────────────────┘
```

---

## Phase 3: Smart Features (Week 3)

### 3.1 Reading List (Save for Later)
```javascript
// Saved items stored in localStorage
{
  "items": [
    { "id": "1", "url": "...", "title": "...", "savedAt": "2026-02-02" }
  ]
}
```

Features:
- One-click save from any card
- "Read now" or "Read later" options
- Offline reading queue
- Archive after read

### 3.2 Personalized Digest
```
Based on your interests:
- 5 design articles
- 3 AI tools
- 2 photography features
```

**Logic:**
- Track clicks/saves in localStorage
- Weight categories based on engagement
- Prioritize similar content

### 3.3 Smart Notifications
```
Browser notification (if enabled):
"New briefing ready • 5 items including new AI tools"
```

**Triggered by:**
- New daily briefing available
- Saved article has new content
- Tools list updated

---

## Phase 4: Integrations (Week 4)

### 4.1 Notion Sync (Two-way)

**Current:** One-way briefing → Notion

**Proposed:** Two-way sync
```
Briefing Site ↔ Notion
├── Push: Daily briefing, reading list
└── Pull: Notes, bookmarks, project status
```

**Implementation:**
```javascript
// sync-notion.js
async function syncToNotion(data) {
  // Create/update page in Notion
}

async function syncFromNotion() {
  // Fetch updates from Notion
  // Merge with local data
}
```

### 4.2 Bookmarklet for Quick Save
```javascript
// Drag to bookmarks bar
javascript:(function(){
  window.open('https://your-site.com/save?url='+encodeURIComponent(window.location.href)+'&title='+encodeURIComponent(document.title));
})();
```

Click bookmarklet → Opens save modal → Saved to reading list

### 4.3 Keyboard Shortcuts
| Key | Action |
|-----|--------|
| `n` | New note |
| `/` | Search |
| `s` | Save current item |
| `j/k` | Navigate cards |
| `Esc` | Close modal |

---

## Phase 5: Offline & Performance (Week 5)

### 5.1 Service Worker (PWA-ready)
```javascript
// sw.js
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open('briefing-v1').then(cache => {
    return cache.addAll(['/', '/index.html', '/data/briefing.json']);
  }));
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then(response => response || fetch(e.request))
  );
});
```

### 5.2 Performance Goals
| Metric | Target |
|--------|--------|
| First Contentful Paint | < 1s |
| Time to Interactive | < 2s |
| Lighthouse Score | > 90 |
| Offline functionality | Full read access |

### 5.3 Data Caching Strategy
```
Cache Strategy:
├── Briefing JSON: 1 hour
├── Tools JSON: 6 hours
├── Images: 24 hours (CDN)
└── Notes: Instant (localStorage)
```

---

## Phase 6: Analytics & Insights (Week 6)

### 6.1 Personal Metrics Dashboard

**Track:**
- Articles read per week
- Tools saved vs. used
- Time spent reading
- Most-read categories

**Display:**
```
This Week:
├── 12 articles read (↑ 4 from last week)
├── 3 tools bookmarked
├── Top category: Design (60%)
└── Reading streak: 5 days 🔥
```

### 6.2 Weekly Digest Email (Optional)
```
Subject: "Your Weekly Briefing Summary"

Hi Saber,

This week you:
• Read 12 articles
• Saved 3 tools
• Top interest: AI

Top articles:
1. ...
2. ...

[View full dashboard →]
```

---

## Implementation Priority

| Priority | Feature | Effort | Impact |
|----------|---------|--------|--------|
| P0 | RSS news fetching | 2h | High |
| P0 | Dark mode | 4h | High |
| P1 | Reading list | 1d | High |
| P1 | Notion two-way sync | 2d | Medium |
| P1 | Smart filtering | 4h | Medium |
| P2 | PWA/Service Worker | 2d | Medium |
| P2 | Keyboard shortcuts | 4h | Low |
| P3 | Weekly email | 2d | Low |
| P3 | Analytics dashboard | 3d | Low |

---

## Files to Create/Modify

**New files:**
- `/report-center/scripts/fetch-briefing.js`
- `/report-center/scripts/sync-notion.js`
- `/report-center/data/preferences.json`
- `/report-center/data/sources.json`
- `/report-center/sw.js`
- `/report-center/manifest.json`

**Modified files:**
- `/report-center/index.html` (new tabs, dark mode, reading list)
- `/report-center/data/briefing.json` (new format)
- `/report-center/scripts/fetch-news.js` (RSS support)

---

## Estimated Timeline

```
Week 1: Core Infrastructure
Week 2: Design Enhancements  
Week 3: Smart Features
Week 4: Integrations
Week 5: Offline & Performance
Week 6: Analytics & Insights
```

**Total: 6 weeks** (can be parallelized)

---

*Ready to start implementation?*
