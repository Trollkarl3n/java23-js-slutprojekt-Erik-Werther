// API-nyckeln för att komma åt TMDB:s API
const API_KEY = 'f6705d536731d0614d69ccd67a93f448';

// Asynkron funktion för att hämta data från en given URL
async function fetchData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

// Funktion för att visa poster baserat på typ och villkor
function displayItems(items, containerId, itemType, showType = false, showOverview = false) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    items.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('item');

        // Skapa och sätt bild för varje item
        const image = document.createElement('img');
        if (itemType === 'person') {
            image.src = item.profile_path ? `https://image.tmdb.org/t/p/w500${item.profile_path}` : 'img/default-person-image.jpg';
            image.alt = item.name;
        } else {
            image.src = `https://image.tmdb.org/t/p/w500${item.poster_path}`;
            image.alt = item.title || item.name;
        }
        itemElement.appendChild(image);

        // Skapa och sätt titel för varje item
        const title = document.createElement('h3');
        title.textContent = item.title || item.name;
        itemElement.appendChild(title);

        // Visa typ (film eller TV-serie) om showType är sant
        if (showType && (itemType === 'movie' || itemType === 'tv')) {
            const mediaType = document.createElement('p');
            mediaType.textContent = `Type: ${item.media_type === 'tv' ? 'TV Series' : 'Movie'}`;
            itemElement.appendChild(mediaType);
        }

        // Visa detaljer baserat på item typ
        const details = document.createElement('p');
        if (itemType === 'movie') {
            details.textContent = `Release Date: ${item.release_date}`;
        } else if (itemType === 'person') {
            details.textContent = `Known For: ${item.known_for_department}`;
        } else if (itemType === 'tv') {
            details.textContent = item.first_air_date ? `First Air Date: ${item.first_air_date}` : 'Release Date: Not Available';
        }
        itemElement.appendChild(details);

        // Visa översikt om showOverview är sant och item är en film
        if (showOverview && itemType === 'movie' && item.overview) {
            const overview = document.createElement('p');
            overview.textContent = `Overview: ${item.overview}`;
            itemElement.appendChild(overview);
        }

        // Lägg till en klick-händelse för att hämta detaljer baserat på item typ
        itemElement.addEventListener('click', () => {
            if (itemType === 'movie') {
                fetchMovieDetails(item.id);
            } else if (itemType === 'person') {
                fetchPersonMovies(item.id);
            } else if (itemType === 'tv') {
                fetchTVSeriesDetails(item.id);
            }
        });

        container.appendChild(itemElement);
    });
}

// Funktion för att rensa innehållet i alla containrar
function clearAllContainers() {
    document.getElementById('top-rated-container').innerHTML = '';
    document.getElementById('popular-container').innerHTML = '';
    document.getElementById('search-results-container').innerHTML = '';
}

// Funktion för att hämta och visa toppbetygade filmer
async function fetchTopRatedMovies() {
    clearAllContainers();
    const url = `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&language=en-US&page=1`;
    try {
        const data = await fetchData(url);
        displayItems(data.results.slice(0, 10), 'top-rated-container', 'movie');
    } catch (error) {
        console.error('Error fetching top rated movies:', error);
        handleFetchError('top-rated-container');
    }
}

// Funktion för att hämta och visa populära filmer
async function fetchPopularMovies() {
    clearAllContainers();
    const url = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=1`;
    try {
        const data = await fetchData(url);
        displayItems(data.results.slice(0, 10), 'popular-container', 'movie');
    } catch (error) {
        console.error('Error fetching popular movies:', error);
        handleFetchError('popular-container');
    }
}

// Funktion för att söka och visa filmer eller TV-serier
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
        console.error('Error searching for movies/TV series:', error);
        handleFetchError('search-results-container');
    }
}

// Funktion för att söka och visa personer
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
        console.error('Error searching for persons:', error);
        handleFetchError('search-results-container');
    }
}

// Funktion för att hämta och visa filmens detaljer
async function fetchMovieDetails(movieId) {
    const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}`;
    try {
        const movieDetails = await fetchData(url);
        displayMovieDetails(movieDetails);
    } catch (error) {
        console.error('Error fetching movie details:', error);
        handleFetchError('search-results-container');
    }
}

// Funktion för att hämta och visa en persons toppfilmer
async function fetchPersonMovies(personId) {
    const url = `https://api.themoviedb.org/3/person/${personId}/combined_credits?api_key=${API_KEY}`;
    try {
        const data = await fetchData(url);
        const sortedCredits = data.cast.sort((a, b) => b.vote_average - a.vote_average);
        const topCredits = sortedCredits.slice(0, 3);
        displayItems(topCredits, 'search-results-container', 'movie', true); 
    } catch (error) {
        console.error('Error fetching person movies:', error);
        handleFetchError('search-results-container');
    }
}

// Funktion för att hantera fel vid hämtning av data
function handleFetchError(containerId) {
    document.getElementById(containerId).innerHTML = 'Error: Failed to fetch data.';
}

// Funktion för att hantera inga resultat vid sökning
function handleNoResults(containerId) {
    document.getElementById(containerId).innerHTML = 'Error: Nothing found.';
}

// Initieringsfunktion för att sätta upp event-lyssnare
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

// Kör initieringsfunktionen
init();