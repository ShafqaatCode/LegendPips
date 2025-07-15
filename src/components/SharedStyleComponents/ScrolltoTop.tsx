// src/components/ScrollToTop.js (or wherever you prefer)
import {  useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop() {
  const { pathname } = useLocation();

  // useLayoutEffect is generally preferred here to ensure the scroll happens
  // before the browser paints, preventing any flicker.
  useLayoutEffect(() => {
    window.scrollTo(0, 0); // Scrolls to the top-left corner
  }, [pathname]); // Re-run this effect whenever the pathname changes

  return null; // This component doesn't render anything visually
}

export default ScrollToTop;