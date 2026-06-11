import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from 'styled-components'
import { theme } from './theme/theme.ts'
import { GlobalStyles } from './styles/GlobalStyles.ts'
import { AuthProvider } from './contexts/AuthContext.tsx'
import { SiteConfigProvider } from './contexts/SiteConfigContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <AuthProvider>
        <SiteConfigProvider>
          <App />
        </SiteConfigProvider>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
)
