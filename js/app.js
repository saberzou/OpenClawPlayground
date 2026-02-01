// Report Center - Morning Briefing Experience

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    updateDate();
    loadAllContent();
});

// Navigation
function initNavigation() {
    const tabs = document.querySelectorAll('.nav-tab');
    const sections = document.querySelectorAll('.section');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            sections.forEach(s => s.classList.remove('active'));
            document.getElementById(tab.dataset.section).classList.add('active');
        });
    });
}

function updateDate() {
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    document.getElementById('currentDate').textContent = new Date().toLocaleDateString('en-US', options);
}

// Load all content
async function loadAllContent() {
    await Promise.all([
        loadNews(),
        loadMovies(),
        loadBooks(),
        loadTools()
    ]);
}

// News - Main morning briefing
async function loadNews() {
    const container = document.getElementById('newsContainer');

                                                                const heroNews = {
        title: 'AI Developments Continue at Rapid Pace - February 02',
        category: 'Technology',
        summary: 'The latest developments in artificial intelligence and technology.',
        impact: 'Staying informed about AI progress helps you understand industry direction.',
        source: 'Industry News',
        time: 'Today',
        image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=400&fit=crop&q=80'
    };

    const newsList = [
        {
            title: 'New Machine Learning Models Set Performance Records',
            category: 'Research',
            summary: 'Researchers announce breakthrough performance benchmarks.',
            impact: 'Better models mean more capable AI systems for everyone.',
            source: 'Tech Weekly',
            time: '4 hours ago',
            image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=200&fit=crop&q=80'
        },
        {
            title: 'Enterprise AI Adoption Accelerates in Q1',
            category: 'Business',
            summary: 'Major companies increase AI investment and deployment.',
            impact: 'Enterprise adoption signals market maturity and job market trends.',
            source: 'Business Insider',
            time: '6 hours ago',
            image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=200&fit=crop&q=80'
        },
        {
            title: 'Open Source AI Tools Gain Popularity',
            category: 'Tools',
            summary: 'Community-driven AI projects see rapid growth.',
            impact: 'Open source tools democratize access to AI capabilities.',
            source: 'Developer News',
            time: '8 hours ago',
            image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=200&fit=crop&q=80'
        },
        {
            title: 'AI Regulations Discussion Continues Globally',
            category: 'Policy',
            summary: 'Governments debate comprehensive AI governance frameworks.',
            impact: 'Regulations will shape how AI can be developed and used.',
            source: 'Policy Watch',
            time: '12 hours ago',
            image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=200&fit=crop&q=80'
        },
        {
            title: 'Breakthrough in Natural Language Processing',
            category: 'Research',
            summary: 'New NLP techniques show improvements in understanding.',
            impact: 'Better language understanding improves chatbots and translators.',
            source: 'Research Daily',
            time: '1 day ago',
            image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=200&fit=crop&q=80'
        }
    ];

    let html = `
        <a href="#" class="news-hero" onclick="return false;">
            <img src="${heroNews.image}" alt="${heroNews.title}" class="hero-image" 
                 onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 800 400%22><rect fill=%22%231c1c1e%22 width=%22800%22 height=%22400%22/></svg>'">
            <div class="hero-content">
                <div class="hero-category">${heroNews.category}</div>
                <h3 class="hero-title">${heroNews.title}</h3>
                <p class="hero-summary">${heroNews.summary}</p>
                <div class="hero-meta">
                    <span>${heroNews.source}</span>
                    <span>${heroNews.time}</span>
                </div>
            </div>
        </a>
        <div class="news-grid">
    `;

    newsList.forEach(item => {
        html += `
            <a href="#" class="news-card" onclick="return false;">
                <img src="${item.image}" alt="${item.title}" class="news-image"
                     onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 400 200%22><rect fill=%22%231c1c1e%22 width=%22400%22 height=%22200%22/></svg>'">
                <div class="news-content">
                    <div class="news-category">${item.category}</div>
                    <h3 class="news-title">${item.title}</h3>
                    <div class="news-meta">${item.source} • ${item.time}</div>
                </div>
            </a>
        `;
    });

    html += '</div>';
    container.innerHTML = html;
}

// Movies - Weekly picks
function loadMovies() {
    const container = document.getElementById('moviesContainer');

    const movies = [
        {
            title: 'Her',
            year: 2013,
            rating: 8.0,
            poster: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=300&h=450&fit=crop&q=80',
            desc: 'A lonely writer falls in love with an AI assistant'
        },
        {
            title: 'Ex Machina',
            year: 2014,
            rating: 7.7,
            poster: 'https://images.unsplash.com/photo-1535378433864-48cf10419c5c?w=300&h=450&fit=crop&q=80',
            desc: 'A programmer tests an AI humanoid'
        },
        {
            title: 'Blade Runner 2049',
            year: 2017,
            rating: 8.0,
            poster: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=300&h=450&fit=crop&q=80',
            desc: 'A replicant uncovers a secret'
        },
        {
            title: 'The Matrix',
            year: 1999,
            rating: 8.7,
            poster: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=300&h=450&fit=crop&q=80',
            desc: 'Reality is a simulation'
        },
        {
            title: 'Everything Everywhere',
            year: 2022,
            rating: 7.8,
            poster: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=300&h=450&fit=crop&q=80',
            desc: 'A laundromat owner traverses multiverses'
        },
        {
            title: 'Past Lives',
            year: 2023,
            rating: 7.9,
            poster: 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=300&h=450&fit=crop&q=80',
            desc: 'Two childhood friends reconnect after decades'
        }
    ];

    container.innerHTML = movies.map(movie => `
        <a href="#" class="movie-card" onclick="return false;">
            <img src="${movie.poster}" alt="${movie.title}" class="movie-poster"
                 onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 200 300%22><rect fill=%22%231c1c1e%22 width=%22200%22 height=%22300%22/></svg>'">
            <div class="movie-info">
                <div class="movie-title">${movie.title}</div>
                <div class="movie-meta">
                    <span class="movie-rating">★ ${movie.rating}</span>
                    <span class="movie-year">${movie.year}</span>
                </div>
            </div>
        </a>
    `).join('');
}

// Books - Weekly picks
function loadBooks() {
    const container = document.getElementById('booksContainer');

    const books = [
        {
            title: 'The Design of Everyday Things',
            author: 'Don Norman',
            rating: 4.5,
            desc: 'Foundational text on human-centered design principles. Essential reading for anyone building products.',
            cover: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=140&h=200&fit=crop&q=80'
        },
        {
            title: 'Thinking, Fast and Slow',
            author: 'Daniel Kahneman',
            rating: 4.6,
            desc: 'Understanding the two systems that drive our thinking. Nobel prize-winning research made accessible.',
            cover: 'https://images.unsplash.com/photo-1555116505-38ab61800975?w=140&h=200&fit=crop&q=80'
        },
        {
            title: 'Creativity Inc.',
            author: 'Ed Catmull',
            rating: 4.5,
            desc: 'Overcoming the unseen forces that stand in the way of true inspiration. From Pixar\'s co-founder.',
            cover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=140&h=200&fit=crop&q=80'
        },
        {
            title: 'Steve Jobs',
            author: 'Walter Isaacson',
            rating: 4.6,
            desc: 'The exclusive biography of Apple\'s legendary founder. Deep dive into the mind of a visionary.',
            cover: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=140&h=200&fit=crop&q=80'
        },
        {
            title: 'The Soul of a New Machine',
            author: 'Tracy Kidder',
            rating: 4.4,
            desc: 'The story behind designing a new computer. Pulitzer-winning portrait of engineering culture.',
            cover: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=140&h=200&fit=crop&q=80'
        }
    ];

    container.innerHTML = books.map(book => `
        <a href="#" class="book-card" onclick="return false;">
            <img src="${book.cover}" alt="${book.title}" class="book-cover"
                 onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 70 100%22><rect fill=%22%233b82f6%22 width=%2270%22 height=%22100%22 rx=%226%22/></svg>'">
            <div class="book-info">
                <div class="book-title">${book.title}</div>
                <div class="book-author">${book.author}</div>
                <div class="book-rating">${'★'.repeat(Math.floor(book.rating))} ${book.rating}</div>
                <p class="book-desc">${book.desc}</p>
            </div>
        </a>
    `).join('');
}

// Tools - Curated collection
function loadTools() {
    const container = document.getElementById('toolsContainer');

    const tools = [
        {
            name: 'Cursor',
            category: 'Code Editor',
            desc: 'AI-first code editor built on VS Code. Features intelligent autocomplete and refactoring.',
            icon: '⌨️',
            color: '#3b82f6'
        },
        {
            name: 'Midjourney',
            category: 'Image Generation',
            desc: 'AI-powered image generation known for artistic and photorealistic outputs.',
            icon: '🎨',
            color: '#8b5cf6'
        },
        {
            name: 'Figma Make',
            category: 'Design to Code',
            desc: 'Turn designs into code with AI. Generate React, HTML/CSS, and iOS components.',
            icon: '🎯',
            color: '#f59e0b'
        },
        {
            name: 'Claude',
            category: 'AI Assistant',
            desc: 'Anthropic\'s AI assistant excelling at reasoning, writing, and coding tasks.',
            icon: '💬',
            color: '#dc2626'
        },
        {
            name: 'Perplexity',
            category: 'AI Search',
            desc: 'AI-powered search engine with cited sources and conversational responses.',
            icon: '🔍',
            color: '#10b981'
        },
        {
            name: 'v0',
            category: 'UI Generator',
            desc: 'Generate React UI components from text descriptions using Vercel AI SDK.',
            icon: '🧩',
            color: '#6366f1'
        },
        {
            name: 'Lovable',
            category: 'Vibe Coding',
            desc: 'Build full-stack applications by describing what you want in plain language.',
            icon: '🪄',
            color: '#ec4899'
        },
        {
            name: 'Bolt.new',
            category: 'AI IDE',
            desc: 'Full-stack AI development environment. Run, edit, and deploy in browser.',
            icon: '⚡',
            color: '#0ea5e9'
        }
    ];

    container.innerHTML = tools.map(tool => `
        <a href="#" class="tool-card" onclick="return false;">
            <div class="tool-icon" style="background: ${tool.color}20; color: ${tool.color}">${tool.icon}</div>
            <div class="tool-info">
                <div class="tool-name">${tool.name}</div>
                <div class="tool-category">${tool.category}</div>
                <p class="tool-desc">${tool.desc}</p>
            </div>
        </a>
    `).join('');
}
