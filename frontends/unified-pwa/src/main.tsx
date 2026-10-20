import { createRoot } from 'react-dom/client';
import { AuthProvider } from './providers/AuthContext';
import { QueryProvider } from './providers/QueryProvider';
import { SocketProvider } from './providers/SocketProvider';
import { TranslationProvider } from './providers/TranslationContext';
import './index.css';
import './App.css';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <AuthProvider>
    <QueryProvider>
      <SocketProvider>
        <TranslationProvider>
          <App />
        </TranslationProvider>
      </SocketProvider>
    </QueryProvider>
  </AuthProvider>,
);

