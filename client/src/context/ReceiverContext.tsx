"use client";
import React, { createContext, useContext, useState, useCallback } from 'react';
interface ReceiverContextType {
  receiver: any | null;
  setReceiver: (receiver: any | null) => void;
  clearReceiver: () => void;
  hasReceiver: boolean;
}

const ReceiverContext = createContext<ReceiverContextType | undefined>(undefined);

export const ReceiverProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [receiver, setReceiver] = useState<any | null>(null);

  const handleSetReceiver = useCallback((newReceiver: any | null) => {
    setReceiver(newReceiver);
  }, []);

  const clearReceiver = useCallback(() => {
    setReceiver(null);
  }, []);

  const value = {
    receiver,
    setReceiver: handleSetReceiver,
    clearReceiver,
    hasReceiver: !!receiver,
  };

  return (
    <ReceiverContext.Provider value={value}>
      {children}
    </ReceiverContext.Provider>
  );
};

export const useReceiver = () => {
  const context = useContext(ReceiverContext);
  if (context === undefined) {
    throw new Error('useReceiver must be used within a ReceiverProvider');
  }
  return context;
};