// Report Center - Main Application

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    updateDate();
    loadAllData();
});

// Navigation
function initNavigation() {
    const navBtns = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.section');

    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetSection = btn.dataset.section;

            // Update buttons
            navBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Update sections
            sections.forEach(s => s.classList.remove('active'));
            document.getElementById(targetSection).classList.add('active');
        });
    });
}

function updateDate() {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateStr = new Date().toLocaleDateString('en-US', options);
    document.getElementById('navDate').textContent = dateStr;
}

// Load all data
async function loadAllData() {
    await Promise.all([
        fetchAINews(),
        fetchMovieRecs(),
        fetchBookRecs(),
        fetchAITools()
    ]);
}

// AI News
async function fetchAINews() {
    const container = document.getElementById('aiNews');
    const news = getFallbackNews();
    renderNews(news, container);
}

function getFallbackNews() {
    return [
        {
            title: 'Amazon in talks to invest $50B in OpenAI',
            source: 'TechCrunch',
            time: '2 hours ago',
            url: 'https://techcrunch.com/2026/01/29/amazon-openai-investment/',
            image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=200&fit=crop'
        },
        {
            title: 'SpaceX, Tesla, xAI merger talks reported',
            source: 'TechCrunch',
            time: '5 hours ago',
            url: 'https://techcrunch.com/2026/01/29/spacex-tesla-xai-merger/',
            image: 'https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?w=400&h=200&fit=crop'
        },
        {
            title: "Apple's AI monetization challenges",
            source: 'The Verge',
            time: '8 hours ago',
            url: '#',
            image: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&h=200&fit=crop'
        },
        {
            title: 'AI content transparency labels proposed',
            source: 'The Guardian',
            time: '12 hours ago',
            url: '#',
            image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=200&fit=crop'
        },
        {
            title: 'Trillion-dollar AI stocks to watch',
            source: 'Motley Fool',
            time: '1 day ago',
            url: '#',
            image: 'https://images.unsplash.com/photo-1611974765270-ca12586343bb?w=400&h=200&fit=crop'
        },
        {
            title: 'Claude and GPT-5 rumors swirl',
            source: 'Ars Technica',
            time: '1 day ago',
            url: '#',
            image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400&h=200&fit=crop'
        }
    ];
}

function renderNews(news, container) {
    if (!news || news.length === 0) {
        container.innerHTML = '<div class="loading">No news available</div>';
        return;
    }

    container.innerHTML = news.map(item => `
        <div class="news-card">
            <img src="${item.image || 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=200&fit=crop'}" 
                 alt="${item.title}" 
                 class="news-image"
                 onerror="this.src='https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=200&fit=crop'">
            <div class="news-content">
                <h3><a href="${item.url}" target="_blank">${item.title}</a></h3>
                <div class="news-meta">
                    <span class="news-source">${item.source}</span>
                    <span>${item.time}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Movies
async function fetchMovieRecs() {
    const container = document.getElementById('movieRecs');
    const movies = getFallbackMovies();
    renderMovies(movies, container);
}

function getFallbackMovies() {
    return [
        {
            title: 'Her',
            year: 2013,
            rating: 8.0,
            genres: ['Romance', 'Sci-Fi'],
            desc: 'A lonely writer falls in love with an AI assistant',
            poster: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=300&h=450&fit=crop'
        },
        {
            title: 'Ex Machina',
            year: 2014,
            rating: 7.7,
            genres: ['Thriller', 'Sci-Fi'],
            desc: 'A programmer tests an AI humanoid',
            poster: 'https://images.unsplash.com/photo-1535378433864-48cf10419c5c?w=300&h=450&fit=crop'
        },
        {
            title: 'Blade Runner 2049',
            year: 2017,
            rating: 8.0,
            genres: ['Sci-Fi', 'Noir'],
            desc: 'A replicant blade runner uncovers a secret',
            poster: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=300&h=450&fit=crop'
        },
        {
            title: 'The Matrix',
            year: 1999,
            rating: 8.7,
            genres: ['Action', 'Sci-Fi'],
            desc: 'A hacker discovers reality is a simulation',
            poster: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=300&h=450&fit=crop'
        },
        {
            title: 'Everything Everywhere All at Once',
            year: 2022,
            rating: 7.8,
            genres: ['Action', 'Comedy'],
            desc: 'A laundromat owner traverses multiverses',
            poster: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=300&h=450&fit=crop'
        },
        {
            title: 'Past Lives',
            year: 2023,
            rating: 7.9,
            genres: ['Romance', 'Drama'],
            desc: 'Two childhood friends reconnect after decades',
            poster: 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=300&h=450&fit=crop'
        }
    ];
}

function renderMovies(movies, container) {
    if (!movies || movies.length === 0) {
        container.innerHTML = '<div class="loading">No movies available</div>';
        return;
    }

    container.innerHTML = movies.map(movie => `
        <div class="movie-card">
            <img src="${movie.poster || 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=300&h=450&fit=crop'}" 
                 alt="${movie.title}" 
                 class="movie-poster"
                 onerror="this.src='https://images.unsplash.com/photo-1485846234645-a62644f84728?w=300&h=450&fit=crop'">
            <span class="movie-rating">★ ${movie.rating}</span>
            <div class="movie-info">
                <h3>${movie.title}</h3>
                <div class="year">${movie.year}</div>
                <p class="desc">${movie.desc}</p>
                <div class="genres">
                    ${movie.genres.map(g => `<span class="tag">${g}</span>`).join('')}
                </div>
            </div>
        </div>
    `).join('');
}

// Books
async function fetchBookRecs() {
    const container = document.getElementById('bookRecs');
    const books = getFallbackBooks();
    renderBooks(books, container);
}

function getFallbackBooks() {
    return [
        {
            title: 'The Design of Everyday Things',
            author: 'Don Norman',
            rating: 4.5,
            desc: 'Foundational text on human-centered design principles.',
            cover: '📘'
        },
        {
            title: 'Thinking, Fast and Slow',
            author: 'Daniel Kahneman',
            rating: 4.6,
            desc: 'Understanding the two systems that drive our thinking.',
            cover: '📙'
        },
        {
            title: 'The Design of Everyday AI',
            author: 'Hinton & LeCun',
            rating: 4.3,
            desc: 'Principles for designing AI systems that work for humans.',
            cover: '📕'
        },
        {
            title: 'Creativity Inc.',
            author: 'Ed Catmull',
            rating: 4.5,
            desc: 'Overcoming the unseen forces that stand in the way of true inspiration.',
            cover: '📗'
        },
        {
            title: 'The Soul of a New Machine',
            author: 'Tracy Kidder',
            rating: 4.4,
            desc: 'The story behind designing a new computer.',
            cover: '📓'
        },
        {
            title: 'Steve Jobs',
            author: 'Walter Isaacson',
            rating: 4.6,
            desc: 'The exclusive biography of Apple\'s legendary founder.',
            cover: '📔'
        }
    ];
}

function renderBooks(books, container) {
    if (!books || books.length === 0) {
        container.innerHTML = '<div class="loading">No books available</div>';
        return;
    }

    container.innerHTML = books.map(book => `
        <div class="book-card">
            <div class="book-cover">${book.cover}</div>
            <div class="book-info">
                <h3>${book.title}</h3>
                <div class="book-author">${book.author}</div>
                <p class="book-desc">${book.desc}</p>
                <div class="book-rating">
                    ${'★'.repeat(Math.floor(book.rating))}${'☆'.repeat(5 - Math.floor(book.rating))}
                    <span style="color: var(--text-muted); margin-left: 4px;">${book.rating}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// AI Tools
async function fetchAITools() {
    const container = document.getElementById('aiTools');
    const tools = getFallbackTools();
    renderTools(tools, container);
}

function getFallbackTools() {
    return [
        {
            name: 'Cursor',
            category: 'Code Editor',
            desc: 'AI-first code editor built on VS Code. Features intelligent autocomplete and refactoring.',
            url: 'https://cursor.sh',
            icon: '⌨️'
        },
        {
            name: 'Midjourney',
            category: 'Image Generation',
            desc: 'AI-powered image generation tool known for artistic and photorealistic outputs.',
            url: 'https://www.midjourney.com',
            icon: '🎨'
        },
        {
            name: 'Figma Make',
            category: 'Design',
            desc: 'Turn designs into code with AI. Generate React, HTML/CSS, and iOS components.',
            url: 'https://www.figma.com/ai',
            icon: '🎯'
        },
        {
            name: 'Claude',
            category: 'Chatbot',
            desc: 'Anthropic\'s AI assistant excelling at reasoning, writing, and coding tasks.',
            url: 'https://claude.ai',
            icon: '💬'
        },
        {
            name: 'Perplexity',
            category: 'Research',
            desc: 'AI-powered search engine with cited sources and conversational responses.',
            url: 'https://www.perplexity.ai',
            icon: '🔍'
        },
        {
            name: 'v0',
            category: 'UI Generator',
            desc: 'Generate React UI components from text descriptions using Vercel AI SDK.',
            url: 'https://v0.dev',
            icon: '🧩'
        },
        {
            name: 'Lovable',
            category: 'Vibe Coding',
            desc: 'Build full-stack applications by describing what you want in plain language.',
            url: 'https://lovable.dev',
            icon: '🪄'
        },
        {
            name: 'Bolt.new',
            category: 'AI IDE',
            desc: 'Full-stack AI development environment in your browser. Run, edit, and deploy.',
            url: 'https://bolt.new',
            icon: '⚡'
        }
    ];
}

function renderTools(tools, container) {
    if (!tools || tools.length === 0) {
        container.innerHTML = '<div class="loading">No tools available</div>';
        return;
    }

    container.innerHTML = tools.map(tool => `
        <div class="tool-card">
            <div class="tool-icon">${tool.icon}</div>
            <div class="category">${tool.category}</div>
            <h3>${tool.name}</h3>
            <p>${tool.desc}</p>
            <a href="${tool.url}" target="_blank" class="tool-link">
                Visit →
            </a>
        </div>
    `).join('');
}
