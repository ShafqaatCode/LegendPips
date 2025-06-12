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
};
