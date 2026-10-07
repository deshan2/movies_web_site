import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';

export default function NotFoundPage() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 3, textAlign: 'center' }}>
      <Typography variant="h2" component="h1">
        404
      </Typography>
      <Typography color="text.secondary" sx={{ mt: 1, mb: 3 }}>
        This page does not exist.
      </Typography>
      <Button component={RouterLink} to="/" variant="contained">
        Back to home
      </Button>
    </Box>
  );
}
