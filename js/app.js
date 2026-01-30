// Report Center - Data Fetching & Display

document.addEventListener('DOMContentLoaded', () => {
    updateDate();
    fetchAINews();
    fetchMovieRecs();
});

function updateDate() {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('currentDate').textContent = new Date().toLocaleDateString('en-US', options);
}

// AI News from multiple sources
async function fetchAINews() {
    const container = document.getElementById('aiNews');
    const sources = [
        { name: 'TechCrunch', url: 'https://techcrunch.com/category/artificial-intelligence/feed/', limit: 3 },
        { name: 'Google News', url: 'https://news.google.com/rss/search?q=AI+artificial+intelligence&hl=en-US&gl=US&ceid=US:en', limit: 4 }
    ];

    try {
        // Try fetching from our local proxy first
        let news = await fetchLocalNews();
        if (news.length === 0) {
            news = getFallbackNews();
        }
        renderNews(news, container);
    } catch (error) {
        console.log('Using fallback news data');
        renderNews(getFallbackNews(), container);
    }
}

async function fetchLocalNews() {
    try {
        const response = await fetch('data/news.json');
        if (response.ok) {
            return await response.json();
        }
    } catch (e) {
        // Local file not available
    }
    return [];
}

function getFallbackNews() {
    return [
        {
            title: 'Amazon in talks to invest $50B in OpenAI',
            source: 'TechCrunch',
            time: '2 hours ago',
            url: 'https://techcrunch.com/2026/01/29/amazon-openai-investment/'
        },
        {
            title: 'SpaceX, Tesla, xAI merger talks reported',
            source: 'TechCrunch',
            time: '5 hours ago',
            url: 'https://techcrunch.com/2026/01/29/spacex-tesla-xai-merger/'
        },
        {
            title: 'Apple\'s AI monetization challenges',
            source: 'The Verge',
            time: '8 hours ago',
            url: '#'
        },
        {
            title: 'AI content transparency labels proposed',
            source: 'The Guardian',
            time: '12 hours ago',
            url: '#'
        },
        {
            title: 'Trillion-dollar AI stocks to watch',
            source: 'Motley Fool',
            time: '1 day ago',
            url: '#'
        },
        {
            title: 'Claude and GPT-5 rumors swirl',
            source: 'Ars Technica',
            time: '1 day ago',
            url: '#'
        }
    ];
}

function renderNews(news, container) {
    if (!news || news.length === 0) {
        container.innerHTML = '<div class="loading">No news available</div>';
        return;
    }

    container.innerHTML = news.map(item => `
        <div class="card">
            <h3><a href="${item.url}" target="_blank">${item.title}</a></h3>
            <p>${item.source || 'AI News'}</p>
            <div class="meta">
                <span>${item.time || 'Recently'}</span>
            </div>
        </div>
    `).join('');
}

// Movie Recommendations
async function fetchMovieRecs() {
    const container = document.getElementById('movieRecs');

    try {
        const response = await fetch('data/movies.json');
        let movies;
        if (response.ok) {
            movies = await response.json();
        } else {
            movies = getFallbackMovies();
        }
        renderMovies(movies, container);
    } catch (error) {
        renderMovies(getFallbackMovies(), container);
    }
}

function getFallbackMovies() {
    return [
        {
            title: 'Her',
            year: 2013,
            rating: 8.0,
            genres: ['Romance', 'Sci-Fi'],
            desc: 'A lonely writer falls in love with an AI assistant'
        },
        {
            title: 'Ex Machina',
            year: 2014,
            rating: 7.7,
            genres: ['Thriller', 'Sci-Fi'],
            desc: 'A programmer tests an AI humanoid'
        },
        {
            title: 'Blade Runner 2049',
            year: 2017,
            rating: 8.0,
            genres: ['Sci-Fi', 'Noir'],
            desc: 'A replicant blade runner uncovers a secret'
        },
        {
            title: 'The Matrix',
            year: 1999,
            rating: 8.7,
            genres: ['Action', 'Sci-Fi'],
            desc: 'A hacker discovers reality is a simulation'
        },
        {
            title: 'Everything Everywhere All at Once',
            year: 2022,
            rating: 7.8,
            genres: ['Action', 'Comedy'],
            desc: 'A laundromat owner traverses multiverses'
        },
        {
            title: 'Past Lives',
            year: 2023,
            rating: 7.9,
            genres: ['Romance', 'Drama'],
            desc: 'Two childhood friends reconnect after decades'
        }
    ];
}

function renderMovies(movies, container) {
    if (!movies || movies.length === 0) {
        container.innerHTML = '<div class="loading">No movies available</div>';
        return;
    }

    container.innerHTML = movies.map(movie => `
        <div class="card movie-card">
            <span class="rating">★ ${movie.rating}</span>
            <h3>${movie.title} (${movie.year})</h3>
            <p>${movie.desc}</p>
            <div class="genres">
                ${movie.genres.map(g => `<span class="tag">${g}</span>`).join('')}
            </div>
        </div>
    `).join('');
}
