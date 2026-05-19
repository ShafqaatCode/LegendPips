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
    };
    typography: {
      heroTitle: string;
      heroTitleLh: string;
      heroSubtitle: string;
      sectionTitle: string;
      sectionTitleLh: string;
      bannerTitle: string;
      bannerTitleLh: string;
      bannerUpper: string;
      panelPageTitle: string;
      panelSectionTitle: string;
      cardTitle: string;
      body: string;
      lead: string;
      caption: string;
      pageGutter: string;
      contentMax: string;
    };
  }
}
