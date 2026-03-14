import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from './providers/AuthContext'
import { QueryProvider } from './providers/QueryProvider.tsx'
import { SocketProvider } from './providers/SocketProvider.tsx'
import './index.css'
import './i18n'
import { LanguageProvider } from './providers/LanguageContext'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <QueryProvider>
        <SocketProvider>
          <LanguageProvider>
            <App />
          </LanguageProvider>
        </SocketProvider>
      </QueryProvider>
    </AuthProvider>
  </StrictMode>,
)
