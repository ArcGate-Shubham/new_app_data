const API_KEY = "api_key=ef24c877bf727442be325f3aa3a40f3a";
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_URL = "https://image.tmdb.org/t/p/w500";

const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get("id");
console.log(movieId, "movieId");

fetch(`${BASE_URL}/movie/${movieId}?${API_KEY}`)
  .then((response) => response.json())
  .then((movieData) => {
    document.getElementById("movieTitle").textContent = movieData.title;
    document.getElementById("movieImage").src = IMG_URL + movieData.poster_path;
    document.getElementById(
      "movieOverview"
    ).textContent = `Overview : ${movieData.overview}`;
    document.getElementById(
      "movieRating"
    ).textContent = `Rating : ${movieData.vote_average}`;
    document.getElementById(
      "movieReleaseDate"
    ).textContent = `Release Date : ${movieData.release_date}`;

    fetch(`${BASE_URL}/movie/${movieId}/credits?${API_KEY}`)
      .then((response) => response.json())
      .then((creditsData) => {
        const castList = document.getElementById("castList");

        // Loop through the cast array and display cast member names and profile images
        creditsData.cast.forEach((castMember) => {
          const castMemberElement = document.createElement("div");
          castMemberElement.classList.add("cast-member");

          // Display cast member profile image
          if (castMember.profile_path) {
            const castMemberImage = document.createElement("img");
            castMemberImage.src = IMG_URL + castMember.profile_path;
            castMemberImage.alt = castMember.name;
            castMemberElement.appendChild(castMemberImage);
          }

          // Display cast member name
          const castMemberName = document.createElement("p");
          castMemberName.textContent = castMember.name;
          castMemberElement.appendChild(castMemberName);

          castList.appendChild(castMemberElement);
        });
      })
      .catch((err) => console.error(err));
  })
  .catch((err) => console.error(err));
