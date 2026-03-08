import React, { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { useAuth } from '../providers/AuthContext';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

interface SocketContextType {
  connected: boolean;
  subscribe: (destination: string, callback: (message: { body: string }) => void) => () => void;
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
  const { getToken, isSignedIn } = useAuth();
  const [stompClient, setStompClient] = useState<Client | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!isSignedIn && stompClient) {
      stompClient.deactivate();
      setStompClient(null);
      setConnected(false);
      return;
    }
    if (!isSignedIn) return;

    const initSocket = async () => {
      const token = await getToken();
      if (!token) return;

      const client = new Client({
        webSocketFactory: () => new SockJS(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/ws`),
        connectHeaders: {
          Authorization: `Bearer ${token}`,
        },
        debug: (str) => {
          console.log(str);
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
        console.error('Details', frame.body);
      };

      client.activate();
      setStompClient(client);
    };

    initSocket();

    return () => {
      if (stompClient) {
        stompClient.deactivate();
      }
    };
  }, [isSignedIn, getToken]);

  const subscribe = (destination: string, callback: (message: { body: string }) => void) => {
    if (!stompClient || !connected) {
      console.warn('Cannot subscribe, socket not connected');
      return () => {};
    }

    const subscription = stompClient.subscribe(destination, (message) => {
      callback(JSON.parse(message.body));
    });

    return () => subscription.unsubscribe();
  };

  const publish = (destination: string, body: Record<string, unknown>) => {
    if (!stompClient || !connected) {
      console.warn('Cannot publish, socket not connected');
      return;
    }

    stompClient.publish({
      destination,
      body: JSON.stringify(body),
    });
  };

  return (
    <SocketContext.Provider value={{ connected, subscribe, publish }}>
      {children}
    </SocketContext.Provider>
  );
};
