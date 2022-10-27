import { useState, useEffect } from "react";

export default function useLocalStorage(key, defaultValue) {
  const [storedValue, setStoredValue] = useState(() => {
    const item = localStorage.getItem(key);
    return item ? item : defaultValue;
  });

  const setValue = (value) => {
    localStorage.setItem(key, value);
  };

  return [storedValue, setValue];
}
