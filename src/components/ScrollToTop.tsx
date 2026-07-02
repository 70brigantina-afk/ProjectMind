import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { scrollToTop } from '../utils/scroll';

export function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    scrollToTop();
  }, [pathname, hash]);

  return null;
}
