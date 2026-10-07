import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import MovieOutlinedIcon from '@mui/icons-material/MovieOutlined';
import { useMovies } from '../context/MovieContext';
import { buildImageUrl, formatRating, getReleaseYear } from '../utils/movieHelpers';

// One poster in the grid: poster, rating, title, release year and a favourite button.
export default function MovieCard({ movie }) {
  const { isFavorite, toggleFavorite } = useMovies();

  const posterUrl = buildImageUrl(movie.poster_path, 'w342');
  const movieIsFavorite = isFavorite(movie.id);

  let posterContent = (
    <Box
      sx={{
        width: '100%',
        aspectRatio: '2 / 3',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'action.hover',
        color: 'text.secondary',
      }}
    >
      <MovieOutlinedIcon fontSize="large" />
    </Box>
  );

  if (posterUrl) {
    posterContent = (
      <Box
        component="img"
        src={posterUrl}
        alt={`Poster for ${movie.title}`}
        loading="lazy"
        sx={{ display: 'block', width: '100%', aspectRatio: '2 / 3', objectFit: 'cover' }}
      />
    );
  }

  let favoriteLabel = 'Add to favorites';
  if (movieIsFavorite) {
    favoriteLabel = 'Remove from favorites';
  }

  return (
    <Card sx={{ position: 'relative', height: '100%' }} variant="outlined">
      <CardActionArea component={RouterLink} to={`/movie/${movie.id}`} sx={{ height: '100%' }}>
        {posterContent}
        <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 700,
              lineHeight: 1.3,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              minHeight: '2.6em',
            }}
          >
            {movie.title}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {getReleaseYear(movie.release_date)}
          </Typography>
        </CardContent>
      </CardActionArea>

      <Box
        sx={{
          position: 'absolute',
          top: 8,
          left: 8,
          display: 'flex',
          alignItems: 'center',
          gap: 0.25,
          px: 0.75,
          py: 0.25,
          borderRadius: 5,
          bgcolor: 'rgba(0, 0, 0, 0.75)',
          color: '#FFFFFF',
          pointerEvents: 'none',
        }}
      >
        <StarRoundedIcon sx={{ fontSize: 16, color: 'warning.main' }} />
        <Typography variant="caption" sx={{ fontWeight: 700 }}>
          {formatRating(movie.vote_average)}
        </Typography>
      </Box>

      <Tooltip title={favoriteLabel}>
        <IconButton
          aria-label={favoriteLabel}
          onClick={() => toggleFavorite(movie)}
          size="small"
          sx={{
            position: 'absolute',
            top: 6,
            right: 6,
            bgcolor: 'rgba(0, 0, 0, 0.75)',
            color: movieIsFavorite ? 'primary.main' : '#FFFFFF',
            '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.9)' },
          }}
        >
          {movieIsFavorite ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
        </IconButton>
      </Tooltip>
    </Card>
  );
}
