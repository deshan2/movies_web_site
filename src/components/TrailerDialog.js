import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

// Pop-up that plays a YouTube trailer. The player is removed when the pop-up closes,
// which also stops the video.
export default function TrailerDialog({ isOpen, onClose, videoKey, movieTitle }) {
  if (!videoKey) {
    return null;
  }

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{movieTitle} trailer</DialogTitle>
      <DialogContent>
        <Box sx={{ position: 'relative', width: '100%', aspectRatio: '16 / 9', bgcolor: '#000000' }}>
          <Box
            component="iframe"
            src={`https://www.youtube-nocookie.com/embed/${videoKey}?autoplay=1&rel=0`}
            title={`${movieTitle} trailer`}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          href={`https://www.youtube.com/watch?v=${videoKey}`}
          target="_blank"
          rel="noopener noreferrer"
          endIcon={<OpenInNewIcon />}
        >
          Open on YouTube
        </Button>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
