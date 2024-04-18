function init() {
    // Event listeners for navigation buttons
    document.getElementById('top-rated-button').addEventListener('click', fetchTopRatedMovies);
    document.getElementById('popular-button').addEventListener('click', fetchPopularMovies);
    document.getElementById('movie-search-button').addEventListener('click', searchMovies);
    document.getElementById('person-search-button').addEventListener('click', searchPersons);
}

function fetchTopRatedMovies() {
    const apiKey = '';
    const url = `https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}&language=en-US&page=1`;

    fetchMovies(url);
}

function fetchPopularMovies() {
    const apiKey = '';
    const url = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=1`;

    fetchMovies(url);
}

function fetchMovies(url) {
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            displayMovies(data.results);
        })
        .catch(error => {
            console.error('Error fetching movies:', error);
        });
}

function searchMovies() {
    const query = document.getElementById('movie-query').value;
    const apiKey = '';
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}`;

    fetchMovies(url);
}

function searchPersons() {
    const query = document.getElementById('person-query').value;
    const apiKey = '';
    const url = `https://api.themoviedb.org/3/search/person?api_key=${apiKey}&query=${query}`;

    fetchMovies(url, 'person');
}

function displayMovies(movies) {
    const moviesList = document.getElementById('movies-list');
    moviesList.innerHTML = ''; // Clear previous results

    movies.forEach(movie => {
        const listItem = document.createElement('li');
        listItem.textContent = movie.title || movie.name;
        listItem.addEventListener('click', () => {
            fetchMovieDetails(movie.id);
        });
        moviesList.appendChild(listItem);
    });

    // Show movies list
    const moviesListElement = document.getElementById('movies-list');
    moviesListElement.style.display = 'block';

    // Show movie details container
    const movieDetails = document.getElementById('movie-details');
    movieDetails.style.display = 'none';
}

function fetchMovieDetails(movieId) {
    const apiKey = '';
    const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            displayMovieDetails(data);
        })
        .catch(error => {
            console.error('Error fetching movie details:', error);
        });
}

function displayMovieDetails(movie) {
    const detailsContainer = document.getElementById('movie-details');
    detailsContainer.innerHTML = ''; // Clear previous details

    const title = document.createElement('h2');
    title.textContent = movie.title || movie.name;

    const releaseDate = document.createElement('p');
    releaseDate.textContent = `Release Date: ${movie.release_date || movie.first_air_date}`;

    const overview = document.createElement('p');
    overview.textContent = movie.overview;

    const poster = document.createElement('img');
    poster.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
    poster.alt = movie.title || movie.name;

    detailsContainer.appendChild(title);
    detailsContainer.appendChild(releaseDate);
    detailsContainer.appendChild(overview);
    detailsContainer.appendChild(poster);

    // Hide movies list
    const moviesList = document.getElementById('movies-list');
    moviesList.style.display = 'none';

    // Show movie details container
    const movieDetails = document.getElementById('movie-details');
    movieDetails.style.display = 'block';
}

// Initialize the app
init();
