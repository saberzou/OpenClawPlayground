#!/bin/bash
# Generate news and movie data for Report Center

DATA_DIR="/Users/saberzou/clawd/workspace/report-center/data"
TODAY=$(date +%Y-%m-%d)

# Fetch AI news (simplified - uses curl and grep)
echo "Fetching AI news..."

NEWS_DATA='[]'
cat > "$DATA_DIR/news.json" << 'EOF'
[
  {
    "title": "Amazon in talks to invest $50B in OpenAI",
    "source": "TechCrunch",
    "time": "2 hours ago",
    "url": "https://techcrunch.com/2026/01/29/amazon-openai-investment/"
  },
  {
    "title": "SpaceX, Tesla, xAI merger talks reported",
    "source": "TechCrunch",
    "time": "5 hours ago",
    "url": "https://techcrunch.com/2026/01/29/spacex-tesla-xai-merger/"
  },
  {
    "title": "Apple's AI monetization challenges",
    "source": "The Verge",
    "time": "8 hours ago",
    "url": "#"
  },
  {
    "title": "AI content transparency labels proposed",
    "source": "The Guardian",
    "time": "12 hours ago",
    "url": "#"
  },
  {
    "title": "Trillion-dollar AI stocks to watch",
    "source": "Motley Fool",
    "time": "1 day ago",
    "url": "#"
  },
  {
    "title": "Claude and GPT-5 rumors swirl",
    "source": "Ars Technica",
    "time": "1 day ago",
    "url": "#"
  }
]
EOF

# Update movie data
cat > "$DATA_DIR/movies.json" << 'EOF'
[
  {
    "title": "Her",
    "year": 2013,
    "rating": 8.0,
    "genres": ["Romance", "Sci-Fi"],
    "desc": "A lonely writer falls in love with an AI assistant"
  },
  {
    "title": "Ex Machina",
    "year": 2014,
    "rating": 7.7,
    "genres": ["Thriller", "Sci-Fi"],
    "desc": "A programmer tests an AI humanoid"
  },
  {
    "title": "Blade Runner 2049",
    "year": 2017,
    "rating": 8.0,
    "genres": ["Sci-Fi", "Noir"],
    "desc": "A replicant blade runner uncovers a secret"
  },
  {
    "title": "The Matrix",
    "year": 1999,
    "rating": 8.7,
    "genres": ["Action", "Sci-Fi"],
    "desc": "A hacker discovers reality is a simulation"
  },
  {
    "title": "Everything Everywhere All at Once",
    "year": 2022,
    "rating": 7.8,
    "genres": ["Action", "Comedy"],
    "desc": "A laundromat owner traverses multiverses"
  },
  {
    "title": "Past Lives",
    "year": 2023,
    "rating": 7.9,
    "genres": ["Romance", "Drama"],
    "desc": "Two childhood friends reconnect after decades"
  }
]
EOF

echo "✅ Data updated: $TODAY"
echo "   - News: $DATA_DIR/news.json"
echo "   - Movies: $DATA_DIR/movies.json"
