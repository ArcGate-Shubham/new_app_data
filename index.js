const API_KEY = "api_key=ef24c877bf727442be325f3aa3a40f3a";
const BASE_URL = "https://api.themoviedb.org/3";

const API_URL = BASE_URL + "/discover/movie?sort_by=popularity.desc&" + API_KEY;
const IMG_URL = "https://image.tmdb.org/t/p/w500";

const searchURL = BASE_URL + "/search/movie?" + API_KEY;
const main = document.getElementById("main");
const form = document.getElementById("form");
const search = document.getElementById("search");
const movie = document.querySelector(".movie");

let allMoviesData = [];
let currentPage = 1;
let totalPages = 1;

getMovies(API_URL);

function getMovies(url) {
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      totalPages = data.total_pages;
      if (currentPage === 1) {
        allMoviesData = data.results;
      } else {
        // If it's not the first page, append the new data to allMoviesData
        allMoviesData = allMoviesData.concat(data.results);
      }
      showMovies(allMoviesData);
    });
}

function showMovies(data) {
  main.innerHTML = "";

  data.forEach((movie) => {
    const { title, poster_path, vote_average, id } = movie;
    const movieEl = document.createElement("div");
    movieEl.classList.add("movie");
    movieEl.setAttribute("id", id);

    movieEl.innerHTML = `
            <img src="${
              IMG_URL + poster_path
            }" alt="${title}"  data-movie-id="${id}">

            <div class="movie-info">
            <h3>${title}</h3>
            <span class="${getColor(vote_average)}">${vote_average}</span>
            </div>`;

    main.appendChild(movieEl);

    const movieImage = movieEl.querySelector("img");
    movieImage.addEventListener("click", () => {
      // When a movie image is clicked, navigate to the movie_details.html page with the movie ID
      window.location.href = `movie_details.html?id=${movie.id}`;
    });
  });
}

function getColor(vote) {
  if (vote >= 8) {
    return "green";
  } else if (vote >= 5) {
    return "orange";
  } else {
    return "red";
  }
}

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlZjI0Yzg3N2JmNzI3NDQyYmUzMjVmM2FhM2E0MGYzYSIsInN1YiI6IjY0YzI0MTc5MWNmZTNhMGViNWVhMGRiZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.2Bg-b66GPe0FZmhw1cHS8espTKDPuqRAR0Y1I6hGCt8",
  },
};

fetch("https://api.themoviedb.org/3/trending/movie/day", options)
  .then((response) => response.json())
  .then((data) => {
    const trendingMovies = data.results.slice(0, 3);
    displayMoviesInCarousel(trendingMovies);
  })
  .catch((err) => console.error(err));

function displayMoviesInCarousel(movies) {
  const carouselInner = document.querySelector(".carousel-inner");
  const carouselIndicators = document.querySelector(".carousel-indicators");

  movies.forEach((movie, index) => {
    const movieElement = createMovieElement(movie, index);
    carouselInner.appendChild(movieElement);

    // Create carousel indicators
    const indicator = document.createElement("li");
    indicator.setAttribute("data-bs-target", "#movieCarousel");
    indicator.setAttribute("data-bs-slide-to", index.toString());
    if (index === 0) {
      indicator.classList.add("active");
    }
    carouselIndicators.appendChild(indicator);
  });

  // Set the first movie as active
  carouselInner.firstElementChild.classList.add("active");
}

function createMovieElement(movie, index) {
  const movieElement = document.createElement("div");
  movieElement.className = "carousel-item" + (index === 0 ? " active" : "");

  const movieImg = document.createElement("img");
  movieImg.src = "https://image.tmdb.org/t/p/w500" + movie.poster_path; // Full image URL
  movieImg.alt = movie.title;
  movieElement.appendChild(movieImg);
  // Add any other movie details you want to display

  return movieElement;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const searchTerm = search.value;

  if (searchTerm) {
    getMovies(searchURL + "&query=" + searchTerm);
  } else {
    getMovies(API_URL);
  }
});

// Add an event listener to detect when the user scrolls the page
window.addEventListener("scroll", () => {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

  // Check if the user has reached the bottom of the page and there are more pages available
  if (
    scrollTop + clientHeight >= scrollHeight - 5 &&
    currentPage < totalPages
  ) {
    // Load the next page data using AJAX call
    loadNextPage();
  }
});

function loadNextPage() {
  currentPage++;
  const nextPageUrl = `${API_URL}&page=${currentPage}`;
  getMovies(nextPageUrl);
}
