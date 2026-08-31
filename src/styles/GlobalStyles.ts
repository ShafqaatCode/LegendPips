import { createGlobalStyle } from 'styled-components';
import '@fontsource/poppins/400.css';
import '@fontsource/poppins/500.css';
import '@fontsource/poppins/600.css';
import '@fontsource/poppins/700.css';


import '@fontsource/inter/400.css'; // Regular
import '@fontsource/inter/500.css'; // Medium
import '@fontsource/inter/600.css'; // SemiBold
import '@fontsource/inter/700.css'; // Bold


export const GlobalStyles = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
    scroll-behavior: smooth;
  }

  /* Slightly denser root scale — rem-based UI stops feeling “zoomed” on laptops */
  html {
    font-size: 15px;
    -webkit-text-size-adjust: 100%;
    text-size-adjust: 100%;
  }

  @media (max-width: 768px) {
    html {
      font-size: 15px;
    }
  }

  body {
    margin: 0;
    padding: 0;
    font-family: 'Poppins', 'Noto Naskh Arabic', 'Noto Nastaliq Urdu', sans-serif;
    font-size: 0.9375rem;
    line-height: 1.5;
    background-color: ${({ theme }) => theme.colors.surface};
    color: ${({ theme }) => theme.colors.text};
  }

  html[dir="rtl"] body {
    text-align: right;
  }

  html[dir="rtl"] input,
  html[dir="rtl"] textarea,
  html[dir="rtl"] select {
    text-align: right;
  }

  img, svg, video, canvas {
    max-width: 100%;
  }

  a {
    text-decoration: none;
    color: inherit;
  }
`;
