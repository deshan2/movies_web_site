import { Link as RouterLink, NavLink } from 'react-router-dom';
import { AppBar, Badge, Box, Button, IconButton, Toolbar, Tooltip, Typography } from '@mui/material';
import LocalMoviesIcon from '@mui/icons-material/LocalMovies';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../context/AuthContext';
import { useMovies } from '../context/MovieContext';
import { useThemeMode } from '../context/ThemeModeContext';

// NavLink adds the class "active" to the link of the current page.
const navigationButtonStyles = {
  color: 'text.secondary',
  '&.active': { color: 'primary.main' },
};

export default function Header() {
  const { currentUser, signOut } = useAuth();
  const { favorites } = useMovies();
  const { mode, toggleMode } = useThemeMode();

  let modeIcon = <DarkModeOutlinedIcon />;
  let modeLabel = 'Switch to dark mode';
  if (mode === 'dark') {
    modeIcon = <LightModeOutlinedIcon />;
    modeLabel = 'Switch to light mode';
  }

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: 'background.paper',
        color: 'text.primary',
        borderBottom: 1,
        borderColor: 'divider',
        backgroundImage: 'none',
      }}
    >
      <Toolbar sx={{ gap: { xs: 0, sm: 1 } }}>
        <Box
          component={RouterLink}
          to="/"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            mr: { xs: 0.5, sm: 2 },
            color: 'primary.main',
            textDecoration: 'none',
          }}
        >
          <LocalMoviesIcon />
          <Typography
            variant="h6"
            component="span"
            sx={{ display: { xs: 'none', md: 'inline' }, color: 'text.primary' }}
          >
            LakMovies
          </Typography>
        </Box>

        <Button component={NavLink} to="/" end startIcon={<HomeOutlinedIcon />} sx={navigationButtonStyles}>
          Home
        </Button>

        <Button
          component={NavLink}
          to="/favorites"
          startIcon={
            <Badge badgeContent={favorites.length} color="primary" max={99}>
              <FavoriteBorderIcon />
            </Badge>
          }
          sx={navigationButtonStyles}
        >
          Favorites
        </Button>

        <Box sx={{ flexGrow: 1 }} />

        <Tooltip title={modeLabel}>
          <IconButton aria-label={modeLabel} onClick={toggleMode} color="inherit">
            {modeIcon}
          </IconButton>
        </Tooltip>

        <Tooltip title={`Sign out ${currentUser}`}>
          <IconButton aria-label="Sign out" onClick={signOut} color="inherit">
            <LogoutIcon />
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
}
