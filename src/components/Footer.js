import { Link as RouterLink } from 'react-router-dom';
import { Box, Container, Link, Typography } from '@mui/material';
import LocalMoviesIcon from '@mui/icons-material/LocalMovies';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        position: 'relative',
        zIndex: 1,
        mt: 6,
        py: 3,
        bgcolor: 'background.paper',
        borderTop: 1,
        borderColor: 'divider',
      }}
    >
      <Container
        maxWidth="xl"
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'flex-start', md: 'center' },
          justifyContent: 'space-between',
          gap: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LocalMoviesIcon color="primary" />
          <Typography sx={{ fontWeight: 700 }}>LakMovies</Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Link component={RouterLink} to="/" color="text.secondary" underline="hover">
            Home
          </Link>
          <Link component={RouterLink} to="/favorites" color="text.secondary" underline="hover">
            Favorites
          </Link>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ maxWidth:320 }}>
          This product uses the{' '}
          <Link
            href="https://www.themoviedb.org"
            target="_blank"
            rel="noopener noreferrer"
            underline="hover"
          >
            TMDb
          </Link>{' '}
          API but is not endorsed or certified by TMDb. © {currentYear} LakMovies
        </Typography>
      </Container>
    </Box>
  );
}