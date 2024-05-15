const API_KEY = 'f6705d536731d0614d69ccd67a93f448';

// Function to fetch data from the API
async function fetchData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching data:', error.message);
        throw error;
    }
}

// Function to display movies or persons
function displayItems(items, containerId, itemType, showType = false, showOverview = false) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    items.forEach(item => {
        const itemElement = createItemElement(item, itemType, showType, showOverview);
        container.appendChild(itemElement);
    });
}

// Function to create individual item elements
function createItemElement(item, itemType, showType, showOverview) {
    const itemElement = document.createElement('div');
    itemElement.classList.add('item');

    const image = document.createElement('img');
    if (itemType === 'person') {
        image.src = item.profile_path ? `https://image.tmdb.org/t/p/w500${item.profile_path}` : 'img/default-person-image.jpg';
        image.alt = item.name;
    } else {
        image.src = `https://image.tmdb.org/t/p/w500${item.poster_path}`;
        image.alt = item.title || item.name;
    }
    itemElement.appendChild(image);

    const title = document.createElement('h3');
    title.textContent = item.title || item.name;
    itemElement.appendChild(title);

    if (showType && (itemType === 'movie' || itemType === 'tv')) {
        const mediaType = document.createElement('p');
        mediaType.textContent = `Type: ${item.media_type === 'tv' ? 'TV Series' : 'Movie'}`;
        itemElement.appendChild(mediaType);
    }

    const details = document.createElement('p');
    details.textContent = getItemDetails(item, itemType);
    itemElement.appendChild(details);

    if (showOverview && itemType === 'movie' && item.overview) {
        const overview = document.createElement('p');
        overview.textContent = `Overview: ${item.overview}`;
        itemElement.appendChild(overview);
    }

    itemElement.addEventListener('click', () => {
        if (itemType === 'movie') {
            fetchMovieDetails(item.id);
        } else if (itemType === 'person') {
            fetchPersonMovies(item.id);
        } else if (itemType === 'tv') {
            fetchTVSeriesDetails(item.id);
        }
    });

    return itemElement;
}

// Function to get details based on item type
function getItemDetails(item, itemType) {
    if (itemType === 'movie') {
        return `Release Date: ${item.release_date}`;
    } else if (itemType === 'person') {
        return `Known For: ${item.known_for_department}`;
    } else if (itemType === 'tv') {
        return item.first_air_date ? `First Air Date: ${item.first_air_date}` : 'Release Date: Not Available';
    }
}

// Function to handle fetch errors
function handleFetchError(containerId) {
    document.getElementById(containerId).innerHTML = 'Error: Failed to fetch data.';
}

// Function to handle no results
function handleNoResults(containerId) {
    document.getElementById(containerId).innerHTML = 'Error: Nothing found.';
}

// Function to fetch top rated movies
async function fetchTopRatedMovies() {
    clearAllContainers();
    const url = `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&language=en-US&page=1`;
    try {
        const data = await fetchData(url);
        displayItems(data.results.slice(0, 10), 'top-rated-container', 'movie');
    } catch (error) {
        console.error('Error fetching top rated movies:', error.message);
        handleFetchError('top-rated-container');
        throw error;
    }
}

// Function to fetch popular movies
async function fetchPopularMovies() {
    clearAllContainers();
    const url = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=1`;
    try {
        const data = await fetchData(url);
        displayItems(data.results.slice(0, 10), 'popular-container', 'movie');
    } catch (error) {
        console.error('Error fetching popular movies:', error.message);
        handleFetchError('popular-container');
        throw error;
    }
}

// Function to search for movies or TV series
async function searchMovies() {
    clearAllContainers();
    const query = document.getElementById('movie-query').value;
    const url = `https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&query=${query}`;
    try {
        const data = await fetchData(url);
        const filteredResults = data.results.filter(item => item.media_type === 'movie' || item.media_type === 'tv');
        if (filteredResults.length === 0) {
            handleNoResults('search-results-container');
        } else {
            displayItems(filteredResults, 'search-results-container', 'movie', true, true);
        }
    } catch (error) {
        console.error('Error searching for movies/TV series:', error.message);
        handleFetchError('search-results-container');
        throw error;
    }
}

// Function to search for persons
async function searchPersons() {
    clearAllContainers();
    const query = document.getElementById('person-query').value;
    const url = `https://api.themoviedb.org/3/search/person?api_key=${API_KEY}&query=${query}`;
    try {
        const data = await fetchData(url);
        const filteredResults = data.results.filter(item => item.media_type !== 'tv');
        if (filteredResults.length === 0) {
            handleNoResults('search-results-container');
        } else {
            displayItems(filteredResults, 'search-results-container', 'person', true, true);
        }
    } catch (error) {
        console.error('Error searching for persons:', error.message);
        handleFetchError('search-results-container');
        throw error;
    }
}

// Function to fetch movie details
async function fetchMovieDetails(movieId) {
    const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}`;
    try {
        const movieDetails = await fetchData(url);
        displayMovieDetails(movieDetails);
    } catch (error) {
        console.error('Error fetching movie details:', error.message);
        handleFetchError('search-results-container');
        throw error;
    }
}

// Function to fetch movies of a person
async function fetchPersonMovies(personId) {
    const url = `https://api.themoviedb.org/3/person/${personId}/combined_credits?api_key=${API_KEY}`;
    try {
        const data = await fetchData(url);
        const sortedCredits = data.cast.sort((a, b) => b.vote_average - a.vote_average);
        const topCredits = sortedCredits.slice(0, 3);
        displayItems(topCredits, 'search-results-container', 'movie', true); 
    } catch (error) {
        console.error('Error fetching person movies:', error.message);
        handleFetchError('search-results-container');
        throw error;
    }
}

// Function to initialize the app
function init() {
    document.getElementById('top-rated-button').addEventListener('click', fetchTopRatedMovies);
    document.getElementById('popular-button').addEventListener('click', fetchPopularMovies);
    document.getElementById('movie-search-form').addEventListener('submit', function(event) {
        event.preventDefault();
        searchMovies();
    });
    document.getElementById('person-search-form').addEventListener('submit', function(event) {
        event.preventDefault();
        searchPersons();
    });
}

// Function to clear all containers
function clearAllContainers() {
    document.getElementById('top-rated-container').innerHTML = '';
    document.getElementById('popular-container').innerHTML = '';
    document.getElementById('search-results-container').innerHTML = '';
}

// Run initialization function
init();