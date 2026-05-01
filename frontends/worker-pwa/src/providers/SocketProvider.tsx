import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { useAppSelector } from '../../store';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

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
  const { token, isAuthenticated } = useAppSelector((state) => state.auth);
  const [stompClient, setStompClient] = useState<Client | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!isAuthenticated && stompClient) {
      stompClient.deactivate();
      setStompClient(null);
      setConnected(false);
      return;
    }
    if (!isAuthenticated || !token) return;

    const client = new Client({
      webSocketFactory: () => new SockJS(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/ws`),
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      debug: (str) => {
        if (import.meta.env.DEV) console.log(str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.onConnect = () => {
      console.log('Connected to WebSocket');
      setConnected(true);
    };

    client.onDisconnect = () => {
      console.log('Disconnected from WebSocket');
      setConnected(false);
    };

    client.onStompError = (frame) => {
      console.error('STOMP error', frame.headers['message']);
    };

    client.activate();
    setStompClient(client);

    return () => {
      client.deactivate();
    };
  }, [isAuthenticated, token]);

  const subscribe = useCallback((destination: string, callback: (message: any) => void) => {
    if (!stompClient || !stompClient.connected) {
      console.warn('Cannot subscribe, socket not connected');
      return () => {};
    }

    try {
      const subscription = stompClient.subscribe(destination, (message) => {
        try {
          callback(JSON.parse(message.body));
        } catch (err) {
          console.error('Error parsing socket message:', err);
        }
      });

      return () => {
        if (stompClient.connected) {
          subscription.unsubscribe();
        }
      };
    } catch (err) {
      console.error('STOMP subscription error:', err);
      return () => {};
    }
  }, [stompClient]);

  const publish = useCallback((destination: string, body: Record<string, unknown>) => {
    if (!stompClient || !stompClient.connected) {
      console.warn('Cannot publish, socket not connected');
      return;
    }

    try {
      stompClient.publish({
        destination,
        body: JSON.stringify(body),
      });
    } catch (err) {
      console.error('STOMP publish error:', err);
    }
  }, [stompClient]);

  return (
    <SocketContext.Provider value={{ connected, subscribe, publish }}>
      {children}
    </SocketContext.Provider>
  );
};
