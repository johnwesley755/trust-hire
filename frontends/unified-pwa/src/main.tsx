import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AuthProvider } from './providers/AuthContext';
import { QueryProvider } from './providers/QueryProvider';
import { SocketProvider } from './providers/SocketProvider';
import './index.css';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <QueryProvider>
        <SocketProvider>
          <App />
        </SocketProvider>
      </QueryProvider>
    </AuthProvider>
  </StrictMode>,
);
