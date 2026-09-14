import { createContext, useContext, type ReactNode } from 'react';

interface SocketContextType {
  connected: boolean;
  subscribe: (destination: string, callback: (message: any) => void) => () => void;
  publish: (destination: string, body: Record<string, unknown>) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Websocket connection logic has been completely removed as per request.
  // Returning a dummy provider so dependent components don't crash.
  
  const subscribe = () => {
    return () => {}; // dummy unsubscribe
  };

  const publish = () => {
    // dummy publish
  };

  return (
    <SocketContext.Provider value={{ connected: false, subscribe, publish }}>
      {children}
    </SocketContext.Provider>
  );
};
