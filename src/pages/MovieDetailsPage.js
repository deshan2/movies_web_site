import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  Skeleton,
  Typography,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import MovieOutlinedIcon from '@mui/icons-material/MovieOutlined';
import ErrorMessage from '../components/ErrorMessage';
import TrailerDialog from '../components/TrailerDialog';
import { fetchMovieDetails } from '../api/tmdbClient';
import { useMovies } from '../context/MovieContext';
import { getErrorMessage } from '../utils/errors';
import {
  buildImageUrl,
  findTrailer,
  formatRating,
  formatRuntime,
  getReleaseYear,
} from '../utils/movieHelpers';

const MAXIMUM_CAST_MEMBERS = 15;

export default function MovieDetailsPage() {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useMovies();

  const [movie, setMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [reloadCounter, setReloadCounter] = useState(0);

  useEffect(() => {
    let wasCancelled = false;
    window.scrollTo(0, 0);

    async function loadMovie() {
      setIsLoading(true);
      setErrorMessage('');
      try {
        const movieDetails = await fetchMovieDetails(movieId);
        if (!wasCancelled) {
          setMovie(movieDetails);
        }
      } catch (error) {
        if (!wasCancelled) {
          setErrorMessage(getErrorMessage(error));
        }
      } finally {
        if (!wasCancelled) {
          setIsLoading(false);
        }
      }
    }

    loadMovie();

    // If the person leaves the page before the request finishes, ignore the answer.
    return () => {
      wasCancelled = true;
    };
  }, [movieId, reloadCounter]);

  const backButton = (
    <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mb: 2 }}>
      Back
    </Button>
  );

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 3 }}>
        {backButton}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
          <Skeleton variant="rounded" sx={{ width: { xs: '100%', md: 300 }, height: 450, flexShrink: 0 }} />
          <Box sx={{ flexGrow: 1 }}>
            <Skeleton variant="text" sx={{ fontSize: '3rem' }} />
            <Skeleton variant="text" width="50%" />
            <Skeleton variant="rounded" height={160} sx={{ mt: 3 }} />
          </Box>
        </Box>
      </Container>
    );
  }

  if (errorMessage !== '' || movie === null) {
    return (
      <Container maxWidth="lg" sx={{ py: 3 }}>
        {backButton}
        <ErrorMessage
          message={errorMessage}
          onRetry={() => setReloadCounter(reloadCounter + 1)}
        />
      </Container>
    );
  }

  const posterUrl = buildImageUrl(movie.poster_path, 'w500');
  const backdropUrl = buildImageUrl(movie.backdrop_path, 'w1280');
  const trailer = findTrailer(movie.videos ? movie.videos.results : []);
  const castMembers = movie.credits ? movie.credits.cast.slice(0, MAXIMUM_CAST_MEMBERS) : [];
  const movieIsFavorite = isFavorite(movie.id);

  const factsAboutMovie = [];
  if (movie.release_date) {
    factsAboutMovie.push({ label: 'Release date', value: movie.release_date });
  }
  if (movie.status) {
    factsAboutMovie.push({ label: 'Status', value: movie.status });
  }
  if (movie.original_language) {
    factsAboutMovie.push({ label: 'Original language', value: movie.original_language.toUpperCase() });
  }
  if (movie.vote_count) {
    factsAboutMovie.push({ label: 'Votes', value: movie.vote_count.toLocaleString() });
  }

  let posterContent = (
    <Box
      sx={{
        width: '100%',
        aspectRatio: '2 / 3',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'action.hover',
        borderRadius: 2,
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
        sx={{ display: 'block', width: '100%', borderRadius: 2, boxShadow: 6 }}
      />
    );
  }

  let trailerButton = (
    <Button variant="outlined" disabled startIcon={<PlayArrowIcon />}>
      No trailer available
    </Button>
  );
  if (trailer) {
    trailerButton = (
      <Button variant="contained" startIcon={<PlayArrowIcon />} onClick={() => setIsTrailerOpen(true)}>
        Watch trailer
      </Button>
    );
  }

  return (
    <Box sx={{ position: 'relative' }}>
      {/* Blurred backdrop image that fades into the page colour. */}
      {backdropUrl && (
        <Box
          aria-hidden="true"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: { xs: 280, md: 440 },
            backgroundImage: (theme) =>
              `linear-gradient(to bottom, ${theme.palette.background.default}99, ${theme.palette.background.default}), url(${backdropUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center top',
          }}
        />
      )}

      <Container maxWidth="lg" sx={{ position: 'relative', py: 3 }}>
        {backButton}

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: { xs: 3, md: 5 } }}>
          <Box sx={{ width: { xs: '65%', sm: '45%', md: 300 }, flexShrink: 0, alignSelf: { xs: 'center', md: 'flex-start' } }}>
            {posterContent}
          </Box>

          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Typography variant="h3" component="h1" sx={{ fontSize: { xs: '2rem', md: '3rem' } }}>
              {movie.title}{' '}
              <Typography component="span" variant="h5" color="text.secondary">
                ({getReleaseYear(movie.release_date)})
              </Typography>
            </Typography>

            {movie.tagline && (
              <Typography color="text.secondary" sx={{ fontStyle: 'italic', mt: 0.5 }}>
                {movie.tagline}
              </Typography>
            )}

            <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1, mt: 2 }}>
              <Chip
                icon={<StarRoundedIcon />}
                label={`${formatRating(movie.vote_average)} / 10`}
                color="warning"
                sx={{ fontWeight: 700 }}
              />
              {movie.runtime > 0 && <Chip label={formatRuntime(movie.runtime)} variant="outlined" />}
              {movie.genres.map((genre) => (
                <Chip key={genre.id} label={genre.name} variant="outlined" />
              ))}
            </Box>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mt: 3 }}>
              {trailerButton}
              <Button
                variant={movieIsFavorite ? 'contained' : 'outlined'}
                color="primary"
                startIcon={movieIsFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                onClick={() => toggleFavorite(movie)}
              >
                {movieIsFavorite ? 'In your favorites' : 'Add to favorites'}
              </Button>
            </Box>

            <Typography variant="h6" component="h2" sx={{ mt: 4, mb: 1 }}>
              Overview
            </Typography>
            <Typography sx={{ maxWidth: '70ch', lineHeight: 1.7 }}>
              {movie.overview || 'No overview is available for this movie yet.'}
            </Typography>

            {factsAboutMovie.length > 0 && (
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' },
                  gap: 2,
                  mt: 4,
                }}
              >
                {factsAboutMovie.map((fact) => (
                  <Box key={fact.label}>
                    <Typography variant="caption" color="text.secondary">
                      {fact.label}
                    </Typography>
                    <Typography sx={{ fontWeight: 600 }}>{fact.value}</Typography>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        </Box>

        {castMembers.length > 0 && (
          <Box sx={{ mt: 6 }}>
            <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
              Cast
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 2 }}>
              {castMembers.map((castMember) => (
                <Box key={castMember.credit_id} sx={{ width: 104, flexShrink: 0, textAlign: 'center' }}>
                  <Avatar
                    src={buildImageUrl(castMember.profile_path, 'w185') || undefined}
                    alt={castMember.name}
                    sx={{ width: 88, height: 88, mx: 'auto', mb: 1 }}
                  />
                  <Typography variant="body2" sx={{ fontWeight: 700, lineHeight: 1.25 }}>
                    {castMember.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.25, display: 'block' }}>
                    {castMember.character}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </Container>

      <TrailerDialog
        isOpen={isTrailerOpen}
        onClose={() => setIsTrailerOpen(false)}
        videoKey={trailer ? trailer.key : null}
        movieTitle={movie.title}
      />
    </Box>
  );
}
