import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { discoverMovies, fetchGenres, fetchTrendingMovies, searchMovies } from '../api/tmdbClient';
import usePagedList from '../hooks/usePagedList';
import { createMovieSummary } from '../utils/movieHelpers';
import { readFromStorage, writeToStorage } from '../utils/storage';
import { useAuth } from './AuthContext';

const LAST_SEARCH_STORAGE_KEY = 'movieExplorer.lastSearch';

const NO_FILTERS = { genreId: '', year: '', minimumRating: '' };

const MovieContext = createContext(null);

// Holds all movie data for the app:
//   - the trending, search and filtered lists
//   - the genre list for the filter menu
//   - the filters and the current search text
//   - the last searched movie and the favourites list (both saved in localStorage)
export function MovieProvider({ children }) {
  const { currentUser } = useAuth();

  // Each person gets their own favourites list on this browser.
  let userName = 'guest';
  if (currentUser) {
    userName = currentUser;
  }
  const favoritesStorageKey = `movieExplorer.favorites.${userName}`;

  const [searchQuery, setSearchQuery] = useState('');
  const [lastSearchedQuery, setLastSearchedQuery] = useState(() =>
    readFromStorage(LAST_SEARCH_STORAGE_KEY, '')
  );
  const [filters, setFilters] = useState(NO_FILTERS);
  const [genres, setGenres] = useState([]);
  const [favorites, setFavorites] = useState(() => readFromStorage(favoritesStorageKey, []));

  // Load the favourites again when a different person signs in.
  useEffect(() => {
    setFavorites(readFromStorage(favoritesStorageKey, []));
  }, [favoritesStorageKey]);

  // Load the genre names once, for the filter menu.
  useEffect(() => {
    async function loadGenres() {
      try {
        const genreList = await fetchGenres();
        setGenres(genreList);
      } catch (error) {
        // The filter menu will simply have no genres. The movie lists show their own errors.
        setGenres([]);
      }
    }
    loadGenres();
  }, []);

  const { genreId, year, minimumRating } = filters;
  const hasSearchQuery = searchQuery !== '';
  const hasActiveFilters = genreId !== '' || year !== '' || minimumRating !== '';

  const fetchSearchPage = useCallback(
    (pageNumber) => searchMovies(searchQuery, pageNumber),
    [searchQuery]
  );

  const fetchDiscoverPage = useCallback(
    (pageNumber) => discoverMovies({ genreId, year, minimumRating }, pageNumber),
    [genreId, year, minimumRating]
  );

  // Only one of these three lists is switched on at a time.
  const trendingList = usePagedList(fetchTrendingMovies, !hasSearchQuery && !hasActiveFilters);
  const discoverList = usePagedList(fetchDiscoverPage, !hasSearchQuery && hasActiveFilters);
  const searchList = usePagedList(fetchSearchPage, hasSearchQuery);

  const updateSearchQuery = useCallback((newQuery) => {
    const trimmedQuery = newQuery.trim();
    setSearchQuery(trimmedQuery);

    if (trimmedQuery !== '') {
      setLastSearchedQuery(trimmedQuery);
      writeToStorage(LAST_SEARCH_STORAGE_KEY, trimmedQuery);
    }
  }, []);

  function updateFilter(filterName, value) {
    setFilters({ ...filters, [filterName]: value });
  }

  function clearFilters() {
    setFilters(NO_FILTERS);
  }

  function isFavorite(movieId) {
    for (const favoriteMovie of favorites) {
      if (favoriteMovie.id === movieId) {
        return true;
      }
    }
    return false;
  }

  function toggleFavorite(movie) {
    let updatedFavorites = [];

    if (isFavorite(movie.id)) {
      // Remove it: keep every favourite except this one.
      updatedFavorites = favorites.filter((favoriteMovie) => favoriteMovie.id !== movie.id);
    } else {
      // Add it to the top of the list.
      updatedFavorites = [createMovieSummary(movie), ...favorites];
    }

    setFavorites(updatedFavorites);
    writeToStorage(favoritesStorageKey, updatedFavorites);
  }

  const value = {
    genres,
    filters,
    hasActiveFilters,
    updateFilter,
    clearFilters,
    searchQuery,
    hasSearchQuery,
    updateSearchQuery,
    lastSearchedQuery,
    trendingList,
    discoverList,
    searchList,
    favorites,
    isFavorite,
    toggleFavorite,
  };

  return <MovieContext.Provider value={value}>{children}</MovieContext.Provider>;
}

export function useMovies() {
  return useContext(MovieContext);
}
