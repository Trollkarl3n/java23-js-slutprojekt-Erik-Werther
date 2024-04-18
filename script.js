function init() {
    // Event listeners for navigation buttons
    document.getElementById('top-rated-button').addEventListener('click', fetchTopRatedMovies);
    document.getElementById('popular-button').addEventListener('click', fetchPopularMovies);
    document.getElementById('movie-search-button').addEventListener('click', searchMovies);
    document.getElementById('person-search-button').addEventListener('click', searchPersons);
}

function fetchTopRatedMovies() {
    const apiKey = 'f6705d536731d0614d69ccd67a93f448';
    const url = `https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}&language=en-US&page=1`;

    fetchMovies(url);
}

function fetchPopularMovies() {
    const apiKey = 'f6705d536731d0614d69ccd67a93f448';
    const url = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=1`;

    fetchMovies(url);
}

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
            console.error('Error fetching movies or persons:', error);
        });
}

function searchMovies() {
    const query = document.getElementById('movie-query').value;
    const apiKey = 'f6705d536731d0614d69ccd67a93f448';
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}`;

    fetchMovies(url);
}

function searchPersons() {
    const query = document.getElementById('person-query').value;
    const apiKey = 'f6705d536731d0614d69ccd67a93f448';
    const url = `https://api.themoviedb.org/3/search/person?api_key=${apiKey}&query=${query}`;

    fetchMovies(url, 'person');
}

function displayMovies(movies) {
    const moviesList = document.getElementById('movies-list');
    moviesList.innerHTML = ''; // Clear previous results

    movies.forEach(movie => {
        const listItem = document.createElement('li');

        const movieInfo = document.createElement('div');
        movieInfo.classList.add('movie-info');

        const movieTitle = document.createElement('span');
        movieTitle.textContent = movie.title;

        const releaseDate = document.createElement('span');
        releaseDate.textContent = movie.release_date;

        const poster = document.createElement('img');
        poster.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
        poster.alt = movie.title;

        movieInfo.appendChild(poster);
        movieInfo.appendChild(movieTitle);
        movieInfo.appendChild(releaseDate);

        listItem.appendChild(movieInfo);

        listItem.addEventListener('click', () => {
            fetchMovieDetails(movie.id);
        });

        moviesList.appendChild(listItem);
    });

    // Hide movie details container
    const movieDetails = document.getElementById('movie-details');
    movieDetails.style.display = 'none';

    // Show movies list
    moviesList.style.display = 'block';
}

function displayPersons(persons) {
    const moviesList = document.getElementById('movies-list');
    moviesList.innerHTML = ''; // Clear previous results

    persons.forEach(person => {
        const listItem = document.createElement('li');

        const personInfo = document.createElement('div');
        personInfo.classList.add('person-info');

        const profilePic = document.createElement('img');
        profilePic.src = `https://image.tmdb.org/t/p/w500${person.profile_path}`;
        profilePic.alt = person.name;

        const personName = document.createElement('h3');
        personName.textContent = person.name;

        const knownFor = document.createElement('p');
        knownFor.textContent = `Known For: ${person.known_for_department}`;

        personInfo.appendChild(profilePic);
        personInfo.appendChild(personName);
        personInfo.appendChild(knownFor);

        listItem.appendChild(personInfo);

        listItem.addEventListener('click', () => {
            fetchPersonMovies(person.id);
        });

        moviesList.appendChild(listItem);
    });

    // Hide movie details container
    const movieDetails = document.getElementById('movie-details');
    movieDetails.style.display = 'none';

    // Show search container
    const searchContainer = document.querySelector('.search-container');
    searchContainer.style.display = 'block';
}

function fetchPersonMovies(personId) {
    const apiKey = 'f6705d536731d0614d69ccd67a93f448';
    const url = `https://api.themoviedb.org/3/person/${personId}/movie_credits?api_key=${apiKey}`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            displayPersonMovies(data.cast);
        })
        .catch(error => {
            console.error('Error fetching person movies:', error);
        });
}

function displayPersonMovies(movies) {
    const moviesList = document.getElementById('movies-list');
    moviesList.innerHTML = ''; // Clear previous results

    movies.forEach(movie => {
        const listItem = document.createElement('li');

        const movieInfo = document.createElement('div');
        movieInfo.classList.add('movie-info');

        const movieTitle = document.createElement('span');
        movieTitle.textContent = movie.title;

        const releaseDate = document.createElement('span');
        releaseDate.textContent = movie.release_date;

        const poster = document.createElement('img');
        poster.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
        poster.alt = movie.title;

        movieInfo.appendChild(poster);
        movieInfo.appendChild(movieTitle);
        movieInfo.appendChild(releaseDate);

        listItem.appendChild(movieInfo);

        listItem.addEventListener('click', () => {
            fetchMovieDetails(movie.id);
        });

        moviesList.appendChild(listItem);
    });

    // Hide movie details container
    const movieDetails = document.getElementById('movie-details');
    movieDetails.style.display = 'none';

    // Show movies list
    moviesList.style.display = 'block';
}

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
            console.error('Error fetching movie details:', error);
        });
}

function displayMovieDetails(movie) {
    const detailsContainer = document.getElementById('movie-details');
    detailsContainer.innerHTML = ''; // Clear previous details

    const title = document.createElement('h2');
    title.textContent = movie.title;

    const releaseDate = document.createElement('p');
    releaseDate.textContent = `Release Date: ${movie.release_date}`;

    const overview = document.createElement('p');
    overview.textContent = movie.overview;

    const poster = document.createElement('img');
    poster.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
    poster.alt = movie.title;

    detailsContainer.appendChild(title);
    detailsContainer.appendChild(poster);
    detailsContainer.appendChild(releaseDate);
    detailsContainer.appendChild(overview);

    // Hide movies list
    const moviesList = document.getElementById('movies-list');
    moviesList.style.display = 'none';

    // Show movie details container
    detailsContainer.style.display = 'block';
}

// Initialize the app
init();