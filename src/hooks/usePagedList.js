import { useCallback, useEffect, useRef, useState } from 'react';
import { getErrorMessage } from '../utils/errors';

// Removes movies that appear twice (TMDb sometimes repeats a movie across pages).
function removeDuplicateMovies(movies) {
  const seenIds = {};
  const uniqueMovies = [];
  for (const movie of movies) {
    if (!seenIds[movie.id]) {
      seenIds[movie.id] = true;
      uniqueMovies.push(movie);
    }
  }
  return uniqueMovies;
}

// Loads a TMDb list one page at a time.
//   fetchPage(pageNumber) must return the raw TMDb response ({ results, total_pages }).
//   isEnabled turns the list on or off. When it turns off, the list is cleared.
// IMPORTANT: wrap fetchPage in useCallback so it only changes when the search changes.
export default function usePagedList(fetchPage, isEnabled) {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Every request gets a number. If an older request finishes late, we ignore it.
  const latestRequestNumber = useRef(0);

  const loadPage = useCallback(
    async (pageNumber) => {
      latestRequestNumber.current = latestRequestNumber.current + 1;
      const thisRequestNumber = latestRequestNumber.current;

      setIsLoading(true);
      setErrorMessage('');
      if (pageNumber === 1) {
        setMovies([]);
      }

      try {
        const result = await fetchPage(pageNumber);
        if (thisRequestNumber !== latestRequestNumber.current) {
          return;
        }

        if (pageNumber === 1) {
          setMovies(removeDuplicateMovies(result.results));
        } else {
          setMovies((currentMovies) => removeDuplicateMovies([...currentMovies, ...result.results]));
        }
        setPage(pageNumber);
        setTotalPages(result.total_pages);
      } catch (error) {
        if (thisRequestNumber === latestRequestNumber.current) {
          setErrorMessage(getErrorMessage(error));
        }
      } finally {
        if (thisRequestNumber === latestRequestNumber.current) {
          setIsLoading(false);
        }
      }
    },
    [fetchPage]
  );

  // Start again from page 1 whenever the list is switched on or the search changes.
  useEffect(() => {
    if (!isEnabled) {
      latestRequestNumber.current = latestRequestNumber.current + 1;
      setMovies([]);
      setPage(0);
      setTotalPages(1);
      setIsLoading(false);
      setErrorMessage('');
      return;
    }
    setPage(0);
    loadPage(1);
  }, [isEnabled, loadPage]);

  const hasMore = page > 0 && page < totalPages;

  const loadMore = useCallback(() => {
    if (isLoading || !hasMore) {
      return;
    }
    loadPage(page + 1);
  }, [isLoading, hasMore, page, loadPage]);

  // Tries the page that failed again.
  const retry = useCallback(() => {
    loadPage(page + 1);
  }, [page, loadPage]);

  return { movies, isLoading, errorMessage, hasMore, loadMore, retry };
}
