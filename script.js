// Funktion för att initialisera appen
function init() {
    // Lägger till händelselyssnare för knapparna för att hämta topplista och populära filmer samt söka efter filmer och personer
    document.getElementById('top-rated-button').addEventListener('click', fetchTopRatedMovies);
    document.getElementById('popular-button').addEventListener('click', fetchPopularMovies);
    document.getElementById('movie-search-button').addEventListener('click', searchMovies);
    document.getElementById('person-search-button').addEventListener('click', searchPersons);
}

// Funktion för att hämta topplista över filmer
function fetchTopRatedMovies() {
    const apiKey = 'f6705d536731d0614d69ccd67a93f448';
    const url = `https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}&language=en-US&page=1`;
    fetchMovies(url);
}

// Funktion för att hämta populära filmer
function fetchPopularMovies() {
    const apiKey = 'f6705d536731d0614d69ccd67a93f448';
    const url = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=1`;
    fetchMovies(url);
}

// Funktion för att söka efter personer
function searchPersons() {
    const query = document.getElementById('person-query').value;
    const apiKey = 'f6705d536731d0614d69ccd67a93f448';
    const url = `https://api.themoviedb.org/3/search/person?api_key=${apiKey}&query=${query}`;
    fetchMovies(url, 'person');
}

// Funktion för att söka efter filmer
function searchMovies() {
    const query = document.getElementById('movie-query').value;
    const apiKey = 'f6705d536731d0614d69ccd67a93f448';
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}`;
    fetchMovies(url);
}

// Generell funktion för att hämta filmer eller personer från API:et
function fetchMovies(url, type = 'movie') {
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Nätverkssvar var inte OK');
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
            console.error('Fel vid hämtning av data', error);
        });
}

// Funktion för att visa filmer
function displayMovies(movies) {
    // Hämtar listelementet för filmer
    const moviesList = document.getElementById('movies-list');
    moviesList.innerHTML = '';

    // Om inga resultat hittades
    if (movies.length === 0) {
        const noResultsMessage = document.createElement('p');
        noResultsMessage.textContent = 'Det finns inga filmer med det namnet.';
        moviesList.appendChild(noResultsMessage);
        return;
    }

    // Loopar igenom och skapar element för varje film
    movies.forEach(movie => {
        const listItem = document.createElement('li');
        const movieInfo = document.createElement('div');
        const poster = document.createElement('img');
        const movieTitle = document.createElement('h3');
        const releaseDate = document.createElement('p');

        // Sätter attribut och text för filmen
        poster.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
        poster.alt = movie.title;
        movieTitle.textContent = movie.title;
        releaseDate.textContent = `Släppsdatum: ${movie.release_date}`;

        // Lägger till elementen i DOM-trädet
        movieInfo.appendChild(poster);
        movieInfo.appendChild(movieTitle);
        movieInfo.appendChild(releaseDate);
        listItem.appendChild(movieInfo);

        // Lägger till händelselyssnare för att visa detaljer när en film klickas
        listItem.addEventListener('click', () => {
            fetchMovieDetails(movie.id);
        });

        moviesList.appendChild(listItem);
    });

    // Döljer andra sektioner och visar listan med filmer
    const movieDetails = document.getElementById('movie-details');
    movieDetails.style.display = 'none';
    const tvShows = document.getElementById('tv-shows');
    tvShows.style.display = 'none';
    const searchContainer = document.querySelector('.search-container');
    moviesList.style.display = 'block';
}

// Funktion för att visa personer
function displayPersons(persons) {
    // Hämtar listelementet för personer
    const moviesList = document.getElementById('movies-list');
    moviesList.innerHTML = '';
    const tvShowsList = document.getElementById('tv-shows-list');
    tvShowsList.innerHTML = '';

    // Om inga resultat hittades
    if (persons.length === 0) {
        const noResultsMessage = document.createElement('p');
        noResultsMessage.textContent = 'Det finns inga skådespelare med det namnet.';
        moviesList.appendChild(noResultsMessage);
        return;
    }

    // Loopar igenom och skapar element för varje person
    persons.forEach(person => {
        const listItem = document.createElement('li');
        const personInfo = document.createElement('div');
        const profilePic = document.createElement('img');
        const personName = document.createElement('h3');
        const knownFor = document.createElement('p');

        // Sätter attribut och text för personen
        profilePic.src = `https://image.tmdb.org/t/p/w500${person.profile_path}`;
        profilePic.alt = person.name;
        personName.textContent = person.name;
        knownFor.textContent = `Känd för: ${person.known_for_department}`;

        // Lägger till elementen i DOM-trädet
        personInfo.appendChild(profilePic);
        personInfo.appendChild(personName);
        personInfo.appendChild(knownFor);
        listItem.appendChild(personInfo);

        // Lägger till händelselyssnare för att visa detaljer när en person klickas
        listItem.addEventListener('click', () => {
            fetchPersonData(person.id);
        });

        moviesList.appendChild(listItem);
    });

    // Döljer andra sektioner och visar listan med personer
    const movieDetails = document.getElementById('movie-details');
    movieDetails.style.display = 'none';
    const tvShows = document.getElementById('tv-shows');
    tvShows.style.display = 'none';
    const searchContainer = document.querySelector('.search-container');
    searchContainer.style.display = 'block';
}

// Funktion för att hämta data om en person
function fetchPersonData(personId) {
    const apiKey = 'f6705d536731d0614d69ccd67a93f448';
    const movieUrl = `https://api.themoviedb.org/3/person/${personId}/movie_credits?api_key=${apiKey}`;
    const tvUrl = `https://api.themoviedb.org/3/person/${personId}/tv_credits?api_key=${apiKey}`;

    // Skapar löften för att hämta film- och TV-data för personen
    const moviePromise = fetch(movieUrl).then(response => {
        if (!response.ok) {
            throw new Error('Nätverkssvar var inte OK');
        }
        return response.json();
    });

    const tvPromise = fetch(tvUrl).then(response => {
        if (!response.ok) {
            throw new Error('Nätverkssvar var inte OK');
        }
        return response.json();
    });

    // Väntar på att båda löftena ska slutföras och sedan visar film- och TV-data
    Promise.all([moviePromise, tvPromise])
        .then(([movieData, tvData]) => {
            displayMoviesAndTVShows(movieData.cast, tvData.cast);
        })
        .catch(error => {
            console.error('Fel vid hämtning av data:', error);
        });
}

// Funktion för att visa filmer och TV-program för en person
function displayMoviesAndTVShows(movieData, tvData) {
    displayPersonsMovies(movieData);
    displayTVShows(tvData);
}

// Funktion för att visa filmer för en person
function displayPersonsMovies(movies) {
    const moviesList = document.getElementById('movies-list');
    moviesList.innerHTML = '';

    // Loopar igenom och skapar element för varje film
    movies.forEach(movie => {
        const listItem = document.createElement('li');
        const movieInfo = document.createElement('div');
        const movieTitle = document.createElement('span');
        const typeLabel = document.createElement('span');
        const releaseDate = document.createElement('span');
        const poster = document.createElement('img');

        // Sätter attribut och text för filmen
        movieTitle.textContent = movie.title;
        releaseDate.textContent = movie.release_date;
        typeLabel.textContent = '(Film)';
        poster.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
        poster.alt = movie.title;

        // Lägger till elementen i DOM-trädet
        movieInfo.appendChild(poster);
        movieInfo.appendChild(movieTitle);
        movieInfo.appendChild(releaseDate);
        movieInfo.appendChild(typeLabel);
        listItem.appendChild(movieInfo);

        // Lägger till händelselyssnare för att visa detaljer när en film klickas
        listItem.addEventListener('click', () => {
            fetchMovieDetails(movie.id);
        });

        moviesList.appendChild(listItem);
    });

    // Döljer andra sektioner och visar listan med filmer
    const movieDetails = document.getElementById('movie-details');
    movieDetails.style.display = 'none';
    moviesList.style.display = 'block';
}

// Funktion för att hämta detaljer om en film
function fetchMovieDetails(movieId) {
    const apiKey = 'f6705d536731d0614d69ccd67a93f448';
    const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`;

    // Hämtar filmdata från API:et
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Nätverkssvar var inte OK');
            }
            return response.json();
        })
        .then(data => {
            displayMovieDetails(data);
        })
        .catch(error => {
            console.error('Fel vid hämtning av filmdatan:', error);
        });
}

// Funktion för att visa detaljer om en film
function displayMovieDetails(movie) {
    const detailsContainer = document.getElementById('movie-details');
    detailsContainer.innerHTML = '';

    // Skapar element för titel, release datum, översikt och poster
    const title = document.createElement('h2');
    const releaseDate = document.createElement('p');
    const overview = document.createElement('p');
    const poster = document.createElement('img');

    // Sätter text och attribut för filmen
    title.textContent = movie.title;
    releaseDate.textContent = `Släppsdatum: ${movie.release_date}`;
    overview.textContent = movie.overview;
    poster.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
    poster.alt = movie.title;

    // Lägger till elementen i DOM-trädet
    detailsContainer.appendChild(title);
    detailsContainer.appendChild(poster);
    detailsContainer.appendChild(releaseDate);
    detailsContainer.appendChild(overview);

    // Döljer andra sektioner och visar detaljsektionen för filmen
    const moviesList = document.getElementById('movies-list');
    moviesList.style.display = 'none';
    detailsContainer.style.display = 'block';
    const tvShowsList = document.getElementById('tv-shows-list');
    tvShowsList.style.display = 'none';
}

// Funktion för att visa TV-program
function displayTVShows(tvShows) {
    const tvShowsList = document.getElementById('tv-shows-list');
    tvShowsList.innerHTML = '';

    // Loopar igenom och skapar element för varje TV-program
    tvShows.forEach(tvShow => {
        const listItem = document.createElement('li');
        const tvShowInfo = document.createElement('div');
        const tvShowTitle = document.createElement('h3');
        const typeLabel = document.createElement('span');
        const firstAirDate = document.createElement('p');
        const poster = document.createElement('img');

        // Sätter attribut och text för TV-programmet
        tvShowTitle.textContent = tvShow.name;
        firstAirDate.textContent = `Första sändningsdatum: ${tvShow.first_air_date}`;
        typeLabel.textContent = '(TV-serie)';
        poster.src = `https://image.tmdb.org/t/p/w500${tvShow.poster_path}`;
        poster.alt = tvShow.name;

        // Lägger till elementen i DOM-trädet
        tvShowInfo.appendChild(poster);
        tvShowInfo.appendChild(tvShowTitle);
        tvShowInfo.appendChild(firstAirDate);
        tvShowInfo.appendChild(typeLabel);
        listItem.appendChild(tvShowInfo);

        // Lägger till händelselyssnare för att visa detaljer när ett TV-program klickas
        listItem.addEventListener('click', () => {
            fetchTvShowDetails(tvShow.id);
        });

        tvShowsList.appendChild(listItem);
    });

    // Visar sektionen för TV-program
    const tvShowsContainer = document.getElementById('tv-shows');
    tvShowsContainer.style.display = 'block';
    tvShowsList.style.display = 'block';
}

// Funktion för att hämta detaljer om ett TV-program
function fetchTvShowDetails(tvShowId) {
    const apiKey = 'f6705d536731d0614d69ccd67a93f448';
    const url = `https://api.themoviedb.org/3/tv/${tvShowId}?api_key=${apiKey}`;

    // Hämtar TV-programdata från API:et
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Nätverkssvar var inte OK');
            }
            return response.json();
        })
        .then(data => {
            displayTvShowDetails(data);
        })
        .catch(error => {
            console.error('Fel vid hämtning av TV-programdata:', error);
        });
}

// Funktion för att visa detaljer om ett TV-program
function displayTvShowDetails(tvShow) {
    const tvShowInfo = document.getElementById('movie-details');
    tvShowInfo.innerHTML = '';

    // Skapar element för titel, översikt, poster, första sändningsdatum och status
    const title = document.createElement('h2');
    title.textContent = tvShow.name;

    const overview = document.createElement('p');
    overview.textContent = tvShow.overview || 'Översikt ej tillgänglig';

    const poster = document.createElement('img');
    poster.src = `https://image.tmdb.org/t/p/w500${tvShow.poster_path}`;
    poster.alt = tvShow.name;

    const releaseDate = document.createElement('p');
    releaseDate.textContent = `Första sändningsdatum: ${tvShow.first_air_date || 'Ej tillgängligt'}`;

    const status = document.createElement('p');
    status.textContent = `Status: ${tvShow.status || 'Ej tillgängligt'}`;

    // Lägger till elementen i DOM-trädet
    tvShowInfo.appendChild(title);
    tvShowInfo.appendChild(poster);
    tvShowInfo.appendChild(overview);
    tvShowInfo.appendChild(releaseDate);
    tvShowInfo.appendChild(status);

    // Döljer andra sektioner och visar detaljsektionen för TV-programmet
    const tvShows = document.getElementById('tv-shows');
    tvShows.style.display = 'none';
    tvShowInfo.style.display = 'block';
    const moviesList = document.getElementById('movies-list');
    moviesList.style.display = 'none';
}

// Initialiserar appen
init();