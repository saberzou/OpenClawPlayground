// Report Center - Simple & Reliable

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    updateDate();
    renderAll();
});

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
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    document.getElementById('navDate').textContent = new Date().toLocaleDateString('en-US', options);
}

function renderAll() {
    renderNews();
    renderMovies();
    renderBooks();
    renderTools();
}

// News
function renderNews() {
    const news = [
        { title: 'Amazon in talks to invest $50B in OpenAI', source: 'TechCrunch', time: '2h ago' },
        { title: 'SpaceX, Tesla, xAI merger talks reported', source: 'TechCrunch', time: '5h ago' },
        { title: "Apple's AI monetization challenges", source: 'The Verge', time: '8h ago' },
        { title: 'AI content transparency labels proposed', source: 'The Guardian', time: '12h ago' },
        { title: 'Trillion-dollar AI stocks to watch', source: 'Motley Fool', time: '1d ago' }
    ];

    document.getElementById('newsList').innerHTML = news.map(item => `
        <div class="card">
            <h3><a href="#">${item.title}</a></h3>
            <div class="card-meta">${item.source} • ${item.time}</div>
        </div>
    `).join('');
}

// Movies
function renderMovies() {
    const movies = [
        { title: 'Her', year: 2013, rating: 8.0, tags: ['Romance', 'Sci-Fi'], desc: 'A lonely writer falls in love with an AI' },
        { title: 'Ex Machina', year: 2014, rating: 7.7, tags: ['Thriller', 'Sci-Fi'], desc: 'Testing an AI humanoid' },
        { title: 'Blade Runner 2049', year: 2017, rating: 8.0, tags: ['Sci-Fi', 'Noir'], desc: 'A replicant uncovers a secret' },
        { title: 'The Matrix', year: 1999, rating: 8.7, tags: ['Action', 'Sci-Fi'], desc: 'Reality is a simulation' },
        { title: 'Everything Everywhere', year: 2022, rating: 7.8, tags: ['Action', 'Comedy'], desc: 'Traversing multiverses' }
    ];

    document.getElementById('moviesList').innerHTML = movies.map(m => `
        <div class="card movie-card">
            <div class="movie-poster">🎬</div>
            <div class="movie-info">
                <h3>${m.title} (${m.year})</h3>
                <span class="movie-rating">★ ${m.rating}</span>
                <p class="movie-desc">${m.desc}</p>
                <div class="movie-tags">
                    ${m.tags.map(t => `<span class="tag">${t}</span>`).join('')}
                </div>
            </div>
        </div>
    `).join('');
}

// Books
function renderBooks() {
    const books = [
        { title: 'The Design of Everyday Things', author: 'Don Norman', rating: 4.5, desc: 'Foundational design principles' },
        { title: 'Thinking, Fast and Slow', author: 'Daniel Kahneman', rating: 4.6, desc: 'Understanding human thinking' },
        { title: 'Creativity Inc.', author: 'Ed Catmull', rating: 4.5, desc: 'Overcoming creative barriers' },
        { title: 'Steve Jobs', author: 'Walter Isaacson', rating: 4.6, desc: 'Apple founder biography' },
        { title: 'The Soul of a New Machine', author: 'Tracy Kidder', rating: 4.4, desc: 'Building a computer' }
    ];

    document.getElementById('booksList').innerHTML = books.map(b => `
        <div class="card book-card">
            <div class="book-cover">📖</div>
            <div class="book-info">
                <h3>${b.title}</h3>
                <div class="book-author">${b.author}</div>
                <div class="book-rating">${'★'.repeat(Math.floor(b.rating))} ${b.rating}</div>
                <p class="book-desc">${b.desc}</p>
            </div>
        </div>
    `).join('');
}

// Tools
function renderTools() {
    const tools = [
        { name: 'Cursor', category: 'Code', icon: '⌨️', desc: 'AI-first code editor' },
        { name: 'Midjourney', category: 'Image', icon: '🎨', desc: 'AI image generation' },
        { name: 'Figma Make', category: 'Design', icon: '🎯', desc: 'Design to code' },
        { name: 'Claude', category: 'Chat', icon: '💬', desc: 'AI assistant' },
        { name: 'Perplexity', category: 'Search', icon: '🔍', desc: 'AI-powered search' },
        { name: 'v0', category: 'UI', icon: '🧩', desc: 'React UI generator' },
        { name: 'Lovable', category: 'Vibe', icon: '🪄', desc: 'Vibe coding' },
        { name: 'Bolt.new', category: 'IDE', icon: '⚡', desc: 'AI IDE' }
    ];

    document.getElementById('toolsList').innerHTML = tools.map(t => `
        <div class="card tool-card">
            <div class="tool-icon">${t.icon}</div>
            <div class="tool-info">
                <h3>${t.name}</h3>
                <div class="tool-category">${t.category}</div>
                <p class="tool-desc">${t.desc}</p>
                <a href="#" class="tool-link">Learn more →</a>
            </div>
        </div>
    `).join('');
}
