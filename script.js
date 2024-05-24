let currentPage = 1; // Current page of movie recommendations
let moviesPerPage = 4; // Number of movies to display per page
let currentMovies = []; // Array to store the current list of recommended movies

// Event listener for input on the movie search field
document.getElementById('movie-input').addEventListener('input', function() {
    const movieName = this.value;
    if (movieName.length > 2) {
        fetchMovieSuggestions(movieName);
    }
});

// Event listener for the search button click
document.getElementById('search-button').addEventListener('click', function() {
    const movieName = document.getElementById('movie-input').value;
    getRecommendations(movieName);
});

// Event listener for the clear button click
document.getElementById('clear-button').addEventListener('click', function() {
    clearSearch();
});

// Fetch movie suggestions based on the query
function fetchMovieSuggestions(query) {
    const apiKey = // Must Add Own API Key Here
    fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}`)
        .then(response => response.json())
        .then(data => {
            if (data.results.length > 0) {
                displaySuggestions(data.results);
            }
        });
}

// Display movie suggestions in a datalist
function displaySuggestions(movies) {
    const suggestionsList = document.getElementById('movie-suggestions');
    suggestionsList.innerHTML = '';
    movies.forEach(movie => {
        const option = document.createElement('option');
        option.value = movie.title;
        suggestionsList.appendChild(option);
    });
}

// Fetch recommendations for the specified movie
function getRecommendations(movieName) {
    currentPage = 1; // Reset currentPage to 1 for new searches
    const apiKey = // Must Add Own API Key Here
    fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${movieName}`)
        .then(response => response.json())
        .then(data => {
            if (data.results.length > 0) {
                const movieId = data.results[0].id;
                fetch(`https://api.themoviedb.org/3/movie/${movieId}/recommendations?api_key=${apiKey}`)
                    .then(response => response.json())
                    .then(data => {
                        currentMovies = data.results;
                        displayRecommendations();
                    });
            } else {
                alert('Movie not found');
            }
        });
}

// Truncate the movie description to a specified word limit
function truncateDescription(description, wordLimit) {
    const words = description.split(' ');
    if (words.length > wordLimit) {
        return words.slice(0, wordLimit).join(' ') + '...';
    }
    return description;
}

// Display movie recommendations
function displayRecommendations() {
    const recommendationsDiv = document.getElementById('recommendations');
    recommendationsDiv.innerHTML = '';
    const start = (currentPage - 1) * moviesPerPage;
    const end = start + moviesPerPage;
    const moviesToShow = currentMovies.slice(start, end);
    moviesToShow.forEach(movie => {
        const movieDiv = document.createElement('div');
        movieDiv.classList.add('movie');
        
        const movieImg = document.createElement('img');
        movieImg.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
        movieImg.alt = `${movie.title} poster`;
        
        const movieTitle = document.createElement('div');
        movieTitle.classList.add('movie-title');
        movieTitle.textContent = movie.title;
        
        const movieDescription = document.createElement('div');
        movieDescription.classList.add('movie-description');
        movieDescription.textContent = truncateDescription(movie.overview, 20);

        const readMoreLink = document.createElement('a');
        readMoreLink.href = `https://www.themoviedb.org/movie/${movie.id}`;
        readMoreLink.target = '_blank';
        readMoreLink.classList.add('read-more');
        readMoreLink.textContent = 'View More';
        
        movieDescription.appendChild(readMoreLink);
        
        const movieRating = document.createElement('div');
        movieRating.classList.add('movie-rating');
        
        const starIcon = document.createElement('span');
        starIcon.classList.add('star-icon');
        starIcon.textContent = '★'; // Star character
        
        movieRating.appendChild(starIcon);
        movieRating.appendChild(document.createTextNode(` ${movie.vote_average}`));
        
        const movieReleaseDate = document.createElement('div');
        movieReleaseDate.classList.add('movie-release-date');
        movieReleaseDate.textContent = `Release Date: ${movie.release_date}`;
        
        movieDiv.appendChild(movieImg);
        movieDiv.appendChild(movieTitle);
        movieDiv.appendChild(movieDescription);
        movieDiv.appendChild(movieRating);
        movieDiv.appendChild(movieReleaseDate);
        recommendationsDiv.appendChild(movieDiv);
    });
    document.getElementById('pagination').style.display = 'block';
    updatePaginationButtons();
}

// Update pagination button states
function updatePaginationButtons() {
    document.getElementById('prev-button').disabled = currentPage === 1;
    document.getElementById('next-button').disabled = (currentPage * moviesPerPage) >= currentMovies.length;
}

// Navigate to the previous page
function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        displayRecommendations();
    }
}

// Navigate to the next page
function nextPage() {
    if ((currentPage * moviesPerPage) < currentMovies.length) {
        currentPage++;
        displayRecommendations();
    }
}

// Clear the search input and reset recommendations
function clearSearch() {
    document.getElementById('movie-input').value = '';
    document.getElementById('recommendations').innerHTML = '';
    document.getElementById('pagination').style.display = 'none';
    currentPage = 1;
    currentMovies = [];
}

// Event listener for the generate movie button click
document.getElementById('generate-movie-button').addEventListener('click', function() {
    const genreId = document.getElementById('genre-select').value;
    if (genreId) {
        fetchRandomMovie(genreId);
    } else {
        alert('Please select a genre.');
    }
});

// Fetch available genres for the random movie selection
function fetchGenres() {
    const apiKey = // Must Add Own API Key Here
    fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            const genreSelect = document.getElementById('genre-select');
            genreSelect.innerHTML = '<option value="">--Choose a Genre--</option>';
            data.genres.forEach(genre => {
                const option = document.createElement('option');
                option.value = genre.id;
                option.textContent = genre.name;
                genreSelect.appendChild(option);
            });
        });
}

// Fetch a random movie based on the selected genre
function fetchRandomMovie(genreId) {
    const apiKey = // Must Add Own API Key Here
    fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${genreId}`)
        .then(response => response.json())
        .then(data => {
            const randomIndex = Math.floor(Math.random() * data.results.length);
            const movie = data.results[randomIndex];
            displayRandomMovie(movie);
        });
}

// Display the randomly selected movie
function displayRandomMovie(movie) {
    const resultContainer = document.getElementById('random-movie-result');
    const truncatedDescription = truncateDescription(movie.overview, 30);
    resultContainer.innerHTML = `
        <h3>${movie.title}</h3>
        <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
        <p>${truncatedDescription} <a href="https://www.themoviedb.org/movie/${movie.id}" target="_blank" class="read-more">READ MORE</a></p>
    `;
}

// Event listener for tab switching
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.tab-link').forEach(button => {
        button.addEventListener('click', function(event) {
            openTab(event, this.getAttribute('data-tab'));
        });
    });

    // Function to switch between tabs
    function openTab(event, tabName) {
        var i, tabcontent, tablinks;
        tabcontent = document.getElementsByClassName("tab-content");
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
        }
        tablinks = document.getElementsByClassName("tab-link");
        for (i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(" active", "");
        }
        document.getElementById(tabName).style.display = "block";
        event.currentTarget.className += " active";

        // Change header title based on the selected tab
        if (tabName === 'recommendation-tab') {
            document.getElementById('header-title').textContent = 'Movie Recommendations';
            document.getElementById('recommendation-container').classList.add('active');
            document.getElementById('random-movie-container').classList.remove('active');
        } else if (tabName === 'random-movie-tab') {
            document.getElementById('header-title').textContent = 'Randomized Movie';
            document.getElementById('random-movie-container').classList.add('active');
            document.getElementById('recommendation-container').classList.remove('active');
        }
    }

    // Initially open the first tab
    document.querySelector('.tab-link').click();
    fetchGenres();
});
