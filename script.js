//f6705d536731d0
//614d69ccd67a93f448

// Funktion för att initialisera eventlyssnare
function init() {
    // Lägg till eventlyssnare för navigeringsknapparna
    document.getElementById('top-rated-button').addEventListener('click', fetchTopRatedMovies);
    document.getElementById('popular-button').addEventListener('click', fetchPopularMovies);
    document.getElementById('movie-search-button').addEventListener('click', searchMovies);
    document.getElementById('person-search-button').addEventListener('click', searchPersons);
}

// Funktion för att hämta de högst rankade filmerna
function fetchTopRatedMovies() {
    // API-nyckel och URL för att hämta högst rankade filmer
    const apiKey = 'f6705d536731d0614d69ccd67a93f448';
    const url = `https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}&language=en-US&page=1`;

    fetchMovies(url);
}

// Funktion för att hämta populära filmer
function fetchPopularMovies() {
    // API-nyckel och URL för att hämta populära filmer
    const apiKey = 'f6705d536731d0614d69ccd67a93f448';
    const url = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=1`;

    fetchMovies(url);
}

// Generell funktion för att hämta filmer eller personer
function fetchMovies(url, type = 'movie') {
    // Hämta data från API
    fetch(url)
        .then(response => {
            // Kontrollera om responsen är ok
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Visa resultat baserat på typ (film eller person)
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

// Funktion för att söka efter filmer
function searchMovies() {
    // Hämta sökfrågan och API-nyckel
    const query = document.getElementById('movie-query').value;
    const apiKey = 'f6705d536731d0614d69ccd67a93f448';
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}`;

    fetchMovies(url);
}

// Funktion för att söka efter personer
function searchPersons() {
    // Hämta sökfrågan och API-nyckel
    const query = document.getElementById('person-query').value;
    const apiKey = 'f6705d536731d0614d69ccd67a93f448';
    const url = `https://api.themoviedb.org/3/search/person?api_key=${apiKey}&query=${query}`;

    fetchMovies(url, 'person');
}

// Funktion för att visa filmer
function displayMovies(movies) {
    // Rensa tidigare resultat
    const moviesList = document.getElementById('movies-list');
    moviesList.innerHTML = '';

    // Loopa igenom och skapa listelement för varje film
    movies.forEach(movie => {
        // Skapa listelement och element för filminformation
        const listItem = document.createElement('li');
        const movieInfo = document.createElement('div');
        const movieTitle = document.createElement('span');
        const releaseDate = document.createElement('span');
        const poster = document.createElement('img');

        // Fyll i information och lägg till i DOM
        movieTitle.textContent = movie.title;
        releaseDate.textContent = movie.release_date;
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

    // Göm detaljcontainer och visa film-listan
    const movieDetails = document.getElementById('movie-details');
    movieDetails.style.display = 'none';
    moviesList.style.display = 'block';
}

// Funktion för att visa personer
function displayPersons(persons) {
    // Rensa tidigare resultat
    const moviesList = document.getElementById('movies-list');
    moviesList.innerHTML = '';

    // Loopa igenom och skapa listelement för varje person
    persons.forEach(person => {
        // Skapa listelement och element för personinformation
        const listItem = document.createElement('li');
        const personInfo = document.createElement('div');
        const profilePic = document.createElement('img');
        const personName = document.createElement('h3');
        const knownFor = document.createElement('p');

        // Fyll i information och lägg till i DOM
        profilePic.src = `https://image.tmdb.org/t/p/w500${person.profile_path}`;
        profilePic.alt = person.name;
        personName.textContent = person.name;
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

    // Göm detaljcontainer och visa sökcontainer
    const movieDetails = document.getElementById('movie-details');
    movieDetails.style.display = 'none';
    const searchContainer = document.querySelector('.search-container');
    searchContainer.style.display = 'block';
}

// Funktion för att hämta filmer som en person medverkat i
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

// Funktion för att visa filmer som en person medverkat i
function displayPersonMovies(movies) {
    // Rensa tidigare resultat
    const moviesList = document.getElementById('movies-list');
    moviesList.innerHTML = '';

    // Loopa igenom och skapa listelement för varje film
    movies.forEach(movie => {
        // Skapa listelement och element för filminformation
        const listItem = document.createElement('li');
        const movieInfo = document.createElement('div');
        const movieTitle = document.createElement('span');
        const releaseDate = document.createElement('span');
        const poster = document.createElement('img');

        // Fyll i information och lägg till i DOM
        movieTitle.textContent = movie.title;
        releaseDate.textContent = movie.release_date;
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

    // Göm detaljcontainer och visa film-listan
    const movieDetails = document.getElementById('movie-details');
    movieDetails.style.display = 'none';
    moviesList.style.display = 'block';
}

// Funktion för att hämta detaljer för en specifik film
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

// Funktion för att visa detaljer för en specifik film
function displayMovieDetails(movie) {
    // Rensa tidigare detaljer
    const detailsContainer = document.getElementById('movie-details');
    detailsContainer.innerHTML = '';

    // Skapa och fyll i element för filmens detaljer
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

    // Göm film-listan och visa detaljcontainer
    const moviesList = document.getElementById('movies-list');
    moviesList.style.display = 'none';
    detailsContainer.style.display = 'block';
}

// Initialisera appen
init();