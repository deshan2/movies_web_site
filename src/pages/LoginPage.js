import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
  Alert,
} from '@mui/material';
import LocalMoviesIcon from '@mui/icons-material/LocalMovies';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useAuth } from '../context/AuthContext';

// Film-strip holes drawn with a repeating gradient. This is the one decorative
// element in the app, so the login page feels like a cinema ticket.
const filmStripStyles = {
  width: 28,
  flexShrink: 0,
  bgcolor: '#14161F',
  backgroundImage: 'radial-gradient(circle at center, #EEF0F5 0 5px, transparent 5.5px)',
  backgroundSize: '28px 36px',
  backgroundPosition: 'center 8px',
};

export default function LoginPage() {
  const { currentUser, signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState('');

  let pageAfterLogin = '/';
  if (location.state && location.state.from) {
    pageAfterLogin = location.state.from;
  }

  // Already signed in, so there is nothing to do here.
  if (currentUser) {
    return <Navigate to={pageAfterLogin} replace />;
  }

  function handleSubmit(event) {
    event.preventDefault();
    const errorText = signIn(username, password);

    if (errorText !== '') {
      setFormError(errorText);
      return;
    }
    navigate(pageAfterLogin, { replace: true });
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Paper
        variant="outlined"
        sx={{ display: 'flex', width: '100%', maxWidth: 440, overflow: 'hidden' }}
      >
        <Box sx={filmStripStyles} aria-hidden="true" />

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ flexGrow: 1, p: { xs: 3, sm: 4 } }}>
          <LocalMoviesIcon color="primary" sx={{ fontSize: 40 }} />
          <Typography variant="h4" component="h1" sx={{ mt: 1 }}>
            Movie Explorer
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5, mb: 3 }}>
            Sign in to search movies and save your favorites.
          </Typography>

          {formError !== '' && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {formError}
            </Alert>
          )}

          <TextField
            label="Username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            autoComplete="username"
            autoFocus
            fullWidth
            margin="dense"
          />

          <TextField
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            fullWidth
            margin="dense"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button type="submit" variant="contained" size="large" fullWidth sx={{ mt: 2 }}>
            Sign in
          </Button>

          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
            This is a demo without a server. Any username with 3 or more characters and any
            password with 6 or more characters will sign you in.
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}
