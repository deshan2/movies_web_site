// Plain helper functions used by several components.

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

// size examples: w185, w342, w500, w780, original
export function buildImageUrl(imagePath, size) {
  if (!imagePath) {
    return null;
  }
  return `${IMAGE_BASE_URL}/${size}${imagePath}`;
}

export function getReleaseYear(releaseDate) {
  if (!releaseDate) {
    return 'TBA';
  }
  return releaseDate.slice(0, 4);
}

export function formatRating(voteAverage) {
  if (!voteAverage) {
    return 'NR';
  }
  return voteAverage.toFixed(1);
}

export function formatRuntime(totalMinutes) {
  if (!totalMinutes) {
    return '';
  }
  const hours = Math.floor(totalMinutes / 60);
  const remainingMinutes = totalMinutes % 60;
  return `${hours}h ${remainingMinutes}m`;
}

// Used for search results, because the TMDb search endpoint cannot filter by genre or rating.
export function movieMatchesFilters(movie, filters) {
  if (filters.genreId !== '') {
    const genreIds = movie.genre_ids || [];
    if (!genreIds.includes(Number(filters.genreId))) {
      return false;
    }
  }

  if (filters.year !== '') {
    if (getReleaseYear(movie.release_date) !== String(filters.year)) {
      return false;
    }
  }

  if (filters.minimumRating !== '') {
    if (movie.vote_average < Number(filters.minimumRating)) {
      return false;
    }
  }

  return true;
}

export function filterMovies(movies, filters) {
  const matchingMovies = [];
  for (const movie of movies) {
    if (movieMatchesFilters(movie, filters)) {
      matchingMovies.push(movie);
    }
  }
  return matchingMovies;
}

// Keeps only the fields we need so the saved favourites list stays small.
export function createMovieSummary(movie) {
  return {
    id: movie.id,
    title: movie.title,
    poster_path: movie.poster_path,
    release_date: movie.release_date,
    vote_average: movie.vote_average,
  };
}

function findVideo(videoList, isMatch) {
  for (const video of videoList) {
    if (isMatch(video)) {
      return video;
    }
  }
  return null;
}

// Picks the best YouTube video: official trailer first, then any trailer, then any video.
export function findTrailer(videoList) {
  if (!videoList) {
    return null;
  }

  const youtubeVideos = videoList.filter((video) => video.site === 'YouTube');

  let trailer = findVideo(youtubeVideos, (video) => video.type === 'Trailer' && video.official);
  if (trailer === null) {
    trailer = findVideo(youtubeVideos, (video) => video.type === 'Trailer');
  }
  if (trailer === null && youtubeVideos.length > 0) {
    trailer = youtubeVideos[0];
  }
  return trailer;
}
