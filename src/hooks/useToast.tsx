import { useState, useCallback } from 'react';

export function useToast() {
  const [message, setMessage] = useState<string | null>(null);

  const showToast = useCallback((text: string) => {
    setMessage(text);
    setTimeout(() => setMessage(null), 2500);
  }, []);

  const Toast = message ? <div className="toast">{message}</div> : null;

  return { showToast, Toast };
}
