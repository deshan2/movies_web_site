import { createContext, useContext, useState } from 'react';
import { readFromStorage, removeFromStorage, writeToStorage } from '../utils/storage';

const SESSION_STORAGE_KEY = 'movieExplorer.session';

const AuthContext = createContext(null);

// NOTE: There is no backend in this project, so sign-in only checks the form rules
// and remembers the username in localStorage. To use real accounts, replace the
// body of `signIn` with a call to your own API.
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => readFromStorage(SESSION_STORAGE_KEY, null));

  // Returns an empty string when sign-in worked, or a message to show under the form.
  function signIn(username, password) {
    const trimmedUsername = username.trim();

    if (trimmedUsername.length < 3) {
      return 'Username must have at least 3 characters.';
    }
    if (password.length < 6) {
      return 'Password must have at least 6 characters.';
    }

    setCurrentUser(trimmedUsername);
    writeToStorage(SESSION_STORAGE_KEY, trimmedUsername);
    return '';
  }

  function signOut() {
    setCurrentUser(null);
    removeFromStorage(SESSION_STORAGE_KEY);
  }

  return (
    <AuthContext.Provider value={{ currentUser, signIn, signOut }}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
