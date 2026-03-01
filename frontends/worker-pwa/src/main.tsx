import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import { QueryProvider } from './providers/QueryProvider.tsx'
import { SocketProvider } from './providers/SocketProvider.tsx'
import './index.css'
import App from './App.tsx'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) { throw new Error("Missing Publishable Key"); }

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ClerkProvider 
      publishableKey={PUBLISHABLE_KEY}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
    >
      <QueryProvider>
        <SocketProvider>
          <App />
        </SocketProvider>
      </QueryProvider>
    </ClerkProvider>
  </StrictMode>,
)
