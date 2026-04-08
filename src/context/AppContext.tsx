import React, { createContext, useContext, useState, useEffect } from 'react';

export type LeaveStatus = 'Pending' | 'Approved' | 'Rejected';
export type LeaveType = 'Medical' | 'Personal' | 'Special';
export type UserRole = 'STUDENT' | 'ADMIN';

export interface LeaveRequest {
  id: number;
  type: LeaveType;
  reason: string;
  startDate: string;
  endDate: string;
  status: LeaveStatus;
  createdAt: string;
  user?: { name: string; email: string };
}

interface User {
  id: number;
  email: string;
  name: string;
  role: UserRole;
}

interface AppContextType {
  user: User | null;
  requests: LeaveRequest[];
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  addRequest: (request: any) => Promise<void>;
  updateRequestStatus: (id: number, status: LeaveStatus) => Promise<void>;
  refreshRequests: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on init
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  // Fetch requests when user changes
  useEffect(() => {
    if (user) {
      refreshRequests();
    } else {
      setRequests([]);
    }
  }, [user]);

  const refreshRequests = async () => {
    try {
      const response = await fetch('/api/requests', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setRequests(data);
    } catch (error) {
      console.error('Failed to fetch requests:', error);
    }
  };

  const login = async (email: string, password: string) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    if (!response.ok) throw new Error('Invalid credentials');
    
    const { token, user: userData } = await response.json();
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const register = async (formData: any) => {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    
    if (!response.ok) throw new Error('Registration failed');
    
    const { token, user: userData } = await response.json();
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const addRequest = async (requestData: any) => {
    const response = await fetch('/api/requests', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(requestData)
    });
    
    if (!response.ok) throw new Error('Failed to create request');
    await refreshRequests();
  };

  const updateRequestStatus = async (id: number, status: LeaveStatus) => {
    const response = await fetch(`/api/requests/${id}`, {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ status })
    });
    
    if (!response.ok) throw new Error('Failed to update status');
    await refreshRequests();
  };

  return (
    <AppContext.Provider value={{ 
      user, requests, isLoading, login, register, logout, 
      addRequest, updateRequestStatus, refreshRequests 
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};
