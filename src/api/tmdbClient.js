import axios from 'axios';

// All TMDb requests go through this file.
// Docs: https://developers.themoviedb.org/3

const apiKey = process.env.REACT_APP_TMDB_API_KEY;

// A v4 "Read Access Token" is a long JWT that starts with "eyJ". It must be sent as a
// Bearer header. A v3 "API Key" is sent as the api_key query parameter.
const isBearerToken = Boolean(apiKey) && apiKey.startsWith('eyJ');

export const isApiKeyConfigured = Boolean(apiKey);

const tmdbClient = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  timeout: 15000,
});

tmdbClient.interceptors.request.use((requestConfiguration) => {
  if (!apiKey) {
    throw new Error('MISSING_API_KEY');
  }

  if (isBearerToken) {
    requestConfiguration.headers.Authorization = `Bearer ${apiKey}`;
  } else {
    requestConfiguration.params = { ...requestConfiguration.params, api_key: apiKey };
  }
  return requestConfiguration;
});

export async function fetchTrendingMovies(pageNumber) {
  const response = await tmdbClient.get('/trending/movie/week', {
    params: { page: pageNumber },
  });
  return response.data;
}

export async function searchMovies(searchText, pageNumber) {
  const response = await tmdbClient.get('/search/movie', {
    params: { query: searchText, page: pageNumber, include_adult: false },
  });
  return response.data;
}

// Used when the person picks a genre, year or rating without typing a search.
export async function discoverMovies(filters, pageNumber) {
  const parameters = {
    page: pageNumber,
    sort_by: 'popularity.desc',
    include_adult: false,
    'vote_count.gte': 50,
  };

  if (filters.genreId !== '') {
    parameters.with_genres = filters.genreId;
  }
  if (filters.year !== '') {
    parameters.primary_release_year = filters.year;
  }
  if (filters.minimumRating !== '') {
    parameters['vote_average.gte'] = filters.minimumRating;
  }

  const response = await tmdbClient.get('/discover/movie', { params: parameters });
  return response.data;
}

export async function fetchGenres() {
  const response = await tmdbClient.get('/genre/movie/list');
  return response.data.genres;
}

// One request returns the details, the trailer videos and the cast.
export async function fetchMovieDetails(movieId) {
  const response = await tmdbClient.get(`/movie/${movieId}`, {
    params: { append_to_response: 'videos,credits' },
  });
  return response.data;
}
