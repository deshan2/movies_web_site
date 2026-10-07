import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { ThemeModeProvider } from './context/ThemeModeContext';
import { AuthProvider } from './context/AuthContext';
import { MovieProvider } from './context/MovieContext';

const rootElement = ReactDOM.createRoot(document.getElementById('root'));

// Order matters: the movie data needs to know who is signed in,
// so MovieProvider sits inside AuthProvider.
rootElement.render(
  <React.StrictMode>
    <ThemeModeProvider>
      <BrowserRouter>
        <AuthProvider>
          <MovieProvider>
            <App />
          </MovieProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeModeProvider>
  </React.StrictMode>
);
