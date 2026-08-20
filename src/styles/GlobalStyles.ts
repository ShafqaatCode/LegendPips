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

  body {
    margin: 0;
    padding: 0;
    font-family: 'Poppins', 'Noto Naskh Arabic', 'Noto Nastaliq Urdu', sans-serif;
    
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

  a {
    text-decoration: none;
    color: inherit;
  }
`;
