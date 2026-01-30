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
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            sections.forEach(s => s.classList.remove('active'));
            document.getElementById(tab.dataset.section).classList.add('active');
        });
    });
}

function updateDate() {
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
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
    const hero = {
        title: 'Amazon in Talks to Invest $50B in OpenAI',
        category: 'Technology',
        date: new Date(),
        emoji: '📈'
    };

    const news = [
        { title: 'SpaceX, Tesla, xAI Merger Talks', category: 'Business', date: '5h ago', emoji: '🚀' },
        { title: "Apple's AI Monetization Challenges", category: 'Company', date: '8h ago', emoji: '🍎' },
        { title: 'AI Content Labels Proposed', category: 'Policy', date: '12h ago', emoji: '🏷️' },
        { title: 'Trillion-Dollar AI Stocks', category: 'Finance', date: '1d ago', emoji: '💰' },
        { title: 'Claude & GPT-5 Updates', category: 'Products', date: '1d ago', emoji: '🤖' },
        { title: 'New AI Design Tools', category: 'Design', date: '2d ago', emoji: '🎨' }
    ];

    let html = `
        <a href="#" class="hero-card">
            <div class="hero-image">${hero.emoji}</div>
            <div class="hero-content">
                <div class="hero-category">${hero.category}</div>
                <div class="hero-title">${hero.title}</div>
                <div class="hero-date">${formatDate(hero.date)}</div>
            </div>
        </a>
        <div class="news-grid">
    `;

    news.forEach(item => {
        html += `
            <a href="#" class="card news-card">
                <div class="news-image">${item.emoji}</div>
                <div class="news-title">${item.title}</div>
                <div class="news-date">${item.date}</div>
            </a>
        `;
    });

    html += '</div>';
    document.getElementById('newsContent').innerHTML = html;
}

// Movies
function renderMovies() {
    const movies = [
        { title: 'Her', year: 2013, rating: 8.0, emoji: '💕' },
        { title: 'Ex Machina', year: 2014, rating: 7.7, emoji: '🤖' },
        { title: 'Blade Runner 2049', year: 2017, rating: 8.0, emoji: '🔫' },
        { title: 'The Matrix', year: 1999, rating: 8.7, emoji: '💊' },
        { title: 'Everything Everywhere', year: 2022, rating: 7.8, emoji: '🥧' },
        { title: 'Past Lives', year: 2023, rating: 7.9, emoji: '👫' }
    ];

    document.getElementById('moviesContent').innerHTML = `
        <div class="movies-grid">
            ${movies.map(m => `
                <a href="#" class="card movie-card">
                    <div class="movie-poster">${m.emoji}</div>
                    <div class="movie-title">${m.title}</div>
                    <div class="movie-rating">★ ${m.rating}</div>
                </a>
            `).join('')}
        </div>
    `;
}

// Books
function renderBooks() {
    const books = [
        { title: 'The Design of Everyday Things', author: 'Don Norman', rating: 4.5, emoji: '📘', color: '#3b82f6' },
        { title: 'Thinking, Fast and Slow', author: 'Daniel Kahneman', rating: 4.6, emoji: '🧠', color: '#f59e0b' },
        { title: 'Creativity Inc.', author: 'Ed Catmull', rating: 4.5, emoji: '💡', color: '#ef4444' },
        { title: 'Steve Jobs', author: 'Walter Isaacson', rating: 4.6, emoji: '🍎', color: '#6b7280' },
        { title: 'The Soul of a New Machine', author: 'Tracy Kidder', rating: 4.4, emoji: '💻', color: '#14b8a6' }
    ];

    document.getElementById('booksContent').innerHTML = `
        <div class="books-grid">
            ${books.map(b => `
                <a href="#" class="card book-card">
                    <div class="book-cover" style="background: ${b.color}">${b.emoji}</div>
                    <div class="book-info">
                        <div class="book-title">${b.title}</div>
                        <div class="book-author">${b.author}</div>
                        <div class="movie-rating">★ ${b.rating}</div>
                    </div>
                </a>
            `).join('')}
        </div>
    `;
}

// Tools
function renderTools() {
    const tools = [
        { name: 'Cursor', category: 'Code', emoji: '⌨️', color: '#3b82f6' },
        { name: 'Midjourney', category: 'Image', emoji: '🎨', color: '#8b5cf6' },
        { name: 'Figma Make', category: 'Design', emoji: '🎯', color: '#f59e0b' },
        { name: 'Claude', category: 'Chat', emoji: '💬', color: '#dc2626' },
        { name: 'Perplexity', category: 'Search', emoji: '🔍', color: '#10b981' },
        { name: 'v0', category: 'UI', emoji: '🧩', color: '#6366f1' },
        { name: 'Lovable', category: 'Vibe', emoji: '🪄', color: '#ec4899' },
        { name: 'Bolt.new', category: 'IDE', emoji: '⚡', color: '#0ea5e9' }
    ];

    document.getElementById('toolsContent').innerHTML = `
        <div class="tools-grid">
            ${tools.map(t => `
                <a href="#" class="card tool-card">
                    <div class="tool-icon" style="background: ${t.color}20; color: ${t.color}">${t.emoji}</div>
                    <div>
                        <div class="tool-name">${t.name}</div>
                        <div class="tool-category">${t.category}</div>
                    </div>
                </a>
            `).join('')}
        </div>
    `;
}

// Date formatting
function formatDate(date) {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
