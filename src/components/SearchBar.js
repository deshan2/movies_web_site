import { useEffect, useState } from 'react';
import { Box, IconButton, InputAdornment, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';

const WAIT_AFTER_TYPING_IN_MILLISECONDS = 500;

// Search box. It waits until the person stops typing before searching,
// so we do not send a request for every single letter.
export default function SearchBar({ initialValue, onSearch }) {
  const [inputValue, setInputValue] = useState(initialValue);

  useEffect(() => {
    const timerId = setTimeout(() => {
      onSearch(inputValue);
    }, WAIT_AFTER_TYPING_IN_MILLISECONDS);

    return () => {
      clearTimeout(timerId);
    };
  }, [inputValue, onSearch]);

  // Pressing Enter searches straight away.
  function handleSubmit(event) {
    event.preventDefault();
    onSearch(inputValue);
  }

  let clearButton = null;
  if (inputValue !== '') {
    clearButton = (
      <InputAdornment position="end">
        <IconButton
          aria-label="Clear search"
          edge="end"
          onClick={() => {
            setInputValue('');
            onSearch('');
          }}
        >
          <CloseIcon />
        </IconButton>
      </InputAdornment>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit} role="search">
      <TextField
        fullWidth
        value={inputValue}
        onChange={(event) => setInputValue(event.target.value)}
        placeholder="Search for a movie"
        inputProps={{ 'aria-label': 'Search for a movie' }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
          endAdornment: clearButton,
          sx: { bgcolor: 'background.paper', fontSize: '1.05rem' },
        }}
      />
    </Box>
  );
}
