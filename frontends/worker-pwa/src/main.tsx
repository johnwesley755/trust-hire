import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from './providers/AuthContext.tsx'
import { QueryProvider } from './providers/QueryProvider.tsx'
import { SocketProvider } from './providers/SocketProvider.tsx'
import { LanguageProvider } from './providers/LanguageProvider.tsx'
import './index.css'
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

