import { Alert, Button } from '@mui/material';

// Friendly error box with an optional "Try again" button.
export default function ErrorMessage({ message, onRetry }) {
  let retryButton = null;
  if (onRetry) {
    retryButton = (
      <Button color="inherit" size="small" onClick={onRetry}>
        Try again
      </Button>
    );
  }

  return (
    <Alert severity="error" action={retryButton} sx={{ my: 2 }}>
      {message}
    </Alert>
  );
}
