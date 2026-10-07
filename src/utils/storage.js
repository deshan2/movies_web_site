// Small helpers around localStorage. Every call is wrapped in try/catch because
// localStorage can be unavailable (private mode) or hold broken data.

export function readFromStorage(storageKey, fallbackValue) {
  try {
    const storedText = window.localStorage.getItem(storageKey);
    if (storedText === null) {
      return fallbackValue;
    }
    return JSON.parse(storedText);
  } catch (error) {
    return fallbackValue;
  }
}

export function writeToStorage(storageKey, value) {
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(value));
  } catch (error) {
    // Storage is full or blocked. The app still works, it just will not remember.
  }
}

export function removeFromStorage(storageKey) {
  try {
    window.localStorage.removeItem(storageKey);
  } catch (error) {
    // Nothing to do.
  }
}
