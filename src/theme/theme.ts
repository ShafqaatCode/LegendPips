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
    size: '15px',
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
  /** Shared scale — denser desktop rhythm (less “zoomed in”) */
  typography: {
    heroTitle: "clamp(1.5rem, 1.8vw + 0.75rem, 2.125rem)",
    heroTitleLh: "1.22",
    heroSubtitle: "clamp(0.875rem, 0.6vw + 0.7rem, 0.975rem)",
    sectionTitle: "clamp(1.35rem, 1.5vw + 0.7rem, 1.85rem)",
    sectionTitleLh: "1.25",
    bannerTitle: "clamp(1.45rem, 1.6vw + 0.75rem, 1.95rem)",
    bannerTitleLh: "1.25",
    bannerUpper: "0.75rem",
    panelPageTitle: "1.25rem",
    panelSectionTitle: "1.05rem",
    cardTitle: "0.9375rem",
    body: "0.8125rem",
    lead: "0.9375rem",
    caption: "0.7rem",
    pageGutter: "clamp(1rem, 3.5vw, 2.5rem)",
    contentMax: "min(1200px, 100%)",
  },
};
