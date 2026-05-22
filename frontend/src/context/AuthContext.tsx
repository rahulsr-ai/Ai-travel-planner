import React, { createContext, useState, useEffect, useContext } from 'react';
import type { ReactNode } from 'react';
import API from "../api"

interface UserData {
  name: string;
  email: string;
}

interface AuthContextType {
  user: UserData | null;
  loading: boolean;
  signupUser: (name: string, email: string, password: string) => Promise<any>;
  loginUser: (email: string, password: string) => Promise<any>;
  logoutUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // check user is logged in or not in on PAGE REFERSH 
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // Signup Handler
  const signupUser = async (name: string, email: string, password: string): Promise<any> => {
    const res = await API.post('/v1/auth/signup', { name, email, password });
    localStorage.setItem('token', res.data.data.token);
    localStorage.setItem('user', JSON.stringify({ name: res.data.data.name, email: res.data.data.email }));
    setUser({ name: res.data.data.name, email: res.data.data.email });
    return res.data.data
  };

  // Login Handler
  const loginUser = async (email: string, password: string): Promise<any> => {
    const res = await API.post('/v1/auth/login', { email, password });
    localStorage.setItem('token', res.data.data.token);
    localStorage.setItem('user', JSON.stringify({ name: res.data.data.name, email: res.data.data.email }));
    setUser({ name: res.data.data.name, email: res.data.data.email });
    return res.data.data
  };

  // Logout Handler
  const logoutUser = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signupUser, loginUser, logoutUser }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};


export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};