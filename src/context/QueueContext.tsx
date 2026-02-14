import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Token, Counter, Department, DEPARTMENTS } from '@/types/queue';

interface QueueContextType {
  tokens: Token[];
  counters: Counter[];
  generateToken: (department: Department, customerName: string, phone?: string) => Token;
  callNextToken: (counterId: number) => Token | null;
  completeToken: (tokenId: string) => void;
  skipToken: (tokenId: string) => void;
  getWaitingTokens: (department?: Department) => Token[];
  getTokenPosition: (tokenId: string) => number;
  getEstimatedTime: (tokenId: string) => Date | null;
  averageServiceTime: number;
  speakAnnouncement: (text: string) => void;
  isSpeaking: boolean;
}

const QueueContext = createContext<QueueContextType | undefined>(undefined);

const initialCounters: Counter[] = [
  { id: 1, name: 'Counter 1', currentToken: null, isActive: true, department: 'A' },
  { id: 2, name: 'Counter 2', currentToken: null, isActive: true, department: 'B' },
  { id: 3, name: 'Counter 3', currentToken: null, isActive: true, department: 'C' },
  { id: 4, name: 'Counter 4', currentToken: null, isActive: true, department: 'D' },
];

export function QueueProvider({ children }: { children: ReactNode }) {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [counters, setCounters] = useState<Counter[]>(initialCounters);
  const [tokenCounters, setTokenCounters] = useState<Record<Department, number>>({
    A: 0, B: 0, C: 0, D: 0
  });
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speakAnnouncement = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  const generateToken = useCallback((department: Department, customerName: string, phone?: string): Token => {
    const newNumber = tokenCounters[department] + 1;
    const displayNumber = `${department}-${String(newNumber).padStart(3, '0')}`;
    
    const token: Token = {
      id: `${Date.now()}-${department}-${newNumber}`,
      number: newNumber,
      department,
      displayNumber,
      customerName,
      phone,
      status: 'waiting',
      createdAt: new Date(),
    };

    setTokenCounters(prev => ({ ...prev, [department]: newNumber }));
    setTokens(prev => [...prev, token]);
    
    return token;
  }, [tokenCounters]);

  const callNextToken = useCallback((counterId: number): Token | null => {
    const counter = counters.find(c => c.id === counterId);
    if (!counter) return null;

    // Complete current token if exists
    if (counter.currentToken) {
      setTokens(prev => prev.map(t => 
        t.id === counter.currentToken?.id 
          ? { ...t, status: 'completed' as const, completedAt: new Date() }
          : t
      ));
    }

    // Find next waiting token for this counter's department
    const nextToken = tokens.find(t => 
      t.department === counter.department && t.status === 'waiting'
    );

    if (nextToken) {
      const updatedToken = { 
        ...nextToken, 
        status: 'serving' as const, 
        counter: counterId,
        calledAt: new Date() 
      };

      setTokens(prev => prev.map(t => 
        t.id === nextToken.id ? updatedToken : t
      ));

      setCounters(prev => prev.map(c => 
        c.id === counterId ? { ...c, currentToken: updatedToken } : c
      ));

      // Voice announcement
      const dept = DEPARTMENTS.find(d => d.code === nextToken.department);
      speakAnnouncement(
        `Token ${nextToken.displayNumber}, please proceed to ${counter.name}. ${dept?.name || ''}`
      );

      return updatedToken;
    }

    setCounters(prev => prev.map(c => 
      c.id === counterId ? { ...c, currentToken: null } : c
    ));

    return null;
  }, [counters, tokens, speakAnnouncement]);

  const completeToken = useCallback((tokenId: string) => {
    setTokens(prev => prev.map(t => 
      t.id === tokenId 
        ? { ...t, status: 'completed' as const, completedAt: new Date() }
        : t
    ));

    setCounters(prev => prev.map(c => 
      c.currentToken?.id === tokenId ? { ...c, currentToken: null } : c
    ));
  }, []);

  const skipToken = useCallback((tokenId: string) => {
    setTokens(prev => prev.map(t => 
      t.id === tokenId ? { ...t, status: 'skipped' as const } : t
    ));

    setCounters(prev => prev.map(c => 
      c.currentToken?.id === tokenId ? { ...c, currentToken: null } : c
    ));
  }, []);

  const averageServiceTime = 5; // minutes per person

  const getWaitingTokens = useCallback((department?: Department): Token[] => {
    return tokens.filter(t => 
      t.status === 'waiting' && (!department || t.department === department)
    );
  }, [tokens]);

  const getTokenPosition = useCallback((tokenId: string): number => {
    const token = tokens.find(t => t.id === tokenId);
    if (!token) return -1;

    const waitingInDept = tokens.filter(t => 
      t.department === token.department && 
      t.status === 'waiting' &&
      t.createdAt <= token.createdAt
    );

    return waitingInDept.length;
  }, [tokens]);

  const getEstimatedTime = useCallback((tokenId: string): Date | null => {
    const position = getTokenPosition(tokenId);
    if (position <= 0) return null;

    const token = tokens.find(t => t.id === tokenId);
    if (!token) return null;

    // Count currently serving tokens in this department
    const servingCount = tokens.filter(t => 
      t.department === token.department && t.status === 'serving'
    ).length;

    const waitMinutes = Math.max(0, (position - 1) * averageServiceTime);
    const estimatedTime = new Date();
    estimatedTime.setMinutes(estimatedTime.getMinutes() + waitMinutes);

    return estimatedTime;
  }, [tokens, getTokenPosition]);

  return (
    <QueueContext.Provider value={{
      tokens,
      counters,
      generateToken,
      callNextToken,
      completeToken,
      skipToken,
      getWaitingTokens,
      getTokenPosition,
      getEstimatedTime,
      averageServiceTime,
      speakAnnouncement,
      isSpeaking,
    }}>
      {children}
    </QueueContext.Provider>
  );
}

export function useQueue() {
  const context = useContext(QueueContext);
  if (!context) {
    throw new Error('useQueue must be used within a QueueProvider');
  }
  return context;
}
