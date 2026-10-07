import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Container, Typography } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import MovieGrid from '../components/MovieGrid';
import { useMovies } from '../context/MovieContext';

export default function FavoritesPage() {
  const { favorites } = useMovies();

  if (favorites.length === 0) {
    return (
      <Container maxWidth="sm" sx={{ py: 8, textAlign: 'center' }}>
        <FavoriteBorderIcon color="primary" sx={{ fontSize: 56 }} />
        <Typography variant="h5" component="h1" sx={{ mt: 2 }}>
          No favorites yet
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 1, mb: 3 }}>
          Tap the heart on any movie and it will be saved here.
        </Typography>
        <Button component={RouterLink} to="/" variant="contained">
          Find movies
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 3, md: 5 } }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1">
          Your favorites
        </Typography>
        <Typography color="text.secondary">
          {favorites.length} saved {favorites.length === 1 ? 'movie' : 'movies'}
        </Typography>
      </Box>
      <MovieGrid movies={favorites} />
    </Container>
  );
}
