import { useState, useEffect } from 'react';
import { getEntries, subscribe } from '../api/apiLogStore.js';

export function useApiLog() {
  const [entries, setEntries] = useState(() => getEntries());

  useEffect(() => {
    setEntries(getEntries());
    return subscribe(setEntries);
  }, []);

  return entries;
}
