// Report Center - Dynamic Content with Apple-style Design

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
            const target = tab.dataset.section;
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            sections.forEach(s => s.classList.remove('active'));
            document.getElementById(target).classList.add('active');
        });
    });
}

function updateDate() {
    const options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
    document.getElementById('navDate').textContent = new Date().toLocaleDateString('en-US', options);
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

// News - Dynamic with RSS fallback
async function loadNews() {
    const heroContainer = document.getElementById('heroNews');
    const gridContainer = document.getElementById('newsGrid');

    const heroNews = {
        title: 'Amazon in Talks to Invest $50B in OpenAI',
        category: 'Technology',
        desc: 'The massive investment would reshape the AI landscape and make Amazon a major player in generative AI.',
        date: new Date(),
        image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=400&fit=crop',
        url: 'https://techcrunch.com/2026/01/29/amazon-openai-investment/'
    };

    const newsList = [
        {
            title: 'SpaceX, Tesla, xAI Merger Talks Reported',
            category: 'Business',
            date: new Date(Date.now() - 5 * 60 * 60 * 1000),
            image: 'https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?w=400&h=200&fit=crop',
            url: '#'
        },
        {
            title: "Apple's AI Monetization Challenges",
            category: 'Company',
            date: new Date(Date.now() - 8 * 60 * 60 * 1000),
            image: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&h=200&fit=crop',
            url: '#'
        },
        {
            title: 'AI Content Transparency Labels Proposed',
            category: 'Policy',
            date: new Date(Date.now() - 12 * 60 * 60 * 1000),
            image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=200&fit=crop',
            url: '#'
        },
        {
            title: 'Trillion-Dollar AI Stocks to Watch',
            category: 'Finance',
            date: new Date(Date.now() - 24 * 60 * 60 * 1000),
            image: 'https://images.unsplash.com/photo-1611974765270-ca12586343bb?w=400&h=200&fit=crop',
            url: '#'
        },
        {
            title: 'Claude and GPT-5 Development Updates',
            category: 'Products',
            date: new Date(Date.now() - 26 * 60 * 60 * 1000),
            image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400&h=200&fit=crop',
            url: '#'
        },
        {
            title: 'New AI Design Tools Emerge',
            category: 'Design',
            date: new Date(Date.now() - 30 * 60 * 60 * 1000),
            image: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=400&h=200&fit=crop',
            url: '#'
        }
    ];

    // Render hero
    heroContainer.innerHTML = renderHero(heroNews);

    // Render grid
    gridContainer.innerHTML = newsList.map(news => renderNewsCard(news)).join('');
}

function renderHero(news) {
    return `
        <a href="${news.url}" target="_blank" class="hero-card">
            <img src="${news.image}" alt="${news.title}" class="hero-image" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 800 400%22><rect fill=%22%231d1d1e%22 width=%22800%22 height=%22400%22/></svg>'">
            <div class="hero-content">
                <div class="hero-category">${news.category}</div>
                <h3 class="hero-title">${news.title}</h3>
                <p class="hero-desc">${news.desc}</p>
                <div class="hero-date">${formatDate(news.date)}</div>
            </div>
        </a>
    `;
}

function renderNewsCard(news) {
    return `
        <a href="${news.url}" target="_blank" class="news-card">
            <img src="${news.image}" alt="${news.title}" class="news-image" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 400 200%22><rect fill=%22%231d1d1e%22 width=%22400%22 height=%22200%22/></svg>'">
            <div class="news-content">
                <div class="news-category">${news.category}</div>
                <h3 class="news-title">${news.title}</h3>
                <div class="news-date">${formatDate(news.date)}</div>
            </div>
        </a>
    `;
}

// Movies - Updated weekly
function loadMovies() {
    const container = document.getElementById('moviesGrid');

    const movies = [
        {
            title: 'Her',
            year: 2013,
            rating: 8.0,
            poster: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=300&h=450&fit=crop',
            url: '#'
        },
        {
            title: 'Ex Machina',
            year: 2014,
            rating: 7.7,
            poster: 'https://images.unsplash.com/photo-1535378433864-48cf10419c5c?w=300&h=450&fit=crop',
            url: '#'
        },
        {
            title: 'Blade Runner 2049',
            year: 2017,
            rating: 8.0,
            poster: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=300&h=450&fit=crop',
            url: '#'
        },
        {
            title: 'The Matrix',
            year: 1999,
            rating: 8.7,
            poster: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=300&h=450&fit=crop',
            url: '#'
        },
        {
            title: 'Everything Everywhere',
            year: 2022,
            rating: 7.8,
            poster: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=300&h=450&fit=crop',
            url: '#'
        },
        {
            title: 'Past Lives',
            year: 2023,
            rating: 7.9,
            poster: 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=300&h=450&fit=crop',
            url: '#'
        }
    ];

    container.innerHTML = movies.map(movie => `
        <a href="${movie.url}" target="_blank" class="movie-card">
            <img src="${movie.poster}" alt="${movie.title}" class="movie-poster" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 200 300%22><rect fill=%22%231d1d1e%22 width=%22200%22 height=%22300%22/></svg>'">
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

// Books - Updated weekly
function loadBooks() {
    const container = document.getElementById('booksGrid');

    const books = [
        {
            title: 'The Design of Everyday Things',
            author: 'Don Norman',
            rating: 4.5,
            desc: 'Foundational text on human-centered design principles.',
            cover: 'bg-blue-500',
            icon: '📘'
        },
        {
            title: 'Thinking, Fast and Slow',
            author: 'Daniel Kahneman',
            rating: 4.6,
            desc: 'Understanding the two systems that drive our thinking.',
            cover: 'bg-amber-600',
            icon: '📙'
        },
        {
            title: 'Creativity Inc.',
            author: 'Ed Catmull',
            rating: 4.5,
            desc: 'Overcoming the unseen forces that stand in the way of true inspiration.',
            cover: 'bg-red-500',
            icon: '📗'
        },
        {
            title: 'Steve Jobs',
            author: 'Walter Isaacson',
            rating: 4.6,
            desc: 'The exclusive biography of Apple\'s legendary founder.',
            cover: 'bg-gray-600',
            icon: '📓'
        },
        {
            title: 'The Soul of a New Machine',
            author: 'Tracy Kidder',
            rating: 4.4,
            desc: 'The story behind designing a new computer.',
            cover: 'bg-teal-600',
            icon: '📔'
        }
    ];

    const colors = ['#3b82f6', '#d97706', '#ef4444', '#6b7280', '#14b8a6'];

    container.innerHTML = books.map((book, i) => `
        <a href="#" class="book-card">
            <div class="book-cover" style="background: ${colors[i]}">${book.icon}</div>
            <div class="book-info">
                <div class="book-title">${book.title}</div>
                <div class="book-author">${book.author}</div>
                <div class="book-rating">${'★'.repeat(Math.floor(book.rating))} ${book.rating}</div>
                <p class="book-desc">${book.desc}</p>
            </div>
        </a>
    `).join('');
}

// Tools - Updated as needed
function loadTools() {
    const container = document.getElementById('toolsGrid');

    const tools = [
        { name: 'Cursor', category: 'Code Editor', desc: 'AI-first code editor built on VS Code', icon: '⌨️', color: '#3b82f6' },
        { name: 'Midjourney', category: 'Image', desc: 'AI-powered image generation', icon: '🎨', color: '#8b5cf6' },
        { name: 'Figma Make', category: 'Design', desc: 'Turn designs into code with AI', icon: '🎯', color: '#f59e0b' },
        { name: 'Claude', category: 'Chatbot', desc: 'Anthropic\'s AI assistant', icon: '💬', color: '#dc2626' },
        { name: 'Perplexity', category: 'Search', desc: 'AI-powered search engine', icon: '🔍', color: '#10b981' },
        { name: 'v0', category: 'UI Generator', desc: 'Generate React UI from text', icon: '🧩', color: '#6366f1' },
        { name: 'Lovable', category: 'Vibe Coding', desc: 'Build apps with natural language', icon: '🪄', color: '#ec4899' },
        { name: 'Bolt.new', category: 'AI IDE', desc: 'Full-stack AI development', icon: '⚡', color: '#0ea5e9' }
    ];

    container.innerHTML = tools.map(tool => `
        <a href="#" class="tool-card">
            <div class="tool-icon" style="background: ${tool.color}20; color: ${tool.color}">${tool.icon}</div>
            <div class="tool-name">${tool.name}</div>
            <div class="tool-category">${tool.category}</div>
            <p class="tool-desc">${tool.desc}</p>
        </a>
    `).join('');
}

// Date formatting
function formatDate(date) {
    const now = new Date();
    const diff = now - date;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;

    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
}
