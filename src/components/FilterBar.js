import { Box, Button, MenuItem, TextField } from '@mui/material';

const RATING_OPTIONS = [5, 6, 7, 8, 9];
const OLDEST_YEAR = 1950;

function buildYearOptions() {
  const yearOptions = [];
  const newestYear = new Date().getFullYear() + 1;
  for (let yearNumber = newestYear; yearNumber >= OLDEST_YEAR; yearNumber -= 1) {
    yearOptions.push(yearNumber);
  }
  return yearOptions;
}

const YEAR_OPTIONS = buildYearOptions();

// Three drop-downs: genre, release year and minimum rating.
export default function FilterBar({ filters, genres, onChange, onClear, hasActiveFilters }) {
  let clearButton = null;
  if (hasActiveFilters) {
    clearButton = (
      <Button onClick={onClear} sx={{ alignSelf: { sm: 'center' } }}>
        Clear filters
      </Button>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        gap: 1.5,
      }}
    >
      <TextField
        select
        size="small"
        label="Genre"
        value={filters.genreId}
        onChange={(event) => onChange('genreId', event.target.value)}
        sx={{ minWidth: { sm: 170 }, bgcolor: 'background.paper' }}
      >
        <MenuItem value="">Any genre</MenuItem>
        {genres.map((genre) => (
          <MenuItem key={genre.id} value={String(genre.id)}>
            {genre.name}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        select
        size="small"
        label="Year"
        value={filters.year}
        onChange={(event) => onChange('year', event.target.value)}
        sx={{ minWidth: { sm: 130 }, bgcolor: 'background.paper' }}
        SelectProps={{ MenuProps: { PaperProps: { sx: { maxHeight: 320 } } } }}
      >
        <MenuItem value="">Any year</MenuItem>
        {YEAR_OPTIONS.map((yearNumber) => (
          <MenuItem key={yearNumber} value={String(yearNumber)}>
            {yearNumber}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        select
        size="small"
        label="Rating"
        value={filters.minimumRating}
        onChange={(event) => onChange('minimumRating', event.target.value)}
        sx={{ minWidth: { sm: 150 }, bgcolor: 'background.paper' }}
      >
        <MenuItem value="">Any rating</MenuItem>
        {RATING_OPTIONS.map((rating) => (
          <MenuItem key={rating} value={String(rating)}>
            {rating}+ stars
          </MenuItem>
        ))}
      </TextField>

      {clearButton}
    </Box>
  );
}
