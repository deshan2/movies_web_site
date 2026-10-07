// Turns any error thrown by axios into a short message a person can act on.

export function getErrorMessage(error) {
  if (error && error.message === 'MISSING_API_KEY') {
    return 'The TMDb API key is missing. Add REACT_APP_TMDB_API_KEY to your .env file and restart the app.';
  }

  if (error && error.response) {
    const statusCode = error.response.status;

    if (statusCode === 401) {
      return 'TMDb did not accept the API key. Check that REACT_APP_TMDB_API_KEY is correct.';
    }
    if (statusCode === 404) {
      return 'We could not find that movie.';
    }
    if (statusCode === 429) {
      return 'Too many requests were sent to TMDb. Wait a few seconds and try again.';
    }
    if (statusCode >= 500) {
      return 'TMDb is having problems right now. Try again in a moment.';
    }
    return 'Something went wrong while loading movies. Please try again.';
  }

  if (error && error.code === 'ECONNABORTED') {
    return 'The request took too long. Check your connection and try again.';
  }

  return 'Cannot reach TMDb. Check your internet connection and try again.';
}
