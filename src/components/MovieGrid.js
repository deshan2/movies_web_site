import { Box, Skeleton } from '@mui/material';
import MovieCard from './MovieCard';

// Mobile first: 2 columns on phones, more columns as the screen gets wider.
const gridStyles = {
  display: 'grid',
  gap: { xs: 1.5, sm: 2, md: 2.5 },
  gridTemplateColumns: {
    xs: 'repeat(2, 1fr)',
    sm: 'repeat(3, 1fr)',
    md: 'repeat(4, 1fr)',
    lg: 'repeat(5, 1fr)',
    xl: 'repeat(6, 1fr)',
  },
};

// Shows the movie cards, followed by grey placeholders while more movies are loading.
export default function MovieGrid({ movies, placeholderCount = 0 }) {
  const placeholders = [];
  for (let placeholderNumber = 0; placeholderNumber < placeholderCount; placeholderNumber += 1) {
    placeholders.push(
      <Box key={`placeholder-${placeholderNumber}`}>
        <Skeleton variant="rounded" sx={{ width: '100%', height: 'auto', aspectRatio: '2 / 3' }} />
        <Skeleton variant="text" sx={{ mt: 1 }} />
        <Skeleton variant="text" width="40%" />
      </Box>
    );
  }

  return (
    <Box sx={gridStyles}>
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
      {placeholders}
    </Box>
  );
}
