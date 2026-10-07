import { Box, Button, Chip, Container, Typography } from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';
import MovieGrid from '../components/MovieGrid';
import ErrorMessage from '../components/ErrorMessage';
import useInfiniteScroll from '../hooks/useInfiniteScroll';
import { useMovies } from '../context/MovieContext';
import { filterMovies } from '../utils/movieHelpers';
import BackgroundSlideshow from '../components/BackgroundSlideshow';

const PLACEHOLDERS_WHILE_LOADING = 10;

export default function HomePage() {
  const {
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
  } = useMovies();

  // Pick the list and the heading that match what the person is doing.
  let activeList = trendingList;
  let sectionTitle = 'Trending this week';
  if (hasSearchQuery) {
    activeList = searchList;
    sectionTitle = `Results for "${searchQuery}"`;
  } else if (hasActiveFilters) {
    activeList = discoverList;
    sectionTitle = 'Movies that match your filters';
  }

  // TMDb search cannot filter by genre or rating, so we filter search results here.
  let visibleMovies = activeList.movies;
  if (hasSearchQuery) {
    visibleMovies = filterMovies(activeList.movies, filters);
  }

  // Search results load automatically while scrolling.
  // Trending and filtered movies use a "Load more" button instead.
  const infiniteScrollIsActive =
    hasSearchQuery && activeList.hasMore && !activeList.isLoading && activeList.errorMessage === '';
  const sentinelElementReference = useInfiniteScroll(activeList.loadMore, infiniteScrollIsActive);

  const hasNoMovies = visibleMovies.length === 0;
  const showFirstLoadError = activeList.errorMessage !== '' && hasNoMovies;
  const showLaterLoadError = activeList.errorMessage !== '' && !hasNoMovies;
  const showEmptyMessage =
    !activeList.isLoading && hasNoMovies && !activeList.hasMore && activeList.errorMessage === '';
  const showLoadMoreButton =
    !hasSearchQuery && activeList.hasMore && !activeList.isLoading && activeList.errorMessage === '';

  let placeholderCount = 0;
  if (activeList.isLoading) {
    placeholderCount = PLACEHOLDERS_WHILE_LOADING;
  }

  let lastSearchChip = null;
  if (!hasSearchQuery && lastSearchedQuery !== '') {
    lastSearchChip = (
      <Chip
        icon={<HistoryIcon />}
        label={`Last search: ${lastSearchedQuery}`}
        onClick={() => updateSearchQuery(lastSearchedQuery)}
        sx={{ mt: 1.5 }}
      />
    );
  }

  return (
    <>
    <BackgroundSlideshow movies={trendingList.movies} />
  
    <Container maxWidth="xl" sx={{ py: { xs: 3, md: 5 } }}>
      <Box sx={{ maxWidth: 720, mb: { xs: 3, md: 4 } }}>
        <Typography variant="h3" component="h1" sx={{ mb: 2, fontSize: { xs: '2rem', md: '3rem' } }}>
          What are we watching tonight?
        </Typography>
        <SearchBar initialValue={searchQuery} onSearch={updateSearchQuery} />
        {lastSearchChip}
      </Box>

      <Box sx={{ mb: 3 }}>
        <FilterBar
          filters={filters}
          genres={genres}
          onChange={updateFilter}
          onClear={clearFilters}
          hasActiveFilters={hasActiveFilters}
        />
      </Box>

      <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
        {sectionTitle}
      </Typography>

      {showFirstLoadError && (
        <ErrorMessage message={activeList.errorMessage} onRetry={activeList.retry} />
      )}

      {!showFirstLoadError && <MovieGrid movies={visibleMovies} placeholderCount={placeholderCount} />}

      {showLaterLoadError && (
        <ErrorMessage message={activeList.errorMessage} onRetry={activeList.retry} />
      )}

      {showEmptyMessage && (
        <Typography color="text.secondary" sx={{ py: 4 }}>
          No movies found. Try a different title or change your filters.
        </Typography>
      )}

      {/* The scroll watcher sits here, just below the last movie. */}
      <div ref={sentinelElementReference} />

      {showLoadMoreButton && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button variant="outlined" size="large" onClick={activeList.loadMore}>
            Load more
          </Button>
        </Box>
      )}
    </Container>
      </>
  );
}
