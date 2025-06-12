// src/theme/styled.d.ts
import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      primary: string;
      secondary: string;
      background: string;
      WHITE: string;
      BLACK: string;
      surface: string;
      text: string;
      muted: string;
      Gold: string;
      gold: string;
    };
    font: {
      family: string;
      size: string;
      weight: {
        regular: number;
        medium: number;
        bold: number;
      };
    };
    images: {
      background: string;
    };
    breakpoints: {
      tablet: string;
      mobile: string;
      laptop: string;
    }
    
  }
}
