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
    
  }
}
