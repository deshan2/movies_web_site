# Movie Explorer

A React web app to search movies, see what is trending, read details, watch trailers and keep a list of favorites. Movie data comes live from [The Movie Database (TMDb) API](https://developers.themoviedb.org/3).

**Live demo:** _add your Vercel/Netlify link here_

## Features

**Required**
- Login page with username and password (front-end demo, see "Login" below)
- Search bar with results shown as a poster grid (poster, title, release year, rating)
- Movie details page: overview, genres, rating, runtime, cast and a trailer
- Trending movies section (TMDb "trending this week")
- Light and dark mode (follows the device setting at first, then remembers your choice)
- Infinite scrolling for search results
- Friendly error messages with a "Try again" button
- State managed with the React Context API
- Last searched movie saved in `localStorage`
- Favorites list saved in `localStorage` (one list per username)

**Bonus**
- Filter by genre, release year and minimum rating
- YouTube trailer in a pop-up player (TMDb video data, embedded with `youtube-nocookie.com`)
- "Load more" button on the trending and filtered lists (search uses infinite scroll)

## Tech stack

React 18 (Create React App), Material-UI v5, React Router v6, axios, React Context API.

## Getting started

1. Get a free TMDb API key: create an account at themoviedb.org, then open **Settings > API**.
2. Install and run:

```bash
npm install
cp .env.example .env     # on Windows: copy .env.example .env
# open .env and paste your key after REACT_APP_TMDB_API_KEY=
npm start
```

The app opens at http://localhost:3000. Restart `npm start` after changing `.env`.

You can use either TMDb credential. The 32 character **API Key** and the long **API Read Access Token** (starts with `eyJ`) both work. The code detects which one you pasted.

## Scripts

| Command | What it does |
| --- | --- |
| `npm start` | Runs the app in development |
| `npm run build` | Creates the production build in `build/` |

## Deploying

**Vercel**
1. Push the project to GitLab, then import it in Vercel.
2. Framework preset: Create React App.
3. Open **Settings > Environment Variables** and add `REACT_APP_TMDB_API_KEY`. The `.env` file is not committed, so the deployed app has no key until you add it here.
4. Redeploy. Variables only take effect on a new build.

**Netlify**
1. Build command `npm run build`, publish directory `build`.
2. Add `REACT_APP_TMDB_API_KEY` under **Site configuration > Environment variables**, then redeploy.

`vercel.json` and `public/_redirects` make direct links such as `/movie/550` work on refresh.

## API usage

All requests live in `src/api/tmdbClient.js`.

| Purpose | Endpoint |
| --- | --- |
| Trending movies | `GET /trending/movie/week` |
| Search | `GET /search/movie` |
| Filtered browsing | `GET /discover/movie` |
| Genre list | `GET /genre/movie/list` |
| Details, trailer and cast | `GET /movie/{id}?append_to_response=videos,credits` |

Posters come from `https://image.tmdb.org/t/p/`.

Errors are turned into plain messages in `src/utils/errors.js` (missing key, wrong key, rate limit, server problem, offline, timeout).

## Project structure

```
src/
  api/tmdbClient.js        axios instance and every TMDb request
  context/
    AuthContext.js         signed-in user
    MovieContext.js        movie lists, filters, last search, favorites
    ThemeModeContext.js    light/dark mode
  hooks/
    usePagedList.js        loads a TMDb list page by page
    useInfiniteScroll.js   triggers loading when the list end is near
  components/              Header, SearchBar, FilterBar, MovieCard, MovieGrid,
                           TrailerDialog, ErrorMessage, ProtectedRoute, Layout
  pages/                   LoginPage, HomePage, MovieDetailsPage, FavoritesPage, NotFoundPage
  utils/                   storage, errors and movie helper functions
  theme.js                 MUI theme for light and dark mode
```

## How some parts work

- **Search and filters.** Typing waits 500 ms before searching. With no search text, the filters use TMDb's `discover` endpoint. With search text, TMDb search cannot filter by genre or rating, so the filters are applied to the loaded results in the browser.
- **Persistence.** `movieExplorer.lastSearch`, `movieExplorer.favorites.<username>`, `movieExplorer.themeMode` and `movieExplorer.session` are stored in `localStorage`.
- **Login.** There is no backend, so sign-in only checks the form (username 3+ characters, password 6+) and remembers the username. To use real accounts, replace `signIn` in `src/context/AuthContext.js` with a call to your own API.
- **API key.** In a Create React App project the key is bundled into the browser code, so anyone can see it. That is fine for this exercise. For a real product, put a small server between the app and TMDb so the key stays private.

## Credits

This product uses the TMDb API but is not endorsed or certified by TMDb.
