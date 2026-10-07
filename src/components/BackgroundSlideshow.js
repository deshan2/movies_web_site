import { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { buildImageUrl } from '../utils/movieHelpers';

const SECONDS_BETWEEN_SLIDES = 5;
const MAXIMUM_SLIDES = 8;

// A faint, slowly changing movie backdrop behind the page.
// It uses the movies it receives, and keeps the last images when the list becomes empty
// (for example while the person is searching).
export default function BackgroundSlideshow({ movies }) {
  const [backdropUrls, setBackdropUrls] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  // Collect up to 8 backdrop images from the movies.
  useEffect(() => {
    const newBackdropUrls = [];

    for (const movie of movies) {
      if (newBackdropUrls.length >= MAXIMUM_SLIDES) {
        break;
      }
      const backdropUrl = buildImageUrl(movie.backdrop_path, 'w780');
      if (backdropUrl) {
        newBackdropUrls.push(backdropUrl);
      }
    }

    if (newBackdropUrls.length > 0) {
      setBackdropUrls(newBackdropUrls);
    }
  }, [movies]);

  // Move to the next image every few seconds.
  useEffect(() => {
    if (backdropUrls.length < 2) {
      return undefined;
    }

    const timerId = setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % backdropUrls.length);
    }, SECONDS_BETWEEN_SLIDES * 1000);

    return () => {
      clearInterval(timerId);
    };
  }, [backdropUrls.length]);

  if (backdropUrls.length === 0) {
    return null;
  }

  return (
    <Box
      aria-hidden="true"
      sx={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      {/* All images are stacked. Only the active one is visible, the others fade out. */}
      {backdropUrls.map((backdropUrl, index) => (
        <Box
          key={backdropUrl}
          sx={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${backdropUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center top',
            opacity: index === activeIndex ? 0.35 : 0,
            transition: 'opacity 1.8s ease-in-out',
            '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
          }}
        />
      ))}

      {/* Fades the image into the page color toward the bottom so posters stay easy to see. */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundImage: (theme) =>
            `linear-gradient(to bottom, ${theme.palette.background.default}00 0%, ${theme.palette.background.default} 90%)`,
        }}
      />
    </Box>
  );
}