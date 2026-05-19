import type { DefaultTheme } from 'styled-components';

export const theme: DefaultTheme = {
  colors: {
    primary: '#132E58', // DARK BLUE
    secondary: '#1D4ED8', // ROYAL BLUE
    background: '#FFFFFF', // WHITE
    WHITE: '#FFFFFF', // WHITE
    BLACK: '#000000', // BLACK
    surface: '#F3F4F7', // LIGHT PINK
    text: '#132E58', // DARK BLUE
    muted: '#6b7280',
    Gold: "linear-gradient(90deg, #FAFC15 0%, #FBBF24 100%)",
    gold: "#Fbbf24"
  },
  font: {
    family:` 'Poppins', sans-serif`,
    size: '16px',
    weight: {
      regular: 400,
      medium: 500,
      bold: 700,
    },
  },
  images: {
    background: './Assets/banner/BannerBg.jpg',
  },
  breakpoints: {
    tablet: "992px",
    mobile: "768px",
    laptop: "1200px"
  },
  /** Shared scale — use in styled-components for consistent headings & rhythm */
  typography: {
    heroTitle: "clamp(1.75rem, 2.8vw + 0.85rem, 2.5rem)",
    heroTitleLh: "1.2",
    heroSubtitle: "clamp(0.9375rem, 1.2vw + 0.75rem, 1.0625rem)",
    sectionTitle: "clamp(1.625rem, 2.5vw + 0.75rem, 2.25rem)",
    sectionTitleLh: "1.2",
    bannerTitle: "clamp(1.75rem, 2.6vw + 0.85rem, 2.25rem)",
    bannerTitleLh: "1.25",
    bannerUpper: "0.8125rem",
    panelPageTitle: "1.375rem",
    panelSectionTitle: "1.125rem",
    cardTitle: "1rem",
    body: "0.875rem",
    lead: "1rem",
    caption: "0.75rem",
    pageGutter: "clamp(1rem, 4vw, 2rem)",
    contentMax: "min(1120px, 100%)",
  },
};
