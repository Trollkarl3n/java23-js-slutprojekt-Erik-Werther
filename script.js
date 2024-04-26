// f6705d536731d0614d69ccd67a93f448
function init() {
    document.getElementById('top-rated-button').addEventListener('click', fetchTopRatedMovies);
    document.getElementById('popular-button').addEventListener('click', fetchPopularMovies);
    document.getElementById('movie-search-button').addEventListener('click', searchMovies);
    document.getElementById('person-search-button').addEventListener('click', searchPersons);
}

// Function to fetch top rated movies
function fetchTopRatedMovies() {
    const apiKey = 'f6705d536731d0614d69ccd67a93f448';
    const url = `https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}&language=en-US&page=1`;
    fetchMovies(url);
}

// Function to fetch popular movies
function fetchPopularMovies() {
    const apiKey = 'f6705d536731d0614d69ccd67a93f448';
    const url = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=1`;
    fetchMovies(url);
}

// Function to search for persons
function searchPersons() {
    const query = document.getElementById('person-query').value;
    const apiKey = 'f6705d536731d0614d69ccd67a93f448';
    const url = `https://api.themoviedb.org/3/search/person?api_key=${apiKey}&query=${query}`;
    fetchMovies(url, 'person');
}

// Function to search for movies
function searchMovies() {
    const query = document.getElementById('movie-query').value;
    const apiKey = 'f6705d536731d0614d69ccd67a93f448';
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}`;
    fetchMovies(url);
}

// General function to fetch movies or persons
function fetchMovies(url, type = 'movie') {
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (type === 'movie') {
                displayMovies(data.results);
            } else if (type === 'person') {
                displayPersons(data.results);
            }
        })
        .catch(error => {
            console.error('Error fetching data', error);
        });
}

// Function to display movies
function displayMovies(movies) {
    const moviesList = document.getElementById('movies-list');
    moviesList.innerHTML = '';

    if (movies.length === 0) {
        const noResultsMessage = document.createElement('p');
        noResultsMessage.textContent = 'There are no movies with that name.';
        moviesList.appendChild(noResultsMessage);
        return;
    }

    movies.forEach(movie => {
        const listItem = document.createElement('li');
        const movieInfo = document.createElement('div');
        const poster = document.createElement('img');
        const movieTitle = document.createElement('h3');
        const releaseDate = document.createElement('p');

        poster.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
        poster.alt = movie.title;
        movieTitle.textContent = movie.title;
        releaseDate.textContent = `Release Date: ${movie.release_date}`;

        movieInfo.appendChild(poster);
        movieInfo.appendChild(movieTitle);
        movieInfo.appendChild(releaseDate);

        listItem.appendChild(movieInfo);

        listItem.addEventListener('click', () => {
            fetchMovieDetails(movie.id);
        });

        moviesList.appendChild(listItem);
    });

    const movieDetails = document.getElementById('movie-details');
    movieDetails.style.display = 'none';
    const tvShows = document.getElementById('tv-shows');
    tvShows.style.display = 'none';
    const searchContainer = document.querySelector('.search-container');
    moviesList.style.display = 'block';
}

// Function to display persons
function displayPersons(persons) {
    const moviesList = document.getElementById('movies-list');
    moviesList.innerHTML = '';
    const tvShowsList = document.getElementById('tv-shows-list');
    tvShowsList.innerHTML = '';

    if (persons.length === 0) {
        const noResultsMessage = document.createElement('p');
        noResultsMessage.textContent = 'There are no actors with that name.';
        moviesList.appendChild(noResultsMessage);
        return;
    }

    persons.forEach(person => {
        const listItem = document.createElement('li');
        const personInfo = document.createElement('div');
        const profilePic = document.createElement('img');
        const personName = document.createElement('h3');
        const knownFor = document.createElement('p');

        profilePic.src = `https://image.tmdb.org/t/p/w500${person.profile_path}`;
        profilePic.alt = person.name;
        personName.textContent = person.name;
        knownFor.textContent = `Known For: ${person.known_for_department}`;

        personInfo.appendChild(profilePic);
        personInfo.appendChild(personName);
        personInfo.appendChild(knownFor);

        listItem.appendChild(personInfo);

        listItem.addEventListener('click', () => {
            fetchPersonData(person.id);
        });

        moviesList.appendChild(listItem);
    });

    const movieDetails = document.getElementById('movie-details');
    movieDetails.style.display = 'none';
    const tvShows = document.getElementById('tv-shows');
    tvShows.style.display = 'none';
    const searchContainer = document.querySelector('.search-container');
    searchContainer.style.display = 'block';
}

// Function to fetch movies and TV shows of a person
function fetchPersonData(personId) {
    const apiKey = 'f6705d536731d0614d69ccd67a93f448';
    const movieUrl = `https://api.themoviedb.org/3/person/${personId}/movie_credits?api_key=${apiKey}`;
    const tvUrl = `https://api.themoviedb.org/3/person/${personId}/tv_credits?api_key=${apiKey}`;

    const moviePromise = fetch(movieUrl).then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    });

    const tvPromise = fetch(tvUrl).then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    });

    Promise.all([moviePromise, tvPromise])
        .then(([movieData, tvData]) => {
            displayMoviesAndTVShows(movieData.cast, tvData.cast);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

// Function to display movies and TV shows of a person
function displayMoviesAndTVShows(movieData, tvData) {
    displayPersonsMovies(movieData);
    displayTVShows(tvData);
}

// Function to display movies of a person
function displayPersonsMovies(movies) {
    const moviesList = document.getElementById('movies-list');
    moviesList.innerHTML = '';

    movies.forEach(movie => {
        const listItem = document.createElement('li');
        const movieInfo = document.createElement('div');
        const movieTitle = document.createElement('span');
        const typeLabel = document.createElement('span');
        const releaseDate = document.createElement('span');
        const poster = document.createElement('img');

        movieTitle.textContent = movie.title;
        releaseDate.textContent = movie.release_date;
        typeLabel.textContent = '(Movie)';
        poster.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
        poster.alt = movie.title;

        movieInfo.appendChild(poster);
        movieInfo.appendChild(movieTitle);
        movieInfo.appendChild(releaseDate);
        movieInfo.appendChild(typeLabel);

        listItem.appendChild(movieInfo);

        listItem.addEventListener('click', () => {
            fetchMovieDetails(movie.id);
        });

        moviesList.appendChild(listItem);
    });

    const movieDetails = document.getElementById('movie-details');
    movieDetails.style.display = 'none';
    moviesList.style.display = 'block';
}

// Function to fetch movie details
function fetchMovieDetails(movieId) {
    const apiKey = 'f6705d536731d0614d69ccd67a93f448';
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
            console.error('Error fetching movie data:', error);
        });
}

// Function to display movie details
function displayMovieDetails(movie) {
    const detailsContainer = document.getElementById('movie-details');
    detailsContainer.innerHTML = '';

    const title = document.createElement('h2');
    const releaseDate = document.createElement('p');
    const overview = document.createElement('p');
    const poster = document.createElement('img');

    title.textContent = movie.title;
    releaseDate.textContent = `Release Date: ${movie.release_date}`;
    overview.textContent = movie.overview;
    poster.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
    poster.alt = movie.title;

    detailsContainer.appendChild(title);
    detailsContainer.appendChild(poster);
    detailsContainer.appendChild(releaseDate);
    detailsContainer.appendChild(overview);

    const moviesList = document.getElementById('movies-list');
    moviesList.style.display = 'none';
    detailsContainer.style.display = 'block';
    const tvShowsList = document.getElementById('tv-shows-list');
    tvShowsList.style.display = 'none';
}

// Function to display TV shows
function displayTVShows(tvShows) {
    const tvShowsList = document.getElementById('tv-shows-list');
    tvShowsList.innerHTML = '';

    tvShows.forEach(tvShow => {
        const listItem = document.createElement('li');
        const tvShowInfo = document.createElement('div');
        const tvShowTitle = document.createElement('h3');
        const typeLabel = document.createElement('span');
        const firstAirDate = document.createElement('p');
        const poster = document.createElement('img');

        tvShowTitle.textContent = tvShow.name;
        firstAirDate.textContent = `First Air Date: ${tvShow.first_air_date}`;
        typeLabel.textContent = '(TV Show)';
        poster.src = `https://image.tmdb.org/t/p/w500${tvShow.poster_path}`;
        poster.alt = tvShow.name;

        tvShowInfo.appendChild(poster);
        tvShowInfo.appendChild(tvShowTitle);
        tvShowInfo.appendChild(firstAirDate);
        tvShowInfo.appendChild(typeLabel);

        listItem.appendChild(tvShowInfo);

        listItem.addEventListener('click', () => {
            fetchTvShowDetails(tvShow.id);
        });

        tvShowsList.appendChild(listItem);
    });

    const tvShowsContainer = document.getElementById('tv-shows');
    tvShowsContainer.style.display = 'block';
    tvShowsList.style.display = 'block';
}

// Function to fetch TV show details
function fetchTvShowDetails(tvShowId) {
    const apiKey = 'f6705d536731d0614d69ccd67a93f448';
    const url = `https://api.themoviedb.org/3/tv/${tvShowId}?api_key=${apiKey}`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            displayTvShowDetails(data);
        })
        .catch(error => {
            console.error('Error fetching TV show data:', error);
        });
}

// Function to display TV show details
function displayTvShowDetails(tvShow) {
    const tvShowInfo = document.getElementById('movie-details');
    tvShowInfo.innerHTML = '';

    const title = document.createElement('h2');
    title.textContent = tvShow.name;

    const overview = document.createElement('p');
    overview.textContent = tvShow.overview || 'Overview not available';

    const poster = document.createElement('img');
    poster.src = `https://image.tmdb.org/t/p/w500${tvShow.poster_path}`;
    poster.alt = tvShow.name;

    const releaseDate = document.createElement('p');
    releaseDate.textContent = `First Air Date: ${tvShow.first_air_date || 'Not available'}`;

    const status = document.createElement('p');
    status.textContent = `Status: ${tvShow.status || 'Not available'}`;

    tvShowInfo.appendChild(title);
    tvShowInfo.appendChild(poster);
    tvShowInfo.appendChild(overview);
    tvShowInfo.appendChild(releaseDate);
    tvShowInfo.appendChild(status);

    const tvShows = document.getElementById('tv-shows');
    tvShows.style.display = 'none';
    tvShowInfo.style.display = 'block';
    const moviesList = document.getElementById('movies-list');
    moviesList.style.display = 'none';
}

// Initialize the app
init();